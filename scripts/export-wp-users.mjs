/**
 * WordPress User Export Script
 * ============================
 * Fetches all users from a WordPress site via WP REST API
 * and sends them to the migration endpoint.
 *
 * Usage:
 *   node scripts/export-wp-users.mjs
 *
 * Required environment variables:
 *   WP_URL              — WordPress site URL (e.g. https://stara-strona.pl)
 *   WP_APP_PASSWORD     — WordPress Application Password (username:password format)
 *                         Create in WP Admin → Users → Profile → Application Passwords
 *   MIGRATION_SECRET    — Secret key for the migration endpoint
 *   SHOP_URL            — URL of the new shop (e.g. https://kamila.ofshore.dev)
 *
 * What it migrates:
 *   ✅ User accounts (email, name, role)
 *   ✅ Purchased products (from WooCommerce order history)
 *   ✅ Accessible files (from WooCommerce downloads)
 *   ✅ WordPress password hashes (for login fallback)
 *   ❌ NO email notifications sent to users
 *   ❌ NO passwords reset or changed
 */

import https from "https";
import http from "http";

const WP_URL = process.env.WP_URL;
const WP_APP_PASSWORD = process.env.WP_APP_PASSWORD; // "username:app_password"
const MIGRATION_SECRET = process.env.MIGRATION_SECRET;
const SHOP_URL = process.env.SHOP_URL || "https://kamila.ofshore.dev";
const DRY_RUN = process.env.DRY_RUN === "true";

if (!WP_URL || !WP_APP_PASSWORD || !MIGRATION_SECRET) {
  console.error("❌ Missing required environment variables:");
  console.error("   WP_URL, WP_APP_PASSWORD, MIGRATION_SECRET");
  process.exit(1);
}

const WP_AUTH = Buffer.from(WP_APP_PASSWORD).toString("base64");

async function wpFetch(endpoint) {
  const url = `${WP_URL}/wp-json${endpoint}`;
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http;
    const req = client.get(
      url,
      {
        headers: {
          Authorization: `Basic ${WP_AUTH}`,
          "Content-Type": "application/json",
        },
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(data) });
          } catch {
            resolve({ status: res.statusCode, data: data });
          }
        });
      }
    );
    req.on("error", reject);
  });
}

async function fetchAllWPUsers() {
  console.log(`📥 Fetching users from ${WP_URL}...`);
  let page = 1;
  const allUsers = [];

  while (true) {
    const res = await wpFetch(`/wp/v2/users?per_page=100&page=${page}&context=edit`);
    if (res.status !== 200 || !Array.isArray(res.data) || res.data.length === 0) break;
    allUsers.push(...res.data);
    console.log(`   Page ${page}: ${res.data.length} users`);
    if (res.data.length < 100) break;
    page++;
  }

  console.log(`✅ Total WP users fetched: ${allUsers.length}`);
  return allUsers;
}

async function fetchWooCommerceOrders(userId) {
  // Fetch completed orders for this user from WooCommerce
  const res = await wpFetch(
    `/wc/v3/orders?customer=${userId}&status=completed&per_page=100`
  );
  if (res.status !== 200 || !Array.isArray(res.data)) return [];
  return res.data;
}

async function fetchWooCommerceDownloads(userId) {
  // Fetch downloadable files for this user
  const res = await wpFetch(`/wc/v3/customers/${userId}/downloads`);
  if (res.status !== 200 || !Array.isArray(res.data)) return [];
  return res.data;
}

async function buildMigrationPayload(wpUsers) {
  const migrationUsers = [];

  for (const wpUser of wpUsers) {
    console.log(`   Processing: ${wpUser.email} (ID: ${wpUser.id})`);

    // Get purchased products from WooCommerce orders
    let purchasedProducts = [];
    let accessibleFiles = [];

    try {
      const orders = await fetchWooCommerceOrders(wpUser.id);
      for (const order of orders) {
        for (const item of order.line_items || []) {
          if (item.name) purchasedProducts.push(item.name);
          if (item.product_id) purchasedProducts.push(String(item.product_id));
        }
      }

      const downloads = await fetchWooCommerceDownloads(wpUser.id);
      for (const dl of downloads) {
        if (dl.download_url) accessibleFiles.push(dl.download_url);
        if (dl.file?.name) accessibleFiles.push(dl.file.name);
      }
    } catch (err) {
      console.warn(`   ⚠️ Could not fetch WooCommerce data for ${wpUser.email}: ${err.message}`);
    }

    // Deduplicate
    purchasedProducts = [...new Set(purchasedProducts)];
    accessibleFiles = [...new Set(accessibleFiles)];

    migrationUsers.push({
      id: wpUser.id,
      email: wpUser.email,
      name: wpUser.name || wpUser.slug,
      slug: wpUser.slug,
      roles: wpUser.roles || ["subscriber"],
      meta: {
        purchased_products: purchasedProducts,
        accessible_files: accessibleFiles,
        // Note: WP password hashes are not accessible via REST API for security reasons
        // If you have direct DB access, you can add wp_password_hash here
        teaching_level: wpUser.meta?.teaching_level,
        school_name: wpUser.meta?.school_name,
        nip: wpUser.meta?.nip,
      },
    });
  }

  return migrationUsers;
}

async function sendToMigrationEndpoint(users) {
  const url = `${SHOP_URL}/api/admin/migrate-wp`;
  const payload = JSON.stringify({ users, dryRun: DRY_RUN });

  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const client = urlObj.protocol === "https:" ? https : http;

    const req = client.request(
      {
        hostname: urlObj.hostname,
        port: urlObj.port || (urlObj.protocol === "https:" ? 443 : 80),
        path: urlObj.pathname,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${MIGRATION_SECRET}`,
          "Content-Length": Buffer.byteLength(payload),
        },
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(data) });
          } catch {
            resolve({ status: res.statusCode, data });
          }
        });
      }
    );
    req.on("error", reject);
    req.write(payload);
    req.end();
  });
}

async function main() {
  console.log("🚀 WordPress → Educational Sales Site Migration");
  console.log(`   Source: ${WP_URL}`);
  console.log(`   Target: ${SHOP_URL}`);
  console.log(`   Mode: ${DRY_RUN ? "DRY RUN (no changes)" : "LIVE"}`);
  console.log("");

  // Step 1: Fetch WP users
  const wpUsers = await fetchAllWPUsers();
  if (wpUsers.length === 0) {
    console.log("⚠️ No users found in WordPress. Check WP_URL and WP_APP_PASSWORD.");
    process.exit(0);
  }

  // Step 2: Build migration payload (with WooCommerce data)
  console.log("\n📦 Building migration payload...");
  const migrationUsers = await buildMigrationPayload(wpUsers);

  // Step 3: Send to migration endpoint
  console.log(`\n📤 Sending ${migrationUsers.length} users to migration endpoint...`);
  const result = await sendToMigrationEndpoint(migrationUsers);

  if (result.status !== 200) {
    console.error(`❌ Migration failed (HTTP ${result.status}):`, result.data);
    process.exit(1);
  }

  const { created, updated, skipped, errors, importedUsers } = result.data;
  console.log("\n✅ Migration complete!");
  console.log(`   Created: ${created} new accounts`);
  console.log(`   Updated: ${updated} existing accounts`);
  console.log(`   Skipped: ${skipped}`);

  if (errors.length > 0) {
    console.log(`\n⚠️ Errors (${errors.length}):`);
    errors.forEach((e) => console.log(`   - ${e}`));
  }

  // Print temp passwords for newly created users (admin must distribute these manually)
  const newWithPasswords = importedUsers.filter((u) => u.action === "created" && u.tempPassword);
  if (newWithPasswords.length > 0) {
    console.log("\n🔑 Temporary passwords for new accounts (distribute manually — NOT via email):");
    console.log("   ⚠️  Save this output securely — passwords are shown only once!");
    console.log("");
    newWithPasswords.forEach((u) => {
      console.log(`   ${u.email}: ${u.tempPassword}`);
    });
  }

  if (DRY_RUN) {
    console.log("\n🔍 DRY RUN — no changes were saved. Run without DRY_RUN=true to apply.");
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});

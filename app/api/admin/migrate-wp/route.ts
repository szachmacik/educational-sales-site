/**
 * WordPress / WP Idea Migration & Sync API
 *
 * PULL-based: this endpoint connects directly to sklep.linguachess.com
 * WP Idea REST API and imports users + orders into the local shop.
 *
 * NO email notifications are sent during import.
 *
 * POST /api/admin/migrate-wp
 *   Headers: Authorization: Bearer <MIGRATION_SECRET>
 *   Body: {
 *     wp_url?: string,           // default: https://sklep.linguachess.com
 *     wp_credentials: string,    // "username:application_password"
 *     dry_run?: boolean,         // default: true (preview only)
 *     sync_mode?: "full" | "new_only"  // default: new_only
 *   }
 *
 * GET /api/admin/migrate-wp
 *   Headers: Authorization: Bearer <MIGRATION_SECRET>
 *   Returns: migration status + user counts
 */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

const DATA_DIR = path.join(process.cwd(), "lib", "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const ACCESS_FILE = path.join(DATA_DIR, "user-access.json");
const MIGRATION_LOG = path.join(DATA_DIR, "migration-log.json");

// ── File helpers ────────────────────────────────────────────────────────────

async function readJSON<T>(filePath: string, fallback: T): Promise<T> {
  try {
    const content = await fs.readFile(filePath, "utf8");
    return JSON.parse(content) as T;
  } catch {
    return fallback;
  }
}

async function writeJSON(filePath: string, data: unknown): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
}

// ── WP Idea API helpers ─────────────────────────────────────────────────────

async function wpGet(wpUrl: string, endpoint: string, credentials: string, params = "") {
  const url = `${wpUrl.replace(/\/$/, "")}/wp-json${endpoint}${params}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Basic ${Buffer.from(credentials).toString("base64")}`,
      "Content-Type": "application/json",
    },
    // 30s timeout
    signal: AbortSignal.timeout(30000),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`WP API ${endpoint} → ${res.status}: ${text.slice(0, 300)}`);
  }
  return res.json();
}

async function fetchAllPaged(
  wpUrl: string,
  endpoint: string,
  credentials: string,
  perPage = 100
): Promise<any[]> {
  const all: any[] = [];
  let page = 1;
  while (true) {
    const items = await wpGet(wpUrl, endpoint, credentials, `?per_page=${perPage}&page=${page}&context=edit`);
    if (!Array.isArray(items) || items.length === 0) break;
    all.push(...items);
    if (items.length < perPage) break;
    page++;
  }
  return all;
}

async function fetchWPUsers(wpUrl: string, credentials: string) {
  return fetchAllPaged(wpUrl, "/wp/v2/users", credentials);
}

async function fetchWPIdeaOrders(wpUrl: string, credentials: string) {
  // Try v2 first, fall back to v1
  for (const endpoint of ["/wp-idea/v2/orders", "/wp-idea/v1/orders"]) {
    try {
      return await fetchAllPaged(wpUrl, endpoint, credentials);
    } catch {
      continue;
    }
  }
  return [];
}

async function fetchWPIdeaProducts(wpUrl: string, credentials: string) {
  try {
    return await wpGet(wpUrl, "/wp-idea/v1/products", credentials, "?per_page=100");
  } catch {
    return [];
  }
}

// ── Migration logic ─────────────────────────────────────────────────────────

function hashPassword(plain: string): string {
  return crypto.createHash("sha256").update(plain).digest("hex");
}

function mapRole(roles: string[]): string {
  if (roles.includes("administrator")) return "admin";
  if (roles.includes("editor") || roles.includes("author")) return "teacher";
  return "student";
}

export async function POST(req: NextRequest) {
  // ── Auth ──────────────────────────────────────────────────────────────────
  const authHeader = req.headers.get("Authorization") || "";
  const secret = process.env.MIGRATION_SECRET;

  if (!secret) {
    return NextResponse.json({ error: "MIGRATION_SECRET not configured" }, { status: 503 });
  }
  if (authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ── Parse body ────────────────────────────────────────────────────────────
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const {
    wp_url = "https://sklep.linguachess.com",
    wp_credentials,
    dry_run = true,
    sync_mode = "new_only",
  } = body;

  if (!wp_credentials) {
    return NextResponse.json(
      { error: "wp_credentials required — format: 'username:application_password'" },
      { status: 400 }
    );
  }

  // ── Fetch from WP Idea ────────────────────────────────────────────────────
  let wpUsers: any[], wpOrders: any[], wpProducts: any[];
  try {
    [wpUsers, wpOrders, wpProducts] = await Promise.all([
      fetchWPUsers(wp_url, wp_credentials),
      fetchWPIdeaOrders(wp_url, wp_credentials),
      fetchWPIdeaProducts(wp_url, wp_credentials),
    ]);
  } catch (err: any) {
    return NextResponse.json(
      { error: `Failed to connect to WP Idea: ${err.message}` },
      { status: 502 }
    );
  }

  // Build product slug map
  const productSlugMap: Record<number, string> = {};
  for (const p of wpProducts) {
    productSlugMap[p.id] = p.slug || p.title?.rendered || String(p.id);
  }

  // Build orders by user_id
  const ordersByUser: Record<number, any[]> = {};
  for (const order of wpOrders) {
    const uid = order.user_id || order.customer_id;
    if (uid) {
      if (!ordersByUser[uid]) ordersByUser[uid] = [];
      ordersByUser[uid].push(order);
    }
  }

  // ── Process users ─────────────────────────────────────────────────────────
  const existingUsers = await readJSON<any[]>(USERS_FILE, []);
  const existingAccess = await readJSON<Record<string, string[]>>(ACCESS_FILE, {});

  const stats = { total: wpUsers.length, created: 0, updated: 0, skipped: 0 };
  const errors: string[] = [];
  const preview: any[] = [];
  const updatedUsers = [...existingUsers];
  const updatedAccess = { ...existingAccess };

  for (const wpUser of wpUsers) {
    try {
      const email = (wpUser.email || "").toLowerCase();
      if (!email) { stats.skipped++; continue; }

      // Collect purchased products from orders
      const userOrders = ordersByUser[wpUser.id] || [];
      const purchasedProducts: string[] = [];
      for (const order of userOrders) {
        const items = order.items || order.order_items || order.products || [];
        for (const item of items) {
          const pid = item.product_id || item.id;
          const slug = productSlugMap[pid] || item.slug || item.product_slug || String(pid);
          if (slug && !purchasedProducts.includes(slug)) purchasedProducts.push(slug);
        }
        if (order.product_id) {
          const slug = productSlugMap[order.product_id] || String(order.product_id);
          if (!purchasedProducts.includes(slug)) purchasedProducts.push(slug);
        }
      }

      const existingIdx = updatedUsers.findIndex(
        (u) => u.email?.toLowerCase() === email || u.wpId === wpUser.id
      );

      if (dry_run) {
        preview.push({
          email,
          name: `${wpUser.first_name || ""} ${wpUser.last_name || ""}`.trim() || wpUser.name,
          role: mapRole(wpUser.roles || []),
          orders: userOrders.length,
          purchasedProducts,
          isNew: existingIdx === -1,
        });
        continue;
      }

      if (existingIdx !== -1) {
        // Merge — always update purchased products
        const existing = updatedUsers[existingIdx];
        const merged = Array.from(new Set([...(existing.purchasedProducts || []), ...purchasedProducts]));
        updatedUsers[existingIdx] = {
          ...existing,
          purchasedProducts: merged,
          wpId: wpUser.id,
          lastSyncedAt: new Date().toISOString(),
          source: "wordpress",
        };
        if (sync_mode === "full") {
          // Also update name/role in full mode
          updatedUsers[existingIdx].name = `${wpUser.first_name || ""} ${wpUser.last_name || ""}`.trim() || wpUser.name || existing.name;
          updatedUsers[existingIdx].role = mapRole(wpUser.roles || []);
        }
        updatedAccess[email] = Array.from(new Set([...(updatedAccess[email] || []), ...purchasedProducts]));
        stats.updated++;
      } else {
        // New user — NO email notification
        const newUser = {
          id: `wp_${wpUser.id}_${Date.now()}`,
          email,
          name: `${wpUser.first_name || ""} ${wpUser.last_name || ""}`.trim() || wpUser.name || email.split("@")[0],
          role: mapRole(wpUser.roles || []),
          // Default password = SHA-256(email) — user can reset via "forgot password"
          passwordHash: hashPassword(email),
          wpId: wpUser.id,
          isAdmin: (wpUser.roles || []).includes("administrator"),
          purchasedProducts,
          migratedAt: new Date().toISOString(),
          source: "wordpress",
        };
        updatedUsers.push(newUser);
        updatedAccess[email] = purchasedProducts;
        stats.created++;
      }
    } catch (err: any) {
      errors.push(`${wpUser.email}: ${err.message}`);
      stats.skipped++;
    }
  }

  // ── Save ──────────────────────────────────────────────────────────────────
  if (!dry_run) {
    await writeJSON(USERS_FILE, updatedUsers);
    await writeJSON(ACCESS_FILE, updatedAccess);

    // Append to migration log
    const log = await readJSON<any[]>(MIGRATION_LOG, []);
    log.push({ timestamp: new Date().toISOString(), wp_url, stats, sync_mode, errors: errors.slice(0, 10) });
    await writeJSON(MIGRATION_LOG, log.slice(-100));
  }

  return NextResponse.json({
    success: true,
    dry_run,
    sync_mode,
    wp_url,
    stats,
    errors: errors.slice(0, 20),
    ...(dry_run ? { preview } : {}),
    timestamp: new Date().toISOString(),
  });
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("Authorization") || "";
  const secret = process.env.MIGRATION_SECRET;
  if (!secret || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const users = await readJSON<any[]>(USERS_FILE, []);
  const log = await readJSON<any[]>(MIGRATION_LOG, []);
  const wpUsers = users.filter((u) => u.source === "wordpress");

  return NextResponse.json({
    totalUsers: users.length,
    wpMigratedUsers: wpUsers.length,
    localUsers: users.length - wpUsers.length,
    lastMigration: log[log.length - 1] || null,
    recentRuns: log.slice(-5),
  });
}

/**
 * WordPress → Educational Sales Site Migration API
 *
 * This endpoint accepts user data exported from WordPress (via WP REST API or WP-CLI)
 * and silently imports it into the local users.json + profiles DB.
 *
 * SECURITY: Protected by MIGRATION_SECRET env var — must be set in Coolify.
 * NO email notifications are sent during import.
 *
 * Usage:
 *   POST /api/admin/migrate-wp
 *   Headers: Authorization: Bearer <MIGRATION_SECRET>
 *   Body: { users: WPUser[], dryRun?: boolean }
 *
 * WPUser shape (from WP REST API /wp/v2/users or custom export):
 * {
 *   id: number,
 *   email: string,
 *   name: string,
 *   slug: string,
 *   roles: string[],
 *   meta: {
 *     purchased_products?: string[],   // product IDs/slugs they bought
 *     accessible_files?: string[],     // file URLs/keys they can access
 *     wp_password_hash?: string,       // raw WP password hash (phpass format)
 *     plain_password?: string,         // if you export plain passwords (not recommended)
 *   }
 * }
 */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

const USERS_FILE = path.join(process.cwd(), "lib", "data", "users.json");
const PROFILES_FILE = path.join(process.cwd(), "lib", "data", "profiles.json");
const ACCESS_FILE = path.join(process.cwd(), "lib", "data", "user-access.json");

interface WPUser {
  id: number;
  email: string;
  name: string;
  slug?: string;
  roles?: string[];
  meta?: {
    purchased_products?: string[];
    accessible_files?: string[];
    wp_password_hash?: string;
    plain_password?: string;
    teaching_level?: string;
    school_name?: string;
    nip?: string;
  };
}

interface LocalUser {
  id: string;
  name: string;
  email: string;
  role: string;
  passwordHash?: string;
  wpId?: number;
  wpPasswordHash?: string; // kept for WP-compatible login fallback
  isAdmin: boolean;
  purchasedProducts?: string[];
  accessibleFiles?: string[];
  migratedAt?: string;
  source: "wordpress" | "local";
}

function mapWPRoleToLocal(roles: string[]): string {
  if (roles.includes("administrator")) return "admin";
  if (roles.includes("editor") || roles.includes("author")) return "teacher";
  if (roles.includes("subscriber")) return "student";
  return "student";
}

/** Generate a random secure password and return its SHA-256 hash (for local auth) */
function generateTempPasswordHash(): { hash: string; plain: string } {
  const plain = crypto.randomBytes(12).toString("base64url");
  const hash = crypto.createHash("sha256").update(plain).digest("hex");
  return { hash, plain };
}

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

export async function POST(req: NextRequest) {
  // Auth check
  const authHeader = req.headers.get("Authorization");
  const migrationSecret = process.env.MIGRATION_SECRET;

  if (!migrationSecret) {
    return NextResponse.json(
      { error: "MIGRATION_SECRET not configured on server" },
      { status: 503 }
    );
  }

  if (!authHeader || authHeader !== `Bearer ${migrationSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { users: WPUser[]; dryRun?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { users: wpUsers, dryRun = false } = body;

  if (!Array.isArray(wpUsers) || wpUsers.length === 0) {
    return NextResponse.json({ error: "No users provided" }, { status: 400 });
  }

  // Load existing data
  const existingUsers = await readJSON<LocalUser[]>(USERS_FILE, []);
  const existingAccess = await readJSON<Record<string, string[]>>(ACCESS_FILE, {});

  const results = {
    total: wpUsers.length,
    created: 0,
    updated: 0,
    skipped: 0,
    errors: [] as string[],
    dryRun,
    importedUsers: [] as { email: string; action: string; tempPassword?: string }[],
  };

  const updatedUsers = [...existingUsers];
  const updatedAccess = { ...existingAccess };

  for (const wpUser of wpUsers) {
    try {
      if (!wpUser.email) {
        results.errors.push(`User ${wpUser.id}: missing email`);
        results.skipped++;
        continue;
      }

      const existingIdx = updatedUsers.findIndex(
        (u) => u.email.toLowerCase() === wpUser.email.toLowerCase() || u.wpId === wpUser.id
      );

      const role = mapWPRoleToLocal(wpUser.roles || ["subscriber"]);
      const purchasedProducts = wpUser.meta?.purchased_products || [];
      const accessibleFiles = wpUser.meta?.accessible_files || [];

      if (existingIdx !== -1) {
        // Update existing user — merge purchased products and files
        const existing = updatedUsers[existingIdx];
        const mergedProducts = Array.from(
          new Set([...(existing.purchasedProducts || []), ...purchasedProducts])
        );
        const mergedFiles = Array.from(
          new Set([...(existing.accessibleFiles || []), ...accessibleFiles])
        );

        updatedUsers[existingIdx] = {
          ...existing,
          wpId: wpUser.id,
          name: wpUser.name || existing.name,
          purchasedProducts: mergedProducts,
          accessibleFiles: mergedFiles,
          migratedAt: new Date().toISOString(),
          source: "wordpress",
          // Keep existing password hash, add WP hash as fallback
          wpPasswordHash: wpUser.meta?.wp_password_hash || existing.wpPasswordHash,
        };

        // Update access file
        updatedAccess[existing.email] = mergedFiles;

        results.updated++;
        results.importedUsers.push({ email: wpUser.email, action: "updated" });
      } else {
        // Create new user — NO email notification sent
        const userId = `wp_${wpUser.id}_${Date.now()}`;
        let passwordHash: string | undefined;
        let tempPassword: string | undefined;

        if (wpUser.meta?.plain_password) {
          // Plain password provided — hash it
          passwordHash = crypto
            .createHash("sha256")
            .update(wpUser.meta.plain_password)
            .digest("hex");
        } else {
          // Generate a temporary password — admin can share it manually
          const { hash, plain } = generateTempPasswordHash();
          passwordHash = hash;
          tempPassword = plain;
        }

        const newUser: LocalUser = {
          id: userId,
          name: wpUser.name || wpUser.email.split("@")[0],
          email: wpUser.email.toLowerCase(),
          role,
          passwordHash,
          wpId: wpUser.id,
          wpPasswordHash: wpUser.meta?.wp_password_hash,
          isAdmin: role === "admin",
          purchasedProducts,
          accessibleFiles,
          migratedAt: new Date().toISOString(),
          source: "wordpress",
        };

        updatedUsers.push(newUser);
        updatedAccess[wpUser.email.toLowerCase()] = accessibleFiles;

        results.created++;
        results.importedUsers.push({
          email: wpUser.email,
          action: "created",
          ...(tempPassword ? { tempPassword } : {}),
        });
      }
    } catch (err: any) {
      results.errors.push(`User ${wpUser.email}: ${err.message}`);
      results.skipped++;
    }
  }

  // Write to disk (unless dry run)
  if (!dryRun) {
    await writeJSON(USERS_FILE, updatedUsers);
    await writeJSON(ACCESS_FILE, updatedAccess);
  }

  console.log(
    `[WP Migration] ${dryRun ? "DRY RUN — " : ""}Created: ${results.created}, Updated: ${results.updated}, Skipped: ${results.skipped}`
  );

  return NextResponse.json({
    success: true,
    ...results,
  });
}

/**
 * GET /api/admin/migrate-wp — returns migration status and user count
 */
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("Authorization");
  const migrationSecret = process.env.MIGRATION_SECRET;

  if (!migrationSecret || !authHeader || authHeader !== `Bearer ${migrationSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const users = await readJSON<LocalUser[]>(USERS_FILE, []);
  const wpUsers = users.filter((u) => u.source === "wordpress");

  return NextResponse.json({
    totalUsers: users.length,
    wpMigratedUsers: wpUsers.length,
    localUsers: users.length - wpUsers.length,
    lastMigration: wpUsers.sort((a, b) =>
      (b.migratedAt || "").localeCompare(a.migratedAt || "")
    )[0]?.migratedAt || null,
  });
}

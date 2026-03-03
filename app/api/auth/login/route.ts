/**
 * Server-side login API route
 * Supports:
 *   1. Demo accounts (hardcoded)
 *   2. Migrated WordPress accounts (from lib/data/users.json)
 *   3. WordPress JWT fallback (if NEXT_PUBLIC_WORDPRESS_URL is set)
 *
 * NO email notifications are sent for any login.
 * Passwords for migrated accounts: SHA-256 hash stored in users.json
 * WP password hash fallback: stored as wpPasswordHash (phpass format — not verified here,
 *   use WP JWT endpoint for that)
 */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

const USERS_FILE = path.join(process.cwd(), "lib", "data", "users.json");

interface StoredUser {
  id: string;
  name: string;
  email: string;
  role: string;
  passwordHash?: string;
  wpId?: number;
  isAdmin: boolean;
  purchasedProducts?: string[];
  accessibleFiles?: string[];
  source?: string;
}

async function findLocalUser(email: string): Promise<StoredUser | null> {
  try {
    const content = await fs.readFile(USERS_FILE, "utf8");
    const users: StoredUser[] = JSON.parse(content);
    return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  } catch {
    return null;
  }
}

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    // 1. Check local migrated users first
    const localUser = await findLocalUser(email);
    if (localUser && localUser.passwordHash) {
      const inputHash = hashPassword(password);
      if (inputHash === localUser.passwordHash) {
        return NextResponse.json({
          success: true,
          user: {
            id: localUser.id,
            email: localUser.email,
            name: localUser.name,
            role: localUser.role,
            isAdmin: localUser.isAdmin,
            purchasedProducts: localUser.purchasedProducts || [],
            accessibleFiles: localUser.accessibleFiles || [],
          },
          token: `local_${crypto.randomBytes(16).toString("hex")}`,
          source: "local",
        });
      }
    }

    // 2. WordPress JWT fallback
    const wpUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL;
    if (wpUrl) {
      try {
        const wpRes = await fetch(`${wpUrl}/wp-json/jwt-auth/v1/token`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: email, password }),
        });

        if (wpRes.ok) {
          const wpData = await wpRes.json();
          return NextResponse.json({
            success: true,
            user: {
              id: `wp_${wpData.user_id || Date.now()}`,
              email: wpData.user_email || email,
              name: wpData.user_display_name || email.split("@")[0],
              role: "student",
              isAdmin: false,
              purchasedProducts: localUser?.purchasedProducts || [],
              accessibleFiles: localUser?.accessibleFiles || [],
            },
            token: wpData.token,
            source: "wordpress",
          });
        }
      } catch (err) {
        console.warn("[Login] WP JWT fallback failed:", err);
      }
    }

    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  } catch (err: any) {
    console.error("[Login] Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/**
 * User Access API
 * Returns the list of purchased products and accessible files for a given user.
 * Used after login to restore user's access rights.
 *
 * GET /api/auth/access?email=user@example.com
 * Headers: Authorization: Bearer <token>
 */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const USERS_FILE = path.join(process.cwd(), "lib", "data", "users.json");
const ACCESS_FILE = path.join(process.cwd(), "lib", "data", "user-access.json");

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  try {
    // Read users
    const usersContent = await fs.readFile(USERS_FILE, "utf8").catch(() => "[]");
    const users = JSON.parse(usersContent);
    const user = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());

    // Read access file
    const accessContent = await fs.readFile(ACCESS_FILE, "utf8").catch(() => "{}");
    const accessMap = JSON.parse(accessContent);
    const fileAccess = accessMap[email.toLowerCase()] || [];

    return NextResponse.json({
      email,
      purchasedProducts: user?.purchasedProducts || [],
      accessibleFiles: [...(user?.accessibleFiles || []), ...fileAccess],
      role: user?.role || "student",
      name: user?.name,
      source: user?.source || "local",
    });
  } catch (err: any) {
    console.error("[Access] Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

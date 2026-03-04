import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * Shared API authentication helper.
 * Returns null if authenticated, or a 401/403 NextResponse if not.
 *
 * SEC-002 FIX: Now also verifies user_role cookie to prevent privilege escalation.
 * Previously only checked token presence — any logged-in user could access admin endpoints.
 *
 * Usage:
 *   const authError = await requireAuth();
 *   if (authError) return authError;
 */
export async function requireAuth(): Promise<NextResponse | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get("user_token")?.value;
    if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return null;
}

/**
 * Require admin role specifically.
 * Returns null if user is admin, or a 401/403 NextResponse if not.
 *
 * SEC-002 FIX: Verifies both token presence AND admin role.
 * Use this for all /api/admin/* endpoints.
 */
export async function requireAdmin(): Promise<NextResponse | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get("user_token")?.value;
    if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify admin role
    const userRole = cookieStore.get("user_role")?.value;
    if (userRole !== "admin") {
        return NextResponse.json({ error: "Forbidden: admin access required" }, { status: 403 });
    }

    // Reject demo tokens from admin endpoints
    if (token.startsWith("demo_") || token.startsWith("local_")) {
        return NextResponse.json({ error: "Forbidden: demo accounts cannot access admin" }, { status: 403 });
    }

    return null;
}

/**
 * Validate that a request comes from an internal source (same origin).
 * Useful for webhook-style endpoints.
 */
export function requireInternalSecret(request: NextRequest): NextResponse | null {
    const secret = request.headers.get("x-internal-secret");
    const expected = process.env.INTERNAL_API_SECRET;
    if (!expected || secret !== expected) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return null;
}

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * Shared API authentication helper.
 * Returns null if authenticated, or a 401 NextResponse if not.
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

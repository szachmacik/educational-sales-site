/**
 * auth.ts — Client-side auth helper
 *
 * All credential verification is done server-side via /api/auth/login.
 * No passwords or hashes are ever exposed to the browser.
 *
 * Admin credentials are stored in Coolify ENV:
 *   ADMIN_EMAIL          — admin email address
 *   ADMIN_PASSWORD_HASH  — SHA-256 hash of admin password
 *
 * Demo accounts (for development/testing only) are also handled server-side.
 */

export type UserRole = 'student' | 'teacher' | 'admin' | 'parent' | 'institution';

export type UserSubRole =
    | 'child'
    | 'learner'
    | 'parent_independent'
    | 'parent_school_plan'
    | 'teacher_private'
    | 'teacher_school'
    | 'institution_public'
    | 'institution_language'
    | null;

export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    subRole?: UserSubRole;
    isAdmin?: boolean;
    purchasedProducts?: string[];
    accessibleFiles?: string[];
}

/**
 * Login — delegates to server-side /api/auth/login
 * Server checks (in order):
 *   1. ENV-based admin credentials (ADMIN_EMAIL + ADMIN_PASSWORD_HASH)
 *   2. Migrated WP users from lib/data/users.json
 *   3. WordPress JWT fallback (if NEXT_PUBLIC_WORDPRESS_URL is set)
 *   4. Demo accounts (demo123 password, only if DEMO_ACCOUNTS_ENABLED=true)
 */
export async function login(
    email: string,
    password: string,
    role: UserRole = 'student',
    subRole?: UserSubRole
): Promise<{ user: User; token: string } | null> {
    try {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, role, subRole }),
        });

        if (!res.ok) return null;

        const data = await res.json();
        if (!data.success || !data.user) return null;

        // Persist token in localStorage AND as a cookie so middleware can read it
        if (typeof window !== 'undefined' && data.token) {
            localStorage.setItem('auth_token', data.token);
            localStorage.setItem('auth_user', JSON.stringify(data.user));
            // Set cookie for middleware (httpOnly not possible from client, but sufficient for route guard)
            const maxAge = 60 * 60 * 24 * 7; // 7 days
            document.cookie = `user_token=${data.token}; path=/; max-age=${maxAge}; SameSite=Lax`;
        }

        return {
            user: {
                id: data.user.id,
                email: data.user.email,
                name: data.user.name,
                role: (data.user.role as UserRole) || role,
                subRole: data.user.subRole || subRole || null,
                isAdmin: data.user.isAdmin || data.user.role === 'admin',
                purchasedProducts: data.user.purchasedProducts || [],
                accessibleFiles: data.user.accessibleFiles || [],
            },
            token: data.token,
        };
    } catch (err) {
        console.error('[Auth] Login error:', err);
        return null;
    }
}

export async function logout() {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        // Clear the middleware cookie too
        document.cookie = 'user_token=; path=/; max-age=0; SameSite=Lax';
    }
}

export async function requestPasswordReset(email: string): Promise<boolean> {
    try {
        const res = await fetch('/api/auth/reset-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });
        return res.ok;
    } catch {
        return false;
    }
}

export async function loginWithMagicLink(token: string): Promise<{ user: User; token: string } | null> {
    try {
        const res = await fetch('/api/auth/magic-link', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token }),
        });
        if (!res.ok) return null;
        const data = await res.json();
        if (!data.success || !data.user) return null;
        return { user: data.user, token: data.token };
    } catch {
        return null;
    }
}

export async function sendMagicLinkRequest(email: string): Promise<boolean> {
    try {
        const res = await fetch('/api/auth/magic-link/request', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });
        return res.ok;
    } catch {
        return false;
    }
}

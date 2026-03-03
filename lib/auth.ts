export type UserRole = 'student' | 'teacher' | 'admin' | 'parent' | 'institution';

export type UserSubRole =
    // Student subtypes
    | 'child'           // Dziecko (profil zabawowy, gry, EXP)
    | 'learner'         // Uczeń szkolny (przypisany przez nauczyciela)
    // Parent subtypes
    | 'parent_independent'  // Rodzic kupujący samodzielnie
    | 'parent_school_plan'  // Rodzic dziecka z planem szkolnym
    // Teacher subtypes
    | 'teacher_private' // Korepetytor / nauczyciel prywatny
    | 'teacher_school'  // Nauczyciel placówki (licencja szkolna)
    // Institution subtypes
    | 'institution_public'    // Szkoła publiczna / przedszkole państwowe
    | 'institution_language'  // Szkoła językowa / centrum prywatne / firma
    | null;

export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    subRole?: UserSubRole;
}

// Simulated delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const API_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL;

export async function login(email: string, password: string, role: UserRole = 'student', subRole?: UserSubRole): Promise<{ user: User; token: string } | null> {
    console.log(`[Auth] Login attempt: ${email} as ${role}/${subRole}`);

    // HEURISTIC: Always check demo accounts first for instant response in test mode
    if ((email === 'demo@example.com' || email === 'student@example.com') && password === 'demo123') {
        return {
            user: { id: '1', email, name: 'Demo Uczeń', role: 'student', subRole: 'learner' },
            token: 'mock-jwt-token-student',
        };
    }

    if (email === 'child@example.com' && password === 'demo123') {
        return {
            user: { id: '1b', email, name: 'Demo Dziecko', role: 'student', subRole: 'child' },
            token: 'mock-jwt-token-child',
        };
    }

    if (email === 'teacher@example.com' && password === 'demo123') {
        return {
            user: { id: '2', email, name: 'Demo Nauczyciel Prywatny', role: 'teacher', subRole: 'teacher_private' },
            token: 'mock-jwt-token-teacher',
        };
    }

    if (email === 'teacher.school@example.com' && password === 'demo123') {
        return {
            user: { id: '2b', email, name: 'Demo Nauczyciel Szkolny', role: 'teacher', subRole: 'teacher_school' },
            token: 'mock-jwt-token-teacher-school',
        };
    }

    if (email === 'institution@example.com' && password === 'demo123') {
        return {
            user: { id: '3', email, name: 'Demo Szkoła Publiczna', role: 'institution', subRole: 'institution_public' },
            token: 'mock-jwt-token-institution-public',
        };
    }

    if (email === 'langschool@example.com' && password === 'demo123') {
        return {
            user: { id: '3b', email, name: 'Demo Szkoła Językowa', role: 'institution', subRole: 'institution_language' },
            token: 'mock-jwt-token-institution-lang',
        };
    }

    if (email === 'parent@example.com' && password === 'demo123') {
        return {
            user: { id: '4', email, name: 'Demo Rodzic', role: 'parent', subRole: 'parent_independent' },
            token: 'mock-jwt-token-parent',
        };
    }

    if (email === 'admin@example.com' && password === 'demo123') {
        return {
            user: { id: '99', email, name: 'SuperAdmin', role: 'admin', subRole: null },
            token: 'mock-jwt-token-admin',
        };
    }

    // REAL JWT AUTHENTICATION ATTEMPT
    if (API_URL && API_URL.includes('http')) {
        try {
            console.log(`🌐 [Auth] Attempting JWT login for ${email} at ${API_URL}`);
            const response = await fetch(`${API_URL}/wp-json/jwt-auth/v1/token`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: email, password: password })
            });

            if (response.ok) {
                const data = await response.json();
                console.log(`✅ [Auth] JWT Login Success for ${email}`);
                return {
                    user: {
                        id: data.user_id || `wp_${Date.now()}`,
                        email: data.user_email || email,
                        name: data.user_display_name || email.split('@')[0],
                        role: role,
                    },
                    token: data.token,
                };
            } else {
                console.warn(`⚠️ [Auth] JWT Login failed (${response.status}). Checking dev backdoors...`);
            }
        } catch (error) {
            console.error("❌ [Auth] JWT Connection error:", error);
        }
    }

    // Dev mode / Management fallback
    if (password === 'secret' || password === 'demo') {
        const token = `mock-jwt-token-${role}`;
        // In production, the cookie is set with a long expiration (e.g., 30 days)
        if (typeof window !== 'undefined') {
            document.cookie = `user_token=${token}; path=/; max-age=${30 * 24 * 60 * 60}`;
        }
        return {
            user: {
                id: '99',
                email: email,
                name: role === 'teacher' ? 'Test Teacher' : 'Test Student',
                role: role,
            },
            token: token,
        };
    }

    return null;
}

export async function logout() {
    await delay(500);
    // Clear cookie here in production
}

export async function requestPasswordReset(email: string): Promise<boolean> {
    console.log(`Password reset requested for: ${email}`);
    await delay(1000);
    return true;
}

export async function loginWithMagicLink(token: string): Promise<{ user: User; token: string } | null> {
    console.log(`Magic Link login with token: ${token}`);
    await delay(1000);

    return {
        user: {
            id: '3',
            email: 'magic-user@example.com',
            name: 'Magic Link User',
            role: 'student',
        },
        token: 'mock-jwt-token-magic',
    };
}

export async function sendMagicLinkRequest(email: string): Promise<boolean> {
    console.log(`Magic Link requested for: ${email}`);
    await delay(1000);
    return true;
}

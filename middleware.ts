
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ['pl', 'en', 'uk', 'de', 'es', 'fr', 'it', 'cs', 'sk', 'ro', 'hu', 'pt', 'lt', 'lv', 'et', 'hr', 'sr', 'sl', 'bg', 'el', 'nl', 'sv', 'fi', 'no', 'da'];
const defaultLocale = 'pl';

// List of paths that require authentication (any logged-in user)
const protectedPaths = ["/dashboard"];

// SEC-FIX: Paths that require ADMIN role specifically
const adminPaths = ["/admin"];

// Simplified locale detection
function getLocale(request: NextRequest): string {
    // 1. Check cookie
    const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
    if (cookieLocale && locales.includes(cookieLocale)) {
        return cookieLocale;
    }

    // 2. Check Accept-Language header (simple string match)
    const acceptLanguage = request.headers.get('accept-language');
    if (acceptLanguage) {
        // Simple extraction: 'pl-PL,pl;q=0.9,en;q=0.8' -> 'pl'
        const preferred = acceptLanguage.split(',')[0].split('-')[0];
        if (locales.includes(preferred)) {
            return preferred;
        }
    }

    return defaultLocale;
}

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 1. Skip public files and API
    if (
        pathname.startsWith('/api') ||
        pathname.startsWith('/_next') ||
        pathname.startsWith('/static') ||
        pathname.includes('.') // images, icons, files
    ) {
        return NextResponse.next();
    }

    // 2. Check if path has locale
    const pathnameIsMissingLocale = locales.every(
        (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
    );

    // Redirect if missing locale
    if (pathnameIsMissingLocale) {
        const locale = getLocale(request);
        return NextResponse.redirect(
            new URL(`/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`, request.url)
        );
    }

    // 3. Extract locale and sync cookie
    const pathSegments = pathname.split('/');
    const locale = pathSegments[1];

    // Auth Check
    const pathWithoutLocale = '/' + pathSegments.slice(2).join('/');

    const isProtectedPath = protectedPaths.some(
        (path) => pathWithoutLocale === path || pathWithoutLocale.startsWith(`${path}/`)
    );

    // SEC-FIX: Admin path check — requires both token AND admin role cookie
    const isAdminPath = adminPaths.some(
        (path) => pathWithoutLocale === path || pathWithoutLocale.startsWith(`${path}/`)
    );

    let response = NextResponse.next();

    if (isAdminPath) {
        const token = request.cookies.get("user_token")?.value;
        const userRole = request.cookies.get("user_role")?.value;

        if (!token) {
            // Not logged in at all — redirect to login
            const loginUrl = new URL(`/${locale}/login`, request.url);
            response = NextResponse.redirect(loginUrl);
        } else if (userRole !== "admin" || token.startsWith("demo_")) {
            // Logged in but NOT admin — redirect to dashboard with error
            // This prevents privilege escalation: student/teacher cannot access /admin
            const dashboardUrl = new URL(`/${locale}/dashboard`, request.url);
            dashboardUrl.searchParams.set("error", "unauthorized");
            response = NextResponse.redirect(dashboardUrl);
        }
        // else: token exists AND role is admin AND not a demo token — allow through
    } else if (isProtectedPath) {
        const token = request.cookies.get("user_token")?.value;
        if (!token) {
            const loginUrl = new URL(`/${locale}/login`, request.url);
            response = NextResponse.redirect(loginUrl);
        }
    }

    // Always set/update locale cookie to match current path
    if (locales.includes(locale)) {
        // Only set if different to avoid unnecessary header overhead
        const currentCookie = request.cookies.get('NEXT_LOCALE')?.value;
        if (currentCookie !== locale) {
            response.cookies.set('NEXT_LOCALE', locale, { path: '/', maxAge: 31536000 });
        }
    }

    return response;
}

export const config = {
    matcher: [
        // Skip all internal paths (_next)
        "/((?!_next|api|favicon.ico|.*\\..*).*)",
    ],
};

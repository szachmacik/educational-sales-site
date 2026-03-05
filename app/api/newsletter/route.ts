import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { cookies } from "next/headers";
import fs from "fs/promises";
import path from "path";

const SUBSCRIBERS_FILE = path.join(process.cwd(), "data", "newsletter-subscribers.json");

async function readSubscribers(): Promise<{ email: string; createdAt: string }[]> {
    try {
        const content = await fs.readFile(SUBSCRIBERS_FILE, "utf8");
        return JSON.parse(content);
    } catch {
        return [];
    }
}

async function writeSubscribers(subscribers: { email: string; createdAt: string }[]) {
    const dir = path.join(process.cwd(), "data");
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(SUBSCRIBERS_FILE, JSON.stringify(subscribers, null, 2), "utf8");
}

async function verifyAdmin(): Promise<boolean> {
    const cookieStore = await cookies();
    const token = cookieStore.get('user_token')?.value;
    if (!token) return false;
    const userRole = cookieStore.get('user_role')?.value;
    if (userRole !== 'admin') return false;
    if (token.startsWith('demo_')) return false;
    return true;
}

export async function POST(req: NextRequest) {
    try {
        // Rate limiting: 2 newsletter signups per 10 minutes per IP
        const clientIp = getClientIp(req);
        const rateLimit = checkRateLimit(`newsletter:${clientIp}`, { limit: 2, windowSecs: 600 });
        if (!rateLimit.success) {
            return NextResponse.json(
                { error: "too_many_requests", message: "Zbyt wiele prób. Spróbuj ponownie za chwilę." },
                { status: 429 }
            );
        }

        const body = await req.json();
        const { email } = body;

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
        }

        const subscribers = await readSubscribers();

        // Check for duplicate
        const alreadySubscribed = subscribers.some(
            (s) => s.email.toLowerCase() === email.toLowerCase()
        );

        if (alreadySubscribed) {
            // Return success silently — don't reveal if email is already subscribed
            return NextResponse.json({ success: true });
        }

        // Save new subscriber
        subscribers.push({ email, createdAt: new Date().toISOString() });
        await writeSubscribers(subscribers);

        // Notify admin
        const adminEmail = process.env.ADMIN_EMAIL || process.env.RESEND_FROM;
        if (adminEmail) {
            await sendEmail({
                to: adminEmail,
                subject: `[Newsletter] Nowy subskrybent: ${email}`,
                html: `<p>Nowy subskrybent newslettera: <strong>${email}</strong></p><p>Data: ${new Date().toLocaleString('pl-PL')}</p><p>Łączna liczba subskrybentów: ${subscribers.length}</p>`,
                text: `Nowy subskrybent: ${email}`,
            }).catch(() => {}); // Don't fail if email notification fails
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("[Newsletter] Error:", error);
        return NextResponse.json(
            { error: "Server error", message: error.message },
            { status: 500 }
        );
    }
}

export async function GET() {
    const isAdmin = await verifyAdmin();
    const subscribers = await readSubscribers();
    if (!isAdmin) {
        // Public: return only count
        return NextResponse.json({ count: subscribers.length });
    }
    // Admin: return full list sorted by newest first
    const sorted = [...subscribers].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return NextResponse.json({ count: subscribers.length, subscribers: sorted });
}

export async function DELETE(req: NextRequest) {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const { email } = await req.json();
        if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });
        const subscribers = await readSubscribers();
        const filtered = subscribers.filter((s) => s.email.toLowerCase() !== email.toLowerCase());
        await writeSubscribers(filtered);
        return NextResponse.json({ success: true, removed: subscribers.length - filtered.length });
    } catch (error: any) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

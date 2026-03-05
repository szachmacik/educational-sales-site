import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
    try {
        // Rate limiting: 3 contact form submissions per 10 minutes per IP
        const clientIp = getClientIp(req);
        const rateLimit = checkRateLimit(`contact:${clientIp}`, { limit: 3, windowSecs: 600 });
        if (!rateLimit.success) {
            return NextResponse.json(
                { error: "too_many_requests", message: "Zbyt wiele wiadomości. Spróbuj ponownie za chwilę." },
                { status: 429 }
            );
        }

        const body = await req.json();
        const { name, email, message, subject } = body;

        if (!name || !email || !message) {
            return NextResponse.json(
                { error: "Missing required fields: name, email, message" },
                { status: 400 }
            );
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: "Invalid email address" },
                { status: 400 }
            );
        }

        const adminEmail = process.env.ADMIN_EMAIL || process.env.RESEND_FROM || "kontakt@ofshore.dev";

        const emailSent = await sendEmail({
            to: adminEmail,
            subject: `[Kontakt] ${subject || "Nowa wiadomość"} — od ${name}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #7c3aed;">Nowa wiadomość z formularza kontaktowego</h2>
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                        <tr>
                            <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold; width: 120px;">Imię i nazwisko:</td>
                            <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${name}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">E-mail:</td>
                            <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><a href="mailto:${email}">${email}</a></td>
                        </tr>
                        ${subject ? `
                        <tr>
                            <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Temat:</td>
                            <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${subject}</td>
                        </tr>` : ''}
                    </table>
                    <div style="background: #f9fafb; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
                        <h3 style="margin-top: 0; color: #374151;">Wiadomość:</h3>
                        <p style="color: #4b5563; white-space: pre-wrap; margin: 0;">${message}</p>
                    </div>
                    <p style="color: #9ca3af; font-size: 12px;">
                        Wiadomość wysłana przez formularz kontaktowy na kamila.ofshore.dev
                    </p>
                </div>
            `,
            text: `Nowa wiadomość od ${name} (${email}):\n\n${message}`,
        });

        if (!emailSent) {
            console.warn("[Contact] Email sending failed, but logging the submission.");
            // Still return success to user — log to console for now
            console.info(`[Contact] Form submission: name=${name}, email=${email}, message=${message.substring(0, 100)}`);
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("[Contact] Error:", error);
        return NextResponse.json(
            { error: "Server error", message: error.message },
            { status: 500 }
        );
    }
}

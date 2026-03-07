/**
 * Email sending utility for Zoney educational platform.
 *
 * Supports two email providers with automatic fallback:
 * 1. **Resend** (recommended) — set `RESEND_API_KEY`
 * 2. **SMTP/nodemailer** (fallback) — set `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`
 *
 * Priority: Resend > SMTP. If neither is configured, emails are silently skipped
 * with a warning logged to the console.
 *
 * @module email
 *
 * @example
 * import { sendEmail, orderConfirmationEmail } from '@/lib/email'
 *
 * const payload = orderConfirmationEmail('user@example.com', 'Jan', 'ORD-123', ['SpeakBook'], '49 zł')
 * const success = await sendEmail(payload)
 */

import nodemailer from "nodemailer";

/**
 * Payload for sending an email message.
 */
export interface EmailPayload {
  /** Recipient email address */
  to: string;
  /** Email subject line */
  subject: string;
  /** HTML body of the email */
  html: string;
  /** Plain text fallback body (optional but recommended) */
  text?: string;
}

/**
 * Sends an email via the Resend API.
 *
 * @param payload - Email content and recipient
 * @returns `true` if sent successfully, `false` on error
 */
async function sendViaResend(payload: EmailPayload): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.FROM_EMAIL || process.env.RESEND_FROM || "noreply@ofshore.dev";

  if (!apiKey) {
    console.error("[Email/Resend] RESEND_API_KEY is not set");
    return false;
  }

  try {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("[Email/Resend] Error:", err);
    return false;
  }
  return true;
  } catch (err) {
    console.error("[Email/Resend] Network error:", err);
    return false;
  }
}

/**
 * Sends an email via SMTP using nodemailer.
 *
 * @param payload - Email content and recipient
 * @returns `true` if sent successfully, `false` on error
 */
async function sendViaSMTP(payload: EmailPayload): Promise<boolean> {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || user;

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  try {
    await transporter.sendMail({
      from,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
    });
    return true;
  } catch (err) {
    console.error("[Email/SMTP] Error:", err);
    return false;
  }
}

/**
 * Sends an email using the configured provider (Resend or SMTP).
 *
 * Automatically selects the available provider. If neither is configured,
 * logs a warning and returns `false` without throwing.
 *
 * @param payload - Email content and recipient
 * @returns `true` if the email was sent successfully, `false` otherwise
 *
 * @example
 * const sent = await sendEmail({
 *   to: 'customer@example.com',
 *   subject: 'Potwierdzenie zamówienia',
 *   html: '<p>Dziękujemy za zakup!</p>',
 *   text: 'Dziękujemy za zakup!',
 * })
 */
export async function sendEmail(payload: EmailPayload): Promise<boolean> {
  // Validate recipient
  if (!payload.to || !payload.to.includes('@')) {
    console.error("[Email] Invalid recipient address:", payload.to);
    return false;
  }

  if (process.env.RESEND_API_KEY) {
    return sendViaResend(payload);
  }
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return sendViaSMTP(payload);
  }
  console.warn("[Email] No email provider configured. Set RESEND_API_KEY or SMTP_* env vars.");
  return false;
}

// ─── Email Templates ────────────────────────────────────────────────────────

/**
 * Generates an admin password reset email payload.
 *
 * @param password - The new temporary password to include in the email
 * @returns Email payload ready to pass to `sendEmail()`
 */
export function adminPasswordResetEmail(password: string): EmailPayload {
  return {
    to: process.env.ADMIN_EMAIL || "",
    subject: "Nowe hasło do panelu admina – kamila.ofshore.dev",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#0f172a;color:#e2e8f0;border-radius:12px;">
        <div style="text-align:center;margin-bottom:24px;">
          <div style="display:inline-block;background:#4f46e5;border-radius:50%;width:56px;height:56px;line-height:56px;font-size:28px;">🔐</div>
        </div>
        <h2 style="color:#fff;margin:0 0 8px;">Panel Administratora</h2>
        <p style="color:#94a3b8;margin:0 0 24px;">kamila.ofshore.dev</p>
        <p>Twoje nowe hasło do panelu admina:</p>
        <div style="background:#1e293b;border:1px solid #334155;border-radius:8px;padding:16px;margin:16px 0;text-align:center;">
          <code style="font-size:20px;font-weight:bold;color:#818cf8;letter-spacing:2px;">${password}</code>
        </div>
        <p style="color:#94a3b8;font-size:14px;">
          <strong>URL logowania:</strong><br>
          <a href="https://kamila.ofshore.dev/pl/login/admin" style="color:#818cf8;">https://kamila.ofshore.dev/pl/login/admin</a>
        </p>
        <p style="color:#94a3b8;font-size:14px;">
          <strong>Email:</strong> ${process.env.ADMIN_EMAIL}
        </p>
        <hr style="border:none;border-top:1px solid #334155;margin:24px 0;">
        <p style="color:#64748b;font-size:12px;">Zmień hasło po pierwszym zalogowaniu. Jeśli nie prosiłeś o reset hasła, zignoruj tę wiadomość.</p>
      </div>
    `,
    text: `Nowe hasło admina: ${password}\n\nURL: https://kamila.ofshore.dev/pl/login/admin\nEmail: ${process.env.ADMIN_EMAIL}`,
  };
}

/**
 * Generates an order confirmation email payload.
 *
 * @param customerEmail - Recipient email address
 * @param customerName - Customer's display name
 * @param orderId - Unique order identifier
 * @param products - List of purchased product names
 * @param total - Formatted total price string (e.g., "49 zł")
 * @returns Email payload ready to pass to `sendEmail()`
 *
 * @example
 * const email = orderConfirmationEmail(
 *   'jan@example.com',
 *   'Jan Kowalski',
 *   'ORD-2026-001',
 *   ['SpeakBook Pro', 'Mega Pack'],
 *   '149 zł'
 * )
 * await sendEmail(email)
 */
export function orderConfirmationEmail(
  customerEmail: string,
  customerName: string,
  orderId: string,
  products: string[],
  total: string
): EmailPayload {
  return {
    to: customerEmail,
    subject: `Potwierdzenie zamówienia #${orderId} – Kamila Łobko-Koziej`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px;background:#0f172a;color:#e2e8f0;border-radius:12px;">
        <h2 style="color:#fff;">Dziękujemy za zamówienie, ${customerName}! 🎉</h2>
        <p style="color:#94a3b8;">Numer zamówienia: <strong style="color:#fff;">#${orderId}</strong></p>
        <div style="background:#1e293b;border-radius:8px;padding:16px;margin:16px 0;">
          <h3 style="color:#fff;margin:0 0 12px;">Zamówione produkty:</h3>
          ${products.map(p => `<p style="margin:4px 0;color:#e2e8f0;">• ${p}</p>`).join("")}
          <hr style="border:none;border-top:1px solid #334155;margin:12px 0;">
          <p style="color:#fff;font-weight:bold;">Łącznie: ${total}</p>
        </div>
        <p style="color:#94a3b8;font-size:14px;">Dostęp do materiałów znajdziesz w swoim koncie na <a href="https://kamila.ofshore.dev" style="color:#818cf8;">kamila.ofshore.dev</a></p>
      </div>
    `,
    text: `Dziękujemy za zamówienie #${orderId}!\n\nProdukty: ${products.join(", ")}\nŁącznie: ${total}`,
  };
}

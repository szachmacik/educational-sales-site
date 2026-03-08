/**
 * Email sending utility for Zoney educational platform.
 *
 * Supports two email providers with automatic fallback:
 * 1. **Resend** (recommended) — set `RESEND_API_KEY`
 * 2. **SMTP/nodemailer** (fallback) — set `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`
 *
 * Features:
 * - Automatic provider selection (Resend > SMTP)
 * - Retry logic with exponential backoff (up to 3 attempts)
 * - Email address validation before sending
 * - In-memory queue for non-blocking fire-and-forget sends
 * - Full set of transactional email templates
 *
 * @module email
 *
 * @example
 * import { sendEmail, orderConfirmationEmail } from '@/lib/email'
 *
 * const payload = orderConfirmationEmail('user@example.com', 'Jan', 'ORD-123', ['SpeakBook'], '49 zł')
 * const success = await sendEmail(payload)
 *
 * // Fire-and-forget (non-blocking):
 * queueEmail(payload)
 */

import nodemailer from "nodemailer";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

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
  /** Plain text fallback body (optional but recommended for spam filters) */
  text?: string;
  /** Reply-to address (optional) */
  replyTo?: string;
  /** CC recipients (optional) */
  cc?: string[];
  /** BCC recipients (optional) */
  bcc?: string[];
}

/**
 * Result of a send attempt.
 */
export interface EmailResult {
  success: boolean;
  provider?: 'resend' | 'smtp' | 'none';
  attempts?: number;
  error?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// VALIDATION
// ─────────────────────────────────────────────────────────────────────────────

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates an email address format.
 *
 * @param email - Email address to validate
 * @returns `true` if the format is valid
 */
export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim());
}

// ─────────────────────────────────────────────────────────────────────────────
// RETRY HELPER
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Retries an async function with exponential backoff.
 *
 * @param fn - Async function to retry
 * @param maxAttempts - Maximum number of attempts (default: 3)
 * @param baseDelayMs - Base delay in ms, doubles each retry (default: 500)
 * @returns Result of the function or throws after all attempts fail
 */
async function withRetry<T>(
  fn: () => Promise<T>,
  maxAttempts = 3,
  baseDelayMs = 500
): Promise<{ result: T; attempts: number }> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const result = await fn();
      return { result, attempts: attempt };
    } catch (err) {
      lastError = err;
      if (attempt < maxAttempts) {
        const delay = baseDelayMs * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  throw lastError;
}

// ─────────────────────────────────────────────────────────────────────────────
// PROVIDERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Sends an email via the Resend API with retry logic.
 *
 * @param payload - Email content and recipient
 * @returns EmailResult with success status and attempt count
 */
async function sendViaResend(payload: EmailPayload): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.FROM_EMAIL || process.env.RESEND_FROM || "noreply@ofshore.dev";

  if (!apiKey) {
    return { success: false, provider: 'resend', error: 'RESEND_API_KEY is not set' };
  }

  try {
    const { attempts } = await withRetry(async () => {
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
          reply_to: payload.replyTo,
          cc: payload.cc,
          bcc: payload.bcc,
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(`Resend API error ${res.status}: ${err}`);
      }
      return true;
    });

    return { success: true, provider: 'resend', attempts };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[Email/Resend] Failed after retries:", message);
    return { success: false, provider: 'resend', error: message };
  }
}

/**
 * Sends an email via SMTP using nodemailer with retry logic.
 *
 * @param payload - Email content and recipient
 * @returns EmailResult with success status and attempt count
 */
async function sendViaSMTP(payload: EmailPayload): Promise<EmailResult> {
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
    const { attempts } = await withRetry(async () => {
      await transporter.sendMail({
        from,
        to: payload.to,
        subject: payload.subject,
        html: payload.html,
        text: payload.text,
        replyTo: payload.replyTo,
        cc: payload.cc,
        bcc: payload.bcc,
      });
    });

    return { success: true, provider: 'smtp', attempts };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[Email/SMTP] Failed after retries:", message);
    return { success: false, provider: 'smtp', error: message };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC API
// ─────────────────────────────────────────────────────────────────────────────

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
  if (!payload.to || !isValidEmail(payload.to)) {
    console.error("[Email] Invalid recipient address:", payload.to);
    return false;
  }

  if (process.env.RESEND_API_KEY) {
    const result = await sendViaResend(payload);
    if (!result.success) {
      // Fallback to SMTP if Resend fails and SMTP is configured
      if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
        console.warn("[Email] Resend failed, falling back to SMTP");
        const smtpResult = await sendViaSMTP(payload);
        return smtpResult.success;
      }
    }
    return result.success;
  }

  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    const result = await sendViaSMTP(payload);
    return result.success;
  }

  console.warn("[Email] No email provider configured. Set RESEND_API_KEY or SMTP_* env vars.");
  return false;
}

/**
 * Sends an email using the configured provider and returns detailed result.
 * Use this when you need to know which provider was used or how many attempts were made.
 *
 * @param payload - Email content and recipient
 * @returns Detailed EmailResult object
 */
export async function sendEmailWithResult(payload: EmailPayload): Promise<EmailResult> {
  if (!payload.to || !isValidEmail(payload.to)) {
    return { success: false, provider: 'none', error: `Invalid recipient: ${payload.to}` };
  }

  if (process.env.RESEND_API_KEY) {
    const result = await sendViaResend(payload);
    if (!result.success && process.env.SMTP_HOST) {
      console.warn("[Email] Resend failed, falling back to SMTP");
      return sendViaSMTP(payload);
    }
    return result;
  }

  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return sendViaSMTP(payload);
  }

  return { success: false, provider: 'none', error: 'No email provider configured' };
}

// ─────────────────────────────────────────────────────────────────────────────
// QUEUE (fire-and-forget)
// ─────────────────────────────────────────────────────────────────────────────

const emailQueue: EmailPayload[] = [];
let queueProcessing = false;

/**
 * Adds an email to the in-memory queue for non-blocking delivery.
 * The queue is processed sequentially in the background.
 *
 * Use this for non-critical emails (e.g., marketing, notifications)
 * where you don't need to wait for the result.
 *
 * @param payload - Email content and recipient
 *
 * @example
 * // Non-blocking — returns immediately
 * queueEmail(welcomeEmail('user@example.com', 'Jan'))
 */
export function queueEmail(payload: EmailPayload): void {
  emailQueue.push(payload);
  if (!queueProcessing) {
    processEmailQueue();
  }
}

async function processEmailQueue(): Promise<void> {
  queueProcessing = true;
  while (emailQueue.length > 0) {
    const payload = emailQueue.shift();
    if (payload) {
      await sendEmail(payload).catch(err => {
        console.error("[Email/Queue] Failed to send queued email:", err);
      });
    }
  }
  queueProcessing = false;
}

/**
 * Returns the current number of emails waiting in the queue.
 */
export function getQueueLength(): number {
  return emailQueue.length;
}

// ─────────────────────────────────────────────────────────────────────────────
// EMAIL TEMPLATES
// ─────────────────────────────────────────────────────────────────────────────

/** Base HTML wrapper for all email templates */
function emailWrapper(content: string, previewText = ''): string {
  return `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kamila Łobko-Koziej</title>
  ${previewText ? `<span style="display:none;max-height:0;overflow:hidden;">${previewText}</span>` : ''}
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#0f172a;border-radius:16px;overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#4f46e5,#7c3aed);padding:32px;text-align:center;">
              <p style="margin:0;color:#c7d2fe;font-size:13px;letter-spacing:2px;text-transform:uppercase;">Kamila Łobko-Koziej</p>
              <p style="margin:4px 0 0;color:#fff;font-size:11px;opacity:0.7;">kamila.ofshore.dev</p>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding:32px;color:#e2e8f0;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:16px 32px 32px;border-top:1px solid #1e293b;">
              <p style="margin:0;color:#475569;font-size:12px;text-align:center;">
                © ${new Date().getFullYear()} Kamila Łobko-Koziej · 
                <a href="https://kamila.ofshore.dev" style="color:#818cf8;text-decoration:none;">kamila.ofshore.dev</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

/**
 * Generates an admin password reset email payload.
 *
 * @param password - The new temporary password to include in the email
 * @returns Email payload ready to pass to `sendEmail()`
 */
export function adminPasswordResetEmail(password: string): EmailPayload {
  const content = `
    <div style="text-align:center;margin-bottom:24px;">
      <div style="display:inline-flex;align-items:center;justify-content:center;width:64px;height:64px;background:#312e81;border-radius:50%;font-size:32px;">🔐</div>
    </div>
    <h2 style="color:#fff;margin:0 0 8px;text-align:center;">Reset hasła admina</h2>
    <p style="color:#94a3b8;text-align:center;margin:0 0 24px;">Panel administracyjny</p>
    <p style="color:#cbd5e1;">Twoje nowe hasło tymczasowe:</p>
    <div style="background:#1e293b;border:1px solid #334155;border-radius:12px;padding:20px;margin:16px 0;text-align:center;">
      <code style="font-size:22px;font-weight:bold;color:#818cf8;letter-spacing:3px;">${password}</code>
    </div>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;">
      <tr>
        <td style="background:#1e293b;border-radius:8px;padding:16px;">
          <p style="margin:0 0 8px;color:#94a3b8;font-size:13px;"><strong style="color:#e2e8f0;">URL logowania:</strong></p>
          <a href="https://kamila.ofshore.dev/pl/login/admin" style="color:#818cf8;font-size:13px;">https://kamila.ofshore.dev/pl/login/admin</a>
          <p style="margin:12px 0 0;color:#94a3b8;font-size:13px;"><strong style="color:#e2e8f0;">Email:</strong> ${process.env.ADMIN_EMAIL || ''}</p>
        </td>
      </tr>
    </table>
    <p style="color:#64748b;font-size:12px;margin:0;">Zmień hasło natychmiast po zalogowaniu. Jeśli nie prosiłeś o reset, zignoruj tę wiadomość.</p>
  `;

  return {
    to: process.env.ADMIN_EMAIL || "",
    subject: "Reset hasła – Panel Admina kamila.ofshore.dev",
    html: emailWrapper(content, 'Twoje nowe hasło tymczasowe do panelu admina'),
    text: `Reset hasła admina\n\nNowe hasło: ${password}\nURL: https://kamila.ofshore.dev/pl/login/admin\nEmail: ${process.env.ADMIN_EMAIL || ''}`,
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
 */
export function orderConfirmationEmail(
  customerEmail: string,
  customerName: string,
  orderId: string,
  products: string[],
  total: string
): EmailPayload {
  const productList = products.length > 0
    ? products.map(p => `<tr><td style="padding:8px 0;color:#e2e8f0;border-bottom:1px solid #1e293b;">• ${p}</td></tr>`).join('')
    : '<tr><td style="padding:8px 0;color:#94a3b8;">Brak produktów</td></tr>'

  const content = `
    <h2 style="color:#fff;margin:0 0 4px;">Dziękujemy za zamówienie! 🎉</h2>
    <p style="color:#94a3b8;margin:0 0 24px;">Cześć ${customerName}, Twoje zamówienie zostało przyjęte.</p>
    
    <div style="background:#1e293b;border-radius:12px;padding:20px;margin:0 0 20px;">
      <p style="margin:0 0 4px;color:#64748b;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Numer zamówienia</p>
      <p style="margin:0;color:#818cf8;font-size:18px;font-weight:bold;">#${orderId}</p>
    </div>
    
    <div style="background:#1e293b;border-radius:12px;padding:20px;margin:0 0 20px;">
      <p style="margin:0 0 12px;color:#94a3b8;font-size:13px;text-transform:uppercase;letter-spacing:1px;">Zamówione produkty</p>
      <table width="100%" cellpadding="0" cellspacing="0">
        ${productList}
      </table>
      <div style="border-top:1px solid #334155;margin-top:12px;padding-top:12px;display:flex;justify-content:space-between;">
        <span style="color:#94a3b8;">Łącznie:</span>
        <span style="color:#fff;font-weight:bold;font-size:18px;">${total}</span>
      </div>
    </div>
    
    <div style="text-align:center;margin:24px 0;">
      <a href="https://kamila.ofshore.dev/pl/dashboard" 
         style="display:inline-block;background:#4f46e5;color:#fff;text-decoration:none;padding:14px 28px;border-radius:8px;font-weight:600;">
        Przejdź do swojego konta →
      </a>
    </div>
    
    <p style="color:#64748b;font-size:12px;margin:0;">Masz pytania? Napisz na <a href="mailto:kontakt@kamilalobkokoziej.pl" style="color:#818cf8;">kontakt@kamilalobkokoziej.pl</a></p>
  `;

  return {
    to: customerEmail,
    subject: `Potwierdzenie zamówienia #${orderId} – Kamila Łobko-Koziej`,
    html: emailWrapper(content, `Twoje zamówienie #${orderId} zostało przyjęte`),
    text: `Dziękujemy za zamówienie #${orderId}!\n\nCześć ${customerName},\n\nProdukty: ${products.join(", ")}\nŁącznie: ${total}\n\nDostęp: https://kamila.ofshore.dev/pl/dashboard`,
  };
}

/**
 * Generates a welcome email for new users.
 *
 * @param customerEmail - Recipient email address
 * @param customerName - Customer's display name
 * @returns Email payload ready to pass to `sendEmail()`
 */
export function welcomeEmail(customerEmail: string, customerName: string): EmailPayload {
  const content = `
    <div style="text-align:center;margin-bottom:24px;">
      <div style="font-size:48px;">👋</div>
    </div>
    <h2 style="color:#fff;margin:0 0 8px;text-align:center;">Witaj, ${customerName}!</h2>
    <p style="color:#94a3b8;text-align:center;margin:0 0 24px;">Cieszę się, że jesteś z nami.</p>
    
    <p style="color:#cbd5e1;">Twoje konto zostało pomyślnie utworzone. Teraz możesz:</p>
    <ul style="color:#94a3b8;padding-left:20px;line-height:1.8;">
      <li>Przeglądać materiały edukacyjne</li>
      <li>Śledzić swoje postępy</li>
      <li>Pobierać zakupione produkty</li>
      <li>Zarządzać zamówieniami</li>
    </ul>
    
    <div style="text-align:center;margin:28px 0;">
      <a href="https://kamila.ofshore.dev/pl/products" 
         style="display:inline-block;background:#4f46e5;color:#fff;text-decoration:none;padding:14px 28px;border-radius:8px;font-weight:600;">
        Przeglądaj materiały →
      </a>
    </div>
  `;

  return {
    to: customerEmail,
    subject: `Witaj w Zoney, ${customerName}! 🎉`,
    html: emailWrapper(content, `Twoje konto zostało utworzone`),
    text: `Witaj ${customerName}!\n\nTwoje konto zostało pomyślnie utworzone.\n\nPrzeglądaj materiały: https://kamila.ofshore.dev/pl/products`,
  };
}

/**
 * Generates a password reset email for regular users.
 *
 * @param customerEmail - Recipient email address
 * @param resetLink - Full URL with reset token
 * @returns Email payload ready to pass to `sendEmail()`
 */
export function passwordResetEmail(customerEmail: string, resetLink: string): EmailPayload {
  const content = `
    <div style="text-align:center;margin-bottom:24px;">
      <div style="font-size:48px;">🔑</div>
    </div>
    <h2 style="color:#fff;margin:0 0 8px;text-align:center;">Reset hasła</h2>
    <p style="color:#94a3b8;text-align:center;margin:0 0 24px;">Otrzymaliśmy prośbę o reset hasła dla Twojego konta.</p>
    
    <div style="text-align:center;margin:28px 0;">
      <a href="${resetLink}" 
         style="display:inline-block;background:#4f46e5;color:#fff;text-decoration:none;padding:14px 28px;border-radius:8px;font-weight:600;">
        Zresetuj hasło →
      </a>
    </div>
    
    <p style="color:#64748b;font-size:12px;text-align:center;">Link jest ważny przez 24 godziny. Jeśli nie prosiłeś o reset hasła, zignoruj tę wiadomość.</p>
    <p style="color:#475569;font-size:11px;text-align:center;word-break:break-all;">
      Lub skopiuj link: <a href="${resetLink}" style="color:#818cf8;">${resetLink}</a>
    </p>
  `;

  return {
    to: customerEmail,
    subject: "Reset hasła – kamila.ofshore.dev",
    html: emailWrapper(content, 'Kliknij aby zresetować hasło'),
    text: `Reset hasła\n\nKliknij link aby zresetować hasło:\n${resetLink}\n\nLink jest ważny przez 24 godziny.`,
  };
}

/**
 * Generates a magic link (passwordless login) email.
 *
 * @param customerEmail - Recipient email address
 * @param magicLink - Full URL with magic link token
 * @returns Email payload ready to pass to `sendEmail()`
 */
export function magicLinkEmail(customerEmail: string, magicLink: string): EmailPayload {
  const content = `
    <div style="text-align:center;margin-bottom:24px;">
      <div style="font-size:48px;">✨</div>
    </div>
    <h2 style="color:#fff;margin:0 0 8px;text-align:center;">Link do logowania</h2>
    <p style="color:#94a3b8;text-align:center;margin:0 0 24px;">Kliknij poniższy przycisk, aby zalogować się bez hasła.</p>
    
    <div style="text-align:center;margin:28px 0;">
      <a href="${magicLink}" 
         style="display:inline-block;background:#4f46e5;color:#fff;text-decoration:none;padding:14px 28px;border-radius:8px;font-weight:600;">
        Zaloguj się →
      </a>
    </div>
    
    <p style="color:#64748b;font-size:12px;text-align:center;">Link jest jednorazowy i ważny przez 15 minut. Jeśli nie prosiłeś o link, zignoruj tę wiadomość.</p>
  `;

  return {
    to: customerEmail,
    subject: "Link do logowania – kamila.ofshore.dev",
    html: emailWrapper(content, 'Twój jednorazowy link do logowania'),
    text: `Link do logowania\n\nKliknij link:\n${magicLink}\n\nLink jest ważny przez 15 minut.`,
  };
}

/**
 * Generates a new order notification email for the admin.
 *
 * @param orderId - Order identifier
 * @param customerEmail - Customer's email address
 * @param customerName - Customer's name
 * @param products - List of purchased product names
 * @param total - Formatted total price
 * @returns Email payload ready to pass to `sendEmail()`
 */
export function adminNewOrderEmail(
  orderId: string,
  customerEmail: string,
  customerName: string,
  products: string[],
  total: string
): EmailPayload {
  const productList = products.map(p => `• ${p}`).join('\n')

  const content = `
    <h2 style="color:#fff;margin:0 0 4px;">Nowe zamówienie! 🛍️</h2>
    <p style="color:#94a3b8;margin:0 0 24px;">Zamówienie #${orderId} zostało złożone.</p>
    
    <div style="background:#1e293b;border-radius:12px;padding:20px;margin:0 0 16px;">
      <p style="margin:0 0 4px;color:#64748b;font-size:12px;">KLIENT</p>
      <p style="margin:0;color:#e2e8f0;font-weight:600;">${customerName}</p>
      <p style="margin:4px 0 0;color:#94a3b8;font-size:13px;">${customerEmail}</p>
    </div>
    
    <div style="background:#1e293b;border-radius:12px;padding:20px;margin:0 0 16px;">
      <p style="margin:0 0 12px;color:#64748b;font-size:12px;">PRODUKTY</p>
      ${products.map(p => `<p style="margin:4px 0;color:#e2e8f0;">• ${p}</p>`).join('')}
      <p style="margin:12px 0 0;color:#818cf8;font-weight:bold;font-size:16px;">Łącznie: ${total}</p>
    </div>
    
    <div style="text-align:center;margin:20px 0;">
      <a href="https://kamila.ofshore.dev/pl/admin/orders" 
         style="display:inline-block;background:#4f46e5;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600;font-size:14px;">
        Zarządzaj zamówieniami →
      </a>
    </div>
  `;

  return {
    to: process.env.ADMIN_EMAIL || "",
    subject: `Nowe zamówienie #${orderId} – ${total}`,
    html: emailWrapper(content, `Nowe zamówienie od ${customerName}`),
    text: `Nowe zamówienie #${orderId}\n\nKlient: ${customerName} (${customerEmail})\nProdukty:\n${productList}\nŁącznie: ${total}\n\nPanel: https://kamila.ofshore.dev/pl/admin/orders`,
  };
}

/**
 * Generates a refund confirmation email.
 *
 * @param customerEmail - Recipient email address
 * @param customerName - Customer's name
 * @param orderId - Original order identifier
 * @param amount - Refunded amount (formatted string)
 * @returns Email payload ready to pass to `sendEmail()`
 */
export function refundConfirmationEmail(
  customerEmail: string,
  customerName: string,
  orderId: string,
  amount: string
): EmailPayload {
  const content = `
    <div style="text-align:center;margin-bottom:24px;">
      <div style="font-size:48px;">💸</div>
    </div>
    <h2 style="color:#fff;margin:0 0 8px;text-align:center;">Zwrot środków</h2>
    <p style="color:#94a3b8;text-align:center;margin:0 0 24px;">Cześć ${customerName}, Twój zwrot został przetworzony.</p>
    
    <div style="background:#1e293b;border-radius:12px;padding:20px;margin:0 0 20px;">
      <p style="margin:0 0 8px;color:#94a3b8;font-size:13px;">Zamówienie: <strong style="color:#e2e8f0;">#${orderId}</strong></p>
      <p style="margin:0;color:#94a3b8;font-size:13px;">Kwota zwrotu: <strong style="color:#34d399;font-size:18px;">${amount}</strong></p>
    </div>
    
    <p style="color:#94a3b8;font-size:13px;">Środki powinny pojawić się na Twoim koncie w ciągu 3–5 dni roboczych, w zależności od banku.</p>
    <p style="color:#64748b;font-size:12px;">Masz pytania? Napisz na <a href="mailto:kontakt@kamilalobkokoziej.pl" style="color:#818cf8;">kontakt@kamilalobkokoziej.pl</a></p>
  `;

  return {
    to: customerEmail,
    subject: `Potwierdzenie zwrotu – zamówienie #${orderId}`,
    html: emailWrapper(content, `Zwrot ${amount} za zamówienie #${orderId}`),
    text: `Zwrot środków\n\nCześć ${customerName},\n\nZwrot za zamówienie #${orderId} w kwocie ${amount} został przetworzony.\nŚrodki pojawią się na koncie w ciągu 3–5 dni roboczych.`,
  };
}

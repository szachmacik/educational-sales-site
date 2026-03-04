/**
 * Admin password reset endpoint
 * Generates a new random password, updates ADMIN_PASSWORD_HASH in env (via Coolify API),
 * and sends the new password to the admin email.
 *
 * Protected by MIGRATION_SECRET to prevent unauthorized access.
 */

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { sendEmail, adminPasswordResetEmail } from "@/lib/email";

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

function generatePassword(): string {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$";
  let pwd = "";
  for (let i = 0; i < 14; i++) {
    pwd += chars[Math.floor(Math.random() * chars.length)];
  }
  return pwd;
}

export async function POST(req: NextRequest) {
  try {
    const { secret } = await req.json();

    // Verify migration secret
    const migrationSecret = process.env.MIGRATION_SECRET;
    if (!migrationSecret || secret !== migrationSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Generate new password
    const newPassword = generatePassword();
    const newHash = hashPassword(newPassword);

    // Update ADMIN_PASSWORD_HASH via Coolify API
    const coolifyToken = process.env.COOLIFY_API_TOKEN;
    const appUuid = process.env.COOLIFY_APP_UUID;

    if (coolifyToken && appUuid) {
      try {
        // Get current envs
        const envsRes = await fetch(`http://178.62.246.169:8888/api/v1/applications/${appUuid}/envs`, {
          headers: { Authorization: `Bearer ${coolifyToken}` },
        });
        const envs = await envsRes.json();

        // Build bulk update payload
        const payload = {
          data: envs.map((ev: { key: string; value: string }) => ({
            key: ev.key,
            value: ev.key === "ADMIN_PASSWORD_HASH" ? newHash : ev.value,
            is_preview: false,
            is_build_time: false,
          })),
        };

        await fetch(`http://178.62.246.169:8888/api/v1/applications/${appUuid}/envs/bulk`, {
          method: "PATCH",
          headers: { Authorization: `Bearer ${coolifyToken}`, "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        // Trigger redeploy
        await fetch(`http://178.62.246.169:8888/api/v1/deploy?uuid=${appUuid}&force=false`, {
          method: "POST",
          headers: { Authorization: `Bearer ${coolifyToken}` },
        });
      } catch (err) {
        console.error("[PasswordReset] Coolify update failed:", err);
        // Continue — still send email with new hash info
      }
    }

    // Send email with new password
    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) {
      return NextResponse.json({ error: "ADMIN_EMAIL not configured" }, { status: 500 });
    }

    const emailPayload = adminPasswordResetEmail(newPassword);
    const emailSent = await sendEmail(emailPayload);

    return NextResponse.json({
      success: true,
      emailSent,
      message: emailSent
        ? `Nowe hasło zostało wysłane na ${adminEmail}`
        : "Hasło wygenerowane, ale email nie został wysłany (brak konfiguracji SMTP/Resend)",
      // Return password in response as fallback if email fails
      ...(emailSent ? {} : { password: newPassword }),
    });
  } catch (err) {
    console.error("[PasswordReset] Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

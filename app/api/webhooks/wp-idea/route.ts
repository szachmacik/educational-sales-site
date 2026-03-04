/**
 * WP Idea / WordPress Webhook Endpoint
 *
 * Receives real-time order and user events from sklep.linguachess.com
 * and syncs them to the local shop WITHOUT sending email notifications.
 *
 * Setup in WordPress:
 *   1. Install "WP Webhooks" plugin or use WP Idea built-in webhooks
 *   2. Add webhook URL: https://kamila.ofshore.dev/api/webhooks/wp-idea
 *   3. Set secret header: X-WP-Webhook-Secret: <WEBHOOK_SECRET>
 *   4. Events to subscribe: order.completed, order.paid, user.registered
 *
 * ENV vars required:
 *   WEBHOOK_SECRET  — shared secret for signature verification
 */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

const DATA_DIR = path.join(process.cwd(), "lib", "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const ACCESS_FILE = path.join(DATA_DIR, "user-access.json");
const SYNC_LOG = path.join(DATA_DIR, "wp-sync-log.json");

async function readJSON<T>(filePath: string, fallback: T): Promise<T> {
  try {
    return JSON.parse(await fs.readFile(filePath, "utf8")) as T;
  } catch {
    return fallback;
  }
}

async function writeJSON(filePath: string, data: unknown): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
}

function hashPassword(plain: string): string {
  return crypto.createHash("sha256").update(plain).digest("hex");
}

export async function POST(req: NextRequest) {
  // ── Verify webhook secret ─────────────────────────────────────────────────
  const webhookSecret = process.env.WEBHOOK_SECRET;
  if (webhookSecret) {
    const incomingSecret =
      req.headers.get("X-WP-Webhook-Secret") ||
      req.headers.get("x-wp-webhook-secret") ||
      req.headers.get("X-Webhook-Secret");
    if (incomingSecret !== webhookSecret) {
      return NextResponse.json({ error: "Invalid webhook secret" }, { status: 401 });
    }
  }

  let payload: any;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const event = payload.event || payload.hook || payload.action || "unknown";
  const timestamp = new Date().toISOString();

  // ── Log incoming webhook ──────────────────────────────────────────────────
  const log = await readJSON<any[]>(SYNC_LOG, []);
  log.push({ timestamp, event, summary: JSON.stringify(payload).slice(0, 200) });
  await writeJSON(SYNC_LOG, log.slice(-500));

  // ── Handle events ─────────────────────────────────────────────────────────
  try {
    if (event.includes("order") || payload.order || payload.order_id) {
      await handleOrderEvent(payload);
    } else if (event.includes("user") || payload.user || payload.user_id) {
      await handleUserEvent(payload);
    }
  } catch (err: any) {
    console.error("[WP Webhook] Error processing event:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, event, timestamp });
}

async function handleOrderEvent(payload: any) {
  // Extract order data — WP Idea sends different shapes depending on version
  const order = payload.order || payload;
  const userEmail = (
    order.billing?.email ||
    order.user_email ||
    order.customer_email ||
    order.email ||
    ""
  ).toLowerCase();

  if (!userEmail) return;

  // Extract purchased product slugs
  const items = order.items || order.line_items || order.products || [];
  const productSlugs: string[] = [];
  for (const item of items) {
    const slug = item.slug || item.product_slug || item.sku || String(item.product_id || item.id || "");
    if (slug) productSlugs.push(slug);
  }
  if (order.product_slug) productSlugs.push(order.product_slug);
  if (order.product_id) productSlugs.push(String(order.product_id));

  if (productSlugs.length === 0) return;

  const users = await readJSON<any[]>(USERS_FILE, []);
  const access = await readJSON<Record<string, string[]>>(ACCESS_FILE, {});

  const existingIdx = users.findIndex((u) => u.email?.toLowerCase() === userEmail);

  if (existingIdx !== -1) {
    // Update existing user's purchased products
    const existing = users[existingIdx];
    const merged = Array.from(new Set([...(existing.purchasedProducts || []), ...productSlugs]));
    users[existingIdx] = {
      ...existing,
      purchasedProducts: merged,
      lastSyncedAt: new Date().toISOString(),
    };
  } else {
    // Create new user silently (no email notification)
    const userName =
      `${order.billing?.first_name || order.first_name || ""} ${order.billing?.last_name || order.last_name || ""}`.trim() ||
      userEmail.split("@")[0];

    users.push({
      id: `wp_order_${Date.now()}`,
      email: userEmail,
      name: userName,
      role: "student",
      passwordHash: hashPassword(userEmail),
      purchasedProducts: productSlugs,
      source: "wordpress",
      migratedAt: new Date().toISOString(),
    });
  }

  // Update access map
  access[userEmail] = Array.from(new Set([...(access[userEmail] || []), ...productSlugs]));

  await writeJSON(USERS_FILE, users);
  await writeJSON(ACCESS_FILE, access);
}

async function handleUserEvent(payload: any) {
  const user = payload.user || payload;
  const email = (user.email || user.user_email || "").toLowerCase();
  if (!email) return;

  const users = await readJSON<any[]>(USERS_FILE, []);
  const existingIdx = users.findIndex((u) => u.email?.toLowerCase() === email);

  if (existingIdx === -1) {
    // New user registration — add silently, no email
    users.push({
      id: `wp_user_${Date.now()}`,
      email,
      name: `${user.first_name || user.display_name || ""} ${user.last_name || ""}`.trim() || email.split("@")[0],
      role: "student",
      passwordHash: hashPassword(email),
      purchasedProducts: [],
      source: "wordpress",
      migratedAt: new Date().toISOString(),
    });
    await writeJSON(USERS_FILE, users);
  }
}

// ── GET: webhook health check ─────────────────────────────────────────────────
export async function GET() {
  const log = await readJSON<any[]>(SYNC_LOG, []);
  return NextResponse.json({
    status: "active",
    endpoint: "/api/webhooks/wp-idea",
    recentEvents: log.slice(-10),
    totalEvents: log.length,
  });
}

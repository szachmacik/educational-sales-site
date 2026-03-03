import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import fs from "fs/promises";
import path from "path";

/**
 * Zen.com IPN (Instant Payment Notification) webhook handler.
 * Zen sends a POST with transaction status to customIpnUrl.
 * Verify using the "hash" field in the payload against HMAC-SHA256 of the body.
 */
function verifyZenHash(body: string, receivedHash: string, secretKey: string): boolean {
  // Zen hash verification: HMAC-SHA256 of raw body (without the hash field itself)
  try {
    const parsed = JSON.parse(body);
    const { hash: _hash, ...payloadWithoutHash } = parsed;
    const bodyToVerify = JSON.stringify(payloadWithoutHash);
    const expected = crypto
      .createHmac("sha256", secretKey)
      .update(bodyToVerify)
      .digest("hex")
      .toUpperCase();
    return expected === receivedHash?.toUpperCase();
  } catch {
    return false;
  }
}

async function updateOrderStatus(merchantTransactionId: string, status: string, transactionId: string) {
  try {
    const ORDERS_FILE = path.join(process.cwd(), "data", "orders.db.json");
    const content = await fs.readFile(ORDERS_FILE, "utf8").catch(() => "[]");
    const orders = JSON.parse(content);
    const idx = orders.findIndex(
      (o: any) => o.id === merchantTransactionId || o.orderNumber === merchantTransactionId
    );
    if (idx !== -1) {
      const mappedStatus =
        status === "ACCEPTED" ? "completed"
        : status === "REJECTED" || status === "ERROR" ? "failed"
        : status === "EXPIRED" ? "cancelled"
        : "processing";

      orders[idx].status = mappedStatus;
      orders[idx].payment = {
        ...orders[idx].payment,
        status: status === "ACCEPTED" ? "paid" : status.toLowerCase(),
        transactionId,
        paidAt: status === "ACCEPTED" ? new Date().toISOString() : undefined,
        method: "zen",
      };
      orders[idx].updatedAt = new Date().toISOString();
      await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf8");
      console.log(`[Zen Webhook] Order ${merchantTransactionId} → ${mappedStatus} (Zen: ${status})`);
    }
  } catch (err) {
    console.error("[Zen Webhook] Failed to update order:", err);
  }
}

export async function POST(req: NextRequest) {
  const secretKey = process.env.ZEN_SECRET_KEY;
  const body = await req.text();

  let event: any;
  try {
    event = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Verify hash if secret key is configured
  if (secretKey && event.hash) {
    if (!verifyZenHash(body, event.hash, secretKey)) {
      console.error("[Zen Webhook] Invalid hash — possible tampering");
      return NextResponse.json({ error: "Invalid hash" }, { status: 401 });
    }
  } else {
    console.warn("[Zen Webhook] Hash verification skipped — no ZEN_SECRET_KEY or no hash in payload");
  }

  const { transactionId, merchantTransactionId, status } = event;

  if (merchantTransactionId && status) {
    await updateOrderStatus(merchantTransactionId, status, transactionId);
  }

  return NextResponse.json({ received: true });
}

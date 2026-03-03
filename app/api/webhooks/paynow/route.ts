import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import fs from "fs/promises";
import path from "path";

function verifyPayNowSignature(body: string, signature: string, signatureKey: string): boolean {
  const expected = crypto
    .createHmac("sha256", signatureKey)
    .update(body)
    .digest("hex");
  return expected === signature;
}

async function updateOrderStatus(externalId: string, status: string, paymentId: string) {
  try {
    const ORDERS_FILE = path.join(process.cwd(), "data", "orders.db.json");
    const content = await fs.readFile(ORDERS_FILE, "utf8").catch(() => "[]");
    const orders = JSON.parse(content);
    const idx = orders.findIndex((o: any) => o.id === externalId || o.orderNumber === externalId);
    if (idx !== -1) {
      const mappedStatus = status === "CONFIRMED" ? "completed"
        : status === "ERROR" || status === "REJECTED" ? "failed"
        : status === "EXPIRED" ? "cancelled"
        : "processing";

      orders[idx].status = mappedStatus;
      orders[idx].payment = {
        ...orders[idx].payment,
        status: status === "CONFIRMED" ? "paid" : status.toLowerCase(),
        transactionId: paymentId,
        paidAt: status === "CONFIRMED" ? new Date().toISOString() : undefined,
        method: "blik",
      };
      orders[idx].updatedAt = new Date().toISOString();
      await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf8");
      console.log(`[PayNow Webhook] Order ${externalId} updated to ${mappedStatus} (PayNow: ${status})`);
    }
  } catch (err) {
    console.error("[PayNow Webhook] Failed to update order:", err);
  }
}

export async function POST(req: NextRequest) {
  const signatureKey = process.env.PAYNOW_SIGNATURE_KEY;
  const body = await req.text();
  const signature = req.headers.get("Signature");

  // Verify signature if key is configured
  if (signatureKey && signature) {
    const hashValue = signature.replace("hash=", "");
    if (!verifyPayNowSignature(body, hashValue, signatureKey)) {
      console.error("[PayNow Webhook] Invalid signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
  } else {
    console.warn("[PayNow Webhook] Signature verification skipped — no PAYNOW_SIGNATURE_KEY");
  }

  let event: any;
  try {
    event = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { paymentId, externalId, status } = event;

  if (paymentId && externalId && status) {
    await updateOrderStatus(externalId, status, paymentId);
  }

  return NextResponse.json({ received: true });
}

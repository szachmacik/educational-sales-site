import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import fs from "fs/promises";
import path from "path";

function getStripe(): Stripe | null {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) return null;
  return new Stripe(secretKey, { apiVersion: "2024-06-20" });
}

async function updateOrderStatus(orderId: string, status: string, transactionId: string) {
  try {
    const ORDERS_FILE = path.join(process.cwd(), "data", "orders.db.json");
    const content = await fs.readFile(ORDERS_FILE, "utf8").catch(() => "[]");
    const orders = JSON.parse(content);
    const idx = orders.findIndex((o: any) => o.id === orderId || o.orderNumber === orderId);
    if (idx !== -1) {
      orders[idx].status = status;
      orders[idx].payment = {
        ...orders[idx].payment,
        status: status === "completed" ? "paid" : status,
        transactionId,
        paidAt: new Date().toISOString(),
        method: "card",
      };
      orders[idx].updatedAt = new Date().toISOString();
      await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf8");
      console.log(`[Stripe Webhook] Order ${orderId} updated to ${status}`);
    }
  } catch (err) {
    console.error("[Stripe Webhook] Failed to update order:", err);
  }
}

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  if (!stripe) {
    // Simulation mode — no Stripe keys configured, accept webhook gracefully
    try {
      const body = await req.json();
      if (body?.type === 'checkout.session.completed' && body?.data?.object) {
        const session = body.data.object;
        const orderId = session.metadata?.orderId || session.client_reference_id;
        if (orderId) await updateOrderStatus(orderId, 'completed', session.id || 'sim_webhook');
      }
    } catch {}
    return NextResponse.json({ received: true, simulated: true });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  let event: Stripe.Event;

  try {
    if (webhookSecret && sig) {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } else {
      // No webhook secret configured — parse raw body (less secure, for dev)
      event = JSON.parse(body) as Stripe.Event;
      console.warn("[Stripe Webhook] No STRIPE_WEBHOOK_SECRET set — skipping signature verification");
    }
  } catch (err: any) {
    console.error("[Stripe Webhook] Signature verification failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.client_reference_id || session.metadata?.orderId;
      if (orderId) {
        await updateOrderStatus(orderId, "completed", session.payment_intent as string);
      }
      break;
    }
    case "checkout.session.expired": {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.client_reference_id || session.metadata?.orderId;
      if (orderId) {
        await updateOrderStatus(orderId, "cancelled", session.id);
      }
      break;
    }
    case "payment_intent.payment_failed": {
      const pi = event.data.object as Stripe.PaymentIntent;
      const orderId = pi.metadata?.orderId;
      if (orderId) {
        await updateOrderStatus(orderId, "failed", pi.id);
      }
      break;
    }
    default:
      console.log(`[Stripe Webhook] Unhandled event: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

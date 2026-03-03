import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

function getStripe(): Stripe | null {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) return null;
  return new Stripe(secretKey, { apiVersion: "2024-06-20" });
}

export async function POST(req: NextRequest) {
  try {
    const { amount, currency = "PLN", orderId, email, productName, successUrl, cancelUrl } = await req.json();

    if (!amount || !orderId) {
      return NextResponse.json({ error: "Missing required fields: amount, orderId" }, { status: 400 });
    }

    const stripe = getStripe();

    // If no Stripe keys configured, return simulation response
    if (!stripe) {
      console.warn("[Stripe] No STRIPE_SECRET_KEY configured. Returning simulation response.");
      return NextResponse.json({
        success: true,
        simulated: true,
        sessionId: `sim_${Date.now()}`,
        url: `${successUrl || "/"}?order=${orderId}&payment=simulated`,
      });
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://kamila.ofshore.dev";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: productName || `Zamówienie #${orderId}`,
            },
            unit_amount: Math.round(amount * 100), // Stripe uses smallest currency unit (grosze)
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      customer_email: email || undefined,
      client_reference_id: orderId,
      success_url: successUrl || `${baseUrl}/pl/success?session_id={CHECKOUT_SESSION_ID}&order=${orderId}`,
      cancel_url: cancelUrl || `${baseUrl}/pl/checkout?cancelled=true&order=${orderId}`,
      metadata: {
        orderId,
        source: "educational-sales-site",
      },
    });

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      url: session.url,
    });
  } catch (error: any) {
    console.error("[Stripe] Error creating checkout session:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Stripe error" },
      { status: 500 }
    );
  }
}

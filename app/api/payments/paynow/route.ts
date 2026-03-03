import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const PAYNOW_SANDBOX_URL = "https://api.sandbox.paynow.pl";
const PAYNOW_PRODUCTION_URL = "https://api.paynow.pl";

function getPayNowConfig() {
  const accessKey = process.env.PAYNOW_ACCESS_KEY;
  const signatureKey = process.env.PAYNOW_SIGNATURE_KEY;
  const env = process.env.PAYNOW_ENVIRONMENT || "sandbox";
  return { accessKey, signatureKey, env };
}

function generateSignature(payload: string, signatureKey: string): string {
  return crypto
    .createHmac("sha256", signatureKey)
    .update(payload)
    .digest("hex");
}

export async function POST(req: NextRequest) {
  try {
    const { amount, orderId, email, description, successUrl, continueUrl } = await req.json();

    if (!amount || !orderId || !email) {
      return NextResponse.json(
        { error: "Missing required fields: amount, orderId, email" },
        { status: 400 }
      );
    }

    const { accessKey, signatureKey, env } = getPayNowConfig();

    // Simulation mode if no keys
    if (!accessKey || !signatureKey) {
      console.warn("[PayNow] No credentials configured. Returning simulation response.");
      return NextResponse.json({
        success: true,
        simulated: true,
        paymentId: `sim_pn_${Date.now()}`,
        status: "NEW",
        redirectUrl: `${successUrl || "/pl/success"}?order=${orderId}&payment=simulated`,
      });
    }

    const baseUrl = env === "production" ? PAYNOW_PRODUCTION_URL : PAYNOW_SANDBOX_URL;
    const idempotencyKey = `${orderId}-${Date.now()}`;

    const payload = {
      amount: Math.round(amount * 100), // PayNow uses grosze (smallest PLN unit)
      currency: "PLN",
      externalId: orderId,
      description: description || `Zamówienie #${orderId}`,
      buyer: { email },
      continueUrl: continueUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/pl/success?order=${orderId}`,
    };

    const payloadString = JSON.stringify(payload);
    const signature = generateSignature(payloadString, signatureKey);

    const response = await fetch(`${baseUrl}/v2/payments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Api-Key": accessKey,
        "Signature": `hash=${signature}`,
        "Idempotency-Key": idempotencyKey,
      },
      body: payloadString,
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("[PayNow] API error:", data);
      return NextResponse.json(
        { success: false, error: data.errors?.[0]?.message || "PayNow API error" },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      paymentId: data.paymentId,
      status: data.status,
      redirectUrl: data.redirectUrl,
    });
  } catch (error: any) {
    console.error("[PayNow] Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "PayNow error" },
      { status: 500 }
    );
  }
}

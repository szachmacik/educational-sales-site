import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const ZEN_SANDBOX_URL = "https://secure.zen-test.com/api/checkouts";
const ZEN_PRODUCTION_URL = "https://secure.zen.com/api/checkouts";

function getZenConfig() {
  const terminalUuid = process.env.ZEN_TERMINAL_UUID;
  const secretKey = process.env.ZEN_SECRET_KEY;
  const env = process.env.ZEN_ENVIRONMENT || "sandbox";
  return { terminalUuid, secretKey, env };
}

/**
 * Generate Zen.com signature.
 * Concatenate: terminalUuid + merchantTransactionId + amount + currency + urlSuccess + urlFailure
 * Then: SHA-256 HMAC with secretKey, append ";sha256"
 */
function generateZenSignature(fields: string[], secretKey: string): string {
  const concatenated = fields.join("");
  const hash = crypto
    .createHmac("sha256", secretKey)
    .update(concatenated)
    .digest("hex");
  return `${hash};sha256`;
}

export async function POST(req: NextRequest) {
  try {
    const {
      amount,
      currency = "PLN",
      orderId,
      email,
      firstName,
      lastName,
      productName,
      successUrl,
      failureUrl,
    } = await req.json();

    if (!amount || !orderId || !email) {
      return NextResponse.json(
        { error: "Missing required fields: amount, orderId, email" },
        { status: 400 }
      );
    }

    const { terminalUuid, secretKey, env } = getZenConfig();
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://kamila.ofshore.dev";

    const urlSuccess = successUrl || `${baseUrl}/pl/success?order=${orderId}`;
    const urlFailure = failureUrl || `${baseUrl}/pl/checkout?failed=true&order=${orderId}`;
    const customIpnUrl = `${baseUrl}/api/webhooks/zen`;

    // Simulation mode if no keys
    if (!terminalUuid || !secretKey) {
      console.warn("[Zen] No credentials configured. Returning simulation response.");
      return NextResponse.json({
        success: true,
        simulated: true,
        redirectUrl: `${urlSuccess}&payment=simulated`,
        transactionId: `sim_zen_${Date.now()}`,
      });
    }

    const amountFormatted = amount.toFixed(2); // Zen uses decimal string e.g. "49.99"

    const signature = generateZenSignature(
      [terminalUuid, orderId, amountFormatted, currency, urlSuccess, urlFailure],
      secretKey
    );

    const payload: any = {
      terminalUuid,
      amount: amountFormatted,
      currency,
      merchantTransactionId: orderId,
      customer: {
        id: email,
        firstName: firstName || "Klient",
        lastName: lastName || "Sklepu",
        email,
      },
      items: [
        {
          code: orderId,
          name: productName || `Zamówienie #${orderId}`,
          price: amountFormatted,
          quantity: 1,
          lineAmountTotal: amountFormatted,
        },
      ],
      urlSuccess,
      urlFailure,
      customIpnUrl,
      language: "pl",
      signature,
    };

    const apiUrl = env === "production" ? ZEN_PRODUCTION_URL : ZEN_SANDBOX_URL;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("[Zen] API error:", data);
      return NextResponse.json(
        { success: false, error: data.message || "Zen API error" },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      redirectUrl: data.redirectUrl,
      transactionId: orderId,
    });
  } catch (error: any) {
    console.error("[Zen] Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Zen error" },
      { status: 500 }
    );
  }
}

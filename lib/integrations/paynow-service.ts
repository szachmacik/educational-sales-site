"use client";

const STORAGE_KEY = "admin_full_settings";

export interface PayNowConfig {
    accessKey: string;
    signatureKey: string;
    environment: 'sandbox' | 'production';
}

export function getPayNowConfig(): PayNowConfig | null {
    if (typeof window === 'undefined') return null;

    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return null;

        const parsed = JSON.parse(stored);
        if (parsed.pricing?.paynowAccessKey && parsed.pricing?.paynowSignatureKey) {
            return {
                accessKey: parsed.pricing.paynowAccessKey,
                signatureKey: parsed.pricing.paynowSignatureKey,
                environment: parsed.pricing.paynowEnvironment || 'sandbox'
            };
        }
    } catch (e) {
        console.error("Failed to load PayNow config", e);
    }
    return null;
}

/**
 * Simulates PayNow payment initialization.
 * In production, this would calculate a signature and POST to PayNow API.
 */
export async function processPayNowPayment(total: number, orderId: string, email: string) {
    const config = getPayNowConfig();

    // Simulate API delay
    await new Promise(r => setTimeout(r, 1800));

    if (!config) {
        console.warn("[PayNow] No configuration found. Using test mode simulation.");
        return {
            success: true,
            status: 'NEW',
            redirectUrl: `https://paynow.pl/simulate/${orderId}`,
            paymentId: `pn_${Math.random().toString(36).substr(2, 9)}`
        };
    }

    console.log(`[PayNow] Initializing payment for ${total} PLN for ${email} in ${config.environment} mode.`);

    return {
        success: true,
        status: 'NEW',
        redirectUrl: config.environment === 'sandbox'
            ? `https://sandbox.paynow.pl/payment/${orderId}`
            : `https://paynow.pl/payment/${orderId}`,
        paymentId: `pn_${Math.random().toString(36).substr(2, 9)}`
    };
}

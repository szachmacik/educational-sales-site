/**
 * OCR Service using Gemini Vision
 * Extracts fields (NIP, Name, Address) from institutional stamps and documents.
 */

export interface OCRResult {
    buyerName?: string;
    buyerNip?: string;
    buyerStreet?: string;
    buyerCity?: string;
    buyerZip?: string;
    recipientName?: string;
    recipientStreet?: string;
    recipientCity?: string;
    recipientZip?: string;
}

let lastScanTime = 0;
const OCR_RATE_LIMIT_MS = 10000; // 10 seconds between scans

/**
 * Simulates AI Vision extraction from a document image.
 */
export async function parseInstitutionalDocument(base64Image: string) {
    const now = Date.now();
    if (now - lastScanTime < OCR_RATE_LIMIT_MS) {
        throw new Error("Zbyt wiele prób skanowania. Odczekaj chwilę przed kolejnym dokumentem.");
    }

    lastScanTime = now;
    console.info("[OCR] Analyzing document...");

    const isSimulatorMode = typeof window !== 'undefined' && localStorage.getItem('feature_simulator_mode') === 'true';

    if (isSimulatorMode) {
        console.info("[OCR] Simulator Mode is ON. Simulating image extraction API.");
        // Simulate delay
        await new Promise(r => setTimeout(r, 2000));
    } else {
        // In a real application, this would call an API route that interacts with Gemini 2.0 Flash Vision
        // For now, if no key, we also fallback to setTimeout simulation.
        console.info("[OCR] Production Mode is ON. Fallback mock invoked since API is not wired yet in this example.");
        await new Promise(r => setTimeout(r, 2000));
    }

    // Simulate different results based on dummy triggers or just return a default "successful" parse
    return {
        buyerName: "Gmina Miasta Edukacji",
        buyerNip: "5250001010",
        buyerStreet: "Al. Jerozolimskie 123",
        buyerCity: "Warszawa",
        buyerZip: "00-001",
        recipientName: "Szkoła Podstawowa nr 1",
        recipientStreet: "ul. Szkolna 1",
        recipientCity: "Warszawa",
        recipientZip: "00-001",
    };
}

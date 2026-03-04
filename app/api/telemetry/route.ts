import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const TELEMETRY_FILE = path.join(process.cwd(), "lib", "data", "telemetry.db.json");

export async function POST(req: NextRequest) {
    // SEC-FIX: Rate limit telemetry submissions (30 req/min per IP)
    const clientIp = getClientIp(req);
    const rateLimitResult = checkRateLimit(`telemetry:${clientIp}`, { limit: 30, windowSecs: 60 });
    if (!rateLimitResult.success) {
        return NextResponse.json({ success: false }, { status: 429 });
    }

    try {
        const payload = await req.json();

        // Validate payload is an array and not too large
        if (!Array.isArray(payload) || payload.length > 100) {
            return NextResponse.json({ success: false, error: "Invalid payload" }, { status: 400 });
        }

        let existingData = [];
        try {
            const content = await fs.readFile(TELEMETRY_FILE, "utf8");
            existingData = JSON.parse(content);
        } catch {
            existingData = [];
        }

        // Add new events
        const newData = [...payload, ...existingData].slice(0, 1000); // keep last 1000 events

        await fs.writeFile(TELEMETRY_FILE, JSON.stringify(newData, null, 2), "utf8");

        console.log(`✅ [Telemetry API] Stored ${payload.length} events anonymously.`);
        return NextResponse.json({ success: true, stored: payload.length });
    } catch (error: any) {
        console.error("❌ [Telemetry API] Error:", error.message);
        return NextResponse.json({ success: false }, { status: 400 });
    }
}

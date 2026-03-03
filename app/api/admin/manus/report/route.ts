import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const REPORTS_FILE = path.join(process.cwd(), "public", "audit-reports.json");

async function readReports() {
    try {
        const content = await fs.readFile(REPORTS_FILE, "utf8");
        return JSON.parse(content);
    } catch {
        return [];
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const reports = await readReports();

        const entry = {
            source: "manus",
            timestamp: new Date().toISOString(),
            receivedAt: new Date().toISOString(),
            findings: Array.isArray(body.findings) ? body.findings : [],
            scores: body.scores || {},
            raw: body
        };

        reports.unshift(entry);
        const trimmed = reports.slice(0, 50);
        await fs.writeFile(REPORTS_FILE, JSON.stringify(trimmed, null, 2));

        console.log(`[Manus Report] Received and unified in ${REPORTS_FILE}`);

        return NextResponse.json({ success: true, message: "Report unified and saved." });
    } catch (error: any) {
        console.error("[Manus Report] Error unifying report:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

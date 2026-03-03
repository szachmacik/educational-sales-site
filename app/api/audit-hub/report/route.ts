import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const REPORTS_FILE = path.join(process.cwd(), "data", "audit-reports.json");

function readReports() {
    if (!fs.existsSync(REPORTS_FILE)) return [];
    try {
        return JSON.parse(fs.readFileSync(REPORTS_FILE, "utf8"));
    } catch {
        return [];
    }
}

export async function GET() {
    const reports = readReports();
    return NextResponse.json(reports);
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const reports = readReports();
        const entry = {
            ...body,
            timestamp: body.timestamp || new Date().toISOString(),
            receivedAt: new Date().toISOString(),
        };
        reports.unshift(entry);
        // Keep last 50 reports
        const trimmed = reports.slice(0, 50);
        fs.writeFileSync(REPORTS_FILE, JSON.stringify(trimmed, null, 2), "utf8");
        return NextResponse.json({ success: true, id: reports.length });
    } catch (e) {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }
}


import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

// NIP lookup API using the public rejestr.io service
// Alternative: you can register for official GUS API at regon_bir@stat.gov.pl

export async function GET(request: NextRequest) {
    // SEC-FIX: Rate limit NIP lookups to prevent abuse (10 req/min per IP)
    const clientIp = getClientIp(request);
    const rateLimitResult = checkRateLimit(`nip-lookup:${clientIp}`, { limit: 10, windowSecs: 60 });
    if (!rateLimitResult.success) {
        return NextResponse.json(
            { error: "Too many requests. Please try again later." },
            {
                status: 429,
                headers: {
                    'Retry-After': String(Math.ceil((rateLimitResult.resetAt - Date.now()) / 1000)),
                    'X-RateLimit-Limit': '10',
                    'X-RateLimit-Remaining': '0',
                }
            }
        );
    }

    const nip = request.nextUrl.searchParams.get("nip");

    if (!nip) {
        return NextResponse.json({ error: "NIP is required" }, { status: 400 });
    }

    // Clean NIP - remove dashes and spaces
    const cleanNip = nip.replace(/[-\s]/g, "");

    // Validate NIP format (10 digits)
    if (!/^\d{10}$/.test(cleanNip)) {
        return NextResponse.json({ error: "Invalid NIP format (10 digits required)" }, { status: 400 });
    }

    try {
        // Use rejestr.io public API (free, no registration required)
        const response = await fetch(`https://rejestr.io/api/v2/org?nip=${cleanNip}`, {
            headers: {
                "Accept": "application/json",
            },
        });

        if (!response.ok) {
            // Try backup API - wl-api.mf.gov.pl (Ministry of Finance - VAT check)
            const vatResponse = await fetch(
                `https://wl-api.mf.gov.pl/api/search/nip/${cleanNip}?date=${new Date().toISOString().split("T")[0]}`
            );

            if (vatResponse.ok) {
                const vatData = await vatResponse.json();
                if (vatData.result?.subject) {
                    const subject = vatData.result.subject;
                    return NextResponse.json({
                        found: true,
                        company: subject.name,
                        nip: subject.nip,
                        regon: subject.regon || "",
                        address: subject.workingAddress || subject.residenceAddress || "",
                        status: subject.statusVat,
                    });
                }
            }

            return NextResponse.json({
                found: false,
                error: "No company found for the given NIP"
            }, { status: 404 });
        }

        const data = await response.json();

        if (data && data.length > 0) {
            const company = data[0];
            return NextResponse.json({
                found: true,
                company: company.nazwa || company.name,
                nip: company.nip,
                regon: company.regon || "",
                address: company.adres || company.address || "",
                krs: company.krs || "",
            });
        }

        return NextResponse.json({
            found: false,
            error: "Nie znaleziono firmy o podanym NIP"
        }, { status: 404 });

    } catch (error) {
        console.error("NIP lookup error:", error);

        // Fallback to Ministry of Finance API
        try {
            const vatResponse = await fetch(
                `https://wl-api.mf.gov.pl/api/search/nip/${cleanNip}?date=${new Date().toISOString().split("T")[0]}`
            );

            if (vatResponse.ok) {
                const vatData = await vatResponse.json();
                if (vatData.result?.subject) {
                    const subject = vatData.result.subject;
                    return NextResponse.json({
                        found: true,
                        company: subject.name,
                        nip: subject.nip,
                        regon: subject.regon || "",
                        address: subject.workingAddress || subject.residenceAddress || "",
                        status: subject.statusVat,
                    });
                }
            }
        } catch {
            // Ignore fallback errors
        }

        return NextResponse.json(
            { error: "Search error. Please try again." },
            { status: 500 }
        );
    }
}

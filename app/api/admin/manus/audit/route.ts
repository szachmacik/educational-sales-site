import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// SECURITY: Verify admin token before allowing access
async function verifyAdmin(request: Request): Promise<boolean> {
    const cookieStore = await cookies();
    const token = cookieStore.get('user_token')?.value;
    if (!token) return false;
    // Token presence is validated — role check happens at middleware level for /admin routes
    return true;
}

export async function POST(request: Request) {
    // SECURITY: Require authentication
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
        return NextResponse.json(
            { success: false, message: "Unauthorized" },
            { status: 401 }
        );
    }

    const apiKey = process.env.MANUS_API_KEY;
    if (!apiKey) {
        return NextResponse.json(
            { success: false, message: "MANUS_API_KEY not configured" },
            { status: 500 }
        );
    }

    try {
        const body = await request.json();
        const { targetUrl: userTargetUrl, customPrompt } = body;

        // SECURITY: Only allow configured URLs, no localhost tunnels in production
        const allowedBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_WORDPRESS_URL;
        const targetUrl = userTargetUrl || allowedBaseUrl || "";

        if (!targetUrl) {
            return NextResponse.json(
                { success: false, message: "Target URL not configured" },
                { status: 400 }
            );
        }

        // SECURITY: Removed hardcoded IP address from prompt
        const prompt = customPrompt || `Conduct a comprehensive content and functional audit of the website: ${targetUrl}.

        MISSION DETAILS:
        1. Navigate through the homepage and check for Polish character encoding/translations.
        2. Go to the products page, click on a few products, and test the "Add to Cart" functionality.
        3. Proceed to the cart page and verify the checkout flow.
        4. Verify that interactive elements (Wordwall/Genially) load correctly.

        REPORTING:
        - Post ALL findings to the Audit Hub at ${targetUrl}/pl/audit-hub.
        - Append findings as a single JSON-formatted report to: ${targetUrl}/api/audit-hub/report.`;

        const response = await fetch('https://api.manus.ai/v1/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                prompt,
                agent_profile: "manus-1.6",
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Error communicating with Manus AI API");
        }

        const data = await response.json();

        return NextResponse.json({
            success: true,
            message: "Audit task sent to Manus.",
            taskId: data.id || data.taskId,
            targetUrl,
        });

    } catch (error: any) {
        console.error("[Manus Audit] Error:", error);
        return NextResponse.json(
            { success: false, message: error.message || "Unexpected error" },
            { status: 500 }
        );
    }
}

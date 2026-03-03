import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { source, items, timestamp } = body;

        console.log(`[Agent Webhook] Received data from ${source}`);
        console.log(`[Agent Webhook] Items found: ${items.length}`);

        // In a real application, you would:
        // 1. Validate the secret key
        // 2. Save items to a "Drafts" database table
        // 3. Trigger a notification for the admin

        // Simulating processing delay
        await new Promise(resolve => setTimeout(resolve, 500));

        return NextResponse.json({
            success: true,
            message: `Successfully accepted ${items.length} items from ${source}`,
            syncId: Date.now().toString()
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Invalid JSON payload" },
            { status: 400 }
        );
    }
}

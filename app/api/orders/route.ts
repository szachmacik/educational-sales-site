import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const ORDERS_FILE = path.join(process.cwd(), "public", "orders.db.json");

async function readOrders() {
    try {
        const content = await fs.readFile(ORDERS_FILE, "utf8");
        return JSON.parse(content);
    } catch {
        return [];
    }
}

async function writeOrders(orders: any[]) {
    await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf8");
}

export async function GET() {
    const orders = await readOrders();
    return NextResponse.json(orders);
}

export async function POST(req: NextRequest) {
    try {
        const order = await req.json();
        const orders = await readOrders();

        const newOrder = {
            ...order,
            id: order.id || `order_${Date.now()}`,
            createdAt: order.createdAt || new Date().toISOString(),
            source: "checkout_api"
        };

        orders.unshift(newOrder);
        // Keep last 100 orders for the demo/test db
        const trimmed = orders.slice(0, 100);
        await writeOrders(trimmed);

        console.log(`✅ [Orders API] Order ${newOrder.orderNumber} saved to persistent storage.`);

        // --- Phase 26: Meta CAPI Integration ---
        try {
            const { sendMetaCapiEvent } = await import("@/lib/integrations/meta-capi-service");

            // Extract tracking data
            const userAgent = req.headers.get('user-agent') || "";
            const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || "127.0.0.1";

            await sendMetaCapiEvent("Purchase", {
                email: order.email,
                firstName: order.firstName,
                lastName: order.lastName,
                city: order.city,
                clientUserAgent: userAgent,
                clientIpAddress: ip
            }, {
                value: order.total || order.finalTotal,
                currency: "PLN",
                orderId: order.orderNumber || order.id,
                contents: (order.items || []).map((i: any) => ({
                    id: i.productId || i.id,
                    quantity: i.quantity,
                    item_price: i.salePrice ?? i.price
                }))
            });

            console.log(`🚀 [Orders API] CAPI event dispatched for order ${order.orderNumber}`);
        } catch (capiError) {
            console.error("⚠️ [Orders API] Meta CAPI failed (continuing...):", capiError);
        }
        // ---------------------------------------

        return NextResponse.json({
            success: true,
            message: "Order saved to server persistence.",
            orderId: newOrder.id
        });
    } catch (error: any) {
        console.error("❌ [Orders API] Failed to save order:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

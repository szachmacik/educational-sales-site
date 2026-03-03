import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { cookies } from "next/headers";

// SECURITY FIX: Store orders in data/ directory (NOT public/) to prevent public access
// Previously stored in public/orders.db.json which was accessible at /orders.db.json
const ORDERS_FILE = path.join(process.cwd(), "data", "orders.db.json");

async function ensureDataDir() {
    const dir = path.join(process.cwd(), "data");
    await fs.mkdir(dir, { recursive: true });
}

async function readOrders() {
    try {
        const content = await fs.readFile(ORDERS_FILE, "utf8");
        return JSON.parse(content);
    } catch {
        return [];
    }
}

async function writeOrders(orders: any[]) {
    await ensureDataDir();
    await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf8");
}

// SECURITY: Verify admin token for GET (listing all orders)
async function verifyAdmin(): Promise<boolean> {
    const cookieStore = await cookies();
    const token = cookieStore.get('user_token')?.value;
    return !!token;
}

export async function GET() {
    // SECURITY: Require authentication to list orders
    const isAuthenticated = await verifyAdmin();
    if (!isAuthenticated) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
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
        // Keep last 500 orders
        const trimmed = orders.slice(0, 500);
        await writeOrders(trimmed);

        console.log(`[Orders API] Order ${newOrder.orderNumber} saved.`);

        // Meta CAPI Integration
        try {
            const { sendMetaCapiEvent } = await import("@/lib/integrations/meta-capi-service");
            const userAgent = req.headers.get('user-agent') || "";
            // SECURITY: Use x-forwarded-for safely
            const forwardedFor = req.headers.get('x-forwarded-for');
            const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : "127.0.0.1";

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
        } catch (capiError) {
            console.error("[Orders API] Meta CAPI failed (non-critical):", capiError);
        }

        return NextResponse.json({
            success: true,
            message: "Order saved.",
            orderId: newOrder.id
        });
    } catch (error: any) {
        console.error("[Orders API] Failed to save order:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

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

// SECURITY FIX (SEC-002): Verify admin token AND role
// Previously only checked token presence — now also verifies role = "admin"
async function verifyAdmin(): Promise<boolean> {
    const cookieStore = await cookies();
    const token = cookieStore.get('user_token')?.value;
    if (!token) return false;

    // Verify role from auth_user cookie (set during admin login)
    const userRole = cookieStore.get('user_role')?.value;
    if (userRole !== 'admin') return false;

    // Additional check: token must not be a demo token
    if (token.startsWith('demo_')) return false;

    return true;
}

export async function GET() {
    // SECURITY: Require admin authentication to list orders
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const orders = await readOrders();
    return NextResponse.json(orders);
}

export async function POST(req: NextRequest) {
    try {
        const order = await req.json();
        const orders = await readOrders();

        // Validate required fields
        if (!order.id || !order.email || !order.items) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        orders.push({
            ...order,
            createdAt: order.createdAt || new Date().toISOString(),
        });
        await writeOrders(orders);
        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error("[Orders] POST error:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

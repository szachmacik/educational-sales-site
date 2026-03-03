import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import fs from "fs/promises";
import path from "path";

const PRODUCTS_PATH = path.join(process.cwd(), "lib", "data", "products.json");

export async function GET() {
    const authError = await requireAuth();
    if (authError) return authError;

        try {
        const fileContents = await fs.readFile(PRODUCTS_PATH, "utf8");
        const products = JSON.parse(fileContents);
        return NextResponse.json(products);
    } catch (error) {
        console.error("Failed to fetch products:", error);
        return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const authError = await requireAuth();
    if (authError) return authError;

        try {
        const products = await request.json();

        if (!Array.isArray(products)) {
            return NextResponse.json({ error: "Invalid product data" }, { status: 400 });
        }

        await fs.writeFile(PRODUCTS_PATH, JSON.stringify(products, null, 2), "utf8");

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to save products:", error);
        return NextResponse.json({ error: "Failed to save products" }, { status: 500 });
    }
}

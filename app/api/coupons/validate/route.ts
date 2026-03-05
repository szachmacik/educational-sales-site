import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const COUPONS_FILE = path.join(process.cwd(), "data", "coupons.json");

// Default sample coupons for demo purposes
const DEFAULT_COUPONS = [
  {
    code: "WELCOME10",
    type: "percent",
    value: 10,
    description: "10% zniżki dla nowych klientów",
    minOrder: 0,
    maxUses: 1000,
    usedCount: 0,
    active: true,
    expiresAt: null,
  },
  {
    code: "NAUCZYCIEL20",
    type: "percent",
    value: 20,
    description: "20% zniżki dla nauczycieli",
    minOrder: 50,
    maxUses: 500,
    usedCount: 0,
    active: true,
    expiresAt: null,
  },
  {
    code: "BACK2SCHOOL",
    type: "percent",
    value: 15,
    description: "15% zniżki na powrót do szkoły",
    minOrder: 30,
    maxUses: 200,
    usedCount: 0,
    active: true,
    expiresAt: null,
  },
  {
    code: "GRATIS5",
    type: "fixed",
    value: 5,
    description: "5 zł rabatu",
    minOrder: 20,
    maxUses: 300,
    usedCount: 0,
    active: true,
    expiresAt: null,
  },
];

async function readCoupons() {
  try {
    const content = await fs.readFile(COUPONS_FILE, "utf8");
    return JSON.parse(content);
  } catch {
    // Return default coupons if file doesn't exist
    return DEFAULT_COUPONS;
  }
}

async function writeCoupons(coupons: any[]) {
  const dir = path.join(process.cwd(), "data");
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(COUPONS_FILE, JSON.stringify(coupons, null, 2), "utf8");
}

export async function POST(req: NextRequest) {
  try {
    const { code, orderTotal } = await req.json();

    if (!code) {
      return NextResponse.json({ valid: false, error: "Brak kodu" }, { status: 400 });
    }

    const coupons = await readCoupons();
    const coupon = coupons.find(
      (c: any) => c.code.toUpperCase() === code.toUpperCase() && c.active
    );

    if (!coupon) {
      return NextResponse.json({
        valid: false,
        error: "Nieprawidłowy lub nieaktywny kod rabatowy",
      });
    }

    // Check expiry
    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return NextResponse.json({
        valid: false,
        error: "Kod rabatowy wygasł",
      });
    }

    // Check max uses
    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      return NextResponse.json({
        valid: false,
        error: "Kod rabatowy został już wykorzystany",
      });
    }

    // Check minimum order
    if (coupon.minOrder && orderTotal < coupon.minOrder) {
      return NextResponse.json({
        valid: false,
        error: `Minimalna wartość zamówienia to ${coupon.minOrder} zł`,
      });
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.type === "percent") {
      discountAmount = Math.round((orderTotal * coupon.value) / 100 * 100) / 100;
    } else if (coupon.type === "fixed") {
      discountAmount = Math.min(coupon.value, orderTotal);
    }

    return NextResponse.json({
      valid: true,
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      discountAmount,
      description: coupon.description,
    });
  } catch (err) {
    console.error("[Coupons] POST error:", err);
    return NextResponse.json({ valid: false, error: "Błąd serwera" }, { status: 500 });
  }
}

// GET - list all coupons (admin only)
export async function GET() {
  const coupons = await readCoupons();
  return NextResponse.json(coupons);
}

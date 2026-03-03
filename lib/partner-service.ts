export interface Partner {
    id: string;
    name: string;
    logoUrl: string;
    description: string;
    affiliateBaseUrl: string;
    affiliateParamName: string; // e.g., 'ref', 'aff', 'aid'
    affiliateId: string; // Kamil's ID for this partner
    voucherCostPoints: number;
}

export interface PartnerVoucher {
    partnerId: string;
    code: string;
    isUsed: boolean;
}

const PARTNERS_DB_KEY = "kamila_partners_db";
const VOUCHERS_DB_KEY = "kamila_vouchers_db";

export const DEFAULT_PARTNERS: Partner[] = [
    {
        id: "educational-hub",
        name: "Educational Hub",
        logoUrl: "/partners/edu-hub.png",
        description: "Najlepsze materiały do nauk ścisłych",
        affiliateBaseUrl: "https://eduhub.kamila.shor.dev",
        affiliateParamName: "ref",
        affiliateId: "kamil_english",
        voucherCostPoints: 1000
    },
    {
        id: "games-for-kids",
        name: "Games4Kids",
        logoUrl: "/partners/games4kids.png",
        description: "Interaktywne gry edukacyjne",
        affiliateBaseUrl: "https://g4k.kamila.shor.dev/store",
        affiliateParamName: "aid",
        affiliateId: "kamila",
        voucherCostPoints: 500
    }
];

export function getPartners(): Partner[] {
    if (typeof window === 'undefined') return DEFAULT_PARTNERS;
    const db = JSON.parse(localStorage.getItem(PARTNERS_DB_KEY) || "[]");
    return db.length > 0 ? db : DEFAULT_PARTNERS;
}

export function getVouchersForUser(userId: string): PartnerVoucher[] {
    if (typeof window === 'undefined') return [];
    const db = JSON.parse(localStorage.getItem(VOUCHERS_DB_KEY) || "{}");
    return db[userId] || [];
}

export function redeemVoucher(userId: string, partnerId: string, cost: number): string | null {
    if (typeof window === 'undefined') return null;

    // In a real app, this would fetch from a server-side pool.
    // Here we generate a mock one for demo purposes.
    const mockCode = `${partnerId.toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const db = JSON.parse(localStorage.getItem(VOUCHERS_DB_KEY) || "{}");
    const userVouchers = db[userId] || [];

    const newVoucher: PartnerVoucher = {
        partnerId,
        code: mockCode,
        isUsed: false
    };

    db[userId] = [...userVouchers, newVoucher];
    localStorage.setItem(VOUCHERS_DB_KEY, JSON.stringify(db));

    return mockCode;
}

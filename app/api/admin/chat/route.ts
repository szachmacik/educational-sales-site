import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import fs from "fs/promises";
import path from "path";

// ─── Auth ─────────────────────────────────────────────────────────────────────
async function verifyAdmin(): Promise<boolean> {
    const cookieStore = await cookies();
    const token = cookieStore.get('user_token')?.value;
    const role = cookieStore.get('user_role')?.value;
    return !!(token && role === 'admin' && !token.startsWith('demo_'));
}

// ─── Data helpers ─────────────────────────────────────────────────────────────
async function readOrders() {
    try {
        const file = path.join(process.cwd(), "data", "orders.db.json");
        const content = await fs.readFile(file, "utf8");
        return JSON.parse(content);
    } catch { return []; }
}

async function readSubscribers() {
    try {
        const file = path.join(process.cwd(), "data", "newsletter-subscribers.json");
        const content = await fs.readFile(file, "utf8");
        return JSON.parse(content);
    } catch { return []; }
}

// ─── Smart rule-based assistant ───────────────────────────────────────────────
async function generateResponse(message: string): Promise<string> {
    const msg = message.toLowerCase().trim();
    const orders = await readOrders();
    const subscribers = await readSubscribers();

    // ── Revenue / Sales queries ───────────────────────────────────────────────
    if (msg.match(/przychód|revenue|sprzedaż|zarobki|ile zarobiłam|ile sprzedałam|obrót/)) {
        const total = orders.reduce((s: number, o: any) => s + (Number(o.total) || 0), 0);
        const now = new Date();
        const thisMonth = orders.filter((o: any) => {
            const d = new Date(o.createdAt);
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        });
        const monthRevenue = thisMonth.reduce((s: number, o: any) => s + (Number(o.total) || 0), 0);
        return `💰 **Podsumowanie przychodów:**\n\n- **Łączny przychód:** ${total.toFixed(2)} zł\n- **Ten miesiąc:** ${monthRevenue.toFixed(2)} zł (${thisMonth.length} zamówień)\n- **Wszystkie zamówienia:** ${orders.length}\n- **Śr. wartość zamówienia:** ${orders.length > 0 ? (total / orders.length).toFixed(2) : '0.00'} zł\n\nSzczegółowe wykresy znajdziesz na stronie [Analityka](/pl/admin/analytics).`;
    }

    // ── Orders queries ────────────────────────────────────────────────────────
    if (msg.match(/zamówieni|orders|ile zamówień|ostatnie zamówienia|nowe zamówienia/)) {
        const recent = orders.slice(-5).reverse();
        const pending = orders.filter((o: any) => o.status === 'pending').length;
        const completed = orders.filter((o: any) => ['completed', 'paid'].includes(o.status)).length;
        let response = `📦 **Zamówienia:**\n\n- **Łącznie:** ${orders.length}\n- **Oczekujące:** ${pending}\n- **Zrealizowane:** ${completed}\n\n`;
        if (recent.length > 0) {
            response += `**Ostatnie 5 zamówień:**\n`;
            recent.forEach((o: any) => {
                response += `- #${o.orderNumber || o.id?.slice(0, 8)} — ${(Number(o.total) || 0).toFixed(2)} zł (${o.status})\n`;
            });
        }
        return response;
    }

    // ── Newsletter queries ────────────────────────────────────────────────────
    if (msg.match(/newsletter|subskrybent|subscriber|mailing|lista mailingowa/)) {
        const active = subscribers.filter((s: any) => s.active !== false).length;
        return `📧 **Newsletter:**\n\n- **Łączna liczba subskrybentów:** ${subscribers.length}\n- **Aktywni:** ${active}\n- **Nieaktywni:** ${subscribers.length - active}\n\nZarządzaj listą na stronie [Newsletter](/pl/admin/newsletter).`;
    }

    // ── Products queries ──────────────────────────────────────────────────────
    if (msg.match(/produkt|product|materiał|ile produktów|katalog/)) {
        try {
            const productsFile = path.join(process.cwd(), "public", "products.json");
            const content = await fs.readFile(productsFile, "utf8");
            const products = JSON.parse(content);
            const categories = [...new Set(products.flatMap((p: any) => p.categories || []))];
            return `📚 **Produkty w katalogu:**\n\n- **Łączna liczba:** ${products.length}\n- **Kategorie (${categories.length}):** ${categories.slice(0, 8).join(', ')}${categories.length > 8 ? '...' : ''}\n\nZarządzaj produktami na stronie [Produkty](/pl/admin/products).`;
        } catch {
            return `📚 Zarządzaj produktami na stronie [Produkty](/pl/admin/products).`;
        }
    }

    // ── Coupon queries ────────────────────────────────────────────────────────
    if (msg.match(/kupon|coupon|rabat|discount|kod rabatowy/)) {
        return `🎟️ **Kody rabatowe:**\n\nAktywne kody: WELCOME10 (10%), NAUCZYCIEL20 (20%), BACK2SCHOOL (15%), GRATIS5 (5 zł), SUMMER50 (50 zł), PRZEDSZKOLE10 (10%).\n\nZarządzaj kuponami na stronie [Kupony](/pl/admin/coupons).`;
    }

    // ── Blog queries ──────────────────────────────────────────────────────────
    if (msg.match(/blog|artykuł|post|wpis|content/)) {
        try {
            const { ALL_BLOG_POSTS } = await import("@/lib/blog-schema");
            return `✍️ **Blog:**\n\n- **Opublikowane artykuły:** ${ALL_BLOG_POSTS.length}\n- **Kategorie:** Metody nauczania, Materiały dydaktyczne, Technologia, Rozwój zawodowy, Inspiracje\n\nZarządzaj blogiem na stronie [Blog](/pl/admin/blog).`;
        } catch {
            return `✍️ Zarządzaj blogiem na stronie [Blog](/pl/admin/blog).`;
        }
    }

    // ── Settings / help ───────────────────────────────────────────────────────
    if (msg.match(/ustawienia|settings|konfiguracja|płatności|paynow|stripe|zen/)) {
        return `⚙️ **Ustawienia sklepu:**\n\nKonfiguracja bramek płatności (PayNow, Stripe, Zen), dane sklepu i integracje dostępne na stronie [Ustawienia](/pl/admin/settings).\n\nAby aktywować bramkę płatności, przejdź do Ustawienia → Integracje i wprowadź klucze API.`;
    }

    // ── Greeting ──────────────────────────────────────────────────────────────
    if (msg.match(/^(cześć|hej|hello|hi|dzień dobry|siema|witaj|helo)/)) {
        return `👋 Cześć! Jestem asystentem panelu admina. Mogę Ci pomóc z:\n\n- 📊 **Statystykami** — zapytaj o przychód, zamówienia, subskrybentów\n- 📦 **Zamówieniami** — sprawdź ostatnie zamówienia i statusy\n- 📚 **Produktami** — informacje o katalogu\n- 🎟️ **Kuponami** — aktywne kody rabatowe\n- ✍️ **Blogiem** — statystyki artykułów\n- ⚙️ **Ustawieniami** — konfiguracja sklepu\n\nO co chcesz zapytać?`;
    }

    // ── Help ──────────────────────────────────────────────────────────────────
    if (msg.match(/pomoc|help|co umiesz|co możesz|jak działa/)) {
        return `🤖 **Co mogę zrobić:**\n\n- Podać statystyki sprzedaży i przychodów\n- Pokazać ostatnie zamówienia\n- Sprawdzić liczbę subskrybentów newslettera\n- Podać informacje o produktach i kuponach\n- Wskazać właściwe sekcje panelu admina\n\n**Przykładowe pytania:**\n- "Jaki był przychód w tym miesiącu?"\n- "Ile mam zamówień?"\n- "Ile osób zapisało się do newslettera?"\n- "Jakie kody rabatowe są aktywne?"`;
    }

    // ── Quick navigation ──────────────────────────────────────────────────────
    if (msg.match(/analityk|wykres|statystyk|raport/)) {
        const total = orders.reduce((s: number, o: any) => s + (Number(o.total) || 0), 0);
        return `📈 **Szybkie statystyki:**\n\n- **Zamówienia:** ${orders.length}\n- **Przychód:** ${total.toFixed(2)} zł\n- **Subskrybenci:** ${subscribers.length}\n\nPełne wykresy i raporty: [Analityka](/pl/admin/analytics)`;
    }

    // ── Default ───────────────────────────────────────────────────────────────
    return `Rozumiem pytanie o: *"${message}"*\n\nNie mam szczegółowej odpowiedzi na to pytanie, ale mogę pomóc z:\n\n- Statystykami sprzedaży i przychodów\n- Informacjami o zamówieniach\n- Danymi o subskrybentach newslettera\n- Informacjami o produktach i kuponach\n\nWpisz "pomoc" aby zobaczyć pełną listę możliwości.`;
}

// ─── Route handler ────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { message } = await req.json();
        if (!message || typeof message !== 'string') {
            return NextResponse.json({ error: "Invalid message" }, { status: 400 });
        }

        const response = await generateResponse(message);
        return NextResponse.json({ response, timestamp: Date.now() });
    } catch (error) {
        console.error("Admin chat error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

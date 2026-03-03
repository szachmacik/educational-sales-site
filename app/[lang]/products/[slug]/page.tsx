import { ProductDetailView } from "@/components/product/product-detail-view";
import { LanguageProvider } from "@/components/language-provider";
import fs from 'fs/promises';
import path from 'path';

// Product pages use client-side hooks (useLanguage, useCart, useTokens) — cannot be statically prerendered
export const dynamic = 'force-dynamic';

async function getDictionary(lang: string, namespace: string) {
    try {
        const filePath = path.join(process.cwd(), 'public', 'locales', lang, `${namespace}.json`);
        const fileContents = await fs.readFile(filePath, 'utf8');
        return JSON.parse(fileContents);
    } catch (error) {
        return {};
    }
}

export default async function ProductPage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
    const { lang, slug } = await params;

    // Inject shop namespace for product translations
    const common = await getDictionary(lang, 'common');
    const shop = await getDictionary(lang, 'shop');
    const combined = { ...common, ...shop };

    return (
        <LanguageProvider lang={lang} dictionary={combined}>
            <ProductDetailView slug={slug} />
        </LanguageProvider>
    );
}

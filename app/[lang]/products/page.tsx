
export const dynamic = 'force-dynamic';
import { LanguageProvider } from "@/components/language-provider";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ProductsContent } from "@/components/products/products-content";
import fs from 'fs/promises';
import path from 'path';
import { deepMerge } from '@/lib/utils';

import type { Metadata } from 'next';

// SERVER COMPONENT (Async)
async function getDictionary(lang: string, namespace: string) {
    try {
        const filePath = path.join(process.cwd(), 'public', 'locales', lang, `${namespace}.json`);
        const fileContents = await fs.readFile(filePath, 'utf8');
        return JSON.parse(fileContents);
    } catch (error) {
        return {};
    }
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const { lang } = await params;
    const common = await getDictionary(lang, 'common');
    return {
        title: `${common?.nav?.products || 'Produkty'} - ${common?.seo?.title || 'Kamila English'}`,
        description: common?.seo?.description || 'Przeglądaj wszystkie scenariusze, pakiety, ebooki i gry językowe w naszym sklepie.',
    };
}

export default async function ProductsPage({ params }: { params: Promise<{ lang: string }> }) {
    // 1. Fetch Namespace
    const { lang } = await params;
    const common = await getDictionary(lang, 'common');
    const shop = await getDictionary(lang, 'shop');
    const landing = await getDictionary(lang, 'landing');

    const combined = deepMerge(deepMerge(common, shop), landing);

    return (
        <LanguageProvider lang={lang} dictionary={combined}>
            <div className="min-h-screen bg-background flex flex-col">
                <Header />
                <ProductsContent lang={lang} />
                <Footer />
            </div>
        </LanguageProvider>
    );
}

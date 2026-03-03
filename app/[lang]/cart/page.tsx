import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { LanguageProvider } from "@/components/language-provider";
import { CartView } from "@/components/cart/cart-view";
import fs from 'fs/promises';
import path from 'path';

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

export default async function CartPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const common = await getDictionary(lang, 'common');
    const shop = await getDictionary(lang, 'shop');
    const dictionary = { ...common, ...shop };

    return (
        <LanguageProvider lang={lang} dictionary={dictionary}>
            <div className="min-h-screen flex flex-col">
                <Header />
                <CartView />
                <Footer />
            </div>
        </LanguageProvider>
    );
}

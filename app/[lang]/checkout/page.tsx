
export const dynamic = 'force-dynamic';
import { LanguageProvider } from "@/components/language-provider";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CheckoutContent } from "@/components/checkout/checkout-content";
import { BrandLogo } from "@/components/brand-logo";
import fs from 'fs/promises';
import path from 'path';

async function getDictionary(lang: string, namespace: string) {
    try {
        const filePath = path.join(process.cwd(), 'public', 'locales', lang, `${namespace}.json`);
        const fileContents = await fs.readFile(filePath, 'utf8');
        return JSON.parse(fileContents);
    } catch (error) {
        return {};
    }
}

export default async function CheckoutPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const common = await getDictionary(lang, 'common');
    const shop = await getDictionary(lang, 'shop');
    const combined = { ...common, ...shop };

    return (
        <LanguageProvider lang={lang} dictionary={combined}>
            <div className="min-h-screen flex flex-col bg-slate-50">
                {/* Minimalist Enclosed Header */}
                <header className="w-full bg-white border-b border-slate-100 py-4 px-6 flex justify-between items-center z-10 relative">
                    <BrandLogo size="sm" showText={true} className="text-slate-900" />
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                        SSL SECURE CHECKOUT
                    </div>
                </header>
                <CheckoutContent />
            </div>
        </LanguageProvider>
    );
}

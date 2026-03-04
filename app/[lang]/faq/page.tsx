import { LanguageProvider } from "@/components/language-provider";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { FAQView } from "@/components/faq/faq-view";
import fs from 'fs/promises';
import path from 'path';
import type { Metadata } from 'next';

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

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const { lang } = await params;
    const common = await getDictionary(lang, 'common');
    return {
        title: `${
            lang === 'pl' ? 'FAQ - Najczęściej Zadawane Pytania' : 'FAQ - Frequently Asked Questions'
        } - ${common?.seo?.title || 'Kamila English'}`,
        description: lang === 'pl'
            ? 'Odpowiedzi na najczęściej zadawane pytania dotyczące zakupów, płatności, dostępu do materiałów i faktur.'
            : 'Answers to frequently asked questions about purchases, payments, access to materials, and invoices.',
    };
}

export default async function FAQPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const common = await getDictionary(lang, 'common');

    return (
        <LanguageProvider lang={lang} dictionary={common}>
            <div className="min-h-screen flex flex-col">
                <Header />
                <FAQView lang={lang} />
                <Footer />
            </div>
        </LanguageProvider>
    );
}

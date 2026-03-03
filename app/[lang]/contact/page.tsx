import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { LanguageProvider } from "@/components/language-provider";
import { ContactView } from "@/components/contact/contact-view";
import fs from 'fs/promises';
import path from 'path';
import { deepMerge } from '@/lib/utils';

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
    const contact = await getDictionary(lang, 'contact');
    return {
        title: `${common?.nav?.contact || 'Kontakt'} - ${common?.seo?.title || 'Kamila English'}`,
        description: contact?.subtitle || 'Skontaktuj się z nami w razie pytań, sugestii lub problemów.',
    };
}

export default async function ContactPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const common = await getDictionary(lang, 'common');
    const contact = await getDictionary(lang, 'contact');
    const dictionary = deepMerge(common, contact);

    return (
        <LanguageProvider lang={lang} dictionary={dictionary}>
            <div className="min-h-screen flex flex-col">
                <Header />
                <ContactView />
                <Footer />
            </div>
        </LanguageProvider>
    );
}

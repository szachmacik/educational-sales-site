import { LanguageProvider } from "@/components/language-provider";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import fs from 'fs/promises';
import path from 'path';
import { deepMerge } from '@/lib/utils';

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

export default async function FAQPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const common = await getDictionary(lang, 'common');

    // FAQ can stay in and be handled by dictionaries if wanted, 
    // but for now let's just use the server component pattern.
    const dictionary = common;

    const faqItems = [
        {
            q: { pl: "Jakie metody płatności akceptujecie?", en: "What payment methods do you accept?" },
            a: { pl: "Akceptujemy BLIK, karty płatnicze (Stripe) oraz przelewy bankowe.", en: "We accept BLIK, credit cards (Stripe), and bank transfers." }
        },
        {
            q: { pl: "Kiedy otrzymam dostęp do materiałów?", en: "When will I get access to the materials?" },
            a: { pl: "Dostęp jest przyznawany natychmiast po opłaceniu zamówienia. Pliki znajdziesz w swoim panelu studenta.", en: "Access is granted immediately after payment. Files can be found in your student dashboard." }
        },
        {
            q: { pl: "Czy wystawiacie faktury VAT?", en: "Do you issue VAT invoices?" },
            a: { pl: "Tak, wystawiamy faktury VAT (OSS) dla firm i osób prywatnych.", en: "Yes, we issue VAT (OSS) invoices for businesses and individuals." }
        }
    ];

    return (
        <LanguageProvider lang={lang} dictionary={dictionary}>
            <div className="min-h-screen flex flex-col">
                <Header />
                <div className="container mx-auto px-4 py-12 max-w-3xl flex-1">
                    <h1 className="text-4xl font-bold mb-8 text-center">
                        {lang === 'pl' ? 'Najczęściej Zadawane Pytania' : 'Frequently Asked Questions'}
                    </h1>
                    <div className="space-y-6">
                        {faqItems.map((item, i) => (
                            <div key={i} className="border-b pb-4">
                                <h3 className="text-xl font-semibold mb-2">{item.q[lang as keyof typeof item.q] || item.q.en}</h3>
                                <p className="text-gray-600">{item.a[lang as keyof typeof item.a] || item.a.en}</p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-12 text-center text-gray-500">
                        {lang === 'pl' ? 'Potrzebujesz więcej pomocy? Skontaktuj się z nami!' : 'Need more help? Contact us!'}
                    </div>
                </div>
                <Footer />
            </div>
        </LanguageProvider>
    );
}

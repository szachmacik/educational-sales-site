"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, MessageCircle, Mail } from "lucide-react";
import Link from "next/link";

interface FAQItem {
    q: Record<string, string>;
    a: Record<string, string>;
    category: string;
}

const FAQ_ITEMS: FAQItem[] = [
    // Zakupy i płatności
    {
        category: "payments",
        q: {
            pl: "Jakie metody płatności akceptujecie?",
            en: "What payment methods do you accept?",
        },
        a: {
            pl: "Akceptujemy BLIK, karty płatnicze Visa i Mastercard (przez Stripe), przelewy bankowe oraz PayNow (mBank). Wszystkie płatności są szyfrowane i bezpieczne.",
            en: "We accept BLIK, Visa and Mastercard credit/debit cards (via Stripe), bank transfers, and PayNow (mBank). All payments are encrypted and secure.",
        },
    },
    {
        category: "payments",
        q: {
            pl: "Czy mogę zapłacić w ratach?",
            en: "Can I pay in installments?",
        },
        a: {
            pl: "Aktualnie nie oferujemy płatności ratalnych. Wszystkie produkty muszą zostać opłacone jednorazowo. Jeśli interesuje Cię licencja szkolna lub grupowa, skontaktuj się z nami — możemy przygotować indywidualną ofertę.",
            en: "We currently do not offer installment payments. All products must be paid in full. If you are interested in a school or group license, contact us — we can prepare an individual offer.",
        },
    },
    {
        category: "payments",
        q: {
            pl: "Czy wystawiacie faktury VAT?",
            en: "Do you issue VAT invoices?",
        },
        a: {
            pl: "Tak, wystawiamy faktury VAT (OSS) dla firm i osób prywatnych z całej Unii Europejskiej. Po zakupie skontaktuj się z nami podając numer NIP lub VAT-UE, a wystawimy fakturę w ciągu 3 dni roboczych.",
            en: "Yes, we issue VAT (OSS) invoices for businesses and individuals across the European Union. After purchase, contact us with your VAT number and we will issue an invoice within 3 business days.",
        },
    },
    {
        category: "payments",
        q: {
            pl: "Czy płatność jest bezpieczna?",
            en: "Is the payment secure?",
        },
        a: {
            pl: "Tak. Nie przechowujemy danych kart płatniczych — wszystkie transakcje są obsługiwane przez certyfikowane bramki płatnicze (Stripe, PayNow). Połączenie jest szyfrowane protokołem TLS/SSL.",
            en: "Yes. We do not store card data — all transactions are handled by certified payment gateways (Stripe, PayNow). The connection is encrypted with TLS/SSL.",
        },
    },
    // Dostęp do materiałów
    {
        category: "access",
        q: {
            pl: "Kiedy otrzymam dostęp do materiałów?",
            en: "When will I get access to the materials?",
        },
        a: {
            pl: "Dostęp jest przyznawany natychmiast po potwierdzeniu płatności — zazwyczaj w ciągu kilku sekund. Pliki znajdziesz w swoim panelu studenta pod adresem /dashboard. Otrzymasz też e-mail z linkiem do pobrania.",
            en: "Access is granted immediately after payment confirmation — usually within a few seconds. Files can be found in your student dashboard at /dashboard. You will also receive an email with a download link.",
        },
    },
    {
        category: "access",
        q: {
            pl: "Na jak długo mam dostęp do zakupionych materiałów?",
            en: "How long do I have access to purchased materials?",
        },
        a: {
            pl: "Dostęp do zakupionych materiałów jest dożywotni. Możesz pobierać pliki wielokrotnie, bez ograniczeń czasowych.",
            en: "Access to purchased materials is lifetime. You can download files multiple times, with no time limits.",
        },
    },
    {
        category: "access",
        q: {
            pl: "Ile razy mogę pobrać plik?",
            en: "How many times can I download a file?",
        },
        a: {
            pl: "Nie ma limitu pobrań. Możesz pobierać zakupione materiały tyle razy, ile potrzebujesz, z dowolnego urządzenia po zalogowaniu się na swoje konto.",
            en: "There is no download limit. You can download purchased materials as many times as you need, from any device after logging into your account.",
        },
    },
    {
        category: "access",
        q: {
            pl: "Nie mogę znaleźć pobranych materiałów w panelu. Co robić?",
            en: "I cannot find downloaded materials in my dashboard. What should I do?",
        },
        a: {
            pl: "Upewnij się, że jesteś zalogowany na to samo konto, którym dokonałeś zakupu. Sprawdź folder ze spamem w swojej skrzynce e-mail. Jeśli problem nadal występuje, skontaktuj się z nami podając numer zamówienia.",
            en: "Make sure you are logged in with the same account used for the purchase. Check your spam folder. If the problem persists, contact us with your order number.",
        },
    },
    // Produkty
    {
        category: "products",
        q: {
            pl: "W jakim formacie są materiały?",
            en: "What format are the materials in?",
        },
        a: {
            pl: "Materiały są dostępne głównie w formacie PDF (do druku i pracy na ekranie) oraz w formatach edytowalnych (DOCX, PPTX) tam, gdzie jest to możliwe. Szczegóły formatu są opisane na stronie każdego produktu.",
            en: "Materials are available mainly in PDF format (for printing and on-screen work) and in editable formats (DOCX, PPTX) where possible. Format details are described on each product page.",
        },
    },
    {
        category: "products",
        q: {
            pl: "Czy materiały są zgodne z podstawą programową?",
            en: "Are the materials aligned with the curriculum?",
        },
        a: {
            pl: "Tak, nasze materiały dla szkół podstawowych i ponadpodstawowych są tworzone zgodnie z aktualną podstawą programową MEN. Każdy produkt zawiera informację o poziomie i grupie docelowej.",
            en: "Yes, our materials for primary and secondary schools are created in accordance with the current MEN curriculum. Each product includes information about the level and target group.",
        },
    },
    {
        category: "products",
        q: {
            pl: "Czy mogę wydrukować materiały?",
            en: "Can I print the materials?",
        },
        a: {
            pl: "Tak, wszystkie materiały w formacie PDF są przystosowane do druku. Zalecamy druk w formacie A4. Licencja na użytek osobisty i klasowy jest wliczona w cenę.",
            en: "Yes, all PDF materials are optimized for printing. We recommend A4 format. A personal and classroom use license is included in the price.",
        },
    },
    // Zwroty
    {
        category: "returns",
        q: {
            pl: "Czy mogę zwrócić zakupiony produkt?",
            en: "Can I return a purchased product?",
        },
        a: {
            pl: "Ze względu na cyfrowy charakter produktów, zwroty są możliwe wyłącznie przed pobraniem pliku. Jeśli masz problem z produktem lub nie spełnia on Twoich oczekiwań, skontaktuj się z nami — rozpatrzymy każdą sprawę indywidualnie.",
            en: "Due to the digital nature of the products, returns are only possible before downloading the file. If you have a problem with a product or it does not meet your expectations, contact us — we will handle each case individually.",
        },
    },
    {
        category: "returns",
        q: {
            pl: "Co zrobić, jeśli plik jest uszkodzony lub niekompletny?",
            en: "What should I do if the file is damaged or incomplete?",
        },
        a: {
            pl: "Skontaktuj się z nami niezwłocznie podając numer zamówienia i opis problemu. Wyślemy Ci poprawny plik lub zwrócimy pieniądze w ciągu 3 dni roboczych.",
            en: "Contact us immediately with your order number and a description of the problem. We will send you the correct file or issue a refund within 3 business days.",
        },
    },
    // Konto
    {
        category: "account",
        q: {
            pl: "Jak zresetować hasło?",
            en: "How do I reset my password?",
        },
        a: {
            pl: "Na stronie logowania kliknij 'Zapomniałem hasła' i podaj swój adres e-mail. Wyślemy Ci link do resetowania hasła. Jeśli nie otrzymasz wiadomości w ciągu 5 minut, sprawdź folder ze spamem.",
            en: "On the login page, click 'Forgot password' and enter your email address. We will send you a password reset link. If you do not receive the email within 5 minutes, check your spam folder.",
        },
    },
    {
        category: "account",
        q: {
            pl: "Czy mogę zmienić adres e-mail przypisany do konta?",
            en: "Can I change the email address associated with my account?",
        },
        a: {
            pl: "Tak, skontaktuj się z nami podając stary i nowy adres e-mail. Zmienimy dane w ciągu 1 dnia roboczego po weryfikacji tożsamości.",
            en: "Yes, contact us with your old and new email address. We will update the data within 1 business day after identity verification.",
        },
    },
    // Licencje
    {
        category: "license",
        q: {
            pl: "Czy mogę udostępnić materiały innym nauczycielom?",
            en: "Can I share materials with other teachers?",
        },
        a: {
            pl: "Standardowa licencja obejmuje użytek jednego nauczyciela i jego klas. Jeśli chcesz udostępnić materiały w całej szkole lub gronie pedagogicznym, zapraszamy do zakupu licencji szkolnej — skontaktuj się z nami po wycenę.",
            en: "The standard license covers use by one teacher and their classes. If you want to share materials across the whole school or teaching staff, please purchase a school license — contact us for a quote.",
        },
    },
    {
        category: "license",
        q: {
            pl: "Czy mogę używać materiałów komercyjnie (np. w szkole językowej)?",
            en: "Can I use the materials commercially (e.g., in a language school)?",
        },
        a: {
            pl: "Standardowa licencja nie obejmuje użytku komercyjnego poza własną klasą. Dla szkół językowych i innych podmiotów komercyjnych oferujemy licencje komercyjne — skontaktuj się z nami.",
            en: "The standard license does not cover commercial use beyond your own classroom. For language schools and other commercial entities, we offer commercial licenses — contact us.",
        },
    },
];

const CATEGORIES: Record<string, Record<string, string>> = {
    payments: { pl: "Płatności i zakupy", en: "Payments & purchases" },
    access: { pl: "Dostęp do materiałów", en: "Access to materials" },
    products: { pl: "Produkty", en: "Products" },
    returns: { pl: "Zwroty i reklamacje", en: "Returns & complaints" },
    account: { pl: "Konto", en: "Account" },
    license: { pl: "Licencja i prawa", en: "License & rights" },
};

function AccordionItem({ item, lang, isOpen, onToggle }: {
    item: FAQItem;
    lang: string;
    isOpen: boolean;
    onToggle: () => void;
}) {
    const q = item.q[lang] || item.q.en || item.q.pl;
    const a = item.a[lang] || item.a.en || item.a.pl;

    return (
        <div className="border border-gray-200 rounded-xl overflow-hidden transition-shadow hover:shadow-sm">
            <button
                onClick={onToggle}
                className="w-full flex items-start justify-between gap-4 p-5 text-left bg-white hover:bg-gray-50 transition-colors"
                aria-expanded={isOpen}
            >
                <span className="font-semibold text-gray-900 text-base leading-snug">{q}</span>
                <span className="flex-shrink-0 mt-0.5 text-purple-600">
                    {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </span>
            </button>
            {isOpen && (
                <div className="px-5 pb-5 bg-white border-t border-gray-100">
                    <p className="text-gray-600 leading-relaxed pt-3">{a}</p>
                </div>
            )}
        </div>
    );
}

export function FAQView({ lang }: { lang: string }) {
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const [activeCategory, setActiveCategory] = useState<string>("all");

    const categories = Object.keys(CATEGORIES);
    const filteredItems = activeCategory === "all"
        ? FAQ_ITEMS
        : FAQ_ITEMS.filter((item) => item.category === activeCategory);

    const headingText = lang === "pl" ? "Najczęściej Zadawane Pytania" : "Frequently Asked Questions";
    const subText = lang === "pl"
        ? "Znajdź odpowiedź na swoje pytanie lub skontaktuj się z nami."
        : "Find an answer to your question or contact us.";
    const allText = lang === "pl" ? "Wszystkie" : "All";
    const contactText = lang === "pl"
        ? "Nie znalazłeś odpowiedzi? Napisz do nas!"
        : "Didn't find an answer? Write to us!";
    const contactBtnText = lang === "pl" ? "Skontaktuj się" : "Contact us";

    return (
        <main className="flex-1 bg-gradient-to-b from-purple-50 to-white">
            {/* Hero */}
            <section className="py-16 px-4 text-center">
                <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 rounded-full px-4 py-1.5 text-sm font-medium mb-4">
                    <MessageCircle className="w-4 h-4" />
                    FAQ
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{headingText}</h1>
                <p className="text-lg text-gray-500 max-w-xl mx-auto">{subText}</p>
            </section>

            {/* Category filter */}
            <section className="px-4 pb-6">
                <div className="max-w-3xl mx-auto flex flex-wrap gap-2 justify-center">
                    <button
                        onClick={() => { setActiveCategory("all"); setOpenIndex(null); }}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                            activeCategory === "all"
                                ? "bg-purple-600 text-white"
                                : "bg-white border border-gray-200 text-gray-600 hover:border-purple-300 hover:text-purple-600"
                        }`}
                    >
                        {allText}
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => { setActiveCategory(cat); setOpenIndex(null); }}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                activeCategory === cat
                                    ? "bg-purple-600 text-white"
                                    : "bg-white border border-gray-200 text-gray-600 hover:border-purple-300 hover:text-purple-600"
                            }`}
                        >
                            {CATEGORIES[cat][lang] || CATEGORIES[cat].en}
                        </button>
                    ))}
                </div>
            </section>

            {/* Accordion */}
            <section className="px-4 pb-16">
                <div className="max-w-3xl mx-auto space-y-3">
                    {filteredItems.map((item, i) => (
                        <AccordionItem
                            key={`${activeCategory}-${i}`}
                            item={item}
                            lang={lang}
                            isOpen={openIndex === i}
                            onToggle={() => setOpenIndex(openIndex === i ? null : i)}
                        />
                    ))}
                </div>
            </section>

            {/* Contact CTA */}
            <section className="px-4 pb-20">
                <div className="max-w-3xl mx-auto bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-center text-white">
                    <Mail className="w-10 h-10 mx-auto mb-3 opacity-90" />
                    <p className="text-lg font-semibold mb-4">{contactText}</p>
                    <Link
                        href={`/${lang}/contact`}
                        className="inline-block bg-white text-purple-700 font-semibold px-6 py-3 rounded-xl hover:bg-purple-50 transition-colors"
                    >
                        {contactBtnText}
                    </Link>
                </div>
            </section>
        </main>
    );
}

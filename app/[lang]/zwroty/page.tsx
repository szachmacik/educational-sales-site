"use client";

export const dynamic = 'force-dynamic';

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function ZwrotyPage() {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Header />
            <main className="flex-1 container max-w-4xl mx-auto py-16 px-4 md:px-8">
                <article className="prose prose-slate max-w-none bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-slate-100">
                    <h1 className="text-4xl font-black text-slate-900 mb-8 tracking-tight">
                        Zwroty i Reklamacje
                    </h1>

                    <p className="text-sm text-slate-500 mb-12">Zasady obowiązujące od: 25 lutego 2026 r.</p>

                    <section className="space-y-8">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800 mb-4">1. Produkty Fizyczne</h2>
                            <p>Masz prawo do zwrotu zakupionego produktu fizycznego w terminie 14 dni od dnia otrzymania przesyłki bez podania przyczyny. Produkt musi być w stanie nienaruszonym.</p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-slate-800 mb-4">2. Produkty Cyfrowe</h2>
                            <p>Ze względu na charakter treści cyfrowych, które nie są zapisane na nośniku materialnym, prawo do odstąpienia od umowy nie przysługuje, jeżeli pobieranie materiału lub dostęp do kursu rozpoczął się za Twoją wyraźną zgodą przed upływem terminu do odstąpienia od umowy.</p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-slate-800 mb-4">3. Procedura Reklamacyjna</h2>
                            <p>Jeśli produkt posiada wadę, prosimy o kontakt na adres: <strong>kontakt@kamilaenglish.com</strong>. Reklamacje rozpatrujemy w ciągu 14 dni roboczych. Prosimy o dołączenie zdjęć w przypadku uszkodzeń mechanicznych przesyłek fizycznych.</p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-slate-800 mb-4">4. Dane do wysyłki zwrotów</h2>
                            <p>Adres do wysyłki zwrotów zostanie podany po zgłoszeniu chęci odstąpienia od umowy drogą mailową. Koszty przesyłki zwrotnej pokrywa Kupujący.</p>
                        </div>
                    </section>
                </article>
            </main>
            <Footer />
        </div>
    );
}

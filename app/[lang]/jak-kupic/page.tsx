"use client";

export const dynamic = 'force-dynamic';

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function JakKupicPage() {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Header />
            <main className="flex-1 container max-w-4xl mx-auto py-16 px-4 md:px-8">
                <article className="prose prose-slate max-w-none bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-slate-100">
                    <h1 className="text-4xl font-black text-slate-900 mb-8 tracking-tight">
                        Jak kupować?
                    </h1>

                    <section className="space-y-8 mt-12">
                        <div className="flex gap-6">
                            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xl">1</div>
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800 mb-2">Wybierz Materiały</h2>
                                <p>Przeglądaj nasz katalog produktów cyfrowych (PDF, kursy) oraz fizycznych (karty pracy, gry). Skorzystaj z filtrów kategorii, aby znaleźć to, czego potrzebujesz.</p>
                            </div>
                        </div>

                        <div className="flex gap-6">
                            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xl">2</div>
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800 mb-2">Dodaj do Koszyka</h2>
                                <p>Możesz kupować za złotówki lub wymieniać swoje punkty lojalnościowe (Kamila Points) na wybrane produkty.</p>
                            </div>
                        </div>

                        <div className="flex gap-6">
                            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xl">3</div>
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800 mb-2">Bezpieczna Płatność</h2>
                                <p>Przejdź do kasy i wybierz preferowaną formę płatności. Nasz system korzysta z szyfrowanych połączeń SSL i sprawdzonych operatorów płatności.</p>
                            </div>
                        </div>

                        <div className="flex gap-6">
                            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xl">4</div>
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800 mb-2">Natychmiastowy Dostęp</h2>
                                <p>Po opłaceniu zamówienia, pliki cyfrowe będą dostępne do pobrania natychmiast w Twoim panelu użytkownika. Produkty fizyczne wyślemy najszybciej jak to możliwe!</p>
                            </div>
                        </div>
                    </section>
                </article>
            </main>
            <Footer />
        </div>
    );
}

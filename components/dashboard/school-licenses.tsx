"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Plus, MoreVertical, Settings, Building, Users, BookOpen, Clock, HeartHandshake, TrendingUp, MonitorSmartphone, ShieldAlert as OldAlertIcon, ShieldCheck, LifeBuoy, MessageCircle, UserMinus, Mail, PhoneCall, Activity, Send, Download, BarChart3, Presentation, Lightbulb, MessageSquarePlus } from "lucide-react";
import { useLanguage } from "@/components/language-provider";

import { toast } from "sonner";
export function SchoolLicenses() {
    const { formatPrice } = useLanguage();

    const stats = [
        { label: "Aktywne Licencje", value: "3", icon: BookOpen, color: "text-indigo-600", bg: "bg-indigo-50" },
        { label: "Przypisani Nauczyciele", value: "2", icon: Users, color: "text-emerald-600", bg: "bg-emerald-50" },
        { label: "Odzyskany Czas Zespołu", value: "45h", icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
        { label: "Wolne Miejsca", value: "1", icon: Plus, color: "text-slate-600", bg: "bg-slate-50" }
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Zarządzanie Licencjami (B2B)</h2>
            <p className="text-slate-500">Przekaż dostęp do zakupionych materiałów edukacyjnych swoim nauczycielom.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((s, i) => (
                    <Card key={i} className="border-slate-100 shadow-sm">
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className={`p-4 rounded-xl ${s.bg}`}>
                                <s.icon className={`h-6 w-6 ${s.color}`} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-500">{s.label}</p>
                                <p className="text-2xl font-black text-slate-900">{s.value}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* BUSINESS MANAGER WIDGET */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* 1. Pakiet Szkoły Partner Offers */}
                <Card className="border-indigo-200 bg-gradient-to-br from-indigo-50 to-white shadow-md relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 opacity-5">
                        <MonitorSmartphone className="h-48 w-48 text-indigo-900" />
                    </div>
                    <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                            <CardTitle className="text-lg flex items-center gap-2 text-indigo-900">
                                <Building className="h-5 w-5 text-indigo-600" />
                                Wyposażenie Placówki
                            </CardTitle>
                            <span className="bg-indigo-600 text-white text-[10px] uppercase font-black px-2 py-0.5 rounded-full tracking-widest">Oferta Partnerska</span>
                        </div>
                        <CardDescription>Ekskluzywne rabaty na sprzęt dla współpracujących z nami szkół.</CardDescription>
                    </CardHeader>
                    <CardContent className="relative z-10 flex flex-col justify-between h-[calc(100%-5rem)]">
                        <div className="space-y-3">
                            <p className="text-sm font-bold text-slate-700">Kupujesz laptopy, tablice lub drukarki dla uczniów?</p>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Skorzystaj z naszych renegocjowanych stawek dystrybutorskich w x-kom.pl i MediaMarkt (tylko dla edukacji B2B). Odbierz darmową dostawę ubezpieczoną na szkołę.
                            </p>
                        </div>
                        <Button onClick={() => toast.info("Ta funkcja będzie dostępna wkrótce.", { description: "Pracujemy nad tym! 🚀" })} className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 font-bold shadow-lg shadow-indigo-600/20 gap-2">
                            <MonitorSmartphone className="h-4 w-4" /> Sprawdź listę zaufanych dostawców
                        </Button>
                    </CardContent>
                </Card>

                {/* 2. Szkolenia Metodyczne B2B (Pure Sales) */}
                <Card className="border-rose-200 bg-gradient-to-br from-rose-50 to-white shadow-md relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 opacity-5">
                        <Presentation className="h-48 w-48 text-rose-900" />
                    </div>
                    <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                            <CardTitle className="text-lg flex items-center gap-2 text-rose-900">
                                <Presentation className="h-5 w-5 text-rose-600" />
                                Szkolenia i Wdrożenia
                            </CardTitle>
                            <span className="bg-rose-100 text-rose-700 text-[10px] uppercase font-black px-2 py-0.5 rounded-full tracking-widest border border-rose-200">Usługi Premium</span>
                        </div>
                        <CardDescription>Zapewnij swoim nauczycielom najwyższy standard pracy z platformą.</CardDescription>
                    </CardHeader>
                    <CardContent className="relative z-10 flex flex-col justify-between h-[calc(100%-5rem)]">
                        <div className="bg-white/60 rounded-xl p-3 border border-slate-100 shadow-sm space-y-3 mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-rose-100 text-rose-600 rounded-lg">
                                    <Users className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-800">Webinar Wdrożeniowy (LIVE)</p>
                                    <p className="text-[10px] text-slate-500">Szkolenie online dla całej rady pedagogicznej.</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-rose-100 text-rose-600 rounded-lg">
                                    <Lightbulb className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-800">Osobisty Opiekun B2B</p>
                                    <p className="text-[10px] text-slate-500">Priorytetowe wsparcie telefoniczne i metodyczne.</p>
                                </div>
                            </div>
                        </div>

                        <Button onClick={() => toast.info("Ta funkcja będzie dostępna wkrótce.", { description: "Pracujemy nad tym! 🚀" })} variant="outline" className="w-full text-rose-700 border-rose-200 hover:bg-rose-100 font-bold bg-white gap-2">
                            Zapytaj o wycenę pakietu
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-slate-200 shadow-xl overflow-hidden mt-6">
                <CardHeader className="bg-slate-50 border-b border-slate-100 pb-6 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-indigo-500"></div>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5 text-indigo-600" /> Wasi Nauczyciele
                            </CardTitle>
                            <CardDescription className="mt-2">Ważna do: 25.08.2027 • Faktura: FV/2026/02/104</CardDescription>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button onClick={() => toast.info("Ta funkcja będzie dostępna wkrótce.", { description: "Pracujemy nad tym! 🚀" })} variant="outline" className="text-slate-600 border-slate-200 hover:bg-slate-100 font-bold gap-2">
                                Zarządzaj Dostępami
                            </Button>
                            <Button onClick={() => toast.info("Ta funkcja będzie dostępna wkrótce.", { description: "Pracujemy nad tym! 🚀" })} className="bg-indigo-600 hover:bg-indigo-700 font-bold gap-2">
                                <Plus className="h-4 w-4" /> Zaproś Nauczyciela
                            </Button>
                        </div>
                    </div>

                    {/* Onboarding Gamification Bar */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between gap-6">
                        <div className="flex-1">
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-sm font-bold text-slate-700">Wykorzystanie pakietu</span>
                                <span className="text-xs font-black text-indigo-600">66% (2/3 miejsc)</span>
                            </div>
                            <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-500 rounded-full" style={{ width: '66%' }}></div>
                            </div>
                        </div>
                        <p className="text-xs text-slate-500 max-w-[200px] hidden md:block">
                            Wydaj wszystkie przypisane licencje, aby wykorzystać 100% wartości sprzętu.
                        </p>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-slate-100">
                        {/* ASSIGNED SEAT: ACTIVE */}
                        <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 bg-gradient-to-tr from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold shadow-sm relative">
                                    AK
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900">Anna Kowalska</p>
                                    <p className="text-xs text-slate-500">anna.kowalska@sp1.edu.pl • Klasy 1-3</p>
                                </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-3">
                                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100 flex items-center gap-1">
                                    <ShieldCheck className="h-3 w-3" /> Aktywne Konto
                                </span>
                                <Button onClick={() => toast.info("Ta funkcja będzie dostępna wkrótce.", { description: "Pracujemy nad tym! 🚀" })} variant="ghost" size="icon" className="text-slate-400 hover:text-red-500">
                                    <Settings className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* ASSIGNED SEAT: REGULAR */}
                        <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white hover:bg-slate-50/50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold shadow-sm">
                                    MN
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900">Marek Nowak</p>
                                    <p className="text-xs text-slate-500 font-medium">m.nowak@sp1.edu.pl</p>
                                </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-3">
                                <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-full border border-slate-200 flex items-center gap-1">
                                    <UserMinus className="h-3 w-3" /> Zaproszenie Wysłane
                                </span>
                                <Button onClick={() => toast.info("Ta funkcja będzie dostępna wkrótce.", { description: "Pracujemy nad tym! 🚀" })} variant="ghost" size="icon" className="text-slate-400 hover:text-slate-600">
                                    <Settings className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* EMPTY SEAT */}
                        <div className="p-6 flex items-center justify-between bg-slate-50/50">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 border-2 border-dashed border-slate-300 rounded-full flex items-center justify-center text-slate-400 bg-white">
                                    <Plus className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-500 italic">Wolne miejsce (1/3)</p>
                                    <p className="text-xs text-slate-400">Wyślij link zaproszeniowy aby przydzielić licencję</p>
                                </div>
                            </div>
                            <Button onClick={() => toast.info("Ta funkcja będzie dostępna wkrótce.", { description: "Pracujemy nad tym! 🚀" })} variant="outline" size="sm" className="font-bold text-xs gap-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50">
                                <Copy className="h-3 w-3" /> Kopiuj Link
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* B2B DELEGATION & HELPDESK WIDGETS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">

                {/* 1. SECRETARY DELEGATION */}
                <Card className="border-slate-200 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
                        <Users className="w-32 h-32" />
                    </div>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg font-black text-slate-800">
                            <ShieldCheck className="h-5 w-5 text-indigo-600" />
                            Delegacja na Sekretariat
                        </CardTitle>
                        <CardDescription>
                            Rozdziel płatnika od darmowego konta administracyjnego rozsyłającego dostępy nauczycielom.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                                    <Mail className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900">sekretariat@sp1.edu.pl</p>
                                    <p className="text-[10px] uppercase font-black tracking-widest text-emerald-600">Aktywny Menedżer</p>
                                </div>
                            </div>
                            <Button onClick={() => toast.info("Ta funkcja będzie dostępna wkrótce.", { description: "Pracujemy nad tym! 🚀" })} variant="outline" size="sm" className="text-red-600 border-red-100 hover:bg-red-50 hover:text-red-700 font-bold gap-2">
                                <UserMinus className="h-4 w-4" /> Odbierz
                            </Button>
                        </div>
                        <Button onClick={() => toast.info("Ta funkcja będzie dostępna wkrótce.", { description: "Pracujemy nad tym! 🚀" })} className="w-full bg-slate-900 text-white hover:bg-indigo-600 gap-2 font-bold shadow-md">
                            <Plus className="h-4 w-4" /> Zmień Delegata
                        </Button>
                        <p className="text-[10px] text-slate-400 text-center leading-relaxed font-medium px-2">
                            Delegat otrzymuje dostęp WYŁĄCZNIE do tej zakładki, aby pobierać faktury i zapraszać nauczycieli. Nie koliduje to z materiałami ucznia.
                        </p>
                    </CardContent>
                </Card>

                {/* 2. B2B VIP HELPDESK & CHATBOT */}
                <Card className="border-indigo-100 bg-indigo-50/30 shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg font-black text-indigo-900">
                            <LifeBuoy className="h-5 w-5 text-indigo-600" />
                            Wsparcie VIP B2B
                        </CardTitle>
                        <CardDescription className="text-indigo-700/70">
                            Masz problem z przydzieleniem faktury, płatnością odroczoną lub zwrotem? Pomożemy od ręki.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <Button onClick={() => toast.info("Ta funkcja będzie dostępna wkrótce.", { description: "Pracujemy nad tym! 🚀" })} variant="outline" className="h-14 border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50 text-indigo-700 font-bold gap-2 flex-col justify-center items-center">
                                <MessageCircle className="h-5 w-5 mb-1" />
                                <span>Czat z Asystentem</span>
                            </Button>
                            <Button onClick={() => toast.info("Ta funkcja będzie dostępna wkrótce.", { description: "Pracujemy nad tym! 🚀" })} variant="outline" className="h-14 border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50 text-indigo-700 font-bold gap-2 flex-col justify-center items-center">
                                <PhoneCall className="h-5 w-5 mb-1" />
                                <span>Zamów Kontakt</span>
                            </Button>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-indigo-100/50 shadow-sm">
                            <p className="text-xs font-bold text-slate-700 mb-2 uppercase tracking-widest">Szybka Pomoc:</p>
                            <ul className="space-y-2 text-xs text-slate-500 font-medium">
                                <li className="flex items-start gap-2">
                                    <span className="text-indigo-500 mt-0.5">•</span> Jak zmienić dane na wystawionej fakturze?
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-indigo-500 mt-0.5">•</span> Jak usunąć nauczyciela, który odszedł ze szkoły?
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-indigo-500 mt-0.5">•</span> Powiększenie pakietu licencji w trakcie roku
                                </li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>

            </div>

            {/* Platform Wishlist Feature - School Admin */}
            <div className="mt-8 border border-indigo-100 bg-indigo-50/50 rounded-2xl p-6 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-md transition-shadow">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                    <Lightbulb className="w-32 h-32 text-indigo-600 transform translate-x-12 -translate-y-8" />
                </div>
                <div className="flex items-center gap-4 relative z-10 w-full md:w-auto">
                    <div className="h-12 w-12 bg-white rounded-xl shadow-sm flex items-center justify-center shrink-0">
                        <Lightbulb className="h-6 w-6 text-indigo-500" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800 text-lg">Wishlista Platformy (Pomysły Administracji)</h3>
                        <p className="text-sm text-slate-600 max-w-lg">
                            Dostosowujemy narzędzie pod specyfikę Twojej szkoły. Brakuje Ci jakiegoś typu raportu? Chcesz zintegrować naszego CSV z Waszym e-dziennikiem? Zamień pomysł w zgłoszenie do naszego IT.
                        </p>
                    </div>
                </div>
                <Button onClick={() => toast.info("Ta funkcja będzie dostępna wkrótce.", { description: "Pracujemy nad tym! 🚀" })} className="relative z-10 w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 font-bold gap-2 whitespace-nowrap">
                    <MessageSquarePlus className="h-4 w-4" /> Zgłoś Zapotrzebowanie
                </Button>
            </div>

        </div >
    );
}

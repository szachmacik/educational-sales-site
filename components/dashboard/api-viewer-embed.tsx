"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Earth, MonitorSmartphone, ShieldCheck, Zap, Server, Lock, Globe, ArrowRight } from "lucide-react";

import { toast } from "sonner";
export function ApiViewerEmbed() {
    const [isConnecting, setIsConnecting] = useState(false);

    const handleConnect = () => {
        setIsConnecting(true);
        setTimeout(() => setIsConnecting(false), 2000);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black tracking-tight text-slate-800 flex items-center gap-3">
                        <Server className="h-8 w-8 text-indigo-600" />
                        Zewnętrzny Portal (1 Kliknięcie)
                    </h2>
                    <p className="text-slate-500 font-medium mt-1">Stwórz własny portal dla uczniów, oparty w 100% na naszej bazie materiałów.</p>
                </div>
                <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 px-3 py-1 text-xs uppercase tracking-widest font-bold">
                    Opcja Premium (B2B)
                </Badge>
            </div>

            {/* UPSELL WIDGET HERO */}
            <Card className="border-indigo-100 bg-gradient-to-br from-indigo-50 to-white shadow-md relative overflow-hidden">
                <div className="absolute right-0 top-0 p-8 opacity-5 pointer-events-none">
                    <Earth className="h-48 w-48 text-indigo-900" />
                </div>
                <CardHeader>
                    <CardTitle className="text-xl text-indigo-900">Twój własny e-dziennik bez pisania kodu.</CardTitle>
                    <CardDescription className="text-sm font-medium">Brak konieczności kopiowania kodów czy Iframe. Skonfigurujemy zewnętrzny portal za Ciebie w sekundę.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-3 gap-6 relative z-10 mt-4">
                        <div className="bg-white p-5 rounded-2xl border border-indigo-100 shadow-sm transition-all hover:shadow-md">
                            <MonitorSmartphone className="h-8 w-8 text-indigo-500 mb-3" />
                            <h3 className="font-bold text-slate-800 mb-1">Pełny Klon Wyglądu</h3>
                            <p className="text-xs text-slate-500 leading-relaxed">System zrzuci kopię naszego nowoczesnego interfejsu na Twoją stronę. Uczniowie zobaczą znane z lekcji środowisko.</p>
                        </div>
                        <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm transition-all hover:shadow-md">
                            <ShieldCheck className="h-8 w-8 text-emerald-500 mb-3" />
                            <h3 className="font-bold text-slate-800 mb-1">Tylko-Do-Odczytu</h3>
                            <p className="text-xs text-slate-500 leading-relaxed">Interfejs pozbawiony jest opcji "Pobierz PDF" i działa jako szybka prezentacja/viewer materiału dla ochrony własności.</p>
                        </div>
                        <div className="bg-slate-900 p-5 rounded-2xl shadow-lg transition-all hover:shadow-xl text-white">
                            <Zap className="h-8 w-8 text-amber-400 mb-3" />
                            <h3 className="font-bold text-white mb-1">Własna Domena</h3>
                            <p className="text-xs text-slate-400 leading-relaxed">Twoi klienci wchodzą na adres typu: `szkola-ani.pl`. Nie zobaczą brandu Twój Sklep w żadnym miejscu.</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 1-CLICK INTEGRATION SECTION */}
            <div className="grid md:grid-cols-5 gap-6">
                <div className="md:col-span-3 space-y-6">
                    <Card className="border-slate-200 shadow-sm relative overflow-hidden">
                        {/* Premium lock overlay — readable with clear CTA */}
                        <div className="absolute inset-0 z-20 rounded-lg flex flex-col items-center justify-center p-6 text-center" style={{background: 'linear-gradient(to bottom, rgba(255,255,255,0.15) 0%, rgba(15,23,42,0.85) 60%, rgba(15,23,42,0.97) 100%)'}}>
                            <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-2xl mb-4">
                                <Lock className="h-8 w-8 text-indigo-600" />
                            </div>
                            <h3 className="text-xl font-black text-white mb-2">Rozszerz Licencję Szkolną</h3>
                            <p className="text-sm font-medium text-slate-300 max-w-sm mb-6">Funkcja w pełni zautomatyzowanego klonowania asortymentu na własne domeny bez kodu wymaga statusu Premium.</p>
                            <Button onClick={() => toast.info("Ta funkcja będzie dostępna wkrótce.", { description: "Pracujemy nad tym! 🚀" })} size="lg" className="bg-indigo-500 hover:bg-indigo-400 text-white shadow-lg shadow-indigo-900/50 border border-indigo-400">
                                Wykup Integrację Premium
                            </Button>
                        </div>

                        <CardHeader>
                            <CardTitle className="text-lg">Kreator Zewnętrznego Portalu</CardTitle>
                            <CardDescription>Obie opcje pozwalają na stworzenie dedykowanego środowiska dla Twoich uczniów. Wybierz odpowiedni wariant.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">

                            {/* Option 1: Subdomain (Premium - Branded) */}
                            <div className="border border-indigo-200 rounded-2xl p-5 hover:border-indigo-300 transition-colors bg-gradient-to-br from-indigo-50 to-white relative overflow-hidden">
                                <Badge className="absolute top-4 right-4 bg-indigo-500 hover:bg-indigo-600">Plan Osobisty</Badge>
                                <div className="flex items-start gap-4">
                                    <div className="mt-1 bg-indigo-600 p-2 rounded-lg text-white shrink-0 shadow-md">
                                        <Zap className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1 pr-16">
                                        <h4 className="font-bold text-slate-800 mb-1">Mój Portal na Subdomenie Edukacyjnej</h4>
                                        <p className="text-sm text-slate-500 mb-4">Otrzymujesz natychmiast gotową platformę pod dedykowanym adresem, która korzysta z prestiżu naszej marki, np. <code className="text-indigo-600 font-bold bg-indigo-100/50 px-1 rounded">szkola-ani.kamilaenglish.site</code></p>
                                        <Button onClick={handleConnect} className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700" disabled={isConnecting}>
                                            Generuj Portal (Subdomena)
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Option 2: Own Domain (Premium White-label) */}
                            <div className="border-2 border-amber-200 rounded-2xl p-5 hover:border-amber-400 transition-colors bg-white relative">
                                <Badge className="absolute top-4 right-4 bg-amber-500 hover:bg-amber-600 text-white border-none shadow-sm shadow-amber-200">Plan B2B Premium</Badge>
                                <div className="flex items-start gap-4">
                                    <div className="mt-1 bg-gradient-to-br from-amber-400 to-orange-500 p-2 rounded-lg text-white shrink-0 shadow-md">
                                        <Globe className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1 pr-24">
                                        <h4 className="font-bold text-slate-800 mb-1">Pełna Integracja White-Label (Własna Domena)</h4>
                                        <p className="text-sm text-slate-500 mb-4">Podłączamy system bezpośrednio pod Twoją główną stronę WWW za pomocą API/Pluginu. Uczniowie wchodzą na <code className="text-amber-600 font-bold">platforma.twoja-szkola.pl</code>. Brak logo Głównego Sklepu - 100% Twój branding.</p>
                                        <Button
                                            onClick={handleConnect}
                                            className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-none shadow-md shadow-amber-200"
                                            disabled={isConnecting}
                                        >
                                            {isConnecting ? "Łączenie..." : "Autoryzuj Własną Domenę (Premium)"}
                                        </Button>
                                    </div>
                                </div>
                            </div>

                        </CardContent>
                    </Card>
                </div>

                {/* INFO WIDGET */}
                <div className="md:col-span-2">
                    <Card className="border-slate-200 shadow-sm bg-slate-50 h-full">
                        <CardHeader>
                            <CardTitle className="text-sm font-bold flex items-center gap-2">
                                <Server className="h-4 w-4 text-slate-500" />
                                Synchronizacja Postępów
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm text-slate-600">
                            <p>Zewnętrzne portale ładują treść z naszych serwerów, co sprawia, że <strong>Twoi uczniowie nie uszczuplają Twojego transferu</strong> danych (hosting out).</p>

                            <div className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                                <p className="text-xs font-bold text-slate-800 mb-1">Gromadzenie Postępów</p>
                                <p className="text-xs text-slate-500">Wyniki zadań, interaktywnych gier i ćwiczeń rozwiązanych na Twojej stronie przez portal klienta są automatycznie sync'owane z powrotem do <strong>Twojej zakładki "Raporty"</strong> w głównym panelu nauczyciela.</p>
                            </div>

                            <ul className="space-y-2 pt-2">
                                <li className="flex gap-2">
                                    <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                                    <span className="text-xs">Uczeń loguje się Twoim spersonalizowanym kodem "PIN" (bez maila).</span>
                                </li>
                                <li className="flex gap-2">
                                    <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                                    <span className="text-xs">Zablokowane pobieranie PDF. Viewer Only.</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

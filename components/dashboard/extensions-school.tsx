"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, GraduationCap, Video, ArrowRight, Sparkles, Building2, HeadphonesIcon } from "lucide-react";
import { toast } from "sonner";

export function ExtensionsSchool() {
    return (
        <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black tracking-tight text-slate-800 flex items-center gap-3">
                        <Sparkles className="h-8 w-8 text-amber-500" />
                        Usługi Premium B2B
                    </h2>
                    <p className="text-slate-500 font-medium mt-1">Rozszerz możliwości swojej placówki dzięki dedykowanym usługom concierge.</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* Dedykowany Opiekun */}
                <Card className="border-slate-200 hover:border-amber-300 transition-colors shadow-sm relative overflow-hidden flex flex-col">
                    <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-amber-400 to-orange-500"></div>
                    <CardHeader>
                        <div className="h-12 w-12 bg-amber-50 rounded-xl flex items-center justify-center mb-4 text-amber-600">
                            <HeadphonesIcon className="h-6 w-6" />
                        </div>
                        <CardTitle className="text-xl">Dedykowany Opiekun</CardTitle>
                        <CardDescription>Osobisty Menedżer Konta dostępny telefonicznie, priorytetowa ścieżka supportu.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col justify-end">
                        <ul className="space-y-2 mb-6 text-sm text-slate-600">
                            <li className="flex items-start gap-2"><ShieldCheck className="h-4 w-4 text-emerald-500 mt-0.5" /> SLA reakcji &lt; 2h</li>
                            <li className="flex items-start gap-2"><ShieldCheck className="h-4 w-4 text-emerald-500 mt-0.5" /> Osobisty kontakt tel.</li>
                        </ul>
                        <Button className="w-full bg-slate-900 hover:bg-slate-800" onClick={() => toast.success("Zapytanie wysłane do działu B2B")}>
                            Zapytaj o wycenę
                        </Button>
                    </CardContent>
                </Card>

                {/* Szkolenie Personelu */}
                <Card className="border-slate-200 hover:border-amber-300 transition-colors shadow-sm relative overflow-hidden flex flex-col">
                    <CardHeader>
                        <div className="h-12 w-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-4 text-indigo-600">
                            <Video className="h-6 w-6" />
                        </div>
                        <CardTitle className="text-xl">Szkolenie Rady</CardTitle>
                        <CardDescription>Webinar LIVE "Nasza Metodyka" dla pełnego grona Twoich nauczycieli.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col justify-end">
                        <ul className="space-y-2 mb-6 text-sm text-slate-600">
                            <li className="flex items-start gap-2"><ShieldCheck className="h-4 w-4 text-emerald-500 mt-0.5" /> Certyfikaty dla Kadry</li>
                            <li className="flex items-start gap-2"><ShieldCheck className="h-4 w-4 text-emerald-500 mt-0.5" /> Analiza waszych wyzwań</li>
                        </ul>
                        <div className="flex items-center justify-between mt-auto">
                            <div className="text-lg font-black text-slate-900">1499 PLN</div>
                            <Button variant="outline" className="text-indigo-600 border-indigo-200 hover:bg-indigo-50" onClick={() => toast.success("Dodano do koszyka")}>
                                Kup Webinar <ArrowRight className="h-4 w-4 ml-1" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Platforma Wdrożeniowa */}
                <Card className="border-indigo-100 bg-gradient-to-br from-indigo-50 to-white shadow-md relative overflow-hidden flex flex-col md:col-span-2 lg:col-span-1">
                    <Badge className="absolute top-4 right-4 bg-indigo-600">Pod Klucz</Badge>
                    <CardHeader>
                        <div className="h-12 w-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-4 text-indigo-600">
                            <Building2 className="h-6 w-6" />
                        </div>
                        <CardTitle className="text-xl">Wdrożenie "Pod Klucz"</CardTitle>
                        <CardDescription className="font-medium text-slate-600">Zlec nam pełną administrację: założymy konta Twoim nauczycielom, przypiszemy licencje, przejdziemy z nimi onboarding.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col justify-end">
                        <Button className="w-full bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200" onClick={() => toast.success("Nasz doradca skontaktuje się wkrótce")}>
                            Umów darmową konsultację
                        </Button>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}

"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Bot, GraduationCap, PartyPopper, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export function ExtensionsTeacher() {
    return (
        <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black tracking-tight text-slate-800 flex items-center gap-3">
                        <Sparkles className="h-8 w-8 text-indigo-600" />
                        Narzędzia i Rozszerzenia
                    </h2>
                    <p className="text-slate-500 font-medium mt-1">Marketplace dodatków ułatwiających codzienną pracę lektora.</p>
                </div>
                <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-xl border border-amber-200">
                    <span className="text-sm font-bold text-amber-800">Twoje saldo:</span>
                    <Badge variant="outline" className="bg-amber-100 text-amber-900 border-amber-300">120 Punktów B2B</Badge>
                </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* AI Token Pack */}
                <Card className="border-slate-200 hover:border-indigo-300 transition-colors shadow-sm flex flex-col">
                    <CardHeader>
                        <div className="h-12 w-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-4 text-indigo-600">
                            <Bot className="h-6 w-6" />
                        </div>
                        <CardTitle className="text-xl">Pakiet Tokenów AI</CardTitle>
                        <CardDescription>Zasil swojego Asystenta Kamila AI, aby generować więcej spersonalizowanych kart pracy.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <ul className="space-y-2 text-sm text-slate-600">
                            <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5" /> +50,000 znaków generacji</li>
                            <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5" /> Dostęp do modelu GPT-4</li>
                        </ul>
                    </CardContent>
                    <CardFooter className="border-t border-slate-100 bg-slate-50/50 pt-4 flex items-center justify-between">
                        <span className="font-black text-lg">29 PLN</span>
                        <Button size="sm" className="bg-slate-900 hover:bg-slate-800" onClick={() => toast.success("Kupiono tokeny (Tryb Demo)")}>Kup teraz</Button>
                    </CardFooter>
                </Card>

                {/* Teachers Club */}
                <Card className="border-slate-200 hover:border-indigo-300 transition-colors shadow-sm flex flex-col">
                    <CardHeader>
                        <div className="h-12 w-12 bg-rose-50 rounded-xl flex items-center justify-center mb-4 text-rose-600">
                            <GraduationCap className="h-6 w-6" />
                        </div>
                        <CardTitle className="text-xl">Klub Nauczyciela</CardTitle>
                        <CardDescription>Dostęp do zamkniętych webinarów metodycznych oraz bazy VIP materiałów niewydanych oficjalnie.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <ul className="space-y-2 text-sm text-slate-600">
                            <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5" /> 1 Webinar LIVE w miesiącu</li>
                            <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5" /> Certyfikaty Nauczyciela Roku</li>
                        </ul>
                    </CardContent>
                    <CardFooter className="border-t border-slate-100 bg-slate-50/50 pt-4 flex items-center justify-between">
                        <span className="font-black text-lg text-rose-600">49 PLN <span className="text-xs font-normal text-slate-500">/mies</span></span>
                        <Button size="sm" variant="outline" className="border-rose-200 text-rose-700 hover:bg-rose-50" onClick={() => toast.success("Subskrypcja aktywowana (Demo)")}>Subskrybuj</Button>
                    </CardFooter>
                </Card>

                {/* Holiday Events Pack */}
                <Card className="border-indigo-100 bg-gradient-to-br from-indigo-50 to-white shadow-md relative overflow-hidden flex flex-col">
                    <Badge className="absolute top-4 right-4 bg-indigo-600">Bestseller</Badge>
                    <CardHeader>
                        <div className="h-12 w-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-4 text-indigo-600">
                            <PartyPopper className="h-6 w-6" />
                        </div>
                        <CardTitle className="text-xl">Mega-paka: Święta</CardTitle>
                        <CardDescription className="font-medium text-slate-600">Zestaw gotowych interaktywnych gier na Halloween, Boże Narodzenie i Wielkanoc.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <div className="p-3 bg-white/60 backdrop-blur rounded-lg border border-indigo-100 text-sm text-indigo-900 font-medium">
                            Uratuj 15 godzin przygotowań w okresie świątecznej gorączki!
                        </div>
                    </CardContent>
                    <CardFooter className="border-t border-indigo-100/50 bg-white/50 pt-4 flex items-center justify-between">
                        <span className="font-black text-lg">99 PLN</span>
                        <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 shadow-md" onClick={() => toast.success("Dodano do koszyka")}>Kup do licencji</Button>
                    </CardFooter>
                </Card>

            </div>
        </div>
    );
}

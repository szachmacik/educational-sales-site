"use client";
import React, { useEffect, useState } from "react";
import { useLanguage } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import {
    Gamepad2, Flame, Trophy, PlayCircle, Star, Sparkles, BookOpen, Clock, Zap, Target, ArrowRight, ShieldCheck, Activity, Rocket, Layers, BrainCircuit, Ribbon, Bell, Plus as PlusIcon
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getUserProfile } from "@/lib/user-profile-service";
import { Progress } from "@/components/ui/progress";

import { toast } from "sonner";
interface WelcomeBannerProps {
    user: { name: string; role: 'student' | 'teacher' | 'admin' | 'school' };
}

export function WelcomeBanner({ user }: WelcomeBannerProps) {
    const { t } = useLanguage();
    useEffect(() => {
        // Simple client-side initialization if needed
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                        {t.dashboard?.welcome || t.welcome || "Witaj"}, {user.name.split(" ")[0]}! 👋
                    </h1>

                    {user.role === 'teacher' ? (
                        <p className="mt-2 text-sm font-medium text-slate-500">
                            Gotowa na kolejny fantastyczny dzień z uczniami? Zobaczmy co dziś robimy.
                        </p>
                    ) : user.role === 'student' ? (
                        <p className="mt-2 text-slate-500">
                            Gotowy na kolejną mapę przygód? Zbierzmy dzisiaj mityczne XP!
                        </p>
                    ) : user.role === 'school' ? (
                        <p className="mt-2 text-slate-500">
                            Pulpit menadżera. Sprawdź wykorzystanie licencji grupowych.
                        </p>
                    ) : (
                        <p className="mt-2 text-slate-500">Witaj na pulpicie.</p>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    <Button onClick={() => toast.success("Funkcja została wywołana.")} variant="outline" size="icon" className="rounded-full shadow-sm">
                        <Bell className="h-5 w-5 text-slate-600" />
                    </Button>
                    {(user.role === 'teacher' || user.role === 'school') && (
                        <Button onClick={() => toast.success("Funkcja została wywołana.")} className="rounded-full bg-slate-900 text-white hover:bg-indigo-600 shadow-md gap-2 font-bold">
                            <PlusIcon className="h-4 w-4" />
                            Dodaj Materiały
                        </Button>
                    )}
                </div>
            </div>

            {/* TEACHER GAMIFICATION: PLATFORM VALUE */}
            {user.role === 'teacher' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-5 rounded-2xl text-white shadow-lg relative overflow-hidden group">
                        <div className="absolute right-0 top-0 opacity-10 group-hover:scale-110 transition-transform">
                            <BookOpen className="w-32 h-32 -mt-4 -mr-4" />
                        </div>
                        <div className="relative z-10">
                            <p className="text-indigo-100 text-xs uppercase font-bold tracking-widest mb-1">Biblioteka Nauczyciela</p>
                            <h3 className="text-xl font-black mb-3">Katalog Materiałów</h3>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-black">128</span>
                                <span className="text-indigo-100 font-medium">gotowych scenariuszy</span>
                            </div>
                            <p className="text-xs text-indigo-100 mt-2 opacity-80">Równowartość całego weekendu planowania dla Ciebie. Dziękujemy, że z nami jesteś.</p>
                        </div>
                    </div>

                    {/* TEACHER GAMIFICATION 2: EMERGENCY NO-PREP BUTTON */}
                    <div className="bg-slate-900 p-5 rounded-2xl shadow-lg relative overflow-hidden group border border-slate-800 flex flex-col justify-between">
                        <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
                            <Rocket className="w-32 h-32 text-indigo-400" />
                        </div>
                        <div className="relative z-10 mb-4">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <p className="text-indigo-400 text-[10px] uppercase font-black tracking-widest mb-1">
                                        Tryb Ratunkowy
                                    </p>
                                    <h3 className="text-xl font-black text-white leading-tight">
                                        Zaraz Wchodzę<br />do Klasy!
                                    </h3>
                                </div>
                                <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400">
                                    <Rocket className="h-6 w-6" />
                                </div>
                            </div>
                            <p className="text-xs text-slate-400 font-medium leading-relaxed mt-2">
                                Brak czasu na szukanie? Zaufaj nam. Kliknij, a wygenerujemy gotową misję No-Prep na 45 minut, dopasowaną do Twojego konta.
                            </p>
                        </div>
                        <Button onClick={() => toast.success("Funkcja została wywołana.")} className="w-full relative z-10 bg-indigo-500 hover:bg-indigo-600 text-white font-bold gap-2 shadow-[0_4px_0_rgb(79,70,229)] hover:shadow-[0_2px_0_rgb(79,70,229)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px] transition-all">
                            <Sparkles className="h-4 w-4" /> Uruchom Gotowca
                        </Button>
                    </div>

                    {/* TEACHER GAMIFICATION 3: TIME SAVED METRIC */}
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between group overflow-hidden relative">
                        <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform">
                            <Clock className="w-24 h-24 text-emerald-500" />
                        </div>
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <p className="text-emerald-500 text-[10px] uppercase font-black tracking-widest mb-1">
                                        Twój Czas
                                    </p>
                                    <h3 className="text-lg font-black text-slate-900 leading-tight">
                                        Odzyskane Godziny
                                    </h3>
                                </div>
                                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
                                    <Clock className="h-6 w-6" />
                                </div>
                            </div>
                            <div className="mt-2 flex items-baseline gap-2">
                                <span className="text-3xl font-black text-emerald-600">12</span>
                                <span className="text-slate-500 font-medium text-sm">godz. w tym miesiącu</span>
                            </div>
                            <p className="text-xs text-slate-400 font-medium leading-relaxed mt-2">
                                Tyle czasu wolnego odzyskałaś dzięki korzystaniu z naszych gotowych materiałów. Wypocznij!
                            </p>
                        </div>
                    </div>

                    {/* TEACHER GAMIFICATION 4: MIXED-ABILITY TOGGLE */}
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-slate-400 text-[10px] uppercase font-black tracking-widest mb-1">
                                    Personalizacja Sal
                                </p>
                                <h3 className="text-lg font-black text-slate-900 leading-tight">
                                    Mixed-Ability
                                </h3>
                            </div>
                            <div className="p-2.5 rounded-xl bg-orange-50 text-orange-600">
                                <Layers className="h-6 w-6" />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <p className="text-xs text-slate-500 font-medium">
                                Masz uczniów na skrajnie różnym poziomie (np. A1 z B1)? Włącz tryb różnicowania.
                            </p>
                            <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl">
                                <span className="text-xs font-bold text-slate-700">Podwójne Wersje Zadań</span>
                                <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-300">
                                    <span className="inline-block h-4 w-4 translate-x-1 rounded-full bg-white transition" />
                                </div>
                            </div>
                            <p className="text-[10px] text-slate-400 font-medium text-center">
                                Przy pobieraniu materiału otrzymasz wariant łatwy i trudny.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* STUDENT: FOCUS BOARD only — no parent invite (parent is prerequisite) */}
            {user.role === 'student' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                    {/* 1. FOCUS BOARD (Task For Today) */}
                    <div className="lg:col-span-2 bg-gradient-to-r from-orange-400 to-amber-500 p-1 rounded-2xl shadow-lg relative overflow-hidden group hover:-translate-y-1 transition-transform cursor-pointer">
                        <div className="bg-white/95 backdrop-blur-sm p-4 md:p-6 rounded-xl flex flex-col md:flex-row items-center gap-6 h-full">
                            <div className="bg-orange-100 p-4 rounded-full flex-shrink-0 animate-pulse relative">
                                <Target className="h-10 w-10 text-orange-600 relative z-10" />
                                <div className="absolute inset-0 bg-orange-400 rounded-full blur-md opacity-50"></div>
                            </div>
                            <div className="text-center md:text-left flex-1">
                                <span className="text-xs font-black uppercase tracking-widest text-orange-600 bg-orange-100 px-2 py-1 rounded-md">Zadanie na Dziś!</span>
                                <h3 className="text-xl font-black text-slate-900 mt-2 mb-1">Twój nauczyciel p. Janek, prosi o wykonanie Misji: &quot;Past Simple&quot;</h3>
                                <p className="text-sm font-medium text-slate-500 mb-3">Zrób to dzisiaj, a otrzymasz 150 EXP bonusu za terminowość.</p>
                                <Button onClick={() => toast.success("Funkcja została wywołana.")} className="w-full md:w-auto bg-orange-500 hover:bg-orange-600 text-white font-bold gap-2 rounded-xl shadow-[0_4px_0_rgb(194,65,12)] hover:shadow-[0_2px_0_rgb(194,65,12)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px] transition-all">
                                    Rozpocznij Misję <ArrowRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* 2. DAILY STREAK widget — no external links */}
                    <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-lg relative overflow-hidden flex flex-col justify-between">
                        <div className="absolute -right-4 -bottom-4 opacity-10">
                            <Flame className="w-32 h-32" />
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-3">
                                <Flame className="h-5 w-5 text-orange-400 fill-orange-500" />
                                <h3 className="text-sm font-bold uppercase tracking-widest text-orange-400">Twój Streak</h3>
                            </div>
                            <p className="text-4xl font-black text-white mb-1">12 🔥</p>
                            <p className="text-xs font-medium text-slate-300 leading-relaxed">
                                Dzień z rzędu! Kontynuuj naukę, żeby utrzymać serię i odblokować nagrodę.
                            </p>
                        </div>
                        <div className="mt-4 bg-white/10 rounded-xl p-3 relative z-10">
                            <p className="text-[10px] font-black text-orange-300 uppercase tracking-widest mb-1">Do kolejnej nagrody</p>
                            <div className="w-full bg-white/10 rounded-full h-2">
                                <div className="bg-orange-400 h-2 rounded-full" style={{width: '75%'}} />
                            </div>
                            <p className="text-[10px] text-slate-400 mt-1">3 dni do odblokowania 🏆</p>
                        </div>
                    </div>

                </div>
            )}

            {/* STUDENT GAMIFICATION 2: NEURAL PATHWAY (INTERESTS) & CERTIFICATES */}
            {user.role === 'student' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">

                    {/* 3. NEURAL PATHWAY TREE (Interest Profiling) */}
                    <Card className="border-slate-200 shadow-sm bg-gradient-to-br from-indigo-50 to-white overflow-hidden relative group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                            <BrainCircuit className="w-24 h-24 text-indigo-600" />
                        </div>
                        <CardHeader className="pb-2">
                            <div className="flex items-center gap-2 mb-1">
                                <BrainCircuit className="h-5 w-5 text-indigo-500" />
                                <CardTitle className="text-lg font-black text-slate-800">Drzewo Twoich Pasji</CardTitle>
                            </div>
                            <CardDescription className="text-xs font-medium">
                                Zaznacz co lubisz, a magicznie dostosujemy zadania specjalnie dla Ciebie!
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2 mt-2 relative z-10">
                                <Badge variant="outline" className="bg-indigo-100 text-indigo-700 border-indigo-200 hover:bg-indigo-200 cursor-pointer px-3 py-1 text-xs">🎮 Gry Wideo</Badge>
                                <Badge variant="outline" className="bg-white text-slate-500 hover:bg-slate-100 cursor-pointer px-3 py-1 text-xs">⚽ Sport</Badge>
                                <Badge variant="outline" className="bg-white text-slate-500 hover:bg-slate-100 cursor-pointer px-3 py-1 text-xs">✈️ Podróże</Badge>
                                <Badge variant="outline" className="bg-white text-slate-500 hover:bg-slate-100 cursor-pointer px-3 py-1 text-xs">🐾 Zwierzęta</Badge>
                                <Badge variant="outline" className="bg-indigo-100 text-indigo-700 border-indigo-200 hover:bg-indigo-200 cursor-pointer px-3 py-1 text-xs">💻 Kodowanie</Badge>
                                <Badge variant="outline" className="bg-white text-slate-500 hover:bg-slate-100 cursor-pointer px-3 py-1 text-xs">🎨 Rysowanie</Badge>
                            </div>
                            <p className="text-[10px] text-indigo-400 mt-4 font-bold tracking-widest uppercase">
                                Dopasowanie Algorytmu: 85% - Gotowe!
                            </p>
                        </CardContent>
                    </Card>

                    {/* 4. CERTIFICATE REPOSITORY */}
                    <Card className="border-slate-200 shadow-sm overflow-hidden relative group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                            <Ribbon className="w-24 h-24 text-amber-500" />
                        </div>
                        <CardHeader className="pb-2 relative z-10">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <Ribbon className="h-5 w-5 text-amber-500" />
                                        <CardTitle className="text-lg font-black text-slate-800">Portfolio Osiągnięć</CardTitle>
                                    </div>
                                    <CardDescription className="text-xs font-medium">
                                        Twoja prywatna szuflada na zdobyte certyfikaty i dyplomy.
                                    </CardDescription>
                                </div>
                                <div className="bg-amber-100 text-amber-700 font-black text-xs px-2 py-1 rounded-md">
                                    3 Zdobyte
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <div className="grid grid-cols-3 gap-2 mt-2">
                                {/* Dummy Certificates */}
                                <div className="aspect-[4/3] bg-amber-50 rounded-lg border border-amber-200/50 flex flex-col items-center justify-center cursor-pointer hover:bg-amber-100 transition-colors">
                                    <Star className="h-5 w-5 text-amber-400 mb-1" />
                                    <span className="text-[8px] font-bold text-amber-700 uppercase">Starter A1</span>
                                </div>
                                <div className="aspect-[4/3] bg-amber-50 rounded-lg border border-amber-200/50 flex flex-col items-center justify-center cursor-pointer hover:bg-amber-100 transition-colors">
                                    <Flame className="h-5 w-5 text-orange-400 mb-1" />
                                    <span className="text-[8px] font-bold text-amber-700 uppercase">30 Dni</span>
                                </div>
                                <div className="aspect-[4/3] bg-slate-50 rounded-lg border border-dashed border-slate-200 flex flex-col items-center justify-center opacity-70">
                                    <Ribbon className="h-5 w-5 text-slate-300 mb-1" />
                                    <span className="text-[8px] font-bold text-slate-400 uppercase text-center leading-tight">Zablokowany<br />(B1)</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                </div>
            )}

            {user.role === 'student' && (
                <div className="mt-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                            <Gamepad2 className="h-6 w-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-800">Strefa Wyzwań (Szybka Powtórka)</h2>
                            <p className="text-sm text-slate-500 font-medium">Utrwalaj wiedzę grając. Przystąp do wyzwań na bazie Twoich materiałów.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* UNLOCKED GAME */}
                        <div className="bg-white border hover:border-indigo-300 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all group relative overflow-hidden flex flex-col justify-between min-h-[160px]">
                            <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg">ODBLOKOWANA</div>
                            <div>
                                <h3 className="font-bold text-slate-800 text-lg mb-1 group-hover:text-indigo-600 transition-colors">Word Match: Emocje</h3>
                                <p className="text-xs text-slate-500 font-medium mb-3">Na bazie E-Booka: Księga Słów A2</p>
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-100 text-[10px]">Najlepszy Wynik: 1420 pkt</Badge>
                                </div>
                            </div>
                            <Button onClick={() => toast.success("Funkcja została wywołana.")} className="w-full mt-4 bg-indigo-100 hover:bg-indigo-500 text-indigo-700 hover:text-white transition-colors" size="sm">
                                <PlayCircle className="w-4 h-4 mr-2" /> Zagraj w Dodatek
                            </Button>
                        </div>

                        {/* LOCKED GAME 1 — no purchase CTA, just locked */}
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[160px] opacity-70">
                            <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center">
                                <div className="bg-slate-800 text-white p-2 rounded-full mb-2 shadow-lg">
                                    <Star className="w-5 h-5" />
                                </div>
                                <p className="text-xs font-bold text-slate-700 bg-white px-3 py-1 rounded-full border shadow-sm">🔒 Zdobywaj XP, by odblokować</p>
                            </div>
                            <div className="blur-[2px]">
                                <h3 className="font-bold text-slate-800 text-lg mb-1">Grammar Invaders</h3>
                                <p className="text-xs text-slate-500 font-medium mb-3">Na bazie kursu: Past Simple Master</p>
                            </div>
                        </div>

                        {/* LOCKED GAME 2 — no purchase CTA, hidden on mobile */}
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[160px] opacity-70 hidden lg:flex">
                            <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center">
                                <div className="bg-slate-800 text-white p-2 rounded-full mb-2 shadow-lg">
                                    <Star className="w-5 h-5" />
                                </div>
                                <p className="text-xs font-bold text-slate-700 bg-white px-3 py-1 rounded-full border shadow-sm">🔒 Zdobywaj XP, by odblokować</p>
                            </div>
                            <div className="blur-[2px]">
                                <h3 className="font-bold text-slate-800 text-lg mb-1">Dino Run: Numbers</h3>
                                <p className="text-xs text-slate-500 font-medium mb-3">Na bazie E-Booka: Starter Pack 1-3</p>
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}

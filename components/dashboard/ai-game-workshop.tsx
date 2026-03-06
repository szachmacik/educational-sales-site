"use client";

import React, { useState } from 'react';
import { useTokens } from '@/lib/token-context';
import { generateGameFromPrompt, saveGeneratedGame, GameType, GameConfig } from '@/lib/integrations/game-generator-service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
    Sparkles,
    Gamepad,
    Zap,
    BrainCircuit,
    Layers,
    CheckCircle2,
    Loader2,
    Wand2,
    Save,
    Layout,
    Type,
    Image as ImageIcon
} from 'lucide-react';
import { toast } from 'sonner';

export function AIGameWorkshop() {
    const { tokens, useTokens: deductTokens } = useTokens();
    const [prompt, setPrompt] = useState("");
    const [gameType, setGameType] = useState<GameType>('quiz');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedGame, setGeneratedGame] = useState<GameConfig | null>(null);
    const [activeTab, setActiveTab] = useState("creator");

    const COST_PER_GEN = 50;

    const handleGenerate = async () => {
        if (!prompt || prompt.length < 5) {
            toast.error("Opisz grę nieco dokładniej (min. 5 znaków).");
            return;
        }

        if (tokens < COST_PER_GEN && tokens !== Infinity) {
            toast.error(`Potrzebujesz ${COST_PER_GEN} tokenów, aby wygenerować grę.`);
            return;
        }

        setIsGenerating(true);
        try {
            const game = await generateGameFromPrompt(prompt, gameType);

            if (deductTokens(COST_PER_GEN)) {
                try {
                    const { trackAnonymousEvent } = await import('@/lib/integrations/telemetry-service');
                    trackAnonymousEvent("ai_game_generated", { gameType, promptLength: prompt.length });
                } catch (e) { }

                setGeneratedGame(game);
                setActiveTab("preview");
                toast.success("Gra wygenerowana pomyślnie!");
            }
        } catch (error) {
            toast.error("Błąd podczas generowania gry.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSave = () => {
        if (generatedGame) {
            saveGeneratedGame(generatedGame);
            toast.success("Gra zapisana w Twojej bibliotece!");
        }
    };

    return (
        <Card className="border-none shadow-2xl bg-white/80 backdrop-blur-xl overflow-hidden rounded-[2.5rem]">
            <CardHeader className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white p-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
                            <Sparkles className="h-8 w-8 text-white" />
                        </div>
                        <div>
                            <CardTitle className="text-3xl font-black tracking-tight">AI Game Workshop</CardTitle>
                            <CardDescription className="text-white/80 font-medium">Platforma kreatywna dla nauczycieli i uczniów</CardDescription>
                        </div>
                    </div>
                    <div className="bg-white/20 px-4 sm:px-6 py-2 sm:py-3 rounded-2xl backdrop-blur-md flex items-center gap-2 sm:gap-3 border border-white/10 group hover:bg-white/30 transition-all">
                        <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-300 fill-yellow-300 group-hover:scale-125 transition-transform" />
                        <span className="font-black text-lg sm:text-xl tabular-nums">{tokens === Infinity ? "UNLIMITED" : tokens}</span>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <div className="bg-slate-50/50 border-b border-slate-100 p-2">
                        <TabsList className="bg-transparent gap-2 h-auto p-2">
                            <TabsTrigger value="creator" className="rounded-xl px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold gap-2">
                                <Wand2 className="h-4 w-4" /> Kreator AI
                            </TabsTrigger>
                            <TabsTrigger value="preview" disabled={!generatedGame} className="rounded-xl px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold gap-2">
                                <Layout className="h-4 w-4" /> Podgląd i Edycja
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="creator" className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="grid gap-8 lg:grid-cols-2">
                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <Label className="text-slate-900 font-black text-lg">O czym ma być Twoja gra?</Label>
                                    <textarea
                                        className="w-full h-40 bg-slate-50 border-slate-200 rounded-3xl p-6 text-lg focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all resize-none font-medium placeholder:text-slate-300"
                                        placeholder="Np. Słówka związane z domem dla 3 klasy, albo bitwa o Anglię - najważniejsze daty..."
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-slate-900 font-black text-lg">Wybierz format gry</Label>
                                    <div className="grid grid-cols-2 gap-4">
                                        {[
                                            { id: 'quiz', name: 'Quiz AI', icon: Type, desc: 'Pytania i odpowiedzi' },
                                            { id: 'memory', name: 'Memory', icon: BrainCircuit, desc: 'Łączenie w pary' },
                                            { id: 'sort', name: 'Sortowanie', icon: Layers, desc: 'Kategoryzacja' },
                                            { id: 'flashcards', name: 'Fiszki', icon: Layout, desc: 'Szybka nauka' }
                                        ].map((t) => (
                                            <button
                                                key={t.id}
                                                onClick={() => setGameType(t.id as GameType)}
                                                className={`flex items-start gap-4 p-5 rounded-[2rem] border-2 transition-all text-left ${gameType === t.id ? 'border-indigo-600 bg-indigo-50/50 shadow-md' : 'border-slate-100 bg-white hover:border-slate-200'}`}
                                            >
                                                <div className={`p-3 rounded-2xl ${gameType === t.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                                    <t.icon className="h-6 w-6" />
                                                </div>
                                                <div>
                                                    <div className="font-black text-slate-800">{t.name}</div>
                                                    <div className="text-xs text-slate-500">{t.desc}</div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <Button
                                    onClick={handleGenerate}
                                    disabled={isGenerating}
                                    className="w-full h-20 rounded-3xl bg-indigo-600 hover:bg-indigo-700 text-xl font-black shadow-xl shadow-indigo-200 gap-3 group"
                                >
                                    {isGenerating ? (
                                        <><Loader2 className="h-6 w-6 animate-spin" /> GENEROWANIE...</>
                                    ) : (
                                        <><Sparkles className="h-6 w-6 group-hover:scale-125 transition-transform" /> WYGENERUJ ZA {COST_PER_GEN} TOKENÓW</>
                                    )}
                                </Button>
                            </div>

                            <div className="hidden lg:block">
                                <div className="bg-slate-50 rounded-[3rem] p-10 h-full flex flex-col items-center justify-center text-center space-y-6 border border-slate-100">
                                    <div className="w-32 h-32 bg-white rounded-[2rem] shadow-xl flex items-center justify-center animate-bounce duration-[3000ms]">
                                        <Gamepad className="h-16 w-16 text-indigo-200" />
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="text-2xl font-black text-slate-800">Twórz, Edytuj, Graj</h4>
                                        <p className="text-slate-500 font-medium max-w-xs mx-auto">
                                            Wpisz temat, a nasze AI przygotuje gotowy zestaw pytań i mechanikę gry w kilka sekund.
                                        </p>
                                    </div>
                                    <div className="flex gap-3">
                                        <Badge variant="outline" className="bg-white px-4 py-2 rounded-full border-slate-200 text-slate-600 font-bold">#EdTech</Badge>
                                        <Badge variant="outline" className="bg-white px-4 py-2 rounded-full border-slate-200 text-slate-600 font-bold">#EduGames</Badge>
                                        <Badge variant="outline" className="bg-white px-4 py-2 rounded-full border-slate-200 text-slate-600 font-bold">#FastLearning</Badge>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="preview" className="p-8 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                        {generatedGame && (
                            <div className="max-w-4xl mx-auto space-y-8">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-3xl font-black text-slate-900">{generatedGame.title}</h3>
                                        <p className="text-slate-500 font-medium">{generatedGame.description}</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <Button onClick={() => toast.info("Ta funkcja będzie dostępna wkrótce.", { description: "Pracujemy nad tym! 🚀" })} variant="outline" className="rounded-2xl h-12 font-bold gap-2">
                                            <Wand2 className="h-4 w-4" /> Przeładuj AI
                                        </Button>
                                        <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700 rounded-2xl h-12 font-bold gap-2 shadow-lg shadow-emerald-100">
                                            <Save className="h-4 w-4" /> Zapisz Grę
                                        </Button>
                                    </div>
                                </div>

                                <div className="bg-slate-900 rounded-[3rem] p-12 aspect-video flex flex-col items-center justify-center text-center relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-transparent to-pink-500/20 opacity-50" />

                                    <div className="relative z-10 space-y-8">
                                        <div className="h-24 w-24 bg-white/10 backdrop-blur rounded-[2rem] flex items-center justify-center mx-auto mb-4 border border-white/20">
                                            <Gamepad className="h-12 w-12 text-white" />
                                        </div>
                                        <div className="space-y-4">
                                            <h4 className="text-white text-2xl font-black">Interaktywny Podgląd</h4>
                                            <p className="text-white/60 max-w-md mx-auto">
                                                To jest symulacja gotowej gry. W pełnej wersji tutaj pojawia się interaktywny kontener z Twoim {generatedGame.type}.
                                            </p>
                                        </div>
                                        <Button onClick={() => toast.info("Ta funkcja będzie dostępna wkrótce.", { description: "Pracujemy nad tym! 🚀" })} size="lg" className="bg-white text-indigo-900 hover:bg-indigo-50 rounded-2xl px-12 py-8 text-xl font-black shadow-2xl">
                                            URUCHOM TEST
                                        </Button>
                                    </div>
                                </div>

                                <div className="grid sm:grid-cols-3 gap-6">
                                    <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100 space-y-2">
                                        <div className="font-black text-indigo-900 text-sm">Typ Silnika</div>
                                        <div className="text-indigo-600 font-bold flex items-center gap-2">
                                            <Layers className="h-4 w-4" /> {generatedGame.type.toUpperCase()}
                                        </div>
                                    </div>
                                    <div className="bg-purple-50 p-6 rounded-3xl border border-purple-100 space-y-2">
                                        <div className="font-black text-purple-900 text-sm">Data Utworzenia</div>
                                        <div className="text-purple-600 font-bold flex items-center gap-2">
                                            <Zap className="h-4 w-4" /> {new Date(generatedGame.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div className="bg-pink-50 p-6 rounded-3xl border border-pink-100 space-y-2">
                                        <div className="font-black text-pink-900 text-sm">Status Projektu</div>
                                        <div className="text-pink-600 font-bold flex items-center gap-2">
                                            <CheckCircle2 className="h-4 w-4" /> GOTOWY DO GRY
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}

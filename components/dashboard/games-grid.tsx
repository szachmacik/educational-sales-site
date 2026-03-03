
"use client";

import { useLanguage } from "@/components/language-provider";
import { Card, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AIGameWorkshop } from "./ai-game-workshop";
import { trackPartnerImpression } from "@/lib/integrations/impression-tracker";
import { Sparkles, Gamepad, Monitor, MapPin } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import { toast } from "sonner";
export function GamesGrid() {
    const { t } = useLanguage();

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h3 className="font-bold text-2xl flex items-center gap-2">
                    <Gamepad className="h-6 w-6 text-purple-600" />
                    {t.dashboard?.games?.subtitle || "Educational Games"}
                </h3>
            </div>

            {/* AI Workshop Highlight Section */}
            <Dialog>
                <DialogTrigger asChild>
                    <div className="relative group cursor-pointer overflow-hidden rounded-[2rem] border-2 border-indigo-100 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 p-1 hover:border-indigo-300 transition-all shadow-sm hover:shadow-xl">
                        <div className="bg-white rounded-[1.8rem] p-8 flex flex-col md:flex-row items-center gap-8">
                            <div className="h-24 w-24 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-indigo-200 group-hover:scale-105 transition-transform duration-500">
                                <Sparkles className="h-12 w-12 text-white animate-pulse" />
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                                    <Badge className="bg-indigo-600 hover:bg-indigo-600">NOWOŚĆ AI</Badge>
                                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Creator Studio</span>
                                </div>
                                <h4 className="text-2xl font-black text-slate-900 mb-2">Stwórz własną grę przez AI</h4>
                                <p className="text-slate-500 font-medium">Uruchom kreatora i wygeneruj interaktywny quiz lub grę memory w kilka sekund za pomocą prostego opisu.</p>
                            </div>
                            <Button onClick={() => toast.success("Funkcja została wywołana.")} size="lg" className="bg-indigo-600 hover:bg-slate-900 rounded-xl px-8 h-14 font-bold text-lg shadow-lg shadow-indigo-100 group-hover:px-10 transition-all">
                                Otwórz Workshop
                            </Button>
                        </div>
                    </div>
                </DialogTrigger>
                <DialogContent className="max-w-6xl p-0 border-none bg-transparent shadow-none overflow-visible">
                    <AIGameWorkshop />
                </DialogContent>
            </Dialog>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 pt-4">
                {[
                    { title: "Wordwall: Home Vocabulary", provider: "Wordwall", image: "bg-blue-500", sponsorshipId: "nat_geo" },
                    { title: "Bamboozle: Verbs", provider: "Bamboozle", image: "bg-green-500", sponsorshipId: "lego_edu" },
                    { title: "Genially: Escape Room", provider: "Genially", image: "bg-purple-500", sponsorshipId: "disney_learn" }
                ].map((game, i) => (
                    <Dialog key={i} onOpenChange={(open) => {
                        if (open && game.sponsorshipId) {
                            trackPartnerImpression(game.sponsorshipId, game.title);
                        }
                    }}>
                        <Card className="overflow-hidden hover:shadow-lg transition-all cursor-pointer group h-full flex flex-col">
                            <div className={`h-40 ${game.image} flex items-center justify-center relative flex-shrink-0`}>
                                <Gamepad className="h-12 w-12 text-white/50 group-hover:scale-110 transition-transform" />
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                                <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold shadow-sm">
                                    {game.provider}
                                </div>
                            </div>
                            <CardFooter className="p-4 bg-white flex-1 flex flex-col justify-between">
                                <div className="w-full space-y-3">
                                    <h4 className="font-bold text-slate-900">{game.title}</h4>
                                    <DialogTrigger asChild>
                                        <Button onClick={() => toast.success("Funkcja została wywołana.")} className="w-full bg-slate-900 text-white hover:bg-indigo-600 shadow-sm">
                                            {t.dashboard?.games?.play || "Play now"}
                                        </Button>
                                    </DialogTrigger>
                                </div>
                            </CardFooter>
                        </Card>
                        <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                    <Gamepad className="h-5 w-5 text-indigo-600" />
                                    {game.title}
                                </DialogTitle>
                            </DialogHeader>
                            <div className="flex-1 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in-95 duration-300">
                                <div className="w-20 h-20 bg-white rounded-full shadow-sm flex items-center justify-center mb-4">
                                    <Gamepad className="h-10 w-10 text-slate-300" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-700 mb-2">{t.dashboard?.games?.loading || "Loading game..."}</h3>
                                <p className="text-muted-foreground max-w-sm">
                                    {(t.dashboard?.games?.notice || "In the full version of the app, an interactive iframe from {provider} would appear here.").replace("{provider}", game.provider)}
                                </p>
                                <div className="mt-8 flex gap-2">
                                    <Badge variant="outline">{t.dashboard?.games?.fullscreen || "Full screen"}</Badge>
                                    <Badge variant="outline">{t.dashboard?.games?.report || "Report error"}</Badge>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                ))}
            </div>
        </div>
    );
}

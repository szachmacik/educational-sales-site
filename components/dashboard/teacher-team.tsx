
"use client";

import { useLanguage } from "@/components/language-provider";
import { useTokens } from "@/lib/token-context";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Users, Plus as PlusIcon, Copy, Share2, Sparkles, CheckCircle2, Upload, FileSpreadsheet, Eye, Brain, BookOpen, Clock, AlertCircle, Gamepad2, Lightbulb, MessageSquarePlus, X
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function TeacherTeam() {
    const { t } = useLanguage();
    const { isAdmin } = useTokens();
    const isPro = true; // For demo
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [isImporting, setIsImporting] = useState(false);

    const handleImport = () => {
        setIsImporting(true);
        // Simulate network request
        setTimeout(() => {
            setIsImporting(false);
            setIsImportModalOpen(false);
            toast.success("Klasa została zaimportowana pomyślnie!");
        }, 1500);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">{t.dashboard?.team?.title || "My Class / Team"}</h2>
                    <p className="text-muted-foreground">{t.dashboard?.team?.subtitle || "Share materials with students"}</p>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        className="gap-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50 font-bold"
                        onClick={() => setIsImportModalOpen(true)}
                    >
                        <Upload className="h-4 w-4" />
                        Import z CSV (e-dziennik)
                    </Button>
                    <Button onClick={() => toast.success("Moduł przypisywania gier zostanie odblokowany po podpięciu kont uczniów.")} className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 font-bold">
                        <PlusIcon className="h-4 w-4" />
                        {t.dashboard?.team?.create_class || "Create new class"}
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Class Card 1 */}
                <Card className="border-slate-200 shadow-sm hover:shadow-md transition-all">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 bg-slate-50/50 border-b">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                                <Users className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">Grupa A1 (Wtorki)</CardTitle>
                                <p className="text-xs text-muted-foreground">{(t.dashboard?.team?.created_at || "Created: {date}").replace("{date}", "12.01.2024")}</p>
                            </div>
                        </div>
                        <Badge className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50">
                            {(t.dashboard?.team?.students_count || "{count} students").replace("{count}", "12")}
                        </Badge>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6">
                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between group cursor-pointer hover:border-indigo-200 transition-colors">
                            <div className="flex-1 min-w-0 mr-4">
                                <p className="text-xs font-medium text-muted-foreground mb-1">{t.dashboard?.team?.access_code || "Student access code"}</p>
                                <code className="text-sm font-mono font-bold text-slate-700">KLASA-A1-X8Z9</code>
                            </div>
                            <Button onClick={() => { navigator.clipboard.writeText('KLASA-A1-X8Z9'); toast.success('Skopiowano kod do schowka!'); }} size="icon" variant="ghost" className="h-8 w-8 text-slate-400 group-hover:text-indigo-600">
<Copy className="h-4 w-4" />
</Button>
                        </div>

                        {/* STUDENT LIST WITH SMART TAGS & TELEMETRY */}
                        <div className="space-y-3 mt-4 pt-4 border-t border-slate-100">
                            {/* Student 1 */}
                            <div className="bg-white border rounded-lg p-3 shadow-sm flex items-start justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <p className="text-sm font-bold text-slate-800">Jan Kowalski</p>
                                        <Badge variant="outline" className="bg-sky-50 text-sky-700 border-sky-200 text-[10px] h-5 px-1.5 gap-1">
                                            <Eye className="w-3 h-3" /> Wzrokowiec
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs">
                                        <div className="flex items-center gap-1 text-slate-500">
                                            <BookOpen className="w-3 h-3 text-emerald-500" />
                                            Poziom: A1
                                        </div>
                                    </div>
                                </div>
                                <Button onClick={() => window.location.href = "mailto:kontakt@kamilaenglish.com?subject=Pomysł na platformę"} size="sm" variant="ghost" className="h-7 text-[10px] gap-1 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 px-2 font-bold">
                                    <Gamepad2 className="w-3 h-3" />
                                    Zadaj Grę
                                </Button>
                            </div>

                            {/* Student 2 */}
                            <div className="bg-white border rounded-lg p-3 shadow-sm flex items-start justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <p className="text-sm font-bold text-slate-800">Anna Nowak</p>
                                        <Badge variant="outline" className="bg-violet-50 text-violet-700 border-violet-200 text-[10px] h-5 px-1.5 gap-1">
                                            <Brain className="w-3 h-3" /> Dysleksja
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs">
                                        <div className="flex items-center gap-1 text-slate-500">
                                            <BookOpen className="w-3 h-3 text-emerald-500" />
                                            Poziom: A1+
                                        </div>
                                    </div>
                                </div>
                                <Button onClick={() => toast.success("Moduł przypisywania gier zostanie odblokowany po podpięciu kont uczniów.")} size="sm" variant="ghost" className="h-7 text-[10px] gap-1 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 px-2 font-bold">
                                    <Gamepad2 className="w-3 h-3" />
                                    Zadaj Grę
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="border-t bg-slate-50/30 p-4">
                        <Button onClick={() => toast.info("Moduł zarządzania uczniami w trakcie integracji z E-dziennikami.")} variant="outline" className="w-full text-xs h-9 font-medium hover:bg-white hover:text-indigo-600 hover:border-indigo-200 transition-colors font-bold">
                            Zarządzaj zespołem & Wgraj (CSV)
                        </Button>
                    </CardFooter>
                </Card>

                {/* Class Card 2 - Empty State / Create */}
                <Card className="border-dashed border-2 flex flex-col items-center justify-center p-6 text-center text-muted-foreground bg-slate-50/30 hover:bg-slate-50 hover:border-indigo-300 transition-all cursor-pointer group h-full min-h-[300px]">
                    <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                        <PlusIcon className="h-8 w-8 text-slate-300 group-hover:text-indigo-500" />
                    </div>
                    <h3 className="font-semibold text-slate-700 text-lg mb-1">{t.dashboard?.team?.empty?.title || "New Class"}</h3>
                    <p className="text-sm text-muted-foreground max-w-xs mx-auto mb-6">
                        {t.dashboard?.team?.empty?.desc || "Create a group for your students."}
                    </p>
                    <Button onClick={() => toast.info("Kreator grup ukaże się w wersji 2.0 (wkrótce)")} variant="secondary" className="group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        {t.dashboard?.team?.empty?.btn || "Start Setup"}
                    </Button>
                </Card>
            </div>

            {/* Pro Suggestion Banner */}
            <div className="mt-8 relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-xl shadow-indigo-200/50">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Sparkles className="h-64 w-64 transform translate-x-12 -translate-y-12" />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-8 gap-6">
                    <div className="max-w-xl">
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium mb-4 border border-white/10">
                            <Sparkles className="h-3 w-3 text-yellow-300" />
                            PRO Feature
                        </div>
                        <h3 className="text-2xl font-bold mb-2">
                            {(isPro || isAdmin)
                                ? (t.dashboard?.team?.pro?.active || "Your PRO plan is active")
                                : (t.dashboard?.team?.pro?.unlock || "Unlock unlimited classes")}
                        </h3>
                        <p className="text-indigo-100 leading-relaxed">
                            {t.dashboard?.team?.pro?.desc || "Teacher PRO plan allows creating unlimited groups."}
                        </p>
                    </div>
                    {!(isPro || isAdmin) ? (
                        <Button onClick={() => toast.success("Funkcja została wywołana.")} size="lg" className="bg-white text-indigo-600 hover:bg-indigo-50 border-none font-bold shadow-lg shrink-0 w-full md:w-auto">
                            {t.dashboard?.team?.pro?.upgrade || "Upgrade to PRO"}
                        </Button>
                    ) : (
                        <div className="px-6 py-3 bg-emerald-500/20 border border-emerald-500/30 rounded-xl flex items-center gap-2 text-emerald-300 font-bold shrink-0">
                            <CheckCircle2 className="h-5 w-5" />
                            {t.dashboard?.team?.pro?.status || "Active"}
                        </div>
                    )}
                </div>
            </div>

            {/* Platform Wishlist Feature */}
            <div className="mt-6 border border-indigo-100 bg-indigo-50/50 rounded-2xl p-6 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-md transition-shadow">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                    <Lightbulb className="w-32 h-32 text-indigo-600 transform translate-x-12 -translate-y-8" />
                </div>
                <div className="flex items-center gap-4 relative z-10 w-full md:w-auto">
                    <div className="h-12 w-12 bg-white rounded-xl shadow-sm flex items-center justify-center shrink-0">
                        <Lightbulb className="h-6 w-6 text-indigo-500" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800 text-lg">Wishlista i Pomysły</h3>
                        <p className="text-sm text-slate-600 max-w-md"> Czegoś brakuje? Zauważyłeś problem? Jesteśmy tu dla Ciebie. Dodaj swój pomysł na usprawnienie platformy, a my postaramy się go wdrożyć.</p>
                    </div>
                </div>
                <Button onClick={() => toast.success("Funkcja została wywołana.")} className="relative z-10 w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 font-bold gap-2 whitespace-nowrap">
                    <MessageSquarePlus className="h-4 w-4" /> Zgłoś Pomysł
                </Button>
            </div>

            {/* IMPORT CSV MODAL */}
            {isImportModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                            <div>
                                <h3 className="font-bold text-lg text-slate-800">Błyskawiczny Import Klasy</h3>
                                <p className="text-xs text-slate-500">Z e-dziennika (Librus, Vulcan)</p>
                            </div>
                            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-600" onClick={() => setIsImportModalOpen(false)}>
                                <X className="h-5 w-5" />
                            </Button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-slate-50 hover:bg-indigo-50/50 hover:border-indigo-300 transition-colors cursor-pointer group">
                                <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mb-3 group-hover:scale-110 transition-transform">
                                    <FileSpreadsheet className="h-6 w-6" />
                                </div>
                                <p className="text-sm font-bold text-slate-700 mb-1">Przeciągnij plik .CSV tutaj</p>
                                <p className="text-xs text-slate-500">lub kliknij, aby wybrać z dysku</p>
                            </div>

                            <div className="bg-amber-50 rounded-lg p-3 border border-amber-100 flex items-start gap-3">
                                <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                                <p className="text-xs text-amber-800 leading-relaxed">
                                    Pamiętaj, że do systemu importowane są <strong>tylko imiona lub pseudonimy</strong> uczniów. Wymóg zgodności z RODO dla pełnego bezpieczeństwa szkoły.
                                </p>
                            </div>
                        </div>
                        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                            <Button variant="outline" onClick={() => setIsImportModalOpen(false)}>Anuluj</Button>
                            <Button
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold min-w-[120px]"
                                onClick={handleImport}
                                disabled={isImporting}
                            >
                                {isImporting ? "Importowanie..." : "Wgraj listę"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

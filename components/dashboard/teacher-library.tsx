
"use client";

import Link from "next/link";
import { useLanguage } from "@/components/language-provider";
import { useTokens } from "@/lib/token-context";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Download, BookOpen, CheckCircle2, Trophy, LayoutDashboard,
    Monitor, MapPin, ShoppingBag, FileText as FileTextIcon,
    Eye, X, Flame, Users, Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Course } from "@/lib/mock-data";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

import { toast } from "sonner";
interface TeacherLibraryProps {
    courses: Course[];
    setCategoryFilter: (filter: string) => void;
    filteredCourses: Course[];
}

export function TeacherLibrary({ courses, setCategoryFilter, filteredCourses }: TeacherLibraryProps) {
    const { t, language } = useLanguage();
    const [showPreviewDialog, setShowPreviewDialog] = useState(false);
    const [previewCourse, setPreviewCourse] = useState<Course | null>(null);
    const [mixedAbility, setMixedAbility] = useState(false);

    // Feature toggles
    const showRecommendations = typeof window !== 'undefined' && localStorage.getItem('feature_smart_recommendations') !== 'false';
    const showMixedAbility = typeof window !== 'undefined' && localStorage.getItem('feature_mixed_ability') !== 'false';
    const showEmergencyWarmup = typeof window !== 'undefined' && localStorage.getItem('feature_emergency_warmup') !== 'false';

    const recommendations = [
        { title: "Summer Camp: Flashcards", category: "PDF Pack", price: "29 zł", image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&q=80" },
        { title: "Business English A2", category: "Course", price: "89 zł", image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&q=80" }
    ];

    return (
        <div>
            {/* Phase 8: Zaraz Wchodzę! (No-Prep Emergency Button) */}
            {showEmergencyWarmup && (
                <div className="bg-gradient-to-r from-rose-500 to-orange-500 rounded-3xl p-6 md:p-8 mb-8 text-white shadow-xl shadow-rose-500/20 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="bg-white/20 text-white text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md flex items-center gap-1 backdrop-blur-md border border-white/20">
                                <Flame className="h-3 w-3 text-yellow-300" /> Tryb Awaryjny
                            </span>
                        </div>
                        <h3 className="text-2xl md:text-3xl font-black mb-2 tracking-tight">Zaraz Wchodzę! (0-Prep)</h3>
                        <p className="text-sm font-medium text-rose-50 max-w-xl leading-relaxed">
                            Za 2 minuty dzwonek, a Ty nie masz nic? Kliknij guzik paniki, a wylosujemy dla Ciebie uniwersalną, angażującą rozgrzewkę (Warm-up) na ekran, która nie wymaga kserowania.
                        </p>
                    </div>
                    <Button onClick={() => toast.info("Ta funkcja będzie dostępna wkrótce.", { description: "Pracujemy nad tym! 🚀" })} size="lg" className="bg-white text-rose-600 hover:bg-rose-50 font-black shadow-lg rounded-2xl h-14 px-8 text-lg shrink-0 relative z-10 w-full md:w-auto hover:scale-105 transition-transform">
                        Uratuj moją lekcję 🚀
                    </Button>
                </div>
            )}
            {courses.length > 0 && (
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="md:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-indigo-100 relative overflow-hidden flex flex-col justify-center min-h-[220px]">
                        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-indigo-50 to-transparent pointer-events-none" />
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-4">
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 gap-1 pl-1.5">
                                    <CheckCircle2 className="h-3 w-3" />
                                    {t.dashboard?.library?.recent || "Recently Purchased"}
                                </Badge>
                                <span className="text-xs text-muted-foreground">12.02.2024</span>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Mega Pack: Scenariusze A1-A2</h2>
                            <p className="text-slate-600 mb-6 max-w-lg">{t.dashboard?.library?.packDesc || "Complete set of materials for the whole school year."}</p>
                            <div className="flex gap-3">
                                <Button onClick={() => toast.info("Ta funkcja będzie dostępna wkrótce.", { description: "Pracujemy nad tym! 🚀" })} className="bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200 gap-2">
                                    <Download className="h-4 w-4" />
                                    {t.dashboard?.library?.downloadZip || "Download all (ZIP)"}
                                </Button>
                                <Button onClick={() => toast.info("Ta funkcja będzie dostępna wkrótce.", { description: "Pracujemy nad tym! 🚀" })} variant="outline" className="gap-2">
                                    <BookOpen className="h-4 w-4" />
                                    {t.dashboard?.library?.browseFiles || "Browse files"}
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100 flex flex-col justify-between shadow-sm">
                        <div>
                            <div className="bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-sm mb-4 text-amber-500">
                                <Trophy className="h-5 w-5" />
                            </div>
                            <h3 className="font-bold text-lg text-slate-800">{t.dashboard?.library?.progress || "Your Progress"}</h3>
                            <p className="text-sm text-slate-600 mt-1">
                                {(t.dashboard?.library?.progressDesc || "Completed {percent}% of materials.").replace("{percent}", "15").replace("{pack}", "Mega Pack")}
                            </p>
                        </div>
                        <div className="mt-4">
                            <div className="flex justify-between text-xs font-semibold text-amber-800 mb-2">
                                <span>{t.dashboard?.library?.level || "Level"} 1</span>
                                <span>150 / 1000 {t.dashboard?.sidebar?.points || "pts"}</span>
                            </div>
                            <Progress value={15} className="h-2 bg-amber-100" />
                        </div>
                    </div>
                </div>
            )}

            {/* Resources Grid */}
            <div>
                {/* Module: Smart Recommendations (Only if enabled) */}
                {showRecommendations && (
                    <div className="mb-10 animate-in fade-in slide-in-from-bottom-2 duration-700">
                        <div className="flex items-center gap-2 mb-4">
                            <Sparkles className="h-5 w-5 text-amber-500" />
                            <h3 className="font-bold text-lg text-slate-800">Polecane dla Ciebie (AI Picks)</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {recommendations.map((rec, i) => (
                                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all group cursor-pointer">
                                    <div className="h-16 w-16 rounded-xl overflow-hidden shrink-0">
                                        <img src={rec.image} alt={rec.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                    <div className="flex-1">
                                        <Badge variant="outline" className="text-[9px] uppercase font-bold text-indigo-500 mb-1 border-indigo-100">{rec.category}</Badge>
                                        <h4 className="font-bold text-slate-900 text-sm leading-tight truncate">{rec.title}</h4>
                                        <p className="text-xs font-bold text-emerald-600 mt-1">{rec.price}</p>
                                    </div>
                                    <Button onClick={() => toast.info("Ta funkcja będzie dostępna wkrótce.", { description: "Pracujemy nad tym! 🚀" })} size="sm" variant="ghost" className="rounded-full h-8 w-8 p-0 hover:bg-indigo-50 text-indigo-600">
                                        <ShoppingBag className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
                    <h3 className="font-bold text-xl flex items-center gap-2 text-slate-900">
                        <LayoutDashboard className="h-5 w-5 text-indigo-600" />
                        {t.dashboard?.library?.title || "Your Library"}
                    </h3>

                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                        {/* Phase 8: Mixed-Ability Toggle */}
                        {showMixedAbility && (
                            <div
                                className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-indigo-100 cursor-pointer shadow-sm hover:border-indigo-300 transition-colors w-full sm:w-auto justify-between sm:justify-start group"
                                onClick={() => setMixedAbility(!mixedAbility)}
                            >
                                <div className="flex items-center gap-2">
                                    <div className={`p-1.5 rounded-md ${mixedAbility ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                                        <Users className="h-4 w-4" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-black text-slate-800 leading-none mb-0.5">Zróżnicowane Grupy</span>
                                        <span className="text-[9px] font-bold text-indigo-600 uppercase tracking-widest leading-none">Mixed-Ability Mode</span>
                                    </div>
                                </div>
                                <Switch checked={mixedAbility} onCheckedChange={setMixedAbility} className="data-[state=checked]:bg-indigo-600" />
                            </div>
                        )}

                        <Tabs defaultValue="all" className="w-full sm:w-auto" onValueChange={setCategoryFilter}>
                            <TabsList className="bg-white border text-slate-600 w-full sm:w-auto flex">
                                <TabsTrigger value="all" className="flex-1">{t.dashboard?.library?.filters?.all || "All"}</TabsTrigger>
                                <TabsTrigger value="pdf" className="flex-1">{t.dashboard?.library?.filters?.pdf || "E-Books & PDF"}</TabsTrigger>
                                <TabsTrigger value="audio" className="flex-1">{t.dashboard?.library?.filters?.audio || "Audio"}</TabsTrigger>
                                <TabsTrigger value="courses" className="flex-1">{t.dashboard?.library?.filters?.courses || "Online Courses"}</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredCourses.map((course) => (
                        <Card key={course.id} className="group flex flex-col overflow-hidden border-slate-200 shadow-sm hover:shadow-xl hover:translate-y-[-2px] transition-all duration-300 bg-white">
                            <div className="h-48 bg-slate-100 relative overflow-hidden">
                                <img
                                    src={course.image_url}
                                    alt={course.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />

                                <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
                                    <Badge className="bg-white/90 backdrop-blur text-indigo-600 hover:bg-white font-bold shadow-sm capitalize px-2 py-0.5">
                                        {course.category === 'game' ? (t.dashboard?.library?.badges?.game || 'Educational Game') : (course.category + ' ' + (t.dashboard?.library?.badges?.pack || 'Pack'))}
                                    </Badge>
                                    {course.teachingMode && (
                                        <Badge variant="secondary" className={cn(
                                            "backdrop-blur font-bold shadow-sm px-2 py-0.5 border-none flex items-center gap-1",
                                            course.teachingMode === 'online' ? "bg-blue-500/80 text-white" :
                                                course.teachingMode === 'stationary' ? "bg-emerald-500/80 text-white" :
                                                    "bg-amber-500/80 text-white"
                                        )}>
                                            {course.teachingMode === 'online' ? <Monitor className="h-3 w-3" /> : <MapPin className="h-3 w-3" />}
                                            {course.teachingMode === 'online' ? (t.dashboard?.course?.teachingModes?.online || 'Online') : (t.dashboard?.course?.teachingModes?.stationary || 'In-person')}
                                        </Badge>
                                    )}
                                </div>

                                <div className="absolute bottom-4 left-4 text-white">
                                    <FileTextIcon className="h-4 w-4 inline-block mr-1 opacity-80" />
                                    <span className="text-xs font-medium opacity-90">12 {t.dashboard?.library?.stats?.files || "files"} • 156 MB</span>
                                </div>
                            </div>

                            <CardContent className="flex-1 p-5 pt-6">
                                <h4 className="font-bold text-lg leading-tight mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
                                    {course.title}
                                </h4>

                                {/* Phase 8: Conditional UI for Mixed-Ability */}
                                {mixedAbility && (
                                    <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-2.5 mb-3 flex items-start gap-2 animate-in fade-in slide-in-from-top-1">
                                        <Sparkles className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
                                        <p className="text-[10px] text-indigo-900 leading-tight font-medium">
                                            Dostępne warianty dostosowane: <span className="font-bold">Dysleksja</span> (czcionka OpenDyslexic), <span className="font-bold">Wersje Uproszczone</span> (mniej tekstu).
                                        </p>
                                    </div>
                                )}

                                <p className="text-sm text-slate-500 line-clamp-2 mb-4">
                                    {course.excerpt}
                                </p>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    {course.modules?.slice(0, 2).map((mod, i) => (
                                        <span key={i} className="text-[10px] bg-slate-50 text-slate-600 px-2 py-1 rounded border border-slate-100 truncate max-w-[120px]">
                                            {mod.title}
                                        </span>
                                    ))}
                                    {(course.modules?.length || 0) > 2 && (
                                        <span className="text-[10px] bg-slate-50 text-slate-600 px-2 py-1 rounded border border-slate-100">
                                            +{course.modules!.length - 2} {t.dashboard?.library?.stats?.more || "more"}
                                        </span>
                                    )}
                                </div>
                            </CardContent>

                            <CardFooter className="p-5 pt-0 mt-auto flex gap-2">
                                <Button className="flex-1 bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-none" asChild>
                                    <Link href={`/${language}/dashboard/course/${course.slug}`}>
                                        <Download className="h-4 w-4 mr-2" />
                                        {t.dashboard?.library?.open || "Open Pack"}
                                    </Link>
                                </Button>
                                {course.source?.embedHtml && (
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700"
                                        onClick={() => {
                                            setPreviewCourse(course);
                                            setShowPreviewDialog(true);
                                        }}
                                        title={t.dashboard?.library?.interactivePreview || "Interactive preview"}
                                    >
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                )}
                            </CardFooter>
                        </Card>
                    ))}

                    {/* Placeholder for 'Add more' */}
                    <div className="border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-6 text-center space-y-4 hover:border-indigo-300 hover:bg-slate-50 transition-all cursor-pointer group min-h-[380px]">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform text-slate-400 group-hover:text-indigo-500">
                            <ShoppingBag className="h-8 w-8" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-700">{t.dashboard?.library?.discover?.title || "Discover more materials"}</h3>
                            <p className="text-sm text-muted-foreground mt-2 max-w-[200px] mx-auto">{t.dashboard?.library?.discover?.desc || "Browse the shop and add new packs."}</p>
                        </div>
                        <Button onClick={() => toast.info("Otwieranie formularza (wkrótce)...")} variant="outline" className="mt-4">
                            {t.dashboard?.library?.discover?.btn || "Go to Shop"}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Interactive Preview Dialog */}
            <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
                <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden bg-white border-slate-200 rounded-[2.5rem] shadow-2xl">
                    <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                        <div>
                            <DialogTitle className="text-slate-900 font-black text-xl">{previewCourse?.title}</DialogTitle>
                            <DialogDescription className="text-slate-500 font-medium">
                                {t.dashboard?.library?.interactiveGamePreview || "Interactive game preview"}
                            </DialogDescription>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => setShowPreviewDialog(false)} className="text-slate-400 hover:text-slate-600 rounded-full">
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                    <div className="relative w-full overflow-hidden bg-slate-100" style={{ paddingTop: '56.25%' /* 16:9 Aspect Ratio */ }}>
                        {previewCourse?.source?.embedHtml ? (
                            <div
                                className="absolute inset-0 w-full h-full flex items-center justify-center"
                                dangerouslySetInnerHTML={{
                                    __html: previewCourse.source.embedHtml
                                        .replace(/width="\d+"/, 'width="100%"')
                                        .replace(/height="\d+"/, 'height="100%"')
                                        .replace(/style="[^"]*"/, 'style="width: 100%; height: 100%; border: none;"')
                                }}
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-slate-400 font-medium">
                                {t.dashboard?.library?.noInteractivePreview || "No interactive preview available"}
                            </div>
                        )}
                    </div>
                    <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                        <Button onClick={() => setShowPreviewDialog(false)} className="rounded-xl bg-indigo-600 hover:bg-indigo-700 font-bold px-8 shadow-lg shadow-indigo-100">
                            {t.dashboard?.library?.closePreview || "Close preview"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

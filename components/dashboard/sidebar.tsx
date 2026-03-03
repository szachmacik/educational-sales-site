
"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/components/language-provider";
import { useTokens } from "@/lib/token-context";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
    BookOpen, Trophy, Gamepad, User, Settings, ShoppingBag, Coins, Users, LogOut, Sparkles, Flame, Star, ChevronDown, GraduationCap, Briefcase, Baby, Server
} from "lucide-react";
import { toast } from "sonner";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SidebarProps {
    user: { name: string; role: 'student' | 'teacher' | 'admin' | 'school' };
    activeTab: string;
    setActiveTab: (id: string) => void;
    handleLogout: () => void;
    onRoleChange?: (role: 'student' | 'teacher' | 'school') => void;
}

export function Sidebar({ user, activeTab, setActiveTab, handleLogout, onRoleChange }: SidebarProps) {
    const { t } = useLanguage();
    const { isAdmin } = useTokens();
    const isPro = user.role === 'admin' || user.role === 'teacher' || user.role === 'school';

    // Phase 14: Feature Toggles Evaluation
    const [showViewer, setShowViewer] = useState(true);
    const [showMarket, setShowMarket] = useState(true);
    const [showGames, setShowGames] = useState(true);
    const [showAwards, setShowAwards] = useState(true);
    const [showWallet, setShowWallet] = useState(true);

    useEffect(() => {
        const userEmail = "demo@example.com"; // Mock user email for the demo dashboard

        // In a real app, if localStorage is entirely empty for this key, we might want a default. 
        // For the sake of the demo, we assume if it's not set, it's ON initially, OR we can default it to OFF.
        // Let's default to OFF if the key exists and is 'false', otherwise ON for demo purposes if null.
        const vStored = localStorage.getItem("feature_apiViewer_global");
        const mStored = localStorage.getItem("feature_marketplace_global");
        const gStored = localStorage.getItem("feature_internal_games_global");
        const aStored = localStorage.getItem("feature_internal_gamification_global");
        const wStored = localStorage.getItem("feature_internal_wallet_global");

        const vGlobal = vStored !== "false";
        const mGlobal = mStored !== "false";

        setShowGames(gStored !== "false");
        setShowAwards(aStored !== "false");
        setShowWallet(wStored !== "false");

        let vBeta: string[] = [];
        let mBeta: string[] = [];
        try {
            vBeta = JSON.parse(localStorage.getItem("feature_apiViewer_beta") || "[]");
            mBeta = JSON.parse(localStorage.getItem("feature_marketplace_beta") || "[]");
        } catch (e) { }

        setShowViewer(vGlobal || vBeta.includes(userEmail));
        setShowMarket(mGlobal || mBeta.includes(userEmail));
    }, []);

    let navItems: { id: string, label: string, icon: any }[] = [];

    if (user.role === 'school') {
        navItems = [
            { id: "licenses", label: "Licencje Placówki", icon: BookOpen },
            { id: "team", label: "Nauczyciele / Zespół", icon: Users },
            ...(showViewer ? [{ id: "api-embed", label: "Zewnętrzny Portal (API)", icon: Server }] : []),
            ...(showMarket ? [{ id: "extensions", label: "Usługi Premium B2B", icon: Sparkles }] : []),
            { id: "purchases", label: "Faktury i Dokumenty", icon: ShoppingBag },
            { id: "profile", label: "Dane Szkoły", icon: Settings },
        ];
    } else if (user.role === 'teacher') {
        navItems = [
            { id: "learning", label: t.dashboard?.sidebar?.library || "Materials Library", icon: BookOpen },
            { id: "team", label: t.dashboard?.sidebar?.team || "My Class / Team", icon: Users },
            ...(showViewer ? [{ id: "api-embed", label: "Twój Portal (API)", icon: Server }] : []),
            ...(showMarket ? [{ id: "extensions", label: "Narzędzia i Rozszerzenia", icon: Sparkles }] : []),
            { id: "purchases", label: t.dashboard?.sidebar?.purchases || "Invoices & Purchases", icon: ShoppingBag },
            ...(showWallet ? [{ id: "wallet", label: t.dashboard?.sidebar?.wallet || "Points Wallet", icon: Coins }] : []),
            { id: "profile", label: t.dashboard?.sidebar?.settings || "Account Settings", icon: Settings },
        ];
    } else {
        navItems = [
            { id: "learning", label: t.dashboard?.sidebar?.myLessons || "My Lessons", icon: BookOpen },
            ...(showGames ? [{ id: "games", label: t.dashboard?.sidebar?.interactiveGames || "Games & Fun", icon: Gamepad }] : []),
            ...(showAwards ? [{ id: "awards", label: t.dashboard?.sidebar?.myAwards || "My Awards", icon: Trophy }] : []),
            { id: "profile", label: t.dashboard?.sidebar?.myProfile || "My Profile", icon: User },
        ];
    }

    return (
        <aside className="w-full md:w-64 flex-shrink-0 space-y-6">

            {/* MULTI-ROLE CONTEXT SWITCHER (Phase 11) */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center justify-between cursor-pointer hover:bg-slate-800 transition-colors group shadow-md text-white select-none">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center group-hover:bg-indigo-500/30 transition-colors">
                                {user.role === 'teacher' ? <Briefcase className="h-4 w-4" /> :
                                    user.role === 'school' ? <GraduationCap className="h-4 w-4" /> :
                                        <Baby className="h-4 w-4" />}
                            </div>
                            <div className="flex flex-col text-left">
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Obecny Kontekst:</span>
                                <span className="text-sm font-bold text-slate-100">
                                    {user.role === 'teacher' ? 'Korepetytor (Prywatny)' :
                                        user.role === 'school' ? 'Nauczyciel (Szkoła)' :
                                            'Konto Rodzica'}
                                </span>
                            </div>
                        </div>
                        <ChevronDown className="h-4 w-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[250px] p-2 space-y-1 bg-white border-slate-100 shadow-xl rounded-xl">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 py-1 mb-1">Przełącz Profil</p>

                    <DropdownMenuItem
                        onClick={() => onRoleChange?.('teacher')}
                        className={`flex items-center gap-3 p-3 cursor-pointer rounded-lg ${user.role === 'teacher' ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-slate-50'}`}
                    >
                        <Briefcase className={`h-4 w-4 ${user.role === 'teacher' ? 'text-indigo-600' : 'text-slate-400'}`} />
                        <div className="flex flex-col">
                            <span className="font-bold text-sm">Korepetytor</span>
                            <span className="text-xs text-slate-500">Prywatne materiały i klienci</span>
                        </div>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        onClick={() => onRoleChange?.('school')}
                        className={`flex items-center gap-3 p-3 cursor-pointer rounded-lg ${user.role === 'school' ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-slate-50'}`}
                    >
                        <GraduationCap className={`h-4 w-4 ${user.role === 'school' ? 'text-indigo-600' : 'text-slate-400'}`} />
                        <div className="flex flex-col">
                            <span className="font-bold text-sm">Nauczyciel Szkolny</span>
                            <span className="text-xs text-slate-500">Licencja placówki: SP nr 1</span>
                        </div>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        onClick={() => onRoleChange?.('student')}
                        className={`flex items-center gap-3 p-3 cursor-pointer rounded-lg ${user.role === 'student' ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-slate-50'}`}
                    >
                        <Baby className={`h-4 w-4 ${user.role === 'student' ? 'text-indigo-600' : 'text-slate-400'}`} />
                        <div className="flex flex-col">
                            <span className="font-bold text-sm">Rodzic / Uczeń</span>
                            <span className="text-xs text-slate-500">Podgląd nauki dziecka</span>
                        </div>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Gamified User Profile Summary */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center relative overflow-hidden">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 mx-auto mb-3 flex items-center justify-center text-white text-2xl font-bold hover:scale-105 transition-transform cursor-pointer shadow-md">
                    {user.name.charAt(0)}
                </div>
                <h3 className="font-bold text-lg">{user.name}</h3>

                {/* ROLE: STUDENT GAMIFICATION */}
                {user.role === 'student' && (
                    <>
                        <p className="text-xs text-indigo-600 font-bold uppercase tracking-widest mb-3">Poszukiwacz Przygód</p>
                        <div className="flex items-center justify-center gap-4 mb-4">
                            <div className="flex flex-col items-center justify-center bg-orange-50 text-orange-700 py-1.5 px-3 rounded-xl border border-orange-100">
                                <div className="flex items-center gap-1 font-black text-lg">
                                    <Flame className="h-5 w-5 fill-orange-500 text-orange-600" />
                                    <span>12</span>
                                </div>
                                <span className="text-[10px] uppercase font-bold tracking-wider">Dni z rzędu</span>
                            </div>
                            <div className="flex flex-col items-center justify-center bg-indigo-50 text-indigo-700 py-1.5 px-3 rounded-xl border border-indigo-100">
                                <div className="flex items-center gap-1 font-black text-lg">
                                    <Star className="h-5 w-5 fill-indigo-500 text-indigo-600" />
                                    <span>Poziom 4</span>
                                </div>
                                <span className="text-[10px] uppercase font-bold tracking-wider">Awatar</span>
                            </div>
                        </div>

                        <div className="space-y-1.5 text-left bg-slate-50 p-3 rounded-xl border border-slate-100">
                            <div className="flex justify-between text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                                <span>EXP do Świetlika</span>
                                <span className="text-indigo-600">350 / 500</span>
                            </div>
                            <Progress value={70} className="h-2 [&>div]:bg-gradient-to-r [&>div]:from-indigo-400 [&>div]:to-purple-500" />
                            <p className="text-[10px] text-slate-400 text-center pt-1 font-medium">Jeszcze 150 EXP do ewolucji zwierzaka!</p>
                        </div>
                    </>
                )}

                {/* ROLE: TEACHER GAMIFICATION */}
                {user.role === 'teacher' && (
                    <>
                        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-4">{t.dashboard?.sidebar?.rank || "Edukator Pro"}</p>
                        <div className="flex flex-col gap-2 mb-4">
                            <div className="flex items-center justify-between text-sm font-medium bg-amber-50 py-2 px-4 rounded-xl border border-amber-100 transition-colors hover:bg-amber-100 cursor-pointer">
                                <span className="text-amber-800 text-xs font-bold uppercase tracking-wider">Portfel Waluty</span>
                                <div className="flex items-center gap-1.5">
                                    <span className="font-black text-amber-600">250</span>
                                    <Coins className="h-4 w-4 fill-amber-500 text-amber-600" />
                                </div>
                            </div>
                            <p className="text-[10px] text-slate-400">Wymień monety na darmowe scenariusze lekcji</p>
                        </div>

                        <div className="space-y-1 text-left">
                            <div className="flex justify-between text-xs text-muted-foreground font-medium">
                                <span>Do poziomu Mistrza</span>
                                <span>75%</span>
                            </div>
                            <Progress value={75} className="h-1.5" />
                        </div>
                    </>
                )}

                {/* ROLE: SCHOOL WIDGET */}
                {user.role === 'school' && (
                    <>
                        <p className="text-xs text-emerald-600 font-bold uppercase tracking-widest mb-4">Główne Konto Zakupowe</p>
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-left space-y-2">
                            <p className="text-xs font-medium text-slate-500">Zarządzasz dostępem dla Nauczycieli.</p>
                        </div>
                    </>
                )}
            </div>

            {/* Subscription Status Card */}
            {user.role === 'teacher' && (
                <div className="bg-slate-900 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                        <Sparkles className="h-24 w-24" />
                    </div>
                    <div className="relative z-10">
                        <p className="text-xs font-medium text-slate-300 uppercase tracking-widest mb-1">{t.dashboard?.subscription?.title || "Your Plan"}</p>
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            {isAdmin ? "Administrator (PRO)" : (isPro ? "Teacher PRO" : "Teacher (Free)")}
                            {(isPro || isAdmin) && <Badge className="bg-yellow-500 text-black hover:bg-yellow-400">PRO</Badge>}
                        </h3>

                        {(isPro || isAdmin) ? (
                            <div className="space-y-2 mb-4">
                                <div className="flex justify-between text-xs text-slate-300">
                                    <span>{t.dashboard?.subscription?.activeClasses || "Active Classes"}</span>
                                    <span>{t.dashboard?.subscription?.unlimited || "Unlimited"}</span>
                                </div>
                                <div className="flex justify-between text-xs text-slate-300">
                                    <span>{t.dashboard?.subscription?.export || "Material Export"}</span>
                                    <span>{t.dashboard?.subscription?.active || "Active"}</span>
                                </div>
                                {isAdmin && (
                                    <div className="flex justify-between text-xs text-amber-400 font-bold border-t border-white/10 pt-2 mt-2">
                                        <span>{t.dashboard?.subscription?.aiCredits || "AI Credits"}</span>
                                        <span>{t.dashboard?.subscription?.unlimited || "Unlimited"}</span>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <div className="space-y-2 mb-4">
                                    <div className="flex justify-between text-xs text-slate-300">
                                        <span>{t.dashboard?.subscription?.classes || "Classes"}</span>
                                        <span>1 / 1</span>
                                    </div>
                                    <Progress value={100} className="h-1.5 bg-slate-700" />
                                    <p className="text-[10px] text-slate-400">{t.dashboard?.subscription?.limitReached || "Limit reached"}</p>
                                </div>
                                <Button onClick={() => toast.success("Funkcja została wywołana.")} size="sm" className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 border-none shadow-lg shadow-indigo-500/20">
                                    <Sparkles className="h-3 w-3 mr-2" />
                                    {t.dashboard?.subscription?.upgrade || "Upgrade Plan"}
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Navigation Menu */}
            <nav className="space-y-1">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === item.id
                            ? "bg-slate-900 text-white shadow-md shadow-slate-200"
                            : "text-slate-600 hover:bg-white hover:shadow-sm"
                            }`}
                    >
                        <item.icon className={`h-5 w-5 ${activeTab === item.id ? "text-white" : "text-slate-400"}`} />
                        {item.label}
                    </button>
                ))}
            </nav>

            <div className="pt-4 border-t border-slate-100">
                <Button
                    variant="ghost"
                    className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 gap-3"
                    onClick={handleLogout}
                >
                    <LogOut className="h-5 w-5" />
                    {t.auth?.logout || "Logout"}
                </Button>
            </div>
        </aside>
    );
}

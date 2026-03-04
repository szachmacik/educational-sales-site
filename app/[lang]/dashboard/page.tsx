"use client";

export const dynamic = 'force-dynamic';

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/components/language-provider";
import { logout } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BrandLogo } from "@/components/brand-logo";
import { LanguageSwitcher } from "@/components/language-switcher";
import { cn } from "@/lib/utils";
import {
    BookOpen, Trophy, Gamepad, Settings, ShoppingBag, Coins,
    Users, LogOut, Sparkles, Star, ChevronDown, GraduationCap,
    Briefcase, LayoutDashboard, Bell, Home, FileText, Building2,
    CreditCard, Globe, Shield, Gift
} from "lucide-react";
import { MOCK_COURSES } from "@/lib/mock-data";
import { trackAnonymousEvent } from "@/lib/integrations/telemetry-service";
import { getUserPoints } from "@/lib/points-service";

// Dashboard panels
import { TeacherLibrary } from "@/components/dashboard/teacher-library";
import { StudentTasks } from "@/components/dashboard/student-tasks";
import { TeacherTeam } from "@/components/dashboard/teacher-team";
import { GamesGrid } from "@/components/dashboard/games-grid";
import { AwardsGrid } from "@/components/dashboard/awards-grid";
import { PurchasesHistory } from "@/components/dashboard/purchases-history";
import { WalletSection } from "@/components/dashboard/wallet-section";
import { ApiViewerEmbed } from "@/components/dashboard/api-viewer-embed";
import { CertificatesSection } from "@/components/dashboard/certificates-section";
import { GamificationWidgets } from "@/components/dashboard/gamification-widgets";
import { RecentlyUsed } from "@/components/dashboard/recently-used";
import { WelcomeBanner } from "@/components/dashboard/welcome-banner";
import { SchoolLicenses } from "@/components/dashboard/school-licenses";
import { ExtensionsTeacher } from "@/components/dashboard/extensions-teacher";
import { ExtensionsSchool } from "@/components/dashboard/extensions-school";
import { ProfileCompletionForm } from "@/components/dashboard/profile-completion-form";
import { ReferralPanel } from "@/components/dashboard/referral-panel";
import { toast } from "sonner";

// ─── ROLE → NAV DEFINITIONS ──────────────────────────────────────────────────
type UserRole = "student" | "teacher" | "parent" | "institution" | "admin";
type UserSubRole = string | null;

interface NavItem { id: string; label: string; icon: any; badge?: string }

// Feature toggles are read from localStorage (set by SuperAdmin panel)
function readFeatureFlag(key: string): boolean {
    if (typeof window === 'undefined') return true;
    return localStorage.getItem(key) !== 'false';
}

function buildNav(role: UserRole, subRole: UserSubRole): NavItem[] {
    const showViewer = readFeatureFlag('feature_apiViewer_global');
    const showMarket = readFeatureFlag('feature_marketplace_global');
    const showGames = readFeatureFlag('feature_internal_games_global');
    const showAwards = readFeatureFlag('feature_internal_gamification_global');
    const showWallet = readFeatureFlag('feature_internal_wallet_global');

    if (role === "teacher") return [
        { id: "home", label: "Przegląd", icon: Home },
        { id: "library", label: "Moja Biblioteka", icon: BookOpen },
        { id: "team", label: subRole === "teacher_school" ? "Moje Klasy" : "Moi Kursanci", icon: Users },
        ...(showAwards ? [{ id: "gamification", label: "Moje Osiągnięcia", icon: Star }] : []),
        { id: "purchases", label: "Zakupy & Faktury", icon: ShoppingBag },
        ...(showWallet ? [{ id: "wallet", label: "Portfel Punktów", icon: Coins }] : []),
        { id: "referral", label: "Zaproś Znajomych", icon: Gift, badge: "🎁" },
        ...(showViewer ? [{ id: "portal", label: "Portal Zewnętrzny", icon: Globe }] : []),
        ...(showMarket ? [{ id: "extensions", label: "Narzędzia & Usługi", icon: Sparkles }] : []),
        { id: "profile", label: "Ustawienia Konta", icon: Settings },
    ];
    if (role === "institution") return [
        { id: "home", label: "Przegląd Placówki", icon: Home },
        { id: "licenses", label: "Licencje", icon: FileText },
        { id: "team", label: "Nauczyciele", icon: Users },
        ...(showViewer ? [{ id: "portal", label: "Portal B2B / API", icon: Globe }] : []),
        ...(showMarket ? [{ id: "extensions", label: "Usługi Premium B2B", icon: Sparkles }] : []),
        { id: "purchases", label: "Faktury & Dokumenty", icon: CreditCard },
        { id: "profile", label: "Dane Placówki", icon: Building2 },
    ];
    if (role === "parent") return [
        { id: "home", label: "Przegląd", icon: Home },
        { id: "library", label: "Materiały dla Dziecka", icon: BookOpen },
        { id: "certificates", label: "Certyfikaty", icon: Trophy },
        { id: "purchases", label: "Moje Zakupy", icon: ShoppingBag },
        { id: "referral", label: "Zaproś Znajomych", icon: Gift, badge: "🎁" },
        { id: "profile", label: "Ustawienia", icon: Settings },
    ];
    // student / child
    return [
        { id: "home", label: "Moje Lekcje", icon: Home },
        ...(showGames ? [{ id: "games", label: "Gry & Ćwiczenia", icon: Gamepad }] : []),
        ...(showAwards ? [{ id: "awards", label: "Moje Nagrody", icon: Trophy }] : []),
        { id: "certificates", label: "Certyfikaty", icon: GraduationCap },
        { id: "profile", label: "Mój Profil", icon: Settings },
    ];
}

const SUB_ROLE_LABELS: Record<string, { label: string; icon: string; color: string }> = {
    child: { label: "Dziecko", icon: "🧒", color: "bg-blue-500" },
    learner: { label: "Uczeń Szkolny", icon: "📚", color: "bg-indigo-500" },
    parent_independent: { label: "Rodzic", icon: "👨‍👩‍👧", color: "bg-green-500" },
    parent_school_plan: { label: "Rodzic (Plan Szk.)", icon: "🏫", color: "bg-teal-500" },
    teacher_private: { label: "Nauczyciel Prywatny", icon: "🏠", color: "bg-purple-500" },
    teacher_school: { label: "Nauczyciel Szkolny", icon: "🏛️", color: "bg-violet-500" },
    institution_public: { label: "Szkoła / Placówka", icon: "🏛️", color: "bg-amber-500" },
    institution_language: { label: "Szkoła Językowa", icon: "🌍", color: "bg-orange-500" },
};

// ─── PANEL CONTENT ROUTER ────────────────────────────────────────────────────
function PanelContent({ tab, role, subRole, courses, email, userName, setActiveTab, pointsBalance }: {
    tab: string; role: UserRole; subRole: UserSubRole; courses: any[]; email: string;
    userName: string; setActiveTab: (tab: string) => void; pointsBalance: number;
}) {
    const { language } = useLanguage();
    // Map role string for WelcomeBanner's narrower type
    const bannerRole = (role === 'institution' ? 'school' : role === 'admin' ? 'admin' : role) as 'student' | 'teacher' | 'admin' | 'school';
    const bannerUser = { name: userName.replace(/^[^a-zA-Z]+/, '').trim() || 'Użytkownik', role: bannerRole };

    if (tab === "home") return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Welcome Banner — with full user data */}
            <WelcomeBanner user={bannerUser} />

            {/* Stats row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                    { title: "Materiały aktywne", value: courses.length > 0 ? courses.length : 12, color: "text-indigo-600", bg: "bg-indigo-50" },
                    { title: "Zebranych punktów", value: `${pointsBalance.toLocaleString()} 🪙`, color: "text-amber-600", bg: "bg-amber-50" },
                    { title: "Aktywność (dni)", value: "12 z rzędu 🔥", color: "text-orange-600", bg: "bg-orange-50" },
                ].map((stat) => (
                    <div key={stat.title} className={cn("rounded-2xl p-6 border border-white/60 shadow-sm transition-transform hover:scale-[1.02]", stat.bg)}>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{stat.title}</p>
                        <p className={cn("text-3xl font-black", stat.color)}>{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Quick Actions Cockpit (Premium UX) - Only if enabled */}
            {readFeatureFlag('feature_quick_cockpit') && (
                <div className="flex flex-wrap gap-3 p-4 bg-white/40 border border-white/80 rounded-2xl shadow-sm backdrop-blur-sm animate-in zoom-in-95 duration-500">
                    <div className="w-full text-[10px] uppercase font-black text-slate-400 mb-1 px-1 flex items-center gap-2">
                        <Sparkles className="h-3 w-3 text-indigo-400" />
                        Quick Cockpit (Szybki Dostęp)
                    </div>
                    {[
                        { id: "library", label: "Otwórz Bibliotekę", icon: BookOpen, color: "text-indigo-600", bg: "bg-white" },
                        { id: "extensions", label: "Workshop AI", icon: Sparkles, color: "text-purple-600", bg: "bg-white" },
                        { id: "profile", label: "Mój Profil", icon: Settings, color: "text-slate-600", bg: "bg-white" },
                    ].map((action) => (
                        <Button
                            key={action.id}
                            variant="ghost"
                            size="sm"
                            onClick={() => setActiveTab(action.id)}
                            className={cn("h-11 rounded-xl border border-slate-100 px-4 font-bold flex items-center gap-2 shadow-sm hover:shadow-md transition-all", action.bg, action.color)}
                        >
                            <action.icon className="h-4 w-4" />
                            {action.label}
                        </Button>
                    ))}
                </div>
            )}

            {/* Gamification widgets — for all roles */}
            <RecentlyUsed />
            <GamificationWidgets userId={email} userRole={role} />

            {/* Parent Info Note */}
            {role === "parent" && (
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 mb-2 shadow-sm flex gap-3">
                    <div className="h-10 w-10 shrink-0 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                        <BookOpen className="h-5 w-5" />
                    </div>
                    <div>
                        <h4 className="font-bold text-blue-900 text-sm mb-1">Dostęp do materiałów Twoich dzieci</h4>
                        <p className="text-xs text-blue-700 font-medium">
                            Materiały edukacyjne w profilu dziecka (tzw. Kursanta) są przypisywane wyłącznie przez nauczyciela prowadzącego.
                            Jako administrator konta, możesz dokupywać rozszerzenia lub monitorować ich postępy.
                        </p>
                    </div>
                </div>
            )}

            {/* Child Account Management — parent, teacher, and institution */}
            {(role === "parent" || role === "teacher" || role === "institution") && (
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center text-2xl shrink-0">
                                {role === "parent" ? "👨‍👧‍👦" : role === "teacher" ? "🏫" : "🏛️"}
                            </div>
                            <div>
                                <h3 className="font-black text-slate-900 text-base">
                                    {role === "parent" ? "Konta Moich Dzieci" : role === "teacher" ? "Konta Uczniów" : "Zarządzanie Zbiorcze Uczniami"}
                                </h3>
                                <p className="text-xs text-slate-500 font-medium mt-0.5">
                                    {role === "parent"
                                        ? "Zarządzaj dostępem dziecka do materiałów i monitoruj postępy"
                                        : role === "teacher"
                                            ? "Przydziel uczniom dostęp do materiałów w ramach licencji"
                                            : "Zarządzaj dostępami i zgodami wszystkich uczniów w Twojej placówce"}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <span className="bg-emerald-100 text-emerald-700 text-xs font-black px-3 py-1 rounded-full">
                                {role === "institution" ? "Aktywna Licencja Zbiorcza" : "0 kont"}
                            </span>
                        </div>
                    </div>
                    <div className="mt-5 flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={() => toast.success("Funkcja dodawania kont uczniów będzie dostępna wkrótce (Faza 18.2)")}
                            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold transition-all shadow-sm"
                        >
                            ➕ {role === "parent" ? "Dodaj Konto Dziecka" : "Dodaj Ucznia"}
                        </button>
                        <button
                            onClick={() => toast.success("Lista kont będzie dostępna po dodaniu pierwszego ucznia")}
                            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-sm font-bold transition-all"
                        >
                            📋 Lista Kont
                        </button>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-3 font-medium">
                        🔒 Konta dzieci są aktywowane wyłącznie przez {role === "parent" ? "rodzica" : role === "teacher" ? "nauczyciela" : "placówkę"}. Dziecko nie może założyć konta samodzielnie. Wszystkie linki zewnętrzne i sprzedażowe są dla tych kont ukryte. {role === "institution" && "Jako placówka możesz zarządzać zgodami marketingowymi i profilowaniem zbiorczo dla wszystkich podpiętych kont."}
                    </p>
                </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-indigo-500" />
                    Szybkie Akcje
                </h3>
                <div className="grid sm:grid-cols-2 gap-3">
                    {role === "teacher" && <>
                        <Link href={`/${language}/products`} className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all font-medium text-sm text-slate-700 hover:text-indigo-700">
                            📖 Przeglądaj Bibliotekę
                        </Link>
                        <button onClick={() => setActiveTab("team")} className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all font-medium text-sm text-slate-700 hover:text-indigo-700 text-left">
                            👥 Mój Zespół / Klasa
                        </button>
                        <button onClick={() => setActiveTab("gamification")} className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all font-medium text-sm text-slate-700 hover:text-indigo-700 text-left">
                            🏆 Moje Osiągnięcia
                        </button>
                        <button onClick={() => setActiveTab("portal")} className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all font-medium text-sm text-slate-700 hover:text-indigo-700 text-left">
                            🌐 Portal Zewnętrzny
                        </button>
                        <button onClick={() => setActiveTab("wallet")} className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all font-medium text-sm text-slate-700 hover:text-indigo-700 text-left">
                            💰 Portfel Punktów
                        </button>
                        <button onClick={() => setActiveTab("profile")} className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all font-medium text-sm text-slate-700 hover:text-indigo-700 text-left">
                            ⚙️ Ustawienia
                        </button>
                        <button onClick={() => toast.success("Otwieranie ustawień...")} className="flex items-center gap-3 p-4 rounded-xl border border-emerald-100 bg-emerald-50 hover:border-emerald-300 hover:bg-emerald-100/80 transition-all font-medium text-sm text-emerald-700 text-left">
                            👦 Zarządzaj Uczniami
                        </button>
                    </>}
                    {role === "institution" && <>
                        <button onClick={() => setActiveTab("licenses")} className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all font-medium text-sm text-slate-700 hover:text-indigo-700 text-left">
                            📋 Zarządzaj Licencjami
                        </button>
                        <button onClick={() => setActiveTab("team")} className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all font-medium text-sm text-slate-700 hover:text-indigo-700 text-left">
                            👩‍🏫 Moi Nauczyciele
                        </button>
                        <button onClick={() => setActiveTab("portal")} className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all font-medium text-sm text-slate-700 hover:text-indigo-700 text-left">
                            🌐 Portal B2B / API
                        </button>
                        <button onClick={() => setActiveTab("purchases")} className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all font-medium text-sm text-slate-700 hover:text-indigo-700 text-left">
                            🧾 Faktury
                        </button>
                        <button onClick={() => setActiveTab("extensions")} className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all font-medium text-sm text-slate-700 hover:text-indigo-700 text-left">
                            🌐 Usługi Premium
                        </button>
                    </>}
                    {(role === "parent") && <>
                        <button onClick={() => setActiveTab("library")} className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all font-medium text-sm text-slate-700 hover:text-indigo-700 text-left">
                            ▶️ Materiały dla dziecka
                        </button>
                        <button onClick={() => setActiveTab("certificates")} className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all font-medium text-sm text-slate-700 hover:text-indigo-700 text-left">
                            🎓 Certyfikaty dziecka
                        </button>
                        <button onClick={() => toast.success("Akcja wykonana pomyślnie.")} className="flex items-center gap-3 p-4 rounded-xl border border-emerald-100 bg-emerald-50 hover:border-emerald-300 hover:bg-emerald-100/80 transition-all font-medium text-sm text-emerald-700 text-left">
                            👨‍👧 Zarządzaj Kontami Dzieci
                        </button>
                        <button onClick={() => setActiveTab("purchases")} className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all font-medium text-sm text-slate-700 hover:text-indigo-700 text-left">
                            🛒 Moje Zakupy
                        </button>
                        <button onClick={() => setActiveTab("profile")} className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all font-medium text-sm text-slate-700 hover:text-indigo-700 text-left">
                            👤 Mój profil
                        </button>
                    </>}
                    {role === "student" && <>
                        <button onClick={() => setActiveTab("library")} className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all font-medium text-sm text-slate-700 hover:text-indigo-700 text-left">
                            ▶️ Kontynuuj naukę
                        </button>
                        <button onClick={() => setActiveTab("games")} className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all font-medium text-sm text-slate-700 hover:text-indigo-700 text-left">
                            🎮 Zagraj w grę
                        </button>
                        <button onClick={() => setActiveTab("awards")} className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all font-medium text-sm text-slate-700 hover:text-indigo-700 text-left">
                            🏆 Moje nagrody
                        </button>
                        <button onClick={() => setActiveTab("certificates")} className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all font-medium text-sm text-slate-700 hover:text-indigo-700 text-left">
                            🎓 Moje Certyfikaty
                        </button>
                        <button onClick={() => setActiveTab("profile")} className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all font-medium text-sm text-slate-700 hover:text-indigo-700 text-left">
                            👤 Mój profil
                        </button>
                    </>}

                </div>
            </div>
        </div>
    );

    if (tab === "library") return (
        <div className="animate-in fade-in duration-500">
            {role === "teacher" || role === "parent" ? (
                <TeacherLibrary courses={courses} setCategoryFilter={() => { }} filteredCourses={courses} />
            ) : (
                <StudentTasks />
            )}
        </div>
    );

    if (tab === "games") return <div className="animate-in fade-in duration-500"><GamesGrid /></div>;
    if (tab === "awards") return <div className="animate-in fade-in duration-500"><AwardsGrid /></div>;
    if (tab === "certificates") return <div className="animate-in fade-in duration-500"><CertificatesSection user={{ name: userName, role: bannerRole }} /></div>;
    if (tab === "team") return <div className="animate-in fade-in duration-500"><TeacherTeam /></div>;
    if (tab === "purchases") return <div className="animate-in fade-in duration-500"><PurchasesHistory /></div>;
    if (tab === "wallet") return <div className="animate-in fade-in duration-500"><WalletSection /></div>;
    if (tab === "gamification") return <div className="animate-in fade-in duration-500"><GamificationWidgets userId={email} userRole={role} /></div>;
    if (tab === "portal") return <div className="animate-in fade-in duration-500"><ApiViewerEmbed /></div>;
    if (tab === "extensions") return (
        <div className="animate-in fade-in duration-500">
            {role === "institution" ? <ExtensionsSchool /> : <ExtensionsTeacher />}
        </div>
    );
    if (tab === "licenses") return <div className="animate-in fade-in duration-500"><SchoolLicenses /></div>;
    if (tab === "profile") return <div className="animate-in fade-in duration-500"><ProfileCompletionForm userId={email} userRole={role} /></div>;
    if (tab === "referral") return (
        <div className="animate-in fade-in duration-500">
            <div className="mb-6">
                <h2 className="text-2xl font-black text-slate-900">🎁 Program Poleceń</h2>
                <p className="text-slate-500 font-medium mt-1">Zaproś znajomych i zarabiaj punkty Kamila za każde dołączenie!</p>
            </div>
            <ReferralPanel userId={email} userEmail={email} />
        </div>
    );

    return null;
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function DashboardPage() {
    const { t, language } = useLanguage();
    const router = useRouter();

    const [role, setRole] = useState<UserRole>("student");
    const [subRole, setSubRole] = useState<UserSubRole>(null);
    const [userName, setUserName] = useState("Demo User");
    const [email, setEmail] = useState("demo@kamilaenglish.com");
    const [activeTab, setActiveTab] = useState("home");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [courses, setCourses] = useState<any[]>([]);
    const [userPointsBalance, setUserPointsBalance] = useState(0);

    useEffect(() => {
        const emailKey = localStorage.getItem("user_email") || "";
        if (emailKey) {
            const pts = getUserPoints(emailKey);
            setUserPointsBalance(pts?.balance ?? 0);
        }
    }, [email]);
    useEffect(() => {
        const token = localStorage.getItem("user_token");
        if (!token) { router.push(`/${language}/login`); return; }

        const storedRole = (localStorage.getItem("user_role") || "student") as UserRole;
        const storedSubRole = localStorage.getItem("user_sub_role") as UserSubRole;
        const storedEmail = localStorage.getItem("user_email") || "demo@kamilaenglish.com";

        setRole(storedRole);
        setSubRole(storedSubRole);
        setEmail(storedEmail);

        const subInfo = storedSubRole ? SUB_ROLE_LABELS[storedSubRole] : null;
        setUserName(subInfo ? `${subInfo.icon} ${subInfo.label}` : storedRole);

        trackAnonymousEvent("dashboard_visit", { role: storedRole });

        // Load courses in background
        fetch("/api/courses").then(r => r.json()).then(data => {
            if (Array.isArray(data)) setCourses(data);
        }).catch(() => setCourses(MOCK_COURSES));
    }, [router, language]);

    // Set default tab ONCE on mount — separate from language/router effect
    // to prevent tab reset when language context re-renders after mergeTranslations
    useEffect(() => {
        const storedRole = (localStorage.getItem("user_role") || "student") as UserRole;
        if (storedRole === "institution") setActiveTab("licenses");
        // else stays "home" (initial useState value)
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleLogout = useCallback(async () => {
        await logout();
        ["user_token", "user_role", "user_sub_role"].forEach(k => localStorage.removeItem(k));
        document.cookie = "user_token=; path=/; max-age=0";
        router.push(`/${language}`);
    }, [router, language]);

    const navItems = buildNav(role, subRole);
    const subInfo = subRole ? SUB_ROLE_LABELS[subRole] : null;
    const activeLabel = navItems.find(n => n.id === activeTab)?.label || "Dashboard";

    return (
        <div className="min-h-screen flex bg-slate-50">
            {/* ── LEFT SIDEBAR ── */}
            <aside className={cn(
                "fixed inset-y-0 left-0 z-40 w-64 flex flex-col bg-slate-900 text-white transition-transform duration-300 shadow-2xl",
                sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            )}>
                {/* Logo */}
                <div className="p-5 border-b border-white/10 flex-shrink-0">
                    <BrandLogo className="text-white [&_*]:text-white" />
                </div>

                {/* Account chip */}
                <div className="px-4 py-3 border-b border-white/10 flex-shrink-0">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                        <div className={cn("h-9 w-9 rounded-xl flex items-center justify-center text-lg shrink-0", subInfo?.color || "bg-indigo-600")}>
                            {subInfo?.icon || "👤"}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest leading-none mb-1">Zalogowany jako</p>
                            <p className="text-sm font-bold text-white truncate">{subInfo?.label || role}</p>
                        </div>
                    </div>
                </div>

                {/* Nav */}
                <nav className="flex-1 py-4 overflow-y-auto">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-5 mb-2">Menu główne</p>
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                            className={cn(
                                "w-full flex items-center gap-3 px-5 py-3 text-sm font-medium transition-all text-left",
                                activeTab === item.id
                                    ? "bg-white/10 text-white border-r-2 border-indigo-400"
                                    : "text-slate-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <item.icon className={cn("h-4 w-4 flex-shrink-0", activeTab === item.id ? "text-indigo-400" : "text-slate-500")} />
                            {item.label}
                            {item.badge && <Badge className="ml-auto bg-indigo-500 text-white text-[10px] px-1.5 py-0">{item.badge}</Badge>}
                        </button>
                    ))}

                    {role === "admin" && (
                        <>
                            <div className="mx-5 my-4 border-t border-white/10" />
                            <Link
                                href={`/${language}/admin`}
                                className="w-full flex items-center gap-3 px-5 py-3 text-sm font-bold text-indigo-400 hover:text-indigo-300 hover:bg-white/5 transition-all"
                            >
                                <Shield className="h-4 w-4" />
                                Panel SuperAdmina
                            </Link>
                        </>
                    )}
                </nav>

                {/* Bottom actions */}
                <div className="flex-shrink-0 border-t border-white/10 p-4 space-y-2">
                    {/* Store link hidden for child/student — sandbox rules apply */}
                    {role !== "student" && (
                        <Link href={`/${language}/products`}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-all font-medium">
                            <BookOpen className="h-4 w-4" />
                            Sklep z Materiałami
                        </Link>
                    )}
                    <button onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all font-medium">
                        <LogOut className="h-4 w-4" />
                        Wyloguj
                    </button>
                </div>
            </aside>

            {/* Mobile overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* ── MAIN CONTENT ── */}
            <div className="flex-1 flex flex-col lg:pl-64 min-h-screen">
                {/* Top bar */}
                <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center px-4 lg:px-8 h-16 gap-4 shadow-sm">
                    {/* Mobile hamburger */}
                    <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-slate-100">
                        <div className="w-5 h-0.5 bg-slate-600 mb-1" />
                        <div className="w-5 h-0.5 bg-slate-600 mb-1" />
                        <div className="w-5 h-0.5 bg-slate-600" />
                    </button>

                    {/* Breadcrumb */}
                    <div className="flex-1">
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest hidden sm:block">Dashboard</p>
                        <h1 className="text-base font-bold text-slate-900 leading-tight">{activeLabel}</h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <LanguageSwitcher />

                        {/* Points pill */}
                        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-sm font-bold">
                            <Coins className="h-3.5 w-3.5 fill-amber-500" />
                            {userPointsBalance.toLocaleString()}
                        </div>

                        {/* User avatar + role — CONSISTENT with sidebar */}
                        <div className="flex items-center gap-2">
                            <div className={cn("h-8 w-8 rounded-xl flex items-center justify-center text-sm", subInfo?.color || "bg-indigo-600")}>
                                {subInfo?.icon || "👤"}
                            </div>
                            <div className="hidden md:block">
                                <p className="text-xs text-slate-400 leading-none">Konto</p>
                                <p className="text-sm font-bold text-slate-800 leading-tight">{subInfo?.label || role}</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content area */}
                <main className="flex-1 p-4 lg:p-8 pb-28 max-w-6xl mx-auto w-full">
                    <PanelContent
                        tab={activeTab}
                        role={role}
                        subRole={subRole}
                        courses={courses}
                        email={email}
                        userName={userName}
                        setActiveTab={setActiveTab}
                        pointsBalance={userPointsBalance}
                    />
                </main>
            </div>
        </div>
    );
}

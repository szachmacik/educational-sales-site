"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { login } from "@/lib/auth";
import { Loader2, AlertCircle, CheckCircle2, Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/language-provider";
import type { UserRole, UserSubRole } from "@/lib/auth";
import { processReferral } from "@/lib/referral-service";
import { updateUserPoints } from "@/lib/points-service";

// ─── ACCOUNT TYPE DEFINITIONS ─────────────────────────────────────
const MAIN_ROLES = [
    {
        id: 'student' as UserRole,
        icon: '🎒',
        label: 'Dziecko / Uczeń',
        desc: 'Nauka i gry edukacyjne',
        color: 'blue',
        subtypes: [
            { id: 'child' as UserSubRole, icon: '🧒', label: 'Dziecko', desc: 'Profil zabawowy z grami i EXP', email: 'child@example.com' },
            { id: 'learner' as UserSubRole, icon: '📚', label: 'Uczeń Szkolny', desc: 'Przypisany przez nauczyciela do klasy', email: 'student@example.com' },
        ]
    },
    {
        id: 'parent' as UserRole,
        icon: '👨‍👩‍👧',
        label: 'Rodzic / Opiekun',
        desc: 'Materiały i nadzór nad dzieckiem',
        color: 'green',
        subtypes: [
            { id: 'parent_independent' as UserSubRole, icon: '🛒', label: 'Kupuję dla dziecka', desc: 'Własne zakupy materiałów', email: 'parent@example.com' },
            { id: 'parent_school_plan' as UserSubRole, icon: '🏫', label: 'Plan Szkolny Dziecka', desc: 'Dziecko objęte licencją placówki', email: 'parent@example.com' },
        ]
    },
    {
        id: 'teacher' as UserRole,
        icon: '👩‍🏫',
        label: 'Nauczyciel',
        desc: 'Zarządzanie materiałami dydaktycznymi',
        color: 'purple',
        subtypes: [
            { id: 'teacher_private' as UserSubRole, icon: '🏠', label: 'Nauczyciel Prywatny', desc: 'Korepetytor, lekcje indywidualne', email: 'teacher@example.com' },
            { id: 'teacher_school' as UserSubRole, icon: '🏛️', label: 'Nauczyciel Szkolny', desc: 'Licencja przyznana przez placówkę', email: 'teacher.school@example.com' },
        ]
    },
    {
        id: 'institution' as UserRole,
        icon: '🏫',
        label: 'Placówka / Firma',
        desc: 'Zarządzanie licencjami i dostępami',
        color: 'amber',
        subtypes: [
            { id: 'institution_public' as UserSubRole, icon: '🏛️', label: 'Szkoła / Przedszkole Publiczne', desc: 'Placówka państwowa lub gminna', email: 'institution@example.com' },
            { id: 'institution_language' as UserSubRole, icon: '🌍', label: 'Szkoła Językowa / Centrum', desc: 'Firma prywatna lub centrum edukacyjne', email: 'langschool@example.com' },
        ]
    },
] as const;

const COLOR_STYLES: Record<string, { active: string; inactive: string; badge: string }> = {
    blue: { active: 'border-blue-500 bg-blue-50 shadow-blue-100 shadow-md', inactive: 'border-slate-100 bg-white hover:border-blue-200', badge: 'bg-blue-500' },
    green: { active: 'border-green-500 bg-green-50 shadow-green-100 shadow-md', inactive: 'border-slate-100 bg-white hover:border-green-200', badge: 'bg-green-500' },
    purple: { active: 'border-purple-500 bg-purple-50 shadow-purple-100 shadow-md', inactive: 'border-slate-100 bg-white hover:border-purple-200', badge: 'bg-purple-500' },
    amber: { active: 'border-amber-500 bg-amber-50 shadow-amber-100 shadow-md', inactive: 'border-slate-100 bg-white hover:border-amber-200', badge: 'bg-amber-500' },
};

export function LoginForm() {
    const { t, language } = useLanguage();
    const l = t.login;
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectPath = searchParams.get("redirect") || `/${language}/dashboard`;
    const referralCode = searchParams.get("ref") || "";

    // ── step: 'role' | 'subtype' | 'credentials'
    const [step, setStep] = useState<'role' | 'subtype' | 'credentials'>('role');
    const [selectedRole, setSelectedRole] = useState<typeof MAIN_ROLES[number] | null>(null);
    const [selectedSubtype, setSelectedSubtype] = useState<typeof MAIN_ROLES[number]['subtypes'][number] | null>(null);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [rememberChoice, setRememberChoice] = useState(true);

    const [emailError, setEmailError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [touched, setTouched] = useState({ email: false, password: false });

    // ── Auto-restore remembered role/subtype on mount
    useEffect(() => {
        const savedRoleId = localStorage.getItem('login_remembered_role') as UserRole | null;
        const savedSubId = localStorage.getItem('login_remembered_subtype') as UserSubRole | null;
        if (!savedRoleId || !savedSubId) return;

        const foundRole = MAIN_ROLES.find(r => r.id === savedRoleId);
        if (!foundRole) return;
        const foundSub = foundRole.subtypes.find(s => s.id === savedSubId);
        if (!foundSub) return;

        setSelectedRole(foundRole);
        setSelectedSubtype(foundSub);
        setEmail(foundSub.email);
        setPassword('demo123');
        setStep('credentials');
    }, []);

    const validateEmail = (value: string) => {
        if (!value) { setEmailError(l.emailRequired); return false; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) { setEmailError(l.emailInvalid); return false; }
        setEmailError(null); return true;
    };
    const validatePassword = (value: string) => {
        if (!value) { setPasswordError(l.passwordRequired); return false; }
        if (value.length < 4) { setPasswordError(l.passwordMin); return false; }
        setPasswordError(null); return true;
    };

    const handleRoleSelect = (role: typeof MAIN_ROLES[number]) => {
        setSelectedRole(role);
        setStep('subtype');
    };

    const handleSubtypeSelect = (sub: typeof MAIN_ROLES[number]['subtypes'][number]) => {
        setSelectedSubtype(sub);
        setEmail(sub.email);
        setPassword('demo123');
        setStep('credentials');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        const isEmailValid = validateEmail(email);
        const isPasswordValid = validatePassword(password);
        setTouched({ email: true, password: true });
        if (!isEmailValid || !isPasswordValid) return;

        setIsLoading(true);
        try {
            const result = await login(email, password, selectedRole?.id ?? 'student', selectedSubtype?.id ?? null);
            if (result) {
                localStorage.setItem("user_token", result.token);
                localStorage.setItem("user_role", result.user.role);
                if (result.user.subRole) localStorage.setItem("user_sub_role", result.user.subRole);
                document.cookie = `user_token=${result.token}; path=/; max-age=${60 * 60 * 24 * 7}`;

                // Save or clear the remembered choice
                if (rememberChoice && selectedRole && selectedSubtype) {
                    localStorage.setItem('login_remembered_role', selectedRole.id as string);
                    localStorage.setItem('login_remembered_subtype', selectedSubtype.id as string);
                } else {
                    localStorage.removeItem('login_remembered_role');
                    localStorage.removeItem('login_remembered_subtype');
                }

                setSuccess(true);

                // --- Trigger Login Check-In Points ---
                import("@/lib/points-service").then(module => {
                    module.triggerPointEvent(email, 'check-in');
                });

                // --- Process referral bonus if came via invite link ---
                if (referralCode) {
                    const refResult = processReferral(referralCode, email, email);
                    if (refResult.success && refResult.bonusForNewUser > 0) {
                        updateUserPoints(email, refResult.bonusForNewUser, 'earn', 'referral');
                        // Store flash message for dashboard to show on first visit
                        sessionStorage.setItem(
                            'referral_welcome_msg',
                            `🎁 Witaj! Otrzymałeś ${refResult.bonusForNewUser} punktów powitalnych za dołączenie przez zaproszenie!`
                        );
                    }
                }

                setTimeout(() => {
                    if (result.user.role === 'admin') {
                        router.push(`/${language}/admin`);
                    } else {
                        router.push(redirectPath);
                    }
                }, 500);
            } else {
                setError(l.errorDefault);
            }
        } catch {
            setError(l.errorSystem);
        } finally {
            setIsLoading(false);
        }
    };

    const colorStyles = selectedRole ? COLOR_STYLES[selectedRole.color] : COLOR_STYLES.blue;

    // Helper to completely reset the remembered choice and restart from step 1
    const handleForgetChoice = () => {
        localStorage.removeItem('login_remembered_role');
        localStorage.removeItem('login_remembered_subtype');
        setSelectedRole(null);
        setSelectedSubtype(null);
        setEmail('');
        setPassword('');
        setStep('role');
        setError(null);
    };

    return (
        <Card className="w-full max-w-md shadow-2xl border-0 bg-white/90 backdrop-blur-sm animate-fade-in-up rounded-2xl overflow-hidden">
            {/* Progress bar header */}
            <div className="h-1 bg-slate-100">
                <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                    style={{ width: step === 'role' ? '33%' : step === 'subtype' ? '66%' : '100%' }}
                />
            </div>

            <CardHeader className="space-y-1 pb-4 pt-6 px-6">
                <div className="flex items-center gap-3">
                    {step !== 'role' && (
                        <button
                            onClick={() => { setStep(step === 'credentials' ? 'subtype' : 'role'); setError(null); }}
                            className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4 text-slate-600" />
                        </button>
                    )}
                    <div className="flex-1">
                        <CardTitle className="text-xl font-bold">
                            {step === 'role' ? 'Wybierz typ konta' :
                                step === 'subtype' ? `${selectedRole?.icon} ${selectedRole?.label}` :
                                    'Zaloguj się'}
                        </CardTitle>
                        <CardDescription className="text-sm mt-0.5">
                            {step === 'role' ? 'Krok 1 z 3 — rodzaj użytkownika' :
                                step === 'subtype' ? 'Krok 2 z 3 — wybierz swój profil' :
                                    'Krok 3 z 3 — dane logowania'}
                        </CardDescription>
                    </div>
                    {step === 'credentials' && selectedSubtype && (
                        <button
                            type="button"
                            onClick={handleForgetChoice}
                            className="text-[10px] text-slate-400 hover:text-slate-600 underline underline-offset-2 transition-colors"
                        >
                            Zmień konto
                        </button>
                    )}
                </div>
            </CardHeader>

            <CardContent className="px-6 pb-6 space-y-4">
                {/* ── STEP 1: Main Role ─── */}
                {step === 'role' && (
                    <div className="grid grid-cols-2 gap-3">
                        {MAIN_ROLES.map((r) => {
                            const cs = COLOR_STYLES[r.color];
                            return (
                                <button
                                    key={r.id}
                                    type="button"
                                    onClick={() => handleRoleSelect(r)}
                                    className={cn(
                                        "flex flex-col items-start p-4 rounded-2xl border-2 transition-all text-left gap-2 hover:scale-[1.02] active:scale-[0.98]",
                                        cs.inactive
                                    )}
                                >
                                    <span className="text-3xl">{r.icon}</span>
                                    <div>
                                        <p className="font-bold text-sm text-slate-800 leading-tight">{r.label}</p>
                                        <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{r.desc}</p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* ── STEP 2: Subtype ─── */}
                {step === 'subtype' && selectedRole && (
                    <div className="space-y-3">
                        {selectedRole.subtypes.map((sub) => (
                            <button
                                key={sub.id}
                                type="button"
                                onClick={() => handleSubtypeSelect(sub)}
                                className={cn(
                                    "w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left hover:scale-[1.01] active:scale-[0.99]",
                                    colorStyles.inactive
                                )}
                            >
                                <span className="text-3xl flex-shrink-0">{sub.icon}</span>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-base text-slate-800">{sub.label}</p>
                                    <p className="text-xs text-slate-500 mt-0.5">{sub.desc}</p>
                                </div>
                                <span className="text-slate-300 text-lg">›</span>
                            </button>
                        ))}
                    </div>
                )}

                {/* ── STEP 3: Credentials ─── */}
                {step === 'credentials' && (
                    <form id="login-form" onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="flex items-start gap-3 p-3 rounded-xl bg-red-50 text-red-700 border border-red-200">
                                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                                <p className="text-sm">{error}</p>
                            </div>
                        )}
                        {success && (
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-green-50 text-green-700 border border-green-200">
                                <CheckCircle2 className="h-5 w-5" />
                                <p className="text-sm font-medium">{l.successMessage}</p>
                            </div>
                        )}

                        {/* Selected account summary */}
                        {selectedSubtype && (
                            <div className={cn("flex items-center gap-3 p-3 rounded-xl border-2", colorStyles.active)}>
                                <span className="text-2xl">{selectedSubtype.icon}</span>
                                <div>
                                    <p className="font-bold text-sm text-slate-800">{selectedSubtype.label}</p>
                                    <p className="text-xs text-slate-500">Dane wypełnione testowo — możesz zmienić na swoje</p>
                                </div>
                            </div>
                        )}

                        <div className="space-y-1">
                            <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium">
                                <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                                {l.email}
                            </Label>
                            <Input
                                id="email" type="email" value={email}
                                onChange={(e) => { setEmail(e.target.value); if (touched.email) validateEmail(e.target.value); }}
                                onBlur={() => { setTouched(p => ({ ...p, email: true })); validateEmail(email); }}
                                className={cn("rounded-xl", touched.email && emailError && "border-red-400")}
                                disabled={isLoading || success}
                            />
                            {touched.email && emailError && <p className="text-xs text-red-500">{emailError}</p>}
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="password" className="flex items-center gap-2 text-sm font-medium">
                                <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                                {l.password}
                            </Label>
                            <div className="relative">
                                <Input
                                    id="password" type={showPassword ? "text" : "password"} value={password}
                                    onChange={(e) => { setPassword(e.target.value); if (touched.password) validatePassword(e.target.value); }}
                                    onBlur={() => { setTouched(p => ({ ...p, password: true })); validatePassword(password); }}
                                    className={cn("pr-10 rounded-xl", touched.password && passwordError && "border-red-400")}
                                    disabled={isLoading || success}
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" tabIndex={-1}>
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {touched.password && passwordError && <p className="text-xs text-red-500">{passwordError}</p>}
                            <div className="flex justify-end">
                                <button type="button" onClick={() => router.push(`/${language}/login/forgot-password`)}
                                    className="text-xs text-primary hover:underline font-medium">{l.forgotPassword}</button>
                            </div>
                        </div>

                        <div className="text-[11px] text-slate-400 bg-slate-50 border border-slate-100 rounded-xl p-3 space-y-0.5">
                            <p className="font-semibold text-slate-500 mb-1">💡 Hasło testowe: <code className="bg-white border border-slate-200 px-1.5 py-0.5 rounded font-mono">demo123</code></p>
                            <p>Powyższy adres e-mail to konto demo. Wpisz swoje dane aby się zalogować.</p>
                        </div>

                        {/* Remember choice checkbox */}
                        <label className="flex items-center gap-2.5 cursor-pointer group">
                            <div
                                onClick={() => setRememberChoice(!rememberChoice)}
                                className={cn(
                                    "h-4 w-4 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0",
                                    rememberChoice ? "bg-indigo-500 border-indigo-500" : "border-slate-300 group-hover:border-indigo-300"
                                )}
                            >
                                {rememberChoice && <span className="text-white text-[10px] font-black">✓</span>}
                            </div>
                            <span className="text-xs text-slate-500 select-none">
                                Zapamiętaj mój wybór — następnym razem zacznę od razu od logowania
                            </span>
                        </label>
                    </form>
                )}
            </CardContent>

            {step === 'credentials' && (
                <CardFooter className="px-6 pb-6 flex flex-col gap-3">
                    <Button
                        form="login-form" type="submit" className="w-full h-12 rounded-xl gap-2 font-bold text-base"
                        disabled={isLoading || success}
                    >
                        {isLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> {l.loggingIn}</> :
                            success ? <><CheckCircle2 className="h-4 w-4" /> {l.success}</> :
                                l.submit}
                    </Button>
                    <Button type="button" variant="outline"
                        className="w-full rounded-xl h-12 border-slate-200 hover:bg-slate-50 font-medium"
                        onClick={() => router.push(`/${language}/login/magic-link`)}>
                        <Mail className="mr-2 h-4 w-4" /> {l.magicLink}
                    </Button>
                </CardFooter>
            )}
        </Card>
    );
}

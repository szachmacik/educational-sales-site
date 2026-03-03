"use client";

import { useState, useEffect } from "react";
import { getUserProfile, saveUserProfile, UserProfile } from "@/lib/user-profile-service";
import { triggerPointEvent } from "@/lib/points-service";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useLanguage } from "@/components/language-provider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { CheckCircle2, ChevronRight, ChevronLeft, Sparkles, Scale, Building, Zap, Trophy } from "lucide-react";
import Link from "next/link";


export function ProfileCompletionForm({ userId, userRole }: { userId: string, userRole?: string }) {
    const { language } = useLanguage();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [step, setStep] = useState(1);
    const [isSaved, setIsSaved] = useState(false);
    const [consents, setConsents] = useState({
        marketing: false,
        profiling: false
    });

    useEffect(() => {
        setProfile(getUserProfile(userId));
    }, [userId]);

    if (!profile) return null;

    const handleSave = () => {
        if (!consents.profiling) {
            toast.error("Prosimy o zaznaczenie zgody na profilowanie, abyśmy mogli dopasować materiały.");
            return;
        }
        const finalProfile = { ...profile, isProfileComplete: true };
        const becameComplete = saveUserProfile(finalProfile);
        if (becameComplete) {
            triggerPointEvent(userId, 'profile-completion');
        }
        setIsSaved(true);
        setProfile(finalProfile);
    };

    const updateProfile = (updates: Partial<UserProfile>) => {
        setProfile(prev => prev ? { ...prev, ...updates } : null);
    };

    // Calculate Profile Completion Percentage
    const calculateCompletion = () => {
        let score = 0;
        if (profile.teachingLevel) score += 20;
        if (profile.preferredMaterials.length > 0) score += 20;
        if (profile.dreamMaterial) score += 20;
        if (consents.profiling) score += 20;
        if (profile.employerNip && profile.employerNip.length >= 10) score += 20;
        return score;
    };

    const completionScore = calculateCompletion();

    if (isSaved || profile.isProfileComplete) {
        return (
            <Card className="bg-white border-slate-200 overflow-hidden shadow-sm relative">
                {completionScore < 100 && (
                    <div className="absolute top-0 right-0 p-2">
                        <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                            <Zap className="h-3 w-3" /> Możesz zyskać więcej
                        </span>
                    </div>
                )}
                <CardContent className="pt-6">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center border-4 border-slate-100 shrink-0 relative">
                            <span className="text-xl font-black text-slate-800">{completionScore}%</span>
                            {completionScore === 100 && (
                                <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-1 border-2 border-white">
                                    <CheckCircle2 className="h-3 w-3 text-white" />
                                </div>
                            )}
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-slate-900 leading-tight">Twój Profil Nauczyciela</h3>
                            <p className="text-sm text-slate-500">
                                {completionScore === 100 ? "Znakomicie! Masz dostęp do 100% funkcji sklepu B2B." : "Uzupełnij brakujące dane, aby odblokować szybsze zakupy na fakturę dyrekcji."}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-3 mb-6">
                        <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-2 text-slate-600"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Preferencje Ucznia</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-2 text-slate-600"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Preferencje Materiałowe</span>
                        </div>
                        {userRole !== "student" && (
                            <div className="flex items-center justify-between text-sm">
                                <span className="flex items-center gap-2 text-slate-600">
                                    {profile.employerNip ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <div className="h-4 w-4 rounded-full border-2 border-slate-300" />}
                                    Konfiguracja B2B (Zakupy przez Szkołę)
                                </span>
                            </div>
                        )}
                    </div>

                    {completionScore < 100 && userRole !== "student" ? (
                        <Button className="w-full bg-indigo-600 hover:bg-indigo-700 font-bold" onClick={() => { setIsSaved(false); setStep(4); }}>
                            Dokończ konfigurację B2B
                        </Button>
                    ) : (
                        <Button variant="outline" className="w-full border-slate-200 text-slate-600 hover:bg-slate-50 font-bold" onClick={() => setIsSaved(false)}>
                            {userRole === "student" ? "Edytuj Preferencje" : "Zarządzaj Profilem"}
                        </Button>
                    )}
                </CardContent>
            </Card>
        );
    }

    const maxStep = userRole === "student" ? 3 : 4;

    return (
        <Card className="border-2 border-indigo-100 shadow-xl overflow-hidden relative">
            <div className="absolute top-0 left-0 h-1 bg-indigo-500 transition-all duration-500" style={{ width: `${(step / 4) * 100}%` }} />
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-indigo-500 animate-pulse" />
                    Personalizuj swoje konto
                </CardTitle>
                <CardDescription>Uzupełnij profil, aby otrzymać 200 Kamila Points i dostęp do ofert specjalnych.</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
                {step === 1 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="space-y-2">
                            {userRole === 'student' ? (
                                <>
                                    <Label className="font-bold">Co lubisz robić na lekcjach?</Label>
                                    <RadioGroup
                                        value={profile.teachingLevel}
                                        onValueChange={(v) => updateProfile({ teachingLevel: v as any })}
                                        className="grid grid-cols-1 sm:grid-cols-2 gap-2"
                                    >
                                        {[
                                            { id: 'games', label: '🎮 Gry i zabawy' },
                                            { id: 'videos', label: '🎬 Filmy i piosenki' },
                                            { id: 'reading', label: '📖 Czytanie i historyjki' },
                                            { id: 'talking', label: '🗣️ Rozmowy i dialogi' },
                                            { id: 'writing', label: '✏️ Pisanie i ćwiczenia' },
                                        ].map((l) => (
                                            <div key={l.id} className="flex items-center space-x-2 border p-3 rounded-lg hover:bg-slate-50 transition-colors">
                                                <RadioGroupItem value={l.id} id={l.id} />
                                                <Label htmlFor={l.id} className="cursor-pointer">{l.label}</Label>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                </>
                            ) : (
                                <>
                                    <Label className="font-bold">Dla kogo uczysz?</Label>
                                    <RadioGroup
                                        value={profile.teachingLevel}
                                        onValueChange={(v) => updateProfile({ teachingLevel: v as any })}
                                        className="grid grid-cols-1 sm:grid-cols-2 gap-2"
                                    >
                                        {['preschool', 'primary', 'secondary', 'adults', 'corporate'].map((l) => (
                                            <div key={l} className="flex items-center space-x-2 border p-3 rounded-lg hover:bg-slate-50 transition-colors">
                                                <RadioGroupItem value={l} id={l} />
                                                <Label htmlFor={l} className="capitalize cursor-pointer">{l === 'preschool' ? 'Przedszkole' : l === 'primary' ? 'Podstawówka' : l === 'secondary' ? 'Liceum' : l === 'adults' ? 'Dorośli' : 'Firmy'}</Label>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        {userRole === 'student' ? (
                            <div className="space-y-3">
                                <Label className="font-bold">Jakie aktywności lubisz na lekcjach?</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        { id: 'games', label: '🎮 Quizy i gry' },
                                        { id: 'video', label: '🎬 Filmy i bajki' },
                                        { id: 'audio', label: '🎵 Muzyka i piosenki' },
                                        { id: 'pdf', label: '📖 Ćwiczenia pisemne' },
                                    ].map((m) => (
                                        <div key={m.id} className="flex items-center space-x-2 border p-3 rounded-lg">
                                            <Checkbox
                                                id={m.id}
                                                checked={profile.preferredMaterials.includes(m.id as any)}
                                                onCheckedChange={(checked) => {
                                                    const mats = checked
                                                        ? [...profile.preferredMaterials, m.id as any]
                                                        : profile.preferredMaterials.filter(x => x !== m.id);
                                                    updateProfile({ preferredMaterials: mats });
                                                }}
                                            />
                                            <Label htmlFor={m.id} className="font-medium text-xs cursor-pointer">{m.label}</Label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="space-y-3">
                                    <Label className="font-bold">Jakie materiały lubisz najbardziej?</Label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {['pdf', 'games', 'video', 'audio'].map((m) => (
                                            <div key={m} className="flex items-center space-x-2 border p-3 rounded-lg">
                                                <Checkbox
                                                    id={m}
                                                    checked={profile.preferredMaterials.includes(m as any)}
                                                    onCheckedChange={(checked) => {
                                                        const mats = checked
                                                            ? [...profile.preferredMaterials, m as any]
                                                            : profile.preferredMaterials.filter(x => x !== m);
                                                        updateProfile({ preferredMaterials: mats });
                                                    }}
                                                />
                                                <Label htmlFor={m} className="uppercase font-bold text-xs cursor-pointer">{m}</Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-2 py-2">
                                    <Label className="font-bold">Poziom zmęczenia (Burnout): {profile.burnoutLevel}/10</Label>
                                    <Input
                                        type="range" min="1" max="10"
                                        value={profile.burnoutLevel}
                                        onChange={(e) => updateProfile({ burnoutLevel: parseInt(e.target.value) })}
                                        className="h-2"
                                    />
                                    <p className="text-[10px] text-muted-foreground italic">Pomagamy nauczycielom odzyskać czas!</p>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="space-y-2">
                            {userRole === 'student' ? (
                                <>
                                    <Label className="font-bold">Czego chcesz się nauczyć? 🚀</Label>
                                    <Textarea
                                        placeholder="Np. chcę mówić po angielsku jak w filmach, albo nauczyć się piosenek..."
                                        value={profile.dreamMaterial}
                                        onChange={(e) => updateProfile({ dreamMaterial: e.target.value })}
                                        className="min-h-[100px]"
                                    />
                                </>
                            ) : (
                                <>
                                    <Label className="font-bold font-primary capitalize">O jakim materiale marzysz?</Label>
                                    <Textarea
                                        placeholder="Np. gotowy zestaw na Halloween dla 3 klasy z grami online..."
                                        value={profile.dreamMaterial}
                                        onChange={(e) => updateProfile({ dreamMaterial: e.target.value })}
                                        className="min-h-[100px]"
                                    />
                                </>
                            )}
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 flex gap-3 text-sm text-indigo-900 mb-4">
                            <Building className="h-10 w-10 text-indigo-500 shrink-0" />
                            <div>
                                <strong className="block mb-1">Często kupujesz na pracodawcę/szkołę?</strong>
                                Oszczędź czas! Podaj NIP placówki poniżej. System automatycznie wyłapie go w koszyku i uzupełni dane do faktury, dając Ci dostęp do natychmiastowych zakupów przelewowych bez stresu o finanse.
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-1 gap-1.5">
                                <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">NIP Szkoły / Pracodawcy</Label>
                                <Input
                                    placeholder="Wpisz 10 cyfr NIP"
                                    value={profile.employerNip || ''}
                                    onChange={e => updateProfile({ employerNip: e.target.value })}
                                    className="font-mono bg-slate-50 border-slate-200"
                                />
                            </div>
                            <div className="grid grid-cols-1 gap-1.5">
                                <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Nazwa Placówki (Opcjonalnie)</Label>
                                <Input
                                    placeholder="Np. Szkoła Podstawowa nr 1"
                                    value={profile.employerName || ''}
                                    onChange={e => updateProfile({ employerName: e.target.value })}
                                    className="bg-slate-50 border-slate-200"
                                />
                            </div>
                        </div>

                        {/* RODO CONSENTS */}
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mt-6 space-y-4">
                            <div className="flex items-start gap-2">
                                <Checkbox
                                    id="profiling-consent"
                                    checked={consents.profiling}
                                    onCheckedChange={(v) => setConsents(c => ({ ...c, profiling: !!v }))}
                                    className="mt-1"
                                />
                                <Label htmlFor="profiling-consent" className="text-[11px] leading-tight text-slate-600 cursor-pointer">
                                    Wyrażam zgodę na <strong>automatyczne profilowanie</strong> w celu dopasowania ofert i punktów w systemie B2B, zgodnie z <Link href={`/${language}/polityka-prywatnosci`} className="text-indigo-600 underline">Polityką Prywatności</Link>.
                                </Label>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>

            <CardFooter className="flex justify-between border-t bg-slate-50/50 pt-4">
                <Button
                    variant="ghost"
                    disabled={step === 1}
                    onClick={() => setStep(s => s - 1)}
                    className="gap-1 font-bold uppercase text-xs"
                >
                    <ChevronLeft className="h-4 w-4" /> Wstecz
                </Button>
                {step < maxStep ? (
                    <Button
                        onClick={() => setStep(s => s + 1)}
                        className="gap-1 font-bold uppercase text-xs"
                    >
                        Dalej <ChevronRight className="h-4 w-4" />
                    </Button>
                ) : (
                    <Button
                        onClick={handleSave}
                        disabled={userRole !== "student" && !consents.profiling}
                        className="bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200 shadow-lg font-bold uppercase text-xs disabled:opacity-50"
                    >
                        Ukończ i Odbierz 200 PKT
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}

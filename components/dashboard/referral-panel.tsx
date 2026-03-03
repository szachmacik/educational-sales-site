"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useLanguage } from "@/components/language-provider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Gift, Copy, Check, Users, Coins, Share2, ChevronRight, Trophy,
    Twitter, Facebook, Mail, Link2, Crown, Sparkles, Star
} from "lucide-react";
import {
    getOrCreateReferralCode,
    getReferralStats,
    buildReferralUrl,
    REFERRAL_BONUS_NEW_USER,
    REFERRAL_BONUS_INVITER,
    MAX_REFERRALS_PER_USER
} from "@/lib/referral-service";
import { cn } from "@/lib/utils";

interface ReferralPanelProps {
    userId: string;
    userEmail: string;
}

export function ReferralPanel({ userId, userEmail }: ReferralPanelProps) {
    const { language } = useLanguage();
    const [referralCode, setReferralCode] = useState("");
    const [referralUrl, setReferralUrl] = useState("");
    const [stats, setStats] = useState({
        totalReferrals: 0,
        totalEarned: 0,
        usedBy: [] as any[],
        canEarnMore: true,
    });
    const [copied, setCopied] = useState<'code' | 'url' | null>(null);

    useEffect(() => {
        if (!userId || !userEmail) return;
        const code = getOrCreateReferralCode(userId, userEmail);
        const url = buildReferralUrl(code, language);
        const s = getReferralStats(userId);
        setReferralCode(code);
        setReferralUrl(url);
        setStats(s);
    }, [userId, userEmail, language]);

    const copyToClipboard = useCallback(async (text: string, type: 'code' | 'url') => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(type);
            setTimeout(() => setCopied(null), 2500);
        } catch {
            // Fallback
            const el = document.createElement('textarea');
            el.value = text;
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
            setCopied(type);
            setTimeout(() => setCopied(null), 2500);
        }
    }, []);

    const shareVia = (platform: 'twitter' | 'facebook' | 'email') => {
        const msg = `Dołącz do platformy Kamila English i dostań ${REFERRAL_BONUS_NEW_USER} punktów na start! 🎁`;
        const urls: Record<string, string> = {
            twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(msg)}&url=${encodeURIComponent(referralUrl)}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralUrl)}`,
            email: `mailto:?subject=${encodeURIComponent('Zaproszenie do Kamila English')}&body=${encodeURIComponent(`${msg}\n\n${referralUrl}`)}`,
        };
        window.open(urls[platform], '_blank', 'noopener,noreferrer');
    };

    const progressPct = Math.min((stats.totalReferrals / MAX_REFERRALS_PER_USER) * 100, 100);

    // Milestone rewards display
    const milestones = [
        { count: 1, bonus: 500, label: 'Pionier' },
        { count: 3, bonus: 1500, label: 'Ambasador' },
        { count: 5, bonus: 2500, label: 'Promotor' },
        { count: 10, bonus: 5000, label: 'Legenda' },
    ];

    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            {/* Hero Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-8 text-white shadow-xl">
                <div className="absolute -right-8 -top-8 opacity-10">
                    <Gift className="w-48 h-48" />
                </div>
                <div className="absolute -left-4 -bottom-4 opacity-10">
                    <Sparkles className="w-32 h-32" />
                </div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30">
                            <Gift className="h-7 w-7 text-white" />
                        </div>
                        <div>
                            <Badge className="bg-yellow-400 text-yellow-900 font-black border-none mb-1">
                                <Crown className="h-3 w-3 mr-1" /> Program Poleceń
                            </Badge>
                            <h2 className="text-2xl font-black leading-tight">Zaproś, zarabiaj punkty!</h2>
                        </div>
                    </div>
                    <p className="text-white/80 font-medium leading-relaxed max-w-lg mb-6">
                        Podziel się swoim linkiem. Gdy znajomy dołączy — <strong>Ty dostaniesz</strong> <span className="bg-white/20 px-2 py-0.5 rounded-lg font-black">{REFERRAL_BONUS_INVITER} pkt</span>, a <strong>on dostanie</strong> <span className="bg-white/20 px-2 py-0.5 rounded-lg font-black">{REFERRAL_BONUS_NEW_USER} pkt</span> na start. Wszyscy wygrywają!
                    </p>
                    {/* Stats row */}
                    <div className="grid grid-cols-3 gap-4">
                        {[
                            { label: 'Zaproszeni', value: stats.totalReferrals, icon: Users },
                            { label: 'Zarobione pkt', value: stats.totalEarned.toLocaleString(), icon: Coins },
                            { label: 'Pozostało', value: MAX_REFERRALS_PER_USER - stats.totalReferrals, icon: Star },
                        ].map((s, i) => (
                            <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 text-center">
                                <s.icon className="h-5 w-5 mx-auto mb-1 opacity-70" />
                                <p className="text-2xl font-black">{s.value}</p>
                                <p className="text-xs text-white/60 font-bold uppercase tracking-wide">{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Referral link card */}
            <Card className="border-indigo-100 shadow-sm overflow-hidden">
                <CardHeader className="bg-indigo-50/50 border-b border-indigo-100 pb-4">
                    <CardTitle className="flex items-center gap-2 text-slate-800">
                        <Link2 className="h-5 w-5 text-indigo-600" />
                        Twój unikalny link zaproszenia
                    </CardTitle>
                    <CardDescription>Skopiuj i wyślij do znajomych — link jest przypisany tylko do Ciebie</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                    {/* Code */}
                    <div>
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Twój Kod</label>
                        <div className="flex items-center gap-3">
                            <div className="flex-1 bg-slate-900 text-white rounded-xl px-5 py-3 font-mono text-xl font-black tracking-[0.2em] text-center border-2 border-indigo-500 shadow-lg">
                                {referralCode || '——————'}
                            </div>
                            <Button
                                variant="outline"
                                size="lg"
                                className={cn(
                                    "rounded-xl gap-2 border-2 transition-all",
                                    copied === 'code' ? "border-green-500 text-green-600 bg-green-50" : "border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                                )}
                                onClick={() => copyToClipboard(referralCode, 'code')}
                                disabled={!referralCode}
                            >
                                {copied === 'code' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                {copied === 'code' ? 'Skopiowano!' : 'Kopiuj kod'}
                            </Button>
                        </div>
                    </div>

                    {/* URL */}
                    <div>
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Link do rejestracji</label>
                        <div className="flex gap-2">
                            <Input
                                readOnly
                                value={referralUrl}
                                className="font-mono text-xs bg-slate-50 border-slate-200 text-slate-600 rounded-xl"
                            />
                            <Button
                                variant="outline"
                                className={cn(
                                    "rounded-xl gap-2 border-2 shrink-0 transition-all",
                                    copied === 'url' ? "border-green-500 text-green-600 bg-green-50" : "border-slate-200 hover:border-indigo-200"
                                )}
                                onClick={() => copyToClipboard(referralUrl, 'url')}
                                disabled={!referralUrl}
                            >
                                {copied === 'url' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                {copied === 'url' ? 'OK!' : 'Kopiuj'}
                            </Button>
                        </div>
                    </div>

                    {/* Share buttons */}
                    <div>
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 block">Udostępnij przez</label>
                        <div className="flex flex-wrap gap-2">
                            <Button onClick={() => shareVia('twitter')} variant="outline" className="rounded-xl gap-2 border-sky-200 text-sky-600 hover:bg-sky-50">
                                <Twitter className="h-4 w-4" />
                                Twitter / X
                            </Button>
                            <Button onClick={() => shareVia('facebook')} variant="outline" className="rounded-xl gap-2 border-blue-200 text-blue-600 hover:bg-blue-50">
                                <Facebook className="h-4 w-4" />
                                Facebook
                            </Button>
                            <Button onClick={() => shareVia('email')} variant="outline" className="rounded-xl gap-2 border-slate-200 text-slate-600 hover:bg-slate-50">
                                <Mail className="h-4 w-4" />
                                E-mail
                            </Button>
                            <Button
                                variant="outline"
                                className="rounded-xl gap-2 border-green-200 text-green-600 hover:bg-green-50"
                                onClick={() => {
                                    const text = `Dołącz do Kamila English i dostań ${REFERRAL_BONUS_NEW_USER} punktów na start! ${referralUrl}`;
                                    const wa = `https://wa.me/?text=${encodeURIComponent(text)}`;
                                    window.open(wa, '_blank', 'noopener');
                                }}
                            >
                                <Share2 className="h-4 w-4" />
                                WhatsApp
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Milestones */}
            <Card className="border-amber-100 shadow-sm overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100 pb-4">
                    <CardTitle className="flex items-center gap-2 text-slate-800">
                        <Trophy className="h-5 w-5 text-amber-500" />
                        Kamienie milowe 🏆
                    </CardTitle>
                    <CardDescription>Zapraszaj więcej znajomych i zdobywaj dodatkowe nagrody!</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                    {/* Progress bar */}
                    <div className="mb-6">
                        <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
                            <span>Twoje postępy</span>
                            <span>{stats.totalReferrals} / {MAX_REFERRALS_PER_USER}</span>
                        </div>
                        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-1000"
                                style={{ width: `${progressPct}%` }}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {milestones.map((m) => {
                            const reached = stats.totalReferrals >= m.count;
                            return (
                                <div
                                    key={m.count}
                                    className={cn(
                                        "relative rounded-2xl p-4 border-2 text-center transition-all",
                                        reached
                                            ? "border-amber-300 bg-gradient-to-br from-amber-50 to-yellow-100 shadow-md"
                                            : "border-slate-200 bg-slate-50 opacity-60"
                                    )}
                                >
                                    {reached && (
                                        <div className="absolute -top-2 -right-2 bg-amber-400 text-amber-900 text-[10px] font-black px-2 py-0.5 rounded-full border border-amber-200">
                                            ✓ Osiągnięto
                                        </div>
                                    )}
                                    <Trophy className={cn("h-6 w-6 mx-auto mb-2", reached ? "text-amber-500" : "text-slate-300")} />
                                    <p className="font-black text-slate-900 text-sm">{m.count} os.</p>
                                    <p className="text-xs text-slate-500 font-medium">{m.label}</p>
                                    <p className={cn("text-sm font-black mt-1", reached ? "text-amber-600" : "text-slate-400")}>
                                        +{(m.count * REFERRAL_BONUS_INVITER).toLocaleString()} pkt
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Referral history */}
            {stats.usedBy.length > 0 && (
                <Card className="border-slate-200 shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-slate-800 text-base">
                            <Users className="h-5 w-5 text-indigo-600" />
                            Zaproszeni użytkownicy ({stats.usedBy.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="px-6 pb-6">
                        <div className="space-y-3">
                            {stats.usedBy.slice().reverse().map((use, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-black text-sm">
                                            {use.newUserEmail[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800">{use.newUserEmail}</p>
                                            <p className="text-xs text-slate-400">
                                                {new Date(use.registeredAt).toLocaleDateString('pl', { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </p>
                                        </div>
                                    </div>
                                    <Badge
                                        className={cn(
                                            "font-bold",
                                            use.bonusAwarded
                                                ? "bg-green-100 text-green-700 border-green-200"
                                                : "bg-amber-100 text-amber-700 border-amber-200"
                                        )}
                                    >
                                        {use.bonusAwarded ? `+${REFERRAL_BONUS_INVITER} pkt` : 'Oczekuje'}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* How it works */}
            <Card className="border-slate-200">
                <CardHeader className="pb-3">
                    <CardTitle className="text-base text-slate-700">Jak to działa?</CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                    <ol className="space-y-4">
                        {[
                            { step: 1, text: `Skopiuj swój unikalny link lub kod`, icon: Link2, color: 'indigo' },
                            { step: 2, text: 'Wyślij go znajomemu nauczycielowi lub rodzicowi', icon: Share2, color: 'purple' },
                            { step: 3, text: `Znajomy loguje się przez Twój link — dostaje ${REFERRAL_BONUS_NEW_USER} pkt powitalnych`, icon: Gift, color: 'pink' },
                            { step: 4, text: `Ty automatycznie otrzymujesz ${REFERRAL_BONUS_INVITER} Kamila Points na konto!`, icon: Coins, color: 'amber' },
                        ].map(s => (
                            <li key={s.step} className="flex gap-4 items-start">
                                <div className={cn(
                                    "h-8 w-8 rounded-full flex items-center justify-center font-black text-sm shrink-0",
                                    s.color === 'indigo' ? 'bg-indigo-100 text-indigo-700' :
                                    s.color === 'purple' ? 'bg-purple-100 text-purple-700' :
                                    s.color === 'pink' ? 'bg-pink-100 text-pink-700' :
                                    'bg-amber-100 text-amber-700'
                                )}>
                                    {s.step}
                                </div>
                                <p className="text-sm text-slate-600 font-medium leading-relaxed pt-1">{s.text}</p>
                            </li>
                        ))}
                    </ol>
                    <p className="text-xs text-slate-400 mt-6 border-t pt-4">
                        * Program działa do {MAX_REFERRALS_PER_USER} zaproszeń na konto. Punkty są przyznawane po rejestracji nowego użytkownika. Nie można polecić samego siebie.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}

"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { X, Sparkles, Percent, LogOut, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/language-provider";

/**
 * AnnouncementBar Component
 * A thin, premium bar at the very top of the site for global news/offers.
 */
export function AnnouncementBar() {
    const { t, language } = useLanguage();
    const [visible, setVisible] = useState(true);

    if (!visible) return null;

    return (
        <div className="relative z-[60] bg-indigo-600 text-white overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 opacity-50 animate-gradient" />
            <div className="container mx-auto px-4 h-10 flex items-center justify-center gap-4 relative">
                <div className="flex items-center gap-2 text-[11px] md:text-xs font-black uppercase tracking-widest">
                    <Sparkles className="h-3 w-3 animate-pulse" />
                    <span>{t.announcement?.launchOffer || "Special Launch Offer: Get 20% OFF with code \"START20\""}</span>
                </div>
                <button
                    onClick={() => setVisible(false)}
                    className="absolute right-4 hover:scale-110 transition-transform p-1"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}

/**
 * ExitIntentPopup Component
 * Detects when a user is about to leave and shows a high-value offer.
 * Only activates on shop-related pages (/products, /cart, /checkout, /pay).
 */
export function ExitIntentPopup() {
    const { t } = useLanguage();
    const pathname = usePathname();
    const isShopPage = /\/(products|cart|checkout|pay)(\/?.+)?$/.test(pathname || '');
    const [show, setShow] = useState(false);
    const [hasShown, setHasShown] = useState(false);

    useEffect(() => {
        // Check if we've already shown this in this session
        if (sessionStorage.getItem("exit_intent_shown")) {
            setHasShown(true);
        }
    }, []);

    useEffect(() => {
        if (hasShown || !isShopPage) return;

        const handleMouseLeave = (e: MouseEvent) => {
            // If mouse leaves the top of the viewport
            if (e.clientY <= 0) {
                setShow(true);
                setHasShown(true);
                sessionStorage.setItem("exit_intent_shown", "true");
            }
        };

        document.addEventListener("mouseleave", handleMouseLeave);
        return () => document.removeEventListener("mouseleave", handleMouseLeave);
    }, [hasShown, isShopPage]);

    if (!show || !isShopPage) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-card border border-border rounded-[2rem] shadow-2xl max-w-lg w-full overflow-hidden relative animate-in zoom-in-95 duration-300">
                <div className="absolute top-4 right-4 z-10">
                    <Button variant="ghost" size="icon" onClick={() => setShow(false)} className="rounded-full">
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className="bg-indigo-600 p-8 flex flex-col justify-center items-center text-white text-center">
                        <Percent className="h-16 w-16 mb-4 opacity-50" />
                        <h3 className="text-4xl font-black mb-2">{t.exitIntent?.title || "WAIT!"}</h3>
                        <p className="text-indigo-100 font-medium">{t.exitIntent?.subtitle || "Before you go..."}</p>
                    </div>

                    <div className="p-8 flex flex-col justify-center">
                        <h4 className="text-2xl font-serif font-bold text-slate-900 mb-4">
                            {t.exitIntent?.header || "Get Your Free \"Starter Pack\""}
                        </h4>
                        <p className="text-slate-600 mb-6 text-sm leading-relaxed font-medium">
                            {t.exitIntent?.description || "Small bribe: Subscribe to our newsletter and get a pack of 50 flashcards for free!"}
                        </p>

                        <div className="space-y-3">
                            <Button onClick={() => toast.info(t?.premium?.comingSoon || "Subskrypcja Premium będzie dostępna wkrótce!")} className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-bold group">
                                {t.exitIntent?.cta || "I Want My Gift"}
                                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                            <button
                                onClick={() => setShow(false)}
                                className="w-full text-xs text-slate-400 font-bold uppercase tracking-widest hover:text-slate-600 transition-colors"
                            >
                                {t.exitIntent?.noThanks || "No thanks, I'll pay full price"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

/**
 * PromoTimer Component
 * Shows a countdown to create urgency for limited time offers.
 */
export function PromoTimer() {
    const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 45, seconds: 0 });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
                if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
                if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
                return prev;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-amber-500 flex items-center justify-center text-white">
                    <Sparkles className="h-5 w-5" />
                </div>
                <div>
                    <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest leading-none mb-1">Limited Time Offer</p>
                    <p className="text-sm font-bold text-slate-900">Flash Sale Ending Soon!</p>
                </div>
            </div>
            <div className="flex gap-2">
                {[
                    { label: 'H', val: timeLeft.hours },
                    { label: 'M', val: timeLeft.minutes },
                    { label: 'S', val: timeLeft.seconds }
                ].map((unit, i) => (
                    <div key={i} className="flex flex-col items-center">
                        <div className="bg-white border border-amber-200 rounded-lg w-9 h-9 flex items-center justify-center font-black text-amber-600 text-base shadow-sm">
                            {unit.val.toString().padStart(2, '0')}
                        </div>
                        <span className="text-[8px] font-black text-amber-500 mt-1 uppercase">{unit.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

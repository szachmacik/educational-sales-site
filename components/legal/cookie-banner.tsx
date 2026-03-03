"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Cookie, ShieldCheck } from "lucide-react";
import { useParams } from "next/navigation";
import Link from "next/link";

export function CookieBanner() {
    const [isVisible, setIsVisible] = useState(false);
    const params = useParams();
    const lang = (params?.lang as string) || "pl";

    useEffect(() => {
        const consent = localStorage.getItem("cookie_consent");
        if (!consent) {
            // Slight delay before showing
            const timer = setTimeout(() => setIsVisible(true), 1500);

            // User requested: Auto-dismiss and accept on significant scroll
            const handleScroll = () => {
                if (window.scrollY > 300) {
                    acceptAllCookies();
                }
            };
            window.addEventListener("scroll", handleScroll, { passive: true });

            return () => {
                clearTimeout(timer);
                window.removeEventListener("scroll", handleScroll);
            };
        }
    }, []);

    const acceptAllCookies = () => {
        localStorage.setItem("cookie_consent", "all");
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900 border-t border-slate-800 shadow-[0_-10px_40px_rgba(0,0,0,0.3)] p-4 md:p-6 animate-in slide-in-from-bottom duration-700">
            <div className="container mx-auto max-w-6xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">

                <div className="flex-1 flex gap-4 items-start md:items-center">
                    <div className="hidden md:flex flex-shrink-0 h-10 w-10 bg-slate-800 rounded-full items-center justify-center text-indigo-400">
                        <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-white font-bold flex items-center gap-2">
                            Centrum Preferencji Prywatności
                            <Cookie className="h-4 w-4 text-amber-500" />
                        </h3>
                        <p className="text-slate-400 text-xs md:text-sm leading-relaxed max-w-3xl">
                            Używamy plików cookies do niezbędnego działania serwisu oraz w celach analitycznych.
                            Dalsze korzystanie ze strony lub kliknięcie "Akceptuj" oznacza zgodę na ich użycie.
                            Szczegóły w naszej <Link href={`/${lang}/polityka-cookies`} className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2 font-medium">Polityce Prywatności</Link>.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto shrink-0">
                    <Button
                        onClick={acceptAllCookies}
                        className="w-full sm:w-auto h-9 bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg"
                    >
                        Akceptuj
                    </Button>
                </div>
            </div>
        </div>
    );
}

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Cookie, X, Info } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export function CookieConsentBar() {
    const [isVisible, setIsVisible] = useState(false);
    const params = useParams();
    const lang = (params?.lang as string) || "pl";

    useEffect(() => {
        // Check if consent has already been given or rejected
        const consent = localStorage.getItem("cookie_consent");
        if (!consent) {
            // Show only if no consent choice has been stored
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 1500); // Slight delay so it doesn't immediately crowd the screen
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAcceptAll = () => {
        localStorage.setItem("cookie_consent", "all");
        setIsVisible(false);
        // You would typically initialize tracking pixels here
    };

    const handleRejectNonEssential = () => {
        localStorage.setItem("cookie_consent", "essential");
        setIsVisible(false);
        // Triggers would be disabled for marketing scripts
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900 border-t border-slate-800 shadow-2xl p-4 md:p-6 animate-in slide-in-from-bottom duration-700">
            <div className="container mx-auto max-w-6xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">

                <div className="flex-1 flex gap-4 items-start md:items-center">
                    <div className="hidden md:flex flex-shrink-0 h-12 w-12 bg-slate-800 rounded-full items-center justify-center text-indigo-400">
                        <ShieldCheck className="h-6 w-6" />
                    </div>
                    <div className="space-y-1.5">
                        <h3 className="text-white font-bold flex items-center gap-2">
                            Szanujemy Twoją prywatność
                            <Cookie className="h-4 w-4 text-amber-500" />
                        </h3>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-3xl">
                            Ta strona korzysta z plików cookie w celu ulepszenia nawigacji, analizowania ruchu oraz dopasowywania spersonalizowanych reklam.
                            Klikając "Akceptuj wszystkie", zgadzasz się na przechowywanie wszystkich wymienionych w naszej <Link href={`/${lang}/polityka-cookies`} className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2 font-medium">Polityce Cookies</Link>.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto shrink-0">
                    <Button
                        variant="ghost"
                        onClick={handleRejectNonEssential}
                        className="w-full sm:w-auto text-slate-300 hover:text-white hover:bg-slate-800"
                    >
                        Tylko niezbędne
                    </Button>
                    <Link href={`/${lang}/polityka-cookies`} className="w-full sm:w-auto">
                        <Button onClick={() => toast.success("Akcja wykonana pomyślnie.")}
                            variant="outline"
                            className="w-full bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
                        >
                            <Settings className="w-4 h-4 mr-2" />
                            Dostosuj
                        </Button>
                    </Link>
                    <Button
                        onClick={handleAcceptAll}
                        className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                    >
                        Akceptuj wszystkie
                    </Button>
                </div>
            </div>
        </div>
    );
}

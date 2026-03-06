"use client";

import { useState, useEffect } from "react";
import { X, Zap } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/components/language-provider";
import { cn } from "@/lib/utils";

interface TimeLeft {
    hours: number;
    minutes: number;
    seconds: number;
}

function useCountdown(targetDate: Date): TimeLeft {
    const [timeLeft, setTimeLeft] = useState<TimeLeft>({ hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const calculate = () => {
            const now = new Date().getTime();
            const distance = targetDate.getTime() - now;
            if (distance <= 0) {
                setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
                return;
            }
            setTimeLeft({
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((distance % (1000 * 60)) / 1000),
            });
        };
        calculate();
        const interval = setInterval(calculate, 1000);
        return () => clearInterval(interval);
    }, [targetDate]);

    return timeLeft;
}

export function PromoBanner() {
    const { language } = useLanguage();
    const [dismissed, setDismissed] = useState(false);

    // Target: end of current day + 2 days
    const target = new Date();
    target.setDate(target.getDate() + 2);
    target.setHours(23, 59, 59, 0);

    const { hours, minutes, seconds } = useCountdown(target);

    const isPolish = language === 'pl';
    const isUkrainian = language === 'uk';

    const pad = (n: number) => String(n).padStart(2, '0');

    const text = isPolish
        ? 'Wiosenna promocja! Użyj kodu '
        : isUkrainian
        ? 'Весняна акція! Використайте код '
        : 'Spring sale! Use code ';

    const cta = isPolish ? 'Kup teraz →' : isUkrainian ? 'Купити зараз →' : 'Shop now →';
    const endsIn = isPolish ? 'Kończy się za:' : isUkrainian ? 'Закінчується через:' : 'Ends in:';

    if (dismissed) return null;

    return (
        <div className={cn(
            "relative z-50 bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-700 text-white",
            "py-2.5 px-4"
        )}>
            <div className="container mx-auto flex items-center justify-center gap-4 flex-wrap text-sm">
                <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-yellow-300 fill-yellow-300 shrink-0" />
                    <span>
                        {text}
                        <span className="font-black bg-white/20 rounded px-1.5 py-0.5 mx-1 font-mono tracking-wider">SPRING20</span>
                        {isPolish ? ' i oszczędź 20%!' : isUkrainian ? ' і заощадьте 20%!' : ' and save 20%!'}
                    </span>
                </div>

                <div className="flex items-center gap-2 text-xs">
                    <span className="text-white/70">{endsIn}</span>
                    <div className="flex items-center gap-1 font-mono font-bold">
                        <span className="bg-white/20 rounded px-1.5 py-0.5">{pad(hours)}</span>
                        <span className="text-white/70">:</span>
                        <span className="bg-white/20 rounded px-1.5 py-0.5">{pad(minutes)}</span>
                        <span className="text-white/70">:</span>
                        <span className="bg-white/20 rounded px-1.5 py-0.5">{pad(seconds)}</span>
                    </div>
                </div>

                <Link
                    href={`/${language}/products`}
                    className="font-bold text-yellow-300 hover:text-yellow-100 underline underline-offset-2 transition-colors"
                >
                    {cta}
                </Link>
            </div>

            <button
                onClick={() => setDismissed(true)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                aria-label="Zamknij baner"
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    );
}

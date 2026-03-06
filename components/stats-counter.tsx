"use client";

import { useEffect, useRef, useState } from "react";
import { BookOpen, Users, Star, Download, Award, Globe } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { cn } from "@/lib/utils";

function useCountUp(target: number, duration: number = 2000, start: boolean = false) {
    const [count, setCount] = useState(0);
    useEffect(() => {
        if (!start) return;
        let startTime: number | null = null;
        const step = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [start, target, duration]);
    return count;
}

interface StatItemProps {
    icon: React.ElementType;
    value: number;
    suffix: string;
    label: string;
    color: string;
    bgColor: string;
    started: boolean;
    delay?: number;
}

function StatItem({ icon: Icon, value, suffix, label, color, bgColor, started, delay = 0 }: StatItemProps) {
    const [localStarted, setLocalStarted] = useState(false);
    useEffect(() => {
        if (started) {
            const t = setTimeout(() => setLocalStarted(true), delay);
            return () => clearTimeout(t);
        }
    }, [started, delay]);
    const count = useCountUp(value, 1800, localStarted);

    return (
        <div className="flex flex-col items-center text-center group">
            <div className={cn(
                "w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110",
                bgColor
            )}>
                <Icon className={cn("h-8 w-8", color)} />
            </div>
            <div className="text-4xl font-black text-slate-900 tabular-nums">
                {count.toLocaleString()}{suffix}
            </div>
            <div className="mt-2 text-sm font-medium text-slate-500 max-w-[120px]">{label}</div>
        </div>
    );
}

export function StatsCounter() {
    const { t } = useLanguage();
    const ref = useRef<HTMLDivElement>(null);
    const [started, setStarted] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setStarted(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.3 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    const stats = [
        {
            icon: BookOpen,
            value: 1200,
            suffix: "+",
            label: t?.stats?.materials || "Materiałów edukacyjnych",
            color: "text-indigo-600",
            bgColor: "bg-indigo-50",
            delay: 0,
        },
        {
            icon: Users,
            value: 2800,
            suffix: "+",
            label: t?.stats?.teachers || "Nauczycieli i wychowawców",
            color: "text-emerald-600",
            bgColor: "bg-emerald-50",
            delay: 100,
        },
        {
            icon: Download,
            value: 45000,
            suffix: "+",
            label: t?.stats?.downloads || "Pobrań materiałów",
            color: "text-blue-600",
            bgColor: "bg-blue-50",
            delay: 200,
        },
        {
            icon: Star,
            value: 98,
            suffix: "%",
            label: t?.stats?.satisfaction || "Zadowolonych klientów",
            color: "text-amber-600",
            bgColor: "bg-amber-50",
            delay: 300,
        },
        {
            icon: Globe,
            value: 12,
            suffix: "+",
            label: t?.stats?.countries || "Krajów na świecie",
            color: "text-purple-600",
            bgColor: "bg-purple-50",
            delay: 400,
        },
        {
            icon: Award,
            value: 8,
            suffix: "",
            label: t?.stats?.years || "Lat doświadczenia",
            color: "text-rose-600",
            bgColor: "bg-rose-50",
            delay: 500,
        },
    ];

    return (
        <section className="py-20 bg-white border-y border-slate-100">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-14">
                    <span className="inline-block text-xs font-bold uppercase tracking-widest text-indigo-600 mb-3">
                        {t?.stats?.badge || "W liczbach"}
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900">
                        {t?.stats?.heading || "Zaufali nam nauczyciele z całej Polski"}
                    </h2>
                    <p className="mt-3 text-lg text-slate-500 max-w-2xl mx-auto">
                        {t?.stats?.sub || "Każdego dnia pomagamy tysiącom pedagogów tworzyć angażujące lekcje języka angielskiego."}
                    </p>
                </div>

                <div ref={ref} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-6">
                    {stats.map((stat, i) => (
                        <StatItem key={i} {...stat} started={started} />
                    ))}
                </div>
            </div>
        </section>
    );
}

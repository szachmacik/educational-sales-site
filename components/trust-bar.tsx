"use client";

import { ShieldCheck, Zap, Users, Star, Clock, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/language-provider";

export function TrustBar() {
    const { t } = useLanguage();

    const trustItems = [
        { icon: ShieldCheck, text: t.trustBar.securePayments },
        { icon: Zap, text: t.trustBar.instantAccess },
        { icon: Users, text: t.trustBar.happyTeachers },
        { icon: Star, text: t.trustBar.rating },
        { icon: Clock, text: t.trustBar.saveTime },
        { icon: Award, text: t.trustBar.verifiedMaterials },
    ];

    return (
        <section className="relative overflow-hidden bg-slate-50/50 py-6 border-y border-slate-100">
            <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />

                <div className="flex overflow-hidden group select-none">
                    <div className="flex shrink-0 min-w-full items-center justify-around animate-marquee">
                        {trustItems.map((item, index) => (
                            <div key={`first-${index}`} className="flex items-center gap-3 px-8">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-slate-200 shadow-sm">
                                    <item.icon className="h-5 w-5 text-slate-400" />
                                </div>
                                <span className="font-bold text-slate-600 whitespace-nowrap text-sm tracking-tight">
                                    {item.text}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="flex shrink-0 min-w-full items-center justify-around animate-marquee" aria-hidden="true">
                        {trustItems.map((item, index) => (
                            <div key={`second-${index}`} className="flex items-center gap-3 px-8">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-slate-200 shadow-sm">
                                    <item.icon className="h-5 w-5 text-slate-400" />
                                </div>
                                <span className="font-bold text-slate-600 whitespace-nowrap text-sm tracking-tight">
                                    {item.text}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

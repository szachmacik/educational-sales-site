"use client";

import React from "react";
import { AIWorkshop } from "@/components/admin/ai-workshop";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Brain } from "lucide-react";
import { useLanguage, NamespaceGuard } from "@/components/language-provider";
import { translations } from "@/lib/translations";

export default function WorkshopPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = React.use(params);
    const { t } = useLanguage();

    // @ts-ignore
    const dictionary = translations[lang] || translations['pl'] || {};
    const w = t.adminSettings?.workshop || {};
    return (
        <NamespaceGuard dictionary={dictionary}>
            <div className="space-y-8 pb-20">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/40 p-10 rounded-[2.5rem] border border-white/20 glass-premium shadow-2xl relative overflow-hidden group">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:rotate-12 group-hover:scale-110 transition-all duration-1000">
                        <Brain className="h-64 w-64 text-indigo-600" />
                    </div>
                    <div className="absolute -bottom-24 -left-24 h-64 w-64 bg-purple-500/10 blur-[100px] rounded-full" />

                    <div className="relative z-10 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="h-14 w-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-xl shadow-indigo-200">
                                <Sparkles className="h-8 w-8" />
                            </div>
                            <div className="space-y-1">
                                <h1 className="text-4xl font-black tracking-tight text-slate-900 uppercase">
                                    <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
                                        {w.title_prefix || "AI Creative"}
                                    </span> {w.title_suffix || "Studio"}
                                </h1>
                                <div className="flex items-center gap-2">
                                    <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100 border-none font-black text-[10px] uppercase tracking-widest px-3">
                                        {w.badge || "Next-Gen"}
                                    </Badge>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2 border-l border-slate-200">
                                        {w.powered_by || "Powered by OpenAI & HeyGen"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 flex items-center gap-6 overflow-x-auto pb-4 md:pb-0 scrollbar-none">
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{w.available_credits || "Available Credits"}</span>
                            <span className="text-2xl font-black text-slate-900 mt-1">45,200</span>
                        </div>
                        <div className="h-10 w-px bg-slate-200" />
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{w.generations_today || "Generations Today"}</span>
                            <span className="text-2xl font-black text-slate-900 mt-1">12</span>
                        </div>
                    </div>
                </div>

                <AIWorkshop />
            </div>
        </NamespaceGuard>
    );
}

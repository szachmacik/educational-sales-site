"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";
import { cn } from "@/lib/utils";
import { useScrollReveal } from "@/hooks/use-intersection";
import { useLanguage } from "@/components/language-provider";

const COLORS = ["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-orange-500", "bg-red-500", "bg-yellow-600", "bg-teal-500", "bg-indigo-500", "bg-pink-500", "bg-cyan-500", "bg-emerald-500", "bg-lime-600"];

export function Testimonials() {
    const { t } = useLanguage();
    const reveal = useScrollReveal({ threshold: 0.1 });

    // Use localized reviews from translation files
    const reviews = t.testimonials?.reviews || [];

    return (
        <section className="relative py-24 sm:py-32 overflow-hidden bg-slate-50/50">
            <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
                <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
            </div>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div ref={reveal.ref} className={cn("text-center mb-16", reveal.className)}>
                    <h2 className="font-serif text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 sm:text-5xl pb-1">
                        {t.testimonials.header}
                    </h2>
                    <p className="mt-4 text-xl text-slate-600">
                        {t.testimonials.subheader}
                    </p>
                </div>

                {/* Show first 6 on mobile, all 12 on desktop via 3-col grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reviews.map((testimonial: any, index: number) => (
                        <Card
                            key={index}
                            className={cn(
                                "relative flex flex-col justify-between border-slate-200/60 shadow-lg shadow-slate-200/40 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white rounded-3xl premium-card-ring hover-lift shadow-premium",
                                "animate-fade-in-up"
                            )}
                            style={{ animationDelay: `${index * 150}ms` }}
                        >
                            <CardContent className="pt-8 px-8 pb-8 flex flex-col h-full">
                                <Quote className="h-8 w-8 text-indigo-500/20 mb-4" />

                                <p className="text-slate-600 italic leading-relaxed mb-6 flex-1 text-sm sm:text-base">
                                    "{testimonial.content}"
                                </p>

                                <div className="flex items-center gap-4 mt-auto pt-6 border-t border-slate-100">
                                    <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-sm flex-shrink-0", COLORS[index % COLORS.length])}>
                                        {testimonial.name.charAt(0)}
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="font-bold text-slate-900 leading-none mb-1 truncate">{testimonial.name}</h4>
                                        <p className="text-xs text-slate-500 font-medium truncate">{testimonial.role}</p>
                                    </div>
                                </div>

                                <div className="flex gap-1 mt-4">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <Star key={s} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Localized Stats Bar */}
                <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center border-t border-slate-200 pt-12">
                    <div>
                        <p className="text-4xl font-extrabold text-indigo-600 mb-2">12k+</p>
                        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{t.testimonials.stats.teachers}</p>
                    </div>
                    <div>
                        <p className="text-4xl font-extrabold text-indigo-600 mb-2">4.9/5</p>
                        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{t.testimonials.stats.rating}</p>
                    </div>
                    <div>
                        <p className="text-4xl font-extrabold text-indigo-600 mb-2">1000+</p>
                        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{t.testimonials.stats.materials}</p>
                    </div>
                    <div>
                        <p className="text-4xl font-extrabold text-indigo-600 mb-2">100%</p>
                        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{t.testimonials.stats.satisfaction}</p>
                    </div>
                </div>
            </div>
        </section>
    );
}

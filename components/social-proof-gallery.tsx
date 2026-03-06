"use client";

import { useLanguage } from "@/components/language-provider";
import { Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SocialProofGallery() {
    const { t } = useLanguage();
    // Facebook Page URL
    const pageUrl = "https://www.facebook.com/materialy.edukacyjne.dla.nauczycieli.angielskiego";
    // Encoded for the iframe
    const encodedUrl = encodeURIComponent(pageUrl);

    const header = t?.trustBar?.socialCommunity?.header || t?.socialProof?.header || "Social Proof";
    const desc = t?.trustBar?.socialCommunity?.desc || t?.socialProof?.sub || "Join our community";
    const cta = t?.trustBar?.socialCommunity?.cta || t?.socialProof?.cta || "Facebook";
    const followers = t?.trustBar?.socialCommunity?.followers || "Followers";
    const stats = t?.trustBar?.socialCommunity?.stats || "Downloads";
    const madeWithLove = t?.socialProof?.madeWithLove || "Made with ❤️";
    const polishQuality = t?.socialProof?.polishQuality || "Polish Quality";

    return (
        <section className="py-16 bg-slate-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-serif font-bold mb-4">{header}</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
                        {desc}
                    </p>
                    <a
                        href={pageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Button variant="outline" className="gap-2">
                            <Facebook className="w-5 h-5 text-[#1877F2]" />
                            {cta}
                        </Button>
                    </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {[
                        { src: "/speakbook-action.png", alt: t?.trustBar?.socialCommunity?.imageAlts?.speakbook || "Conversations with Speakbook" },
                        { src: "/theater-play-action.png", alt: t?.trustBar?.socialCommunity?.imageAlts?.theater || "Theater Plays" },
                        { src: "/megapack-action.png", alt: t?.trustBar?.socialCommunity?.imageAlts?.megapack || "Mega Pack" },
                        { src: "/kids-flashcards.png", alt: t?.trustBar?.socialCommunity?.imageAlts?.nursery || "Nursery Scenarios" },
                        { src: "/teacher-worksheets.png", alt: t?.trustBar?.socialCommunity?.imageAlts?.stories || "Project Stories" },
                        { src: "/kids-board-game.png", alt: t?.trustBar?.socialCommunity?.imageAlts?.games || "Special Lesson Games" },
                    ].map((img, i) => (
                        <div key={i} className="relative group overflow-hidden rounded-2xl shadow-md border border-slate-200 aspect-[4/3]">
                            <img
                                src={img.src}
                                alt={img.alt}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                                <p className="text-white text-sm font-medium">{img.alt}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col items-center mb-16 px-4">
                    <div className="inline-flex items-center gap-4 md:gap-6 rounded-[2rem] border-2 border-primary/20 bg-white/80 backdrop-blur-md px-8 py-6 md:px-12 md:py-8 shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:shadow-primary/20 hover:scale-[1.03] transition-all duration-500 cursor-default group border-b-4 border-b-primary/40">
                        <img
                            src="https://flagcdn.com/pl.svg"
                            alt="Polska"
                            className="w-12 md:w-20 h-auto shadow-md rounded-sm group-hover:rotate-6 transition-transform duration-300 border border-slate-200"
                        />
                        <div className="flex flex-col items-start">
                            <span className="text-2xl md:text-4xl font-serif font-black text-slate-900 tracking-tight leading-none group-hover:text-primary transition-colors">
                                {madeWithLove}
                            </span>
                            <span className="text-2xl md:text-4xl font-serif font-black text-primary tracking-tight leading-none mt-2 group-hover:text-primary/80 transition-colors">
                                {polishQuality}
                            </span>
                        </div>
                        <span className="text-4xl md:text-6xl group-hover:scale-125 transition-transform duration-300 animate-pulse">❤️</span>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-12 items-start">
                    <div className="lg:w-1/2 space-y-6">
                        <div className="bg-indigo-600 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden group">
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
                            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                <Facebook className="h-6 w-6" />
                                {header}
                            </h3>
                            <p className="text-indigo-100 mb-8 leading-relaxed">
                                {desc}
                            </p>
                            <a href={pageUrl} target="_blank" rel="noopener noreferrer">
                                <Button className="bg-white text-indigo-600 hover:bg-indigo-50 border-none font-bold py-6 px-8 rounded-full shadow-lg">
                                    {cta}
                                </Button>
                            </a>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                                <p className="text-3xl font-bold text-slate-900 mb-1">12k+</p>
                                <p className="text-sm text-slate-500">{followers}</p>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                                <p className="text-3xl font-bold text-slate-900 mb-1">5k+</p>
                                <p className="text-sm text-slate-500">{stats}</p>
                            </div>
                        </div>
                    </div>

                    <div className="lg:w-1/2 w-full flex justify-center">
                        <div className="bg-white p-4 rounded-xl shadow-lg border border-slate-100 w-full max-w-[500px]">
                            <iframe
                                src={`https://www.facebook.com/plugins/page.php?href=${encodedUrl}&tabs=timeline&width=500&height=600&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId`}
                                width="100%"
                                height="600"
                                style={{ border: 'none', overflow: 'hidden' }}
                                scrolling="no"
                                frameBorder="0"
                                allowFullScreen={true}
                                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                            ></iframe>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

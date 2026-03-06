"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/components/language-provider";
import { useCart } from "@/lib/cart-context";
import { getProducts } from "@/lib/product-service";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Star, TrendingUp, Award, Flame, Crown } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const BADGE_CONFIG = [
    { icon: Crown, label: "Bestseller #1", color: "bg-yellow-500 text-white" },
    { icon: Award, label: "Top 2", color: "bg-slate-400 text-white" },
    { icon: Flame, label: "Top 3", color: "bg-orange-500 text-white" },
];

export default function BestsellerzyPage({ params }: { params: { lang: string } }) {
    const { t, language, formatPrice } = useLanguage();
    const { addItem } = useCart();
    const allProducts = getProducts(language);

    // Simulate bestseller ranking: products with highest "popularity" score
    // We use a deterministic pseudo-random score based on product id to simulate sales data
    const bestsellers = useMemo(() => {
        return allProducts
            .map(p => ({
                ...p,
                score: (p.id.charCodeAt(0) + p.id.charCodeAt(p.id.length - 1) + p.title.length * 3) % 100,
                rating: 4.2 + ((p.id.charCodeAt(0) % 8) / 10),
                reviews: 12 + (p.id.charCodeAt(0) % 89),
            }))
            .sort((a, b) => b.score - a.score)
            .slice(0, 24);
    }, [allProducts]);

    const handleAddToCart = (product: typeof bestsellers[0]) => {
        addItem(product);
        toast.success(language === 'pl' ? `"${product.title}" dodano do koszyka!` : `"${product.title}" added to cart!`);
    };

    const isPolish = language === 'pl';

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main>
                {/* Hero */}
                <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 py-16 border-b">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-10 left-10 h-40 w-40 rounded-full bg-amber-400 blur-3xl" />
                        <div className="absolute bottom-10 right-10 h-60 w-60 rounded-full bg-orange-400 blur-3xl" />
                    </div>
                    <div className="container mx-auto px-4 relative">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-10 w-10 rounded-xl bg-amber-500 flex items-center justify-center">
                                <TrendingUp className="h-5 w-5 text-white" />
                            </div>
                            <Badge className="bg-amber-100 text-amber-800 border-amber-200 font-semibold">
                                {isPolish ? 'Najchętniej kupowane' : 'Most popular'}
                            </Badge>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-4">
                            {isPolish ? '🏆 Bestsellery' : '🏆 Bestsellers'}
                        </h1>
                        <p className="text-lg text-slate-600 max-w-2xl">
                            {isPolish
                                ? 'Materiały dydaktyczne, które nauczyciele wybierają najczęściej. Sprawdzone, polecane i uwielbianie przez tysiące pedagogów.'
                                : 'Teaching materials most frequently chosen by educators. Proven, recommended and loved by thousands of teachers.'}
                        </p>
                        <div className="flex items-center gap-6 mt-6 text-sm text-slate-500">
                            <div className="flex items-center gap-1.5">
                                <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                                <span>{isPolish ? 'Najwyżej oceniane' : 'Highest rated'}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Flame className="h-4 w-4 text-orange-500" />
                                <span>{isPolish ? 'Najczęściej pobierane' : 'Most downloaded'}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Award className="h-4 w-4 text-indigo-500" />
                                <span>{isPolish ? `${bestsellers.length} produktów` : `${bestsellers.length} products`}</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Top 3 podium */}
                <section className="container mx-auto px-4 py-12">
                    <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-2">
                        <Crown className="h-6 w-6 text-amber-500" />
                        {isPolish ? 'Podium bestsellerów' : 'Bestseller podium'}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                        {bestsellers.slice(0, 3).map((product, i) => {
                            const cfg = BADGE_CONFIG[i];
                            const IconComp = cfg.icon;
                            return (
                                <div key={product.id} className={cn(
                                    "relative rounded-2xl border-2 overflow-hidden group transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
                                    i === 0 ? "border-amber-400 shadow-amber-100 shadow-lg" :
                                    i === 1 ? "border-slate-300 shadow-slate-100 shadow-md" :
                                    "border-orange-300 shadow-orange-100 shadow-md"
                                )}>
                                    {/* Rank badge */}
                                    <div className={cn("absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold shadow-md", cfg.color)}>
                                        <IconComp className="h-3.5 w-3.5" />
                                        {cfg.label}
                                    </div>
                                    <Link href={`/${language}/products/${product.slug}`}>
                                        <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                                            {product.image ? (
                                                <Image
                                                    src={product.image}
                                                    alt={product.title}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100">
                                                    <span className="text-4xl">📚</span>
                                                </div>
                                            )}
                                        </div>
                                    </Link>
                                    <div className="p-5 bg-white">
                                        <Link href={`/${language}/products/${product.slug}`}>
                                            <h3 className="font-bold text-slate-900 mb-2 line-clamp-2 hover:text-indigo-600 transition-colors">
                                                {product.title}
                                            </h3>
                                        </Link>
                                        <div className="flex items-center gap-1 mb-3">
                                            {[1,2,3,4,5].map(s => (
                                                <Star key={s} className={cn("h-3.5 w-3.5", s <= Math.round(product.rating) ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200")} />
                                            ))}
                                            <span className="text-xs text-slate-500 ml-1">{product.rating.toFixed(1)} ({product.reviews})</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xl font-bold text-indigo-600">{formatPrice(product.price)}</span>
                                            <Button
                                                size="sm"
                                                onClick={() => handleAddToCart(product)}
                                                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl gap-1.5"
                                            >
                                                <ShoppingCart className="h-3.5 w-3.5" />
                                                {isPolish ? 'Kup' : 'Buy'}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Rest of bestsellers */}
                    <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <Flame className="h-6 w-6 text-orange-500" />
                        {isPolish ? 'Pozostałe bestsellery' : 'More bestsellers'}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {bestsellers.slice(3).map((product, i) => (
                            <Card key={product.id} className="group border-slate-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">
                                <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                                    {product.image ? (
                                        <Image
                                            src={product.image}
                                            alt={product.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
                                            <span className="text-3xl">📚</span>
                                        </div>
                                    )}
                                    <div className="absolute top-2 left-2">
                                        <Badge className="bg-white/90 backdrop-blur text-slate-700 text-xs font-bold border-none shadow-sm">
                                            #{i + 4}
                                        </Badge>
                                    </div>
                                </div>
                                <CardContent className="p-4">
                                    <Link href={`/${language}/products/${product.slug}`}>
                                        <h3 className="font-semibold text-sm text-slate-900 mb-2 line-clamp-2 hover:text-indigo-600 transition-colors leading-snug">
                                            {product.title}
                                        </h3>
                                    </Link>
                                    <div className="flex items-center gap-1 mb-3">
                                        {[1,2,3,4,5].map(s => (
                                            <Star key={s} className={cn("h-3 w-3", s <= Math.round(product.rating) ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200")} />
                                        ))}
                                        <span className="text-xs text-slate-400 ml-1">({product.reviews})</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold text-indigo-600">{formatPrice(product.price)}</span>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleAddToCart(product)}
                                            className="h-8 px-3 text-xs rounded-lg border-indigo-200 text-indigo-600 hover:bg-indigo-50 gap-1"
                                        >
                                            <ShoppingCart className="h-3 w-3" />
                                            {isPolish ? 'Dodaj' : 'Add'}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* CTA */}
                    <div className="mt-16 text-center bg-gradient-to-r from-indigo-50 to-purple-50 rounded-3xl p-12 border border-indigo-100">
                        <h3 className="text-2xl font-bold text-slate-900 mb-3">
                            {isPolish ? 'Odkryj cały katalog' : 'Explore the full catalog'}
                        </h3>
                        <p className="text-slate-600 mb-6 max-w-md mx-auto">
                            {isPolish
                                ? 'Ponad 100 materiałów dydaktycznych do nauki języka angielskiego dla każdego poziomu.'
                                : 'Over 100 teaching materials for English language learning at every level.'}
                        </p>
                        <Link href={`/${language}/products`}>
                            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-8">
                                {isPolish ? 'Zobacz wszystkie produkty' : 'View all products'}
                            </Button>
                        </Link>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}

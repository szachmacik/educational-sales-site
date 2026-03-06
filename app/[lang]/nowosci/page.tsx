"use client";

import { useMemo, useState } from "react";
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
import { ShoppingCart, Star, Sparkles, Clock, Zap } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function NowosciPage({ params }: { params: { lang: string } }) {
    const { language, formatPrice } = useLanguage();
    const { addItem } = useCart();
    const allProducts = getProducts(language);
    const [filter, setFilter] = useState<"all" | "week" | "month">("all");

    const isPolish = language === 'pl';
    const isUkrainian = language === 'uk';

    const t = {
        title: isPolish ? '✨ Nowości' : isUkrainian ? '✨ Новинки' : '✨ New Arrivals',
        subtitle: isPolish
            ? 'Najnowsze materiały dydaktyczne, świeżo dodane do katalogu. Bądź na bieżąco z naszą ofertą!'
            : isUkrainian
            ? 'Найновіші навчальні матеріали, щойно додані до каталогу.'
            : 'The latest teaching materials, freshly added to our catalog. Stay up to date with our offer!',
        all: isPolish ? 'Wszystkie nowości' : isUkrainian ? 'Всі новинки' : 'All new',
        week: isPolish ? 'Ten tydzień' : isUkrainian ? 'Цей тиждень' : 'This week',
        month: isPolish ? 'Ten miesiąc' : isUkrainian ? 'Цей місяць' : 'This month',
        addToCart: isPolish ? 'Dodaj do koszyka' : isUkrainian ? 'Додати до кошика' : 'Add to cart',
        viewAll: isPolish ? 'Zobacz cały katalog' : isUkrainian ? 'Переглянути весь каталог' : 'View full catalog',
        new: isPolish ? 'Nowe' : isUkrainian ? 'Нове' : 'New',
        products: isPolish ? 'produktów' : isUkrainian ? 'продуктів' : 'products',
    };

    // Simulate "new" products: use a deterministic hash to pick ~30 products as "new arrivals"
    const newProducts = useMemo(() => {
        const scored = allProducts.map(p => ({
            ...p,
            newScore: (p.id.charCodeAt(p.id.length - 1) * 7 + p.title.length * 3) % 100,
            rating: 4.0 + ((p.id.charCodeAt(0) % 10) / 10),
            reviews: 1 + (p.id.charCodeAt(1) % 25),
            daysAgo: 1 + ((p.id.charCodeAt(0) + p.id.charCodeAt(p.id.length - 1)) % 30),
        }));
        return scored.sort((a, b) => a.daysAgo - b.daysAgo).slice(0, 30);
    }, [allProducts]);

    const filteredProducts = useMemo(() => {
        if (filter === "week") return newProducts.filter(p => p.daysAgo <= 7);
        if (filter === "month") return newProducts.filter(p => p.daysAgo <= 30);
        return newProducts;
    }, [newProducts, filter]);

    const handleAddToCart = (product: typeof newProducts[0]) => {
        addItem(product);
        toast.success(isPolish ? `"${product.title}" dodano do koszyka!` : `"${product.title}" added to cart!`);
    };

    const formatDaysAgo = (days: number) => {
        if (days === 1) return isPolish ? 'wczoraj' : isUkrainian ? 'вчора' : 'yesterday';
        if (days <= 7) return isPolish ? `${days} dni temu` : isUkrainian ? `${days} днів тому` : `${days} days ago`;
        if (days <= 14) return isPolish ? 'ponad tydzień temu' : isUkrainian ? 'понад тиждень тому' : 'over a week ago';
        return isPolish ? 'w tym miesiącu' : isUkrainian ? 'цього місяця' : 'this month';
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main>
                {/* Hero */}
                <section className="relative overflow-hidden bg-gradient-to-br from-violet-50 via-indigo-50 to-cyan-50 py-16 border-b">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-5 right-20 h-48 w-48 rounded-full bg-violet-400 blur-3xl" />
                        <div className="absolute bottom-5 left-10 h-40 w-40 rounded-full bg-cyan-400 blur-3xl" />
                    </div>
                    <div className="container mx-auto px-4 relative">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-10 w-10 rounded-xl bg-violet-500 flex items-center justify-center">
                                <Sparkles className="h-5 w-5 text-white" />
                            </div>
                            <Badge className="bg-violet-100 text-violet-800 border-violet-200 font-semibold">
                                {isPolish ? 'Świeżo dodane' : isUkrainian ? 'Щойно додано' : 'Freshly added'}
                            </Badge>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-4">
                            {t.title}
                        </h1>
                        <p className="text-lg text-slate-600 max-w-2xl">{t.subtitle}</p>
                        <div className="flex items-center gap-6 mt-6 text-sm text-slate-500">
                            <div className="flex items-center gap-1.5">
                                <Zap className="h-4 w-4 text-violet-500" />
                                <span>{isPolish ? 'Aktualizowane co tydzień' : 'Updated weekly'}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Clock className="h-4 w-4 text-indigo-500" />
                                <span>{filteredProducts.length} {t.products}</span>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="container mx-auto px-4 py-10">
                    {/* Filter tabs */}
                    <div className="flex items-center gap-2 mb-8">
                        {(["all", "week", "month"] as const).map(f => (
                            <Button
                                key={f}
                                variant={filter === f ? "default" : "outline"}
                                size="sm"
                                onClick={() => setFilter(f)}
                                className={cn("rounded-full", filter === f && "bg-violet-600 hover:bg-violet-700 text-white")}
                            >
                                {f === "all" ? t.all : f === "week" ? t.week : t.month}
                            </Button>
                        ))}
                    </div>

                    {/* Products grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {filteredProducts.map((product) => (
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
                                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-violet-50 to-indigo-50">
                                            <span className="text-3xl">📚</span>
                                        </div>
                                    )}
                                    <div className="absolute top-2 left-2 flex gap-1.5">
                                        <Badge className="bg-violet-600 text-white text-xs font-bold border-none shadow-sm">
                                            <Sparkles className="h-2.5 w-2.5 mr-1" />
                                            {t.new}
                                        </Badge>
                                    </div>
                                    <div className="absolute bottom-2 right-2">
                                        <Badge className="bg-white/90 backdrop-blur text-slate-500 text-xs border-none shadow-sm">
                                            <Clock className="h-2.5 w-2.5 mr-1" />
                                            {formatDaysAgo(product.daysAgo)}
                                        </Badge>
                                    </div>
                                </div>
                                <CardContent className="p-4">
                                    <Link href={`/${language}/products/${product.slug}`}>
                                        <h3 className="font-semibold text-sm text-slate-900 mb-2 line-clamp-2 hover:text-violet-600 transition-colors leading-snug">
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
                                        <span className="font-bold text-violet-600">{formatPrice(product.price)}</span>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleAddToCart(product)}
                                            className="h-8 px-3 text-xs rounded-lg border-violet-200 text-violet-600 hover:bg-violet-50 gap-1"
                                        >
                                            <ShoppingCart className="h-3 w-3" />
                                            {isPolish ? 'Dodaj' : 'Add'}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {filteredProducts.length === 0 && (
                        <div className="text-center py-20 text-slate-500">
                            <Sparkles className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                            <p className="text-lg font-medium">
                                {isPolish ? 'Brak produktów w tym zakresie' : 'No products in this range'}
                            </p>
                        </div>
                    )}

                    {/* CTA */}
                    <div className="mt-16 text-center bg-gradient-to-r from-violet-50 to-indigo-50 rounded-3xl p-12 border border-violet-100">
                        <Sparkles className="h-10 w-10 mx-auto mb-4 text-violet-500" />
                        <h3 className="text-2xl font-bold text-slate-900 mb-3">
                            {isPolish ? 'Odkryj cały katalog' : 'Explore the full catalog'}
                        </h3>
                        <p className="text-slate-600 mb-6 max-w-md mx-auto">
                            {isPolish
                                ? 'Ponad 100 materiałów dydaktycznych do nauki języka angielskiego dla każdego poziomu.'
                                : 'Over 100 teaching materials for English language learning at every level.'}
                        </p>
                        <div className="flex gap-3 justify-center flex-wrap">
                            <Link href={`/${language}/products`}>
                                <Button size="lg" className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl px-8">
                                    {t.viewAll}
                                </Button>
                            </Link>
                            <Link href={`/${language}/bestsellery`}>
                                <Button size="lg" variant="outline" className="rounded-xl px-8 border-violet-200 text-violet-700">
                                    {isPolish ? 'Zobacz bestsellery' : 'View bestsellers'}
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}

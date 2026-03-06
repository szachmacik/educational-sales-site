"use client";

import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/components/language-provider";
import { useCart } from "@/lib/cart-context";
import { getProducts } from "@/lib/product-service";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Sparkles, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function NewArrivalsSection() {
    const { language, formatPrice } = useLanguage();
    const { addItem } = useCart();
    const allProducts = getProducts(language);

    const isPolish = language === 'pl';
    const isUkrainian = language === 'uk';

    const newProducts = useMemo(() => {
        return allProducts
            .map(p => ({
                ...p,
                newScore: (p.id.charCodeAt(p.id.length - 1) * 7 + p.title.length * 3) % 100,
            }))
            .sort((a, b) => b.newScore - a.newScore)
            .slice(0, 4);
    }, [allProducts]);

    const handleAddToCart = (product: typeof newProducts[0]) => {
        addItem(product);
        toast.success(isPolish ? `"${product.title}" dodano do koszyka!` : `"${product.title}" added to cart!`);
    };

    if (newProducts.length === 0) return null;

    return (
        <section className="py-16 bg-gradient-to-b from-violet-50/50 to-background">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="h-8 w-8 rounded-lg bg-violet-500 flex items-center justify-center">
                                <Sparkles className="h-4 w-4 text-white" />
                            </div>
                            <Badge className="bg-violet-100 text-violet-700 border-violet-200 text-xs font-semibold">
                                {isPolish ? 'Świeżo dodane' : isUkrainian ? 'Щойно додано' : 'Just added'}
                            </Badge>
                        </div>
                        <h2 className="text-3xl font-serif font-bold text-slate-900">
                            {isPolish ? '✨ Nowości w katalogu' : isUkrainian ? '✨ Новинки в каталозі' : '✨ New in catalog'}
                        </h2>
                        <p className="text-slate-500 mt-1">
                            {isPolish
                                ? 'Najnowsze materiały dydaktyczne, świeżo dodane do oferty'
                                : isUkrainian
                                ? 'Найновіші навчальні матеріали, щойно додані до пропозиції'
                                : 'The latest teaching materials, freshly added to the offer'}
                        </p>
                    </div>
                    <Link href={`/${language}/nowosci`} className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-violet-600 hover:text-violet-700 group">
                        {isPolish ? 'Wszystkie nowości' : isUkrainian ? 'Всі новинки' : 'All new arrivals'}
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* Products grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {newProducts.map((product) => (
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
                                <div className="absolute top-2 left-2">
                                    <Badge className="bg-violet-600 text-white text-xs font-bold border-none shadow-sm">
                                        <Sparkles className="h-2.5 w-2.5 mr-1" />
                                        {isPolish ? 'Nowe' : isUkrainian ? 'Нове' : 'New'}
                                    </Badge>
                                </div>
                            </div>
                            <CardContent className="p-4">
                                <Link href={`/${language}/products/${product.slug}`}>
                                    <h3 className="font-semibold text-sm text-slate-900 mb-3 line-clamp-2 hover:text-violet-600 transition-colors leading-snug">
                                        {product.title}
                                    </h3>
                                </Link>
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

                {/* Mobile CTA */}
                <div className="mt-6 text-center sm:hidden">
                    <Link href={`/${language}/nowosci`}>
                        <Button variant="outline" className="rounded-full border-violet-200 text-violet-600 gap-2">
                            {isPolish ? 'Wszystkie nowości' : 'All new arrivals'}
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}

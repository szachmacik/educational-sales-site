"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, Clock } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { cn } from "@/lib/utils";

interface RecentProduct {
    slug: string;
    title: string;
    price: number;
    image: string;
    category: string;
    viewedAt: number;
}

const STORAGE_KEY = "recently_viewed_products";
const MAX_ITEMS = 6;

export function trackProductView(product: {
    slug: string;
    title: string;
    price: number;
    image: string;
    category: string;
}) {
    if (typeof window === "undefined") return;
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        const items: RecentProduct[] = stored ? JSON.parse(stored) : [];
        // Remove duplicate if exists
        const filtered = items.filter((p) => p.slug !== product.slug);
        // Add to front
        const updated = [{ ...product, viewedAt: Date.now() }, ...filtered].slice(0, MAX_ITEMS);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
        // Ignore storage errors
    }
}

interface RecentlyViewedProductsProps {
    currentSlug?: string;
    className?: string;
}

export function RecentlyViewedProducts({ currentSlug, className }: RecentlyViewedProductsProps) {
    const { language, formatPrice, t } = useLanguage();
    const [products, setProducts] = useState<RecentProduct[]>([]);

    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const items: RecentProduct[] = JSON.parse(stored);
                // Exclude current product if provided
                const filtered = currentSlug
                    ? items.filter((p) => p.slug !== currentSlug)
                    : items;
                setProducts(filtered.slice(0, 4));
            }
        } catch (e) {
            // Ignore
        }
    }, [currentSlug]);

    if (products.length === 0) return null;

    return (
        <section className={cn("py-12 border-t border-slate-100", className)}>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                        <Clock className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">
                            {t?.recentlyViewed?.title || "Ostatnio oglądane"}
                        </h2>
                        <p className="text-sm text-slate-500">
                            {t?.recentlyViewed?.sub || "Produkty, które niedawno przeglądałeś"}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {products.map((product) => (
                        <Link
                            key={product.slug}
                            href={`/${language}/products/${product.slug}`}
                            className="group flex flex-col rounded-xl border border-slate-200 bg-white overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                        >
                            <div className="relative aspect-square bg-slate-100 overflow-hidden">
                                <Image
                                    src={product.image}
                                    alt={product.title}
                                    fill
                                    sizes="(max-width: 768px) 50vw, 25vw"
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                            <div className="p-3 flex flex-col gap-1 flex-1">
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <Star key={s} className="h-3 w-3 fill-amber-400 text-amber-400" />
                                    ))}
                                </div>
                                <h3 className="text-sm font-semibold text-slate-900 line-clamp-2 leading-tight group-hover:text-indigo-600 transition-colors">
                                    {product.title}
                                </h3>
                                <p className="text-sm font-bold text-indigo-600 mt-auto">
                                    {formatPrice(product.price)}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}

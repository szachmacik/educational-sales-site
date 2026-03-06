"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/components/language-provider";
import { getProducts } from "@/lib/product-service";
import { Button } from "@/components/ui/button";
import { Scale, X, BookOpen } from "lucide-react";

export function CompareBar() {
    const { language } = useLanguage();
    const [compareIds, setCompareIds] = useState<string[]>([]);
    const [visible, setVisible] = useState(false);

    // Poll localStorage for changes
    useEffect(() => {
        const check = () => {
            try {
                const stored = JSON.parse(localStorage.getItem("compare_products") || "[]");
                setCompareIds(stored);
                setVisible(stored.length > 0);
            } catch {}
        };
        check();
        const interval = setInterval(check, 500);
        return () => clearInterval(interval);
    }, []);

    const allProducts = getProducts(language);
    const compareProducts = allProducts.filter(p => compareIds.includes(p.slug || p.id));

    const removeFromCompare = (id: string) => {
        const updated = compareIds.filter(i => i !== id);
        setCompareIds(updated);
        localStorage.setItem("compare_products", JSON.stringify(updated));
        if (updated.length === 0) setVisible(false);
    };

    const clearAll = () => {
        setCompareIds([]);
        localStorage.removeItem("compare_products");
        setVisible(false);
    };

    if (!visible || compareIds.length === 0) return null;

    const labels = {
        pl: { compare: "Porównaj produkty", clear: "Wyczyść", count: (n: number) => `${n} ${n === 1 ? 'produkt' : n < 5 ? 'produkty' : 'produktów'}` },
        en: { compare: "Compare products", clear: "Clear all", count: (n: number) => `${n} ${n === 1 ? 'product' : 'products'}` },
        uk: { compare: "Порівняти продукти", clear: "Очистити", count: (n: number) => `${n} ${n === 1 ? 'продукт' : 'продукти'}` },
    };
    const lbl = (labels as any)[language] || labels.pl;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 shadow-2xl shadow-black/20 animate-in slide-in-from-bottom-4 duration-300">
            <div className="container mx-auto px-4 py-3">
                <div className="flex items-center gap-4 flex-wrap">
                    {/* Icon + count */}
                    <div className="flex items-center gap-2 shrink-0">
                        <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center">
                            <Scale className="h-4 w-4 text-violet-600" />
                        </div>
                        <span className="text-sm font-semibold text-slate-700">
                            {lbl.count(compareIds.length)}
                        </span>
                    </div>

                    {/* Product thumbnails */}
                    <div className="flex items-center gap-2 flex-1 min-w-0 overflow-x-auto">
                        {compareProducts.map(product => (
                            <div key={product.slug || product.id} className="relative shrink-0 group">
                                <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
                                    {product.image ? (
                                        <Image src={product.image} alt={product.title} width={48} height={48} className="object-cover w-full h-full" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <BookOpen className="h-5 w-5 text-slate-300" />
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={() => removeFromCompare(product.slug || product.id)}
                                    className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                >
                                    <X className="h-2.5 w-2.5" />
                                </button>
                                <p className="text-[9px] text-center text-slate-600 mt-0.5 w-12 truncate">{product.title}</p>
                            </div>
                        ))}
                        {/* Empty slots */}
                        {Array.from({ length: Math.max(0, 4 - compareProducts.length) }).map((_, i) => (
                            <div key={`empty-${i}`} className="w-12 h-12 rounded-lg border-2 border-dashed border-slate-200 bg-slate-50/50 flex items-center justify-center shrink-0">
                                <span className="text-slate-300 text-lg">+</span>
                            </div>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground hover:text-foreground text-xs"
                            onClick={clearAll}
                        >
                            <X className="h-3.5 w-3.5 mr-1" />
                            {lbl.clear}
                        </Button>
                        <Button
                            asChild
                            size="sm"
                            className="bg-violet-600 hover:bg-violet-700 text-white shadow-md"
                        >
                            <Link href={`/${language}/porownaj`}>
                                <Scale className="h-4 w-4 mr-2" />
                                {lbl.compare}
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage, LanguageProvider } from "@/components/language-provider";
import { useCart } from "@/lib/cart-context";
import { getProducts } from "@/lib/product-service";
import { translations } from "@/lib/translations";
import { deepMerge } from "@/lib/utils";
import {
    Check, X, ShoppingCart, Trash2, Plus, BookOpen,
    Star, ArrowLeft, Scale
} from "lucide-react";
import { toast } from "sonner";

export function ComparePageClient({ lang }: { lang: string }) {
    const { language, formatPrice } = useLanguage();
    const { addItem } = useCart();
    const [compareIds, setCompareIds] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [showSearch, setShowSearch] = useState(false);

    const allProducts = getProducts(language);

    useEffect(() => {
        try {
            const stored = localStorage.getItem("compare_products");
            if (stored) setCompareIds(JSON.parse(stored));
        } catch {}
    }, []);

    const compareProducts = allProducts.filter(p => compareIds.includes(p.id));

    const removeFromCompare = (id: string) => {
        const updated = compareIds.filter(i => i !== id);
        setCompareIds(updated);
        localStorage.setItem("compare_products", JSON.stringify(updated));
    };

    const addToCompare = (id: string) => {
        if (compareIds.length >= 4) {
            toast.error(language === 'pl' ? 'Możesz porównać maksymalnie 4 produkty' : 'Maximum 4 products to compare');
            return;
        }
        if (compareIds.includes(id)) {
            toast.info(language === 'pl' ? 'Ten produkt jest już na liście porównania' : 'Product already in comparison');
            return;
        }
        const updated = [...compareIds, id];
        setCompareIds(updated);
        localStorage.setItem("compare_products", JSON.stringify(updated));
        setShowSearch(false);
        setSearchQuery("");
    };

    useEffect(() => {
        if (searchQuery.length < 2) { setSearchResults([]); return; }
        const q = searchQuery.toLowerCase();
        setSearchResults(
            allProducts
                .filter(p => !compareIds.includes(p.id) && (p.title.toLowerCase().includes(q) || p.categories?.some(c => c.toLowerCase().includes(q))))
                .slice(0, 6)
        );
    }, [searchQuery, compareIds]);

    const labels = {
        pl: {
            title: "Porównaj produkty",
            subtitle: "Zestawienie cech i właściwości",
            addProduct: "Dodaj produkt do porównania",
            removeAll: "Wyczyść porównanie",
            addToCart: "Dodaj do koszyka",
            viewProduct: "Zobacz produkt",
            empty: "Brak produktów do porównania",
            emptyDesc: "Dodaj produkty, aby je porównać",
            browse: "Przeglądaj sklep",
            features: {
                price: "Cena",
                category: "Kategoria",
                level: "Poziom",
                pages: "Liczba stron",
                format: "Format",
                language: "Język",
                rating: "Ocena",
                ageGroup: "Grupa wiekowa",
                status: "Dostępność",
            }
        },
        en: {
            title: "Compare products",
            subtitle: "Feature comparison",
            addProduct: "Add product to compare",
            removeAll: "Clear comparison",
            addToCart: "Add to cart",
            viewProduct: "View product",
            empty: "No products to compare",
            emptyDesc: "Add products to start comparing",
            browse: "Browse shop",
            features: {
                price: "Price",
                category: "Category",
                level: "Level",
                pages: "Pages",
                format: "Format",
                language: "Language",
                rating: "Rating",
                ageGroup: "Age group",
                status: "Availability",
            }
        },
        uk: {
            title: "Порівняти продукти",
            subtitle: "Порівняння характеристик",
            addProduct: "Додати продукт для порівняння",
            removeAll: "Очистити порівняння",
            addToCart: "Додати до кошика",
            viewProduct: "Переглянути продукт",
            empty: "Немає продуктів для порівняння",
            emptyDesc: "Додайте продукти для порівняння",
            browse: "Переглянути магазин",
            features: {
                price: "Ціна",
                category: "Категорія",
                level: "Рівень",
                pages: "Кількість сторінок",
                format: "Формат",
                language: "Мова",
                rating: "Оцінка",
                ageGroup: "Вікова група",
                status: "Наявність",
            }
        }
    };

    const lbl = (labels as any)[language] || labels.pl;

    const featureRows = [
        { key: "price", label: lbl.features.price, render: (p: any) => <span className="font-bold text-violet-600 text-lg">{formatPrice(p.salePrice ?? p.price)}</span> },
        { key: "category", label: lbl.features.category, render: (p: any) => <Badge variant="outline">{p.categories?.[0] || "—"}</Badge> },
        { key: "level", label: lbl.features.level, render: (p: any) => p.level || "—" },
        { key: "pages", label: lbl.features.pages, render: (p: any) => p.pages ? `${p.pages} str.` : "—" },
        { key: "format", label: lbl.features.format, render: (p: any) => p.format || "PDF" },
        { key: "ageGroup", label: lbl.features.ageGroup, render: (p: any) => p.ageGroup || "—" },
        { key: "rating", label: lbl.features.rating, render: (p: any) => (
            <div className="flex items-center gap-1">
                {[1,2,3,4,5].map(s => <Star key={s} className={`h-3.5 w-3.5 ${s <= (p.rating || 5) ? 'fill-amber-400 text-amber-400' : 'text-slate-200 fill-slate-200'}`} />)}
                <span className="text-xs text-muted-foreground ml-1">{p.rating || 5.0}</span>
            </div>
        )},
        { key: "status", label: lbl.features.status, render: (p: any) => (
            <span className={`inline-flex items-center gap-1 text-xs font-medium ${p.status === 'published' ? 'text-green-600' : 'text-red-500'}`}>
                {p.status === 'published' ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                {p.status === 'published' ? (language === 'pl' ? 'Dostępny' : 'Available') : (language === 'pl' ? 'Niedostępny' : 'Unavailable')}
            </span>
        )},
    ];

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Header />
            <main className="flex-1 py-10">
                <div className="container mx-auto px-4">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                        <Link href={`/${language}`} className="hover:text-foreground transition-colors">{language === 'pl' ? 'Strona główna' : 'Home'}</Link>
                        <span>/</span>
                        <Link href={`/${language}/products`} className="hover:text-foreground transition-colors">{language === 'pl' ? 'Sklep' : 'Shop'}</Link>
                        <span>/</span>
                        <span className="text-foreground font-medium">{lbl.title}</span>
                    </nav>

                    {/* Header */}
                    <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
                                <Scale className="h-5 w-5 text-violet-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-serif font-bold text-slate-900">{lbl.title}</h1>
                                <p className="text-sm text-muted-foreground">{lbl.subtitle}</p>
                            </div>
                        </div>
                        {compareProducts.length > 0 && (
                            <Button variant="outline" size="sm" onClick={() => { setCompareIds([]); localStorage.removeItem("compare_products"); }}>
                                <Trash2 className="h-4 w-4 mr-2" />
                                {lbl.removeAll}
                            </Button>
                        )}
                    </div>

                    {compareProducts.length === 0 ? (
                        <div className="text-center py-24">
                            <div className="w-20 h-20 rounded-full bg-violet-50 mx-auto flex items-center justify-center mb-6">
                                <Scale className="h-10 w-10 text-violet-300" />
                            </div>
                            <h2 className="text-2xl font-bold mb-3 text-slate-800">{lbl.empty}</h2>
                            <p className="text-muted-foreground mb-8">{lbl.emptyDesc}</p>
                            <Button asChild>
                                <Link href={`/${language}/products`}>
                                    <BookOpen className="h-4 w-4 mr-2" />
                                    {lbl.browse}
                                </Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                {/* Product headers */}
                                <thead>
                                    <tr>
                                        <th className="w-40 text-left p-3 text-sm font-semibold text-muted-foreground bg-white border border-slate-200 rounded-tl-xl sticky left-0 z-10">
                                            {language === 'pl' ? 'Cecha' : 'Feature'}
                                        </th>
                                        {compareProducts.map(product => (
                                            <th key={product.id} className="min-w-[200px] p-3 bg-white border border-slate-200 align-top">
                                                <div className="flex flex-col items-center gap-2">
                                                    <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-slate-50">
                                                        {product.image ? (
                                                            <Image src={product.image} alt={product.title} fill className="object-cover" />
                                                        ) : (
                                                            <div className="absolute inset-0 flex items-center justify-center"><BookOpen className="h-8 w-8 text-slate-300" /></div>
                                                        )}
                                                    </div>
                                                    <p className="text-xs font-bold text-slate-800 text-center line-clamp-2">{product.title}</p>
                                                    <div className="flex gap-1 w-full">
                                                        <Button size="sm" className="flex-1 h-7 text-xs" onClick={() => {
                                                            addItem(product);
                                                            toast.success(language === 'pl' ? 'Dodano do koszyka' : 'Added to cart');
                                                        }}>
                                                            <ShoppingCart className="h-3 w-3 mr-1" />
                                                            {lbl.addToCart}
                                                        </Button>
                                                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-red-400 hover:text-red-600 hover:bg-red-50" onClick={() => removeFromCompare(product.id)}>
                                                            <X className="h-3.5 w-3.5" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </th>
                                        ))}
                                        {compareProducts.length < 4 && (
                                            <th className="min-w-[180px] p-3 bg-slate-50/50 border border-dashed border-slate-300 align-middle">
                                                <div className="flex flex-col items-center gap-3">
                                                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                                                        <Plus className="h-6 w-6 text-slate-400" />
                                                    </div>
                                                    <div className="relative w-full">
                                                        <input
                                                            type="text"
                                                            value={searchQuery}
                                                            onChange={e => { setSearchQuery(e.target.value); setShowSearch(true); }}
                                                            onFocus={() => setShowSearch(true)}
                                                            placeholder={language === 'pl' ? 'Szukaj produktu...' : 'Search product...'}
                                                            className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-300"
                                                        />
                                                        {showSearch && searchResults.length > 0 && (
                                                            <div className="absolute top-full left-0 right-0 bg-white border border-slate-200 rounded-lg shadow-lg z-20 mt-1 max-h-48 overflow-y-auto">
                                                                {searchResults.map(p => (
                                                                    <button key={p.id} onClick={() => addToCompare(p.id)} className="w-full text-left px-3 py-2 text-xs hover:bg-violet-50 flex items-center gap-2 transition-colors">
                                                                        <BookOpen className="h-3.5 w-3.5 text-violet-400 shrink-0" />
                                                                        <span className="line-clamp-1">{p.title}</span>
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </th>
                                        )}
                                    </tr>
                                </thead>
                                {/* Feature rows */}
                                <tbody>
                                    {featureRows.map((row, idx) => (
                                        <tr key={row.key} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}>
                                            <td className="p-3 text-sm font-semibold text-slate-700 border border-slate-200 sticky left-0 z-10" style={{ background: idx % 2 === 0 ? 'white' : 'rgb(248 250 252 / 0.6)' }}>
                                                {row.label}
                                            </td>
                                            {compareProducts.map(product => (
                                                <td key={product.id} className="p-3 text-sm text-center border border-slate-200">
                                                    {row.render(product)}
                                                </td>
                                            ))}
                                            {compareProducts.length < 4 && <td className="border border-dashed border-slate-200 bg-slate-50/30" />}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Suggested products to compare */}
                    {compareProducts.length > 0 && compareProducts.length < 4 && (
                        <div className="mt-12">
                            <h3 className="text-lg font-bold text-slate-800 mb-4">
                                {language === 'pl' ? 'Sugerowane produkty do porównania' : 'Suggested products to compare'}
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {allProducts
                                    .filter(p => !compareIds.includes(p.id))
                                    .filter(p => compareProducts.some(cp => cp.categories?.[0] === p.categories?.[0]))
                                    .slice(0, 4)
                                    .map(product => (
                                        <Card key={product.id} className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer" onClick={() => addToCompare(product.id)}>
                                            <div className="relative aspect-[4/3] bg-slate-50">
                                                {product.image ? (
                                                    <Image src={product.image} alt={product.title} fill className="object-cover" />
                                                ) : (
                                                    <div className="absolute inset-0 flex items-center justify-center"><BookOpen className="h-6 w-6 text-slate-300" /></div>
                                                )}
                                                <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                                                    <div className="bg-white rounded-full px-3 py-1.5 text-xs font-bold text-violet-600 flex items-center gap-1">
                                                        <Plus className="h-3 w-3" />
                                                        {language === 'pl' ? 'Dodaj do porównania' : 'Add to compare'}
                                                    </div>
                                                </div>
                                            </div>
                                            <CardContent className="p-3">
                                                <p className="text-xs font-semibold line-clamp-2 text-slate-800">{product.title}</p>
                                                <p className="text-sm font-bold text-violet-600 mt-1">{formatPrice(product.price)}</p>
                                            </CardContent>
                                        </Card>
                                    ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}

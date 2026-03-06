"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { LanguageProvider, useLanguage } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getProducts } from "@/lib/product-service";
import { useCart } from "@/lib/cart-context";
import {
    Package,
    ShoppingCart,
    Star,
    ArrowRight,
    CheckCircle2,
    Zap,
    Gift,
    Percent,
    BookOpen,
    Sparkles,
    ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

function PakietyContent() {
    const { language } = useLanguage();
    const { addItem } = useCart();
    const allProducts = getProducts(language);

    const labels = {
        pl: {
            title: "Pakiety i zestawy",
            subtitle: "Oszczędzaj więcej kupując zestawy — idealne dla nauczycieli planujących cały rok szkolny",
            breadcrumb: "Strona główna",
            home: "Strona główna",
            shop: "Sklep",
            megaPacks: "Mega Paki",
            megaPacksDesc: "Kompleksowe zestawy na cały rok szkolny",
            valuePacks: "Zestawy tematyczne",
            valuePacksDesc: "Grupy produktów z jednej kategorii",
            whyBuy: "Dlaczego warto kupić pakiet?",
            benefit1: "Oszczędzasz nawet 40% w porównaniu do zakupu osobnych produktów",
            benefit2: "Wszystkie materiały spójne tematycznie i wizualnie",
            benefit3: "Gotowe na cały rok — nie musisz szukać materiałów co miesiąc",
            benefit4: "Idealne dla nauczycieli pracujących z jedną grupą wiekową",
            addToCart: "Dodaj do koszyka",
            viewProduct: "Szczegóły",
            save: "Oszczędzasz",
            items: "materiałów",
            featured: "Polecany",
            bestseller: "Bestseller",
            new: "Nowość",
            noProducts: "Brak produktów w tej kategorii",
            ctaTitle: "Nie znalazłeś odpowiedniego pakietu?",
            ctaDesc: "Sprawdź nasz pełny katalog lub skontaktuj się z nami — stworzymy pakiet dopasowany do Twoich potrzeb.",
            ctaButton: "Przejdź do katalogu",
            ctaContact: "Napisz do nas",
        },
        en: {
            title: "Bundles & Value Packs",
            subtitle: "Save more by buying bundles — perfect for teachers planning the whole school year",
            breadcrumb: "Home",
            home: "Home",
            shop: "Shop",
            megaPacks: "Mega Packs",
            megaPacksDesc: "Comprehensive sets for the whole school year",
            valuePacks: "Themed Bundles",
            valuePacksDesc: "Groups of products from one category",
            whyBuy: "Why buy a bundle?",
            benefit1: "Save up to 40% compared to buying individual products",
            benefit2: "All materials are thematically and visually consistent",
            benefit3: "Ready for the whole year — no need to search for materials every month",
            benefit4: "Perfect for teachers working with one age group",
            addToCart: "Add to cart",
            viewProduct: "Details",
            save: "You save",
            items: "materials",
            featured: "Featured",
            bestseller: "Bestseller",
            new: "New",
            noProducts: "No products in this category",
            ctaTitle: "Didn't find the right bundle?",
            ctaDesc: "Check our full catalog or contact us — we'll create a bundle tailored to your needs.",
            ctaButton: "Go to catalog",
            ctaContact: "Contact us",
        },
        uk: {
            title: "Пакети та набори",
            subtitle: "Економте більше, купуючи набори — ідеально для вчителів, що планують весь навчальний рік",
            breadcrumb: "Головна",
            home: "Головна",
            shop: "Магазин",
            megaPacks: "Мега-пакети",
            megaPacksDesc: "Комплексні набори на весь навчальний рік",
            valuePacks: "Тематичні набори",
            valuePacksDesc: "Групи продуктів з однієї категорії",
            whyBuy: "Чому варто купити пакет?",
            benefit1: "Економте до 40% порівняно з купівлею окремих продуктів",
            benefit2: "Всі матеріали тематично та візуально узгоджені",
            benefit3: "Готово на весь рік — не потрібно шукати матеріали щомісяця",
            benefit4: "Ідеально для вчителів, що працюють з однією віковою групою",
            addToCart: "Додати до кошика",
            viewProduct: "Деталі",
            save: "Ви економите",
            items: "матеріалів",
            featured: "Рекомендовано",
            bestseller: "Бестселер",
            new: "Новинка",
            noProducts: "Немає продуктів у цій категорії",
            ctaTitle: "Не знайшли потрібний пакет?",
            ctaDesc: "Перегляньте наш повний каталог або зв'яжіться з нами — ми створимо пакет під ваші потреби.",
            ctaButton: "До каталогу",
            ctaContact: "Написати нам",
        },
    };

    const lbl = (labels as any)[language] || labels.pl;

    // Get mega-pack products
    const megaPacks = useMemo(() =>
        allProducts.filter(p => p.categories?.includes("mega-pack")).slice(0, 6),
        [allProducts]
    );

    // Create curated bundles from existing products (grouped by age level)
    const bundles = useMemo(() => {
        const zlobek = allProducts.filter(p => p.categories?.includes("zlobek")).slice(0, 4);
        const przedszkole = allProducts.filter(p => p.categories?.includes("przedszkole")).slice(0, 4);
        const klasy13 = allProducts.filter(p => p.categories?.includes("klasy-1-3")).slice(0, 4);
        const klasy46 = allProducts.filter(p => p.categories?.includes("klasy-4-6")).slice(0, 4);

        return [
            {
                id: "bundle-zlobek",
                title: language === 'pl' ? "Pakiet Żłobek — Starter" : language === 'uk' ? "Пакет Ясла — Стартер" : "Nursery Bundle — Starter",
                description: language === 'pl' ? "Komplet materiałów do nauki angielskiego dla najmłodszych" : language === 'uk' ? "Комплект матеріалів для навчання англійської для найменших" : "Complete English learning materials for the youngest",
                products: zlobek,
                originalPrice: zlobek.reduce((s, p) => s + (p.price || 0), 0),
                discountPercent: 20,
                color: "from-blue-400 to-indigo-500",
                bgColor: "from-blue-50 to-indigo-50",
                badge: lbl.featured,
                badgeColor: "bg-blue-100 text-blue-700",
            },
            {
                id: "bundle-przedszkole",
                title: language === 'pl' ? "Pakiet Przedszkole — Roczny" : language === 'uk' ? "Пакет Дитячий садок — Річний" : "Preschool Bundle — Annual",
                description: language === 'pl' ? "Materiały na cały rok szkolny dla przedszkolaków" : language === 'uk' ? "Матеріали на весь навчальний рік для дошкільнят" : "Full school year materials for preschoolers",
                products: przedszkole,
                originalPrice: przedszkole.reduce((s, p) => s + (p.price || 0), 0),
                discountPercent: 25,
                color: "from-orange-400 to-red-500",
                bgColor: "from-orange-50 to-red-50",
                badge: lbl.bestseller,
                badgeColor: "bg-orange-100 text-orange-700",
            },
            {
                id: "bundle-klasy13",
                title: language === 'pl' ? "Pakiet Klasy 1–3 — Kompleksowy" : language === 'uk' ? "Пакет Класи 1–3 — Комплексний" : "Grades 1–3 Bundle — Comprehensive",
                description: language === 'pl' ? "Scenariusze i ćwiczenia dla klas 1–3 szkoły podstawowej" : language === 'uk' ? "Сценарії та вправи для 1–3 класів початкової школи" : "Lesson plans and exercises for grades 1–3",
                products: klasy13,
                originalPrice: klasy13.reduce((s, p) => s + (p.price || 0), 0),
                discountPercent: 20,
                color: "from-green-400 to-emerald-500",
                bgColor: "from-green-50 to-emerald-50",
                badge: lbl.new,
                badgeColor: "bg-green-100 text-green-700",
            },
            {
                id: "bundle-klasy46",
                title: language === 'pl' ? "Pakiet Klasy 4–6 — Zaawansowany" : language === 'uk' ? "Пакет Класи 4–6 — Просунутий" : "Grades 4–6 Bundle — Advanced",
                description: language === 'pl' ? "Rozbudowane materiały dla starszych uczniów szkoły podstawowej" : language === 'uk' ? "Розширені матеріали для старших учнів початкової школи" : "Advanced materials for older primary school students",
                products: klasy46,
                originalPrice: klasy46.reduce((s, p) => s + (p.price || 0), 0),
                discountPercent: 20,
                color: "from-purple-400 to-violet-500",
                bgColor: "from-purple-50 to-violet-50",
                badge: lbl.featured,
                badgeColor: "bg-purple-100 text-purple-700",
            },
        ].filter(b => b.products.length > 0);
    }, [allProducts, language]);

    const handleAddToCart = (product: any) => {
        addItem(product);
        toast.success(language === 'pl' ? `"${product.title}" dodano do koszyka` : language === 'uk' ? `"${product.title}" додано до кошика` : `"${product.title}" added to cart`);
    };

    const benefits = [lbl.benefit1, lbl.benefit2, lbl.benefit3, lbl.benefit4];

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main>
                {/* Hero */}
                <section className="bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 border-b">
                    <div className="container py-16">
                        {/* Breadcrumb */}
                        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
                            <Link href={`/${language}`} className="hover:text-foreground transition-colors">{lbl.home}</Link>
                            <ChevronRight className="h-4 w-4" />
                            <span className="text-foreground font-medium">{lbl.title}</span>
                        </nav>

                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-200">
                                        <Gift className="h-6 w-6 text-white" />
                                    </div>
                                    <Badge className="bg-violet-100 text-violet-700 border-none">
                                        <Percent className="h-3 w-3 mr-1" />
                                        {language === 'pl' ? 'Oszczędzaj do 40%' : language === 'uk' ? 'Економте до 40%' : 'Save up to 40%'}
                                    </Badge>
                                </div>
                                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">
                                    {lbl.title}
                                </h1>
                                <p className="text-lg text-muted-foreground max-w-2xl">
                                    {lbl.subtitle}
                                </p>
                            </div>
                        </div>

                        {/* Benefits */}
                        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {benefits.map((benefit, i) => (
                                <div key={i} className="flex items-start gap-3 bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/50 shadow-sm">
                                    <CheckCircle2 className="h-5 w-5 text-violet-600 shrink-0 mt-0.5" />
                                    <p className="text-sm text-slate-700">{benefit}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Mega Packs */}
                {megaPacks.length > 0 && (
                    <section className="py-16 border-b">
                        <div className="container">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Sparkles className="h-5 w-5 text-amber-500" />
                                        <h2 className="text-2xl font-bold">{lbl.megaPacks}</h2>
                                    </div>
                                    <p className="text-muted-foreground">{lbl.megaPacksDesc}</p>
                                </div>
                                <Link href={`/${language}/products?category=mega-pack`}>
                                    <Button variant="outline" className="gap-2 hidden sm:flex">
                                        {language === 'pl' ? 'Zobacz wszystkie' : language === 'uk' ? 'Переглянути всі' : 'View all'}
                                        <ArrowRight className="h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {megaPacks.map((product) => {
                                    const slug = product.slug || product.id;
                                    return (
                                        <Card key={product.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-2 border-amber-100 hover:border-amber-200">
                                            <div className="relative aspect-[4/3] bg-gradient-to-br from-amber-50 to-orange-50 overflow-hidden">
                                                {product.image ? (
                                                    <Image
                                                        src={product.image}
                                                        alt={product.title}
                                                        fill
                                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Package className="h-16 w-16 text-amber-300" />
                                                    </div>
                                                )}
                                                <div className="absolute top-3 left-3">
                                                    <Badge className="bg-amber-500 text-white border-none shadow-sm">
                                                        <Zap className="h-3 w-3 mr-1" />
                                                        MEGA PACK
                                                    </Badge>
                                                </div>
                                            </div>
                                            <CardContent className="p-5">
                                                <h3 className="font-bold text-base leading-tight mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                                                    {product.title}
                                                </h3>
                                                {product.description && (
                                                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                                                        {product.description}
                                                    </p>
                                                )}
                                                <div className="flex items-center justify-between mt-auto">
                                                    <div>
                                                        <span className="text-2xl font-black text-slate-900">
                                                            {product.price?.toFixed(2)} PLN
                                                        </span>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            asChild
                                                        >
                                                            <Link href={`/${language}/products/${slug}`}>
                                                                {lbl.viewProduct}
                                                            </Link>
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            onClick={() => handleAddToCart(product)}
                                                            className="gap-1"
                                                        >
                                                            <ShoppingCart className="h-3.5 w-3.5" />
                                                            {lbl.addToCart}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        </div>
                    </section>
                )}

                {/* Curated Bundles */}
                <section className="py-16 bg-slate-50">
                    <div className="container">
                        <div className="mb-10">
                            <div className="flex items-center gap-2 mb-2">
                                <Package className="h-5 w-5 text-violet-600" />
                                <h2 className="text-2xl font-bold">{lbl.valuePacks}</h2>
                            </div>
                            <p className="text-muted-foreground">{lbl.valuePacksDesc}</p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {bundles.map((bundle) => {
                                const discountedPrice = bundle.originalPrice * (1 - bundle.discountPercent / 100);
                                const savings = bundle.originalPrice - discountedPrice;

                                return (
                                    <div
                                        key={bundle.id}
                                        className={cn(
                                            "rounded-2xl border-2 overflow-hidden bg-gradient-to-br",
                                            bundle.bgColor,
                                            "hover:shadow-xl transition-all duration-300"
                                        )}
                                    >
                                        {/* Bundle Header */}
                                        <div className={cn("p-6 bg-gradient-to-r", bundle.color, "text-white")}>
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <Badge className={cn("mb-3 border-none", bundle.badgeColor)}>
                                                        {bundle.badge}
                                                    </Badge>
                                                    <h3 className="text-xl font-bold mb-1">{bundle.title}</h3>
                                                    <p className="text-white/80 text-sm">{bundle.description}</p>
                                                </div>
                                                <div className="text-right shrink-0 ml-4">
                                                    <div className="text-white/70 text-sm line-through">
                                                        {bundle.originalPrice.toFixed(2)} PLN
                                                    </div>
                                                    <div className="text-2xl font-black">
                                                        {discountedPrice.toFixed(2)} PLN
                                                    </div>
                                                    <Badge className="bg-white/20 text-white border-white/30 mt-1">
                                                        -{bundle.discountPercent}%
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Products in bundle */}
                                        <div className="p-6">
                                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                                                {language === 'pl' ? 'Zawiera:' : language === 'uk' ? 'Містить:' : 'Includes:'}
                                            </p>
                                            <div className="space-y-2 mb-5">
                                                {bundle.products.map((p) => (
                                                    <div key={p.id} className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-lg bg-white/80 border border-white/50 overflow-hidden shrink-0">
                                                            {p.image ? (
                                                                <Image src={p.image} alt={p.title} width={32} height={32} className="object-cover w-full h-full" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center">
                                                                    <BookOpen className="h-4 w-4 text-slate-400" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <span className="text-sm text-slate-700 line-clamp-1 flex-1">{p.title}</span>
                                                        <span className="text-xs text-muted-foreground shrink-0">{p.price?.toFixed(2)} PLN</span>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="flex items-center justify-between pt-4 border-t border-white/50">
                                                <div className="text-sm text-muted-foreground">
                                                    <span className="font-semibold text-green-700">
                                                        {lbl.save}: {savings.toFixed(2)} PLN
                                                    </span>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="bg-white/80 hover:bg-white"
                                                        asChild
                                                    >
                                                        <Link href={`/${language}/products?category=${bundle.id.replace('bundle-', '')}`}>
                                                            {lbl.viewProduct}
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        className="gap-1"
                                                        onClick={() => {
                                                            bundle.products.forEach(p => addItem(p));
                                                            toast.success(
                                                                language === 'pl' ? `Pakiet "${bundle.title}" dodano do koszyka` :
                                                                language === 'uk' ? `Пакет "${bundle.title}" додано до кошика` :
                                                                `Bundle "${bundle.title}" added to cart`
                                                            );
                                                        }}
                                                    >
                                                        <ShoppingCart className="h-3.5 w-3.5" />
                                                        {lbl.addToCart}
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-16">
                    <div className="container">
                        <div className="rounded-3xl bg-gradient-to-br from-violet-600 to-purple-700 p-10 text-white text-center">
                            <Gift className="h-12 w-12 mx-auto mb-4 opacity-80" />
                            <h2 className="text-3xl font-bold mb-3">{lbl.ctaTitle}</h2>
                            <p className="text-white/80 max-w-xl mx-auto mb-8">{lbl.ctaDesc}</p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button size="lg" variant="secondary" asChild>
                                    <Link href={`/${language}/products`}>
                                        {lbl.ctaButton}
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10" asChild>
                                    <Link href={`/${language}/contact`}>
                                        {lbl.ctaContact}
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}

export default function PakietyPage() {
    const params = useParams();
    const lang = (params?.lang as string) || "pl";
    return (
        <LanguageProvider lang={lang}>
            <PakietyContent />
        </LanguageProvider>
    );
}

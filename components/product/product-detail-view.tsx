"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import {
    ChevronLeft, Star, ShoppingCart, Check, ShieldCheck,
    ArrowRight, Share2, Heart, Award, Clock, BookOpen,
    MessageCircle, Sparkles, AlertCircle, ArrowLeft, Play,
    CheckCircle2, Zap
} from "lucide-react";
import { getProductBySlug, getRelatedProducts, ProductWithSlug } from "@/lib/product-service";
import { CATEGORY_COLORS } from "@/lib/product-catalog";
import { ProductFeatures } from "@/components/product/product-features";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useLanguage } from "@/components/language-provider";
import { notFound } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/lib/cart-context";
import { useState, useEffect } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
// Globe import removed as it was moved above
import { Language } from "@/lib/translations";
import { cn } from "@/lib/utils";
import { formatPrice as formatPriceUtil } from "@/lib/currency";
import { TrustBadgeBar } from "@/components/marketing/growth-tools";
import { PromoTimer } from "@/components/marketing/premium-growth";
import { useTokens } from "@/lib/token-context";

const ALL_LANGUAGES: Language[] = ['pl', 'en', 'uk', 'de', 'es', 'fr', 'it', 'cs', 'sk', 'ro', 'hu', 'pt', 'lt', 'lv', 'et', 'hr', 'sr', 'sl', 'bg', 'el'];

// CATEGORY_NAMES removed, utilizing t.products.productCategories instead

interface ProductDetailViewProps {
    slug: string;
}

export function ProductDetailView({ slug }: ProductDetailViewProps) {
    const { toast } = useToast();
    const { addItem } = useCart();
    const { t, language } = useLanguage();
    const { role, isAdmin, isLoading: loadingAuth } = useTokens();
    const [selectedVariant, setSelectedVariant] = useState(language);
    const [showPlayer, setShowPlayer] = useState(false);

    // Fetch product dynamically based on selected variant
    const product = getProductBySlug(slug, selectedVariant);

    useEffect(() => {
        if (language) {
            setSelectedVariant(language);
        }
    }, [language]);

    if (!product) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold">{t?.products?.notFound || "Produkt nie znaleziony"}</h1>
                <Link href={`/${language}/products`}>
                    <Button onClick={() => toast.success(t?.common?.success || "Akcja wykonana pomyślnie.")} className="mt-4">{t?.products?.backToStore || "Wróć do sklepu"}</Button>
                </Link>
            </div>
        );
    }

    const availableLanguages = ALL_LANGUAGES;
    const relatedProducts = getRelatedProducts(product.categories[0], slug, 4, language);

    // Helper for category name translation (fallback to hardcoded map logic or extend translations)
    // Helper for category name translation
    const primaryCategory = product.categories[0];
    // @ts-ignore
    const categoryName = (t.products?.productCategories as any)?.[primaryCategory] || t.categories?.items?.[primaryCategory]?.title || primaryCategory;



    // ...

    const handleAddToCart = () => {
        addItem({
            id: product.slug,
            title: product.title,
            price: product.price,
            salePrice: undefined,
            images: [product.image || ''],
            description: product.description,
            category: product.categories[0],
            slug: product.slug,
            tags: product.categories,
            status: 'published',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }, selectedVariant);

        toast({
            title: t.products.toastAdded,
            description: `${product.title} (${selectedVariant.toUpperCase()})`,
        });
    };

    const handleShare = () => {
        if (typeof window === 'undefined') return;
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            toast({
                title: t.products.toastCopied,
                description: t.products.toastCopiedDesc,
            });
        });
    };

    const [isStickyVisible, setIsStickyVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 400) {
                setIsStickyVisible(true);
            } else {
                setIsStickyVisible(false);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-slate-50/50 pb-20 relative">
            <Header />

            <main className="flex-1">
                <div className="container mx-auto px-4 py-8">
                    {/* Elite SEO: Product JSON-LD */}
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{
                            __html: JSON.stringify({
                                "@context": "https://schema.org",
                                "@type": "Product",
                                "name": product.title,
                                "image": [product.image || 'https://educational-sales-site.com/product-placeholder.png'],
                                "description": product.description,
                                "sku": product.slug,
                                "brand": {
                                    "@type": "Brand",
                                    "name": "English for Teachers"
                                },
                                "offers": {
                                    "@type": "Offer",
                                    "url": typeof window !== 'undefined' ? window.location.href : '',
                                    "priceCurrency": "PLN",
                                    "price": product.price,
                                    "availability": "https://schema.org/InStock"
                                }
                            })
                        }}
                    />

                    {/* Elite SEO: Breadcrumbs JSON-LD */}
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{
                            __html: JSON.stringify({
                                "@context": "https://schema.org",
                                "@type": "BreadcrumbList",
                                "itemListElement": [
                                    {
                                        "@type": "ListItem",
                                        "position": 1,
                                        "name": t.nav?.home || "Home",
                                        "item": typeof window !== 'undefined' ? `${window.location.origin}/${language}` : `/${language}`
                                    },
                                    {
                                        "@type": "ListItem",
                                        "position": 2,
                                        "name": t.nav?.products || "Shop",
                                        "item": typeof window !== 'undefined' ? `${window.location.origin}/${language}/shop` : `/${language}/shop`
                                    },
                                    {
                                        "@type": "ListItem",
                                        "position": 3,
                                        "name": product.title,
                                        "item": typeof window !== 'undefined' ? window.location.href : ''
                                    }
                                ]
                            })
                        }}
                    />

                    {/* Breadcrumbs / Back */}
                    <nav className="flex mb-8" aria-label="Breadcrumb">
                        <ol className="flex items-center space-x-2">
                            <li>
                                <Link
                                    href={`/${language}/shop`}
                                    className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors group"
                                >
                                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                                    {t?.products?.backToStore || "Wróć do sklepu"}
                                </Link>
                            </li>
                            <li className="flex items-center text-slate-300">
                                <span className="mx-2">/</span>
                                <span className="text-sm font-bold text-slate-400 capitalize">{primaryCategory}</span>
                            </li>
                        </ol>
                    </nav>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-16">
                        {/* Left Column: Gallery & Description (7 cols) */}
                        <div className="lg:col-span-7 space-y-12">
                            <div className="space-y-6">
                                <div className="relative aspect-square rounded-[2.5rem] overflow-hidden bg-white shadow-2xl shadow-slate-200/50 border border-slate-100 group">
                                    <Image
                                        src={product.image || "/product-placeholder.png"}
                                        alt={product.title}
                                        fill
                                        className="object-contain p-10 group-hover:scale-105 transition-transform duration-700"
                                        priority
                                    />
                                    {product.price && product.price < 100 && (
                                        <Badge className="absolute top-8 right-8 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-xl border-none tracking-tight">
                                            {t?.products?.sale || "Promocja"} -15%
                                        </Badge>
                                    )}
                                </div>

                                <div className="grid grid-cols-4 gap-4">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="aspect-square rounded-2xl border-2 border-slate-100 bg-white hover:border-indigo-400 transition-all cursor-pointer overflow-hidden group p-2 shadow-sm">
                                            <Image
                                                src={product.image || "/product-placeholder.png"}
                                                alt={`${product.title} view ${i}`}
                                                width={150}
                                                height={150}
                                                className="object-contain w-full h-full group-hover:scale-110 transition-transform"
                                            />
                                        </div>
                                    ))}
                                </div>

                                {/* Interactive Player Inline */}
                                {product.source?.embedHtml && (
                                    <div className="pt-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                                    <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                                                        {t.products?.interactiveActive || "Active Interactive Preview"}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Role-based restriction */}
                                            {(isAdmin || role === 'teacher') ? (
                                                <div className="relative w-full overflow-hidden bg-slate-950 rounded-[2.5rem] border-8 border-slate-900 shadow-2xl" style={{ paddingTop: '75%' /* 4:3 Aspect Ratio */ }}>
                                                    <div
                                                        className="absolute inset-0 w-full h-full flex items-center justify-center"
                                                        dangerouslySetInnerHTML={{
                                                            __html: product.source.embedHtml
                                                                .replace(/width="\d+"/, 'width="100%"')
                                                                .replace(/height="\d+"/, 'height="100%"')
                                                                .replace(/style="[^"]*"/, 'style="width: 100%; height: 100%; border: none;"')
                                                        }}
                                                    />
                                                </div>
                                            ) : (
                                                <div className="relative w-full overflow-hidden bg-slate-900 rounded-[2.5rem] border-4 border-dashed border-slate-800 shadow-inner flex flex-col items-center justify-center text-center p-8 space-y-6" style={{ minHeight: '300px' }}>
                                                    <div className="w-20 h-20 rounded-full bg-indigo-500/10 flex items-center justify-center">
                                                        <Play className="w-10 h-10 text-indigo-500 fill-indigo-500" />
                                                    </div>
                                                    <div className="max-w-md space-y-2">
                                                        <h4 className="text-xl font-bold text-white">
                                                            {t.products?.previewRestricted || "Preview available for teachers"}
                                                        </h4>
                                                        <p className="text-slate-400 text-sm">
                                                            {t.products?.previewLogin || "Log in as a teacher to test the material before purchasing."}
                                                        </p>
                                                    </div>
                                                    <Link href={`/${language}/login`}>
                                                        <Button onClick={() => toast.success(t?.common?.success || "Akcja wykonana pomyślnie.")} variant="outline" className="border-indigo-500 text-indigo-400 hover:bg-indigo-500 hover:text-white rounded-xl px-10">
                                                            {t.nav?.login || "Log in"}
                                                        </Button>
                                                    </Link>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <TrustBadgeBar />

                            {/* Product Description Moved Here */}
                            <div id="description" className="bg-white border border-slate-100 rounded-[3rem] p-10 md:p-14 shadow-sm">
                                <h2 className="text-3xl font-serif font-bold text-slate-900 mb-8 flex items-center gap-4">
                                    <div className="w-2 h-8 bg-indigo-600 rounded-full" />
                                    {t?.products?.description || "Opis"}
                                </h2>
                                <div className="prose prose-slate max-w-none text-slate-600 text-xl leading-relaxed whitespace-pre-wrap font-medium">
                                    {product.description}
                                </div>

                                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
                                    <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100">
                                        <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                                            <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                                            {t.productDetail?.whatYouGet || t?.products?.whatsIncluded || "Co znajdziesz w środku?"}
                                        </h4>
                                        <ul className="text-sm text-slate-500 space-y-2">
                                            <li>• {t.productDetail?.includePdf || 'High-quality PDF materials'}</li>
                                            <li>• {t.productDetail?.includeScenarios || 'Ready-to-use lesson plans'}</li>
                                            <li>• {t.productDetail?.includeInteractive || 'Interactive exercises'}</li>
                                        </ul>
                                    </div>
                                    <div className="p-6 rounded-3xl bg-indigo-50/30 border border-indigo-100/50">
                                        <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                                            <Star className="w-5 h-5 text-indigo-600 fill-indigo-600" />
                                            {t.productDetail?.premiumQuality || 'Premium Quality'}
                                        </h4>
                                        <p className="text-sm text-slate-500">
                                            {t.productDetail?.premiumQualityDesc || 'Created by expert educators for the best classroom experience.'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Sticky Conversion Sidebar (5 cols) */}
                        <div className="lg:col-span-5 relative">
                            <div className="lg:sticky lg:top-24 space-y-4 self-start">
                                <div className="bg-white border border-slate-200 rounded-[2.5rem] p-6 md:p-8 shadow-2xl shadow-indigo-100/40 relative overflow-hidden group">
                                    {/* Top highlight border */}
                                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

                                    {/* 1. Product Title & Tags (Compact) */}
                                    <div className="mb-4">
                                        <div className="flex flex-wrap gap-1.5 mb-3">
                                            {product.categories.map((cat) => (
                                                <span
                                                    key={cat}
                                                    className="px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-slate-50 text-slate-400 border border-slate-100"
                                                >
                                                    {(t.products?.productCategories as any)?.[cat] || cat}
                                                </span>
                                            ))}
                                            <div className="flex items-center gap-1.5 bg-green-50 text-green-600 px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ml-auto">
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                                {t.productDetail?.inStock || t.products.inStock || 'Ready'}
                                            </div>
                                        </div>
                                        <h1 className="text-2xl md:text-3xl font-serif font-bold text-slate-900 leading-tight">
                                            {product.title}
                                        </h1>
                                    </div>

                                    {/* 2. Price & Rating Section */}
                                    <div className="flex items-end justify-between mb-6 pb-6 border-b border-slate-50">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">{t.products.price}</span>
                                            <div className="text-4xl font-black text-indigo-600 tracking-tight leading-none">
                                                {formatPriceUtil(product.price, selectedVariant as Language)}
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <div className="flex items-center gap-1.5 bg-slate-100/50 text-slate-400 px-2 py-1 rounded-xl border border-slate-200/50 mb-0.5">
                                                <Star className="w-3 h-3 text-slate-300" />
                                                <span className="text-[10px] font-bold">Brak ocen</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 3. Language Selector */}
                                    {availableLanguages.length > 1 && (
                                        <div className="mb-6">
                                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-3">
                                                {t.shop.selectVersion}
                                            </label>
                                            <div className="flex flex-wrap gap-2 max-h-[140px] overflow-y-auto pr-2 custom-scrollbar p-1">
                                                {availableLanguages.map((l) => (
                                                    <button
                                                        key={l}
                                                        onClick={() => setSelectedVariant(l as any)}
                                                        className={cn(
                                                            "group/lang flex items-center justify-center w-10 h-10 rounded-xl border-2 transition-all duration-300 relative bg-white",
                                                            selectedVariant === l
                                                                ? "border-indigo-600 shadow-md scale-105 z-10"
                                                                : "border-slate-100 hover:border-indigo-200"
                                                        )}
                                                    >
                                                        <img
                                                            src={`https://flagcdn.com/${l === 'en' ? 'gb' : l === 'uk' ? 'ua' : l === 'cs' ? 'cz' : l === 'et' ? 'ee' : l === 'sr' ? 'rs' : l === 'sl' ? 'si' : l === 'el' ? 'gr' : l}.svg`}
                                                            alt={l}
                                                            className={cn(
                                                                "w-5 h-auto rounded-xs transition-transform duration-300",
                                                                selectedVariant === l ? "scale-110" : "opacity-50 grayscale group-hover/lang:opacity-100 group-hover/lang:grayscale-0"
                                                            )}
                                                        />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* 4. Promo Timer (Urgency) */}
                                    <PromoTimer />

                                    {/* 5. PRIMARY CTA - Standard Position Strategy */}
                                    <div className="mb-8">
                                        <Button
                                            size="lg"
                                            className="w-full gap-3 text-xl h-16 md:h-20 shadow-xl shadow-indigo-200 rounded-2xl bg-indigo-600 hover:bg-indigo-700 hover:scale-[1.01] active:scale-[0.98] transition-all font-black text-white"
                                            onClick={handleAddToCart}
                                        >
                                            <ShoppingCart className="h-6 w-6" />
                                            {t.products.addToCart}
                                        </Button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 mb-10">
                                        <Button
                                            variant="outline"
                                            className="gap-2 h-14 rounded-2xl border-slate-200 text-slate-600 font-bold hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                                            onClick={handleShare}
                                        >
                                            <Share2 className="h-4 w-4" />
                                            {t.products.share}
                                        </Button>
                                        <Button onClick={() => toast.success(t?.common?.success || "Akcja wykonana pomyślnie.")}
                                            variant="outline"
                                            className="gap-2 h-14 rounded-2xl border-slate-200 text-slate-600 font-bold hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                                        >
                                            <Heart className="h-4 w-4" />
                                            {t.productDetail?.wishlist || t.common?.wishlist || 'Save'}
                                        </Button>
                                    </div>

                                    {/* Trust Section */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4 group/trust p-3 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                                            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center group-hover/trust:rotate-6 transition-transform">
                                                <ShieldCheck className="h-5 w-5 text-green-600" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-black text-[10px] text-slate-900 uppercase tracking-widest">{t.products.securePurchase}</h4>
                                                <p className="text-[11px] text-slate-500 font-medium leading-tight">
                                                    {t.products.instantAccess}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 group/trust p-3 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center group-hover/trust:-rotate-6 transition-transform">
                                                <Zap className="h-5 w-5 text-blue-600" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-black text-[10px] text-slate-900 uppercase tracking-widest">{t.productDetail?.instantDelivery || t.products.instantDelivery || 'Digital Delivery'}</h4>
                                                <p className="text-[11px] text-slate-500 font-medium leading-tight">
                                                    {t.products.pdfInfo}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Payment Methods Mock - Simplified */}
                                    <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                                        <div className="flex justify-center gap-5 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                                            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-2.5 w-auto" alt="Visa" />
                                            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-3.5 w-auto" alt="Mastercard" />
                                            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-2.5 w-auto" alt="Paypal" />
                                            <img src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Google_Pay_%28GPay%29_Logo.svg" className="h-3.5 w-auto" alt="GPay" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Related Products */}
                    {relatedProducts.length > 0 && (
                        <div className="border-t pt-16 mt-16">
                            <h2 className="text-2xl font-serif font-bold mb-8">
                                {t.products.seeAlso}
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {relatedProducts.map((p) => (
                                    <Link href={`/${language}/products/${p.slug}`} key={p.slug} className="group">
                                        <Card className="h-full transition-all hover:shadow-md border-muted overflow-hidden flex flex-col rounded-2xl">
                                            <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                                                <Image
                                                    src={p.image || "/product-placeholder.png"}
                                                    alt={p.title}
                                                    fill
                                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                            </div>
                                            <CardContent className="p-4 flex flex-col flex-1">
                                                <h3 className="font-bold text-sm line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                                                    {p.title}
                                                </h3>
                                                <div className="mt-auto pt-2 flex items-center justify-between">
                                                    <span className="font-bold text-primary">
                                                        {formatPriceUtil(p.price, language)}
                                                    </span>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <Footer />

            {/* High Performance: Sticky Add to Cart (Desktop & Mobile) */}
            <div className={cn(
                "fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-t border-slate-200 p-4 transition-all duration-500 transform lg:hidden",
                isStickyVisible ? "translate-y-0" : "translate-y-full"
            )}>
                <div className="container mx-auto flex items-center justify-between gap-4">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Price</span>
                        <span className="text-xl font-black text-indigo-600">{formatPriceUtil(product.price, language)}</span>
                    </div>
                    <Button
                        size="lg"
                        className="flex-1 max-w-[240px] h-12 rounded-xl bg-indigo-600 font-bold shadow-lg"
                        onClick={handleAddToCart}
                    >
                        {t.products.addToCart}
                    </Button>
                </div>
            </div>
        </div>
    );
}


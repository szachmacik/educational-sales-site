"use client";

import { use } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useWishlist } from "@/lib/wishlist-context";
import { useLanguage } from "@/components/language-provider";
import { useCart } from "@/lib/cart-context";
import { getProducts } from "@/lib/product-service";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Trash2, BookOpen, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const LABELS = {
    pl: {
        title: "Lista życzeń",
        subtitle: "Produkty, które Cię zainteresowały",
        empty: "Twoja lista życzeń jest pusta",
        emptySub: "Dodaj produkty do listy życzeń, aby móc do nich wrócić później.",
        browse: "Przeglądaj sklep",
        addToCart: "Dodaj do koszyka",
        remove: "Usuń",
        clearAll: "Wyczyść listę",
        added: "Dodano do koszyka",
        removed: "Usunięto z listy życzeń",
        items: (n: number) => `${n} ${n === 1 ? 'produkt' : n < 5 ? 'produkty' : 'produktów'}`,
        share: "Udostępnij listę",
        shareMsg: "Skopiowano link do schowka!",
    },
    en: {
        title: "Wishlist",
        subtitle: "Products you've saved for later",
        empty: "Your wishlist is empty",
        emptySub: "Add products to your wishlist to come back to them later.",
        browse: "Browse shop",
        addToCart: "Add to cart",
        remove: "Remove",
        clearAll: "Clear all",
        added: "Added to cart",
        removed: "Removed from wishlist",
        items: (n: number) => `${n} ${n === 1 ? 'item' : 'items'}`,
        share: "Share list",
        shareMsg: "Link copied to clipboard!",
    },
    uk: {
        title: "Список бажань",
        subtitle: "Продукти, які вас зацікавили",
        empty: "Ваш список бажань порожній",
        emptySub: "Додайте продукти до списку бажань, щоб повернутися до них пізніше.",
        browse: "Переглянути магазин",
        addToCart: "Додати до кошика",
        remove: "Видалити",
        clearAll: "Очистити список",
        added: "Додано до кошика",
        removed: "Видалено зі списку бажань",
        items: (n: number) => `${n} ${n === 1 ? 'товар' : 'товари'}`,
        share: "Поділитися списком",
        shareMsg: "Посилання скопійовано!",
    },
};

export default function WishlistPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = use(params);
    const { language } = useLanguage();
    const { wishlistIds, removeFromWishlist, clearWishlist, isInWishlist } = useWishlist();
    const { addItem } = useCart();
    const { toast } = useToast();

    const lbl = (LABELS as any)[language] || LABELS.pl;
    const allProducts = getProducts(language);
    const wishlistProducts = allProducts.filter(p => wishlistIds.includes(p.slug || p.id));

    const handleAddToCart = (product: any) => {
        addItem({
            id: product.slug,
            title: product.title,
            price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
            images: [product.image || ''],
            description: product.description,
            category: product.categories?.[0] || '',
            slug: product.slug,
            tags: product.categories || [],
            status: 'published',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        });
        toast({ title: lbl.added, description: product.title });
    };

    const handleRemove = (id: string, title: string) => {
        removeFromWishlist(id);
        toast({ title: lbl.removed, description: title });
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href).then(() => {
            toast({ title: lbl.shareMsg });
        });
    };

    const formatPrice = (price: number | string) => {
        const num = typeof price === 'string' ? parseFloat(price) : price;
        return `${num.toFixed(2)} zł`;
    };

    return (
        <>
            <Header />
            <main className="min-h-screen bg-gradient-to-b from-rose-50/30 to-white">
                {/* Hero */}
                <div className="bg-white border-b">
                    <div className="container mx-auto px-4 py-10">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center">
                                    <Heart className="h-6 w-6 text-rose-500 fill-rose-500" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold font-serif">{lbl.title}</h1>
                                    <p className="text-muted-foreground mt-0.5">
                                        {wishlistProducts.length > 0
                                            ? lbl.items(wishlistProducts.length)
                                            : lbl.subtitle}
                                    </p>
                                </div>
                            </div>
                            {wishlistProducts.length > 0 && (
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="sm" onClick={handleShare}>
                                        {lbl.share}
                                    </Button>
                                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive" onClick={clearWishlist}>
                                        <Trash2 className="h-4 w-4 mr-1.5" />
                                        {lbl.clearAll}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-10">
                    {wishlistProducts.length === 0 ? (
                        /* Empty state */
                        <div className="text-center py-24">
                            <div className="w-24 h-24 rounded-full bg-rose-50 flex items-center justify-center mx-auto mb-6">
                                <Heart className="h-12 w-12 text-rose-200" />
                            </div>
                            <h2 className="text-2xl font-bold font-serif mb-3">{lbl.empty}</h2>
                            <p className="text-muted-foreground mb-8 max-w-md mx-auto">{lbl.emptySub}</p>
                            <Button asChild size="lg" className="bg-primary text-primary-foreground">
                                <Link href={`/${language}/products`}>
                                    <BookOpen className="h-5 w-5 mr-2" />
                                    {lbl.browse}
                                    <ArrowRight className="h-4 w-4 ml-2" />
                                </Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {wishlistProducts.map((product) => (
                                <Card key={product.slug || product.id} className="group overflow-hidden hover:shadow-lg transition-all border-muted">
                                    <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                                        {product.image ? (
                                            <Image
                                                src={product.image}
                                                alt={product.title}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <BookOpen className="h-12 w-12 text-slate-300" />
                                            </div>
                                        )}
                                        {/* Remove button */}
                                        <button
                                            onClick={() => handleRemove(product.slug || product.id, product.title)}
                                            className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-rose-50 hover:text-rose-500 transition-colors"
                                        >
                                            <Heart className="h-4 w-4 fill-rose-500 text-rose-500" />
                                        </button>
                                        {product.categories?.[0] && (
                                            <Badge className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-slate-700 border-0 shadow-sm text-xs">
                                                {product.categories[0]}
                                            </Badge>
                                        )}
                                    </div>
                                    <CardContent className="p-4">
                                        <Link href={`/${language}/products/${product.slug}`}>
                                            <h3 className="font-semibold line-clamp-2 mb-1 hover:text-primary transition-colors text-sm leading-snug">
                                                {product.title}
                                            </h3>
                                        </Link>
                                        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                                            {product.description}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold text-primary">
                                                {formatPrice(product.price)}
                                            </span>
                                            <Button
                                                size="sm"
                                                className="h-8 text-xs bg-primary text-primary-foreground hover:bg-primary/90"
                                                onClick={() => handleAddToCart(product)}
                                            >
                                                <ShoppingCart className="h-3.5 w-3.5 mr-1.5" />
                                                {lbl.addToCart}
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}

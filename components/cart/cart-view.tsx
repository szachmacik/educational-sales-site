"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/lib/cart-context";
import { useLanguage } from "@/components/language-provider";
import {
    ShoppingCart,
    Trash2,
    Plus,
    Minus,
    Tag,
    ArrowRight,
    Package,
    Clock,
    ShieldCheck,
} from "lucide-react";

export function CartView() {
    const { t, formatPrice, language } = useLanguage();
    const { cart, removeItem, updateQuantity, applyCoupon, removeCoupon, clearCart, itemCount, addItem } = useCart();

    // Safe translation extraction with Polish fallbacks
    const ct = t?.cart;
    const cartEmpty = ct?.empty || "Twój koszyk jest pusty";
    const cartEmptySub = ct?.emptySub || "Dodaj produkty, aby kontynuować zakupy.";
    const cartBrowse = ct?.browse || "Przeglądaj produkty";
    const cartReserved = ct?.reserved || "Twoje zamówienie jest zarezerwowane";
    const cartHeader = (count: number) => (ct?.header || "Koszyk ({count})").replace("{count}", String(count));
    const cartRemove = ct?.remove || "Usuń";
    const cartSummary = ct?.summary || "Podsumowanie";
    const cartCouponPlaceholder = ct?.couponPlaceholder || "Kod rabatowy";
    const cartApply = ct?.apply || "Zastosuj";
    const cartCouponHeader = ct?.couponHeader || "Kupon:";
    const cartProducts = ct?.products || "Produkty";
    const cartDiscount = ct?.discount || "Rabat";
    const cartTotal = ct?.total || "Łącznie";
    const cartCheckout = ct?.checkout || "Przejdź do kasy";
    const cartSecure = ct?.secure || "Bezpieczna płatność";
    const cartSpecialOffer = ct?.specialOffer || "Oferta specjalna";
    const cartOrderBump = ct?.orderBump || "Dodatkowy produkt";
    const cartOrderBumpDesc = ct?.orderBumpDesc || "Uzupełnij swój zestaw o ten produkt w specjalnej cenie.";

    const [couponCode, setCouponCode] = useState("");
    const [couponMessage, setCouponMessage] = useState<{ success: boolean; text: string } | null>(null);
    const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 min timer

    // Timer countdown
    useEffect(() => {
        if (cart.items.length === 0) return;

        const interval = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(interval);
    }, [cart.items.length]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const handleApplyCoupon = () => {
        if (!couponCode.trim()) return;
        const result = applyCoupon(couponCode, t);
        setCouponMessage({ success: result.success, text: result.message });
        if (result.success) {
            setCouponCode("");
        }
    };

    if (cart.items.length === 0) {
        return (
            <main className="flex-1 flex items-center justify-center py-20">
                <div className="text-center">
                    <div className="w-24 h-24 rounded-full bg-muted mx-auto flex items-center justify-center mb-6">
                        <ShoppingCart className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <h1 className="text-2xl font-bold mb-2">{cartEmpty}</h1>
                    <p className="text-muted-foreground mb-6">
                        {cartEmptySub}
                    </p>
                    <Button asChild>
                        <Link href={`/${language}`}>
                            {cartBrowse}
                            <ArrowRight className="h-4 w-4 ml-2" />
                        </Link>
                    </Button>
                </div>
            </main>
        );
    }

    return (
        <main className="flex-1 py-12">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                {/* Timer Banner */}
                {timeLeft > 0 && (
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg p-4 mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Clock className="h-5 w-5" />
                            <span>{cartReserved}</span>
                        </div>
                        <span className="text-2xl font-bold font-mono">{formatTime(timeLeft)}</span>
                    </div>
                )}

                <h1 className="text-3xl font-bold mb-8">{cartHeader(itemCount)}</h1>

                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cart.items.map((item) => (
                            <Card key={item.productId}>
                                <CardContent className="p-4">
                                    <div className="flex gap-4">
                                        <div className="h-24 w-24 rounded-lg bg-muted flex items-center justify-center shrink-0 overflow-hidden">
                                            {item.image ? (
                                                <img
                                                    src={item.image}
                                                    alt={item.title}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <Package className="h-8 w-8 text-muted-foreground" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-medium line-clamp-2">{item.title}</h3>
                                            {item.selectedLanguage && (
                                                <Badge variant="outline" className="mt-1 text-[10px] h-5 px-1.5 uppercase font-bold text-muted-foreground border-muted-foreground/30">
                                                    {t.shop?.version || "Version"}: {t.languages?.[item.selectedLanguage] || item.selectedLanguage}
                                                </Badge>
                                            )}
                                            <div className="flex items-center gap-2 mt-2">
                                                {item.salePrice ? (
                                                    <>
                                                        <span className="font-bold text-lg">{formatPrice(item.salePrice)}</span>
                                                        <span className="text-sm text-muted-foreground line-through">
                                                            {formatPrice(item.price)}
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span className="font-bold text-lg">{formatPrice(item.price)}</span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-4 mt-3">
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <Minus className="h-3 w-3" />
                                                    </Button>
                                                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                                    >
                                                        <Plus className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-destructive hover:text-destructive"
                                                    onClick={() => removeItem(item.productId)}
                                                >
                                                    <Trash2 className="h-4 w-4 mr-1" />
                                                    {t.cart.remove}
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="font-bold">
                                                {formatPrice((item.salePrice ?? item.price) * item.quantity)}
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        {/* Order Bump */}
                        <Card className="border-2 border-dashed border-primary/30 bg-primary/5">
                            <CardContent className="p-4">
                                <div className="flex items-start gap-4">
                                    <input
                                        type="checkbox"
                                        className="mt-1 h-5 w-5 rounded cursor-pointer"
                                        checked={cart.items.some(i => i.productId === "order_bump_1")}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                addItem({
                                                    id: "order_bump_1",
                                                    title: t.cart.orderBump || "Special Offer E-book",
                                                    price: 29,
                                                    images: ["/product-placeholder.png"],
                                                    description: t.cart.orderBumpDesc || "Exclusive offer",
                                                    category: "extra",
                                                    slug: "special-offer-ebook",
                                                    tags: ["ebook"],
                                                    status: 'published',
                                                    createdAt: new Date().toISOString(),
                                                    updatedAt: new Date().toISOString()
                                                });
                                            } else {
                                                removeItem("order_bump_1");
                                            }
                                        }}
                                    />
                                    <div className="flex-1">
                                        <Badge className="mb-2 bg-green-600">{cartSpecialOffer}</Badge>
                                        <h4 className="font-medium">{cartOrderBump}</h4>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {cartOrderBumpDesc}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Summary */}
                    <div className="space-y-4">
                        <div className="lg:sticky lg:top-24 space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>{cartSummary}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Coupon */}
                                    <div className="space-y-2">
                                        <div className="flex gap-2">
                                            <div className="relative flex-1">
                                                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    placeholder={cartCouponPlaceholder}
                                                    value={couponCode}
                                                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                                    className="pl-10"
                                                />
                                            </div>
                                            <Button variant="outline" onClick={handleApplyCoupon}>
                                                {cartApply}
                                            </Button>
                                        </div>
                                        {couponMessage && (
                                            <p className={`text-sm ${couponMessage.success ? "text-green-600" : "text-red-600"}`}>
                                                {couponMessage.text}
                                            </p>
                                        )}
                                        {cart.couponCode && (
                                            <div className="flex items-center justify-between text-sm bg-green-50 p-2 rounded">
                                                <span className="text-green-700">
                                                    {cartCouponHeader} <strong>{cart.couponCode}</strong>
                                                </span>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-6 text-xs"
                                                    onClick={removeCoupon}
                                                >
                                                    {cartRemove}
                                                </Button>
                                            </div>
                                        )}
                                    </div>

                                    <Separator />

                                    {/* Totals */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">{cartProducts}</span>
                                            <span>{formatPrice(cart.subtotal)}</span>
                                        </div>
                                        {cart.couponDiscount > 0 && (
                                            <div className="flex justify-between text-sm text-green-600">
                                                <span>{cartDiscount}</span>
                                                <span>-{formatPrice(cart.couponDiscount)}</span>
                                            </div>
                                        )}
                                        <Separator />
                                        <div className="flex justify-between font-bold text-lg">
                                            <span>{cartTotal}</span>
                                            <span>{formatPrice(cart.total)}</span>
                                        </div>
                                    </div>

                                    <Button className="w-full" size="lg" asChild>
                                        <Link href={`/${language}/checkout`}>
                                            {cartCheckout}
                                            <ArrowRight className="h-4 w-4 ml-2" />
                                        </Link>
                                    </Button>

                                    {/* Trust badges */}
                                    <div className="flex items-center justify-center gap-4 pt-4 text-xs text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <ShieldCheck className="h-4 w-4" />
                                            {cartSecure}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>

                {/* Mobile Fixed Checkout Bar */}
                <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden border-t bg-background/95 backdrop-blur p-4 pb-safe shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
                    <div className="mx-auto max-w-lg flex items-center justify-between gap-4">
                        <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground">{cartTotal}</span>
                            <span className="text-xl font-bold text-primary">{formatPrice(cart.total)}</span>
                        </div>
                        <Button size="lg" className="flex-1 shadow-lg shadow-primary/20" asChild>
                            <Link href={`/${language}/checkout`}>
                                {cartCheckout}
                                <ArrowRight className="h-4 w-4 ml-2" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </main>
    );
}

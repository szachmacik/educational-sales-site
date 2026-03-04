"use client";


import { useState } from "react";
import { useLanguage } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Check, ShieldCheck, Zap, Lock, ShoppingBag, Clock, Users, Flame } from "lucide-react";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { MOCK_COURSES } from "@/lib/mock-data";
import { toast } from "sonner";

export default function PayPage() {
    const params = useParams();
    const slug = params?.slug as string | undefined;
    const { t, formatPrice } = useLanguage();

    // In a real app, you'd fetch product data by slug
    // Here we'll fallback to mock data or a placeholder
    const product = MOCK_COURSES.find(c => c.slug === slug) || {
        title: t.quickSale.demoProduct.title,
        price: 97,
        sale_price: 47,
        image_url: "https://placehold.co/600x400/purple/white?text=Product+Cover",
        excerpt: t.quickSale.demoProduct.excerpt
    };

    const finalPrice = product.sale_price || product.price;
    const [email, setEmail] = useState("");
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("blik");
    const [isBumpAdded, setIsBumpAdded] = useState(false);

    // Countdown Timer logic
    const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const BUMP_PRICE = 27;
    const total = isBumpAdded ? finalPrice + BUMP_PRICE : finalPrice;

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-4xl rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row border border-slate-100">

                {/* Left Side: Product Details */}
                <div className="p-8 md:w-1/2 bg-slate-50/50 flex flex-col gap-6">
                    <div className="rounded-xl overflow-hidden shadow-sm border">
                        <img
                            src={product.image_url || "https://placehold.co/600x400"}
                            alt={product.title}
                            className="w-full h-48 object-cover object-center"
                        />
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold leading-tight text-slate-900">{product.title}</h1>
                        <p className="text-sm text-muted-foreground">{product.excerpt}</p>
                    </div>

                    <div className="mt-auto space-y-4">
                        <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg text-green-800 text-sm font-medium border border-green-100">
                            <ShieldCheck className="h-5 w-5" />
                            {t.quickSale.page.guarantee}
                        </div>
                        <Separator />
                        <div className="flex justify-between items-end">
                            <span className="text-sm text-muted-foreground">{t.quickSale.page.totalLabel}</span>
                            <div className="text-right">
                                {product.sale_price && (
                                    <>
                                        <div className="flex justify-end mb-1">
                                            <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                                {t.quickSale.optimization.savings} {Math.round(((product.price - finalPrice) / product.price) * 100)}%
                                            </span>
                                        </div>
                                        <span className="text-sm text-muted-foreground line-through block">
                                            {formatPrice(product.price)}
                                        </span>
                                    </>
                                )}
                                <span className="text-3xl font-extrabold text-slate-900">
                                    {formatPrice(total)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Simple Checkout Form */}
                <div className="p-8 md:w-1/2 flex flex-col gap-6 bg-white relative">
                    <div className="absolute top-0 right-0 p-2 opacity-5 pointer-events-none">
                        <Zap className="h-32 w-32" />
                    </div>

                    {/* Scarcity / Urgency Header */}
                    <div className="bg-red-50 border border-red-100 rounded-lg p-3 flex items-center justify-between shadow-sm animate-pulse">
                        <div className="flex items-center gap-2 text-red-700 font-bold text-sm">
                            <Clock className="h-4 w-4" />
                            {t.quickSale.optimization.timer.text}
                        </div>
                        <div className="font-mono text-xl font-black text-red-600 tracking-wider">
                            {formatTime(timeLeft)}
                        </div>
                    </div>

                    {/* Social Proof */}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mr-auto bg-slate-100 rounded-full px-3 py-1">
                        <Users className="h-3 w-3" />
                        <span className="font-medium">{t.quickSale.optimization.social_proof.viewing.replace('{count}', '34')}</span>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="h-6 w-6 bg-yellow-400 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-sm">
                                <Zap className="h-3 w-3 text-black" />
                            </div>
                            <span className="font-bold text-sm tracking-wide uppercase text-slate-500">
                                {t.quickSale.title}
                            </span>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">{t.quickSale.page.email_label}</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder={t.quickSale.page.email_placeholder}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-slate-50 border-slate-200 focus:bg-white transition-all h-11"
                            />
                        </div>

                        <div className="space-y-3 pt-2">
                            <Label>{t.quickSale.page.payment_method}</Label>
                            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="grid grid-cols-2 gap-3">
                                <div>
                                    <RadioGroupItem value="blik" id="blik" className="peer sr-only" />
                                    <Label
                                        htmlFor="blik"
                                        className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 [&:has([data-state=checked])]:border-primary transition-all cursor-pointer h-24"
                                    >
                                        <div className="font-bold text-lg mb-1">BLIK</div>
                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                                            <Zap className="h-4 w-4 text-slate-600" />
                                        </div>
                                    </Label>
                                </div>
                                <div>
                                    <RadioGroupItem value="card" id="card" className="peer sr-only" />
                                    <Label
                                        htmlFor="card"
                                        className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 [&:has([data-state=checked])]:border-primary transition-all cursor-pointer h-24"
                                    >
                                        <div className="font-bold text-lg mb-1">{t.quickSale.page.payment_card}</div>
                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                                            <Lock className="h-4 w-4 text-slate-600" />
                                        </div>
                                    </Label>
                                </div>
                            </RadioGroup>
                        </div>

                        {paymentMethod === 'blik' && (
                            <div className="animate-in slide-in-from-top-2 fade-in">
                                <Label className="text-xs">{t.quickSale.page.blik_code}</Label>
                                <div className="flex gap-2 mt-1">
                                    <Input className="text-center font-mono text-lg tracking-[0.5em]" maxLength={6} placeholder="000 000" />
                                </div>
                            </div>
                        )}



                        {/* Order Bump */}
                        <div className={`p-4 rounded-xl border-2 transition-all ${isBumpAdded ? 'border-primary bg-primary/5' : 'border-dashed border-slate-200 hover:border-slate-300'}`}>
                            <div className="flex items-start space-x-3">
                                <Checkbox
                                    id="bump"
                                    checked={isBumpAdded}
                                    onCheckedChange={(c) => setIsBumpAdded(c === true)}
                                    className="mt-1 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                />
                                <div className="space-y-1">
                                    <label
                                        htmlFor="bump"
                                        className="text-sm font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2 cursor-pointer"
                                    >
                                        {t.quickSale.bump.yes_btn}
                                        <span className="text-xs font-normal text-muted-foreground">({t.quickSale.bump.price_prefix} <span className="text-red-500 font-bold">{formatPrice(BUMP_PRICE)}</span>)</span>
                                    </label>
                                    <p className="text-xs text-muted-foreground leading-snug">
                                        {t.quickSale.bump.description}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2 pt-2">
                            <Checkbox
                                id="terms"
                                checked={termsAccepted}
                                onCheckedChange={(c) => setTermsAccepted(c === true)}
                            />
                            <label
                                htmlFor="terms"
                                className="text-xs text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                {t.quickSale.page.terms}
                            </label>
                        </div>
                    </div>

                    <Button onClick={() => toast.success("Akcja wykonana pomyślnie.")} size="lg" className="w-full text-base font-bold h-12 mt-2 gap-2 shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform">
                        {t.quickSale.page.pay_btn}
                        <Zap className="h-4 w-4 fill-current" />
                    </Button>

                    <div className="text-center mt-2">
                        <p className="text-[10px] text-muted-foreground flex items-center justify-center gap-1">
                            <Lock className="h-3 w-3" />
                            {t.quickSale.page.secure_checkout}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

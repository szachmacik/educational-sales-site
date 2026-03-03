"use client";

import React from 'react';
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/components/language-provider";
import { useCart } from "@/lib/cart-context";
import { getUserProfile } from "@/lib/user-profile-service";
import { generateOrderId } from "@/lib/order-schema";
import { processStripePayment } from "@/lib/integrations/stripe-service";
import { processPayNowPayment } from "@/lib/integrations/paynow-service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { parseInstitutionalDocument } from "@/lib/integrations/ocr-service";
import { toast } from "sonner";
import { issueInstitutionalInvoice } from "@/lib/integrations/infakt-service";
import { trackAdEvent } from "@/components/marketing/marketing-tracker";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
    CreditCard,
    Smartphone,
    ShieldCheck,
    CheckCircle2,
    Loader2,
    Lock,
    ExternalLink,
    Zap,
    ThumbsUp,
    Download,
    Copy,
    Building,
    User,
    Briefcase,
    Camera
} from "lucide-react";

export function CheckoutContent() {
    const { formatPrice, language } = useLanguage();
    const router = useRouter();
    const { cart, clearCart } = useCart();
    const [mounted, setMounted] = React.useState(false);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [isLookingUpNip, setIsLookingUpNip] = React.useState(false);
    const [isOcrLoading, setIsOcrLoading] = React.useState(false);

    const handleOcrScan = async () => {
        setIsOcrLoading(true);
        const toastId = toast.loading("Analizowanie dokumentu przez AI Vision...");
        try {
            // Simulated base64 image capture/upload
            const mockBase64 = "data:image/jpeg;base64,...";
            const result = await parseInstitutionalDocument(mockBase64);

            setForm(prev => ({
                ...prev,
                isInstitutional: true,
                buyerName: result.buyerName || prev.buyerName,
                buyerNip: result.buyerNip || prev.buyerNip,
                buyerStreet: result.buyerStreet || prev.buyerStreet,
                buyerCity: result.buyerCity || prev.buyerCity,
                buyerZip: result.buyerZip || prev.buyerZip,
                recipientName: result.recipientName || prev.recipientName,
                recipientStreet: result.recipientStreet || prev.recipientStreet,
                recipientCity: result.recipientCity || prev.recipientCity,
                recipientZip: result.recipientZip || prev.recipientZip,
            }));

            toast.success("Dane wyciągnięte pomyślnie!", { id: toastId });
        } catch (error) {
            toast.error("Nie udało się rozpoznać tekstu.", { id: toastId });
        } finally {
            setIsOcrLoading(false);
        }
    };
    const [showInvoice, setShowInvoice] = React.useState(false);
    const [bumpAccepted, setBumpAccepted] = React.useState(false);
    const [activeBump, setActiveBump] = React.useState<{ id: string, title: string, price: number, regularPrice: number, desc: string, image?: string, stars?: number, reviews?: number, badge?: string, relationship?: string } | null>(null);
    const [timeLeft, setTimeLeft] = React.useState(15 * 60); // 15 minutes timer
    const [showExitIntent, setShowExitIntent] = React.useState(false);
    const [hasTriggeredExitIntent, setHasTriggeredExitIntent] = React.useState(false);
    const [userBurnoutLevel, setUserBurnoutLevel] = React.useState(5);
    const [showFomoTimer, setShowFomoTimer] = React.useState(false);
    const [b2bLink, setB2bLink] = React.useState<string | null>(null);

    // MULTI-TIER BUMP OFFERS DATABASE (Visual Authority Edition)
    // Tier 1: Aggressive Upgrade (Substitute)
    // Tier 2: Logical Complement (Complementary)
    // Tier 3: Impulse Buy (Universal)
    const BUMP_OFFERS = [
        {
            id: 'bump-upgrade-megapack',
            relationship: 'upgrade',
            targetLevel: 'any',
            title: 'MEGA PACK 2w1: Wszystkie Scenariusze i PDF na cały rok',
            desc: 'Zamiast kupować pojedynczo, odblokuj PEŁEN DOSTĘP do wszystkiego na cały rok szkolny.',
            price: 249,
            regularPrice: 420,
            image: '/products/mega-pack-2w1.jpg',
            stars: 5,
            reviews: 184,
            badge: 'NAJLEPSZA INWESTYCJA'
        },
        {
            id: 'bump-complement-stories',
            relationship: 'complement',
            targetLevel: 'primary',
            title: 'Pakiet Stories: Ebooki + Audio na 4 pory roku',
            desc: 'Idealne uzupełnienie materiałów PDF. Dodaj magię storytellingu z native speakerem!',
            price: 89,
            regularPrice: 179,
            image: '/products/Projekt-Stories-2-1200x848.jpg',
            stars: 5,
            reviews: 92,
            badge: 'PAKIET UZUPEŁNIAJĄCY'
        },
        {
            id: 'bump-impulse-games',
            relationship: 'impulse',
            targetLevel: 'preschool',
            title: 'Dodaj PAKIET ZABAW RUCHOWYCH (PDF)',
            desc: 'Bestsellerowy zbiór 100+ gier do druku ratujący lekcje bez przygotowania.',
            price: 39,
            regularPrice: 99,
            image: '/products/Grafiki-pakietowe-7-1200x848.jpg',
            stars: 5,
            reviews: 312,
            badge: 'BESTSELLER'
        }
    ];

    React.useEffect(() => {
        setMounted(true);
        // Persisted Timer Logic
        let expirationTime = localStorage.getItem('checkout_bump_expiration');
        if (!expirationTime) {
            expirationTime = (Date.now() + 15 * 60 * 1000).toString();
            localStorage.setItem('checkout_bump_expiration', expirationTime);
        }

        const updateTimer = () => {
            const now = Date.now();
            const exp = parseInt(localStorage.getItem('checkout_bump_expiration') || '0', 10);
            const remainingSeconds = Math.max(0, Math.floor((exp - now) / 1000));
            setTimeLeft(remainingSeconds);
        };

        updateTimer();
        const timer = setInterval(updateTimer, 1000);

        // Exit Intent Logic (Mouse leave top of screen)
        const handleMouseLeave = (e: MouseEvent) => {
            if (e.clientY <= 0 && !hasTriggeredExitIntent) {
                // Determine if we should show exit intent
                try {
                    const { getUserProfile } = require('@/lib/user-profile-service');
                    const profile = getUserProfile("current-user-id");
                    // Show only to price sensitive or non-VIPs
                    if (!profile || (profile.customerScore < 80)) {
                        setShowExitIntent(true);
                        setHasTriggeredExitIntent(true);
                    }
                } catch (err) { }
            }
        };

        document.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            clearInterval(timer);
            document.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [hasTriggeredExitIntent]);

    React.useEffect(() => {
        // Dynamiczna logika przyznawania bumpów po załadowaniu koszyka i komponentu
        if (!mounted) return;

        try {
            // Lazy load profile service just for this check
            const { getUserProfile } = require('@/lib/user-profile-service');
            // In a real app we would get the auth session ID. Here we mock:
            const profile = getUserProfile("current-user-id");
            const purchasedTitles = (profile?.purchasedProducts || []).map((p: string) => p.toLowerCase());

            setUserBurnoutLevel(profile?.burnoutLevel || 5);
            setShowFomoTimer(profile?.customerScore < 60 || !profile);

            // BEHAVIORAL SCORING CHECK:
            // Do not show aggressive discount order bumps to VIP users who are not brand-sensitive to discounts.
            // This prevents "cheapening" the brand for customers who already intend to buy at full price.
            if (profile?.customerScore >= 80 || profile?.discountSensitivity === 'low') {
                setActiveBump(null);
                setShowFomoTimer(false);
                return;
            }

            // BEHAVIORAL EXPIRED BUMP CHECK (Genuine Scarcity)
            const exp = parseInt(localStorage.getItem('checkout_bump_expiration') || '0', 10);
            if (exp > 0 && Date.now() > exp) {
                // Timer expired. Customer lost the fast-action offer.
                setActiveBump(null);
                setShowFomoTimer(false);
                return;
            }

            // Available offers - filter out what user ALREADY HAS in profile history or cart
            let availableOffers = BUMP_OFFERS.filter(offer =>
                !purchasedTitles.some((title: string) => title.includes('mega') && offer.id === 'bump-upgrade-megapack') &&
                !purchasedTitles.some((title: string) => title.includes('stories') && offer.id === 'bump-complement-stories') &&
                !purchasedTitles.some((title: string) => title.includes('zabaw') && offer.id === 'bump-impulse-games')
            );

            availableOffers = availableOffers.filter(offer =>
                !cart.items.some(item => item.title.toLowerCase().includes('mega') && offer.id === 'bump-upgrade-megapack') &&
                !cart.items.some(item => item.title.toLowerCase().includes('stories') && offer.id === 'bump-complement-stories') &&
                !cart.items.some(item => item.title.toLowerCase().includes('zabaw') && offer.id === 'bump-impulse-games')
            );

            if (availableOffers.length === 0) {
                setActiveBump(null);
                return;
            }

            // SMART AOV PUSH ENGINE
            let matchedBump = null;
            const currentSubtotal = cart.items.reduce((sum: number, item: any) => sum + ((item.salePrice ?? item.price) * item.quantity), 0);

            if (currentSubtotal > 0 && availableOffers.length > 0) {
                // Target: ~18% up-sell of the user's current intent ("parenaście procent")
                const targetBumpValue = currentSubtotal * 0.18;

                // Find the offer that mathematically fits this budget best
                const sortedByProximity = [...availableOffers].sort((a, b) =>
                    Math.abs(a.price - targetBumpValue) - Math.abs(b.price - targetBumpValue)
                );

                matchedBump = sortedByProximity[0];
            } else {
                matchedBump = availableOffers[0];
            }

            setActiveBump(matchedBump);
        } catch (e) {
            setActiveBump(BUMP_OFFERS.find(b => b.relationship === 'impulse') || null);
        }
    }, [cart.items, mounted]);

    // Enforce live revocation if timer expires while looking at the page
    React.useEffect(() => {
        if (timeLeft === 0 && activeBump) {
            setActiveBump(null);
            setShowFomoTimer(false);
            setBumpAccepted(false); // Dynamically remove from order total
        }
    }, [timeLeft, activeBump]);

    // DYNAMIC GAMIFICATION TARGET
    // This creates an "insane coincidence" where the exact amount missing for a bonus
    // is perfectly equal to the price of the dynamically chosen Order Bump.
    const TOTAL_FOR_BONUS = activeBump ? cart.subtotal + activeBump.price : (cart.subtotal > 0 ? cart.subtotal * 1.18 : 300);

    // Derived values
    const currentBumpPrice = activeBump ? activeBump.price : 0;
    const cartTotalWithBump = cart.total + (bumpAccepted ? currentBumpPrice : 0);
    const cartSubtotalWithBump = cart.subtotal + (bumpAccepted ? currentBumpPrice : 0);
    const amountToBonus = Math.max(0, TOTAL_FOR_BONUS - cartSubtotalWithBump);
    const progressPercentage = Math.min(100, (cartSubtotalWithBump / TOTAL_FOR_BONUS) * 100);

    const [form, setForm] = React.useState({
        email: "",
        firstName: "",
        lastName: "",
        nip: "",
        companyName: "",
        street: "",
        city: "",
        zipCode: "",
        paymentMethod: "blik" as "card" | "blik" | "applepay" | "school_invoice",
        purchaserRole: "teacher" as "teacher" | "admin",
        isInstitutional: false,
        buyerName: "",
        buyerNip: "",
        buyerStreet: "",
        buyerCity: "",
        buyerZip: "",
        recipientName: "",
        recipientStreet: "",
        recipientCity: "",
        recipientZip: "",
    });

    const [consents, setConsents] = React.useState({
        main: false,
    });

    React.useEffect(() => {
        setMounted(true);
        // SMART B2B GAMIFICATION PULL
        // If the teacher filled the Employer data in the Dashboard widget to get points
        // we automatically toggle the "School Invoice" mechanism.
        const currentUserProfile = getUserProfile("current_demo_user");
        if (currentUserProfile && currentUserProfile.employerNip) {
            setForm(prev => ({
                ...prev,
                nip: currentUserProfile.employerNip || "",
                companyName: currentUserProfile.employerName || "",
                paymentMethod: 'school_invoice'
            }));
            setShowInvoice(true);
        }
    }, []);

    const handleChange = (field: string, value: any) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleLookupNip = async () => {
        if (!form.nip || form.nip.length < 10) return;
        setIsLookingUpNip(true);
        setTimeout(() => {
            setForm(prev => ({
                ...prev,
                companyName: "EDUKACJA JUTRA SP. Z O.O.",
                street: "ul. Marszałkowska 10/2",
                city: "Warszawa",
                zipCode: "00-001"
            }));
            setIsLookingUpNip(false);
        }, 800);
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!consents.main) return;

        setIsSubmitting(true);
        try {
            const orderId = generateOrderId();
            let result;

            const currentBumpPrice = activeBump ? activeBump.price : 0;
            let finalTotal = cart.total + (bumpAccepted ? currentBumpPrice : 0);

            // Special logic for Institutional Invoices (JST)
            if (form.paymentMethod === 'school_invoice' || form.isInstitutional) {
                const invoiceResult = await issueInstitutionalInvoice({ orderNumber: orderId, total: finalTotal }, form, language);
                toast.success(`Wygenerowano proformę dla placówki: ${invoiceResult.invoiceNumber}`);
            }

            // Marketing Tracking: Purchase / InitiateCheckout (Client-side)
            trackAdEvent({
                eventName: 'purchase',
                params: {
                    transaction_id: orderId,
                    value: finalTotal,
                    currency: 'PLN',
                    items: cart.items.map(i => ({
                        item_id: i.productId,
                        item_name: i.title,
                        price: i.salePrice ?? i.price,
                        quantity: i.quantity
                    }))
                }
            });

            // SERVER-SIDE STORAGE & CAPI TRIGGER (Phase 26)
            try {
                await fetch('/api/orders', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        orderNumber: orderId,
                        email: form.email,
                        firstName: form.firstName,
                        lastName: form.lastName,
                        city: form.city,
                        total: finalTotal,
                        items: cart.items,
                        paymentMethod: form.paymentMethod
                    })
                });
            } catch (err) {
                console.warn("[Checkout] Failed to notify server of order, but continuing payment trigger.", err);
            }

            if (form.paymentMethod === 'card' || form.paymentMethod === 'applepay') {
                result = await processStripePayment(finalTotal, 'PLN');
            } else {
                result = await processPayNowPayment(finalTotal, orderId, form.email);
            }

            if (result.success && result.redirectUrl) {
                // --- Trigger Purchase Points ---
                import("@/lib/points-service").then(module => {
                    const pointsToEarn = module.calculateEarnedPoints(finalTotal);
                    module.updateUserPoints(form.email, pointsToEarn, 'earn', 'purchase');
                });
                clearCart();
                window.location.href = result.redirectUrl;
            } else {
                // --- Trigger Purchase Points ---
                import("@/lib/points-service").then(module => {
                    const pointsToEarn = module.calculateEarnedPoints(finalTotal);
                    module.updateUserPoints(form.email, pointsToEarn, 'earn', 'purchase');
                });
                clearCart();
                router.push(`/${language}/dashboard?order=success`);
            }
        } catch (error) {
            console.error("Payment failed", error);
            setIsSubmitting(false);
        }
    };

    if (!mounted) return null;

    if (cart.items.length === 0) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center py-32 bg-slate-50">
                <div className="bg-white p-12 rounded-3xl shadow-sm text-center max-w-md border border-slate-100">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Download className="h-8 w-8 text-slate-300" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 mb-2">Twój koszyk jest pusty</h2>
                    <p className="text-slate-500 mb-8">Wybierz materiały edukacyjne i wróć tutaj, aby złożyć zamówienie.</p>
                    <Button asChild className="w-full h-12 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700">
                        <Link href={`/${language}/products`}>Przeglądaj materiały</Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <main className="flex-1 bg-slate-50 py-12">
            <div className="mx-auto max-w-[1000px] px-4">

                {/* Header / Trust Bar */}
                <div className="flex items-center justify-center mb-8 gap-6 opacity-60">
                    <div className="flex items-center gap-1.5 grayscale text-sm font-bold">
                        <Lock className="h-4 w-4" /> 256-bit SSL Secure
                    </div>
                    <div className="flex items-center gap-1.5 grayscale text-sm font-bold">
                        <Zap className="h-4 w-4" /> Natychmiastowa dostawa
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

                    {/* LEFT COLUMN: Payment & Form (The Frictionless Flow) */}
                    <div className="flex-1 max-w-lg mx-auto w-full space-y-8">

                        {/* 1. EXPRESS CHECKOUT */}
                        <div>
                            <h2 className="text-lg font-black text-slate-900 mb-4">Wybierz metodę płatności</h2>
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                                <button
                                    type="button"
                                    onClick={() => handleChange('paymentMethod', 'blik')}
                                    className={`relative flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl border-2 transition-all font-bold text-sm ${form.paymentMethod === 'blik' ? 'border-slate-900 bg-slate-900 text-white shadow-xl shadow-slate-900/10' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}
                                >
                                    <Smartphone className="h-5 w-5" /> BLIK
                                    {form.paymentMethod === 'blik' && <CheckCircle2 className="absolute -top-2 -right-2 h-5 w-5 text-emerald-500 bg-white rounded-full" />}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleChange('paymentMethod', 'card')}
                                    className={`relative flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl border-2 transition-all font-bold text-sm text-center ${form.paymentMethod === 'card' ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-xl shadow-indigo-600/10' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}
                                >
                                    <CreditCard className="h-5 w-5" /> Karta/ApplePay
                                    {form.paymentMethod === 'card' && <CheckCircle2 className="absolute -top-2 -right-2 h-5 w-5 text-emerald-500 bg-white rounded-full" />}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        handleChange('paymentMethod', 'school_invoice');
                                        setShowInvoice(true);
                                    }}
                                    className={`relative flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl border-2 transition-all font-bold text-xs text-center ${form.paymentMethod === 'school_invoice' ? 'border-amber-500 bg-amber-50 text-amber-700 shadow-xl shadow-amber-500/10' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}
                                >
                                    <Building className="h-5 w-5" /> Faktura dla Szkoły
                                    {form.paymentMethod === 'school_invoice' && <CheckCircle2 className="absolute -top-2 -right-2 h-5 w-5 text-emerald-500 bg-white rounded-full" />}
                                </button>
                            </div>
                        </div>

                        {/* 2. CUSTOMER DATA (Floating/Compact Style) */}
                        <form id="checkout-form" onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-[2rem] shadow-sm border border-slate-100/50 space-y-6">

                            <h2 className="text-lg font-black text-slate-900">Dane do dostawy</h2>

                            <div className="space-y-4">
                                <div className="relative">
                                    <Input
                                        id="email" required type="email" placeholder=" "
                                        value={form.email} onChange={e => handleChange('email', e.target.value)}
                                        className="peer h-14 w-full bg-slate-50 border-slate-200 rounded-xl px-4 pt-4 pb-1 text-base placeholder-transparent focus:bg-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all font-medium"
                                    />
                                    <Label htmlFor="email" className="absolute left-4 top-2 text-[10px] uppercase font-black tracking-wider text-slate-400 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:normal-case peer-placeholder-shown:font-normal peer-focus:top-2 peer-focus:text-[10px] peer-focus:uppercase peer-focus:font-black">Adres E-mail</Label>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="relative">
                                        <Input
                                            id="fname" required placeholder=" "
                                            value={form.firstName} onChange={e => handleChange('firstName', e.target.value)}
                                            className="peer h-14 w-full bg-slate-50 border-slate-200 rounded-xl px-4 pt-4 pb-1 text-base placeholder-transparent focus:bg-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all font-medium"
                                        />
                                        <Label htmlFor="fname" className="absolute left-4 top-2 text-[10px] uppercase font-black tracking-wider text-slate-400 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:normal-case peer-placeholder-shown:font-normal peer-focus:top-2 peer-focus:text-[10px] peer-focus:uppercase peer-focus:font-black">Imię</Label>
                                    </div>
                                    <div className="relative">
                                        <Input
                                            id="lname" required placeholder=" "
                                            value={form.lastName} onChange={e => handleChange('lastName', e.target.value)}
                                            className="peer h-14 w-full bg-slate-50 border-slate-200 rounded-xl px-4 pt-4 pb-1 text-base placeholder-transparent focus:bg-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all font-medium"
                                        />
                                        <Label htmlFor="lname" className="absolute left-4 top-2 text-[10px] uppercase font-black tracking-wider text-slate-400 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:normal-case peer-placeholder-shown:font-normal peer-focus:top-2 peer-focus:text-[10px] peer-focus:uppercase peer-focus:font-black">Nazwisko</Label>
                                    </div>
                                </div>
                            </div>

                            {/* SMART INVOICE TOGGLE */}
                            <div className="pt-2">
                                {!showInvoice ? (
                                    <button
                                        type="button"
                                        onClick={() => setShowInvoice(true)}
                                        className="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5 transition-colors"
                                    >
                                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-50">+</span>
                                        Chcę fakturę na firmę
                                    </button>
                                ) : (
                                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-sm font-bold text-slate-900">Dane do faktury</h3>
                                            <button type="button" onClick={() => setShowInvoice(false)} className="text-xs text-slate-400 hover:text-slate-600">Usuń</button>
                                        </div>

                                        {/* B2B SMART PURCHASER DETECTION */}
                                        <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 space-y-4">
                                            <Label className="text-xs font-bold text-slate-700 uppercase tracking-widest">Kto zamawia?</Label>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => handleChange('purchaserRole', 'teacher')}
                                                    className={`relative flex items-center justify-start gap-3 p-3 rounded-xl border-2 transition-all font-bold text-xs text-left ${form.purchaserRole === 'teacher' ? 'border-indigo-600 bg-white text-indigo-900 shadow-sm' : 'border-indigo-100/50 bg-white/50 text-slate-500 hover:border-indigo-200'}`}
                                                >
                                                    <div className={`p-2 rounded-lg ${form.purchaserRole === 'teacher' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                                                        <User className="h-4 w-4" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <span>Dla siebie / Dyrekcja</span>
                                                    </div>
                                                    {form.purchaserRole === 'teacher' && <CheckCircle2 className="absolute -top-1.5 -right-1.5 h-4 w-4 text-emerald-500 bg-white rounded-full" />}
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => handleChange('purchaserRole', 'admin')}
                                                    className={`relative flex items-center justify-start gap-3 p-3 rounded-xl border-2 transition-all font-bold text-xs text-left ${form.purchaserRole === 'admin' ? 'border-indigo-600 bg-white text-indigo-900 shadow-sm' : 'border-indigo-100/50 bg-white/50 text-slate-500 hover:border-indigo-200'}`}
                                                >
                                                    <div className={`p-2 rounded-lg ${form.purchaserRole === 'admin' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                                                        <Briefcase className="h-4 w-4" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <span>Księgowość / Sekretariat</span>
                                                    </div>
                                                    {form.purchaserRole === 'admin' && <CheckCircle2 className="absolute -top-1.5 -right-1.5 h-4 w-4 text-emerald-500 bg-white rounded-full" />}
                                                </button>
                                            </div>

                                            {/* Adaptive Help Text based on Role */}
                                            {form.purchaserRole === 'admin' ? (
                                                <p className="text-[10px] text-indigo-600 leading-relaxed font-medium bg-indigo-100/50 p-2 rounded-lg">
                                                    Wspaniale! Wyślemy na Twój adres E-mail opłaconą Fakturę VAT oraz dedykowany "Link Aktywacyjny". Będziesz mogła swobodnie przekazać go nauczycielom, bez zaśmiecania swojego prywatnego konta niepotrzebnymi materiałami.
                                                </p>
                                            ) : (
                                                <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                                                    Twoje E-Konto otrzyma dostęp automatycznie zaraz po opłaceniu faktury.
                                                </p>
                                            )}

                                            {/* Institutional Toggle */}
                                            <div className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-100 rounded-xl">
                                                <Checkbox
                                                    id="is-institutional"
                                                    checked={form.isInstitutional}
                                                    onCheckedChange={v => handleChange('isInstitutional', !!v)}
                                                    className="w-5 h-5 border-amber-300 data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600"
                                                />
                                                <Label htmlFor="is-institutional" className="text-xs font-bold text-amber-900 cursor-pointer">
                                                    Specjalny wzór dla Placówki Oświatowej (Osobny Nabywca i Odbiorca)
                                                </Label>
                                            </div>

                                            {/* OCR Placeholder */}
                                            <div
                                                onClick={handleOcrScan}
                                                className="p-4 bg-slate-900 text-white rounded-xl border border-slate-700 flex items-center justify-between group cursor-pointer hover:bg-slate-800 transition-colors"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 bg-indigo-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                                        {isOcrLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Camera className="h-5 w-5" />}
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Szybkie uzupełnianie OCR</p>
                                                        <p className="text-[10px] text-slate-400">Pstryknij zdjęcie pieczątki lub druku</p>
                                                    </div>
                                                </div>
                                                <div className="text-[10px] font-black bg-indigo-600 px-2 py-1 rounded uppercase tracking-tighter">AI Vision</div>
                                            </div>

                                            {form.isInstitutional ? (
                                                <div className="space-y-6 pt-2 animate-in fade-in slide-in-from-top-2">
                                                    <div className="space-y-4">
                                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Dane Nabywcy (np. Gmina/Powiat)</h4>
                                                        <div className="relative">
                                                            <Input
                                                                id="buyerName" placeholder=" "
                                                                value={form.buyerName} onChange={e => handleChange('buyerName', e.target.value)}
                                                                className="peer h-14 w-full bg-slate-50 border-slate-200 rounded-xl px-4 pt-4 pb-1 text-base placeholder-transparent focus:bg-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all font-medium"
                                                            />
                                                            <Label htmlFor="buyerName" className="absolute left-4 top-2 text-[10px] uppercase font-black tracking-wider text-slate-400 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:normal-case peer-placeholder-shown:font-normal peer-focus:top-2 peer-focus:text-[10px] peer-focus:uppercase peer-focus:font-black">Nazwa Nabywcy</Label>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div className="relative">
                                                                <Input
                                                                    id="buyerNip" placeholder=" "
                                                                    value={form.buyerNip} onChange={e => handleChange('buyerNip', e.target.value)}
                                                                    className="peer h-14 w-full bg-slate-50 border-slate-200 rounded-xl px-4 pt-4 pb-1 text-base placeholder-transparent focus:bg-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all font-medium font-mono"
                                                                />
                                                                <Label htmlFor="buyerNip" className="absolute left-4 top-2 text-[10px] uppercase font-black tracking-wider text-slate-400 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:normal-case peer-placeholder-shown:font-normal peer-focus:top-2 peer-focus:text-[10px] peer-focus:uppercase peer-focus:font-black">NIP Nabywcy</Label>
                                                            </div>
                                                            <div className="relative">
                                                                <Input
                                                                    id="buyerStreet" placeholder=" "
                                                                    value={form.buyerStreet} onChange={e => handleChange('buyerStreet', e.target.value)}
                                                                    className="peer h-14 w-full bg-slate-50 border-slate-200 rounded-xl px-4 pt-4 pb-1 text-base placeholder-transparent focus:bg-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all font-medium"
                                                                />
                                                                <Label htmlFor="buyerStreet" className="absolute left-4 top-2 text-[10px] uppercase font-black tracking-wider text-slate-400 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:normal-case peer-placeholder-shown:font-normal peer-focus:top-2 peer-focus:text-[10px] peer-focus:uppercase peer-focus:font-black">Ulica i nr</Label>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-4">
                                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Dane Odbiorcy (Szkoła/Placówka)</h4>
                                                        <div className="relative">
                                                            <Input
                                                                id="recipientName" placeholder=" "
                                                                value={form.recipientName} onChange={e => handleChange('recipientName', e.target.value)}
                                                                className="peer h-14 w-full bg-slate-50 border-slate-200 rounded-xl px-4 pt-4 pb-1 text-base placeholder-transparent focus:bg-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all font-medium"
                                                            />
                                                            <Label htmlFor="recipientName" className="absolute left-4 top-2 text-[10px] uppercase font-black tracking-wider text-slate-400 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:normal-case peer-placeholder-shown:font-normal peer-focus:top-2 peer-focus:text-[10px] peer-focus:uppercase peer-focus:font-black">Nazwa Szkoły / Odbiorcy</Label>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div className="relative">
                                                                <Input
                                                                    id="recipientStreet" placeholder=" "
                                                                    value={form.recipientStreet} onChange={e => handleChange('recipientStreet', e.target.value)}
                                                                    className="peer h-14 w-full bg-slate-50 border-slate-200 rounded-xl px-4 pt-4 pb-1 text-base placeholder-transparent focus:bg-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all font-medium"
                                                                />
                                                                <Label htmlFor="recipientStreet" className="absolute left-4 top-2 text-[10px] uppercase font-black tracking-wider text-slate-400 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:normal-case peer-placeholder-shown:font-normal peer-focus:top-2 peer-focus:text-[10px] peer-focus:uppercase peer-focus:font-black">Ulica i nr</Label>
                                                            </div>
                                                            <div className="relative">
                                                                <Input
                                                                    id="recipientCity" placeholder=" "
                                                                    value={form.recipientCity} onChange={e => handleChange('recipientCity', e.target.value)}
                                                                    className="peer h-14 w-full bg-slate-50 border-slate-200 rounded-xl px-4 pt-4 pb-1 text-base placeholder-transparent focus:bg-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all font-medium"
                                                                />
                                                                <Label htmlFor="recipientCity" className="absolute left-4 top-2 text-[10px] uppercase font-black tracking-wider text-slate-400 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:normal-case peer-placeholder-shown:font-normal peer-focus:top-2 peer-focus:text-[10px] peer-focus:uppercase peer-focus:font-black">Miasto</Label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <Separator className="bg-slate-100" />
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="relative flex gap-2">
                                                        <div className="relative flex-1">
                                                            <Input
                                                                id="nip" placeholder=" "
                                                                value={form.nip} onChange={e => handleChange('nip', e.target.value)}
                                                                className="peer h-14 w-full bg-slate-50 border-slate-200 rounded-xl px-4 pt-4 pb-1 text-base placeholder-transparent focus:bg-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all font-medium font-mono"
                                                            />
                                                            <Label htmlFor="nip" className="absolute left-4 top-2 text-[10px] uppercase font-black tracking-wider text-slate-400 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:normal-case peer-placeholder-shown:font-normal peer-focus:top-2 peer-focus:text-[10px] peer-focus:uppercase peer-focus:font-black">NIP Firmy</Label>
                                                        </div>
                                                        <Button
                                                            type="button"
                                                            onClick={handleLookupNip}
                                                            disabled={isLookingUpNip || form.nip.length < 10}
                                                            className="h-14 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 font-bold"
                                                        >
                                                            {isLookingUpNip ? <Loader2 className="h-4 w-4 animate-spin" /> : "GUS"}
                                                        </Button>
                                                    </div>

                                                    {form.companyName && (
                                                        <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-sm font-medium text-emerald-800 animate-in fade-in">
                                                            {form.companyName}<br /><span className="text-emerald-600/70 font-normal">{form.street}, {form.city}</span>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* OMNIBUS COMPLIANT DYNAMIC ORDER BUMP OFFER */}
                            {activeBump && (
                                <div className="relative p-6 bg-slate-50 border-2 border-dashed border-indigo-200 rounded-2xl animate-in fade-in transition-all">
                                    <div className="absolute -top-3 left-6 px-3 py-1 bg-gradient-to-r from-amber-400 to-amber-500 text-[10px] font-black uppercase tracking-widest text-white rounded-full flex items-center gap-1 shadow-sm">
                                        <Zap className="h-3 w-3 fill-white" /> JEDNORAZOWA OFERTA
                                    </div>
                                    <Label className="flex items-start gap-4 cursor-pointer group mt-2">
                                        <div className="relative flex items-center pt-1 shrink-0">
                                            <Checkbox
                                                id="bump-offer"
                                                checked={bumpAccepted}
                                                onCheckedChange={v => setBumpAccepted(!!v)}
                                                className="w-6 h-6 rounded-md border-indigo-300 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600 data-[state=checked]:text-white shadow-inner transition-all"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start gap-4">
                                                <div className="flex gap-4">
                                                    {/* IMAGE THUMBNAIL */}
                                                    <div className="relative w-20 h-20 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                                                        {activeBump.image && (
                                                            <Image
                                                                src={activeBump.image}
                                                                alt={activeBump.title}
                                                                fill
                                                                className="object-cover"
                                                                unoptimized
                                                            />
                                                        )}
                                                    </div>

                                                    {/* TITLE AND STARS */}
                                                    <div className="flex flex-col justify-start">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="text-[10px] font-black uppercase text-indigo-600 tracking-wider bg-indigo-50 px-2 py-0.5 rounded-full">
                                                                {activeBump.badge}
                                                            </span>
                                                        </div>
                                                        <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight mb-1">{activeBump.title}</p>

                                                        {/* STAR RATING */}
                                                        <div className="flex items-center gap-1.5 mt-auto">
                                                            <div className="flex text-amber-400">
                                                                {[...Array(activeBump.stars)].map((_, i) => (
                                                                    <svg key={i} className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                                    </svg>
                                                                ))}
                                                            </div>
                                                            <span className="text-[10px] font-bold text-slate-500">({activeBump.reviews})</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* PRICING BLOCK */}
                                                <div className="text-right shrink-0 flex flex-col items-end gap-1">
                                                    <div className="flex items-center gap-1 bg-red-100/80 text-red-600 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest">
                                                        <span>RABAT -{Math.round(100 - (activeBump.price / activeBump.regularPrice * 100))}%</span>
                                                    </div>
                                                    <div className="flex items-baseline gap-2">
                                                        <p className="text-sm text-slate-400 line-through font-bold">{formatPrice(activeBump.regularPrice)}</p>
                                                        <p className="font-black text-indigo-600 text-2xl leading-none">+ {formatPrice(activeBump.price)}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <p className="text-xs text-slate-500 mt-4 leading-relaxed bg-white/50 p-2.5 rounded-lg">
                                                {activeBump.desc}
                                            </p>

                                            {/* OMNIBUS DIRECTIVE DISCLAIMER */}
                                            <div className="mt-3 pt-3 border-t border-indigo-100/50 flex items-center gap-1.5 text-[10px] text-slate-400">
                                                <span className="flex items-center justify-center w-3 h-3 rounded-full bg-slate-200 text-slate-500 font-bold shrink-0 leading-none pb-[1px]">i</span>
                                                <span>Najniższa cena z 30 dni przed obniżką: <span className="line-through">{formatPrice(activeBump.regularPrice)}</span></span>
                                            </div>
                                        </div>
                                    </Label>
                                </div>
                            )}

                            <Separator className="bg-slate-100" />

                            {/* SMART CONSENTS */}
                            <div className="space-y-4">
                                <Label className="flex items-start gap-3 cursor-pointer group">
                                    <div className="relative flex items-center pt-0.5">
                                        <Checkbox
                                            id="main-consent"
                                            checked={consents.main}
                                            onCheckedChange={v => setConsents(c => ({ ...c, main: !!v }))}
                                            className="w-5 h-5 rounded-md border-slate-300 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                                        />
                                    </div>
                                    <div className="text-xs text-slate-500 leading-relaxed font-medium">
                                        Rozumiem, że zamawiam treści cyfrowe i chcę otrzymać je od razu. Zgadzam się na dostarczenie ich przed upływem terminu na odstąpienie od umowy, co oznacza utratę prawa do zwrotu. Akceptuję <Link href={`/${language}/regulamin`} className="text-slate-900 underline hover:text-indigo-600">Regulamin</Link>.
                                    </div>
                                </Label>
                            </div>

                            {/* CTA BUTTON */}
                            <Button
                                type="submit"
                                disabled={isSubmitting || !consents.main}
                                className={`w-full h-16 rounded-2xl text-lg font-black tracking-wide transition-all duration-300 shadow-lg ${consents.main ? 'bg-emerald-500 hover:bg-emerald-600 hover:-translate-y-0.5 hover:shadow-emerald-500/25' : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'}`}
                            >
                                {isSubmitting ? (
                                    <><Loader2 className="h-6 w-6 animate-spin mr-3" /> PRZETWARZANIE...</>
                                ) : (
                                    <><Lock className="h-4 w-4 mr-2 opacity-70" /> KUPUJĘ I ODBIERAM MATERIAŁY <ExternalLink className="h-4 w-4 ml-2 opacity-50" /></>
                                )}
                            </Button>
                        </form>

                        <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-400 pt-2">
                            <ShieldCheck className="h-4 w-4" /> Twoje połączenie jest szyfrowane i w 100% bezpieczne.
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Order Summary (Product-First Value Building) */}
                    <div className="flex-1 w-full lg:max-w-md">
                        <div className="sticky top-8 bg-white rounded-[2rem] p-6 sm:p-8 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] border border-slate-100/50">

                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6">Podsumowanie koszyka</h3>

                            {/* GAMIFICATION PROGRESS BAR */}
                            <div className="mb-8 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-xs font-bold text-slate-600">
                                        {amountToBonus > 0
                                            ? `Brakuje ${formatPrice(amountToBonus)} do nagrody`
                                            : <span className="text-emerald-600 flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5" /> PREZENT ODBLOKOWANY!</span>}
                                    </span>
                                    <span className="text-[10px] uppercase font-black tracking-widest text-amber-500 flex items-center gap-1">
                                        <Zap className="h-3 w-3 fill-amber-500" /> Wirtualny Prezent
                                    </span>
                                </div>
                                <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-700 ease-out"
                                        style={{ width: `${progressPercentage}%` }}
                                    />
                                </div>
                                {amountToBonus > 0 && (
                                    <p className="text-[10px] text-slate-400 mt-2 text-center w-full block">Darmowy dostęp do bazy "Super Nauczyciela" (wartość 99 zł)</p>
                                )}
                            </div>

                            <div className="space-y-6">
                                {cart.items.map(item => (
                                    <div key={item.productId} className="flex gap-4 group">
                                        <div className="relative w-24 h-24 rounded-2xl bg-slate-50 overflow-hidden shrink-0 border border-slate-100 shadow-sm border-b-2">
                                            {item.image && (
                                                <Image
                                                    src={item.image}
                                                    alt={item.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            )}
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between py-1">
                                            <div>
                                                <p className="font-bold text-slate-900 leading-tight line-clamp-2">{item.title}</p>
                                                {item.quantity > 1 && <span className="text-xs font-black text-indigo-600 mt-1 block">Ilość: {item.quantity}</span>}
                                            </div>
                                            <p className="font-black text-lg text-slate-900">{formatPrice((item.salePrice ?? item.price) * item.quantity)}</p>
                                        </div>
                                    </div>
                                ))}
                                {(bumpAccepted && activeBump) && (
                                    <div className="flex gap-4 group animate-in slide-in-from-top-2 fade-in">
                                        <div className="relative w-24 h-24 rounded-2xl bg-indigo-50 border-2 border-indigo-100 overflow-hidden shrink-0 flex items-center justify-center text-indigo-300">
                                            <Zap className="h-8 w-8 fill-indigo-200" />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between py-1">
                                            <div>
                                                <p className="font-bold text-slate-900 leading-tight">{activeBump.title.replace('Dodaj ', '')}</p>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500 mt-1 block">OFERTA SPECJALNA</span>
                                            </div>
                                            <div className="flex items-baseline gap-2 mt-auto">
                                                <p className="text-xs text-slate-400 line-through font-bold">{formatPrice(activeBump.regularPrice)}</p>
                                                <p className="font-black text-lg text-slate-900">{formatPrice(activeBump.price)}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <Separator className="my-8 bg-slate-100" />

                            {/* Totals */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-slate-500 font-medium">
                                    <span>Wartość produktów</span>
                                    <span>{formatPrice(cartSubtotalWithBump)}</span>
                                </div>
                                {cart.couponDiscount > 0 && (
                                    <div className="flex justify-between text-emerald-500 font-bold">
                                        <span>Zniżka (Kupon)</span>
                                        <span>-{formatPrice(cart.couponDiscount)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between items-end pt-4 mt-2 border-t border-slate-100">
                                    <span className="font-bold text-slate-900">Do zapłaty:</span>
                                    <span className="text-3xl font-black tracking-tight text-slate-900">{formatPrice(cartTotalWithBump)}</span>
                                </div>
                            </div>

                            {/* Value Reinforcement (Behaviorally Targeted) */}
                            <div className="mt-8 bg-indigo-50/50 rounded-2xl p-5 space-y-3 border border-indigo-100/50">
                                <div className="flex items-center gap-3 text-sm font-bold text-indigo-900">
                                    <div className="bg-indigo-100 p-1.5 rounded-full"><Zap className="h-4 w-4 text-indigo-600" /></div>
                                    Natychmiastowy dostęp 24/7
                                </div>
                                <div className="flex items-center gap-3 text-sm font-bold text-indigo-900">
                                    <div className="bg-indigo-100 p-1.5 rounded-full"><Download className="h-4 w-4 text-indigo-600" /></div>
                                    {userBurnoutLevel >= 7
                                        ? "Oszczędzisz minimum 3 godziny pracy w ten weekend."
                                        : "Format gotowy do druku (PDF)"}
                                </div>
                                <div className="flex items-center gap-3 text-sm font-bold text-indigo-900">
                                    <div className="bg-indigo-100 p-1.5 rounded-full"><ThumbsUp className="h-4 w-4 text-indigo-600" /></div>
                                    {userBurnoutLevel >= 7
                                        ? "Odciąż zszargane nerwy, zaufaj gotowcom."
                                        : "Materiały przetestowane w klasie"}
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>

            {/* EXIT-INTENT / SMART B2B MODAL */}
            {showExitIntent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2rem] max-w-md w-full p-8 shadow-2xl relative animate-in zoom-in-95 duration-500 overflow-y-auto max-h-[90vh]">
                        <button
                            onClick={() => setShowExitIntent(false)}
                            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors"
                        >
                            ✕
                        </button>

                        {(showInvoice && form.nip.length >= 10) ? (
                            <>
                                {/* B2B EXIT INTENT MODAL (School/Employer Funding) */}
                                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                                    <Building className="h-8 w-8 text-indigo-600" />
                                </div>
                                <h2 className="text-2xl font-black text-center text-slate-900 mb-2">Poczekaj na dyrekcję!</h2>
                                <p className="text-slate-500 text-center mb-6 text-sm">
                                    Ponieważ kupujesz na fakturę, zablokowaliśmy Twój koszyk i jednorazowe zniżki na <strong>48 godzin</strong>. Przekaż link dyrektorowi – księgowość opłaci zamówienie przelewem na podstawie proformy, a Ty od razu dostaniesz dostęp.
                                </p>

                                {b2bLink ? (
                                    <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4 text-center mb-6 animate-in fade-in">
                                        <p className="text-xs font-bold text-emerald-700 uppercase tracking-widest mb-2">Twój ukryty link B2B</p>
                                        <div className="flex items-center gap-2 bg-white rounded-lg p-3 border border-emerald-100 shadow-inner">
                                            <span className="truncate flex-1 text-slate-600 font-mono text-[10px] text-left">{b2bLink}</span>
                                            <button
                                                onClick={() => navigator.clipboard.writeText(b2bLink)}
                                                className="p-2 bg-emerald-100 text-emerald-700 rounded-md hover:bg-emerald-200 shrink-0 font-bold text-xs"
                                            >
                                                KOPIUJ
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mb-6">
                                        <Button
                                            onClick={() => setB2bLink(`https://sklep.kamilaenglish.com/faktura/b2b-pay-${Math.random().toString(36).substring(2, 9)}`)}
                                            className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold"
                                        >
                                            <Download className="h-4 w-4 mr-2" /> GENERUJ LINK DO FAKTURY
                                        </Button>
                                    </div>
                                )}

                                <Button
                                    onClick={() => router.push(`/${language}/cart`)}
                                    variant="outline"
                                    className="w-full h-12 rounded-xl font-bold border-slate-200 text-slate-500 hover:text-slate-900"
                                >
                                    WRÓĆ DO KOSZYKA
                                </Button>
                            </>
                        ) : (
                            <>
                                {/* STANDARD B2C EXIT INTENT MODAL */}
                                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                                    <Zap className="h-8 w-8 text-red-600" />
                                </div>
                                <h2 className="text-2xl font-black text-center text-slate-900 mb-2">Zaczekaj! Zanim wyjdziesz...</h2>
                                <p className="text-slate-500 text-center mb-6">
                                    Wiemy, że budżet bywa napięty. Dlatego chcemy wręczyć Ci jednorazowy kod, dzięki któremu zyskasz trochę uśmiechu na weekend.
                                </p>
                                <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-4 text-center mb-6">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Poczęstuj się kodem</p>
                                    <p className="text-2xl font-black text-indigo-600 tracking-wider">MAM_ZACHETE_10%</p>
                                </div>
                                <Button
                                    onClick={() => setShowExitIntent(false)}
                                    className="w-full h-14 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-lg"
                                >
                                    WRACAM PO ZAKUPY!
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* FOMO EXCLUSIVE BAR */}
            {showFomoTimer && (
                <div className="fixed bottom-0 left-0 w-full bg-slate-900 text-white py-3 px-4 z-40 text-sm font-bold flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
                    <span className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-amber-500" />
                        Twój koszyk jest zabezpieczony przez:
                    </span>
                    <span className="bg-white/10 px-3 py-1 rounded-full text-amber-400 font-mono tracking-wider tabular-nums">
                        {Math.floor(timeLeft / 60).toString().padStart(2, '0')}:{(timeLeft % 60).toString().padStart(2, '0')}
                    </span>
                    <span className="hidden sm:inline font-normal text-slate-400">Po tym czasie wraca do głównej puli sklepu.</span>
                </div>
            )}
        </main>
    );
}

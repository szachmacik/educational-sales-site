"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { ShieldCheck, Lock, Truck, RefreshCw, Eye, ShoppingCart, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/language-provider";

const STORAGE_KEY = "admin_full_settings";

/**
 * TrustBadgeBar Component
 * Displays security and guarantee badges to build trust.
 */
export function TrustBadgeBar() {
    const { t } = useLanguage();
    const [enabled, setEnabled] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const settings = JSON.parse(stored);
                setEnabled(settings.marketing?.trustBadgesEnabled ?? true);
            } catch (e) {
                setEnabled(true);
            }
        } else {
            setEnabled(true);
        }
    }, []);

    if (!enabled) return null;

    const badges = [
        { icon: ShieldCheck, text: "Secure Payment" },
        { icon: RefreshCw, text: "Instant Download" },
        { icon: Lock, text: "Privacy Protected" },
        { icon: Info, text: "Teacher Verified" }
    ];

    return (
        <div className="flex flex-wrap items-center gap-4 py-4 border-y border-border/50 my-6">
            {badges.map((badge, i) => (
                <div key={i} className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <badge.icon className="h-4 w-4 text-primary" />
                    {badge.text}
                </div>
            ))}
        </div>
    );
}

/**
 * FOMOPopup Component
 * Shows "Recent purchase" alerts to create social proof.
 */
export function FOMOPopup() {
    const { t, language } = useLanguage();
    const pathname = usePathname();
    const isShopPage = /\/(products|cart|checkout|pay)(\/?|\/.+)?$/.test(pathname || '');
    const [show, setShow] = useState(false);
    const [enabled, setEnabled] = useState(false);
    const [currentInfo, setCurrentInfo] = useState({ name: "", city: "", time: "", product: "" });

    const fomoData = t.fomo || {
        names: ["Anna", "Mark", "Sarah", "Elena", "Christopher", "Johanna", "Luca"],
        cities: ["Warsaw", "London", "Berlin", "Paris", "Prague", "Madrid", "Rome"]
    };

    const sampleProducts = [
        "English Mega Pack",
        "Starter Kit",
        "Grammar Masterclass",
        "Vocabulary Flashcards",
        "Lesson Plans Bundle"
    ];

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const settings = JSON.parse(stored);
                setEnabled(settings.marketing?.fomoEnabled ?? true);
            } catch (e) {
                setEnabled(true);
            }
        } else {
            setEnabled(true);
        }
    }, []);

    useEffect(() => {
        if (!enabled) return;

        const showRandom = () => {
            const name = fomoData.names[Math.floor(Math.random() * fomoData.names.length)];
            const city = fomoData.cities[Math.floor(Math.random() * fomoData.cities.length)];
            const time = Math.floor(Math.random() * 55) + 5;
            const product = sampleProducts[Math.floor(Math.random() * sampleProducts.length)];

            setCurrentInfo({
                name,
                city,
                time: (t.fomo?.timeAgo || "{time} min ago").replace("{time}", time.toString()),
                product
            });
            setShow(true);

            setTimeout(() => setShow(false), 5000);
        };

        const timer = setInterval(showRandom, 20000); // Show every 20s
        return () => clearInterval(timer);
    }, [enabled, fomoData, t.fomo]);

    if (!enabled || !show || !isShopPage) return null;

    return (
        <div className="fixed bottom-4 left-4 z-[100] animate-in fade-in slide-in-from-bottom-10 duration-500">
            <div className="bg-background/95 backdrop-blur border border-border rounded-xl shadow-2xl p-4 flex items-center gap-4 max-w-sm">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <ShoppingCart className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <p className="text-sm font-semibold">
                        {(t.fomo?.purchaseMessage || "{name} from {city}")
                            .replace("{name}", currentInfo.name)
                            .replace("{city}", currentInfo.city)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        {(t.fomo?.productMessage || "Just purchased {product}")
                            .replace("{product}", currentInfo.product)}
                    </p>
                    <p className="text-[10px] text-primary/70 font-medium mt-1">
                        {currentInfo.time}
                    </p>
                </div>
            </div>
        </div>
    );
}

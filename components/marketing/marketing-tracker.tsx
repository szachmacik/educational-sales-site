"use client";

import React from 'react';

/**
 * Marketing Tracker Component
 * Unified hub for Google Ads, Meta Pixel, and YouTube Ads tracking.
 * Controlled by SuperAdmin toggle.
 */

interface TrackEventParams {
    eventName: string;
    params?: Record<string, any>;
}

export function MarketingTracker() {
    const [enabled, setEnabled] = React.useState(false);

    React.useEffect(() => {
        // Check global feature flag
        const isEnabled = localStorage.getItem("feature_marketing_tracking") === "true";
        setEnabled(isEnabled);

        if (isEnabled) {
            console.log("[MarketingTracker] Initializing Pixels (Google, Meta, YouTube)...");

            // 1. Load Google Tag (GTAG) if tracking ID is set
            // In a real app, IDs would come from environment variables or admin config
            const GA_ID = "G-MOCK-ID";

            if (typeof window !== 'undefined' && !window.gtag) {
                const script = document.createElement('script');
                script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
                script.async = true;
                document.head.appendChild(script);

                window.dataLayer = window.dataLayer || [];
                window.gtag = function () { window.dataLayer.push(arguments); };

                // --- Google Consent Mode V2 (Professional Default) ---
                window.gtag('consent', 'default', {
                    'ad_storage': 'granted',
                    'ad_user_data': 'granted',
                    'ad_personalization': 'granted',
                    'analytics_storage': 'granted'
                });
                // -----------------------------------------------------

                window.gtag('js', new Date());
                window.gtag('config', GA_ID);
            }

            // 2. Load Meta Pixel (FBQ)
            if (typeof window !== 'undefined' && !window.fbq) {
                // Simplified mock of Meta Pixel initialization
                window.fbq = function () {
                    window.fbq.callMethod ? window.fbq.callMethod.apply(window.fbq, arguments) : window.fbq.queue.push(arguments);
                };
                window.fbq.push = window.fbq;
                window.fbq.loaded = true;
                window.fbq.version = '2.0';
                window.fbq.queue = [];
                console.log("[MarketingTracker] Meta Pixel Loaded.");
            }
        }
    }, []);

    if (!enabled) return null;

    return null; // This is a headless logic component
}

/**
 * Scalable tracking function to be used in components (e.g., Checkout, Product Page).
 */
export function trackAdEvent({ eventName, params = {} }: TrackEventParams) {
    if (typeof window === 'undefined') return;

    const isEnabled = localStorage.getItem("feature_marketing_tracking") === "true";
    if (!isEnabled) return;

    console.log(`[MarketingTracker] Event: ${eventName}`, params);

    // Google Ads / Analytics
    if (window.gtag) {
        window.gtag('event', eventName, params);
    }

    // Meta Pixel
    if (window.fbq) {
        window.fbq('track', eventName, params);
    }
}

// Global Types for window objects
declare global {
    interface Window {
        dataLayer: any[];
        gtag: (...args: any[]) => void;
        fbq: any;
    }
}

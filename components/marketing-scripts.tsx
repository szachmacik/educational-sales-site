"use client";

import Script from "next/script";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Marketing IDs (Replace with real ones in .env.local)
const TIKTOK_PIXEL_ID = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID || "DEMO_TIKTOK_ID";
const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || "AW-DEMO_ADS_ID";

/**
 * Global Marketing Tracker
 * Handles TikTok, Google Ads, and YT Integration.
 */
export function MarketingScripts() {
    const pathname = usePathname();

    useEffect(() => {
        // Track PageView on route change
        if (typeof window !== "undefined" && (window as any).ttq) {
            (window as any).ttq.page();
        }
        if (typeof window !== "undefined" && (window as any).gtag) {
            (window as any).gtag('config', GOOGLE_ADS_ID, {
                page_path: pathname,
            });
        }
    }, [pathname]);

    return (
        <>
            {/* TikTok Pixel */}
            <Script id="tiktok-pixel" strategy="afterInteractive">
                {`
                !function (w, d, t) {
                    w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","detach","updateConfig"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n;var o=d.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=d.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
                    ttq.load('${TIKTOK_PIXEL_ID}');
                    ttq.page();
                }(window, document, 'ttq');
                `}
            </Script>

            {/* Google Ads / YouTube Tag */}
            <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
                strategy="afterInteractive"
            />
            <Script id="google-ads-gtag" strategy="afterInteractive">
                {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GOOGLE_ADS_ID}');
                `}
            </Script>
        </>
    );
}

/**
 * Unified event tracker for marketing pixels
 */
export function trackMarketingEvent(eventName: string, data: any) {
    if (typeof window === "undefined") return;

    // TikTok
    if ((window as any).ttq) {
        (window as any).ttq.track(eventName, data);
    }

    // Google / YT
    if ((window as any).gtag) {
        (window as any).gtag('event', eventName, data);
    }

    console.log(`📊 [Marketing Tracker] Event: ${eventName}`, data);
}

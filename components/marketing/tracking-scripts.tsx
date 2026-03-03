"use client";

import { useEffect } from "react";
import Script from "next/script";

export function TrackingScripts() {
    useEffect(() => {
        const stored = localStorage.getItem("admin_full_settings");
        if (!stored) return;

        try {
            const settings = JSON.parse(stored);
            if (!settings.marketing?.trackingEnabled) return;

            // 1. Google Analytics
            if (settings.marketing.ga4) {
                const gaId = settings.marketing.ga4;
                const script1 = document.createElement('script');
                script1.async = true;
                script1.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
                document.head.appendChild(script1);

                const script2 = document.createElement('script');
                script2.innerHTML = `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${gaId}');
                `;
                document.head.appendChild(script2);
            }

            // 2. Facebook Pixel
            if (settings.marketing.fbPixel) {
                const pixelId = settings.marketing.fbPixel;
                const script = document.createElement('script');
                script.innerHTML = `
                    !function(f,b,e,v,n,t,s)
                    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                    n.queue=[];t=b.createElement(e);t.async=!0;
                    t.src=v;s=b.getElementsByTagName(e)[0];
                    s.parentNode.insertBefore(t,s)}(window, document,'script',
                    'https://connect.facebook.net/en_US/fbevents.js');
                    fbq('init', '${pixelId}');
                    fbq('track', 'PageView');
                `;
                document.head.appendChild(script);
            }

            // 3. Meta Verification
            if (settings.marketing.metaVerification) {
                const meta = document.createElement('meta');
                meta.name = "facebook-domain-verification";
                meta.content = settings.marketing.metaVerification;
                document.head.appendChild(meta);
            }

            // 4. Google Search Console
            if (settings.marketing.gsc) {
                const meta = document.createElement('meta');
                meta.name = "google-site-verification";
                meta.content = settings.marketing.gsc;
                document.head.appendChild(meta);
            }

            // 5. Microsoft Clarity (Heatmaps - High Performance)
            if (settings.marketing.clarityId) {
                const clarityId = settings.marketing.clarityId;
                const script = document.createElement('script');
                script.innerHTML = `
                    (function(c,l,a,r,i,t,y){
                        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                    })(window, document, "clarity", "script", "${clarityId}");
                `;
                document.head.appendChild(script);
            }

            // 6. Hotjar (Alt Heatmaps)
            if (settings.marketing.hotjarId) {
                const hjid = settings.marketing.hotjarId;
                const hjsv = settings.marketing.hotjarSnippetVersion || 6;
                const script = document.createElement('script');
                script.innerHTML = `
                    (function(h,o,t,j,a,r){
                        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                        h._hjSettings={hjid:${hjid},hjsv:${hjsv}};
                        a=o.getElementsByTagName('head')[0];
                        r=o.createElement('script');r.async=1;
                        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                        a.appendChild(r);
                    })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
                `;
                document.head.appendChild(script);
            }

        } catch (e) {
            console.error("Tracking scripts initialization failed:", e);
        }
    }, []);

    return null;
}

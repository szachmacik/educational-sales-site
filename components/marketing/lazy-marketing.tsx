'use client';

/**
 * Lazy-loaded marketing components to reduce initial bundle size.
 * These components are not critical for first render and can be deferred.
 */
import dynamic from 'next/dynamic';

export const LazyFOMOPopup = dynamic(
    () => import('./growth-tools').then(m => ({ default: m.FOMOPopup })),
    { ssr: false }
);

export const LazyExitIntentPopup = dynamic(
    () => import('./premium-growth').then(m => ({ default: m.ExitIntentPopup })),
    { ssr: false }
);

export const LazyMarketingTracker = dynamic(
    () => import('./marketing-tracker').then(m => ({ default: m.MarketingTracker })),
    { ssr: false }
);

export const LazyTrackingScripts = dynamic(
    () => import('./tracking-scripts').then(m => ({ default: m.TrackingScripts })),
    { ssr: false }
);

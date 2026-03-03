
export const dynamic = 'force-dynamic';

import React from "react"
import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ProgressProvider } from '@/lib/progress-context'
import { CartProvider } from '@/lib/cart-context'
import { LanguageProvider } from '@/components/language-provider'
import { TokenProvider } from '@/lib/token-context'
import { FeatureProvider } from '@/lib/feature-context'
import { Toaster } from "@/components/ui/toaster"
import { Toaster as SonnerToaster } from "sonner"
import { TrackingScripts } from "@/components/marketing/tracking-scripts"
import { MarketingScripts } from "@/components/marketing-scripts"
import { AICrawlerHints } from "@/components/seo/ai-crawler-hints"
import { FOMOPopup } from "@/components/marketing/growth-tools"
import { AnnouncementBar, ExitIntentPopup } from "@/components/marketing/premium-growth"
import { MarketingTracker } from "@/components/marketing/marketing-tracker"
import { CookieBanner } from "@/components/legal/cookie-banner"
import '../globals.css'
import fs from 'fs/promises';
import path from 'path';

const _playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" });
const _inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const LANGUAGES = ['pl', 'en', 'uk', 'de', 'es', 'fr', 'it', 'cs', 'sk', 'ro', 'hu', 'pt', 'lt', 'lv', 'et', 'hr', 'sr', 'sl', 'bg', 'el', 'nl', 'sv', 'fi', 'no', 'da'];

async function getCommonDictionary(lang: string) {
  if (!LANGUAGES.includes(lang)) {
    return null;
  }
  try {
    // Load common by default for all pages
    const filePath = path.join(process.cwd(), 'public', 'locales', lang, 'common.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error(`Could not load common dictionary for ${lang}`, error);
    return null;
  }
}

export async function generateStaticParams() {
  return LANGUAGES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const t = await getCommonDictionary(lang);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://kamila.shor.dev';

  // Construct alternate links for all languages (International SEO)
  const languageAlternates: Record<string, string> = {
    'x-default': `${baseUrl}/en`,
  };

  LANGUAGES.forEach(l => {
    languageAlternates[l] = `${baseUrl}/${l}`;
  });

  return {
    title: t?.seo?.title || 'Educational Materials for English Teachers | Kamila Łobko-Koziej',
    description: t?.seo?.description || 'Creative teaching materials, lesson plans, year-round projects and ready-made packages for English language teachers.',
    generator: 'v0.app',
    metadataBase: new URL(baseUrl),
    icons: {
      icon: [
        { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
        { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
        { url: '/icon.svg', type: 'image/svg+xml' },
      ],
      apple: '/apple-icon.png',
    },
    alternates: {
      canonical: `${baseUrl}/${lang}`,
      languages: languageAlternates
    },
    openGraph: {
      title: t?.seo?.title || 'Materials for English Teachers',
      description: t?.seo?.description || 'Creative educational materials, lesson plans and teaching resources.',
      url: `${baseUrl}/${lang}`,
      siteName: 'Kamila Łobko-Koziej',
      locale: lang,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t?.seo?.title || 'Materials for English Teachers',
      description: t?.seo?.description || 'Creative educational materials, lesson plans and teaching resources.',
    }
  }
}

export default async function LocaleLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode,
  params: Promise<{ lang: string }>
}>) {
  const { lang } = await params;
  // Only load common everywhere. Sub-layouts will load specific namespaces.
  const dictionary = await getCommonDictionary(lang);

  return (
    <html lang={lang}>
      <head>
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://connect.facebook.net" />
        <link rel="dns-prefetch" href="https://www.clarity.ms" />
        <link rel="dns-prefetch" href="https://static.hotjar.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://connect.facebook.net" crossOrigin="anonymous" />
      </head>
      <body
        className={`${_playfair.variable} ${_inter.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <CartProvider>
          <ProgressProvider>
            <LanguageProvider lang={lang} dictionary={dictionary}>
              <AnnouncementBar />
              <TrackingScripts />
              <MarketingScripts />
              <AICrawlerHints />
              <FOMOPopup />
              <ExitIntentPopup />
              <MarketingTracker />
              <TokenProvider>
                <FeatureProvider>
                  {children}
                  <CookieBanner />
                  <Toaster />
                  <SonnerToaster position="top-center" expand={true} richColors />
                </FeatureProvider>
              </TokenProvider>
            </LanguageProvider>
          </ProgressProvider>
        </CartProvider>
        <Analytics />
      </body>
    </html>
  )
}

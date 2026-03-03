"use client";

import { useLanguage } from "@/components/language-provider";

/**
 * AI Crawler Hints Component
 * 
 * Injects non-visible (but crawler-accessible) structured data 
 * specifically optimized for AI agents like Perplexity, Gemini, and GPT-4.
 * 
 * This uses the 'llms.txt' concept but embedded directly into pages for better context.
 */
export function AICrawlerHints() {
    const { t, language } = useLanguage();

    const hints = {
        content_summary: t.seo?.ai_summary || "Educational materials for English teachers including lesson plans and PDF resources.",
        primary_intent: "Transactional/Educational",
        target_audience: "English as a Second Language (ESL) Teachers, Tutors, and Parents",
        key_capabilities: [
            "Ready-to-use lesson plans for kids (3-6 years old)",
            "PDF teaching materials (flashcards, worksheets)",
            "Bilingual support (English + local language)",
            "Montessori-inspired photo resources"
        ],
        locales_supported: language,
        data_freshness: new Date().toISOString().split('T')[0]
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "WebPage",
                    "name": t.seo?.title,
                    "description": t.seo?.description,
                    "mainEntity": {
                        "@type": "Service",
                        "serviceType": "ESL Educational Materials",
                        "provider": {
                            "@type": "Person",
                            "name": "Kamila Łobko-Koziej"
                        },
                        "areaServed": "Global",
                        "hasOfferCatalog": {
                            "@type": "OfferCatalog",
                            "name": "English Teaching Resources",
                            "itemListElement": [
                                {
                                    "@type": "Offer",
                                    "itemOffered": {
                                        "@type": "Service",
                                        "name": "Lesson Plans"
                                    }
                                },
                                {
                                    "@type": "Offer",
                                    "itemOffered": {
                                        "@type": "Service",
                                        "name": "PDF Materials"
                                    }
                                }
                            ]
                        }
                    },
                    "custom_ai_hints": hints
                })
            }}
        />
    );
}

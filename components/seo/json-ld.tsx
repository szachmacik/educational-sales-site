/**
 * JSON-LD Structured Data components for SEO
 * Implements Schema.org markup for better search engine understanding
 */

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://kamilaenglish.ofshore.dev';

interface OrganizationSchemaProps {
    lang?: string;
}

export function OrganizationSchema({ lang = 'pl' }: OrganizationSchemaProps) {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Kamila English',
        url: `${BASE_URL}/${lang}`,
        logo: `${BASE_URL}/brand-logo.png`,
        image: `${BASE_URL}/kamila-lobko-koziej.jpg`,
        description: 'Materiały edukacyjne do nauki angielskiego dla nauczycieli i dzieci. Scenariusze zajęć, pakiety PDF, kursy online.',
        founder: {
            '@type': 'Person',
            name: 'Kamila Łobko-Koziej',
            jobTitle: 'Nauczyciel języka angielskiego',
        },
        sameAs: [
            'https://www.facebook.com/kamilaenglish',
            'https://www.instagram.com/kamilaenglish',
        ],
        contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'customer service',
            availableLanguage: ['Polish', 'English'],
        },
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

export function WebSiteSchema({ lang = 'pl' }: { lang?: string }) {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Kamila English',
        url: `${BASE_URL}/${lang}`,
        potentialAction: {
            '@type': 'SearchAction',
            target: {
                '@type': 'EntryPoint',
                urlTemplate: `${BASE_URL}/${lang}/products?q={search_term_string}`,
            },
            'query-input': 'required name=search_term_string',
        },
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

interface ProductSchemaProps {
    name: string;
    description: string;
    price: string;
    image?: string;
    slug: string;
    lang?: string;
    currency?: string;
    availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
}

export function ProductSchema({
    name,
    description,
    price,
    image,
    slug,
    lang = 'pl',
    currency = 'PLN',
    availability = 'InStock',
}: ProductSchemaProps) {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name,
        description,
        image: image ? `${BASE_URL}${image}` : `${BASE_URL}/placeholder.jpg`,
        url: `${BASE_URL}/${lang}/products/${slug}`,
        brand: {
            '@type': 'Brand',
            name: 'Kamila English',
        },
        offers: {
            '@type': 'Offer',
            price: parseFloat(price).toFixed(2),
            priceCurrency: currency,
            availability: `https://schema.org/${availability}`,
            url: `${BASE_URL}/${lang}/products/${slug}`,
            seller: {
                '@type': 'Organization',
                name: 'Kamila English',
            },
        },
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

interface BreadcrumbSchemaProps {
    items: Array<{ name: string; url: string }>;
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url,
        })),
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

interface FAQSchemaProps {
    questions: Array<{ question: string; answer: string }>;
}

export function FAQSchema({ questions }: FAQSchemaProps) {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: questions.map(({ question, answer }) => ({
            '@type': 'Question',
            name: question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: answer,
            },
        })),
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

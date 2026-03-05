import { MetadataRoute } from 'next';
import { getProducts } from '@/lib/product-service';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://kamilaenglish.ofshore.dev';

const SUPPORTED_LANGS = [
    'pl', 'en', 'uk', 'de', 'es', 'fr', 'it', 'cs', 'sk', 'ro',
    'hu', 'pt', 'lt', 'lv', 'et', 'hr', 'sr', 'sl', 'bg', 'el',
    'nl', 'sv', 'fi', 'no', 'da'
];

const STATIC_ROUTES = [
    '',
    '/products',
    '/blog',
    '/faq',
    '/contact',
    '/jak-kupic',
    '/polityka-prywatnosci',
    '/polityka-cookies',
    '/regulamin',
    '/zwroty',
];

export default function sitemap(): MetadataRoute.Sitemap {
    const entries: MetadataRoute.Sitemap = [];

    // Static pages for all languages
    for (const lang of SUPPORTED_LANGS) {
        for (const route of STATIC_ROUTES) {
            const url = `${BASE_URL}/${lang}${route}`;
            entries.push({
                url,
                lastModified: new Date(),
                changeFrequency: route === '' ? 'daily' : route === '/products' ? 'weekly' : 'monthly',
                priority: route === '' ? 1.0 : route === '/products' ? 0.9 : 0.7,
                alternates: {
                    languages: Object.fromEntries(
                        SUPPORTED_LANGS.map(l => [l, `${BASE_URL}/${l}${route}`])
                    ),
                },
            });
        }
    }

    // Product pages for all languages
    const products = getProducts('pl');
    for (const lang of SUPPORTED_LANGS) {
        for (const product of products) {
            if (product.slug) {
                entries.push({
                    url: `${BASE_URL}/${lang}/products/${product.slug}`,
                    lastModified: new Date(),
                    changeFrequency: 'weekly',
                    priority: 0.8,
                    alternates: {
                        languages: Object.fromEntries(
                            SUPPORTED_LANGS.map(l => [l, `${BASE_URL}/${l}/products/${product.slug}`])
                        ),
                    },
                });
            }
        }
    }

    return entries;
}

import { slugify } from "@/lib/slugify";
import { Language } from "@/lib/translations";
import { PRODUCT_TRANSLATIONS } from "@/lib/product-translations-data";
import productsData from './data/products.json';

// Define the shape of our product based on products.json + runtime properties
export interface ProductWithSlug {
    id: string;
    title: string;
    description: string;
    price: number;
    pricePLN?: number; // From products.json
    priceEUR?: number; // From products.json
    url: string;
    categories: string[];
    image: string;
    slug: string;
    stock: number;
    tags: string[];
    teachingMode?: 'online' | 'stationary' | 'hybrid';
    modules?: any[]; // For compatibility with dashboard if needed
    translations?: {
        [key: string]: {
            title: string;
            description: string;
            image?: string;
        }
    };
    source?: {
        url: string;
        importedAt: string;
        aiEnhanced: boolean;
        embedHtml?: string;
    };
}

export function getProducts(language: Language = 'pl'): ProductWithSlug[] {
    return productsData.map((product: any) => {
        // 1. Extract consistent slug from URL or use properties
        // Matching logic: from /product/SLUG/ or fallback
        const match = product.url.match(/\/product\/([^\/]+)\/?$/);
        const slug = match ? match[1] : slugify(product.title);

        // 2. Handle translations
        let title = product.title;
        let description = product.description;

        // Check for generated translations in the JSON itself
        let image = product.image || "/placeholder.svg";

        if (language !== 'pl' && product.translations && product.translations[language]) {
            title = product.translations[language].title || title;
            description = product.translations[language].description || description;
            image = product.translations[language].image || image;
        }

        // Check for external translations (legacy support)
        const externalTrans = PRODUCT_TRANSLATIONS[slug]?.[language];

        if (language !== 'pl') {
            // 1. Try target language from external file
            if (externalTrans) {
                title = externalTrans.title || title;
                description = externalTrans.description || description;
            }
            // 2. Fallback to English if target language missing and current language is not English
            else if (language !== 'en') {
                const enTrans = PRODUCT_TRANSLATIONS[slug]?.['en'];
                if (enTrans) {
                    title = enTrans.title || title;
                    description = enTrans.description || description;
                }
            }
        }

        return {
            ...product,
            title,
            description,
            image,
            slug,
            stock: product.stock || 99,
            tags: product.categories || [],
            price: typeof product.price === 'string' ? parseFloat(product.price) : product.price
        };
    });
}

export function getProductBySlug(slug: string, language: Language = 'pl'): ProductWithSlug | undefined {
    return getProducts(language).find(p => p.slug === slug);
}

export function getRelatedProducts(category: string, currentSlug: string, limit = 4, language: Language = 'pl'): ProductWithSlug[] {
    return getProducts(language)
        .filter(p => p.categories?.includes(category) && p.slug !== currentSlug)
        .slice(0, limit);
}

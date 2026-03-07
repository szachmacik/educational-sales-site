import { slugify } from "@/lib/slugify"
import { Language } from "@/lib/translations"
import { PRODUCT_TRANSLATIONS } from "@/lib/product-translations-data"
import productsData from "./data/products.json"

/**
 * Raw product shape as stored in products.json.
 * Extended at runtime with computed `slug` and normalized fields.
 */
interface RawProduct {
    id: string
    title: string
    description: string
    price: number | string
    pricePLN?: number
    priceEUR?: number
    url: string
    categories: string[]
    image?: string
    stock?: number
    tags?: string[]
    teachingMode?: "online" | "stationary" | "hybrid"
    modules?: unknown[]
    translations?: Record<
        string,
        { title?: string; description?: string; image?: string }
    >
    source?: {
        url: string
        importedAt: string
        aiEnhanced: boolean
        embedHtml?: string
    }
}

/**
 * A product enriched with a URL slug and normalized runtime fields.
 * Returned by all product service functions.
 */
export interface ProductWithSlug {
    id: string
    title: string
    description: string
    price: number
    pricePLN?: number
    priceEUR?: number
    url: string
    categories: string[]
    image: string
    slug: string
    stock: number
    tags: string[]
    teachingMode?: "online" | "stationary" | "hybrid"
    modules?: unknown[]
    translations?: Record<
        string,
        { title?: string; description?: string; image?: string }
    >
    source?: {
        url: string
        importedAt: string
        aiEnhanced: boolean
        embedHtml?: string
    }
}

/**
 * Returns all products, optionally translated into the requested language.
 *
 * Translation priority:
 * 1. Inline translations stored in `products.json` under `translations[language]`
 * 2. External translations from `PRODUCT_TRANSLATIONS` (legacy support)
 * 3. English fallback when target language is missing
 * 4. Original Polish title/description as final fallback
 *
 * Slugs are always generated from the Polish title for URL consistency.
 *
 * @param language - BCP-47 language code (default: `'pl'`)
 * @returns Array of products with computed slugs and localized content
 */
export function getProducts(language: Language = "pl"): ProductWithSlug[] {
    return (productsData as RawProduct[]).map((product) => {
        // Always generate slug from Polish title for consistency with all links
        const slug = slugify(product.title)

        let title = product.title
        let description = product.description
        let image = product.image || "/placeholder.svg"

        // 1. Try inline translations from products.json
        if (
            language !== "pl" &&
            product.translations &&
            product.translations[language]
        ) {
            title = product.translations[language].title || title
            description = product.translations[language].description || description
            image = product.translations[language].image || image
        }

        // 2. Try external translations file (legacy support)
        const externalTrans = PRODUCT_TRANSLATIONS[slug]?.[language]

        if (language !== "pl") {
            if (externalTrans) {
                title = externalTrans.title || title
                description = externalTrans.description || description
            } else if (language !== "en") {
                // 3. Fallback to English if target language is missing
                const enTrans = PRODUCT_TRANSLATIONS[slug]?.["en"]
                if (enTrans) {
                    title = enTrans.title || title
                    description = enTrans.description || description
                }
            }
        }

        return {
            ...product,
            title,
            description,
            image,
            slug,
            stock: product.stock ?? 99,
            tags: product.categories || [],
            price:
                typeof product.price === "string"
                    ? parseFloat(product.price)
                    : product.price,
        }
    })
}

/**
 * Finds a single product by its URL slug.
 *
 * @param slug - URL slug generated from the product's Polish title
 * @param language - BCP-47 language code for content translation (default: `'pl'`)
 * @returns The matching product or `undefined` if not found
 *
 * @example
 * const product = getProductBySlug("mega-pack-2w1")
 * const enProduct = getProductBySlug("mega-pack-2w1", "en")
 */
export function getProductBySlug(
    slug: string,
    language: Language = "pl"
): ProductWithSlug | undefined {
    return getProducts(language).find((p) => p.slug === slug)
}

/**
 * Returns products related to a given category, excluding the current product.
 *
 * @param category - Category identifier to filter by (e.g., `'speaking'`)
 * @param currentSlug - Slug of the current product to exclude from results
 * @param limit - Maximum number of related products to return (default: `4`)
 * @param language - BCP-47 language code for content translation (default: `'pl'`)
 * @returns Array of related products, up to `limit` items
 *
 * @example
 * const related = getRelatedProducts("speaking", "mega-pack-2w1", 3, "en")
 */
export function getRelatedProducts(
    category: string,
    currentSlug: string,
    limit = 4,
    language: Language = "pl"
): ProductWithSlug[] {
    return getProducts(language)
        .filter(
            (p) => p.categories?.includes(category) && p.slug !== currentSlug
        )
        .slice(0, limit)
}

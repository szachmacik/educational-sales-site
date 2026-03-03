import { ProductWithSlug } from './product-service';

export interface ExternalProduct {
    externalId: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    weight?: number;
    imageUrl?: string;
}

/**
 * Universal Sync Adapter for Baselinker / Wholesale
 */
export async function syncExternalProducts(source: 'baselinker' | 'wholesale'): Promise<void> {
    console.log(`🔄 [Sync Service] Starting sync from ${source}...`);

    // In production, this would be an actual API call
    // await fetch('https://api.baselinker.com/connector.php', ...);

    const mockExternalData: ExternalProduct[] = [
        {
            externalId: "ext_123",
            name: "Fizyczny Zestaw Kart Obrazkowych - Animals",
            description: "Wysokiej jakości laminowane karty do nauki angielskiego.",
            price: 49.99,
            stock: 15,
            weight: 0.5,
            imageUrl: "/products/flashcards-animals.jpg"
        }
    ];

    // Map external data to internal format
    const internalProducts: Partial<ProductWithSlug>[] = mockExternalData.map(ext => ({
        id: ext.externalId,
        title: ext.name,
        description: ext.description,
        price: ext.price,
        stock: ext.stock,
        image: ext.imageUrl || "/placeholder.svg",
        categories: ["physical", "flashcards"],
        tags: ["physical", "new"],
        slug: ext.name.toLowerCase().replace(/ /g, '-'),
        source: {
            url: `https://${source}.kamila.shor.dev/p/${ext.externalId}`,
            importedAt: new Date().toISOString(),
            aiEnhanced: false
        }
    }));

    console.log(`✅ [Sync Service] Successfully mapped ${internalProducts.length} products from ${source}.`);

    // Here we would save to products.json or a real DB
    // await saveProducts(internalProducts);
}

/**
 * Updates stock levels for physical items.
 */
export async function updateStockFromExternal(productId: string): Promise<number> {
    // Simulated stock check
    const newStock = Math.floor(Math.random() * 20);
    console.log(`📦 [Stock Sync] Product ${productId} updated to ${newStock} units.`);
    return newStock;
}

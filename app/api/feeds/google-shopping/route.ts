import { NextResponse } from 'next/server';
import { getProducts } from '@/lib/product-service';

/**
 * Generates an XML Feed for Google Merchant Center / Google Shopping.
 */
export async function GET() {
    // 0. Safety check for feature flag
    if (typeof window === 'undefined') {
        // Since this is a server-side route, we can't check localStorage directly.
        // In a real app we'd check a DB or a restricted config.
        // For this demo, we check if the feed is enabled via a mock check or param.
    }

    const products = await getProducts();
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kamilaenglish.com';

    const xmlItems = products.map(product => {
        const isPhysical = product.categories?.some(c =>
            ['zestawy', 'gry-planszowe', 'pakiety-fizyczne', 'toys', 'physical'].includes(c.toLowerCase())
        );

        // Map our product to Google Shopping fields
        return `
        <item>
            <g:id>${product.id}</g:id>
            <g:title>${product.title}</g:title>
            <g:description>${product.description.substring(0, 5000).replace(/<[^>]*>?/gm, '')}</g:description>
            <link>${baseUrl}/pl/products/${product.slug}</link>
            <g:image_link>${baseUrl}${product.image}</g:image_link>
            <g:condition>${isPhysical ? 'new' : 'new'}</g:condition>
            <g:availability>${product.stock > 0 ? 'in stock' : 'out of stock'}</g:availability>
            <g:price>${product.price} PLN</g:price>
            <g:google_product_category>${isPhysical ? 'Media > Books > Physical Books' : 'Media > Books > Educational Books'}</g:google_product_category>
            <g:brand>Kamila English</g:brand>
            <g:identifier_exists>no</g:identifier_exists>
            <g:shipping>
                <g:country>PL</g:country>
                <g:service>Standard</g:service>
                <g:price>${isPhysical ? '15.00 PLN' : '0.00 PLN'}</g:price>
            </g:shipping>
            <g:product_type>${product.categories?.join(' > ')}</g:product_type>
        </item>`;
    }).join('');

    const xml = `<?xml version="1.0"?>
    <rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
        <channel>
            <title>Kamila English Store - Google Shopping Feed</title>
            <link>${baseUrl}</link>
            <description>Educational materials for teachers and kids.</description>
            ${xmlItems}
        </channel>
    </rss>`;

    return new NextResponse(xml, {
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 's-maxage=3600, stale-while-revalidate',
        },
    });
}

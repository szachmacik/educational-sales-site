
import { NextRequest, NextResponse } from "next/server";

interface ScrapedProduct {
    title: string;
    description: string;
    price: string;
    image: string;
    url: string;
}

// This API route scrapes products from a WordPress/WP Idea store
export async function POST(request: NextRequest) {
    try {
        const { url } = await request.json();

        if (!url) {
            return NextResponse.json({ error: "URL is required" }, { status: 400 });
        }

        // Fetch the page content
        const response = await fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            },
        });

        if (!response.ok) {
            return NextResponse.json(
                { error: `Failed to fetch URL: ${response.status}` },
                { status: 500 }
            );
        }

        const html = await response.text();
        const products: ScrapedProduct[] = [];

        // Parse products from WP Idea HTML structure
        // Look for product patterns in the HTML
        const productRegex = /<h2[^>]*>([^<]+)<\/h2>[\s\S]*?(\d+(?:\.\d{2})?)\s*PLN[\s\S]*?href="([^"]+product[^"]+)"/gi;

        let match;
        const seen = new Set<string>();

        while ((match = productRegex.exec(html)) !== null) {
            const title = match[1].trim();
            const price = match[2];
            const productUrl = match[3];

            // Skip duplicates
            if (seen.has(productUrl)) continue;
            seen.add(productUrl);

            // Skip category links
            if (productUrl.includes('/category/')) continue;

            products.push({
                title,
                description: `Educational materials for English teachers. ${title}.`,
                price,
                image: `https://placehold.co/400x300/3b82f6/ffffff?text=${encodeURIComponent(title.slice(0, 20))}`,
                url: productUrl,
            });
        }

        // If regex didn't work well, try alternative parsing
        if (products.length === 0) {
            // Fallback: parse known patterns from the HTML
            const titleMatches = html.matchAll(/<a[^>]*href="([^"]*\/product\/[^"]+)"[^>]*>([^<]+)<\/a>/gi);
            const priceMatches = html.matchAll(/(\d+(?:\.\d{2})?)\s*(?:PLN|zł)/gi);

            const prices = Array.from(priceMatches).map(m => m[1]);
            let priceIndex = 0;

            for (const titleMatch of titleMatches) {
                const productUrl = titleMatch[1];
                const title = titleMatch[2].trim();

                // Skip category and tag links
                if (productUrl.includes('/category/') || productUrl.includes('/tag/')) continue;
                if (seen.has(productUrl)) continue;
                if (title.length < 5) continue;

                seen.add(productUrl);

                products.push({
                    title,
                    description: `Educational materials for English teachers. ${title}.`,
                    price: prices[priceIndex] || "0",
                    image: `https://placehold.co/400x300/3b82f6/ffffff?text=${encodeURIComponent(title.slice(0, 20))}`,
                    url: productUrl,
                });

                priceIndex++;
            }
        }

        return NextResponse.json({
            success: true,
            products,
            count: products.length,
        });
    } catch (error) {
        console.error("Scrape error:", error);
        return NextResponse.json(
            { error: "Failed to scrape products" },
            { status: 500 }
        );
    }
}

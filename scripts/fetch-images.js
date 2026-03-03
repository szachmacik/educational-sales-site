
const fs = require('fs');
const path = require('path');
const https = require('https');

// Read the TS file directly (simplified parsing since we know the structure)
const productsPath = path.join(__dirname, '../lib/linguachess-products.ts');
const content = fs.readFileSync(productsPath, 'utf8');

// Parse the array of products from the file content
// We need to be careful with the parsing as it's a TS file
// We'll extract the LINGUACHESS_PRODUCTS array content
const match = content.match(/export const LINGUACHESS_PRODUCTS: LinguachessProduct\[\] = \[\s*([\s\S]*?)\];/);
if (!match) {
    console.error("Could not find LINGUACHESS_PRODUCTS array");
    process.exit(1);
}

// Helper to fetch URL content
function fetchUrl(url) {
    return new Promise((resolve, reject) => {
        https.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' }
        }, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', reject);
    });
}

// Helper to extract image from HTML
function extractImage(html, productUrl) {
    // Look for Open Graph image first
    const ogImage = html.match(/<meta property="og:image"\s+content="([^"]+)"/i);
    if (ogImage && !ogImage[1].includes('emoji') && !ogImage[1].includes('fbcdn') && !ogImage[1].includes('B-22') && !ogImage[1].includes('logo-')) {
        return ogImage[1];
    }

    // Look for WooCommerce/WP main product image
    // Typically <img ... class="... wp-post-image ..." src="...">
    const wpImage = html.match(/<img[^>]*class="[^"]*wp-post-image[^"]*"[^>]*src="([^"]+)"/i);
    if (wpImage && !wpImage[1].includes('B-22')) return wpImage[1];

    // Look for first large image in content, avoiding placeholders and sidebar garbage
    const imgMatches = html.matchAll(/<img[^>]*src="([^"]+)"[^>]*>/gi);
    for (const m of imgMatches) {
        const src = m[1];
        if (src.includes('uploads') &&
            !src.includes('100x100') &&
            !src.includes('150x150') &&
            !src.includes('300x300') && // Avoid thumbnails if possible? Maybe not, keep them as fallback?
            !src.includes('emoji') &&
            !src.includes('logo') &&
            !src.includes('B-22') &&
            !src.includes('icon')
        ) {
            return src;
        }
    }

    return null;
}

async function updateImages() {
    // We can't eval the TS content directly. Let's parse it block by block manually or use a regex to identify items.
    // Simpler: Use the list of URLs if we can extract them, or regex-replace the file content directly.

    // Strategy: 
    // 1. Find all `url: "..."` occurrences.
    // 2. Fetch each URL.
    // 3. Find `image: "..."` line after that URL or insert it if missing.
    // 4. Update the file content with the new image.

    let newContent = content;
    const urlRegex = /url:\s*"(https?:\/\/[^"]+)"/g;
    let urlMatch;

    // We'll collect updates to apply them
    // Finding all URLs first
    const productsToUpdate = [];
    while ((urlMatch = urlRegex.exec(content)) !== null) {
        productsToUpdate.push({
            fullMatch: urlMatch[0],
            url: urlMatch[1],
            index: urlMatch.index
        });
    }

    console.log(`Found ${productsToUpdate.length} products to check...`);

    for (const p of productsToUpdate) {
        console.log(`Fetching ${p.url}...`);
        try {
            const html = await fetchUrl(p.url);
            const image = extractImage(html, p.url);

            if (image) {
                console.log(`  Found image: ${image}`);

                // Find the image line associated with this product
                // We search from the URL index forward until the next object start or end
                const chunkStart = p.index;
                const chunkEnd = content.indexOf('}', chunkStart);
                const chunk = content.substring(chunkStart, chunkEnd);

                // Check if image property exists in this chunk
                if (chunk.includes('image:')) {
                    // Replace existing image
                    const newChunk = chunk.replace(/image:\s*"[^"]*"/, `image: "${image}"`);
                    newContent = newContent.replace(chunk, newChunk);
                } else {
                    // Insert image after category (convention in this file)
                    // Or finding the end of the object
                    const insertPos = newContent.indexOf('url:', chunkStart);
                    // Let's insert it after URL for simplicity if not present
                    // Actually, standard is after category. Let's find category line.
                    const catRegex = /category:\s*"[^"]*"/;
                    const catMatch = chunk.match(catRegex);

                    if (catMatch) {
                        const originalCat = catMatch[0];
                        const newCat = `${originalCat},\n        image: "${image}"`;
                        // Need to be careful with global replace, use explicit ranges if possible
                        // But since we are modifying newContent, the indices shift.
                        // Better to use strings.

                        // We need a unique identifer for the block. 
                        // The URL is unique.
                        const urlLine = `url: "${p.url}"`;
                        const blockStart = newContent.indexOf(urlLine);
                        if (blockStart !== -1) {
                            // Find the closing brace of this object
                            const blockEnd = newContent.indexOf('}', blockStart);
                            let block = newContent.substring(blockStart, blockEnd);

                            if (!block.includes('image:')) {
                                // Append image
                                block = block + `,\n        image: "${image}"`;
                                newContent = newContent.substring(0, blockStart) + block + newContent.substring(blockEnd);
                            } else {
                                // Update image
                                block = block.replace(/image:\s*"[^"]*"/, `image: "${image}"`);
                                newContent = newContent.substring(0, blockStart) + block + newContent.substring(blockEnd);
                            }
                        }
                    }
                }
            } else {
                console.log("  No suitable image found.");
            }
        } catch (e) {
            console.error(`  Error fetching ${p.url}: ${e.message}`);
        }

        // Small delay to be nice
        await new Promise(r => setTimeout(r, 200));
    }

    fs.writeFileSync(productsPath, newContent);
    console.log("Done updating images.");
}

updateImages();

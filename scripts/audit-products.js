
const fs = require('fs');
const path = require('path');
const https = require('https');

const productsPath = path.join(__dirname, '../lib/linguachess-products.ts');
let content = fs.readFileSync(productsPath, 'utf8');

// Helper to fetch URL content
function fetchUrl(url) {
    return new Promise((resolve, reject) => {
        const req = https.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
            }
        }, (res) => {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                // Follow redirect
                fetchUrl(res.headers.location).then(resolve).catch(reject);
                return;
            }
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => resolve(data));
        });
        req.on('error', reject);
        req.setTimeout(10000, () => {
            req.destroy();
            reject(new Error("Timeout"));
        });
    });
}

function extractPrice(html) {
    // WooCommerce price extraction
    // <span class="woocommerce-Price-amount amount"><bdi>199,00&nbsp;<span class="woocommerce-Price-currencySymbol">zł</span></bdi></span>

    // Regex for: digit+ [,.] digit{2}
    // We look for patterns like 199,00 or 199.00 followed by zł or PLN

    const priceRegex = /<span[^>]*amount[^>]*>.*?(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?).*?(?:zł|PLN).*?<\/span>/s;
    const match = html.match(priceRegex);

    if (match) {
        // Normalize: 199,00 -> 199.00
        return match[1].replace(',', '.').replace(/\s/g, '');
    }

    // Fallback: look for generic price pattern inside any price class
    const fallbackRegex = /class="price"[^>]*>.*?(\d+[.,]\d{2}).*?</s;
    const fallbackMatch = html.match(fallbackRegex);
    if (fallbackMatch) {
        return fallbackMatch[1].replace(',', '.');
    }

    return null;
}

function extractImage(html) {
    // Same logic as before but refined
    const ogImage = html.match(/<meta property="og:image"\s+content="([^"]+)"/i);
    if (ogImage && !ogImage[1].includes('emoji') && !ogImage[1].includes('fbcdn') && !ogImage[1].includes('B-22') && !ogImage[1].includes('logo-')) {
        return ogImage[1];
    }

    const wpImage = html.match(/<img[^>]*class="[^"]*wp-post-image[^"]*"[^>]*src="([^"]+)"/i);
    // wpImage is highly reliable for the main product image usually
    if (wpImage && !wpImage[1].includes('B-22')) return wpImage[1];

    const imgMatches = html.matchAll(/<img[^>]*src="([^"]+)"[^>]*>/gi);
    for (const m of imgMatches) {
        const src = m[1];
        if (src.includes('uploads') &&
            !src.includes('100x100') &&
            !src.includes('150x150') &&
            !src.includes('300x300') &&
            !src.includes('emoji') &&
            !src.includes('logo') &&
            !src.includes('B-22') &&
            !src.includes('icon') &&
            (src.endsWith('.jpg') || src.endsWith('.png') || src.endsWith('.jpeg'))
        ) {
            return src;
        }
    }

    return null;
}

async function run() {
    console.log("Starting product audit...");

    // Find all product blocks in the TS file
    // We iterate using regex to find URL lines, then process the surrounding block

    const urlRegex = /url:\s*"(https?:\/\/[^"]+)"/g;
    let match;
    const products = [];

    while ((match = urlRegex.exec(content)) !== null) {
        products.push({
            url: match[1],
            index: match.index
        });
    }

    console.log(`Found ${products.length} products.`);

    let updatedCount = 0;

    for (const p of products) {
        console.log(`Checking ${p.url}...`);
        try {
            const html = await fetchUrl(p.url);

            const price = extractPrice(html);
            const image = extractImage(html);

            // Note: Replace logic needs to be careful.
            // We find the block for this product in 'content' (which we are updating progressively? No, better to do one pass or be very careful with indices)
            // Actually, simply replacing unique strings in the whole file is risky if there are duplicates.
            // But URLs are unique. 

            // Let's grab the block around the URL.
            // Search backwards for '{' and forwards for '}'
            // This is brittle with regex but works for this specific file structure

            // Better approach: regex replace for the specifc URL block.
            // We search for the URL in current `content` text to get fresh index
            const currentUrlIndex = content.indexOf(`url: "${p.url}"`);
            if (currentUrlIndex === -1) continue;

            // Find start of object (searching backwards)
            let blockStart = content.lastIndexOf('{', currentUrlIndex);
            // Find end of object
            // Careful with nested objects (translations). 
            // We assume 'url' is at the top level of the product object.
            // We count braces.

            let braceCount = 1;
            let blockEnd = blockStart + 1;
            while (braceCount > 0 && blockEnd < content.length) {
                if (content[blockEnd] === '{') braceCount++;
                if (content[blockEnd] === '}') braceCount--;
                blockEnd++;
            }

            let block = content.substring(blockStart, blockEnd);
            let newBlock = block;

            if (price) {
                console.log(`  Price found: ${price}`);
                // Replace price line
                if (newBlock.includes('price:')) {
                    newBlock = newBlock.replace(/price:\s*"[^"]*"/, `price: "${price}"`);
                }
            } else {
                console.log("  Price NOT found");
            }

            if (image) {
                console.log(`  Image found: ${image}`);
                if (newBlock.includes('image:')) {
                    newBlock = newBlock.replace(/image:\s*"[^"]*"/, `image: "${image}"`);
                } else {
                    // Insert image after url
                    newBlock = newBlock.replace(/url:\s*"[^"]*",/, `url: "${p.url}",\n        image: "${image}",`);
                }
            }

            if (block !== newBlock) {
                content = content.replace(block, newBlock);
                updatedCount++;
            }

        } catch (e) {
            console.error(`  Failed: ${e.message}`);
        }

        // Rate limit
        await new Promise(r => setTimeout(r, 200));
    }

    fs.writeFileSync(productsPath, content);
    console.log(`Updated ${updatedCount} products.`);
}

run();

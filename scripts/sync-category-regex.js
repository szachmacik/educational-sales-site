
const fs = require('fs');
const path = require('path');
const https = require('https');

const productsPath = path.join(__dirname, '../lib/linguachess-products.ts');
let content = fs.readFileSync(productsPath, 'utf8');

const CATEGORY_URL = 'https://www.sklep.linguachess.com/index.php/product/category/materialy-dla-nauczycieli/';

// Helper to fetch URL content
function fetchUrl(url) {
    return new Promise((resolve, reject) => {
        const req = https.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        }, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => resolve(data));
        });
        req.on('error', reject);
    });
}

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function run() {
    console.log(`Fetching category page: ${CATEGORY_URL}`);
    const html = await fetchUrl(CATEGORY_URL);
    console.log(`HTML Length: ${html.length}`);

    // Regex to capture key info from product blocks
    // We look for:
    // 1. Image src inside wp-post-image
    // 2. Product URL inside box_glowna_tytul

    // Since they are in the same block, we can try to iterate over the whole html string looking for the pattern 'box-wrapper' ... 'wp-post-image' ... 'box_glowna_tytul'
    // But HTML order might vary.
    // The previous HTML dump showed: Image div first, then Title div.

    // blockRegex:
    // <div class="col-sm-12 box-wrapper" ...> (start)
    // ...
    // <img ... src="IMAGE" ...>
    // ...
    // <div class="box_glowna_tytul"> ... <a href="URL">

    // Simplified block capture: capture from box-wrapper to box_glowna_tytul closure
    // We'll capture a larger chunk and parse inside

    // Strategy: Split by "col-sm-12 box-wrapper" again, but verify with regex inside loop

    const parts = html.split('class="col-sm-12 box-wrapper"');
    console.log(`Split parts: ${parts.length}`);

    let match;
    let found = 0;
    let updatedCount = 0;

    for (let i = 1; i < parts.length; i++) {
        const block = parts[i];

        // Find image src
        // <img ... src="..." ... class="...wp-post-image..." ...>
        // OR
        // <img ... class="...wp-post-image..." ... src="..." ...>

        // We just look for an img tag that has 'wp-post-image' in its class, and capture its src.
        // It's easier to match the whole img tag first, then check.

        const imgTagMatch = block.match(/<img[^>]+>/);
        if (!imgTagMatch) continue;

        const imgTag = imgTagMatch[0];
        if (!imgTag.includes('wp-post-image')) continue;

        const srcMatch = imgTag.match(/src="([^"]+)"/);
        if (!srcMatch) continue;

        const imageUrl = srcMatch[1];

        // Find Product URL
        // <div class="box_glowna_tytul"> ... <a href="...">
        const titleBlockMatch = block.match(/class="box_glowna_tytul"[\s\S]*?<a[^>]+href="([^"]+)"/);
        if (!titleBlockMatch) continue;

        const productUrl = titleBlockMatch[1];

        found++;

        console.log(`Found: ${productUrl} | IMG: ${imageUrl}`);

        if (imageUrl.includes('B-22') || imageUrl.includes('placeholder')) {
            continue;
        }

        // Normalize URLs
        const normalize = (u) => u.replace(/\/$/, '').trim();
        const targetUrl = normalize(productUrl);

        // Sanity check: Ensure targetUrl is effectively searched
        const escapedUrl = escapeRegExp(targetUrl);
        // Regex to find url property in JS file
        const urlRegex = new RegExp(`url:\\s*"${escapedUrl}/?"`, 'g');

        const fileMatch = urlRegex.exec(content);

        if (fileMatch) {
            console.log("   -> Found in file");
            // Search backwards for {
            let encStart = content.lastIndexOf('{', fileMatch.index);
            // Search forwards for matching }
            let braceCount = 0;
            let encEnd = -1;

            for (let k = encStart; k < content.length; k++) {
                if (content[k] === '{') braceCount++;
                if (content[k] === '}') braceCount--;
                if (braceCount === 0 && k > encStart) {
                    encEnd = k;
                    break;
                }
            }

            if (encStart !== -1 && encEnd !== -1) {
                const objectContent = content.substring(encStart, encEnd + 1);

                let newObjectContent = objectContent;
                if (objectContent.includes('image:')) {
                    newObjectContent = objectContent.replace(/image:\s*"[^"]*"/, `image: "${imageUrl}"`);
                } else {
                    const urlString = fileMatch[0];
                    newObjectContent = objectContent.replace(urlString, `${urlString},\n        image: "${imageUrl}"`);
                }

                if (newObjectContent !== objectContent) {
                    content = content.replace(objectContent, newObjectContent);
                    updatedCount++;
                    console.log(`   -> Updated!`);
                }
            }
        }
    }

    console.log(`Found ${found} matches.`);

    if (updatedCount > 0) {
        fs.writeFileSync(productsPath, content);
        console.log(`Total saved updates: ${updatedCount}`);
    } else {
        console.log("No updates needed.");
    }
}

run();

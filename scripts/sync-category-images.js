
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

async function run() {
    console.log(`Fetching category page: ${CATEGORY_URL}`);
    const html = await fetchUrl(CATEGORY_URL);

    // Regex to find product blocks
    // We look for box-wrapper and capture content until the next box-wrapper or end of container
    // Structure:
    // <div class="col-sm-12 box-wrapper" ...>
    //   ...
    //   <div class="glowna_box_zdjecie ...">
    //      <a ...> <img ... src="IMAGE_URL" ...> </a>
    //   </div>
    //   <div class="box_glowna_tytul">
    //      <a href="PRODUCT_URL"> ... </a>
    //   </div>

    // We will use a global regex to find each "glowna_box_zdjecie" block which contains the image, 
    // and usually the title link is nearby.

    // Actually, let's find the image URL and the product link URL which are in the same '.box' container.
    // Since regex is stateless, we'll iterate through matches of valid product blocks.

    // Strategy: Match the start of a box, then find the image src, then find the product url.

    // Split by "box-wrapper" to isolate products
    const productBlocks = html.split('class="col-sm-12 box-wrapper"');
    console.log(`Found ${productBlocks.length - 1} potential product blocks`);

    let updatedCount = 0;

    // Skip the first split chunk (header stuff)
    for (let i = 1; i < productBlocks.length; i++) {
        const block = productBlocks[i];

        // Extract Image
        const imgMatch = block.match(/<img[^>]*class="[^"]*wp-post-image[^"]*"[^>]*src="([^"]+)"/);
        if (!imgMatch) continue;
        const imageUrl = imgMatch[1];

        // Extract Product URL
        const urlMatch = block.match(/<div class="box_glowna_tytul">\s*<a href="([^"]+)"/);
        if (!urlMatch) continue;
        const productUrl = urlMatch[1];

        console.log(`Found: ${productUrl}`);
        console.log(`   Image: ${imageUrl}`);

        if (imageUrl.includes('B-22') || imageUrl.includes('placeholder')) {
            console.log("   Skipping placeholder image.");
            continue;
        }

        // Normalize URLs for comparison (remove trailing slashes)
        const normalize = (u) => u.replace(/\/$/, '').trim();
        const targetUrl = normalize(productUrl);

        // Find in file content
        // naive string search might fail if formatting differs.
        // Let's use regex that allows for optional trailing slash in the file content

        // We construct a regex to find: url: "MATCH_URL/?"
        const escapedUrl = escapeRegExp(targetUrl);
        const urlRegex = new RegExp(`url:\\s*"${escapedUrl}/?"`, 'g');

        const match = urlRegex.exec(content);

        if (match) {
            console.log("   Found in file!");
            const urlIndex = match.index;

            // Determine the boundaries of the object
            // search backwards for '{'
            let encStart = content.lastIndexOf('{', urlIndex);

            // search forwards for '}' but be careful of nested braces (translations might have them)
            // We count braces starting from encStart
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

                // Check if current image is already good?
                // Actually, just overwrite if we found a good one on the category page

                let newObjectContent = objectContent;
                if (objectContent.includes('image:')) {
                    newObjectContent = objectContent.replace(/image:\s*"[^"]*"/, `image: "${imageUrl}"`);
                } else {
                    // Add image after url
                    // We use the exact string matched for URL to replace
                    const urlString = match[0]; // e.g. url: "..."
                    newObjectContent = objectContent.replace(urlString, `${urlString},\n        image: "${imageUrl}"`);
                }

                if (newObjectContent !== objectContent) {
                    content = content.replace(objectContent, newObjectContent);
                    updatedCount++;
                    console.log(`   Updated image to: ${imageUrl}`);
                } else {
                    console.log("   Image already up to date.");
                }
            }
        } else {
            console.log(`   NOT FOUND in file: ${targetUrl}`);
        }

    }

    fs.writeFileSync(productsPath, content);
    console.log(`Total updated: ${updatedCount}`);
}

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

run();

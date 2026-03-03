
const https = require('https');

const BASE_URL = 'https://www.sklep.linguachess.com/index.php/product/category/materialy-dla-nauczycieli/page/';
const FIRST_PAGE_URL = 'https://www.sklep.linguachess.com/index.php/product/category/materialy-dla-nauczycieli/';

function fetchUrl(url) {
    return new Promise((resolve, reject) => {
        const req = https.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        }, (res) => {
            if (res.statusCode !== 200) {
                // If 404, we are done
                resolve(null);
                return;
            }
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => resolve(data));
        });
        req.on('error', reject);
    });
}

async function run() {
    let page = 1;
    let productsFound = 0;

    while (true) {
        const url = page === 1 ? FIRST_PAGE_URL : `${BASE_URL}${page}/`;
        console.log(`Scanning page ${page}: ${url}`);

        const html = await fetchUrl(url);

        if (!html || html.includes('Ta strona nie została znaleziona') || html.includes('404 Not Found')) {
            console.log("No more pages.");
            break;
        }

        // Extract products
        const productBoxRegex = /<div class="col-sm-12 box-wrapper"[\s\S]*?<\/div>\s*<\/div>/g;
        // Or simpler split
        const parts = html.split('class="col-sm-12 box-wrapper"');

        if (parts.length <= 1) {
            console.log("No products found on this page.");
            break;
        }

        console.log(`  Found ${parts.length - 1} items.`);

        for (let i = 1; i < parts.length; i++) {
            const block = parts[i];

            const titleMatch = block.match(/class="box_glowna_tytul"[\s\S]*?<a href="([^"]+)" >\s*<h2>([\s\S]*?)<\/h2>/);
            const url = titleMatch ? titleMatch[1] : 'Unknown';
            const title = titleMatch ? titleMatch[2].trim() : 'Unknown';

            const priceMatch = block.match(/class="glowna_box_cena_cena">([\d\.\,]+)<\/p>/);
            let price = priceMatch ? priceMatch[1].replace(',', '.') : '0.00';

            const floatPrice = parseFloat(price);

            if (floatPrice > 300) {
                console.log(`  [$$$] HIGH PRICE ITEM: ${title} | ${price} PLN | ${url}`);
            }

            if (title.toLowerCase().includes('mega pack')) {
                console.log(`  [MEGA] MEGA PACK FOUND: ${title} | ${price} PLN | ${url}`);
            }

            productsFound++;
        }

        page++;
        // Safety break
        if (page > 10) break;
    }
    console.log(`Total scanned: ${productsFound}`);
}

run();

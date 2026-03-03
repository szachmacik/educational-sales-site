
const https = require('https');

const CATEGORY_URL = 'https://www.sklep.linguachess.com/index.php/product/category/materialy-dla-nauczycieli/';

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

    // We want to find: Title, Price, URL
    // Structure:
    // <div class="col-sm-12 box-wrapper">
    // ...
    //   <div class="box_glowna_tytul"> <a href="URL">Title</a> ...
    // ...
    //   <p class="glowna_box_cena_cena">199.00</p>

    // We should look for all price matches and print them out to find the 420 and 307 ones.

    const productBoxRegex = /<div class="col-sm-12 box-wrapper"([\s\S]*?)<\/div>\s*<\/div>/g;

    let match;
    let found = 0;

    // Regex defaults
    // Title: <div class="box_glowna_tytul">\s*<a href="([^"]+)" >\s*<h2>(.*?)<\/h2>
    // Price: <p class="glowna_box_cena_cena">([\d\.\,]+)<\/p>

    // Let's iterate manually using split to be safer
    const parts = html.split('class="col-sm-12 box-wrapper"');

    console.log(`Found ${parts.length - 1} products.`);

    for (let i = 1; i < parts.length; i++) {
        const block = parts[i];

        // Title & URL
        const titleMatch = block.match(/class="box_glowna_tytul"[\s\S]*?<a href="([^"]+)" >\s*<h2>([\s\S]*?)<\/h2>/);
        const url = titleMatch ? titleMatch[1] : 'Unknown URL';
        const title = titleMatch ? titleMatch[2].trim() : 'Unknown Title';

        // Price
        const priceMatch = block.match(/class="glowna_box_cena_cena">([\d\.\,]+)<\/p>/);
        let price = priceMatch ? priceMatch[1] : '???';

        // Normalize price
        price = price.replace(',', '.');

        console.log(`Product: ${title}`);
        console.log(`  URL: ${url}`);
        console.log(`  Price: ${price}`);
        console.log('---');

        if (parseFloat(price) > 300 && parseFloat(price) < 320) {
            console.log("!!! FOUND CANDIDATE FOR 307 PLN !!!");
        }
        if (parseFloat(price) > 400) {
            console.log("!!! FOUND HIGH PRICE ITEM (MegaPack?) !!!");
        }
    }
}

run();

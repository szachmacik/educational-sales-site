
const https = require('https');

const URLS = [
    {
        price: '420.00',
        url: 'https://www.sklep.linguachess.com/index.php/product/super-pakiet-2w1-pakiet-wszystkie-scenariusze-zajec-pakiet-4-pory-roku/'
    },
    {
        price: '307.00',
        url: 'https://www.sklep.linguachess.com/index.php/product/pakiet-wszystkich-scenariuszy-wrzesien-czerwiec/'
    }
];

function fetchUrl(url) {
    return new Promise((resolve, reject) => {
        const req = https.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        }, (res) => {
            if (res.statusCode !== 200) {
                reject(new Error(`Status ${res.statusCode}`));
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
    for (const item of URLS) {
        try {
            console.log(`Fetching description for ${item.price} PLN product...`);
            const html = await fetchUrl(item.url);

            // Extract description. Usually in <div class="woocommerce-product-details__short-description"> or similar, or the main tab.
            // Looking at previous scrapes, it might be in `box_glowna_tekst` or similar if it's a category page layout, but this is a single product page.

            // Let's try to capture the main content.
            // Often it's in a div with id="tab-description" or class "woocommerce-Tabs-panel--description"

            // Regex for description tab content
            let descMatch = html.match(/id="tab-description"[\s\S]*?>([\s\S]*?)<\/div>/);

            if (!descMatch) {
                // Try short description
                descMatch = html.match(/class="woocommerce-product-details__short-description"[\s\S]*?>([\s\S]*?)<\/div>/);
            }

            if (descMatch) {
                let desc = descMatch[1]
                    .replace(/<[^>]+>/g, '') // Strip HTML tags for now, or keep them if we want rich text.
                    // The user asked for "descriptions are outdated", implying textual content.
                    // Let's keep it simple text but preserving newlines.
                    .replace(/<br\s*\/?>/gi, '\n')
                    .replace(/<\/p>/gi, '\n\n')
                    .replace(/&nbsp;/g, ' ')
                    .replace(/&#8211;/g, '-')
                    .replace(/&#8217;/g, "'")
                    .trim();

                // Clean up multiple newlines
                desc = desc.replace(/\n\s*\n/g, '\n\n');

                console.log(`--- DESCRIPTION FOR ${item.price} ---`);
                console.log(desc);
                console.log('-----------------------------------');
            } else {
                console.log(`Could not find description for ${item.url}`);
                // Dump a bit of HTML to debug if needed
                // console.log(html.substring(0, 5000)); 
            }

        } catch (e) {
            console.error(`Error fetching ${item.url}:`, e.message);
        }
    }
}

run();

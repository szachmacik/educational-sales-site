// Script to find real og:image URLs for products that still have AI images
const https = require('https');

const products = [
    {
        name: 'MEGA PACK 2w1',
        url: 'https://www.sklep.linguachess.com/index.php/product/super-pakiet-2w1-pakiet-wszystkie-scenariusze-zajec-pakiet-4-pory-roku/'
    },
    {
        name: 'Scenariusze wrzesien-czerwiec',
        url: 'https://www.sklep.linguachess.com/index.php/product/pakiet-wszystkich-scenariuszy-wrzesien-czerwiec/'
    }
];

function fetchHtml(url) {
    return new Promise((resolve, reject) => {
        https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
            if (res.statusCode === 301 || res.statusCode === 302) {
                return fetchHtml(res.headers.location).then(resolve).catch(reject);
            }
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', reject);
    });
}

async function run() {
    for (const p of products) {
        const html = await fetchHtml(p.url);
        // Extract og:image
        const ogMatch = html.match(/property="og:image"\s+content="([^"]+)"/);
        const imgMatch = html.match(/class="[^"]*woocommerce-product-gallery[^"]*"[^>]*>[\s\S]*?<img[^>]+src="([^"]+)"/);
        const imgMatch2 = html.match(/<img[^>]+class="[^"]*wp-post-image[^"]*"[^>]+src="([^"]+)"/);

        console.log(`\n=== ${p.name} ===`);
        console.log('og:image:', ogMatch ? ogMatch[1] : 'NOT FOUND');
        console.log('gallery img:', imgMatch ? imgMatch[1] : 'NOT FOUND');
        console.log('wp-post-image:', imgMatch2 ? imgMatch2[1] : 'NOT FOUND');

        // Also look for any /wp-content/uploads URL
        const uploadsMatches = html.match(/https:\/\/[^"'\s]+wp-content\/uploads\/[^"'\s]+\.(png|jpg|jpeg|webp)/ig);
        if (uploadsMatches) {
            console.log('All upload images found:', [...new Set(uploadsMatches)].slice(0, 5));
        }
    }
}

run().catch(console.error);

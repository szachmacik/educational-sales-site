const fs = require('fs');
const path = require('path');

const productsPath = 'c:/Users/kamil/.gemini/antigravity/scratch/educational-sales-site/lib/data/products.json';
const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
const localFiles = fs.readdirSync('c:/Users/kamil/.gemini/antigravity/scratch/educational-sales-site/public/products');

const results = [];
let missingCount = 0;
let mappedCount = 0;

products.forEach(p => {
    if (!p.image) return;
    
    const remoteName = path.basename(p.image);
    // Find local file that matches the remote name (ignoring potential -768x543 suffixes from WordPress)
    const baseName = remoteName.replace(/-\d+x\d+\.(png|jpg|jpeg|svg)$/i, '.$1');
    
    let localMatch = localFiles.find(f => f === remoteName || f.startsWith(baseName.split('.')[0]));
    
    // Manual mapping for core products
    if (p.id === 'prod-1') localMatch = 'mega-pack-2w1.png';
    if (p.id === 'prod-2') localMatch = 'scenariusze-wrzesien-czerwiec.png';
    
    if (localMatch) {
        mappedCount++;
        p.image = `/products/${localMatch}`;
    } else {
        missingCount++;
        results.push({ id: p.id, title: p.title, remote: p.image });
    }

    // Also fix URLs
    if (p.url) p.url = p.url.replace(/linguachess\.com/g, 'kamilaenglish.com');
    if (p.description) p.description = p.description.replace(/linguachess\.com/g, 'kamilaenglish.com');
    if (p.translations) {
        Object.keys(p.translations).forEach(lang => {
            if (p.translations[lang].image) {
                const tRemote = path.basename(p.translations[lang].image);
                const tBase = tRemote.replace(/-\d+x\d+\.(png|jpg|jpeg|svg)$/i, '.$1');
                let tMatch = localFiles.find(f => f === tRemote || f.startsWith(tBase.split('.')[0]));
                if (tMatch) p.translations[lang].image = `/products/${tMatch}`;
            }
        });
    }
});

fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));

console.log(`Mapped: ${mappedCount}`);
console.log(`Missing: ${missingCount}`);
if (results.length > 0) {
    console.log('First 5 missing:');
    console.log(results.slice(0, 5));
}

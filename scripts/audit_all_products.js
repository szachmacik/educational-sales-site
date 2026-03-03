const fs = require('fs');
const path = require('path');

const PRODUCTS_PATH = path.join(__dirname, '..', 'lib', 'data', 'products.json');
const TRANSLATIONS_PATH = path.join(__dirname, '..', 'lib', 'product-translations-data.ts');

const languages = ['pl', 'en', 'uk', 'de', 'es', 'fr', 'it', 'cs', 'sk', 'ro', 'hu', 'pt', 'lt', 'lv', 'et', 'hr', 'sr', 'sl', 'bg', 'el', 'nl', 'sv', 'fi', 'no', 'da'];

function audit() {
    const products = JSON.parse(fs.readFileSync(PRODUCTS_PATH, 'utf8'));
    const translationsContent = fs.readFileSync(TRANSLATIONS_PATH, 'utf8');

    console.log(`Auditing ${products.length} products for ${languages.length} languages...\n`);

    const results = [];

    products.forEach(product => {
        const slug = product.url.match(/\/product\/([^\/]+)\/?$/)?.[1] || product.id;

        // Find the block for this slug in the translations file
        // This is a simple heuristic looking for the key
        const slugIdx = translationsContent.indexOf(`"${slug}":`);
        if (slugIdx === -1) {
            results.push({ slug, title: product.title, missingAll: true });
            return;
        }

        // Find the end of this product's translation block (until next slug or end of export)
        // This is approximate but helps narrow down the search range for languages
        let nextSlugIdx = translationsContent.indexOf('": {', slugIdx + slug.length + 5);
        if (nextSlugIdx === -1) nextSlugIdx = translationsContent.length;

        const block = translationsContent.substring(slugIdx, nextSlugIdx);

        const missingLangs = [];
        languages.forEach(lang => {
            const hasLang = block.includes(` ${lang}: {`) || block.includes(`"${lang}": {`) || block.includes(`'${lang}': {`);
            if (!hasLang) {
                missingLangs.push(lang);
            }
        });

        if (missingLangs.length > 0) {
            results.push({ slug, title: product.title, missingLangs });
        }
    });

    if (results.length === 0) {
        console.log("✅ All products are perfectly translated!");
    } else {
        console.log(`Found ${results.length} products with translation gaps:\n`);
        results.forEach(res => {
            if (res.missingAll) {
                console.log(`❌ ${res.title} (${res.slug}): MISSING ALL TRANSLATIONS`);
            } else {
                console.log(`⚠️ ${res.title} (${res.slug}): Missing [${res.missingLangs.join(', ')}]`);
            }
        });
    }
}

audit();

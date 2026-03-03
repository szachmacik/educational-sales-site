const fs = require('fs');
const path = require('path');

// Mock PRODUCT_TRANSLATIONS for node environment
const productsPath = path.join(__dirname, '..', 'lib', 'data', 'products.json');
const translationsPath = path.join(__dirname, '..', 'lib', 'product-translations-data.ts');

const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
const translationsContent = fs.readFileSync(translationsPath, 'utf8');

// Simple regex extraction for keys in PRODUCT_TRANSLATIONS
const productIdsInTranslations = [];
const idRegex = /"([^"]+)":\s*{/g;
let match;
while ((match = idRegex.exec(translationsContent)) !== null) {
    productIdsInTranslations.push(match[1]);
}

const missing = [];
products.forEach(p => {
    // Check if transl in products.json itself
    const hasEnInJson = p.translations && p.translations.en;

    // Check if in PRODUCT_TRANSLATIONS
    const slug = p.url.match(/\/product\/([^\/]+)\/?$/)?.[1] || p.id;
    const hasSlug = translationsContent.includes(`"${slug}":`) || translationsContent.includes(`'${slug}':`);
    const hasEn = /en:\s*{|"en":\s*{|'en':\s*{/.test(translationsContent.substring(translationsContent.indexOf(slug)));

    const isTranslated = hasEnInJson || (hasSlug && hasEn);

    if (!isTranslated) {
        missing.push({ id: p.id, title: p.title, slug });
    }
});

console.log(`Summary:`);
console.log(`Total Products: ${products.length}`);
console.log(`Products Missing English Translation: ${missing.length}`);

if (missing.length > 0) {
    console.log(`\nMissing List:`);
    missing.forEach(m => console.log(`- ${m.title} (${m.slug})`));
}

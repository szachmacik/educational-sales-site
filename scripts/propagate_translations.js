const fs = require('fs');
const path = require('path');

const localesPath = 'c:/Users/kamil/.gemini/antigravity/scratch/educational-sales-site/public/locales';
const files = ['common.json', 'landing.json', 'dashboard.json', 'shop.json', 'admin.json'];

// Load English as the source of truth for translations and structure
const enSources = {};
for (const file of files) {
    const enPath = path.join(localesPath, 'en', file);
    if (fs.existsSync(enPath)) {
        enSources[file] = JSON.parse(fs.readFileSync(enPath, 'utf8'));
    }
}

const locales = fs.readdirSync(localesPath).filter(d => {
    const fullPath = path.join(localesPath, d);
    return fs.statSync(fullPath).isDirectory() && d !== 'en';
});

function deepSync(source, target) {
    if (typeof source !== 'object' || source === null) return target;

    const result = Array.isArray(source) ? [] : {};

    for (const key in source) {
        const sourceValue = source[key];
        const targetValue = target ? target[key] : null;

        if (typeof sourceValue === 'object' && sourceValue !== null) {
            result[key] = deepSync(sourceValue, targetValue);
        } else {
            // Keep target value if it exists, otherwise use source (English)
            result[key] = targetValue !== null && targetValue !== undefined ? targetValue : sourceValue;
        }
    }
    return result;
}

for (const locale of locales) {
    console.log(`Processing ${locale}...`);
    for (const file of files) {
        const targetPath = path.join(localesPath, locale, file);
        const source = enSources[file];
        const target = fs.existsSync(targetPath) ? JSON.parse(fs.readFileSync(targetPath, 'utf8')) : null;

        if (source) {
            const synced = deepSync(source, target);
            fs.writeFileSync(targetPath, JSON.stringify(synced, null, 2));
        }
    }
}

console.log('Global propagation complete.');

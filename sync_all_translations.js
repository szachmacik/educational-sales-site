const fs = require('fs');
const path = require('path');

const tsPath = 'lib/translations.ts';
const content = fs.readFileSync(tsPath, 'utf8');

const startMatch = content.match(/export const translations = \{/);
if (!startMatch) {
    console.error("Could not find translations object in lib/translations.ts");
    process.exit(1);
}

const startIdx = startMatch.index + startMatch[0].length - 1;
let braceCount = 0, endIdx = -1;
for (let i = startIdx; i < content.length; i++) {
    if (content[i] === '{') braceCount++;
    else if (content[i] === '}') braceCount--;
    if (braceCount === 0) { endIdx = i + 1; break; }
}

const rawObjectStr = content.substring(startIdx, endIdx);
let translations;
try {
    // Evaluating the object string. In a real app we might use a safer parser.
    translations = eval(`(${rawObjectStr})`);
} catch (e) {
    console.error("Failed to parse translations object", e);
    process.exit(1);
}

const langs = Object.keys(translations);

const namespaces = {
    common: ['nav', 'footer', 'auth', 'cart', 'socialProof', 'newsletter', 'checkout'],
    landing: ['hero', 'features', 'categories', 'trustBar', 'testimonials', 'aboutAuthor'],
    shop: ['shop', 'products'],
    admin: ['adminSettings', 'adminPanel'],
    dashboard: ['dashboard']
};

langs.forEach(lang => {
    const langData = translations[lang];
    const localesDir = path.join('public', 'locales', lang);
    if (!fs.existsSync(localesDir)) {
        fs.mkdirSync(localesDir, { recursive: true });
    }

    Object.entries(namespaces).forEach(([ns, keys]) => {
        const nsData = {};
        keys.forEach(key => {
            if (langData[key]) {
                nsData[key] = langData[key];
            }
        });

        if (Object.keys(nsData).length > 0) {
            const nsPath = path.join(localesDir, `${ns}.json`);
            fs.writeFileSync(nsPath, JSON.stringify(nsData, null, 2));
        }
    });
});

console.log(`Successfully synchronized translations for ${langs.length} languages from monolith to multiple JSON namespaces.`);

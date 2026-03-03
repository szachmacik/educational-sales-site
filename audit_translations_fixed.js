const fs = require('fs');

// We need to read as a string because we can't easily require .ts files with complex exports in plain node without setup
const content = fs.readFileSync('lib/translations_fixed.ts', 'utf8');

// Find the translations object
const startMatch = content.match(/export const translations = \{/);
if (!startMatch) {
    console.error("Could not find translations object");
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

// This is dangerous but easiest for this quick check - convert TS-like object string to JS object
// We'll replace the exports and just evaluate the object part.
// Actually, let's use a safer approach: use a regex to find keys and compare.
// Better: just use a simple node script that can handle the .ts if we rename it or just use regex.

function getKeys(obj, prefix = '') {
    let keys = [];
    for (const key in obj) {
        if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
            keys = keys.concat(getKeys(obj[key], `${prefix}${key}.`));
        } else {
            keys.push(`${prefix}${key}`);
        }
    }
    return keys;
}

// Let's try to parse the JSON-like part. 
// Note: translations.ts seems to be mostly valid JSON if we fix some things, 
// but it's easier to just use the `add-admin-translations.js` logic which uses JSON.parse on the string.
// However, the original file has trailing commas and unquoted keys which JSON.parse doesn't like.
// Wait, the original file has QUOTED keys mostly.

try {
    // Attempting to evaluate the string as a JS object
    const translations = eval(`(${rawObjectStr})`);

    const plKeys = getKeys(translations.pl);
    const langs = ['en', 'uk', 'de', 'es', 'fr', 'it', 'cs', 'sk', 'ro', 'hu', 'pt', 'lt', 'lv', 'et', 'hr', 'sr', 'sl', 'bg', 'el'];

    langs.forEach(lang => {
        console.log(`\n--- Auditing ${lang} ---`);
        const langKeys = getKeys(translations[lang]);

        const missing = plKeys.filter(k => !langKeys.includes(k));
        const identical = plKeys.filter(k => langKeys.includes(k) && getValue(translations.pl, k) === getValue(translations[lang], k));

        if (missing.length > 0) {
            console.log(`Missing keys in ${lang}:`);
            missing.forEach(k => console.log(`  - ${k}`));
        } else {
            console.log(`Zero missing keys in ${lang}.`);
        }

        const suspicious = identical.filter(k => {
            const val = getValue(translations.pl, k);
            return typeof val === 'string' && val.length > 5; // Ignore short strings like "OK", "Tak"
        });

        if (suspicious.length > 0) {
            console.log(`Identical keys (potentially untranslated) in ${lang}:`);
            suspicious.forEach(k => console.log(`  - ${k}: ${getValue(translations.pl, k)}`));
        }
    });

} catch (e) {
    console.error("Failed to parse translations:", e);
}

function getValue(obj, path) {
    return path.split('.').reduce((o, i) => (o ? o[i] : undefined), obj);
}

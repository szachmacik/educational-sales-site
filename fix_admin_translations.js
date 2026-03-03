/**
 * Fill missing admin.json keys across all locales using EN as fallback
 * Preserves all existing translations, only adds missing keys
 */
const fs = require('fs');
const path = require('path');

const LOCALES_DIR = path.join(__dirname, 'public', 'locales');
const enAdmin = JSON.parse(fs.readFileSync(path.join(LOCALES_DIR, 'en', 'admin.json'), 'utf-8'));

const locales = fs.readdirSync(LOCALES_DIR).filter(f =>
    fs.statSync(path.join(LOCALES_DIR, f)).isDirectory() && f !== 'en'
);

function deepMerge(existing, reference) {
    const result = {};
    // First, include all keys from reference
    for (const key of Object.keys(reference)) {
        if (typeof reference[key] === 'object' && reference[key] !== null && !Array.isArray(reference[key])) {
            result[key] = deepMerge(existing?.[key] || {}, reference[key]);
        } else {
            // Use existing translation if available, otherwise EN fallback
            result[key] = existing?.[key] !== undefined ? existing[key] : reference[key];
        }
    }
    // Also preserve any extra keys in existing that aren't in reference
    if (existing) {
        for (const key of Object.keys(existing)) {
            if (!(key in result)) {
                result[key] = existing[key];
            }
        }
    }
    return result;
}

function countKeys(obj) {
    let count = 0;
    for (const key of Object.keys(obj)) {
        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
            count += countKeys(obj[key]);
        } else { count++; }
    }
    return count;
}

const enKeyCount = countKeys(enAdmin);
console.log(`EN admin.json: ${enKeyCount} keys\n`);

for (const locale of locales) {
    const fp = path.join(LOCALES_DIR, locale, 'admin.json');
    let existing = {};
    if (fs.existsSync(fp)) {
        try { existing = JSON.parse(fs.readFileSync(fp, 'utf-8')); } catch (e) {
            console.log(`  ❌ ${locale}: JSON parse error, skipping — ${e.message}`);
            continue;
        }
    }

    const beforeCount = countKeys(existing);
    const merged = deepMerge(existing, enAdmin);
    const afterCount = countKeys(merged);
    const added = afterCount - beforeCount;

    fs.writeFileSync(fp, JSON.stringify(merged, null, 2), 'utf-8');
    console.log(`✅ ${locale}: ${beforeCount} → ${afterCount} keys (+${added} from EN fallback)`);
}

console.log('\nDone! All admin.json files now have 100% key coverage (with EN fallbacks for untranslated keys).');

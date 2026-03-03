/**
 * Fill missing keys in common.json, shop.json, and landing.json across all locales
 * Uses EN as reference, preserves existing translations
 */
const fs = require('fs');
const path = require('path');

const LOCALES_DIR = path.join(__dirname, 'public', 'locales');
const NAMESPACES = ['common.json', 'shop.json', 'landing.json'];

const locales = fs.readdirSync(LOCALES_DIR).filter(f =>
    fs.statSync(path.join(LOCALES_DIR, f)).isDirectory() && f !== 'en'
);

function deepMerge(existing, reference) {
    const result = {};
    for (const key of Object.keys(reference)) {
        if (typeof reference[key] === 'object' && reference[key] !== null && !Array.isArray(reference[key])) {
            result[key] = deepMerge(existing?.[key] || {}, reference[key]);
        } else {
            result[key] = existing?.[key] !== undefined ? existing[key] : reference[key];
        }
    }
    if (existing) {
        for (const key of Object.keys(existing)) {
            if (!(key in result)) result[key] = existing[key];
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

for (const ns of NAMESPACES) {
    const enData = JSON.parse(fs.readFileSync(path.join(LOCALES_DIR, 'en', ns), 'utf-8'));
    const enKeyCount = countKeys(enData);
    console.log(`\n=== ${ns} (EN: ${enKeyCount} keys) ===`);

    let totalAdded = 0;
    for (const locale of locales) {
        const fp = path.join(LOCALES_DIR, locale, ns);
        let existing = {};
        if (fs.existsSync(fp)) {
            try { existing = JSON.parse(fs.readFileSync(fp, 'utf-8')); } catch (e) {
                console.log(`  ❌ ${locale}: parse error, skipping`);
                continue;
            }
        }

        const beforeCount = countKeys(existing);
        const merged = deepMerge(existing, enData);
        const afterCount = countKeys(merged);
        const added = afterCount - beforeCount;

        if (added > 0) {
            fs.writeFileSync(fp, JSON.stringify(merged, null, 2), 'utf-8');
            console.log(`  ✅ ${locale}: +${added} keys (${beforeCount} → ${afterCount})`);
            totalAdded += added;
        }
    }

    if (totalAdded === 0) {
        console.log(`  ✅ All locales already have 100% key coverage`);
    } else {
        console.log(`  Total: +${totalAdded} keys added across all locales`);
    }
}

console.log('\nDone!');

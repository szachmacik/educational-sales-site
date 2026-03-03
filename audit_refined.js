/**
 * Final refined audit — find ACTUALLY untranslated Polish strings (not just shared diacritics)
 * Czech/Slovak/Serbian/etc share ó, á, etc. with Polish
 * True Polish-only chars: ą, ę, ł, ź, ż, Ą, Ę, Ł, Ź, Ż (not shared with CS/SK/SR etc.)
 * Shared with other languages: ć, ń, ó, ś, Ć, Ń, Ó, Ś
 */
const fs = require('fs');
const path = require('path');

const LOCALES_DIR = path.join(__dirname, 'public', 'locales');
// Polish-ONLY characters (not found in Czech, Slovak, Serbian, Croatian, etc.)
const POLISH_ONLY_REGEX = /[ąęłźżĄĘŁŹŻ]/;
const NAME_REGEX = /Łobko-Koziej/i;

const locales = fs.readdirSync(LOCALES_DIR).filter(f =>
    fs.statSync(path.join(LOCALES_DIR, f)).isDirectory()
);
const NAMESPACES = ['admin.json', 'common.json', 'dashboard.json', 'landing.json', 'shop.json'];

// Locales that legitimately use some Polish-like chars
const SLAVIC_LOCALES = ['cs', 'sk', 'hr', 'sl', 'sr', 'bg', 'uk', 'ro', 'hu', 'lt', 'lv', 'et'];

const parsedData = {};
for (const locale of locales) {
    parsedData[locale] = {};
    for (const ns of NAMESPACES) {
        const fp = path.join(LOCALES_DIR, locale, ns);
        if (fs.existsSync(fp)) {
            try { parsedData[locale][ns] = JSON.parse(fs.readFileSync(fp, 'utf-8')); } catch { }
        }
    }
}

function findLeaks(obj, prefix = '') {
    const results = [];
    for (const key of Object.keys(obj)) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
            results.push(...findLeaks(obj[key], fullKey));
        } else if (typeof obj[key] === 'string' && POLISH_ONLY_REGEX.test(obj[key]) && !NAME_REGEX.test(obj[key])) {
            results.push({ key: fullKey, value: obj[key].substring(0, 100) });
        }
    }
    return results;
}

console.log('=== TRULY POLISH-ONLY CHARACTER LEAKS (ą, ę, ł, ź, ż) ===\n');

let total = 0;
for (const locale of locales) {
    if (locale === 'pl') continue;
    const allLeaks = [];
    for (const ns of NAMESPACES) {
        const data = parsedData[locale]?.[ns];
        if (!data) continue;
        const leaks = findLeaks(data);
        if (leaks.length > 0) allLeaks.push({ ns, leaks });
    }
    if (allLeaks.length > 0) {
        const count = allLeaks.reduce((s, x) => s + x.leaks.length, 0);
        total += count;
        console.log(`\n📛 ${locale.toUpperCase()} — ${count} truly Polish leaks:`);
        for (const { ns, leaks } of allLeaks) {
            console.log(`  ${ns} (${leaks.length}):`);
            leaks.forEach(l => console.log(`    ${l.key}: "${l.value}"`));
        }
    }
}
console.log(`\n\nTotal truly Polish leaks: ${total}`);

// ---- Also check for English strings in non-EN locales (untranslated) ----
console.log('\n\n=== UNTRANSLATED (EN values copied as-is) ===\n');

function getKVPairs(obj, prefix = '') {
    const pairs = {};
    for (const key of Object.keys(obj)) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
            Object.assign(pairs, getKVPairs(obj[key], fullKey));
        } else if (typeof obj[key] === 'string') {
            pairs[fullKey] = obj[key];
        }
    }
    return pairs;
}

// Check a few important locales for strings that are identical to EN
const spotCheckLocales = ['de', 'fr', 'es', 'it', 'pt'];
for (const locale of spotCheckLocales) {
    let untranslated = 0;
    const samples = [];
    for (const ns of ['common.json', 'landing.json', 'shop.json']) {
        const enData = parsedData['en']?.[ns];
        const localeData = parsedData[locale]?.[ns];
        if (!enData || !localeData) continue;

        const enPairs = getKVPairs(enData);
        const localePairs = getKVPairs(localeData);

        for (const [key, enVal] of Object.entries(enPairs)) {
            if (localePairs[key] === enVal && enVal.length > 3 && !/^[A-Z0-9_]+$/.test(enVal)) {
                untranslated++;
                if (samples.length < 5) samples.push({ ns, key, value: enVal.substring(0, 60) });
            }
        }
    }
    if (untranslated > 0) {
        console.log(`  ${locale.toUpperCase()}: ${untranslated} strings identical to EN in common/landing/shop`);
        samples.forEach(s => console.log(`    ${s.ns} → ${s.key}: "${s.value}"`));
        if (untranslated > 5) console.log(`    ... and ${untranslated - 5} more`);
    } else {
        console.log(`  ✅ ${locale.toUpperCase()}: all strings appear translated`);
    }
}

// ---- Summary of key coverage ----
console.log('\n\n=== KEY COVERAGE SUMMARY (% of EN keys present) ===\n');

function countKeys(obj) {
    let count = 0;
    for (const key of Object.keys(obj)) {
        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
            count += countKeys(obj[key]);
        } else { count++; }
    }
    return count;
}

const header = 'Locale'.padEnd(8) + NAMESPACES.map(n => n.replace('.json', '').padStart(12)).join('') + '  TOTAL'.padStart(8);
console.log(header);
console.log('-'.repeat(header.length));

const enKeyCounts = {};
let enTotal = 0;
for (const ns of NAMESPACES) {
    const c = parsedData['en']?.[ns] ? countKeys(parsedData['en'][ns]) : 0;
    enKeyCounts[ns] = c;
    enTotal += c;
}

for (const locale of locales) {
    let localeTotal = 0;
    const parts = [];
    for (const ns of NAMESPACES) {
        const data = parsedData[locale]?.[ns];
        const c = data ? countKeys(data) : 0;
        localeTotal += c;
        const pct = enKeyCounts[ns] > 0 ? Math.round(c / enKeyCounts[ns] * 100) : 0;
        parts.push(`${pct}%`.padStart(12));
    }
    const totalPct = Math.round(localeTotal / enTotal * 100);
    console.log(`${locale.padEnd(8)}${parts.join('')}  ${totalPct}%`.padStart(8));
}

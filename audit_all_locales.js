/**
 * Comprehensive Locale Audit Script
 * Checks: JSON validity, missing files, key consistency, Polish leaks, empty values
 */
const fs = require('fs');
const path = require('path');

const LOCALES_DIR = path.join(__dirname, 'public', 'locales');
const REFERENCE_LOCALE = 'en';
const NAMESPACES = ['admin.json', 'common.json', 'dashboard.json', 'landing.json', 'shop.json'];
const POLISH_REGEX = /[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/;

// Get all locale dirs
const locales = fs.readdirSync(LOCALES_DIR).filter(f =>
    fs.statSync(path.join(LOCALES_DIR, f)).isDirectory()
);

console.log(`\n=== LOCALE AUDIT ===`);
console.log(`Found ${locales.length} locales: ${locales.join(', ')}\n`);

// ---- 1. Check for missing files ----
console.log(`--- 1. MISSING FILES ---`);
let missingFiles = 0;
for (const locale of locales) {
    for (const ns of NAMESPACES) {
        const filePath = path.join(LOCALES_DIR, locale, ns);
        if (!fs.existsSync(filePath)) {
            console.log(`  ❌ MISSING: ${locale}/${ns}`);
            missingFiles++;
        }
    }
}
if (missingFiles === 0) console.log(`  ✅ All locales have all ${NAMESPACES.length} files`);

// ---- 2. JSON validity ----
console.log(`\n--- 2. JSON VALIDITY ---`);
let jsonErrors = 0;
const parsedData = {};

for (const locale of locales) {
    parsedData[locale] = {};
    for (const ns of NAMESPACES) {
        const filePath = path.join(LOCALES_DIR, locale, ns);
        if (!fs.existsSync(filePath)) continue;
        try {
            const content = fs.readFileSync(filePath, 'utf-8');
            parsedData[locale][ns] = JSON.parse(content);
        } catch (e) {
            console.log(`  ❌ INVALID JSON: ${locale}/${ns} — ${e.message}`);
            jsonErrors++;
        }
    }
}
if (jsonErrors === 0) console.log(`  ✅ All JSON files parse successfully`);

// ---- 3. Key consistency (compare vs EN reference) ----
console.log(`\n--- 3. KEY CONSISTENCY vs EN ---`);

function getKeys(obj, prefix = '') {
    let keys = [];
    for (const key of Object.keys(obj)) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
            keys = keys.concat(getKeys(obj[key], fullKey));
        } else {
            keys.push(fullKey);
        }
    }
    return keys;
}

let keyIssues = 0;
const keyReport = {};

for (const ns of NAMESPACES) {
    const refData = parsedData[REFERENCE_LOCALE]?.[ns];
    if (!refData) continue;
    const refKeys = new Set(getKeys(refData));

    for (const locale of locales) {
        if (locale === REFERENCE_LOCALE) continue;
        const localeData = parsedData[locale]?.[ns];
        if (!localeData) continue;

        const localeKeys = new Set(getKeys(localeData));
        const missing = [...refKeys].filter(k => !localeKeys.has(k));
        const extra = [...localeKeys].filter(k => !refKeys.has(k));

        if (missing.length > 0 || extra.length > 0) {
            if (!keyReport[ns]) keyReport[ns] = {};
            keyReport[ns][locale] = { missing: missing.length, extra: extra.length };
            keyIssues++;
        }
    }
}

for (const ns of Object.keys(keyReport)) {
    console.log(`\n  📄 ${ns}:`);
    for (const [locale, { missing, extra }] of Object.entries(keyReport[ns])) {
        const parts = [];
        if (missing > 0) parts.push(`${missing} missing`);
        if (extra > 0) parts.push(`${extra} extra`);
        console.log(`    ${locale}: ${parts.join(', ')}`);
    }
}

if (keyIssues === 0) console.log(`  ✅ All locales have matching key structures`);

// ---- 4. Empty values ----
console.log(`\n--- 4. EMPTY VALUES ---`);
let emptyCount = 0;
const emptyReport = {};

function findEmptyValues(obj, prefix = '') {
    const empties = [];
    for (const key of Object.keys(obj)) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
            empties.push(...findEmptyValues(obj[key], fullKey));
        } else if (obj[key] === '' || obj[key] === null || obj[key] === undefined) {
            empties.push(fullKey);
        }
    }
    return empties;
}

for (const locale of locales) {
    for (const ns of NAMESPACES) {
        const data = parsedData[locale]?.[ns];
        if (!data) continue;
        const empties = findEmptyValues(data);
        if (empties.length > 0) {
            if (!emptyReport[locale]) emptyReport[locale] = {};
            emptyReport[locale][ns] = empties.length;
            emptyCount += empties.length;
        }
    }
}

if (emptyCount > 0) {
    for (const [locale, files] of Object.entries(emptyReport)) {
        const parts = Object.entries(files).map(([ns, count]) => `${ns}: ${count}`);
        console.log(`  ⚠️  ${locale}: ${parts.join(', ')}`);
    }
    console.log(`  Total empty values: ${emptyCount}`);
} else {
    console.log(`  ✅ No empty values found`);
}

// ---- 5. Polish string leaks in non-PL locales ----
console.log(`\n--- 5. POLISH STRING LEAKS (non-PL locales) ---`);
let polishLeaks = 0;
const polishReport = {};

function findPolishValues(obj, prefix = '') {
    const results = [];
    for (const key of Object.keys(obj)) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
            results.push(...findPolishValues(obj[key], fullKey));
        } else if (typeof obj[key] === 'string' && POLISH_REGEX.test(obj[key])) {
            results.push({ key: fullKey, value: obj[key].substring(0, 60) });
        }
    }
    return results;
}

for (const locale of locales) {
    if (locale === 'pl') continue; // Skip PL — Polish is expected there
    for (const ns of NAMESPACES) {
        const data = parsedData[locale]?.[ns];
        if (!data) continue;
        const leaks = findPolishValues(data);
        if (leaks.length > 0) {
            if (!polishReport[locale]) polishReport[locale] = {};
            polishReport[locale][ns] = leaks;
            polishLeaks += leaks.length;
        }
    }
}

if (polishLeaks > 0) {
    for (const [locale, files] of Object.entries(polishReport)) {
        for (const [ns, leaks] of Object.entries(files)) {
            console.log(`  ❌ ${locale}/${ns}: ${leaks.length} Polish strings found`);
            // Show first 5 examples
            leaks.slice(0, 5).forEach(l => {
                console.log(`      ${l.key}: "${l.value}..."`);
            });
            if (leaks.length > 5) console.log(`      ... and ${leaks.length - 5} more`);
        }
    }
    console.log(`\n  Total Polish leaks: ${polishLeaks}`);
} else {
    console.log(`  ✅ No Polish string leaks in non-PL locales`);
}

// ---- 6. File size comparison ----
console.log(`\n--- 6. FILE SIZE COMPARISON (vs EN reference) ---`);
for (const ns of NAMESPACES) {
    const enSize = parsedData[REFERENCE_LOCALE]?.[ns] ? JSON.stringify(parsedData[REFERENCE_LOCALE][ns]).length : 0;
    const tooSmall = [];
    const tooLarge = [];

    for (const locale of locales) {
        if (locale === REFERENCE_LOCALE) continue;
        const data = parsedData[locale]?.[ns];
        if (!data) continue;
        const size = JSON.stringify(data).length;
        const ratio = size / enSize;

        if (ratio < 0.3) tooSmall.push(`${locale} (${Math.round(ratio * 100)}%)`);
        if (ratio > 2.5) tooLarge.push(`${locale} (${Math.round(ratio * 100)}%)`);
    }

    if (tooSmall.length > 0) console.log(`  ⚠️  ${ns} — suspiciously small: ${tooSmall.join(', ')}`);
    if (tooLarge.length > 0) console.log(`  ⚠️  ${ns} — suspiciously large: ${tooLarge.join(', ')}`);
    if (tooSmall.length === 0 && tooLarge.length === 0) console.log(`  ✅ ${ns} — all locales within expected size range`);
}

// ---- Summary ----
console.log(`\n=== SUMMARY ===`);
console.log(`Locales: ${locales.length}`);
console.log(`Missing files: ${missingFiles}`);
console.log(`JSON errors: ${jsonErrors}`);
console.log(`Key inconsistencies: ${keyIssues} locale/namespace combos`);
console.log(`Empty values: ${emptyCount}`);
console.log(`Polish leaks: ${polishLeaks}`);
console.log(`\nDone.`);

/**
 * Targeted audit: separate proper name "Łobko-Koziej" from actual Polish leaks
 * Also check missing dashboard.json files and key gaps
 */
const fs = require('fs');
const path = require('path');

const LOCALES_DIR = path.join(__dirname, 'public', 'locales');
const POLISH_REGEX = /[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/;
const NAME_REGEX = /Łobko-Koziej|Linguś|Matmiś/i;

const locales = fs.readdirSync(LOCALES_DIR).filter(f =>
    fs.statSync(path.join(LOCALES_DIR, f)).isDirectory()
);

const NAMESPACES = ['admin.json', 'common.json', 'dashboard.json', 'landing.json', 'shop.json'];

// Parse all files
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

// ---- Real Polish leaks (excluding proper names) ----
console.log('=== REAL POLISH LEAKS (excluding proper names) ===\n');

function findRealPolishLeaks(obj, prefix = '') {
    const results = [];
    for (const key of Object.keys(obj)) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
            results.push(...findRealPolishLeaks(obj[key], fullKey));
        } else if (typeof obj[key] === 'string' && POLISH_REGEX.test(obj[key]) && !NAME_REGEX.test(obj[key])) {
            results.push({ key: fullKey, value: obj[key].substring(0, 80) });
        }
    }
    return results;
}

let totalRealLeaks = 0;
const leaksByLocale = {};

for (const locale of locales) {
    if (locale === 'pl') continue;
    for (const ns of NAMESPACES) {
        const data = parsedData[locale]?.[ns];
        if (!data) continue;
        const leaks = findRealPolishLeaks(data);
        if (leaks.length > 0) {
            if (!leaksByLocale[locale]) leaksByLocale[locale] = {};
            leaksByLocale[locale][ns] = leaks;
            totalRealLeaks += leaks.length;
        }
    }
}

// Sort by severity
const sortedLocales = Object.entries(leaksByLocale).sort((a, b) => {
    const countA = Object.values(a[1]).reduce((s, arr) => s + arr.length, 0);
    const countB = Object.values(b[1]).reduce((s, arr) => s + arr.length, 0);
    return countB - countA;
});

for (const [locale, files] of sortedLocales) {
    const total = Object.values(files).reduce((s, arr) => s + arr.length, 0);
    console.log(`\n📛 ${locale.toUpperCase()} — ${total} real Polish leaks:`);
    for (const [ns, leaks] of Object.entries(files)) {
        console.log(`  ${ns} (${leaks.length}):`);
        leaks.forEach(l => console.log(`    ${l.key}: "${l.value}"`));
    }
}

console.log(`\n\nTotal REAL Polish leaks (excl. names): ${totalRealLeaks}`);

// ---- Missing dashboard.json ----
console.log('\n\n=== MISSING dashboard.json ===');
for (const locale of locales) {
    const fp = path.join(LOCALES_DIR, locale, 'dashboard.json');
    if (!fs.existsSync(fp)) {
        console.log(`  ❌ ${locale}/dashboard.json — MISSING`);
    }
}

// ---- dashboard.json key counts ----
console.log('\n=== dashboard.json KEY COUNTS ===');
function countKeys(obj) {
    let count = 0;
    for (const key of Object.keys(obj)) {
        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
            count += countKeys(obj[key]);
        } else {
            count++;
        }
    }
    return count;
}

const enDashKeys = parsedData['en']?.['dashboard.json'] ? countKeys(parsedData['en']['dashboard.json']) : 0;
console.log(`  EN reference: ${enDashKeys} keys`);
for (const locale of locales) {
    if (locale === 'en') continue;
    const data = parsedData[locale]?.['dashboard.json'];
    if (!data) { console.log(`  ${locale}: MISSING`); continue; }
    const keys = countKeys(data);
    console.log(`  ${locale}: ${keys} keys (${Math.round(keys / enDashKeys * 100)}%)`);
}

// ---- Top-level key gaps for worst locales ----
console.log('\n=== TOP-LEVEL KEY GAPS (admin.json — worst locales) ===');

function getTopKeys(obj) {
    return Object.keys(obj);
}

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

const enAdminKeys = new Set(getKeys(parsedData['en']?.['admin.json'] || {}));
for (const locale of ['sk', 'sr', 'pt', 'cs', 'hu', 'uk']) {
    const data = parsedData[locale]?.['admin.json'];
    if (!data) continue;
    const localeKeys = new Set(getKeys(data));
    const missing = [...enAdminKeys].filter(k => !localeKeys.has(k));
    console.log(`  ${locale}: ${missing.length} missing keys out of ${enAdminKeys.size}`);
    if (missing.length > 0 && missing.length <= 20) {
        missing.forEach(k => console.log(`    - ${k}`));
    } else if (missing.length > 20) {
        missing.slice(0, 10).forEach(k => console.log(`    - ${k}`));
        console.log(`    ... and ${missing.length - 10} more`);
    }
}

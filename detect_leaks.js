const fs = require('fs');
const path = require('path');

const LOCALES_DIR = path.join(__dirname, 'public', 'locales');
const NAMESPACES = ['admin.json', 'common.json', 'dashboard.json', 'landing.json', 'shop.json'];
const POLISH_CHARS = /[ąęłźżĄĘŁŹŻśćńóŚĆŃÓ]/;

const locales = fs.readdirSync(LOCALES_DIR).filter(f =>
    fs.statSync(path.join(LOCALES_DIR, f)).isDirectory() && f !== 'pl'
);

const plData = {};
const enData = {};

for (const ns of NAMESPACES) {
    try {
        plData[ns] = JSON.parse(fs.readFileSync(path.join(LOCALES_DIR, 'pl', ns), 'utf-8'));
        enData[ns] = JSON.parse(fs.readFileSync(path.join(LOCALES_DIR, 'en', ns), 'utf-8'));
    } catch (e) { }
}

function getKeys(obj, prefix = '') {
    let keys = {};
    for (const key of Object.keys(obj)) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
            Object.assign(keys, getKeys(obj[key], fullKey));
        } else {
            keys[fullKey] = obj[key];
        }
    }
    return keys;
}

const leaks = [];

for (const locale of locales) {
    for (const ns of NAMESPACES) {
        if (!plData[ns]) continue;
        const localePath = path.join(LOCALES_DIR, locale, ns);
        if (!fs.existsSync(localePath)) continue;

        const localeData = JSON.parse(fs.readFileSync(localePath, 'utf-8'));
        const localeKeys = getKeys(localeData);
        const plKeys = getKeys(plData[ns]);
        const enKeys = getKeys(enData[ns] || {});

        for (const [key, value] of Object.entries(localeKeys)) {
            const plValue = plKeys[key];
            const enValue = enKeys[key];

            // If it's identical to PL but different from EN, it's likely a leak
            if (value === plValue && value !== enValue && typeof value === 'string') {
                // Check if it has Polish characters (to be sure it's not just a common word)
                if (POLISH_CHARS.test(value)) {
                    // Exclude known proper names/intentional cases
                    if (!value.includes('Łobko-Koziej')) {
                        leaks.push({ locale, ns, key, value, enValue });
                    }
                }
            }
        }
    }
}

console.log(`Found ${leaks.length} likely leaks.`);
leaks.slice(0, 20).forEach(l => {
    console.log(`[${l.locale}] ${l.ns} -> ${l.key}: "${l.value}" (EN: "${l.enValue}")`);
});
if (leaks.length > 20) console.log('...');

fs.writeFileSync('leaks.json', JSON.stringify(leaks, null, 2));

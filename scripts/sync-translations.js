const fs = require('fs');
const path = require('path');

const localesDir = path.join(process.cwd(), 'public', 'locales');
const baseLang = 'pl';
const targetFile = 'admin.json';

const basePath = path.join(localesDir, baseLang, targetFile);
const baseData = JSON.parse(fs.readFileSync(basePath, 'utf8'));

function getNestedValue(obj, keyPath) {
    return keyPath.split('.').reduce((prev, curr) => {
        return prev ? prev[curr] : undefined;
    }, obj);
}

function setNestedValue(obj, keyPath, value) {
    const keys = keyPath.split('.');
    let current = obj;
    for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
}

function getAllKeys(obj, prefix = '') {
    return Object.keys(obj).reduce((res, el) => {
        if (Array.isArray(obj[el])) {
            return res;
        } else if (typeof obj[el] === 'object' && obj[el] !== null) {
            return [...res, ...getAllKeys(obj[el], prefix + el + '.')];
        } else {
            return [...res, prefix + el];
        }
    }, []);
}

const baseKeys = getAllKeys(baseData);
const locales = fs.readdirSync(localesDir).filter(f => fs.statSync(path.join(localesDir, f)).isDirectory());

locales.forEach(lang => {
    if (lang === baseLang) return;

    const langPath = path.join(localesDir, lang, targetFile);
    if (!fs.existsSync(langPath)) return;

    try {
        const langData = JSON.parse(fs.readFileSync(langPath, 'utf8'));
        const syncedData = {};

        baseKeys.forEach(key => {
            let val = getNestedValue(langData, key);
            if (val === undefined) {
                // Fallback to PL value for now, markers could be used
                // val = `[MISSING] ${getNestedValue(baseData, key)}`;
                val = getNestedValue(baseData, key);
            }
            setNestedValue(syncedData, key, val);
        });

        fs.writeFileSync(langPath, JSON.stringify(syncedData, null, 2), 'utf8');
        console.log(`[${lang}] Synced`);
    } catch (e) {
        console.log(`[${lang}] Error syncing: ${e.message}`);
    }
});

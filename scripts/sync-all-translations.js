const fs = require('fs');
const path = require('path');

const localesDir = path.join(process.cwd(), 'public', 'locales');
const baseLang = 'pl';
const targetFiles = ['common.json', 'landing.json', 'dashboard.json', 'shop.json', 'admin.json'];

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

const locales = fs.readdirSync(localesDir).filter(f => fs.statSync(path.join(localesDir, f)).isDirectory());

targetFiles.forEach(targetFile => {
    const basePath = path.join(localesDir, baseLang, targetFile);
    if (!fs.existsSync(basePath)) return;

    const baseData = JSON.parse(fs.readFileSync(basePath, 'utf8'));
    const baseKeys = getAllKeys(baseData);

    locales.forEach(lang => {
        if (lang === baseLang) return;

        const langPath = path.join(localesDir, lang, targetFile);
        if (!fs.existsSync(langPath)) {
            // If file doesn't exist, create it from PL
            fs.mkdirSync(path.dirname(langPath), { recursive: true });
            fs.writeFileSync(langPath, JSON.stringify(baseData, null, 2), 'utf8');
            console.log(`[${lang}] Created ${targetFile} from ${baseLang}`);
            return;
        }

        try {
            const langData = JSON.parse(fs.readFileSync(langPath, 'utf8'));
            const syncedData = {};

            baseKeys.forEach(key => {
                let val = getNestedValue(langData, key);
                if (val === undefined) {
                    val = getNestedValue(baseData, key);
                }
                setNestedValue(syncedData, key, val);
            });

            fs.writeFileSync(langPath, JSON.stringify(syncedData, null, 2), 'utf8');
            console.log(`[${lang}] Synced ${targetFile}`);
        } catch (e) {
            console.log(`[${lang}] Error syncing ${targetFile}: ${e.message}`);
        }
    });
});

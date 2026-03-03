const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '..', 'public', 'locales');
const enAdminPath = path.join(localesDir, 'en', 'admin.json');

function getAllKeys(obj, prefix = '') {
    let keys = {};
    for (let key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
            Object.assign(keys, getAllKeys(obj[key], prefix + key + '.'));
        } else {
            keys[prefix + key] = obj[key];
        }
    }
    return keys;
}

function setValue(obj, path, value) {
    const keys = path.split('.');
    let current = obj;
    for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
}

function fixLocale(lang) {
    const targetPath = path.join(localesDir, lang, 'admin.json');
    if (!fs.existsSync(targetPath)) return;

    console.log(`Fixing ${lang}/admin.json...`);

    try {
        const enData = JSON.parse(fs.readFileSync(enAdminPath, 'utf8'));
        const enKeys = getAllKeys(enData);

        let targetRaw = fs.readFileSync(targetPath, 'utf8');
        const targetFinal = {};

        for (let fullPath in enKeys) {
            const leafKey = fullPath.split('.').pop();
            // Look for the specific "leafKey": "value"
            // We use a more specific regex to avoid matching keys in wrong sections
            // But since we are rebuilding, we can be slightly lenient
            const regex = new RegExp(`"${leafKey}":\\s*"([^"]+)"`);
            const match = targetRaw.match(regex);

            if (match) {
                setValue(targetFinal, fullPath, match[1]);
            } else {
                // Fallback to EN value
                setValue(targetFinal, fullPath, enKeys[fullPath]);
            }
        }

        fs.writeFileSync(targetPath, JSON.stringify(targetFinal, null, 2));
        console.log(`[${lang}] Successfully rebuilt admin.json`);
    } catch (e) {
        console.log(`[${lang}] Error: ${e.message}`);
    }
}

// Fix problematic locales
['sr', 'uk', 'el'].forEach(fixLocale);

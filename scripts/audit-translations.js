const fs = require('fs');
const path = require('path');

const localesDir = path.join(process.cwd(), 'public', 'locales');
const baseLang = 'pl';

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

const baseLocalesPath = path.join(localesDir, baseLang);
const namespaces = fs.readdirSync(baseLocalesPath).filter(f => f.endsWith('.json'));

const locales = fs.readdirSync(localesDir).filter(f => fs.statSync(path.join(localesDir, f)).isDirectory());

namespaces.forEach(nsFile => {
    console.log(`\n--- Auditing namespace: ${nsFile} ---`);
    const basePath = path.join(baseLocalesPath, nsFile);
    const baseData = JSON.parse(fs.readFileSync(basePath, 'utf8'));
    const baseKeys = getAllKeys(baseData);
    console.log(`Base language (${baseLang}) has ${baseKeys.length} keys.`);

    locales.forEach(lang => {
        if (lang === baseLang) return;

        const langPath = path.join(localesDir, lang, nsFile);
        if (!fs.existsSync(langPath)) {
            // console.log(`[${lang}] Missing ${nsFile}`);
            return;
        }

        try {
            const langData = JSON.parse(fs.readFileSync(langPath, 'utf8'));
            const langKeys = getAllKeys(langData);

            const missing = baseKeys.filter(k => !langKeys.includes(k));
            if (missing.length > 0) {
                console.log(`[${lang}] Missing ${missing.length} keys in ${nsFile}: ${missing.slice(0, 5).join(', ')}${missing.length > 5 ? '...' : ''}`);
            }
        } catch (e) {
            console.log(`[${lang}] Error parsing ${nsFile}: ${e.message}`);
        }
    });
});

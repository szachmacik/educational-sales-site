const fs = require('fs');
const path = require('path');

const localesPath = 'c:/Users/kamil/.gemini/antigravity/scratch/educational-sales-site/public/locales';
const filenames = ['common.json', 'landing.json', 'dashboard.json', 'shop.json', 'admin.json'];

function findUntranslated(pl, target, path = '') {
    let results = [];
    if (!target) return [{ path, status: 'missing' }];

    for (const key in pl) {
        const currentPath = path ? `${path}.${key}` : key;
        if (typeof pl[key] === 'object' && pl[key] !== null) {
            results = results.concat(findUntranslated(pl[key], target[key], currentPath));
        } else {
            if (!target.hasOwnProperty(key)) {
                results.push({ path: currentPath, status: 'missing' });
            } else if (target[key] === pl[key] && typeof pl[key] === 'string' && pl[key].length > 2) {
                // Simple heuristic: if string is identical and longer than 2 chars, it might be untranslated
                // but avoid obvious matches like "NIP", "VAT", "SMS", "API", etc. if they are uppercase
                const isAcronym = /^[A-Z0-9\s-]+$/.test(pl[key]);
                if (!isAcronym) {
                    results.push({ path: currentPath, value: pl[key], status: 'identical' });
                }
            }
        }
    }
    return results;
}

const auditResults = {};

const locales = fs.readdirSync(localesPath).filter(d => {
    const fullPath = path.join(localesPath, d);
    return fs.statSync(fullPath).isDirectory() && d !== 'pl';
});

for (const locale of locales) {
    auditResults[locale] = {};
    for (const file of filenames) {
        const plPath = path.join(localesPath, 'pl', file);
        const targetPath = path.join(localesPath, locale, file);

        if (fs.existsSync(plPath)) {
            const pl = JSON.parse(fs.readFileSync(plPath, 'utf8'));
            const target = fs.existsSync(targetPath) ? JSON.parse(fs.readFileSync(targetPath, 'utf8')) : null;
            const issues = findUntranslated(pl, target);
            if (issues.length > 0) {
                auditResults[locale][file] = issues;
            }
        } else {
            // pl file missing? unusual but handle it
        }
    }
}

fs.writeFileSync('global_translation_audit.json', JSON.stringify(auditResults, null, 2));
console.log('Global audit complete. Results in global_translation_audit.json');

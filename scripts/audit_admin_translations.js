const fs = require('fs');
const path = require('path');

const localesPath = 'c:/Users/kamil/.gemini/antigravity/scratch/educational-sales-site/public/locales';
const plAdmin = JSON.parse(fs.readFileSync(path.join(localesPath, 'pl/admin.json'), 'utf8'));

const locales = fs.readdirSync(localesPath).filter(d => d !== 'pl');

function findUntranslated(pl, target, path = '') {
    let results = [];
    for (const key in pl) {
        const currentPath = path ? `${path}.${key}` : key;
        if (typeof pl[key] === 'object' && pl[key] !== null) {
            if (target && target[key]) {
                results = results.concat(findUntranslated(pl[key], target[key], currentPath));
            } else {
                results.push({ path: currentPath, status: 'missing' });
            }
        } else {
            if (target && target[key] === pl[key] && typeof pl[key] === 'string' && pl[key].length > 3) {
                // Simple heuristic: if string is identical and longer than 3 chars, it might be untranslated
                // Exclude things like "GA4", "VAT", etc.
                results.push({ path: currentPath, value: pl[key], status: 'identical' });
            } else if (!target || !target[key]) {
                results.push({ path: currentPath, status: 'missing' });
            }
        }
    }
    return results;
}

const audit = {};
for (const locale of locales) {
    const targetPath = path.join(localesPath, locale, 'admin.json');
    if (fs.existsSync(targetPath)) {
        const target = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
        audit[locale] = findUntranslated(plAdmin, target);
    }
}

fs.writeFileSync('admin_audit.json', JSON.stringify(audit, null, 2));
console.log('Audit complete. Results in admin_audit.json');

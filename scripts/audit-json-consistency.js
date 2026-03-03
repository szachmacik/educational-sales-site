const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '../public/locales');
const plPath = path.join(localesDir, 'pl/admin.json');
const enPath = path.join(localesDir, 'en/admin.json');

const plContent = JSON.parse(fs.readFileSync(plPath, 'utf8'));
const enContent = JSON.parse(fs.readFileSync(enPath, 'utf8'));

const languages = ['en', 'uk', 'de', 'es', 'fr', 'it', 'cs', 'sk', 'ro', 'hu', 'pt', 'lt', 'lv', 'et', 'hr', 'sr', 'sl', 'bg', 'el'];

function compareKeys(source, target, path = '') {
    const issues = [];
    for (const key in source) {
        const currentPath = path ? `${path}.${key}` : key;
        if (!(key in target)) {
            issues.push({ path: currentPath, type: 'MISSING' });
        } else if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
            issues.push(...compareKeys(source[key], target[key], currentPath));
        }
    }
    return issues;
}

function findUntranslated(enSource, target, path = '') {
    const issues = [];
    for (const key in enSource) {
        const currentPath = path ? `${path}.${key}` : key;
        if (typeof enSource[key] === 'object' && enSource[key] !== null && !Array.isArray(enSource[key])) {
            if (target[key]) {
                issues.push(...findUntranslated(enSource[key], target[key], currentPath));
            }
        } else if (target[key] === enSource[key] && typeof enSource[key] === 'string' && enSource[key].length > 2) {
            // Ignore short strings
            issues.push({ path: currentPath, type: 'SAME_AS_EN', value: enSource[key] });
        }
    }
    return issues;
}

const report = {};

languages.forEach(lang => {
    const filePath = path.join(localesDir, `${lang}/admin.json`);
    if (fs.existsSync(filePath)) {
        const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        // Check for missing keys against PL
        const missing = compareKeys(plContent, content);

        // Check for untranslated against EN (if lang != en)
        let untranslated = [];
        if (lang !== 'en') {
            untranslated = findUntranslated(enContent, content);
        }

        if (missing.length > 0 || untranslated.length > 0) {
            report[lang] = {
                missingCount: missing.length,
                untranslatedCount: untranslated.length,
                // missingSamples: missing.slice(0, 3),
                // untranslatedSamples: untranslated.slice(0, 3)
            };
        }
    }
});

console.log(JSON.stringify(report, null, 2));

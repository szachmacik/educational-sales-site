const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'public', 'locales');
const languages = ['pl', 'en', 'uk', 'de', 'es', 'fr', 'it', 'cs', 'sk', 'ro', 'hu', 'pt', 'lt', 'lv', 'et', 'hr', 'sr', 'sl', 'bg', 'el'];

function loadJson(filePath) {
    try {
        if (fs.existsSync(filePath)) {
            return JSON.parse(fs.readFileSync(filePath, 'utf8'));
        }
    } catch (e) {
        console.error(`Error loading ${filePath}: ${e.message}`);
    }
    return null;
}

const auditResults = {};

// Load Reference
const plRef = loadJson(path.join(localesDir, 'pl.json'));

if (!plRef) {
    console.error("Could not load pl.json reference.");
    process.exit(1);
}

function auditObject(ref, target, lang, path = []) {
    const results = {
        missing: [],
        untranslated: [], // Same as Polish
        englishLeaks: [], // Common English words in non-EN/non-PL
    };

    const englishWords = ['Ready', 'Access', 'Subscribe', 'Latest', 'Back', 'Purchase', 'Format', 'Details', 'Quality', 'Secure', 'Success', 'Order', 'Terms', 'Privacy', 'Cancel', 'Save', 'Log', 'Dashboard', 'Password'];

    for (const key in ref) {
        const currentPath = [...path, key].join('.');

        if (!(key in target)) {
            results.missing.push(currentPath);
            continue;
        }

        const refVal = ref[key];
        const targetVal = target[key];

        if (typeof refVal === 'object' && !Array.isArray(refVal)) {
            const subAudit = auditObject(refVal, targetVal || {}, lang, [...path, key]);
            results.missing.push(...subAudit.missing);
            results.untranslated.push(...subAudit.untranslated);
            results.englishLeaks.push(...subAudit.englishLeaks);
        } else if (typeof refVal === 'string') {
            // Check for untranslated (same as Polish)
            // Ignore very short strings, numbers, and brand names
            if (lang !== 'pl' && targetVal === refVal && refVal.length > 3 && !refVal.includes('Kamila')) {
                results.untranslated.push({ path: currentPath, value: targetVal });
            }

            // Check for English leaks in non-English / non-Polish locales
            if (lang !== 'pl' && lang !== 'en' && typeof targetVal === 'string') {
                for (const word of englishWords) {
                    if (targetVal.includes(word) && !refVal.includes(word)) {
                        results.englishLeaks.push({ path: currentPath, value: targetVal, word });
                        break;
                    }
                }
            }
        } else if (Array.isArray(refVal)) {
            // Simple array check
            if (!Array.isArray(targetVal) || targetVal.length !== refVal.length) {
                results.missing.push(currentPath + ' (Array length mismatch)');
            } else {
                refVal.forEach((item, index) => {
                    if (typeof item === 'object') {
                        const subAudit = auditObject(item, targetVal[index] || {}, lang, [...path, key, index.toString()]);
                        results.missing.push(...subAudit.missing);
                        results.untranslated.push(...subAudit.untranslated);
                        results.englishLeaks.push(...subAudit.englishLeaks);
                    } else if (lang !== 'pl' && targetVal[index] === item && item.length > 3) {
                        results.untranslated.push({ path: `${currentPath}.${index}`, value: item });
                    }
                });
            }
        }
    }

    return results;
}

console.log(`Auditing ${languages.length} languages against PL...`);

languages.forEach(lang => {
    if (lang === 'pl') return;

    const targetJson = loadJson(path.join(localesDir, `${lang}.json`));
    if (!targetJson) {
        console.warn(`[${lang}] Missing ${lang}.json`);
        return;
    }

    const report = auditObject(plRef, targetJson, lang);
    auditResults[lang] = report;

    console.log(`\n--- [${lang.toUpperCase()}] ---`);
    console.log(`Missing keys: ${report.missing.length}`);
    console.log(`Untranslated (Polish): ${report.untranslated.length}`);
    console.log(`English leaks: ${report.englishLeaks.length}`);

    if (report.untranslated.length > 0) {
        console.log(`Examples of Polish in ${lang}:`);
        report.untranslated.slice(0, 3).forEach(u => console.log(`  - ${u.path}: "${u.value}"`));
    }

    if (report.englishLeaks.length > 0) {
        console.log(`Examples of English in ${lang}:`);
        report.englishLeaks.slice(0, 3).forEach(e => console.log(`  - ${e.path}: "${e.value}" (Found "${e.word}")`));
    }
});

// Write full report to file
fs.writeFileSync('translation_audit_report.json', JSON.stringify(auditResults, null, 2));
console.log('\nFull report saved to translation_audit_report.json');

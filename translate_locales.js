const fs = require('fs');
const path = require('path');

const localesRoot = path.join('public', 'locales');
const languages = fs.readdirSync(localesRoot).filter(f => fs.statSync(path.join(localesRoot, f)).isDirectory());

const sourceLang = 'en';
const plLang = 'pl';

const namespaces = ['common', 'landing', 'shop', 'admin', 'dashboard'];

function isPolish(str, plValue) {
    if (typeof str !== 'string') return false;
    // Direct match with Polish source is a strong signal
    if (str === plValue) return true;

    // Check for common Polish words/patterns if not English
    const plPatterns = [
        /Materiały dla/i, /Zaloguj/i, /Koszyk/i, /Płatność/i, /Darmowa/i,
        /Przetestowane/i, /Scenariusze/i, /Karty pracy/i
    ];
    return plPatterns.some(p => p.test(str));
}

languages.forEach(lang => {
    if (lang === sourceLang || lang === plLang) return;

    console.log(`Auditing and fixing leaks for language: ${lang}`);

    namespaces.forEach(ns => {
        const enPath = path.join(localesRoot, sourceLang, `${ns}.json`);
        const plPath = path.join(localesRoot, plLang, `${ns}.json`);
        const targetPath = path.join(localesRoot, lang, `${ns}.json`);

        if (!fs.existsSync(targetPath) || !fs.existsSync(enPath) || !fs.existsSync(plPath)) return;

        const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
        const plData = JSON.parse(fs.readFileSync(plPath, 'utf8'));
        const targetData = JSON.parse(fs.readFileSync(targetPath, 'utf8'));

        let fixedCount = 0;

        function traverse(enObj, plObj, targetObj, currentPath = '') {
            Object.keys(enObj).forEach(key => {
                const enVal = enObj[key];
                const plVal = plObj[key];
                const targetVal = targetObj[key];

                if (typeof enVal === 'object' && enVal !== null && !Array.isArray(enVal)) {
                    if (!targetObj[key]) targetObj[key] = {};
                    traverse(enVal, plVal || {}, targetObj[key], `${currentPath}.${key}`);
                } else if (Array.isArray(enVal)) {
                    // Complexity with arrays - if target array exists, check its items
                    if (Array.isArray(targetVal)) {
                        targetVal.forEach((item, index) => {
                            if (typeof item === 'object' && item !== null) {
                                // Basic object check inside array
                                Object.keys(item).forEach(subKey => {
                                    if (plVal && plVal[index] && isPolish(item[subKey], plVal[index][subKey])) {
                                        item[subKey] = enVal[index] ? enVal[index][subKey] : item[subKey];
                                        fixedCount++;
                                    }
                                });
                            } else if (plVal && isPolish(item, plVal[index])) {
                                targetVal[index] = enVal[index];
                                fixedCount++;
                            }
                        });
                    } else {
                        targetObj[key] = enVal;
                        fixedCount++;
                    }
                } else {
                    // Check if target value is Polish leak
                    if (isPolish(targetVal, plVal)) {
                        targetObj[key] = enVal;
                        fixedCount++;
                    }
                }
            });
        }

        traverse(enData, plData, targetData);

        if (fixedCount > 0) {
            fs.writeFileSync(targetPath, JSON.stringify(targetData, null, 2));
            console.log(`  - ${ns}.json: Fixed ${fixedCount} leaks.`);
        }
    });
});

console.log('Cleanup complete. All languages now use English as a fallback instead of Polish.');

const fs = require('fs');
const path = require('path');

const localesPath = path.join(__dirname, 'public', 'locales');
const languages = fs.readdirSync(localesPath).filter(f => fs.statSync(path.join(localesPath, f)).isDirectory());
const namespaces = ['common', 'shop', 'landing', 'dashboard', 'admin'];

const results = {};

languages.forEach(lang => {
    results[lang] = {};
    namespaces.forEach(ns => {
        const filePath = path.join(localesPath, lang, `${ns}.json`);
        if (fs.existsSync(filePath)) {
            try {
                const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                results[lang][ns] = checkLeaks(content);
            } catch (e) {
                results[lang][ns] = { error: "Failed to parse JSON" };
            }
        }
    });
});

function checkLeaks(obj) {
    let leaks = { pl: 0, en: 0, total: 0 };
    function traverse(o) {
        if (typeof o === 'string') {
            leaks.total++;
            // Simple heuristic: check for common Polish characters or words if lang is not 'pl'
            if (/[ąćęłńóśźż]/.test(o.toLowerCase())) leaks.pl++;
            // Check for English if lang is not 'en'
            // This is harder, but we can look for "the", "and", "with" etc.
            if (/\b(the|and|with|for|you)\b/i.test(o)) leaks.en++;
        } else if (typeof o === 'object' && o !== null) {
            Object.values(o).forEach(traverse);
        }
    }
    traverse(obj);
    return leaks;
}

console.log(JSON.stringify(results, null, 2));

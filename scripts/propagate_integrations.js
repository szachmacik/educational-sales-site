const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '../public/locales');
const enPath = path.join(localesDir, 'en/admin.json');
const plPath = path.join(localesDir, 'pl/admin.json');

const enContent = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const integrationsEn = enContent.adminPanel.integrations;

const languages = ['uk', 'de', 'es', 'fr', 'it', 'cs', 'sk', 'ro', 'hu', 'pt', 'lt', 'lv', 'et', 'hr', 'sr', 'sl', 'bg', 'el'];

function deepMerge(target, source) {
    for (const key in source) {
        if (source.hasOwnProperty(key)) {
            if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
                if (!target[key] || typeof target[key] !== 'object') {
                    target[key] = {};
                }
                deepMerge(target[key], source[key]);
            } else {
                if (target[key] === undefined) {
                    target[key] = source[key]; // Copy missing key from EN
                }
            }
        }
    }
}

languages.forEach(lang => {
    const filePath = path.join(localesDir, `${lang}/admin.json`);
    if (fs.existsSync(filePath)) {
        console.log(`Processing ${lang}...`);
        const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        if (!content.adminPanel) {
            content.adminPanel = {};
        }
        if (!content.adminPanel.integrations) {
            content.adminPanel.integrations = {};
        }

        // Merge EN integrations into target
        deepMerge(content.adminPanel.integrations, integrationsEn);

        fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf8');
    } else {
        console.warn(`File not found: ${filePath}`);
    }
});

console.log('Propagation complete.');

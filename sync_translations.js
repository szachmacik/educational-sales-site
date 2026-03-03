const fs = require('fs');
const path = require('path');

const tsPath = 'lib/translations.ts';
const content = fs.readFileSync(tsPath, 'utf8');

const startMatch = content.match(/export const translations = \{/);
const startIdx = startMatch.index + startMatch[0].length - 1;
let braceCount = 0, endIdx = -1;
for (let i = startIdx; i < content.length; i++) {
    if (content[i] === '{') braceCount++;
    else if (content[i] === '}') braceCount--;
    if (braceCount === 0) { endIdx = i + 1; break; }
}

const rawObjectStr = content.substring(startIdx, endIdx);
const translations = eval(`(${rawObjectStr})`);

const langs = Object.keys(translations);

langs.forEach(lang => {
    const langData = translations[lang];
    const localesDir = path.join('public', 'locales', lang);
    if (!fs.existsSync(localesDir)) {
        fs.mkdirSync(localesDir, { recursive: true });
    }

    // sync adminSettings to admin.json
    if (langData.adminSettings) {
        const adminPath = path.join(localesDir, 'admin.json');
        let adminJson = {};
        if (fs.existsSync(adminPath)) {
            try {
                adminJson = JSON.parse(fs.readFileSync(adminPath, 'utf8'));
            } catch (e) { console.error(`Failed to parse ${adminPath}`, e); }
        }
        adminJson.adminSettings = langData.adminSettings;
        fs.writeFileSync(adminPath, JSON.stringify(adminJson, null, 2));
    }

    // sync dashboard to dashboard.json
    if (langData.dashboard) {
        const dashboardPath = path.join(localesDir, 'dashboard.json');
        let dashboardJson = {};
        if (fs.existsSync(dashboardPath)) {
            try {
                dashboardJson = JSON.parse(fs.readFileSync(dashboardPath, 'utf8'));
            } catch (e) { console.error(`Failed to parse ${dashboardPath}`, e); }
        }
        dashboardJson.dashboard = langData.dashboard;
        fs.writeFileSync(dashboardPath, JSON.stringify(dashboardJson, null, 2));
    }
});

console.log(`Successfully synchronized translations for ${langs.length} languages from monolith to JSON locales.`);

const fs = require('fs');
const content = fs.readFileSync('lib/translations.ts', 'utf8');

const startMatch = content.match(/export const translations = \{/);
const startIdx = startMatch.index + startMatch[0].length - 1;
let braceCount = 0, endIdx = -1;
for (let i = startIdx; i < content.length; i++) {
    if (content[i] === '{') braceCount++;
    else if (content[i] === '}') braceCount--;
    if (braceCount === 0) { endIdx = i + 1; break; }
}
const rawObjectStr = content.substring(startIdx, endIdx);
const translations = JSON.parse(rawObjectStr);

// Update Interactive translations for Polish
translations.pl.adminSettings.interactive = {
    title: "Centrum Gier Interaktywnych",
    description: "Zarządzaj połączeniem z zewnętrznymi platformami (Embed Mode)",
    platforms: {
        wordwall: "Profil Wordwall (Nazwa użytkownika)",
        genially: "Profil Genially (Link publiczny)",
        h5p: "Integracja H5P (Lokalna)",
        learningapps: "LearningApps (ID konta)"
    },
    auto_import: "Włącz szybki import materiałów przez wklejenie linku (OEmbed)",
    sync_status: "Status biblioteki gier"
};

// Sync
function recursiveMerge(tpl, src) {
    for (const key in tpl) {
        if (src[key] !== undefined) {
            if (typeof tpl[key] === 'object' && !Array.isArray(tpl[key]) && src[key] && typeof src[key] === 'object') {
                recursiveMerge(tpl[key], src[key]);
            } else {
                tpl[key] = src[key];
            }
        }
    }
}

const plTemplate = JSON.parse(JSON.stringify(translations.pl));
for (const lang in translations) {
    if (lang === 'pl') continue;
    const newLangObj = JSON.parse(JSON.stringify(plTemplate));
    recursiveMerge(newLangObj, translations[lang]);
    translations[lang] = newLangObj;
}

const header = content.substring(0, startIdx);
const footer = content.substring(endIdx);
fs.writeFileSync('lib/translations.ts', header + JSON.stringify(translations, null, 4) + footer);

console.log("Interactive translations updated to Embed/Link mode.");

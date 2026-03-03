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

// 1. Add Interactive & Dashboard translations to Polish
translations.pl.adminSettings.tabs.interactive = " Gry & Interakcje";
translations.pl.adminSettings.interactive = {
    title: "Integracja z Grami Online",
    description: "Połącz Wordwall, Genially i inne platformy ze swoim sklepem",
    platforms: {
        wordwall: "Klucz API Wordwall",
        genially: "Klucz API Genially",
        h5p: "Integracja H5P (Lokalna)",
        learningapps: "LearningApps Embed"
    },
    auto_import: "Automatycznie twórz produkt po dodaniu gry na platformie",
    sync_status: "Ostatnia synchronizacja gier"
};

translations.pl.dashboard = {
    tabs: {
        courses: "Moje Kursy",
        materials: "Materiały PDF/ZIP",
        games: "Gry Interaktywne",
        wallet: "Mój Portfel"
    },
    materials: {
        title: "Twoje Materiały Cyfrowe",
        download: "Pobierz plik",
        no_files: "Nie posiadasz jeszcze żadnych materiałów do pobrania."
    },
    games: {
        title: "Centrum Gier Online",
        play: "Zagraj teraz",
        provider: "Platforma",
        no_games: "Brak dostępnych gier interaktywnych."
    }
};

// 2. Sync all languages
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
const langs = Object.keys(translations).filter(l => l !== 'pl');

for (const lang of langs) {
    const newLangObj = JSON.parse(JSON.stringify(plTemplate));
    recursiveMerge(newLangObj, translations[lang]);
    translations[lang] = newLangObj;
}

// 3. Write back
const header = content.substring(0, startIdx);
const footer = content.substring(endIdx);
fs.writeFileSync('lib/translations.ts', header + JSON.stringify(translations, null, 4) + footer);

console.log("Interactive Content & Dashboard translation keys added.");

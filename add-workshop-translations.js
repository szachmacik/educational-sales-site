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

// 1. Add Workshop & Canva translations to Polish
translations.pl.adminSettings.tabs.workshop = "AI Studio & Canva";
translations.pl.adminSettings.workshop = {
    title: "AI Workshop (RAG Engine)",
    description: "Generuj materiały pochodne na podstawie swojej bazy wiedzy",
    rag_sources: {
        title: "Źródła Wiedzy (RAG)",
        google_drive: "Połączony Dysk Google",
        notebook_lm: "Link do NotebookLM / Bazy wiedzy",
        local_files: "Pliki lokalne (PDF, TXT)"
    },
    generators: {
        title: "Generator Materiałów",
        reading: "Reading (Tekst + Pytania)",
        listening: "Listening (Skrypt + Audio AI)",
        speaking: "Speaking Cards",
        vocabulary: "Ćwiczenia Słownictwa",
        flashcards: "Fiszki (CSV/Anki)",
        tests: "Generator Testów",
        worksheets: "Karty Pracy PDF"
    },
    canva: {
        title: "Canva Connector",
        description: "Eksportuj wygenerowane treści bezpośrednio do projektów Canva",
        api_key: "Canva Design Token",
        connect: "Połącz z Canva"
    },
    generate_btn: "Generuj Materiały",
    status_ready: "Gotowy do generowania"
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

console.log("AI Workshop & Canva translation keys added and synchronized.");

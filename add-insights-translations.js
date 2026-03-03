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

// 1. Add Marketing & Market Intelligence + Audit Insight translations to Polish
translations.pl.adminSettings.tabs.market = "Analiza Rynku & Programu";
translations.pl.adminSettings.tabs.insights = "Audyt & Sugestie AI";

translations.pl.adminSettings.market = {
    title: "Market & Curriculum Intelligence",
    description: "Monitoruj trendy rynkowe i wymagania edukacyjne",
    curriculum: {
        title: "Monitor Podstawy Programowej",
        description: "AI sprawdza zgodność z aktualnymi wymogami MEiN / Ofsted / innych",
        status: "Zgodność Twoich materiałów: 85%",
        alerts: "Wykryto zmianę w wymaganiach dla Klas 4-6"
    },
    trends: {
        title: "Trend-Watcher",
        description: "Popularne produkty na portalach typu TPT / TeachersPayTeachers w Twoich kategoriach",
        top_selling: "Najpopularniejszy format: 'Interactive Escape Rooms'",
        recommendation: "Sugestia: Stwórz zestaw 'Easter Escape Room' (Wysoki popyt)"
    },
    pricing: {
        title: "Analiza Cen Konkurencji",
        description: "Porównanie Twoich cen z rynkiem globalnym",
        status: "Twoje ceny są o 12% niższe od średniej rynkowej"
    }
};

translations.pl.adminSettings.insights = {
    title: "AI Audit & Product Insights",
    description: "Analiza Twoich zasobów i pomysły na rozbudowę",
    sync: {
        title: "Rejestr Synchronizacji",
        description: "Status importu gier i materiałów z platform zewnętrznych",
        last_sync: "Ostatnia udana synchronizacja: 15 min temu",
        pending_drafts: "{count} nowych szkiców do przejrzenia"
    },
    expansion: {
        title: "Fabryka Materiałów (Sugestie)",
        description: "Pomysły na rozbudowę istniejących produktów niskim kosztem",
        item1: "Produkt 'Unit 1' można rozbudować o zestaw 20 flashcards (AI wygeneruje je automatycznie)",
        item2: "Zrób 'Mega Pack' z 3 Twoich najpopularniejszych scenariuszy (Potencjał: +25% marży)"
    },
    audit: {
        title: "Audyt Konwersji",
        description: "AI analizuje opisy i zdjęcia Twoich produktów",
        suggestion: "Zmień zdjęcie główne w 'Flashcards Animals' – obecne ma niską klikalność"
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
for (const lang in translations) {
    if (lang === 'pl') continue;
    const newLangObj = JSON.parse(JSON.stringify(plTemplate));
    recursiveMerge(newLangObj, translations[lang]);
    translations[lang] = newLangObj;
}

const header = content.substring(0, startIdx);
const footer = content.substring(endIdx);
fs.writeFileSync('lib/translations.ts', header + JSON.stringify(translations, null, 4) + footer);

console.log("Market Intelligence & AI Insights translation keys added and synchronized.");

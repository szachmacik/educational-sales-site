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

// Add Agent Automation translations to Polish
translations.pl.adminSettings.tabs.automation = "Agenci & Automatyzacja";

translations.pl.adminSettings.automation = {
    title: "AI Agent Connectors (Browser-Enabled)",
    description: "Podłącz agentów typu Manus AI, GPT-4o with Browser lub zapytania do Playwright/Selenium",
    agents: {
        title: "Dostępni Agenci Browser-First",
        manus: "Manus AI Connector",
        general: "Custom Browser Agent (Webhook)",
        status_idle: "Agent gotowy do zadań",
        status_running: "Agent przeszukuje sieć...",
        btn_send: "Wyślij Agenta po linki"
    },
    scrapers: {
        title: "Zadania dla Agenta",
        item1: "Znajdź linki Embed do gier na moim profilu Genially",
        item2: "Sprawdź dostępność nowych szablonów Canva",
        item3: "Pobierz kody udostępniania z Wordwall"
    },
    receiver: {
        title: "Adres odbiorczy (Endpoint)",
        description: "Podaj ten URL w Manus AI, aby agent mógł odesłać znalezione linki bezpośrednio do Twoich szkiców",
        copy_btn: "Kopiuj Webhook URL"
    }
};

// Sync languages
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

console.log("Agent Automation translations added.");

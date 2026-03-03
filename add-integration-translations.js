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

// 1. Add Integrations translations to Polish
translations.pl.adminSettings.tabs.integrations = "Integracje & API";
translations.pl.adminSettings.integrations = {
    title: "Konektory i Webhooki",
    description: "Zarządzaj zewnętrznymi połączeniami i automatyzacją",
    webhooks: {
        title: "Webhooki",
        description: "Wysyłaj powiadomienia o zamówieniach do zewnętrznych systemów",
        add: "Dodaj Webhook",
        url: "URL Docelowy",
        event: "Zdarzenie",
        events: {
            order_created: "Nowe zamówienie",
            order_paid: "Zamówienie opłacone",
            user_registered: "Nowy użytkownik"
        }
    },
    mcp: {
        title: "Konektory MCP",
        description: "Podłącz zewnętrzne modele i bazy wiedzy przez protokół MCP",
        server: "Adres serwera MCP",
        status: "Status połączenia"
    },
    api: {
        title: "Klucze API Zewnętrzne",
        description: "Integracje z systemami CRM, Mailingowymi i innymi",
        service: "Usługa (np. MailerLite, Zapier)",
        key: "Klucz API / Token"
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

console.log("Integration & API translation keys added and synchronized.");

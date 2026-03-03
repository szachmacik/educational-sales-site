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

// 1. Add "Powerful" features translations to Polish
translations.pl.adminSettings.tabs.affiliate = "Program Partnerski";
translations.pl.adminSettings.tabs.pricing = "Ceny & Waluty (PPP)";
translations.pl.adminSettings.tabs.taxes = "Faktury i Podatki";

translations.pl.adminSettings.affiliate = {
    title: "System Poleceń i Afiliacji",
    description: "Zmień swoich klientów w ambasadorów marki",
    commission: "Prowizja dla partnera (%)",
    discount: "Zniżka dla poleconego (%)",
    cookie_life: "Żywotność ciasteczka (dni)",
    referral_links: "Generuj linki polecające",
    total_partners: "Aktywni partnerzy",
    payouts: "Oczekujące wypłaty"
};

translations.pl.adminSettings.pricing = {
    title: "Purchasing Power Parity (PPP)",
    description: "Automatyczne dostosowanie cen do siły nabywczej w 19 krajach",
    enable_ppp: "Włącz inteligentne ceny regionalne",
    base_currency: "Waluta bazowa",
    regions: {
        western: "Europa Zachodnia (100% ceny)",
        central: "Europa Środkowa (85% ceny)",
        eastern: "Europa Wschodnia (70% ceny)",
        balkans: "Bałkany (60% ceny)"
    }
};

translations.pl.adminSettings.taxes = {
    title: "Obsługa Podatków i Faktur",
    description: "Zarządzaj stawkami VAT i automatycznym wystawianiem faktur UE",
    eu_vat_moss: "Włącz system VAT-MOSS / OSS",
    invoice_provider: "Dostawca faktur (np. Fakturownia, InFakt)",
    test_connection: "Testuj połączenie z API"
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

console.log("Powerful Features translation keys added and synchronized.");

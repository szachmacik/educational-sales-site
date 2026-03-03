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

// 1. Add Abandoned Carts & AI Guardian translations to Polish
translations.pl.adminSettings.tabs.abandoned = "Porzucone Koszyki";
translations.pl.adminSettings.tabs.guardian = "AI Guardian";

translations.pl.adminSettings.abandoned = {
    title: "Odzyskiwanie Koszyków",
    description: "Automatyczne przypomnienia dla klientów, którzy nie dokończyli zakupu",
    delay: "Opóźnienie pierwszego maila (godziny)",
    discount_code: "Kod rabatowy w mailu (opcjonalnie)",
    enable_auto: "Włącz automatyczne odzyskiwanie",
    stats: {
        total_recovered: "Odzyskane przychody",
        pending_carts: "Koszyki w toku"
    }
};

translations.pl.adminSettings.guardian = {
    title: "AI Safety & Technical Guardian",
    description: "Inteligentny system monitorujący błędy, prawo i wydajność",
    legal_check: "Monitoring zmian prawnych (E-commerce UE)",
    tech_check: "Monitoring błędów technicznych w czasie rzeczywistym",
    security_check: "Analiza prób nieautoryzowanego dostępu",
    alerts: "Powiadomienia o krytycznych problemach",
    status_good: "System działa bez zakłóceń",
    status_warning: "Wykryto potencjalną niezgodność prawną",
    last_scan: "Ostatni pełny skan systemu"
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

console.log("Abandoned Carts & AI Guardian translation keys added and synchronized.");

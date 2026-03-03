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

// 1. Add Economy & Gamification translations to Polish
translations.pl.adminSettings.tabs.economy = "Ekonomia i Portfel";
translations.pl.adminSettings.tabs.gamification = "Grywalizacja & Badge";

translations.pl.adminSettings.economy = {
    title: "System Punktów i Portfela",
    description: "Zarządzaj wirtualną walutą, subskrypcjami i lojalnością klientów",
    wallet: {
        title: "Wirtualny Portfel",
        enable_wallet: "Włącz portfel użytkownika",
        allow_topup: "Zezwalaj na doładowania",
        recurring_topup: "Automatyczne doładowania cykliczne",
        conversion_rate: "Kurs doładowania (1 EUR = X pkt)"
    },
    loyalty: {
        title: "Punkty Lojalnościowe",
        enable_loyalty: "Włącz zbieranie punktów",
        points_per_eur: "Punkty za każde 1 EUR wydane",
        min_redeem: "Minimalna liczba punktów do wykorzystania"
    },
    subscriptions: {
        title: "Plany Subskrypcyjne",
        description: "Dostęp do wszystkich materiałów w modelu abonamentowym",
        monthly_price: "Cena miesięczna",
        yearly_price: "Cena roczna (oszczędność)",
        perks: "Dodatkowe korzyści dla subskrybentów"
    }
};

translations.pl.adminSettings.gamification = {
    title: "Poziomy i Odznaki (Badges)",
    description: "Nagradzaj najbardziej aktywnych nauczycieli",
    levels: {
        title: "Poziomy Użytkownika",
        bronze: "Brązowy Nauczyciel",
        silver: "Srebrny Nauczyciel",
        gold: "Złoty Nauczyciel",
        diamond: "Diamentowy Guru"
    },
    perks: {
        title: "Ukryte Przywileje",
        discount: "Stały rabat na wszystko",
        extra_points: "Mnożnik punktów lojalnościowych",
        early_access: "Wczesny dostęp do nowych materiałów"
    },
    badges_desc: "Automatyczne przyznawanie odznak za regularne zakupy i aktywność"
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

console.log("Economy & Gamification translation keys added and synchronized.");

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

// 1. Add admin settings translations to Polish
translations.pl.adminSettings = {
    title: "Ustawienia Systemowe",
    description: "Zarządzaj konfiguracją strony, analityką i SEO",
    tabs: {
        ai: "Modele AI",
        marketing: "Marketing & Analityka",
        seo: "SEO & Meta"
    },
    marketing: {
        ga4: "Google Analytics 4",
        ga4_placeholder: "G-XXXXXXXXXX",
        fb_pixel: "Facebook Pixel",
        fb_pixel_placeholder: "Kod Pixela (ID)",
        meta_verification: "Meta Domain Verification",
        meta_placeholder: "Klucz weryfikacyjny",
        gsc: "Google Search Console",
        gsc_placeholder: "Klucz weryfikacyjny Google",
        enabled: "Włącz śledzenie"
    },
    seo: {
        default_title: "Domyślny tytuł strony",
        default_desc: "Domyślny opis (Meta Description)",
        og_image: "Domyślny obraz udostępniania (OG Image)",
        site_name: "Nazwa witryny"
    }
};

// 2. Use the "Absolute Fix" logic to spread it
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

console.log("Admin translation keys added and synchronized across all languages.");

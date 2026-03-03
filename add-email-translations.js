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

// 1. Add Email Notifications translations to Polish
translations.pl.adminSettings.tabs.emails = "Powiadomienia E-mail";
translations.pl.adminSettings.emails = {
    title: "Szablony Wiadomości Systemowych",
    description: "Zarządzaj treścią wiadomości wysyłanych automatycznie do klientów",
    save: "Zapisz szablony",
    templates: {
        welcome: {
            title: "Powitanie po rejestracji",
            subject: "Witaj w społeczności!",
            content: "Cieszymy się, że jesteś z nami. Twoje dane do logowania to..."
        },
        order_confirmed: {
            title: "Potwierdzenie zamówienia",
            subject: "Twoje zamówienie nr {orderNumber} zostało przyjęte",
            content: "Dziękujemy za zakupy! Twoje materiały są już dostępne w panelu."
        },
        login_details: {
            title: "Dane dostępowe (po zakupie)",
            subject: "Twoje dane dostępu do kursów",
            content: "Oto Twoje dane do logowania: Email: {email}, Hasło: {password}"
        }
    },
    variables: "Dostępne zmienne: {orderNumber}, {email}, {password}, {firstName}, {total}"
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

console.log("Email Notification translation keys added and synchronized.");

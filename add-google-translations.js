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

// 1. Add Google Drive translations to Polish
translations.pl.adminSettings.tabs.google = "Google Cloud";
translations.pl.adminSettings.google = {
    title: "Integracja z Google Cloud",
    description: "Podłącz Google Drive, aby importować materiały bezpośrednio do sklepu",
    auth: {
        title: "Autoryzacja Google",
        connect: "Połącz z Google Drive",
        disconnect: "Odłącz konto",
        status_connected: "Połączono z kontem: {email}",
        status_disconnected: "Brak aktywnego połączenia"
    },
    drive: {
        title: "Przeglądarka Google Drive",
        import_selected: "Importuj wybrane pliki",
        refresh: "Odśwież listę",
        no_files: "Nie znaleziono plików PDF/ZIP na Twoim dysku",
        import_success: "Pomyślnie zaimportowano pliki jako materiały",
        column_name: "Nazwa pliku",
        column_size: "Rozmiar",
        column_action: "Akcja"
    },
    config: {
        client_id: "Google Client ID",
        client_secret: "Google Client Secret",
        redirect_uri: "URL powrotny (Redirect URI)"
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

console.log("Google Drive integration translation keys added and synchronized.");

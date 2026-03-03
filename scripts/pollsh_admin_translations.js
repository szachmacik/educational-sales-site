const fs = require('fs');
const path = require('path');

const localesPath = 'c:/Users/kamil/.gemini/antigravity/scratch/educational-sales-site/public/locales';

const globalMapping = {
    "Przedszkole": {
        "en": "Kindergarten", "es": "Preescolar", "fr": "Maternelle", "de": "Kindergarten", "it": "Scuola materna", "pt": "Pré-escola", "uk": "Дитячий садок"
    },
    "Klasa 1": {
        "en": "Grade 1", "es": "Grado 1", "fr": "Classe 1", "de": "Klasse 1", "it": "Classe 1", "pt": "1º Ano", "uk": "1 клас"
    },
    "Klasa 2": {
        "en": "Grade 2", "es": "Grado 2", "fr": "Classe 2", "de": "Klasse 2", "it": "Classe 2", "pt": "2º Ano", "uk": "2 клас"
    },
    "Klasa 3": {
        "en": "Grade 3", "es": "Grado 3", "fr": "Classe 3", "de": "Klasse 3", "it": "Classe 3", "pt": "3º Ano", "uk": "3 клас"
    }
};

const locales = fs.readdirSync(localesPath).filter(d => {
    const fullPath = path.join(localesPath, d);
    return fs.statSync(fullPath).isDirectory() && d !== 'pl';
});

for (const locale of locales) {
    const targetPath = path.join(localesPath, locale, 'admin.json');
    if (!fs.existsSync(targetPath)) continue;

    let content = fs.readFileSync(targetPath, 'utf8');

    for (const [pl, mapping] of Object.entries(globalMapping)) {
        const replacement = mapping[locale] || mapping['en'];
        // Replace whole string occurrences in JSON values
        const regex = new RegExp(`":\\s*"${pl}"`, 'g');
        content = content.replace(regex, `": "${replacement}"`);
    }

    fs.writeFileSync(targetPath, content);
}

console.log('Final polish complete.');

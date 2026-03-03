const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'lib', 'product-translations-data.ts');
let content = fs.readFileSync(filePath, 'utf8');

const masterTranslations = {
    "stories-na-wiosne-ebook-audio": {
        hu: { title: "Tavaszi történetek (E-könyv + Audió)", description: "Varázslatos tavaszi történetek gyerekeknek." },
        lt: { title: "Pavasario istorijos (E-knyga + Audio)", description: "Magiškos pavasario istorijos vaikams." },
        lv: { title: "Pavasara stāsti (E-grāmata + Audio)", description: "Maģiski pavasara stāsti bērniem." },
        et: { title: "Kevadlugusid (E-raamat + Audio)", description: "Maagilised kevadlood lastele." },
        hr: { title: "Proljetne priče (E-knjiga + Audio)", description: "Magične proljetne priče za djecu." },
        sr: { title: "Prolećne priče (E-knjiga + Audio)", description: "Magične prolećne priče za decu." },
        sl: { title: "Pomladne zgodbe (E-knjiga + Audio)", description: "Magične pomladne zgodbe za otroke." },
        bg: { title: "Пролетни истории (Е-книга + Аудио)", description: "Магични пролетни истории за деца." },
        el: { title: "Ανοιξιάτικες Ιστορίες (E-book + Audio)", description: "Μαγικές ανοιξιάτικες ιστορίες για παιδιά." }
    },
    "stories-na-lato-ebook-audio": {
        hu: { title: "Nyári történetek (E-könyv + Audió)", description: "Varázslatos nyári történetek gyerekeknek." },
        lt: { title: "Vasaros istorijos (E-knyga + Audio)", description: "Magiškos vasaros istorijos vaikams." },
        lv: { title: "Vasaras stāsti (E-grāmata + Audio)", description: "Maģiski vasaras stāsti bērniem." },
        et: { title: "Suvelugusid (E-raamat + Audio)", description: "Maagilised suvelood lastele." },
        hr: { title: "Ljetne priče (E-knjiga + Audio)", description: "Magične ljetne priče za djecu." },
        sr: { title: "Letnje priče (E-knjiga + Audio)", description: "Magične letnje priče za decu." },
        sl: { title: "Poletne zgodbe (E-knjiga + Audio)", description: "Magične poletne zgodbe za otroke." },
        bg: { title: "Летни истории (Е-книга + Аудио)", description: "Магични летни истории за деца." },
        el: { title: "Καλοκαιρινές Ιστορίες (E-book + Audio)", description: "Μαγικές καλοκαιρινές ιστορίες για παιδιά." }
    },
    "stories-na-jesien-ebook-audio": {
        hu: { title: "Őszi történetek (E-könyv + Audió)", description: "Varázslatos őszi történetek gyerekeknek." },
        lt: { title: "Rudens istorijos (E-knyga + Audio)", description: "Magiškos rudens istorijos vaikams." },
        lv: { title: "Rudens stāsti (E-grāmata + Audio)", description: "Maģiski rudens stāsti bērniem." },
        et: { title: "Sügislood (E-raamat + Audio)", description: "Maagilised sügislood lastele." },
        hr: { title: "Jesenske priče (E-knjiga + Audio)", description: "Magične jesenske priče za djecu." },
        sr: { title: "Jesnje priče (E-knjiga + Audio)", description: "Magične jesnje priče za decu." },
        sl: { title: "Jesenske zgodbe (E-knjiga + Audio)", description: "Magične jesenske zgodbe za otroke." },
        bg: { title: "Есенни истории (Е-книга + Аудио)", description: "Магични есенни истории за деца." },
        el: { title: "Φθινοπωρινές Ιστορίες (E-book + Audio)", description: "Μαγικές φθινοπωρινές ιστορίες για παιδιά." }
    }
};

// Final loop to apply all translations
Object.keys(masterTranslations).forEach(id => {
    const langs = masterTranslations[id];
    Object.keys(langs).forEach(lang => {
        const trans = langs[lang];
        const entry = `        ${lang}: { title: "${trans.title}", description: "${trans.description}" },`;

        const hasLang = new RegExp(`"${id}":\\s*{[^}]*\\b${lang}:`, 'g');
        if (content.match(hasLang)) return;

        const regexStr = `("${id}":\\s*{[\\s\\S]*?)(^\\s*pl:)`;
        const regex = new RegExp(regexStr, 'm');
        if (content.match(regex)) {
            content = content.replace(regex, `$1${entry}\n$2`);
            console.log(`Added ${lang} for ${id}`);
        }
    });
});

fs.writeFileSync(filePath, content, 'utf8');

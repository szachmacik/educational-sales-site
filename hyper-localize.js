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

const localizationData = {
    en: {
        reviews: [
            { name: "Anna Smith", role: "English Teacher, London", content: "The materials are fantastic! My students are more engaged than ever before." },
            { name: "David Jones", role: "Primary Teacher, Manchester", content: "Ready-to-use lesson plans and printables are a lifesaver. Highly recommend!" }
        ]
    },
    uk: {
        reviews: [
            { name: "Олена Петренко", role: "Вчитель англійської, Київ", content: "Фантастичні матеріали! Мої учні залучені як ніколи раніше." },
            { name: "Сергій Іванов", role: "Вчитель початкових класів, Львів", content: "Готові конспекти та матеріали для друку - це успіх. Рекомендую!" }
        ]
    },
    de: {
        reviews: [
            { name: "Martina Koch", role: "Englischlehrerin, Berlin", content: "Die Materialien są fantastyczne! Meine Schüler sind engagierter als je zuvor." },
            { name: "Klaus Weber", role: "Grundschullehrer, München", content: "Fertige Unterrichtspläne und Druckvorlagen sind ein voller Erfolg. Ich empfehle sie jedem!" }
        ]
    },
    es: {
        reviews: [
            { name: "Carmen García", role: "Profesora de inglés, Madrid", content: "¡Los materiales son fantásticos! Mis alumnos están más motivados que nunca." },
            { name: "Jose Rodriguez", role: "Maestro de primaria, Barcelona", content: "Los planes de lecciones listos para usar son un éxito. ¡Lo recomiendo a todos!" }
        ]
    },
    fr: {
        reviews: [
            { name: "Marie Dubois", role: "Professeure d'anglais, Paris", content: "Les supports są fantastyczne ! Mes élèves sont plus impliqués que jamais." },
            { name: "Jean Renault", role: "Professeur des écoles, Lyon", content: "Les fiches de cours prêtes à l'emploi sont une réussite. Je recommande !" }
        ]
    },
    it: {
        reviews: [
            { name: "Giulia Rossi", role: "Insegnante di inglese, Roma", content: "I materiali sono fantastici! I miei studenti sono più coinvolti che mai." },
            { name: "Marco Bianchi", role: "Insegnante elementare, Milano", content: "Lezioni pronte e schede da stampare sono un successo. Lo consiglio!" }
        ]
    },
    cs: {
        reviews: [
            { name: "Jana Nováková", role: "Učitelka angličtiny, Praha", content: "Tyto materiály jsou fantastické! Moje studenti jsou zapojeni jako nikdy předtím." },
            { name: "Petr Svoboda", role: "Učitel na ZŠ, Brno", content: "Hotové plány lekcí a pracovní listy jsou skvělé. Všem doporučuji!" }
        ]
    },
    sk: {
        reviews: [
            { name: "Zuzana Horváthová", role: "Učiteľka angličtiny, Bratislava", content: "Materiály sú fantastické! Moji študenti sú zapojení ako nikdy predtým." },
            { name: "Jozef Kováč", role: "Učiteľ na ZŠ, Košice", content: "Hotové plány lekcií a materiály na tlač sú úspechom. Odporúčam!" }
        ]
    },
    ro: {
        reviews: [
            { name: "Elena Popescu", role: "Profesoară de engleză, București", content: "Materialele sunt fantastice! Elevii mei sunt mai implicați ca niciodată." },
            { name: "Andrei Ionescu", role: "Profesor de școală primară, Cluj", content: "Planurile de lecții gata de utilizat sunt un succes. Recomand tuturor!" }
        ]
    },
    hu: {
        reviews: [
            { name: "Nagy Anikó", role: "Angoltanár, Budapest", content: "Az anyagok fantasztikusak! A diákjaim aktívabbak, mint valaha." },
            { name: "Kovács László", role: "Általános iskolai tanár, Debrecen", content: "A kész óratervek és nyomtatható anyagok telitalálatok. Mindenkinek ajánlom!" }
        ]
    },
    pt: {
        reviews: [
            { name: "Ana Pereira", role: "Professora de inglês, Lisboa", content: "Os materiais são fantásticos! Os meus alunos estão mais empenhados do que nunca." },
            { name: "Carlos Silva", role: "Professor do 1º Ciclo, Porto", content: "As planificações prontas a usar são um sucesso. Recomendo a todos!" }
        ]
    },
    lt: {
        reviews: [
            { name: "Daiva Petraitienė", role: "Anglų k. mokytoja, Vilnius", content: "Medžiaga tiesiog fantastiška! Mano mokiniai įsitraukę labiau nei bet kada anksčiau." },
            { name: "Jonas Karalius", role: "Pradinių klasių mokytojas, Kaunas", content: "Paruošti pamokų planai ir dalomoji medžiaga yra puikus pasirinkimas. Rekomenduoju!" }
        ]
    },
    lv: {
        reviews: [
            { name: "Laura Bērziņa", role: "Angļu valodas skolotāja, Rīga", content: "Materiāli ir fantastiski! Mani skolēni ir iesaistīti vairāk nekā jebkad agrāk." },
            { name: "Jānis Kalniņš", role: "Sākumskolas skolotājs, Liepāja", content: "Gatavie stundu plāni un izdales materiāli ir lieliski. Iesaku visiem!" }
        ]
    },
    et: {
        reviews: [
            { name: "Katrin Tamm", role: "Inglise keele õpetaja, Tallinn", content: "Materjalid on fantastilised! Minu õpilased on kaasatud rohkem kui kunagi varem." },
            { name: "Tiit Kuusk", role: "Algklassiõpetaja, Tartu", content: "Valmis tunnid ja prinditavad materjalid on suurepärased. Soovitan kõigile!" }
        ]
    },
    hr: {
        reviews: [
            { name: "Marija Horvat", role: "Učiteljica engleskog, Zagreb", content: "Materijali su fantastični! Moji su učenici angažiraniji nego ikada prije." },
            { name: "Ivan Kovač", role: "Učitelj razredne nastave, Split", content: "Gotove pripreme i listići su pun pogodak. Preporučujem svima!" }
        ]
    },
    sr: {
        reviews: [
            { name: "Jelena Marković", role: "Nastavnica engleskog, Beograd", content: "Materijali su fantastični! Moji učenici su angažovaniji nego ikada pre." },
            { name: "Marko Nikolić", role: "Nastavnik razredne nastave, Novi Sad", content: "Gotove pripreme i materijali za štampu su pun pogodak. Preporučujem!" }
        ]
    },
    sl: {
        reviews: [
            { name: "Mojca Novak", role: "Učiteljica angleščine, Ljubljana", content: "Gradiva so fantastična! Moji učenci so bolj motivirani kot kadarkoli prej." },
            { name: "Janez Kranjc", role: "Učitelj na osnovni šoli, Maribor", content: "Pripravljeni načrti lekcij so odlični. Priporočam vsem učiteljem!" }
        ]
    },
    bg: {
        reviews: [
            { name: "Елена Георгиева", role: "Учител по английски, София", content: "Материалите са фантастични! Моите ученици са по-ангажирани от всякога." },
            { name: "Иван Димитров", role: "Начален учител, Пловдив", content: "Готовите учебни планове са попадение. Препоръчвам ги на всеки колега!" }
        ]
    }
};

const commonFixes = {
    hero: {
        videoPresentation: {
            uk: "Відео презентація матеріалів", de: "Videopräsentation der Materialien", es: "Presentación en video de los materiales",
            fr: "Présentation vidéo des supports", it: "Presentazione video dei materiali", cs: "Video prezentace materiálů",
            sk: "Video prezentácia materiálov", ro: "Prezentare video a materialelor", hu: "Anyagok videós bemutatója",
            pt: "Apresentação em vídeo dos materiais", lt: "Medžiagos vaizdo pristatymas", lv: "Materiālu video prezentācija",
            et: "Materjalide videoesitlus", hr: "Video prezentacija materijala", sr: "Video prezentacija materijala",
            sl: "Video predstavitev gradiv", bg: "Видео презентация на материалите"
        }
    },
    categories: {
        items: {
            "przedszkole": {
                uk: "Дитячий садок", de: "Kindergarten", es: "Preescolar", fr: "Maternelle", it: "Scuola dell'infanzia",
                cs: "Mateřská škola", sk: "Materská škola", ro: "Grădiniță", hu: "Óvoda", pt: "Jardim de Infância",
                lt: "Darželis", lv: "Bērnudārzs", et: "Lasteaed", hr: "Dječji vrtić", sr: "Vrtić", sl: "Vrtec", bg: "Детска градина"
            },
            "klasy-4-6": {
                uk: "Класи 4-6", de: "Klassen 4-6", es: "Clases 4-6", fr: "Classes 4-6", it: "Classi 4-6",
                cs: "Třídy 4-6", sk: "Triedy 4-6", ro: "Clasele 4-6", hu: "4-6. osztály", pt: "Turmas 4-6",
                lt: "4-6 Klasės", lv: "4-6 Klase", et: "4-6 Klass", hr: "Razredi 4-6", sr: "Razredi 4-6", sl: "Razredi 4-6", bg: "Класове 4-6"
            },
            "klasy-7-8": {
                uk: "Класи 7-8", de: "Klassen 7-8", es: "Clases 7-8", fr: "Classes 7-8", it: "Classi 7-8",
                cs: "Třídy 7-8", sk: "Triedy 7-8", ro: "Clasele 7-8", hu: "7-8. osztály", pt: "Turmas 7-8",
                lt: "7-8 Klasės", lv: "7-8 Klase", et: "7-8 Klass", hr: "Razredi 7-8", sr: "Razredi 7-8", sl: "Razredi 7-8", bg: "Класове 7-8"
            }
        }
    }
};

for (const lang of Object.keys(localizationData)) {
    if (translations[lang]) {
        translations[lang].testimonials.reviews = localizationData[lang].reviews;

        // Apply nested sub-fixes if missing
        if (translations[lang].hero && commonFixes.hero.videoPresentation[lang]) {
            translations[lang].hero.videoPresentation = commonFixes.hero.videoPresentation[lang];
        }

        if (translations[lang].categories && translations[lang].categories.items) {
            for (const catKey of ["przedszkole", "klasy-4-6", "klasy-7-8"]) {
                if (translations[lang].categories.items[catKey] && commonFixes.categories.items[catKey][lang]) {
                    translations[lang].categories.items[catKey].title = commonFixes.categories.items[catKey][lang];
                    translations[lang].categories.items[catKey].description = commonFixes.categories.items[catKey][lang] === "Kindergarten" ? "Materialien für Kindergarten" : translations[lang].categories.items[catKey].description;

                    // Generic description fix for categories to avoid Polish
                    if (translations[lang].categories.items[catKey].description.includes("Materiały dla")) {
                        translations[lang].categories.items[catKey].description = translations.en.categories.items[catKey].description; // Fallback to EN if it was PL
                    }
                }
            }
        }

        // Fix the "Scenariusze, karty pracy..." subheader in products if it's still Polish
        if (translations[lang].products && translations[lang].products.sub && translations[lang].products.sub.includes("Scenariusze")) {
            translations[lang].products.sub = translations.en.products.sub;
        }
    }
}

// Final sweep for any "Materiały dla" or other obviously Polish strings outside PL block
const plWords = ["Materiały dla", "Przetestowane w klasie", "Zaloguj się", "Panel Kursanta"];
for (const lang of Object.keys(translations)) {
    if (lang === 'pl') continue;

    const langStr = JSON.stringify(translations[lang]);
    if (langStr.includes("Materiały dla") || langStr.includes("Przetestowane w klasie")) {
        console.log(`Cleaning remaining Polish leaks in ${lang}...`);
        // We'll replace them with EN defaults for safety if they leaked this far
        translations[lang].hero.testedInClass = translations.en.hero.testedInClass;
        if (translations[lang].footer.description.includes("Kreatywne materiały")) {
            translations[lang].footer.description = translations.en.footer.description;
        }
    }
}

const finalContent = content.substring(0, startIdx) + JSON.stringify(translations, null, 4) + content.substring(endIdx);
fs.writeFileSync('lib/translations.ts', finalContent);
console.log("Hyper-Localization & Leak Cleanup Complete.");

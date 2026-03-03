const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'lib', 'product-translations-data.ts');
let content = fs.readFileSync(filePath, 'utf8');

const masterTranslations = {
    // Stories
    "pakiet-stories-ebooki-audio-na-4-pory-roku": {
        hu: { title: "Történetek csomag - 4 évszak", description: "Mesék és történetek egész évre, hanganyaggal." },
        lt: { title: "Istorijų rinkinys - 4 metų laikai", description: "Pasakos ir istorijos visiems metams su garso įrašais." },
        lv: { title: "Stāstu pakete - 4 gadalaiki", description: "Pasakas un stāsti visam gadam ar audio materiāliem." },
        et: { title: "Lugude pakett - 4 aastaaega", description: "Muinasjutud ja lood terveks aastaks koos audioga." },
        hr: { title: "Paket priča - 4 godišnja doba", description: "Priče i bajke za cijelu godinu s audio materijalima." },
        sr: { title: "Paket priča - 4 godišnja doba", description: "Priče i bajke za celu godinu sa audio materijalima." },
        sl: { title: "Paket zgodb - 4 letni časi", description: "Zgodbe in pravljice za celo leto z avdio materiali." },
        bg: { title: "Пакет истории - 4 сезона", description: "Истории и приказки за цялата година с аудио материали." },
        el: { title: "Πακέτο Ιστοριών - 4 Εποχές", description: "Ιστορίες και παραμύθια για όλο το χρόνο με υλικό ήχου." }
    },
    "stories-na-zime-ebook-audio": {
        hu: { title: "Téli történetek (E-könyv + Audió)", description: "Varázslatos téli történetek gyerekeknek." },
        lt: { title: "Žiemos istorijos (E-knyga + Audio)", description: "Magiškos žiemos istorijos vaikams." },
        lv: { title: "Ziemas stāsti (E-grāmata + Audio)", description: "Maģiski ziemas stāsti bērniem." },
        et: { title: "Talvelugusid (E-raamat + Audio)", description: "Maagilised talvelood lastele." },
        hr: { title: "Zimske priče (E-knjiga + Audio)", description: "Magične zimske priče za djecu." },
        sr: { title: "Zimske priče (E-knjiga + Audio)", description: "Magične zimske priče za decu." },
        sl: { title: "Zimske zgodbe (E-knjiga + Audio)", description: "Magične zimske zgodbe za otroke." },
        bg: { title: "Зимни истории (Е-книга + Аудио)", description: "Магични зимни истории за деца." },
        el: { title: "Χειμερινές Ιστορίες (E-book + Audio)", description: "Μαγικές χειμερινές ιστορίες για παιδιά." }
    },
    // Cultural Materials
    "the-uk-ireland-materialy-kulturowe-pakiet": {
        hu: { title: "UK és Írország kulturális csomag", description: "Érdekességek és leckék a brit és ír kultúráról." },
        lt: { title: "JK ir Airijos kultūros rinkinys", description: "Įdomybės ir pamokos apie Britų ir Airių kultūrą." },
        lv: { title: "AK un Īrijas kultūras pakete", description: "Interesanti fakti un nodarbības par britu un īru kultūru." },
        et: { title: "Ühendkuningriigi ja Iirimaa kultuuripakett", description: "Huvitavad faktid ja tunnid Briti ja Iiri kultuuri kohta." },
        hr: { title: "Kulturni paket UK i Irska", description: "Zanimljivosti i lekcije o britanskoj i irskoj kulturi." },
        sr: { title: "Kulturni paket UK i Irska", description: "Zanimljivosti i lekcije o britanskoj i irskoj kulturi." },
        sl: { title: "Kulturni paket VB in Irska", description: "Zanimivosti in lekcije o britanski in irski kulturi." },
        bg: { title: "Културен пакет Обединеното кралство и Ирландия", description: "Интересни факти и уроци за британската и ирландската култура." },
        el: { title: "Πακέτο Πολιτισμικού Υλικού Ηνωμένο Βασίλειο & Ιρλανδία", description: "Ενδιαφέροντα στοιχεία και μαθήματα για τον βρετανικό και ιρλανδικό πολιτισμό." }
    },
    "interaktywne-quizy-kulturowe": {
        hu: { title: "Interaktív kulturális kvízek", description: "Játékos tanulás interaktív kvízekkel." },
        lt: { title: "Interaktyvios kultūros viktorinos", description: "Žaismingas mokymasis su interaktyviomis viktorinomis." },
        lv: { title: "Interaktīvās kultūras viktorīnas", description: "Rotaļīga mācīšanās ar interaktīvām viktorīnām." },
        et: { title: "Interaktiivsed kultuuriviktoriinid", description: "Mänguline õppimine interaktiivsete viktoriinidega." },
        hr: { title: "Interaktivni kulturni kvizovi", description: "Učenje kroz igru uz interaktivne kvizove." },
        sr: { title: "Interaktivni kulturni kvizovi", description: "Učenje kroz igru uz interaktivne kvizove." },
        sl: { title: "Interaktivni kulturni kvizi", description: "Učenje skozi igro z interaktivnimi kvizi." },
        bg: { title: "Интерактивни културни куизи", description: "Забавно учене с интерактивни викторини." },
        el: { title: "Διαδραστικά Πολιτισμικά Κουίζ", description: "Παιγνιώδης μάθηση με διαδραστικά κουίζ." }
    }
};

// Add placeholders for remaining single lessons
const lessons = ["wales-lekcja-kulturowa", "ireland-lekcja-kulturowa-kopia", "england-lekcja-kulturowa", "scotland-materialy-kulturowe"];
const lessonMap = {
    "wales-lekcja-kulturowa": { name: "Wales", hu: "Wales", lt: "Velsas", lv: "Velsa", et: "Wales", hr: "Wales", sr: "Vels", sl: "Wales", bg: "Уелс", el: "Ουαλία" },
    "ireland-lekcja-kulturowa-kopia": { name: "Ireland", hu: "Írország", lt: "Airija", lv: "Īrija", et: "Iirimaa", hr: "Irska", sr: "Irska", sl: "Irska", bg: "Ирландия", el: "Ιρλανδία" },
    "england-lekcja-kulturowa": { name: "England", hu: "Anglia", lt: "Anglija", lv: "Anglija", et: "Inglismaa", hr: "Engleska", sr: "Engleska", sl: "Anglija", bg: "Англия", el: "Αγγλία" },
    "scotland-materialy-kulturowe": { name: "Scotland", hu: "Skócia", lt: "Škotija", lv: "Skotija", et: "Šotimaa", hr: "Škotska", sr: "Škotska", sl: "Škotska", bg: "Шотландия", el: "Σκωτία" }
};

lessons.forEach(l => {
    const translations = {};
    Object.keys(lessonMap[l]).forEach(lang => {
        if (lang === 'name') return;
        const country = lessonMap[l][lang];
        const titleSuffix = {
            hu: " - kulturális lecke", lt: " - kultūros pamoka", lv: " - kultūras nodarbība", et: " - kultuuritund",
            hr: " - kulturna lekcija", sr: " - kulturna lekcija", sl: " - kulturna lekcija", bg: " - културен урок", el: " - πολιτισμικό μάθημα"
        };
        const descSuffix = {
            hu: "Minden, amit a gyerekeknek tudniuk kell ", lt: "Viskas, ką vaikai turi žinoti apie ", lv: "Viss, kas bērniem jāzina par ",
            et: "Kõik, mida lapsed peavad teadma ", hr: "Sve što djeca trebaju znati o ", sr: "Sve što deca trebaju znati o ",
            sl: "Vse, kar morajo otroci vedeti o ", bg: "Всичко, което децата трябва да знаят за ", el: "Όλα όσα πρέπει να γνωρίζουν τα παιδιά για "
        };
        translations[lang] = {
            title: country + titleSuffix[lang],
            description: descSuffix[lang] + country + (lang === 'hu' ? "ról." : lang === 'lv' ? "u." : ".")
        };
    });
    masterTranslations[l] = translations;
});

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

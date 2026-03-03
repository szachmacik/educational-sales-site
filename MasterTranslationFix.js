const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'lib', 'product-translations-data.ts');
let content = fs.readFileSync(filePath, 'utf8');

const masterTranslations = {
    "special-lesson-vol-2": {
        hu: { title: "Speciális lecke 2. kötet", description: "Kész anyagok egy lenyűgöző és kreatív angol nyelvű órához." },
        lt: { title: "Speciali pamoka 2 tomas", description: "Paruošta medžiaga įdomiai ir kūrybiškai anglų kalbos pamokai." },
        lv: { title: "Speciālā nodarbība 2. sējums", description: "Gatavi materiāli aizraujošai un radošai angļu valodas stundai." },
        et: { title: "Eritund 2. köide", description: "Valmismaterjalid põnevaks ja loominguliseks inglise keele tunniks." },
        hr: { title: "Posebna lekcija Vol. 2", description: "Spremni materijali za fascinantnu i kreativnu lekciju engleskog jezika." },
        sr: { title: "Posebna lekcija Vol. 2", description: "Spremni materijali za fascinantnu i kreativnu lekciju engleskog jezika." },
        sl: { title: "Posebna lekcija Vol. 2", description: "Pripravljeni materiali za fascinantno in kreativno lekcijo angleščine." },
        bg: { title: "Специален урок Том 2", description: "Готови материали за очарователен и креативен урок по английски език." },
        el: { title: "Ειδικό Μάθημα Τόμος 2", description: "Έτοιμο υλικό για ένα συναρπαστικό και δημιουργικό μάθημα αγγλικών." }
    },
    "pakiet-materialow-na-4-pory-roku": {
        hu: { title: "Anyagcsomag - 4 évszak", description: "Átfogó tananyagkészlet az év minden szakaszára." },
        lt: { title: "Medžiagos rinkinys - 4 metų laikai", description: "Išsamus mokymo medžiagos rinkinys visiems metų laikams." },
        lv: { title: "Materiālu pakete - 4 gadalaiki", description: "Visaptverošs mācību materialeļu komplekts visiem gadalaikiem." },
        et: { title: "Materjalipakett - 4 aastaaega", description: "Põhjalik õppematerjalide komplekt kõigile aastaaegadele." },
        hr: { title: "Paket materijala - 4 godišnja doba", description: "Sveobuhvatan set nastavnih materijala za sva godišnja doba." },
        sr: { title: "Paket materijala - 4 godišnja doba", description: "Sveobuhvatan set nastavnih materijala za sva godišnja doba." },
        sl: { title: "Paket materialov - 4 letni časi", description: "Sveobuhvaten nabor učnih gradiv za vse letne čase." },
        bg: { title: "Пакет материали - 4 сезона", description: "Изчерпателен набор от учебни материали за всички сезони." },
        el: { title: "Πακέτο Υλικού - 4 Εποχές", description: "Ένα ολοκληρωμένο σύνολο εκπαιδευτικού υλικού για όλες τις εποχές του χρόνου." }
    },
    "plany-zajec-wrzesien": {
        uk: { title: "Плани занять: Вересень", description: "Повні плани занять на вересень." },
        de: { title: "Unterrichtspläne: September", description: "Vollständige Unterrichtspläne für den Monat September." },
        es: { title: "Planes de Clase: Septiembre", description: "Planes de clase completos para el mes de septiembre." },
        fr: { title: "Plans de Cours : Septembre", description: "Plans de cours complets pour le mois de cours de septembre." },
        it: { title: "Piani delle Lezioni: Settembre", description: "Piani delle lezioni completi per il mese di settembre." },
        cs: { title: "Plány lekcí: Září", description: "Kompletní plány lekcí pro měsíc září." },
        sk: { title: "Plány lekcií: September", description: "Kompletné plány lekcií pre mesiac september." },
        ro: { title: "Planuri de lecție: Septembrie", description: "Planuri de lecție complete pentru luna septembrie." },
        hu: { title: "Óratervek: Szeptember", description: "Teljes óratervek szeptember hónapra." },
        lt: { title: "Pamokų planai: Rugsėjis", description: "Išsamūs pamokų planai rugsėjo mėnesiui." },
        lv: { title: "Nodarbību plāni: Septembris", description: "Pilni nodarbību plāni septembra mēnesim." },
        et: { title: "Tunniplaanid: September", description: "Täielikud tunniplaanid septembrikuuks." },
        hr: { title: "Planovi lekcija: Rujan", description: "Kompletni planovi lekcija za mjesec rujan." },
        sr: { title: "Planovi lekcija: Septembar", description: "Kompletni planovi lekcija za mesec septembar." },
        sl: { title: "Učni načrti: September", description: "Popolni učni načrti za mesec september." },
        bg: { title: "Планове за уроци: Септември", description: "Пълни планове за уроци за месец септември." },
        el: { title: "Σχέδια Μαθήματος: Σεπτέμβριος", description: "Πλήρη σχέδια μαθήματος για τον μήνα Σεπτέμβριο." }
    }
};

const months = ["wrzesien-kopia", "listopad", "grudzien", "styczen", "luty", "marzec", "kwiecien", "maj", "czerwiec"];
const monthMap = {
    "wrzesien-kopia": { pl: "Październik", en: "October", uk: "Жовтень", de: "Oktober", es: "Octubre", fr: "Octobre", it: "Ottobre", cs: "Říjen", sk: "Október", ro: "Octombrie", hu: "Október", lt: "Spalis", lv: "Oktobris", et: "Oktoober", hr: "Listopad", sr: "Oktobar", sl: "Oktober", bg: "Октомври", el: "Οκτώβριος" },
    "listopad": { pl: "Listopad", en: "November", uk: "Листопад", de: "November", es: "Noviembre", fr: "Novembre", it: "Novembre", cs: "Listopad", sk: "November", ro: "Noiembrie", hu: "November", lt: "Lapkritis", lv: "Novembris", et: "November", hr: "Studeni", sr: "Novembar", sl: "November", bg: "Ноенмври", el: "Νοέμβριος" },
    "grudzien": { pl: "Grudzień", en: "December", uk: "Грудень", de: "Dezember", es: "Diciembre", fr: "Décembre", it: "Dicembre", cs: "Prosinec", sk: "December", ro: "Decembrie", hu: "December", lt: "Gruodis", lv: "Decembris", et: "Detsember", hr: "Prosinac", sr: "Decembar", sl: "December", bg: "Декември", el: "Δεκέμβριος" },
    "styczen": { pl: "Styczeń", en: "January", uk: "Січень", de: "Januar", es: "Enero", fr: "Janvier", it: "Gennaio", cs: "Leden", sk: "Január", ro: "Ianuarie", hu: "Január", lt: "Sausis", lv: "Janvāris", et: "Jaanuar", hr: "Siječanj", sr: "Januar", sl: "Januar", bg: "Януари", el: "Ιανουάριος" },
    "luty": { pl: "Luty", en: "February", uk: "Лютий", de: "Februar", es: "Febrero", fr: "Février", it: "Febbraio", cs: "Únor", sk: "Február", ro: "Februarie", hu: "Február", lt: "Vasaris", lv: "Februāris", et: "Veebruar", hr: "Veljača", sr: "Februar", sl: "Februar", bg: "Февруари", el: "Φεβρουάριος" },
    "marzec": { pl: "Marzec", en: "March", uk: "Березень", de: "März", es: "Marzo", fr: "Mars", it: "Marzo", cs: "Březen", sk: "Marec", ro: "Martie", hu: "Március", lt: "Kovas", lv: "Marts", et: "Märts", hr: "Ožujak", sr: "Mart", sl: "Marec", bg: "Март", el: "Μάρτιος" },
    "kwiecien": { pl: "Kwiecień", en: "April", uk: "Квітень", de: "April", es: "Abril", fr: "Avril", it: "Aprile", cs: "Duben", sk: "Apríl", ro: "Aprilie", hu: "Április", lt: "Balandis", lv: "Aprīlis", et: "Aprill", hr: "Travanj", sr: "April", sl: "April", bg: "Април", el: "Απρίλιος" },
    "maj": { pl: "Maj", en: "May", uk: "Травень", de: "Mai", es: "Mayo", fr: "Mai", it: "Maggio", cs: "Květen", sk: "Máj", ro: "Mai", hu: "Május", lt: "Gegužė", lv: "Maijs", et: "Mai", hr: "Svibanj", sr: "Maj", sl: "Maj", bg: "Май", el: "Μάιος" },
    "czerwiec": { pl: "Czerwiec", en: "June", uk: "Червень", de: "Juni", es: "Junio", fr: "Juin", it: "Giugno", cs: "Červen", sk: "Jún", ro: "Iunie", hu: "Június", lt: "Birželis", lv: "Jūnijs", et: "Juuni", hr: "Lipanj", sr: "Jun", sl: "Junij", bg: "Юни", el: "Ιούνιος" }
};

months.forEach(m => {
    const id = `plany-zajec-${m}`;
    const translations = {};
    Object.keys(monthMap[m]).forEach(lang => {
        if (lang === 'pl' || lang === 'en') return;
        const monthName = monthMap[m][lang];
        const titleSuffix = {
            uk: "Плани занять: ", de: "Unterrichtspläne: ", es: "Planes de Clase: ", fr: "Plans de Cours : ", it: "Piani delle Lezioni: ",
            cs: "Plány lekcí: ", sk: "Plány lekcií: ", ro: "Planuri de lecție: ", hu: "Óratervek: ", lt: "Pamokų planai: ",
            lv: "Nodarbību plāni: ", et: "Tunniplaanid: ", hr: "Planovi lekcija: ", sr: "Planovi lekcija: ", sl: "Učni načrti: ",
            bg: "Планове за уроци: ", el: "Σχέδια Μαθήματος: "
        };
        const descSuffix = {
            uk: "Повні плани занять на ", de: "Vollständige Unterrichtspläne für den Monat ", es: "Planes de clase completos para el mes de ",
            fr: "Plans de cours complets pour le mois de ", it: "Piani delle lezioni completi per il mese di ",
            cs: "Kompletní plány lekcí pro měsíc ", sk: "Kompletné plány lekcií pre mesiac ", ro: "Planuri de lecție complete pentru luna ",
            hu: "Teljes óratervek ", lt: "Išsamūs pamokų planai ", lv: "Pilni nodarbību plāni ", et: "Täielikud tunniplaanid ",
            hr: "Kompletni planovi lekcija za mjesec ", sr: "Kompletni planovi lekcija za mesec ", sl: "Popolni učni načrti za mesec ",
            bg: "Пълни планове за уроци за месец ", el: "Πλήρη σχέδια μαθήματος για τον μήνα "
        };

        translations[lang] = {
            title: (titleSuffix[lang] || "") + monthName,
            description: (descSuffix[lang] || "") + monthName.toLowerCase() + "."
        };
    });
    masterTranslations[id] = translations;
});

// Final loop to apply all translations
Object.keys(masterTranslations).forEach(id => {
    const langs = masterTranslations[id];
    Object.keys(langs).forEach(lang => {
        const trans = langs[lang];
        const entry = `        ${lang}: { title: "${trans.title}", description: "${trans.description}" },`;

        // Find if this specific lang already exists (to avoid duplicates)
        const hasLang = new RegExp(`"${id}":\\s*{[^}]*\\b${lang}:`, 'g');
        if (content.match(hasLang)) return;

        // Insert before pl: (which is usually the last one)
        const regexStr = `("${id}":\\s*{[\\s\\S]*?)(^\\s*pl:)`;
        const regex = new RegExp(regexStr, 'm');
        if (content.match(regex)) {
            content = content.replace(regex, `$1${entry}\n$2`);
            console.log(`Added ${lang} for ${id}`);
        }
    });
});

fs.writeFileSync(filePath, content, 'utf8');

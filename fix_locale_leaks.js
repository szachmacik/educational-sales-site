const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'public', 'locales');
const languages = ['en', 'uk', 'de', 'es', 'fr', 'it', 'cs', 'sk', 'ro', 'hu', 'pt', 'lt', 'lv', 'et', 'hr', 'sr', 'sl', 'bg', 'el'];

/**
 * MASTER DICTIONARY for missing sections in admin.json
 * We focus on the most commonly untranslated sections: Subscriptions, Gamification, Integrations.
 */
const masterTranslations = {
    bg: {
        subscriptions: { title: "Абонаменти", description: "Управление на моделите за периодичен достъп" },
        gamification: { title: "Гамификация", description: "Мотивирайте учениците с нива и значки" },
        integrations: { title: "Интеграции", description: "Връзки с външни системи" },
        rights: "Всички права запазени.",
        byKamila: "от Kamila Łobko-Koziej"
    },
    cs: {
        subscriptions: { title: "Předplatné", description: "Správa modelů pravidelného přístupu" },
        gamification: { title: "Gryifikace", description: "Motivujte studenty pomocí úrovní a odznaků" },
        integrations: { title: "Integrace", description: "Propojení s externími systémy" },
        rights: "Všechna práva vyhrazena.",
        byKamila: "od Kamily Łobko-Koziej"
    },
    sk: {
        subscriptions: { title: "Predplatné", description: "Správa modelov pravidelného prístupu" },
        gamification: { title: "Gryifikácia", description: "Motivujte študentov pomocou úrovní a odznakov" },
        integrations: { title: "Integrácie", description: "Prepojenie s externými systémami" },
        rights: "Všetky práva vyhradené.",
        byKamila: "od Kamily Łobko-Koziej"
    },
    uk: {
        subscriptions: { title: "Підписки", description: "Керування моделями регулярного доступу" },
        gamification: { title: "Гейміфікація", description: "Мотивуйте студентів за допомогою рівнів та значків" },
        integrations: { title: "Інтеграції", description: "З'єднання з зовнішніми системами" },
        rights: "Усі права захищені.",
        byKamila: "від Каміли Лобко-Козей"
    },
    de: {
        subscriptions: { title: "Abonnements", description: "Verwalten Sie Modelle für wiederkehrenden Zugriff" },
        gamification: { title: "Gamifizierung", description: "Motivieren Sie Schüler mit Levels und Abzeichen" },
        integrations: { title: "Integrationen", description: "Verbindungen zu externen Systemen" },
        rights: "Alle Rechte vorbehalten.",
        byKamila: "von Kamila Łobko-Koziej"
    },
    es: {
        subscriptions: { title: "Suscripciones", description: "Gestionar modelos de acceso recurrente" },
        gamification: { title: "Gamificación", description: "Motive a sus estudiantes con niveles y medallas" },
        integrations: { title: "Integraciones", description: "Conexiones con sistemas externos" },
        rights: "Todos los derechos reservados.",
        byKamila: "por Kamila Łobko-Koziej"
    },
    fr: {
        subscriptions: { title: "Abonnements", description: "Gérer les modèles d'accès récurrents" },
        gamification: { title: "Gamification", description: "Motivez les élèves avec des niveaux et des badges" },
        integrations: { title: "Intégrations", description: "Connexions aux systèmes externes" },
        rights: "Tous droits réservés.",
        byKamila: "par Kamila Łobko-Koziej"
    },
    it: {
        subscriptions: { title: "Abbonamenti", description: "Gestisci i modelli di accesso ricorrente" },
        gamification: { title: "Gamification", description: "Motiva gli studenti con livelli e badge" },
        integrations: { title: "Integrazioni", description: "Connessioni a sistemi esterni" },
        rights: "Tutti i diritti riservati.",
        byKamila: "di Kamila Łobko-Koziej"
    },
    pt: {
        subscriptions: { title: "Assinaturas", description: "Gerenciar modelos de acesso recorrente" },
        gamification: { title: "Gamificação", description: "Motive os alunos com níveis e emblemas" },
        integrations: { title: "Integrações", description: "Conexões com sistemas externos" },
        rights: "Todos os direitos reservados.",
        byKamila: "por Kamila Łobko-Koziej"
    },
    ro: {
        subscriptions: { title: "Abonamente", description: "Gestionați modelele de acces recurent" },
        gamification: { title: "Gamificare", description: "Motivați elevii cu niveluri și insigne" },
        integrations: { title: "Integrări", description: "Conexiuni cu sisteme externe" },
        rights: "Toate drepturile rezervate.",
        byKamila: "de Kamila Łobko-Koziej"
    },
    hu: {
        subscriptions: { title: "Előfizetések", description: "Ismétlődő hozzáférési modellek kezelése" },
        gamification: { title: "Játékosítás", description: "Motiválja diákjait szintekkel és jelvényekkel" },
        integrations: { title: "Integrációk", description: "Külső rendszerekhez való kapcsolódás" },
        rights: "Minden jog fenntartva.",
        byKamila: "Kamila Łobko-Koziej által"
    },
    el: {
        subscriptions: { title: "Συνδρομές", description: "Διαχείριση μοντέλων επαναλαμβανόμενης πρόσβασης" },
        gamification: { title: "Gamification", description: "Παρακινήστε τους μαθητές με επίπεδα και σήματα" },
        integrations: { title: "Ενοποιήσεις", description: "Συνδέσεις με εξωτερικά συστήματα" },
        rights: "Με την επιφύλαξη παντός δικαιώματος.",
        byKamila: "από την Kamila Łobko-Koziej"
    },
    lt: {
        subscriptions: { title: "Prenumeratos", description: "Daugkartinės prieigos modelių valdymas" },
        gamification: { title: "Žaidybinimas", description: "Motyvuokite mokinius lygiais ir ženkleliais" },
        integrations: { title: "Integracijos", description: "Jungtys su išorinėmis sistemomis" },
        rights: "Visos teisės saugomos.",
        byKamila: "Kamila Łobko-Koziej"
    },
    lv: {
        subscriptions: { title: "Abonementi", description: "Piekļuves modeļu pārvaldība" },
        gamification: { title: "Spēļošana", description: "Motivējiet skolēnus ar līmeņiem un nozīmītēm" },
        integrations: { title: "Integrācijas", description: "Savienojumi ar ārējām sistēmām" },
        rights: "Visas tiesības aizsargātas.",
        byKamila: "Kamila Łobko-Koziej"
    },
    et: {
        subscriptions: { title: "Tellimused", description: "Korduvate juurdepääsumudelite haldamine" },
        gamification: { title: "Mängustamine", description: "Motiveerige õpilasi tasemete ja märkidega" },
        integrations: { title: "Integratsioonid", description: "Ühendused väliste süsteemidega" },
        rights: "Kõik õigused kaitstud.",
        byKamila: "Kamila Łobko-Koziej"
    },
    hr: {
        subscriptions: { title: "Pretplate", description: "Upravljanje modelima ponavljajućeg pristupa" },
        gamification: { title: "Gamifikacija", description: "Motivirajte učenike razinama i bedževima" },
        integrations: { title: "Integracije", description: "Veze s vanjskim sustavima" },
        rights: "Sva prava pridržana.",
        byKamila: "Kamila Łobko-Koziej"
    },
    sr: {
        subscriptions: { title: "Pretplate", description: "Upravljanje modelima ponavljajućeg pristupa" },
        gamification: { title: "Gamifikacija", description: "Motivišite učenike nivoima i bedževima" },
        integrations: { title: "Integracije", description: "Veze sa spoljnim sistemima" },
        rights: "Sva prava zadržana.",
        byKamila: "Kamila Łobko-Koziej"
    },
    sl: {
        subscriptions: { title: "Naročnine", description: "Upravljanje modelov ponavljajočega se dostopa" },
        gamification: { title: "Igrifikacija", description: "Motivirajte učence z ravnmi in značkami" },
        integrations: { title: "Integracije", description: "Povezave z zunanjimi sistemi" },
        rights: "Vse pravice pridržane.",
        byKamila: "Kamila Łobko-Koziej"
    }
};

function fixLeaks() {
    languages.forEach(lang => {
        const langPath = path.join(localesDir, lang);
        if (!fs.existsSync(langPath)) return;

        // 1. Fix common.json
        const commonFile = path.join(langPath, 'common.json');
        if (fs.existsSync(commonFile)) {
            let common = JSON.parse(fs.readFileSync(commonFile, 'utf8'));
            const master = masterTranslations[lang];

            if (master) {
                if (master.rights) common.footer.rights = master.rights;
                if (master.byKamila) common.brand.byKamila = master.byKamila;
            }

            // Generic Polish cleaning
            if (JSON.stringify(common).includes('Materiały edukacyjne') && lang !== 'pl') {
                // Should have been localized, but if we find it, we can force-fix known keys
                if (common.brand.educationalMaterials === "Materiały edukacyjne") {
                    // We don't have all localizations here but we can at least ensure it's not Polish
                    // Actually, if it's already localized (like "Vzdělávací materiály" in CS), it's fine.
                }
            }

            fs.writeFileSync(commonFile, JSON.stringify(common, null, 2), 'utf8');
            console.log(`Fixed common.json for ${lang}`);
        }

        // 2. Fix admin.json (English leaks)
        const adminFile = path.join(langPath, 'admin.json');
        if (fs.existsSync(adminFile)) {
            let admin = JSON.parse(fs.readFileSync(adminFile, 'utf8'));
            const master = masterTranslations[lang];

            if (master && admin.adminSettings) {
                // Fix Subscriptions
                if (master.subscriptions && admin.adminSettings.economy) {
                    admin.adminSettings.economy.subscriptions.title = master.subscriptions.title;
                    admin.adminSettings.economy.subscriptions.description = master.subscriptions.description;
                }
                // Fix Gamification
                if (master.gamification && admin.adminSettings.gamification) {
                    admin.adminSettings.gamification.title = master.gamification.title;
                    admin.adminSettings.gamification.description = master.gamification.description;
                }
                // Fix Integrations
                if (master.integrations && admin.adminSettings.integrations) {
                    admin.adminSettings.integrations.title = master.integrations.title;
                    admin.adminSettings.integrations.description = master.integrations.description;
                }
            }

            fs.writeFileSync(adminFile, JSON.stringify(admin, null, 2), 'utf8');
            console.log(`Fixed admin.json for ${lang}`);
        }
    });
}

fixLeaks();

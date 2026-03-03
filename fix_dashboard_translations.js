/**
 * Generate dashboard.json translations for all locales
 * Uses EN as reference and provides proper translations
 */
const fs = require('fs');
const path = require('path');

const LOCALES_DIR = path.join(__dirname, 'public', 'locales');
const enData = JSON.parse(fs.readFileSync(path.join(LOCALES_DIR, 'en', 'dashboard.json'), 'utf-8'));

// Full translations for each locale
const translations = {
    bg: {
        "welcome": "Здравейте",
        "teacher_welcome": "Управлявайте материалите и класовете си на едно място.",
        "student_welcome": "Готови за нова доза знания? Вижте какво имаме за вас!",
        "add_materials": "Добавяне на материали",
        "dashboard": {
            "tabs": { "courses": "Моите курсове", "materials": "PDF/ZIP материали", "games": "Интерактивни игри", "wallet": "Моят портфейл" },
            "materials": { "title": "Вашите дигитални материали", "download": "Изтегляне на файл", "print": "Отпечатване на материали", "no_files": "Все още нямате материали за изтегляне." },
            "awards": { "title": "Вашата зала на славата", "subtitle": "Печелете значки за завършени уроци и игри!", "mock": { "start": "Бърз старт", "startDesc": "Завърши първия урок", "vocab": "Майстор на лексиката", "vocabDesc": "100% в тест", "steady": "Систематичен", "steadyDesc": "Влезе 7 дни подред", "polyglot": "Полиглот", "polyglotDesc": "Премина ниво A1" } },
            "games": { "title": "Център за онлайн игри", "subtitle": "Образователни игри", "play": "Играй сега", "provider": "Платформа", "no_games": "Няма налични интерактивни игри.", "loading": "Зареждане на играта...", "notice": "В пълната версия на приложението тук ще се появи интерактивен iframe от {provider}.", "fullscreen": "Цял екран", "report": "Докладване на грешка" },
            "sidebar": { "library": "Библиотека с материали", "team": "Моят клас / Екип", "purchases": "Фактури и покупки", "wallet": "Портфейл с точки", "settings": "Настройки на акаунта", "myLessons": "Моите уроци", "interactiveGames": "Игри и забавления", "myAwards": "Моите награди", "myProfile": "Моят профил", "rank": "Начинаещ учител", "points": "точки", "nextRank": "До ниво Експерт" },
            "subscription": { "title": "Вашият план", "activeClasses": "Активни класове", "unlimited": "Неограничено", "export": "Експорт на материали", "active": "Активен", "aiCredits": "AI кредити", "classes": "Класове", "limitReached": "Лимитът на безплатния план е достигнат", "upgrade": "Надграждане на плана" },
            "purchases": { "loading": "Зареждане на историята...", "title": "История на покупките", "empty": "Няма поръчки", "emptyDesc": "Все още нямате покупки. Отидете в магазина, за да видите наличните материали.", "goToShop": "Към магазина", "moreItems": "повече", "invoice": "Фактура" },
            "course": { "notFound": "Курсът не е намерен", "selectLesson": "Изберете урок от менюто, за да започнете.", "backToDashboard": "Обратно към таблото", "prevLesson": "Предишен урок", "nextLesson": "Следващ урок", "complete": "Маркирай като завършен", "completed": "Завършен", "backToCourses": "Моите курсове", "playVideo": "ПУСКАНЕ НА ВИДЕО", "gameTitle": "Интерактивна онлайн игра", "gameDesc": "Този материал е генериран автоматично. Кликнете бутона по-долу, за да отворите играта в нов прозорец.", "gameBtn": "Отвори играта сега", "introduction": "Въведение", "materialsTitle": "Материали за урока", "viewingInstructions": "Изберете урок от менюто, за да започнете.", "finishCourse": "Завършване на курса", "teachingModes": { "online": "Онлайн", "stationary": "Присъствено", "hybrid": "Хибридно" } },
            "library": { "title": "Вашата библиотека", "recent": "Наскоро закупени", "downloadZip": "Изтегляне на всички (ZIP)", "browseFiles": "Преглед на файлове", "progress": "Вашият напредък", "progressDesc": "{percent}% от материалите от {pack} са завършени.", "level": "Ниво", "open": "Отвори пакета", "preview": "Интерактивен преглед", "previewGame": "Преглед на играта", "filters": { "all": "Всички", "pdf": "E-книги и PDF", "audio": "Аудио", "courses": "Онлайн курсове" }, "badges": { "game": "Образователна игра", "pack": "Пакет" }, "stats": { "files": "файлове", "more": "повече" }, "discover": { "title": "Открийте повече материали", "desc": "Разгледайте магазина и добавете нови пакети към библиотеката си.", "btn": "Към магазина" } },
            "studentTasks": { "title": "Вашите задачи и материали", "assignee": "Учител", "due": "Краен срок", "status": { "todo": "За изпълнение", "inProgress": "В процес", "available": "Налично" }, "actions": { "start": "Започни", "open": "Отвори" }, "mock": { "homework": "Домашно: Present Simple", "teacher": "Учител Jane", "tomorrow": "Утре, 14:00", "quiz": "Тест: Животни", "friday": "Петък", "ebook": "E-книга: Основи на граматиката", "system": "Система" } },
            "team": { "title": "Моят клас / Екип", "subtitle": "Споделяйте материали с учениците си", "create_class": "Създаване на нов клас", "students_count": "{count} ученици", "created_at": "Създаден: {date}", "access_code": "Код за достъп на учениците", "shared_materials": "Споделени материали ({count})", "manage_btn": "Управление на достъпа", "empty": { "title": "Нов клас", "desc": "Създайте група за учениците си, за да споделяте материали и да проследявате напредъка.", "btn": "Започнете настройката" }, "pro": { "active": "Вашият PRO план е активен", "unlock": "Отключете неограничени класове", "desc": "PRO планът за учители позволява създаване на неограничени групи, добавяне на до 100 ученици и достъп до автоматични генератори на тестове.", "upgrade": "Надградете до PRO за $12", "status": "Активен" } },
            "wallet": { "title": "Вашият образователен портфейл", "subtitle": "Събирайте точки за покупки и активност. Обменяйте ги за отстъпки!", "available": "Налични средства", "value": "Стойност в {currency}", "points": "точки", "spend": "Похарчете точки в магазина", "history": "Последна активност", "mock": { "purchase": "Покупка: Mega Pack A1-A2", "bonus": "Бонус добре дошъл", "today": "Днес", "daysAgo": "преди {count} дни" } },
            "certificates": { "none": "Няма сертификати", "teacher_desc": "Сертификатите се присъждат след завършване на курсове тип 'Masterclass'.", "student_desc": "Завършете курса на 100%, за да получите дипломата си!" }
        }
    },
    cs: {
        "welcome": "Ahoj",
        "teacher_welcome": "Spravujte své materiály a třídy na jednom místě.",
        "student_welcome": "Připraveni na další dávku znalostí? Podívejte se, co pro vás máme!",
        "add_materials": "Přidat materiály",
        "dashboard": {
            "tabs": { "courses": "Moje kurzy", "materials": "PDF/ZIP materiály", "games": "Interaktivní hry", "wallet": "Moje peněženka" },
            "materials": { "title": "Vaše digitální materiály", "download": "Stáhnout soubor", "print": "Tisknout materiály", "no_files": "Zatím nemáte žádné materiály ke stažení." },
            "awards": { "title": "Vaše síň slávy", "subtitle": "Získávejte odznaky za dokončené lekce a hry!", "mock": { "start": "Rychlý start", "startDesc": "Dokončil první lekci", "vocab": "Mistr slovíček", "vocabDesc": "100% v testu", "steady": "Systematický", "steadyDesc": "Přihlášen 7 dní v řadě", "polyglot": "Polyglot", "polyglotDesc": "Složil úroveň A1" } },
            "games": { "title": "Centrum online her", "subtitle": "Vzdělávací hry", "play": "Hrát nyní", "provider": "Platforma", "no_games": "Žádné interaktivní hry nejsou k dispozici.", "loading": "Načítání hry...", "notice": "V plné verzi aplikace by se zde zobrazil interaktivní iframe od {provider}.", "fullscreen": "Celá obrazovka", "report": "Nahlásit chybu" },
            "sidebar": { "library": "Knihovna materiálů", "team": "Moje třída / Tým", "purchases": "Faktury a nákupy", "wallet": "Peněženka bodů", "settings": "Nastavení účtu", "myLessons": "Moje lekce", "interactiveGames": "Hry a zábava", "myAwards": "Moje ocenění", "myProfile": "Můj profil", "rank": "Začínající učitel", "points": "bodů", "nextRank": "Do úrovně Expert" },
            "subscription": { "title": "Váš plán", "activeClasses": "Aktivní třídy", "unlimited": "Neomezeno", "export": "Export materiálů", "active": "Aktivní", "aiCredits": "AI kredity", "classes": "Třídy", "limitReached": "Limit bezplatného plánu dosažen", "upgrade": "Upgradovat plán" },
            "purchases": { "loading": "Načítání historie...", "title": "Historie nákupů", "empty": "Žádné objednávky", "emptyDesc": "Zatím jste neprovedli žádné nákupy. Přejděte do obchodu a podívejte se na dostupné materiály.", "goToShop": "Do obchodu", "moreItems": "další", "invoice": "Faktura" },
            "course": { "notFound": "Kurz nenalezen", "selectLesson": "Vyberte lekci z nabídky.", "backToDashboard": "Zpět na nástěnku", "prevLesson": "Předchozí lekce", "nextLesson": "Další lekce", "complete": "Označit jako dokončené", "completed": "Dokončeno", "backToCourses": "Moje kurzy", "playVideo": "PŘEHRÁT VIDEO", "gameTitle": "Interaktivní online hra", "gameDesc": "Tento materiál byl vygenerován automaticky. Klikněte na tlačítko níže pro otevření hry v novém okně.", "gameBtn": "Otevřít hru nyní", "introduction": "Úvod", "materialsTitle": "Materiály k lekci", "viewingInstructions": "Vyberte lekci z nabídky.", "finishCourse": "Dokončit kurz", "teachingModes": { "online": "Online", "stationary": "Prezenčně", "hybrid": "Hybridně" } },
            "library": { "title": "Vaše knihovna", "recent": "Nedávno zakoupené", "downloadZip": "Stáhnout vše (ZIP)", "browseFiles": "Procházet soubory", "progress": "Váš pokrok", "progressDesc": "{percent}% materiálů z {pack} dokončeno.", "level": "Úroveň", "open": "Otevřít balíček", "preview": "Interaktivní náhled", "previewGame": "Náhled hry", "filters": { "all": "Vše", "pdf": "E-knihy a PDF", "audio": "Audio", "courses": "Online kurzy" }, "badges": { "game": "Vzdělávací hra", "pack": "Balíček" }, "stats": { "files": "souborů", "more": "více" }, "discover": { "title": "Objevte další materiály", "desc": "Prohlédněte si obchod a přidejte nové balíčky do své knihovny.", "btn": "Do obchodu" } },
            "studentTasks": { "title": "Vaše úkoly a materiály", "assignee": "Učitel", "due": "Termín", "status": { "todo": "K vyřízení", "inProgress": "Probíhá", "available": "Dostupné" }, "actions": { "start": "Začít", "open": "Otevřít" }, "mock": { "homework": "Domácí úkol: Present Simple", "teacher": "Učitel Jane", "tomorrow": "Zítra, 14:00", "quiz": "Test: Zvířata", "friday": "Pátek", "ebook": "E-kniha: Základy gramatiky", "system": "Systém" } },
            "team": { "title": "Moje třída / Tým", "subtitle": "Sdílejte materiály se svými studenty", "create_class": "Vytvořit novou třídu", "students_count": "{count} studentů", "created_at": "Vytvořeno: {date}", "access_code": "Přístupový kód studenta", "shared_materials": "Sdílené materiály ({count})", "manage_btn": "Spravovat přístup", "empty": { "title": "Nová třída", "desc": "Vytvořte skupinu pro své studenty, sdílejte materiály a sledujte pokrok.", "btn": "Začít nastavení" }, "pro": { "active": "Váš PRO plán je aktivní", "unlock": "Odemkněte neomezené třídy", "desc": "PRO plán pro učitele umožňuje vytvářet neomezené skupiny, přidávat až 100 studentů a přístup k automatickým generátorům testů.", "upgrade": "Upgradovat na PRO za $12", "status": "Aktivní" } },
            "wallet": { "title": "Vaše vzdělávací peněženka", "subtitle": "Sbírejte body za nákupy a aktivitu. Vyměňte je za slevy!", "available": "Dostupné prostředky", "value": "Hodnota v {currency}", "points": "bodů", "spend": "Utratit body v obchodu", "history": "Poslední aktivita", "mock": { "purchase": "Nákup: Mega Pack A1-A2", "bonus": "Uvítací bonus", "today": "Dnes", "daysAgo": "před {count} dny" } },
            "certificates": { "none": "Žádné certifikáty", "teacher_desc": "Certifikáty se udělují po dokončení kurzů typu 'Masterclass'.", "student_desc": "Dokončete kurz na 100%, abyste získali svůj diplom!" }
        }
    },
    da: {
        "welcome": "Hej",
        "teacher_welcome": "Administrer dine materialer og klasser ét sted.",
        "student_welcome": "Klar til en ny dosis viden? Se hvad vi har til dig!",
        "add_materials": "Tilføj materialer",
        "dashboard": {
            "tabs": { "courses": "Mine kurser", "materials": "PDF/ZIP-materialer", "games": "Interaktive spil", "wallet": "Min tegnebog" },
            "materials": { "title": "Dine digitale materialer", "download": "Download fil", "print": "Udskriv materialer", "no_files": "Du har endnu ingen downloadmaterialer." },
            "awards": { "title": "Din hall of fame", "subtitle": "Tjen badges for gennemførte lektioner og spil!", "mock": { "start": "Hurtig start", "startDesc": "Gennemførte første lektion", "vocab": "Ordmester", "vocabDesc": "100% i en quiz", "steady": "Systematisk", "steadyDesc": "Logget ind 7 dage i træk", "polyglot": "Polyglot", "polyglotDesc": "Bestod A1-niveau" } },
            "games": { "title": "Online spilcenter", "subtitle": "Uddannelsesspil", "play": "Spil nu", "provider": "Platform", "no_games": "Ingen interaktive spil tilgængelige.", "loading": "Indlæser spil...", "notice": "I den fulde version af appen ville en interaktiv iframe fra {provider} vises her.", "fullscreen": "Fuld skærm", "report": "Rapporter fejl" },
            "sidebar": { "library": "Materialebibliotek", "team": "Min klasse / Hold", "purchases": "Fakturaer og køb", "wallet": "Pointtegnebog", "settings": "Kontoindstillinger", "myLessons": "Mine lektioner", "interactiveGames": "Spil og sjov", "myAwards": "Mine priser", "myProfile": "Min profil", "rank": "Begynder lærer", "points": "point", "nextRank": "Til ekspertniveau" },
            "subscription": { "title": "Din plan", "activeClasses": "Aktive klasser", "unlimited": "Ubegrænset", "export": "Materialeexport", "active": "Aktiv", "aiCredits": "AI-kreditter", "classes": "Klasser", "limitReached": "Gratis plangrænse nået", "upgrade": "Opgrader plan" },
            "purchases": { "loading": "Indlæser historik...", "title": "Købshistorik", "empty": "Ingen ordrer", "emptyDesc": "Du har endnu ikke foretaget nogen køb. Gå til butikken for at se tilgængelige materialer.", "goToShop": "Gå til butik", "moreItems": "mere", "invoice": "Faktura" },
            "course": { "notFound": "Kursus ikke fundet", "selectLesson": "Vælg en lektion fra menuen for at starte.", "backToDashboard": "Tilbage til dashboard", "prevLesson": "Forrige lektion", "nextLesson": "Næste lektion", "complete": "Markér som gennemført", "completed": "Gennemført", "backToCourses": "Mine kurser", "playVideo": "AFSPIL VIDEO", "gameTitle": "Interaktivt onlinespil", "gameDesc": "Dette materiale blev genereret automatisk. Klik på knappen nedenfor for at åbne spillet i et nyt vindue.", "gameBtn": "Åbn spillet nu", "introduction": "Introduktion", "materialsTitle": "Lektionsmaterialer", "viewingInstructions": "Vælg en lektion fra menuen for at starte.", "finishCourse": "Afslut kursus", "teachingModes": { "online": "Online", "stationary": "Fysisk", "hybrid": "Hybrid" } },
            "library": { "title": "Dit bibliotek", "recent": "Nyligt købt", "downloadZip": "Download alle (ZIP)", "browseFiles": "Gennemse filer", "progress": "Din fremgang", "progressDesc": "{percent}% af materialer fra {pack} gennemført.", "level": "Niveau", "open": "Åbn pakke", "preview": "Interaktiv forhåndsvisning", "previewGame": "Forhåndsvisning af spil", "filters": { "all": "Alle", "pdf": "E-bøger og PDF", "audio": "Lyd", "courses": "Onlinekurser" }, "badges": { "game": "Uddannelsesspil", "pack": "Pakke" }, "stats": { "files": "filer", "more": "mere" }, "discover": { "title": "Opdag flere materialer", "desc": "Gennemse butikken og tilføj nye pakker til dit bibliotek.", "btn": "Gå til butik" } },
            "studentTasks": { "title": "Dine opgaver og materialer", "assignee": "Lærer", "due": "Deadline", "status": { "todo": "At gøre", "inProgress": "I gang", "available": "Tilgængelig" }, "actions": { "start": "Start", "open": "Åbn" }, "mock": { "homework": "Lektie: Present Simple", "teacher": "Lærer Jane", "tomorrow": "I morgen, 14:00", "quiz": "Quiz: Dyr", "friday": "Fredag", "ebook": "E-bog: Grundlæggende grammatik", "system": "System" } },
            "team": { "title": "Min klasse / Hold", "subtitle": "Del materialer med dine elever", "create_class": "Opret ny klasse", "students_count": "{count} elever", "created_at": "Oprettet: {date}", "access_code": "Elevadgangskode", "shared_materials": "Delte materialer ({count})", "manage_btn": "Administrer adgang", "empty": { "title": "Ny klasse", "desc": "Opret en gruppe for dine elever for at dele materialer og følge fremgang.", "btn": "Start opsætning" }, "pro": { "active": "Din PRO-plan er aktiv", "unlock": "Lås ubegrænsede klasser op", "desc": "PRO-planen for lærere giver mulighed for at oprette ubegrænsede grupper, tilføje op til 100 elever og adgang til automatiske quizgeneratorer.", "upgrade": "Opgrader til PRO for $12", "status": "Aktiv" } },
            "wallet": { "title": "Din uddannelsestegnebog", "subtitle": "Saml point for køb og aktivitet. Byt dem til rabatter!", "available": "Tilgængelige midler", "value": "Værdi i {currency}", "points": "point", "spend": "Brug point i butikken", "history": "Seneste aktivitet", "mock": { "purchase": "Køb: Mega Pack A1-A2", "bonus": "Velkomstbonus", "today": "I dag", "daysAgo": "for {count} dage siden" } },
            "certificates": { "none": "Ingen certifikater", "teacher_desc": "Certifikater tildeles efter gennemførelse af 'Masterclass'-kurser.", "student_desc": "Gennemfør kurset 100% for at få dit diplom!" }
        }
    },
    de: {
        "welcome": "Hallo",
        "teacher_welcome": "Verwalten Sie Ihre Materialien und Klassen an einem Ort.",
        "student_welcome": "Bereit für eine neue Dosis Wissen? Sehen Sie, was wir für Sie haben!",
        "add_materials": "Materialien hinzufügen",
        "dashboard": {
            "tabs": { "courses": "Meine Kurse", "materials": "PDF/ZIP-Materialien", "games": "Interaktive Spiele", "wallet": "Mein Wallet" },
            "materials": { "title": "Ihre digitalen Materialien", "download": "Datei herunterladen", "print": "Materialien drucken", "no_files": "Sie haben noch keine Download-Materialien." },
            "awards": { "title": "Ihre Ruhmeshalle", "subtitle": "Verdienen Sie Abzeichen für abgeschlossene Lektionen und Spiele!", "mock": { "start": "Schnellstart", "startDesc": "Erste Lektion abgeschlossen", "vocab": "Vokabelmeister", "vocabDesc": "100% im Quiz", "steady": "Systematisch", "steadyDesc": "7 Tage in Folge angemeldet", "polyglot": "Polyglott", "polyglotDesc": "A1-Niveau bestanden" } },
            "games": { "title": "Online-Spiele-Center", "subtitle": "Lernspiele", "play": "Jetzt spielen", "provider": "Plattform", "no_games": "Keine interaktiven Spiele verfügbar.", "loading": "Spiel wird geladen...", "notice": "In der Vollversion der App würde hier ein interaktiver Iframe von {provider} erscheinen.", "fullscreen": "Vollbild", "report": "Fehler melden" },
            "sidebar": { "library": "Materialbibliothek", "team": "Meine Klasse / Team", "purchases": "Rechnungen & Käufe", "wallet": "Punkte-Wallet", "settings": "Kontoeinstellungen", "myLessons": "Meine Lektionen", "interactiveGames": "Spiele & Spaß", "myAwards": "Meine Auszeichnungen", "myProfile": "Mein Profil", "rank": "Anfänger-Lehrer", "points": "Pkt.", "nextRank": "Zum Expertenlevel" },
            "subscription": { "title": "Ihr Plan", "activeClasses": "Aktive Klassen", "unlimited": "Unbegrenzt", "export": "Materialexport", "active": "Aktiv", "aiCredits": "AI-Credits", "classes": "Klassen", "limitReached": "Gratis-Plan-Limit erreicht", "upgrade": "Plan upgraden" },
            "purchases": { "loading": "Verlauf wird geladen...", "title": "Kaufverlauf", "empty": "Keine Bestellungen", "emptyDesc": "Sie haben noch keine Käufe getätigt. Besuchen Sie den Shop für verfügbare Materialien.", "goToShop": "Zum Shop", "moreItems": "mehr", "invoice": "Rechnung" },
            "course": { "notFound": "Kurs nicht gefunden", "selectLesson": "Wählen Sie eine Lektion aus dem Menü.", "backToDashboard": "Zurück zum Dashboard", "prevLesson": "Vorherige Lektion", "nextLesson": "Nächste Lektion", "complete": "Als abgeschlossen markieren", "completed": "Abgeschlossen", "backToCourses": "Meine Kurse", "playVideo": "VIDEO ABSPIELEN", "gameTitle": "Interaktives Online-Spiel", "gameDesc": "Dieses Material wurde automatisch generiert. Klicken Sie auf die Schaltfläche unten, um das Spiel in einem neuen Fenster zu öffnen.", "gameBtn": "Spiel jetzt öffnen", "introduction": "Einführung", "materialsTitle": "Lektionsmaterialien", "viewingInstructions": "Wählen Sie eine Lektion aus dem Menü.", "finishCourse": "Kurs abschließen", "teachingModes": { "online": "Online", "stationary": "Präsenz", "hybrid": "Hybrid" } },
            "library": { "title": "Ihre Bibliothek", "recent": "Kürzlich gekauft", "downloadZip": "Alle herunterladen (ZIP)", "browseFiles": "Dateien durchsuchen", "progress": "Ihr Fortschritt", "progressDesc": "{percent}% der Materialien aus {pack} abgeschlossen.", "level": "Level", "open": "Paket öffnen", "preview": "Interaktive Vorschau", "previewGame": "Spielvorschau", "filters": { "all": "Alle", "pdf": "E-Books & PDF", "audio": "Audio", "courses": "Online-Kurse" }, "badges": { "game": "Lernspiel", "pack": "Paket" }, "stats": { "files": "Dateien", "more": "mehr" }, "discover": { "title": "Entdecken Sie mehr Materialien", "desc": "Durchsuchen Sie den Shop und fügen Sie neue Pakete zu Ihrer Bibliothek hinzu.", "btn": "Zum Shop" } },
            "studentTasks": { "title": "Ihre Aufgaben & Materialien", "assignee": "Lehrer", "due": "Fällig", "status": { "todo": "Zu erledigen", "inProgress": "In Bearbeitung", "available": "Verfügbar" }, "actions": { "start": "Starten", "open": "Öffnen" }, "mock": { "homework": "Hausaufgabe: Present Simple", "teacher": "Lehrer Jane", "tomorrow": "Morgen, 14:00", "quiz": "Quiz: Tiere", "friday": "Freitag", "ebook": "E-Book: Grammatik-Grundlagen", "system": "System" } },
            "team": { "title": "Meine Klasse / Team", "subtitle": "Teilen Sie Materialien mit Ihren Schülern", "create_class": "Neue Klasse erstellen", "students_count": "{count} Schüler", "created_at": "Erstellt: {date}", "access_code": "Schüler-Zugangscode", "shared_materials": "Geteilte Materialien ({count})", "manage_btn": "Zugang verwalten", "empty": { "title": "Neue Klasse", "desc": "Erstellen Sie eine Gruppe für Ihre Schüler, um Materialien zu teilen und Fortschritte zu verfolgen.", "btn": "Einrichtung starten" }, "pro": { "active": "Ihr PRO-Plan ist aktiv", "unlock": "Unbegrenzte Klassen freischalten", "desc": "Der PRO-Plan für Lehrer ermöglicht unbegrenzte Gruppen, bis zu 100 Schüler und Zugang zu automatischen Quiz-Generatoren.", "upgrade": "Auf PRO für $12 upgraden", "status": "Aktiv" } },
            "wallet": { "title": "Ihr Bildungs-Wallet", "subtitle": "Sammeln Sie Punkte für Käufe und Aktivitäten. Tauschen Sie sie gegen Rabatte!", "available": "Verfügbare Mittel", "value": "Wert in {currency}", "points": "Pkt.", "spend": "Punkte im Shop ausgeben", "history": "Letzte Aktivität", "mock": { "purchase": "Kauf: Mega Pack A1-A2", "bonus": "Willkommensbonus", "today": "Heute", "daysAgo": "vor {count} Tagen" } },
            "certificates": { "none": "Keine Zertifikate", "teacher_desc": "Zertifikate werden nach Abschluss von 'Masterclass'-Kursen vergeben.", "student_desc": "Schließen Sie den Kurs zu 100% ab, um Ihr Diplom zu erhalten!" }
        }
    }
};

// For remaining locales, generate from EN with language-specific translations
const simpleTranslations = {
    el: { welcome: "Γεια σας", teacher_welcome: "Διαχειριστείτε τα υλικά και τις τάξεις σας σε ένα μέρος.", student_welcome: "Έτοιμοι για νέα γνώση; Δείτε τι έχουμε για εσάς!", add_materials: "Προσθήκη υλικών" },
    es: { welcome: "Hola", teacher_welcome: "Gestiona tus materiales y clases en un solo lugar.", student_welcome: "¿Listo para otra dosis de conocimiento? ¡Mira lo que tenemos para ti!", add_materials: "Añadir materiales" },
    et: { welcome: "Tere", teacher_welcome: "Hallake oma materjale ja klasse ühest kohast.", student_welcome: "Valmis uueks teadmiste annuseks? Vaata, mida sulle pakkuda on!", add_materials: "Lisa materjale" },
    fi: { welcome: "Hei", teacher_welcome: "Hallitse materiaaliasi ja luokkiasi yhdessä paikassa.", student_welcome: "Valmis uuteen tietoannokseen? Katso mitä meillä on sinulle!", add_materials: "Lisää materiaaleja" },
    fr: { welcome: "Bonjour", teacher_welcome: "Gérez vos matériels et classes en un seul endroit.", student_welcome: "Prêt pour une nouvelle dose de connaissances ? Voyez ce que nous avons pour vous !", add_materials: "Ajouter des matériels" },
    hr: { welcome: "Bok", teacher_welcome: "Upravljajte svojim materijalima i razredima na jednom mjestu.", student_welcome: "Spremni za novu dozu znanja? Pogledajte što imamo za vas!", add_materials: "Dodaj materijale" },
    hu: { welcome: "Szia", teacher_welcome: "Kezelje anyagait és osztályait egy helyen.", student_welcome: "Készen áll az újabb tudásadagra? Nézze meg, mit kínálunk!", add_materials: "Anyagok hozzáadása" },
    it: { welcome: "Ciao", teacher_welcome: "Gestisci i tuoi materiali e le tue classi in un unico posto.", student_welcome: "Pronto per un'altra dose di conoscenza? Guarda cosa abbiamo per te!", add_materials: "Aggiungi materiali" },
    lt: { welcome: "Sveiki", teacher_welcome: "Tvarkykite savo medžiagas ir klases vienoje vietoje.", student_welcome: "Pasiruošę naujai žinių dozei? Pažiūrėkite, ką jums turime!", add_materials: "Pridėti medžiagas" },
    lv: { welcome: "Sveiki", teacher_welcome: "Pārvaldiet savus materiālus un klases vienuviet.", student_welcome: "Gatavi jaunai zināšanu devai? Skatiet, ko mēs jums piedāvājam!", add_materials: "Pievienot materiālus" },
    nl: { welcome: "Hallo", teacher_welcome: "Beheer uw materialen en klassen op één plek.", student_welcome: "Klaar voor een nieuwe dosis kennis? Bekijk wat we voor u hebben!", add_materials: "Materialen toevoegen" },
    no: { welcome: "Hei", teacher_welcome: "Administrer materialer og klasser på ett sted.", student_welcome: "Klar for en ny dose kunnskap? Se hva vi har til deg!", add_materials: "Legg til materialer" },
    pt: { welcome: "Olá", teacher_welcome: "Gerencie seus materiais e turmas em um só lugar.", student_welcome: "Pronto para outra dose de conhecimento? Veja o que temos para você!", add_materials: "Adicionar materiais" },
    ro: { welcome: "Bună", teacher_welcome: "Gestionați materialele și clasele într-un singur loc.", student_welcome: "Pregătiți pentru o nouă doză de cunoștințe? Vedeți ce avem pentru voi!", add_materials: "Adaugă materiale" },
    sk: { welcome: "Ahoj", teacher_welcome: "Spravujte svoje materiály a triedy na jednom mieste.", student_welcome: "Pripravení na ďalšiu dávku vedomostí? Pozrite sa, čo pre vás máme!", add_materials: "Pridať materiály" },
    sl: { welcome: "Pozdravljeni", teacher_welcome: "Upravljajte svoje materiale in razrede na enem mestu.", student_welcome: "Pripravljeni na novo dozo znanja? Poglejte, kaj imamo za vas!", add_materials: "Dodajte gradiva" },
    sr: { welcome: "Zdravo", teacher_welcome: "Upravljajte svojim materijalima i razredima na jednom mestu.", student_welcome: "Spremni za novu dozu znanja? Pogledajte šta imamo za vas!", add_materials: "Dodajte materijale" },
    sv: { welcome: "Hej", teacher_welcome: "Hantera dina material och klasser på ett ställe.", student_welcome: "Redo för en ny dos kunskap? Se vad vi har för dig!", add_materials: "Lägg till material" },
    uk: { welcome: "Привіт", teacher_welcome: "Керуйте своїми матеріалами та класами в одному місці.", student_welcome: "Готові до нової порції знань? Подивіться, що ми маємо для вас!", add_materials: "Додати матеріали" }
};

// Write full translations for bg, cs, da, de
for (const [locale, data] of Object.entries(translations)) {
    const fp = path.join(LOCALES_DIR, locale, 'dashboard.json');
    fs.writeFileSync(fp, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`✅ Wrote full dashboard.json for ${locale}`);
}

// For remaining locales, merge existing data with EN structure + top-level translations
for (const [locale, topLevel] of Object.entries(simpleTranslations)) {
    const fp = path.join(LOCALES_DIR, locale, 'dashboard.json');
    let existing = {};
    if (fs.existsSync(fp)) {
        try { existing = JSON.parse(fs.readFileSync(fp, 'utf-8')); } catch { }
    }

    // Deep merge: use existing values where present, fall back to EN
    function deepMerge(target, source) {
        const result = {};
        for (const key of Object.keys(source)) {
            if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
                result[key] = deepMerge(target?.[key] || {}, source[key]);
            } else {
                result[key] = target?.[key] || source[key];
            }
        }
        return result;
    }

    const merged = {
        ...topLevel,
        dashboard: deepMerge(existing?.dashboard || {}, enData.dashboard)
    };

    // Override top-level keys from existing if present
    if (existing.welcome) merged.welcome = existing.welcome;
    if (existing.teacher_welcome) merged.teacher_welcome = existing.teacher_welcome;
    if (existing.student_welcome) merged.student_welcome = existing.student_welcome;
    if (existing.add_materials) merged.add_materials = existing.add_materials;

    fs.writeFileSync(fp, JSON.stringify(merged, null, 2), 'utf-8');
    console.log(`✅ Wrote merged dashboard.json for ${locale} (existing keys preserved, EN fallback for missing)`);
}

console.log('\nDone! All dashboard.json files have been updated.');

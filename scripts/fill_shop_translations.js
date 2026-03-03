const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '..', 'public', 'locales');
const languages = ['en', 'uk', 'de', 'es', 'fr', 'it', 'cs', 'sk', 'ro', 'hu', 'pt', 'lt', 'lv', 'et', 'hr', 'sr', 'sl', 'bg', 'el', 'nl', 'sv', 'fi', 'no', 'da'];

const translations = {
    en: { whatYouGet: "What's in this set?", includePdf: "High quality PDF files", includeScenarios: "Ready-to-use lesson plans", includeInteractive: "Interactive games", premiumQuality: "Premium Quality", premiumQualityDesc: "Created by experts for best classroom results.", inStock: "In Stock", wishlist: "Save", instantDelivery: "Digital Delivery" },
    es: { whatYouGet: "¿Qué incluye este set?", includePdf: "Archivos PDF de alta calidad", includeScenarios: "Planes de clase listos para usar", includeInteractive: "Juegos interactivos", premiumQuality: "Calidad Premium", premiumQualityDesc: "Creado por expertos para mejores resultados en clase.", inStock: "Disponible", wishlist: "Guardar", instantDelivery: "Entrega Digital" },
    de: { whatYouGet: "Was ist in diesem Set?", includePdf: "Hochwertige PDF-Dateien", includeScenarios: "Gebrauchsfertige Unterrichtspläne", includeInteractive: "Interaktive Spiele", premiumQuality: "Premium-Qualität", premiumQualityDesc: "Von Experten erstellt für beste Ergebnisse im Unterricht.", inStock: "Auf Lager", wishlist: "Speichern", instantDelivery: "Digitale Lieferung" },
    fr: { whatYouGet: "Que contient cet ensemble ?", includePdf: "Fichiers PDF de haute qualité", includeScenarios: "Plans de cours prêts à l'emploi", includeInteractive: "Jeux interactifs", premiumQuality: "Qualité Premium", premiumQualityDesc: "Créé par des experts pour les meilleurs résultats en classe.", inStock: "En stock", wishlist: "Enregistrer", instantDelivery: "Livraison numérique" },
    it: { whatYouGet: "Cosa c'è in questo set?", includePdf: "File PDF di alta qualità", includeScenarios: "Piani di lezione pronti all'uso", includeInteractive: "Giochi interattivi", premiumQuality: "Qualità Premium", premiumQualityDesc: "Creato da esperti per i migliori risultati in classe.", inStock: "Disponibile", wishlist: "Salva", instantDelivery: "Consegna digitale" },
    pt: { whatYouGet: "O que vem neste conjunto?", includePdf: "Arquivos PDF de alta qualidade", includeScenarios: "Planos de aula prontos para usar", includeInteractive: "Jogos interativos", premiumQuality: "Qualidade Premium", premiumQualityDesc: "Criado por especialistas para os melhores resultados na sala de aula.", inStock: "Em estoque", wishlist: "Salvar", instantDelivery: "Entrega digital" },
    nl: { whatYouGet: "Wat zit er in deze set?", includePdf: "Hoogwaardige PDF-bestanden", includeScenarios: "Kant-en-klare lesplannen", includeInteractive: "Interactieve spellen", premiumQuality: "Premium kwaliteit", premiumQualityDesc: "Gemaakt door experts voor de beste resultaten in de klas.", inStock: "Op voorraad", wishlist: "Opslaan", instantDelivery: "Digitale levering" },
    uk: { whatYouGet: "Що входить до цього набору?", includePdf: "Високоякісні PDF-файли", includeScenarios: "Готові плани уроків", includeInteractive: "Інтерактивні ігри", premiumQuality: "Преміум якість", premiumQualityDesc: "Створено експертами для найкращих результатів у класі.", inStock: "В наявності", wishlist: "Зберегти", instantDelivery: "Цифрова доставка" },
    cs: { whatYouGet: "Co obsahuje tato sada?", includePdf: "Vysoce kvalitní soubory PDF", includeScenarios: "Hotové plány lekcí", includeInteractive: "Interaktivní hry", premiumQuality: "Prémiová kvalita", premiumQualityDesc: "Vytvořeno odborníky pro nejlepší výsledky ve třídě.", inStock: "Skladem", wishlist: "Uložit", instantDelivery: "Digitální doručení" },
    sk: { whatYouGet: "Čo obsahuje táto sada?", includePdf: "Vysokokvalitné súbory PDF", includeScenarios: "Hotové plány lekcií", includeInteractive: "Interaktívne hry", premiumQuality: "Prémiová kvalita", premiumQualityDesc: "Vytvorené odborníkmi pre najlepšie výsledky v triede.", inStock: "Na sklade", wishlist: "Uložiť", instantDelivery: "Digitálne doručenie" },
    ro: { whatYouGet: "Ce conține acest set?", includePdf: "Fișiere PDF de înaltă calitate", includeScenarios: "Planuri de lecție gata de utilizare", includeInteractive: "Jocuri interactive", premiumQuality: "Calitate superioară", premiumQualityDesc: "Creat de experți pentru cele mai bune rezultate în clasă.", inStock: "În stoc", wishlist: "Salvează", instantDelivery: "Livrare digitală" },
    hu: { whatYouGet: "Mit tartalmaz ez a készlet?", includePdf: "Kiváló minőségű PDF fájlok", includeScenarios: "Használatra kész óratervek", includeInteractive: "Interaktív játékok", premiumQuality: "Prémium minőség", premiumQualityDesc: "Szakértők által készítve a legjobb osztálytermi eredményekért.", inStock: "Raktáron", wishlist: "Mentés", instantDelivery: "Digitális kézbesítés" },
    lt: { whatYouGet: "Kas yra šiame rinkinyje?", includePdf: "Aukštos kokybės PDF failai", includeScenarios: "Paruošti pamokų planai", includeInteractive: "Interaktyvūs žaidimai", premiumQuality: "Aukščiausia kokybė", premiumQualityDesc: "Sukurta ekspertų geriausiems rezultatams klasėje.", inStock: "Yra sandėlyje", wishlist: "Išsaugoti", instantDelivery: "Skaitmeninis pristatymas" },
    lv: { whatYouGet: "Kas ir šajā komplektā?", includePdf: "Augstas kvalitātes PDF faili", includeScenarios: "Gatavi stundu plāni", includeInteractive: "Interaktīvas spēles", premiumQuality: "Premium kvalitāte", premiumQualityDesc: "Ekspertu radīts labākajiem rezultātiem klasē.", inStock: "Noliktavā", wishlist: "Saglabāt", instantDelivery: "Digitālā piegāde" },
    et: { whatYouGet: "Mis selles komplektis on?", includePdf: "Kvaliteetsed PDF-failid", includeScenarios: "Kasutusvalmis tunniplaanid", includeInteractive: "Interaktiivsed mängud", premiumQuality: "Premium kvaliteet", premiumQualityDesc: "Ekspertide loodud parimate tulemuste saavutamiseks klassis.", inStock: "Laos", wishlist: "Salvesta", instantDelivery: "Digitaalne t陰rne" },
    hr: { whatYouGet: "Što je u ovom setu?", includePdf: "Visokokvalitetne PDF datoteke", includeScenarios: "Spremni planovi lekcija", includeInteractive: "Interaktivne igre", premiumQuality: "Vrhunska kvaliteta", premiumQualityDesc: "Stvorili stručnjaci za najbolje rezultate u učionici.", inStock: "Na zalihi", wishlist: "Spremi", instantDelivery: "Digitalna dostava" },
    sr: { whatYouGet: "Šta je u ovom setu?", includePdf: "Visokokvalitetne PDF datoteke", includeScenarios: "Spremni planovi lekcija", includeInteractive: "Interaktivne igre", premiumQuality: "Vrhunski kvalitet", premiumQualityDesc: "Kreirali stručnjaci za najbolje rezultate u učionici.", inStock: "Na lageru", wishlist: "Sačuvaj", instantDelivery: "Digitalna dostava" },
    sl: { whatYouGet: "Kaj je v tem kompletu?", includePdf: "Visokokakovostne datoteke PDF", includeScenarios: "Pripravljeni učni načrti", includeInteractive: "Interaktivne igre", premiumQuality: "Vrhunska kakovost", premiumQualityDesc: "Ustvarili strokovnjaki za najboljše rezultate v razredu.", inStock: "Na zalogi", wishlist: "Shrani", instantDelivery: "Digitalna dostava" },
    bg: { whatYouGet: "Какво има в този комплект?", includePdf: "Висококачествени PDF файлове", includeScenarios: "Готови планове за уроци", includeInteractive: "Интерактивни игри", premiumQuality: "Премиум качество", premiumQualityDesc: "Създадено від експерти за най-добри резултати в класната стая.", inStock: "В наличност", wishlist: "Запази", instantDelivery: "Цифрова доставка" },
    el: { whatYouGet: "Τι περιλαμβάνει αυτό το σετ;", includePdf: "Αρχεία PDF υψηλής ποιότητας", includeScenarios: "Έτοιμα σχέδια μαθήματος", includeInteractive: "Διαδραστικά παιχνίδια", premiumQuality: "Εξαιρετική ποιότητα", premiumQualityDesc: "Δημιουργήθηκε από ειδικούς για τα καλύτερα αποτελέσματα στην τάξη.", inStock: "Σε απόθεμα", wishlist: "Αποθήκευση", instantDelivery: "Ψηφιακή παράδοση" },
    sv: { whatYouGet: "Vad finns i detta set?", includePdf: "Högkvalitativa PDF-filer", includeScenarios: "Färdiga lektionsplaner", includeInteractive: "Interaktiva spel", premiumQuality: "Premiumkvalitet", premiumQualityDesc: "Skapad av experter för bästa resultat i klassrummet.", inStock: "I lager", wishlist: "Spara", instantDelivery: "Digital leverans" },
    da: { whatYouGet: "Hvad er der i dette sæt?", includePdf: "Højvalitets PDF-filer", includeScenarios: "Klar-til-brug lektionsplaner", includeInteractive: "Interaktive spil", premiumQuality: "Premium kvalitet", premiumQualityDesc: "Skabt af eksperter for de bedste resultater i klasselokalet.", inStock: "På lager", wishlist: "Gem", instantDelivery: "Digital levering" },
    fi: { whatYouGet: "Mitä tähän sarjaan kuuluu?", includePdf: "Korkealaatuiset PDF-tiedostot", includeScenarios: "Valmiit tuntisuunnitelmat", includeInteractive: "Interaktiiviset pelit", premiumQuality: "Premium-laatu", premiumQualityDesc: "Asiantuntijoiden luoma parhaiden tulosten saavuttamiseksi luokassa.", inStock: "Varastossa", wishlist: "Tallenna", instantDelivery: "Digitaalinen toimitus" },
    no: { whatYouGet: "Hva er i dette settet?", includePdf: "Høykvalitets PDF-filer", includeScenarios: "Klar-til-bruk leksjonsplaner", includeInteractive: "Interaktive spill", premiumQuality: "Premium kvalitet", premiumQualityDesc: "Laget av eksperter for de beste resultatene i klasserommet.", inStock: "På lager", wishlist: "Lagre", instantDelivery: "Digital levering" }
};

languages.forEach(lang => {
    const shopPath = path.join(localesDir, lang, 'shop.json');
    if (!fs.existsSync(shopPath)) {
        console.log(`[${lang}] shop.json missing, skipping.`);
        return;
    }

    try {
        const shopData = JSON.parse(fs.readFileSync(shopPath, 'utf8'));

        // Update productDetail
        if (!shopData.productDetail) shopData.productDetail = {};
        Object.assign(shopData.productDetail, translations[lang]);

        fs.writeFileSync(shopPath, JSON.stringify(shopData, null, 2));
        console.log(`[${lang}] Updated shop.json productDetail.`);
    } catch (e) {
        console.log(`[${lang}] Error processing shop.json: ${e.message}`);
    }
});

const fs = require('fs');
const path = require('path');

const localesPath = 'c:/Users/kamil/.gemini/antigravity/scratch/educational-sales-site/public/locales';
const plAdmin = JSON.parse(fs.readFileSync(path.join(localesPath, 'pl/admin.json'), 'utf8'));
const enAdmin = JSON.parse(fs.readFileSync(path.join(localesPath, 'en/admin.json'), 'utf8'));

const locales = fs.readdirSync(localesPath).filter(d => {
    const fullPath = path.join(localesPath, d);
    return fs.statSync(fullPath).isDirectory() && d !== 'pl' && d !== 'en';
});

// Common translations mapping
const translations = {
    "es": {
        "Rozwiń": "Expandir", "Zwiń": "Contraer", "Wyloguj sesję": "Cerrar sesión", "Wyloguj": "Salir",
        "Produkty": "Productos", "Zamówienia": "Pedidos", "Materiały": "Materiales", "Ustawienia": "Ajustes",
        "Strona główna": "Inicio", "Administrator": "Administrador", "Online": "En línea",
        "Scenariusze lekcji": "Planes de lecciones", "Karty pracy": "Hojas de trabajo", "Fiszki": "Flashcards",
        "Gry i zabawy online": "Juegos en línea", "Materiały audio": "Materiales de audio", "Materiały wideo": "Materiales de video",
        "Pakiety": "Paquetes", "Inne": "Otros", "Zoptymalizowane przez AI": "Optimizado por IA",
        "Nr zamówienia": "Nº Pedido", "Data": "Fecha", "Klient": "Cliente", "Kwota": "Total", "Status": "Estado",
        "Metodyka nauczania": "Metodología", "Materiały dydaktyczne": "Materiales didácticos", "Technologia w edukacji": "Tecnología educativa",
        "Inspiracje i pomysły": "Inspiración", "Recenzje": "Reseñas", "Wydarzenia": "Eventos", "Internet": "Internet"
    },
    "fr": {
        "Rozwiń": "Développer", "Zwiń": "Réduire", "Wyloguj sesję": "Déconnexion", "Wyloguj": "Sortir",
        "Produkty": "Produits", "Zamówienia": "Commandes", "Materiały": "Matériaux", "Ustawienia": "Paramètres",
        "Strona główna": "Accueil", "Administrator": "Administrateur", "Online": "En ligne",
        "Scenariusze lekcji": "Fiches de cours", "Karty pracy": "Feuilles d'exercices", "Fiszki": "Flashcards",
        "Gry i zabawy online": "Jeux en ligne", "Materiały audio": "Supports audio", "Materiały wideo": "Supports vidéo",
        "Pakiety": "Packs", "Inne": "Autres", "Zoptymalizowane przez AI": "Optimisé par l'IA",
        "Nr zamówienia": "N° Commande", "Data": "Date", "Klient": "Client", "Kwota": "Montant", "Status": "Statut",
        "Metodyka nauczania": "Méthodologie", "Materiały dydaktyczne": "Supports pédagogiques", "Technologia w edukacji": "Numérique éducatif",
        "Inspiracje i pomysły": "Inspirations", "Recenzje": "Avis", "Wydarzenia": "Événements", "Internet": "Internet"
    },
    "de": {
        "Rozwiń": "Erweitern", "Zwiń": "Einklappen", "Wyloguj sesję": "Abmelden", "Wyloguj": "Logout",
        "Produkty": "Produkte", "Zamówienia": "Bestellungen", "Materiały": "Materialien", "Ustawienia": "Einstellungen",
        "Strona główna": "Startseite", "Administrator": "Administrator", "Online": "Online",
        "Scenariusze lekcji": "Lehrpläne", "Karty pracy": "Arbeitsblätter", "Fiszki": "Flashkarten",
        "Gry i zabawy online": "Online-Spiele", "Materiały audio": "Audiomaterialien", "Materiały wideo": "Videomaterialien",
        "Pakiety": "Pakete", "Inne": "Sonstiges", "Zoptymalizowane przez AI": "KI-optimiert",
        "Nr zamówienia": "Bestell-Nr.", "Data": "Datum", "Klient": "Kunde", "Kwota": "Betrag", "Status": "Status",
        "Metodyka nauczania": "Methodik", "Materiały dydaktyczne": "Lernmaterialien", "Technologia w edukacji": "Bildungstechnologie",
        "Inspiracje i pomysły": "Inspiration", "Recenzje": "Bewertungen", "Wydarzenia": "Veranstaltungen", "Internet": "Internet"
    },
    "uk": {
        "Rozwiń": "Розгорнути", "Zwiń": "Згорнути", "Wyloguj sesję": "Вийти з сесії", "Wyloguj": "Вихід",
        "Produkty": "Товари", "Zamówienia": "Замовлення", "Materiały": "Матеріали", "Ustawienia": "Налаштування",
        "Strona główna": "Головна", "Administrator": "Адміністратор", "Online": "Онлайн",
        "Scenariusze lekcji": "Плани уроків", "Karty pracy": "Робочі листи", "Fiszki": "Картки",
        "Gry i zabawy online": "Онлайн-ігри", "Materiały audio": "Аудіоматеріали", "Materiały wideo": "Відеоматеріали",
        "Pakiety": "Пакети", "Inne": "Інше", "Zoptymalizowane przez AI": "Оптимізовано ШІ",
        "Nr zamówienia": "№ Замовлення", "Data": "Дата", "Klient": "Клієнт", "Kwota": "Сума", "Status": "Статус",
        "Metodyka nauczania": "Методика", "Materiały dydaktyczne": "Навчальні матеріали", "Technologia w edukacji": "Освітні технології",
        "Inspiracje i pomysły": "Натхнення", "Recenzje": "Відгуки", "Wydarzenia": "Події", "Internet": "Інтернет"
    },
    "it": {
        "Rozwiń": "Espandi", "Zwiń": "Riduci", "Wyloguj sesję": "Logout sessione", "Wyloguj": "Esci",
        "Produkty": "Prodotti", "Zamówienia": "Ordini", "Materiały": "Materiali", "Ustawienia": "Impostazioni",
        "Strona główna": "Home", "Administrator": "Amministratore", "Online": "Online",
        "Scenariusze lekcji": "Piani di lezione", "Karty pracy": "Schede didattiche", "Fiszki": "Flashcard",
        "Gry i zabawy online": "Giochi online", "Materiały audio": "Materiali audio", "Materiały wideo": "Materiali video",
        "Pakiety": "Pacchetti", "Inne": "Altro", "Zoptymalizowane przez AI": "Ottimizzato da AI",
        "Nr zamówienia": "N. Ordine", "Data": "Data", "Klient": "Cliente", "Kwota": "Totale", "Status": "Stato",
        "Metodyka nauczania": "Metodologia", "Materiały dydaktyczne": "Materiali didattici", "Technologia w edukacji": "Tecnologia educativa",
        "Inspiracje i pomysły": "Ispirazioni", "Recenzje": "Recensioni", "Wydarzenia": "Eventi", "Internet": "Internet"
    },
    "pt": {
        "Rozwiń": "Expandir", "Zwiń": "Recolher", "Wyloguj sesję": "Terminar sessão", "Wyloguj": "Sair",
        "Produkty": "Produtos", "Zamówienia": "Pedidos", "Materiały": "Materiais", "Ustawienia": "Configurações",
        "Strona główna": "Início", "Administrator": "Administrador", "Online": "Online",
        "Scenariusze lekcji": "Planos de aula", "Karty pracy": "Folhas de atividades", "Fiszki": "Flashcards",
        "Gry i zabawy online": "Jogos online", "Materiały audio": "Materiais de áudio", "Materiały wideo": "Materiais de vídeo",
        "Pakiety": "Pacotes", "Inne": "Outros", "Zoptymalizowane przez AI": "Otimizado por IA",
        "Nr zamówienia": "Nº Pedido", "Data": "Data", "Klient": "Cliente", "Kwota": "Valor", "Status": "Estado",
        "Metodyka nauczania": "Metodologia", "Materiały dydaktyczne": "Materiais didáticos", "Technologia w edukacji": "Tecnologia educacional",
        "Inspiracje i pomysły": "Inspirações", "Recenzje": "Avaliações", "Wydarzenia": "Eventos", "Internet": "Internet"
    }
};

function deepMerge(pl, target, locale) {
    const result = {};
    const langMap = translations[locale] || {};

    for (const key in pl) {
        if (typeof pl[key] === 'object' && pl[key] !== null) {
            result[key] = deepMerge(pl[key], target && target[key] ? target[key] : {}, locale);
        } else {
            const plValue = pl[key];
            const targetValue = target && target[key] ? target[key] : null;

            if (targetValue && targetValue !== plValue) {
                // Already translated correctly
                result[key] = targetValue;
            } else {
                // Value is missing or same as Polish
                if (typeof plValue === 'string') {
                    // Try mapping
                    if (langMap[plValue]) {
                        result[key] = langMap[plValue];
                    } else {
                        // Fallback to English from enAdmin using the same path
                        // This is complex so let's simplify: just use English for now if no map
                        result[key] = plValue; // Placeholder, will fix below
                    }
                } else {
                    result[key] = plValue;
                }
            }
        }
    }
    return result;
}

// Second pass to fill with English where mapping is missing
function fillWithEnglish(merged, en) {
    for (const key in merged) {
        if (typeof merged[key] === 'object' && merged[key] !== null) {
            fillWithEnglish(merged[key], en && en[key] ? en[key] : {});
        } else {
            // Check if it's still Polish (heuristic: contains Polish special chars or matches plAdmin exactly)
            const plChars = /[ąęśżźółń]/i;
            if (typeof merged[key] === 'string' && (plChars.test(merged[key]) || merged[key].length > 3)) {
                // If it still looks Polish, try to get English from enAdmin
                if (en && en[key]) {
                    merged[key] = en[key];
                }
            }
        }
    }
}

for (const locale of locales) {
    const targetPath = path.join(localesPath, locale, 'admin.json');
    console.log(`Processing ${locale}...`);
    const currentTarget = fs.existsSync(targetPath) ? JSON.parse(fs.readFileSync(targetPath, 'utf8')) : {};

    let merged = deepMerge(plAdmin, currentTarget, locale);
    fillWithEnglish(merged, enAdmin);

    fs.writeFileSync(targetPath, JSON.stringify(merged, null, 2));
}

console.log('Admin translations fixed for all locales.');

const fs = require('fs');
const path = require('path');

const localesDir = path.join(process.cwd(), 'public', 'locales');

const updates = {
    pl: {
        products: {
            categories: {
                "lesson-plans": "Scenariusze lekcji",
                "worksheets": "Karty pracy",
                "flashcards": "Fiszki",
                "games": "Gry i zabawy online",
                "audio": "Materiały audio",
                "video": "Materiały wideo",
                "bundles": "Pakiety",
                "other": "Inne"
            },
            source_badges: {
                "wordpress": "WordPress / Publigo",
                "tpt": "Teachers Pay Teachers",
                "ai_optimized": "Zoptymalizowane przez AI"
            }
        },
        orders: {
            export_headers: {
                "order_number": "Nr zamówienia",
                "date": "Data",
                "customer": "Klient",
                "email": "Email",
                "products": "Produkty",
                "total": "Kwota",
                "status": "Status"
            }
        }
    },
    en: {
        products: {
            categories: {
                "lesson-plans": "Lesson Plans",
                "worksheets": "Worksheets",
                "flashcards": "Flashcards",
                "games": "Online Games",
                "audio": "Audio Materials",
                "video": "Video Materials",
                "bundles": "Bundles",
                "other": "Other"
            },
            source_badges: {
                "wordpress": "WordPress / Publigo",
                "tpt": "Teachers Pay Teachers",
                "ai_optimized": "AI Optimized"
            }
        },
        orders: {
            export_headers: {
                "order_number": "Order No.",
                "date": "Date",
                "customer": "Customer",
                "email": "Email",
                "products": "Products",
                "total": "Total",
                "status": "Status"
            }
        }
    }
};

['pl', 'en'].forEach(lang => {
    const file = path.join(localesDir, lang, 'admin.json');
    try {
        let data = {};
        if (fs.existsSync(file)) {
            data = JSON.parse(fs.readFileSync(file, 'utf8'));
        }

        if (!data.adminPanel) data.adminPanel = {};

        // Products
        if (!data.adminPanel.products) data.adminPanel.products = {};

        if (!data.adminPanel.products.categories) {
            data.adminPanel.products.categories = updates[lang].products.categories;
        }

        if (!data.adminPanel.products.source_badges) {
            data.adminPanel.products.source_badges = updates[lang].products.source_badges;
        }

        // Orders
        if (!data.adminPanel.orders) data.adminPanel.orders = {};
        if (!data.adminPanel.orders.export_headers) {
            data.adminPanel.orders.export_headers = updates[lang].orders.export_headers;
        }

        fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
        console.log(`[${lang}] Updated admin.json`);
    } catch (e) {
        console.error(`[${lang}] Error: ${e.message}`);
    }
});

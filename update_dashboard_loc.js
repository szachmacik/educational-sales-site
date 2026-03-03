const fs = require('fs');
const path = require('path');

const locales = ['pl', 'en'];
const adminPanelAdditions = {
    pl: {
        "dashboard": {
            "title": "Dashboard",
            "subtitle": "Przegląd aktywności Twojego sklepu edukacyjnego",
            "addProduct": "Dodaj Produkt",
            "activeAiLogs": {
                "title": "Aktywne Logi AI",
                "live": "Live",
                "imageGenerated": "Obraz wygenerowany",
                "socialPostReady": "Post społecznościowy gotowy",
                "flashcardCreated": "Fiszka utworzona",
                "trendIdentified": "Zidentyfikowano trend",
                "seoOptimized": "Zoptymalizowano SEO",
                "imagePolished": "Obraz dopracowany"
            },
            "studioQuickAccess": {
                "title": "Szybki dostęp do Studia",
                "imageStudio": "Studio Obrazów",
                "generate4k": "Generuj wizualizacje 4K",
                "socialHub": "Centrum Social Media",
                "viralCreation": "Tworzenie wiralowych postów"
            },
            "interactivePreview": {
                "subtitle": "Podgląd na żywo interaktywnego materiału",
                "noPreview": "Brak dostępnego podglądu dla tego zasobu",
                "close": "Zamknij"
            }
        }
    },
    en: {
        "dashboard": {
            "title": "Dashboard",
            "subtitle": "Activity overview of your educational store",
            "addProduct": "Add Product",
            "activeAiLogs": {
                "title": "Active AI Logs",
                "live": "Live",
                "imageGenerated": "Image Generated",
                "socialPostReady": "Social Post Ready",
                "flashcardCreated": "Flashcard Created",
                "trendIdentified": "Trend identified",
                "seoOptimized": "SEO Optimized",
                "imagePolished": "Image Polished"
            },
            "studioQuickAccess": {
                "title": "Studio Quick Access",
                "imageStudio": "Image Studio",
                "generate4k": "Generate 4K Visuals",
                "socialHub": "Social Hub",
                "viralCreation": "Viral Post Creation"
            },
            "interactivePreview": {
                "subtitle": "Live preview of interactive material",
                "noPreview": "No preview available for this asset",
                "close": "Close"
            }
        }
    }
};

locales.forEach(lang => {
    const filePath = path.join(process.cwd(), 'public', 'locales', lang, 'admin.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    if (!data.adminPanel) data.adminPanel = {};

    // Merge dashboard
    data.adminPanel.dashboard = {
        ...data.adminPanel.dashboard,
        ...adminPanelAdditions[lang].dashboard
    };

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Updated ${lang}/admin.json`);
});

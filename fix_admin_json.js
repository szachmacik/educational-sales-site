const fs = require('fs');
const path = require('path');

const filePath = "C:\\Users\\kamil\\.gemini\\antigravity\\scratch\\educational-sales-site\\public\\locales\\pl\\admin.json";

try {
    let content = fs.readFileSync(filePath, 'latin1');
    // Try to clean up the broken Polish characters if they look like "??"
    content = content.replace(/Automatyzacj\?\?/g, "Automatyzacj\u0119");

    // Write back as UTF-8
    fs.writeFileSync(filePath, content, 'utf8');

    // Now read as JSON and add the new key
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    data.landingBuilder = {
        "title": "Landing Page Builder",
        "draftVersion": "Wersja Draft: {name}",
        "desktop": "Desktop",
        "mobile": "Mobile",
        "preview": "Podgląd",
        "save": "Zapisz zmiany",
        "saving": "Zapisywanie...",
        "elements": "Elementy strony",
        "text": "Tekst",
        "image": "Obraz",
        "button": "Przycisk",
        "aiBlock": "AI Block",
        "canvas": "Płótno (Warstwy)",
        "hero": "Hero Section",
        "features": "Zalety i Korzyści",
        "pricing": "Sekcja Cenowa",
        "aiMagic": {
            "title": "Gotowy na magię?",
            "desc": "Użyj AI, aby automatycznie dopasować copy i kolory do Twojego produktu.",
            "optimize": "Optymalizuj z AI"
        },
        "mock": {
            "newCourse": "Nowy Kurs",
            "heroTitle": "Zacznij uczyć języka {joy}",
            "joy": "z radością",
            "heroDesc": "Gotowe scenariusze, które Twoi uczniowie pokochają. Zero stresu, 100% efektów.",
            "buyNow": "Kup teraz i zacznij uczyć",
            "learnMore": "Dowiedz się więcej",
            "addImage": "Dodaj obraz główny (Drag & Drop)"
        },
        "optimization": {
            "title": "AI Landing Optimization",
            "desc": "Wykryliśmy {count} obszary do poprawy w celu zwiększenia konwersji o ok. {percent}%.",
            "current": "Aktualna Wersja",
            "aiSuggestion": "Sugestia AI (Ulepszona konwersja)",
            "recommendation": "REKOMENDACJA",
            "skip": "Pomiń zmiany",
            "apply": "Zastosuj optymalizację",
            "success": "Zmiany AI zostały naniesione na projekt!",
            "processing": "Pracujemy nad projektem...",
            "processingDesc": "\"Skanujemy Twoje teksty pod kątem języka korzyści i analizujemy heatmapy rynkowe.\"",
            "analysingHeaders": "Analiza nagłówków...",
            "pickingColors": "Dobieranie palety barw...",
            "renderingPreview": "Renderowanie preview...",
            "paletteTitle": "Ulepszony Color Palette (Ocean Night)",
            "paletteDesc": "Zmienimy akcenty na bardziej profesjonalny granat i energetyczny błękit."
        },
        "toasts": {
            "saved": "Landing page zapisany pomyślnie!"
        }
    };

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log("Successfully fixed and updated admin.json");
} catch (error) {
    console.error("Error:", error);
    process.exit(1);
}

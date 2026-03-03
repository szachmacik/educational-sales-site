import json
import os

path = r"C:\Users\kamil\.gemini\antigravity\scratch\educational-sales-site\public\locales\pl\admin.json"

try:
    with open(path, 'r', encoding='utf-8') as f:
        data = json.load(f)
except Exception as e:
    print(f"Failed to read with utf-8: {e}")
    # Try with another encoding or latin-1 to just get the bytes
    with open(path, 'r', encoding='latin-1') as f:
        content = f.read()
        # This is very dangerous but we are trying to fix a broken file
    print("Read with latin-1")
    # Let's try to just fix the specific part that looked broken
    # "Testuj Automatyzacj??"
    content = content.replace("Testuj Automatyzacj??", "Testuj Automatyzacj\u0119")
    
    # Now try to write it back as clean utf-8
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    # Reload data
    with open(path, 'r', encoding='utf-8') as f:
        data = json.load(f)

# Add landingBuilder
data["landingBuilder"] = {
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
}

with open(path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Successfully updated admin.json")

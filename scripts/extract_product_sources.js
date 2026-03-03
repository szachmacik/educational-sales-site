const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'lib', 'product-translations-data.ts');
const content = fs.readFileSync(filePath, 'utf8');

// Match the object content
const startMarker = 'export const PRODUCT_TRANSLATIONS: Record<string, Partial<Record<Language, ProductTranslation>>> = {';
const startIndex = content.indexOf(startMarker);
const objectContent = content.substring(startIndex + startMarker.length);

const products = [
    'pakiet-scenariuszy-luty-marzec-kwiecien-maj-czerwiec',
    'pakiet-scenariuszy-wrzesien-styczen',
    'pakiet-stories-e-booki-na-4-pory-roku',
    'angielski-w-zlobku-autumn-pack',
    'angielski-przez-teatr-dla-zerowki-i-klas-1-3',
    'merry-christmas-pack',
    'przedszkole-pakiet-materialow-na-jesien',
    'przedszkole-pakiet-materialow-na-zime',
    'przedszkole-pakiet-materialow-na-wszystkie-na-wiosne',
    'przedszkole-zestaw-materialow-na-lato',
    'angielski-w-zlobku-zestaw-february',
    'plany-zajec-czerwiec',
    'plany-zajec-luty',
    'plany-zajec-listopad',
    'pumpking-day',
    'guy-fawkes-day-bonfire-night',
    'day-of-languages-dekoracja-i-gra',
    'kulturowa-lekcja-pokazowa-london-tour',
    'christmas-fun',
    'pizza-day',
    'grandparents-day-playscript',
    'thanksgiving-fun',
    'english-zoo-playscript',
    'under-the-sea-gotowe-zajecia',
    'st-patricks-day',
    'powakacyjna-powtorka-klasy-1-3',
    'dzien-jezykow',
    'dzien-zwierzat',
    'easter',
    'dzien-australii',
    'stories-na-jesien',
    'stories-na-zime-ebook',
    'stories-na-wiosne-ebook',
    'stories-na-lato-ebook',
    'scenariusz-przedstawienia-lato',
    'lets-celebrate',
    'speakbook-my-fairy-tale-character-day',
    'speakbook-my-winter',
    'speakbook-my-christmas',
    'speakbook-my-grandparents',
    'speakbook-my-pizza-day',
    'speakbook-my-australia-day',
    'speakbook-all-about-me',
    'speakbook-my-day-of-european-languages',
    'speakbook-my-autumn',
    'speakbook-my-pumpkin-day',
    'classroom-language',
    'project-stories-colours-of-the-forest',
    'mothers-day',
    'childrens-day',
    'oceans-day',
    'flashcards-stories-zimia',
    'flashcards-project-stories-jesien',
    'culture-posters',
    'napisy-do-dekoracji-sali',
    'spring-summer-english-learning-challenge',
    'stories-na-zime-audio-2',
    'dyplomy-na-zakonczenie-roku',
    'stories-na-lato-audio',
    'stories-na-jesien-audio',
    'holiday-photos-warm-up',
    'autumn-i-spy',
    'winter-i-spy',
    'dzien-kropki-dot-day',
    'harry-potter'
];

const found = {};

products.forEach(p => {
    const key = `"${p}": {`;
    const idx = objectContent.indexOf(key);
    if (idx !== -1) {
        let block = '';
        let braceCount = 1;
        let pos = idx + key.length;
        while (braceCount > 0 && pos < objectContent.length) {
            if (objectContent[pos] === '{') braceCount++;
            if (objectContent[pos] === '}') braceCount--;
            block += objectContent[pos];
            pos++;
        }

        // Extract English
        const enMatch = block.match(/en: \{ title: "([^"]+)", description: "([^"]+)" \}/);
        if (enMatch) {
            found[p] = { title: enMatch[1], description: enMatch[2] };
        } else {
            // Try multiline match
            const enMatchMulti = block.match(/en: \{\s*title: "([^"]+)",\s*description: "([\s\S]+?)"\s*\}/);
            if (enMatchMulti) {
                found[p] = { title: enMatchMulti[1], description: enMatchMulti[2] };
            }
        }
    }
});

fs.writeFileSync('product_sources.json', JSON.stringify(found, null, 2));
console.log(`Extracted ${Object.keys(found).length} products.`);

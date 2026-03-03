const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'lib', 'product-translations-data.ts');
let content = fs.readFileSync(filePath, 'utf8');

// The goal is to find all product objects and ensure they are parsed correctly.
// A product object looks like "id": { en: {}, pl: {}, ... }
// My script broke them into "id": { en: {}, pt: {} }, pl: {} }

function reconstruct() {
    const lines = content.split('\n');
    let output = "";
    let inMainObject = false;
    let currentProduct = null;
    let currentLangs = {};
    let bracketCount = 0;

    // Helper to find major product blocks
    const startOfFile = content.substring(0, content.indexOf('PRODUCT_TRANSLATIONS:'));
    output = startOfFile + 'PRODUCT_TRANSLATIONS: Record<string, Partial<Record<Language, ProductTranslation>>> = {\n';

    // Extract all blocks that look like product entries
    // We'll use a more surgical approach for the corrupted ones

    // Actually, I can just use regex to fix the SPECIFIC broken pattern:
    // "id": { ... } pt: { ... }, }, pl: { ... } },

    let fixedContent = content;

    // Pattern: "ID": { (ANYTHING) pt: { ... }, (WHITESPACE) }, (WHITESPACE) pl: { ... } (WHITESPACE) },
    // We want to remove the middle "}," and ensure a comma before pt if needed.

    // Global fix for the broken structure
    fixedContent = fixedContent.replace(/(\s*pt: {[^}]+},)\n\s*},\n\s*(pl: {)/g, '\n$1\n        $2');

    // Also remove any double closing braces where they shouldn't be
    // This is hard with regex. 

    // Let's try to just RE-ADD Portuguese correctly this time.
    // I will first REVERT the broken changes by removing the pt lines that match my pattern.

    fixedContent = fixedContent.replace(/\s*pt: { title: "[^"]+", description: "[^"]+" },\n\s*},/g, '\n    },');

    // Now the file should be back to a semi-consistent state (with some pl outside if I didn't catch them)
    // Wait, the pl was pushed out.

    fs.writeFileSync(filePath, fixedContent, 'utf8');
}

reconstruct();

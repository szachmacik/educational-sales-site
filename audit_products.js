const fs = require('fs');

const content = fs.readFileSync('lib/product-translations-data.ts', 'utf8');

// Basic extraction of the object content
const startMatch = content.match(/export const PRODUCT_TRANSLATIONS: Record<string, Partial<Record<Language, ProductTranslation>>> = \{/);
if (!startMatch) {
    console.error("Could not find PRODUCT_TRANSLATIONS object");
    process.exit(1);
}

const startIdx = content.indexOf('{', startMatch.index);
let braceCount = 0;
let endIdx = -1;

for (let i = startIdx; i < content.length; i++) {
    if (content[i] === '{') braceCount++;
    else if (content[i] === '}') braceCount--;

    if (braceCount === 0) {
        endIdx = i + 1;
        break;
    }
}

let rawObjectStr = content.substring(startIdx, endIdx);

// Clean up for eval (remove types and some common TS-isms)
// This is fragile but might work for this specific file
rawObjectStr = rawObjectStr.replace(/\n\s*\/\/.*$/gm, ''); // Remove comments

try {
    // We need to define Language and ProductTranslation if they are used as types inside the object, 
    // but usually they are only in the definition.
    const PRODUCT_TRANSLATIONS = eval(`(${rawObjectStr})`);

    const langs = ['en', 'uk', 'de', 'es', 'fr', 'it', 'cs', 'sk', 'ro', 'hu', 'pt', 'lt', 'lv', 'et', 'hr', 'sr', 'sl', 'bg', 'el', 'pl'];

    for (const [key, value] of Object.entries(PRODUCT_TRANSLATIONS)) {
        const missing = langs.filter(l => !value[l]);
        if (missing.length > 0) {
            console.log(`Product "${key}" is missing: ${missing.join(', ')}`);
        }
    }
} catch (e) {
    console.error("Evaluation failed:", e.message);
    // Log a bit of the string where it might have failed
    const errorMsg = e.stack || "";
    const match = errorMsg.match(/<anonymous>:(\d+):(\d+)/);
    if (match) {
        const lineNum = parseInt(match[1]);
        const colNum = parseInt(match[2]);
        const lines = rawObjectStr.split('\n');
        console.log(`Error around line ${lineNum}, column ${colNum}:`);
        console.log(lines[lineNum - 1]);
        console.log(" ".repeat(colNum - 1) + "^");
    } else {
        console.log("Raw object string (first 500 chars):", rawObjectStr.substring(0, 500));
        console.log("Raw object string (last 500 chars):", rawObjectStr.substring(rawObjectStr.length - 500));
    }
}

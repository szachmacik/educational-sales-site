const fs = require('fs');
let content = fs.readFileSync('lib/product-translations-data.ts', 'utf8');

// Regex to find and remove the pl entries I added
// They are indented with 8 spaces and start with pl:
content = content.replace(/^\s{8}pl: \{[\s\S]*?\},?\r?\n/gm, '');

// Also fix some potential artifacts from my previous multi_replace attempts
// like the duplicated dzien-kropki stuff if it's still there
// (The earlier multi_replace should have handled it, but let's be safe)

fs.writeFileSync('lib/product-translations-data.ts', content);
console.log("Cleaned up existing pl translations.");

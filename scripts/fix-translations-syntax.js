const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'lib', 'product-translations-data.ts');
const buffer = fs.readFileSync(filePath);

let start = 0;
if (buffer[0] === 0xEF && buffer[1] === 0xBB && buffer[2] === 0xBF) {
    start = 3;
    console.log('Skipping BOM in translations buffer.');
}

let content = buffer.slice(start).toString('utf8');

// Fix the syntax error at line 364 (and any similar ones)
// The issue: "description": "..." vs ... "
// Regex to catch descriptions that have extra text after the closing quote before the next property or closing brace
content = content.replace(/(description:\s*"[^"]*")\s*vs\s+/g, '$1 + " vs ');

// Actually, the error I saw was: description: "..." vs ...
// It should probably just be part of the string.
// Let's use a simpler fix for the specific broken line first.
content = content.replace(/"A set of 20 ready-to-use lesson plans with PDF materials for the entire month for nursery-age children. Includes songs, sensory and movement games, and printable materials."\s*vs\s+przedimek/g,
    '"A set of 20 ready-to-use lesson plans with PDF materials for the entire month for nursery-age children. Includes songs, sensory and movement games, and printable materials. vs przedimek');

// Also check for double quotes that might have been accidentally closed
// The cleanup script used: description: "..."
// But if the original content was: description: "Co znajdziesz... najmłodszych dzieci"
// And the replacement was shortened.

// Let's do a broad sweep for syntax errors in descriptions
try {
    // We can't easily parse TS as JSON, but we can verify it doesn't have obvious dangling quotes
    fs.writeFileSync(filePath, Buffer.from(content, 'utf8'));
    console.log('Translations file updated and BOM-free.');
} catch (e) {
    console.error('Failed to write translations:', e.message);
}

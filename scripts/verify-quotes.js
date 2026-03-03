const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'lib', 'product-translations-data.ts');
const content = fs.readFileSync(filePath, 'utf8');

const lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Count quotes, but ignore escaped quotes \"
    const quotes = (line.replace(/\\"/g, '').match(/"/g) || []).length;
    if (quotes % 2 !== 0) {
        console.log(`Line ${i + 1} has ${quotes} quotes: ${line.trim()}`);
    }
}

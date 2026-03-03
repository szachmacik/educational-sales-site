const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'lib', 'product-translations-data.ts');
const buffer = fs.readFileSync(filePath);
let content = buffer.toString('utf8');

if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
}

const lines = content.split('\n');
let fixCount = 0;

const fixedLines = lines.map((line, idx) => {
    if (!line.includes('description:')) return line;

    // Find the first description start
    const descIdx = line.indexOf('description:');
    const startQuote = line.indexOf('"', descIdx);
    if (startQuote === -1) return line;

    // Find the ACTUAL end of the string, respecting escaped quotes
    let endQuote = -1;
    for (let i = startQuote + 1; i < line.length; i++) {
        if (line[i] === '"' && line[i - 1] !== '\\') {
            endQuote = i;
            // But we might have multiple parts or a corrupted split.
            // If there's ANOTHER quote later on the same line followed by a closure, 
            // then this first one might be the wrong one.
        }
    }

    if (endQuote !== -1) {
        // Check if there's text after this endQuote that shouldn't be there
        const lastBrace = line.lastIndexOf('}');
        if (lastBrace > endQuote) {
            const middle = line.substring(endQuote + 1, lastBrace).trim();
            if (middle && !middle.startsWith(',') && !middle.startsWith('/') && !middle.startsWith('+') && !middle.startsWith(')')) {
                console.log(`Line ${idx + 1} is corrupted. Dangling text: ${middle.substring(0, 50)}...`);
                fixCount++;
                // Strip the corruption by taking everything up to the first closing quote 
                // and merging it with the final enclosure.
                return line.substring(0, endQuote + 1) + ' ' + line.substring(lastBrace);
            }
        }
    }
    return line;
});

fs.writeFileSync(filePath, fixedLines.join('\n'), 'utf8');
console.log(`Final repair finished. Fixed ${fixCount} lines.`);

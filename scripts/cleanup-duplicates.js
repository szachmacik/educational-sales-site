
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'lib', 'product-translations-data.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Pattern for duplicate pt keys
// pt: { title: "...", description: "..." },
// pt: { title: "...", description: "..." },

// We want to remove the first one if the second one is more detailed (contains "correlacionados")
// OR just remove one of them.

const lines = content.split('\n');
const newLines = [];
let skipNext = false;

for (let i = 0; i < lines.length; i++) {
    const currentLine = lines[i];
    const nextLine = lines[i + 1];

    if (currentLine.trim().startsWith('pt: {') && nextLine && nextLine.trim().startsWith('pt: {')) {
        // Duplicate! 
        // Keep the one that has "correlacionados" or "ชุด" or just the second one.
        if (nextLine.includes('correlacionados')) {
            console.log(`Found duplicate pt keys at lines ${i + 1}/${i + 2}. Keeping detailed one.`);
            // Skip currentLine
            continue;
        } else {
            // Just skip the first one
            continue;
        }
    }
    newLines.push(currentLine);
}

fs.writeFileSync(filePath, newLines.join('\n'));
console.log('Finished cleaning up duplicate pt keys.');

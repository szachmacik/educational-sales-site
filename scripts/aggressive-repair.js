const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'lib', 'product-translations-data.ts');
const content = fs.readFileSync(filePath, 'utf8');

const lines = content.split('\n');
let fixCount = 0;
const fixedLines = lines.map((line, idx) => {
    const trimLine = line.trim();
    if (trimLine.includes('description:')) {
        const shortenedEnd = 'materiały do druku."';
        const shortenedEndEn = 'printable materials."';

        let actualEnd = -1;
        if (trimLine.includes(shortenedEnd)) actualEnd = trimLine.indexOf(shortenedEnd) + shortenedEnd.length;
        else if (trimLine.includes(shortenedEndEn)) actualEnd = trimLine.indexOf(shortenedEndEn) + shortenedEndEn.length;

        if (actualEnd !== -1) {
            const lastBrace = trimLine.lastIndexOf('}');
            if (lastBrace > actualEnd) {
                const middle = trimLine.substring(actualEnd, lastBrace).trim();
                if (middle && !middle.startsWith(',') && !middle.startsWith('/') && !middle.startsWith(')')) {
                    console.log(`Fixing corrupted line ${idx + 1}: found dangling '${middle}'`);
                    fixCount++;
                    return line.substring(0, line.indexOf(trimLine) + actualEnd) + ' ' + trimLine.substring(lastBrace);
                }
            }
        }
    }
    return line;
});

fs.writeFileSync(filePath, fixedLines.join('\n'), 'utf8');
console.log(`Deep repair finished. Fixed ${fixCount} lines.`);

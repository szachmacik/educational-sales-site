const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'lib', 'product-translations-data.ts');
const buffer = fs.readFileSync(filePath);
let content = buffer.toString('utf8');

if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
}

// Find lines that have a description: but end with text that isn't a closure
const lines = content.split('\n');
const fixedLines = lines.map((line, idx) => {
    if (line.includes('description:') && !line.trim().endsWith('},') && !line.trim().endsWith('}, //') && !line.trim().endsWith('},')) {
        // Check if there's a dangling part after the shortened description
        // Example: description: "Shortened." some dangling text }
        const match = line.match(/(description:\s*"[^"]*")\s*(.*)$/);
        if (match && match[2] && !match[2].trim().startsWith(',') && !match[2].trim().startsWith('}')) {
            console.log(`Fixing line ${idx + 1}: ${line.trim()}`);
            // If match[2] contains the closing brace but we accidentally closed the quote too early
            // Let's just merge it back or fix the quote
            return line.replace(/(description:\s*"[^"]*")\s*(.*?)(}\s*,?\s*)$/, (m, g1, g2, g3) => {
                // Remove the middle quote and merge
                const g1_no_quote = g1.slice(0, -1);
                return `${g1_no_quote} ${g2.replace(/"/g, '\\"')}" ${g3}`;
            });
        }
    }
    return line;
});

fs.writeFileSync(filePath, fixedLines.join('\n'), 'utf8');
console.log('Finished broad syntax check and repair.');

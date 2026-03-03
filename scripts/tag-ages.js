

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../lib/linguachess-products.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Define mapping rules
const AGE_MAP = [
    { tag: 'zlobek', keywords: ['żłobek', 'zlobek', 'żłobku', 'maluszków'] },
    { tag: 'przedszkole', keywords: ['przedszkole', 'przedszkolu', 'przedszkolaki', 'kindergarten', 'teatr', 'stories', 'speakbook', 'special lessons'] },
    { tag: 'klasy-1-3', keywords: ['klasy 1-3', 'klas 1-3', 'klas 0-3', 'klasy 0-3', 'early school', 'teatr', 'stories', 'speakbook', 'special lessons'] },
    { tag: 'klasy-4-6', keywords: ['klasy 4-6', 'klas 4-6', 'culture', 'culture pack', 'kultura'] },
    { tag: 'klasy-7-8', keywords: ['klasy 7-8', 'klas 7-8', 'egzamin ósmoklasisty', 'e8', 'culture', 'culture pack', 'kultura'] },
    { tag: 'liceum', keywords: ['liceum', 'matura', 'dorośli', 'adults'] }
];

// Read file lines to process safely
const lines = content.split('\n');
let currentTitle = '';
let newLines = [];

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Capture Title
    const titleMatch = line.match(/title:\s*"(.*)"/);
    if (titleMatch) {
        currentTitle = titleMatch[1].toLowerCase();
    }

    // Check Categories line
    const catMatch = line.match(/categories:\s*\[(.*)\]/);

    if (catMatch) {
        let existingTags = catMatch[1].split(',').map(s => s.trim().replace(/"/g, ''));
        // Filter out empty strings if any
        existingTags = existingTags.filter(t => t.length > 0);

        const tagsToAdd = new Set();

        AGE_MAP.forEach(rule => {
            if (rule.keywords.some(k => currentTitle.includes(k))) {
                tagsToAdd.add(rule.tag);
            }
        });

        // Merge
        const merged = Array.from(new Set([...existingTags, ...tagsToAdd]));

        // Construct new line
        const newCatsString = merged.map(t => `"${t}"`).join(', ');
        newLines.push(line.replace(/\[.*\]/, `[${newCatsString}]`));
    } else {
        newLines.push(line);
    }
}

const newContentResult = newLines.join('\n');
fs.writeFileSync(filePath, newContentResult);
console.log("Updated age tags!");


const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../lib/linguachess-products.ts');
const content = fs.readFileSync(filePath, 'utf8');

// Regex to capture title and price
const regex = /title:\s*"([^"]+)"[\s\S]*?price:\s*"([^"]+)"/g;

let match;
while ((match = regex.exec(content)) !== null) {
    console.log(`${match[1]} | ${match[2]} PLN`);
}

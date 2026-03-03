const fs = require('fs');
const path = require('path');

const targetFile = path.resolve(__dirname, '../public/locales/pl/admin.json');
const content = fs.readFileSync(targetFile, 'utf8');

console.log('--- Content sample ---');
console.log(content.substring(0, 1000).split('\n').filter(line => line.includes('ð') || line.includes('â')).join('\n'));
console.log('--- End of sample ---');

const testMoji = 'ðŸ›’';
console.log(`Searching for: ${testMoji}`);
console.log(`Found index: ${content.indexOf(testMoji)}`);

// Let's try to reconstruct the mojibake from bytes
const mojibakePatterns = [
    { hex: 'f09f9b92', name: 'shopping cart' }, // ðŸ›’
    { hex: 'f09faa84', name: 'magic wand' },    // ðŸª„
    { hex: 'f09f9a80', name: 'rocket' },        // ðŸš€
    { hex: 'e29a99efb88f', name: 'gear' }     // âš™ï¸ 
];

mojibakePatterns.forEach(p => {
    const moji = Buffer.from(p.hex, 'hex').toString('utf8');
    console.log(`Pattern ${p.name} (${p.hex}) -> "${moji}" -> index: ${content.indexOf(moji)}`);
});

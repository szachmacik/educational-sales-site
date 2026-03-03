const fs = require('fs');
const path = require('path');

const targetFile = path.resolve(__dirname, '../public/locales/pl/admin.json');

if (!fs.existsSync(targetFile)) {
    console.error(`File not found: ${targetFile}`);
    process.exit(1);
}

const content = fs.readFileSync(targetFile, 'utf8');

// Mojibake mapping based on observed patterns
const mojibakeMap = {
    'ðŸ›’': '🛒',
    'ðŸª„': '🪄',
    'ðŸš€': '🚀',
    'âš™ï¸': '⚙️',
    'â€“': '–',
    'â€¢': '•',
    'â€¦': '…',
    'â€™': '’',
    'â€ž': '„',
    'â€ť': '”',
    'â—': '●',
    'Â': '' // Often appears as a prefix to non-breaking space or other characters
};

let fixedContent = content;

// Apply specific replacements
for (const [moji, fixed] of Object.entries(mojibakeMap)) {
    fixedContent = fixedContent.split(moji).join(fixed);
}

// Heuristic fix for double-encoded UTF-8 if any remain
// This is a common pattern for Polish characters if double-encoded
const doubleEncodedPolish = {
    'Å›': 'ś',
    'Å‚': 'ł',
    'Å„': 'ń',
    'Ä…': 'ą',
    'Ä™': 'ę',
    'Å¼': 'ż',
    'Åº': 'ź',
    'Ä‡': 'ć',
    'Ã³': 'ó',
    'Åš': 'Ś',
    'Å': 'Ł',
    'Åƒ': 'Ń',
    'Ä„': 'Ą',
    'Ä˜': 'Ę',
    'Å»': 'Ż',
    'Å¹': 'Ź',
    'Ä†': 'Ć',
    'Ã“': 'Ó'
};

for (const [moji, fixed] of Object.entries(doubleEncodedPolish)) {
    fixedContent = fixedContent.split(moji).join(fixed);
}

if (content !== fixedContent) {
    fs.writeFileSync(targetFile, fixedContent, 'utf8');
    console.log(`Successfully fixed mojibake in ${targetFile}`);
} else {
    console.log(`No mojibake detected in ${targetFile} or already fixed.`);
}

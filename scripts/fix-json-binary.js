const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'lib', 'data', 'products.json');
const buffer = fs.readFileSync(filePath);

// Hex for UTF-8 BOM: EF BB BF
let start = 0;
if (buffer[0] === 0xEF && buffer[1] === 0xBB && buffer[2] === 0xBF) {
    start = 3;
    console.log('Skipping BOM in buffer.');
}

let content = buffer.slice(start).toString('utf8');

// Also check for multiple BOMs (just in case)
while (content.startsWith('\uFEFF')) {
    content = content.slice(1);
    console.log('Stripped additional BOM string.');
}

content = content.trim();

// Fix the missing closing brace
// The file ends with "...}\n  ]"
if (content.endsWith('}]') || content.endsWith('} ]') || /}\s*]/.test(content.slice(-20))) {
    // If it only has one } before ], it's likely broken
    // Let's count } at the end
    const lastPart = content.slice(-20);
    if (!/}\s*}\s*]/.test(lastPart)) {
        content = content.replace(/}\s*]\s*$/, '} } ]');
        console.log('Added missing closing brace.');
    }
}

try {
    const json = JSON.parse(content);
    // Use JSON.stringify to ensure it's pretty and valid
    const finalContent = JSON.stringify(json, null, 2);
    // Write as raw buffer to be 100% sure NO BOM is added by the OS/environment
    fs.writeFileSync(filePath, Buffer.from(finalContent, 'utf8'));
    console.log('JSON saved successfully as clean UTF-8.');
} catch (e) {
    console.error('Parse failed in last resort:', e.message);
    console.log('Tail of content:', content.slice(-50));
}

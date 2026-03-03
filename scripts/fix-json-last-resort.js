const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'lib', 'data', 'products.json');
const buffer = fs.readFileSync(filePath);

let content = buffer.toString('utf8');

// Strip BOM at the start of the string if it exists
if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
}

// Fix the specific syntax error discovered near the end
// Expected: ...} } ]
// Found: ...} ]
// We look for the last "source" object and make sure it's closed.
if (content.trim().endsWith('} ]')) {
    content = content.replace(/}\s*]\s*$/, '} } ]');
    console.log('Fixed missing closing brace for the last product.');
}

try {
    const json = JSON.parse(content);
    // Write back as UTF-8 without BOM
    fs.writeFileSync(filePath, JSON.stringify(json, null, 2), { encoding: 'utf8' });
    console.log('JSON fixed and written successfully without BOM.');
} catch (e) {
    console.error('Final parse attempt failed:', e.message);
    // Let's see the last 100 chars to be sure
    console.log('Last 100 chars:', content.substring(content.length - 100));
}

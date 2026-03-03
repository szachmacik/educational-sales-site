const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'lib', 'data', 'products.json');
let content = fs.readFileSync(filePath, 'utf8');

// Remove potential BOM manually if it still exists
if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
}

try {
    const json = JSON.parse(content);
    // Re-stringify to ensure clean formatting and no trailing commas/invalid characters
    const cleanJson = JSON.stringify(json, null, 2);
    fs.writeFileSync(filePath, cleanJson, 'utf8');
    console.log('Successfully cleaned and fixed products.json');
} catch (e) {
    console.error('Error parsing JSON:', e.message);
    // If it fails to parse, we might have a serious syntax error.
    // Let's try to fix common trailing comma issue before giving up.
    const fixedContent = content.replace(/,\s*([\]}])/g, '$1');
    try {
        const json = JSON.parse(fixedContent);
        fs.writeFileSync(filePath, JSON.stringify(json, null, 2), 'utf8');
        console.log('Successfully fixed products.json using regex fallback');
    } catch (e2) {
        console.error('Failed to fix JSON even with fallback:', e2.message);
    }
}

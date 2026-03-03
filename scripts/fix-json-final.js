const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'lib', 'data', 'products.json');
let content = fs.readFileSync(filePath, 'utf8');

// Remove BOM explicitly
if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
}

// Aggressively fix common JSON errors (trailing commas, etc.)
// First, let's try to find where it's broken.
// Position 134840 is near the end (total length ~140KB)

try {
    const json = JSON.parse(content);
    const cleanJson = JSON.stringify(json, null, 2);
    fs.writeFileSync(filePath, cleanJson, 'utf8');
    console.log('JSON fixed successfully (standard parse).');
} catch (e) {
    console.error('Initial parse failed:', e.message);

    // Attempt regex fix for trailing commas
    let fixed = content.replace(/,\s*([\]}])/g, '$1');

    // Also check for double commas or other glitches
    fixed = fixed.replace(/,,/g, ',');

    try {
        const json = JSON.parse(fixed);
        fs.writeFileSync(filePath, JSON.stringify(json, null, 2), 'utf8');
        console.log('JSON fixed successfully (regex fallback).');
    } catch (e2) {
        console.error('Regex fallback failed:', e2.message);

        // Last resort: let's look at the context around 134840
        const pos = 134840;
        console.log('Context around error:', content.substring(pos - 100, pos + 100));
    }
}

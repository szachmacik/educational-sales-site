const fs = require('fs');
const path = require('path');

const enPath = path.join(__dirname, '..', 'public', 'locales', 'en', 'admin.json');
const esPath = path.join(__dirname, '..', 'public', 'locales', 'es', 'admin.json.corrupt');
const targetPath = path.join(__dirname, '..', 'public', 'locales', 'es', 'admin.json');

function getAllKeys(obj, prefix = '') {
    let keys = {};
    for (let key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
            Object.assign(keys, getAllKeys(obj[key], prefix + key + '.'));
        } else {
            keys[prefix + key] = obj[key];
        }
    }
    return keys;
}

function setValue(obj, path, value) {
    const keys = path.split('.');
    let current = obj;
    for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
}

try {
    const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));

    // For ES, since it might be structurally corrupt, we'll try to extract string values using regex 
    // rather than JSON.parse if it fails.
    let esValues = {};
    let esRaw = fs.readFileSync(esPath, 'utf8');

    // Heuristic: find all "key": "value" patterns
    // This is rough but works for simple flat-ish translations
    const matches = esRaw.matchAll(/"([^"]+)":\s*"([^"]+)"/g);
    for (const match of matches) {
        const key = match[1];
        const val = match[2];
        // We don't know the full path from just the key in a corrupt file,
        // but many keys are unique or we can try to guess.
        // Actually, let's try to fix the ES JSON well enough to parse it.

        // Let's try to parse the ES JSON one more time with a very lenient approach
        // or just use the English keys and find the values in the raw ES string.
    }

    // Better approach: 
    // 1. Get all leaf keys from EN.
    // 2. For each key, search for its specific "leaf_key": "value" in the raw ES file.
    const enKeys = getAllKeys(enData);
    const esFinal = {};

    for (let fullPath in enKeys) {
        const leafKey = fullPath.split('.').pop();
        // Look for the last occurrence of leafKey in ES raw to get its value
        // Note: this assumes leaf keys are mostly unique or in order.
        const regex = new RegExp(`"${leafKey}":\\s*"([^"]+)"`);
        const match = esRaw.match(regex);
        if (match) {
            setValue(esFinal, fullPath, match[1]);
        } else {
            // Fallback to EN value if ES is missing
            setValue(esFinal, fullPath, enKeys[fullPath]);
        }
    }

    fs.writeFileSync(targetPath, JSON.stringify(esFinal, null, 2));
    console.log("Successfully rebuilt Spanish admin.json using English template");
} catch (e) {
    console.log("Error: " + e.message);
}

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'public', 'locales', 'es', 'admin.json.corrupt');
const targetPath = path.join(__dirname, '..', 'public', 'locales', 'es', 'admin.json');
let s = fs.readFileSync(filePath, 'utf8');

// The structural mess:
// 1. adminPanel is nested inside adminSettings
// 2. Many sections are nested inside automation

// Step 1: Fix adminSettings sections (un-nest from automation)
// We'll look for where automation should end (after chat)
const chatEnd = s.indexOf('"welcome": "¡Hola! Estoy listo para trabajar. Puedes asignarme tareas en tus cuentas (Wordwall, Canva, Genially). ¿Qué debo hacer?"');
if (chatEnd !== -1) {
    const nextBrace = s.indexOf('}', chatEnd);
    if (nextBrace !== -1) {
        // Insert a closing brace for automation after the closing brace of chat
        s = s.substring(0, nextBrace + 1) + '\n    },' + s.substring(nextBrace + 1);
    }
}

// Step 2: Fix adminPanel (un-nest from adminSettings)
const apIndex = s.indexOf('"adminPanel": {');
if (apIndex !== -1) {
    let before = s.substring(0, apIndex).trim();
    let after = s.substring(apIndex);

    // The previous block was 'editor'. It might have extra braces now if I added them earlier.
    // Clean up trailing braces in 'before' and add the correct ones to close 'editor' then 'adminSettings'
    before = before.replace(/(}\s*)+\,?$/, '');
    s = before + '\n      }\n    }\n  },\n  ' + after;
}

// Step 3: Remove ALL trailing braces to start clean at the end
s = s.replace(/(}\s*)+$/, '');

// Step 4: Re-add total 5 closing braces to close: manus, settings, integrations, adminPanel, root
s = s.trim() + '\n        }\n      }\n    }\n  }\n}';

// Step 5: Final Indentation Fix (The most robust part)
try {
    // Attempt to parse. If it fails, we'll try to find where.
    const data = JSON.parse(s);
    fs.writeFileSync(targetPath, JSON.stringify(data, null, 2));
    console.log("Successfully fixed and formatted Spanish admin.json");
} catch (e) {
    console.log("JSON Parse Error: " + e.message);
    const pos = parseInt(e.message.match(/position (\d+)/)?.[1] || 0);
    if (pos) {
        console.log("Context around error:", s.substring(Math.max(0, pos - 50), Math.min(s.length, pos + 50)));
    }
    fs.writeFileSync(targetPath + '.last_error', s);
}

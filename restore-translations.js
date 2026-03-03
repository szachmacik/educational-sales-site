const fs = require('fs');

const content = fs.readFileSync('lib/translations_fixed.ts', 'utf8');

// I'll find where el starts:
const elStart = content.indexOf('    el: {');
if (elStart === -1) {
    console.error('Could not find el: {');
    process.exit(1);
}

// Find where the language BEFORE el ends.
// In this file, it's roughly "},}," before el: {
let beforeEl = content.substring(0, elStart).trim();

// Clean up the trailing comma/brace before el starts
if (beforeEl.endsWith('},},')) {
    beforeEl = beforeEl.substring(0, beforeEl.length - 2); // remove },
} else if (beforeEl.endsWith('},')) {
    // fine
}

const newContent = beforeEl + '\n    }\n};\n';

fs.writeFileSync('lib/translations.ts', newContent);
console.log('Restored from backup and removed Greek');

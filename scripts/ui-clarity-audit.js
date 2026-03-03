/**
 * UI Clarity Audit Script
 * Scans all TSX files for common UI overlap / overflow issues:
 *  1. Long text without truncation or break-words
 *  2. Fixed height elements containing dynamic text (may overflow)
 *  3. Grid/flex children that might not have max-width
 *  4. Missing overflow containers for dynamic/unknown-length content
 *  5. Absolute/relative positioned elements that may overlap
 */
const fs = require('fs');
const path = require('path');

const ROOT = 'c:\\Users\\kamil\\.gemini\\antigravity\\scratch\\educational-sales-site';
const DIRS = ['app', 'components'];

function walkDir(dir) {
    let results = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
        const full = path.join(dir, e.name);
        if (e.isDirectory() && e.name !== 'node_modules' && e.name !== '.next') {
            results = results.concat(walkDir(full));
        } else if (e.isFile() && (e.name.endsWith('.tsx') || e.name.endsWith('.ts'))) {
            results.push(full);
        }
    }
    return results;
}

const files = [];
for (const d of DIRS) files.push(...walkDir(path.join(ROOT, d)));

const issues = [];

// Patterns that indicate potential UI clarity trouble
const PATTERNS = [
    { id: 'NO_TRUNCATE', label: 'Dynamic text w/o truncation', regex: /\{[^{}]+\.(title|name|description|content|text|label|email|address)\}(?![^<]*class[^<]*(truncate|line-clamp|break-word|overflow))/g },
    { id: 'HARDCODED_HEIGHT_WITH_TEXT', label: 'Fixed height likely to overflow dynamic text', regex: /h-\[\d{2,3}px\][^"]*>[^<]*\{[^}]*\}/g },
    { id: 'ALERT_STILL_PRESENT', label: 'Remaining native alert() calls', regex: /onClick=\{[^}]*alert\(/g },
    { id: 'ABS_OVERFLOW', label: 'Absolute element without overflow-hidden parent risk', regex: /absolute[^"]*inset-0[^"]*(?!overflow)/g },
    { id: 'PLACEHOLDER_TEXT', label: 'Lorem ipsum or placeholder text', regex: /Lorem ipsum|placeholder\.com|example\.com|test@|admin@example/gi },
    { id: 'UNCONSTRAINED_DESCRIPTION', label: 'Long description without line-clamp', regex: /text-sm[^"]*>[\s]*\{[^}]*\.(description|desc|body|content|subtitle)\}/g },
];

for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const rel = path.relative(ROOT, file);

    for (const { id, label, regex } of PATTERNS) {
        let match;
        const localRegex = new RegExp(regex.source, regex.flags);
        while ((match = localRegex.exec(content)) !== null) {
            const lineNum = content.substring(0, match.index).split('\n').length;
            issues.push({ file: rel, line: lineNum, id, label, snippet: match[0].substring(0, 80) });
        }
    }
}

// Sort by file then line
issues.sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line);

// Group by ID
const byType = {};
for (const i of issues) {
    if (!byType[i.id]) byType[i.id] = [];
    byType[i.id].push(i);
}

console.log(`\n== UI Clarity Audit ==`);
console.log(`Scanned ${files.length} files, found ${issues.length} potential issues.\n`);

for (const [id, list] of Object.entries(byType)) {
    console.log(`\n---- ${id}: ${list[0].label} (${list.length} hits) ----`);
    for (const i of list.slice(0, 10)) {
        console.log(`  ${i.file}:${i.line}  => ${i.snippet}`);
    }
    if (list.length > 10) console.log(`  ... and ${list.length - 10} more`);
}

// Save to JSON for follow-up automated fixes
fs.writeFileSync(path.join(ROOT, 'ui-clarity-report.json'), JSON.stringify(issues, null, 2));
console.log(`\nFull report saved to ui-clarity-report.json`);

const fs = require('fs');
const path = require('path');

const srcDir1 = 'c:\\Users\\kamil\\.gemini\\antigravity\\scratch\\educational-sales-site\\components\\dashboard';
const srcDir2 = 'c:\\Users\\kamil\\.gemini\\antigravity\\scratch\\educational-sales-site\\app\\[lang]\\admin';

function processDir(dir) {
    let results = [];
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) results = results.concat(processDir(fullPath));
        else if (fullPath.endsWith('.tsx')) results.push(fullPath);
    });
    return results;
}

const allFiles = [...processDir(srcDir1), ...processDir(srcDir2)];

let fixedCount = 0;

for (const file of allFiles) {
    let content = fs.readFileSync(file, 'utf8');
    
    // If it uses toast but doesn't import it
    if (content.includes('toast.') && !content.includes('import { toast }')) {
        // Find the last import
        const importRegex = /^import .+;?[\r\n]+/gm;
        let lastMatch = null;
        let match;
        while ((match = importRegex.exec(content)) !== null) {
            lastMatch = match;
        }

        if (lastMatch) {
            const insertPos = lastMatch.index + lastMatch[0].length;
            content = content.substring(0, insertPos) + 'import { toast } from "sonner";\n' + content.substring(insertPos);
            fs.writeFileSync(file, content, 'utf8');
            fixedCount++;
        }
    }
}

console.log(`Fixed ${fixedCount} files missing the toast import.`);

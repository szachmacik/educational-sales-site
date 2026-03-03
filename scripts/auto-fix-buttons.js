const fs = require('fs');
const path = require('path');

const reportFile = 'c:\\Users\\kamil\\.gemini\\antigravity\\scratch\\educational-sales-site\\empty-buttons-report.json';
const emptyButtons = JSON.parse(fs.readFileSync(reportFile, 'utf8'));

let patchedCount = 0;

// Group by file
const byFile = emptyButtons.reduce((acc, curr) => {
    if (!curr.file.includes('components\\ui\\')) {
        if (!acc[curr.file]) acc[curr.file] = [];
        acc[curr.file].push(curr);
    }
    return acc;
}, {});

for (const [relativePath, buttons] of Object.entries(byFile)) {
    const filePath = path.join('c:\\Users\\kamil\\.gemini\\antigravity\\scratch\\educational-sales-site', relativePath);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Process backwards to not mess up line numbers/indices
    // But since the report only gives lines, let's just do a regex replace on the whole file carefully.
    // Instead of using the report indices, let's just do a sophisticated regex replace on the file contents directly.

    const buttonRegex = /<(Button|button)\b([^>]*?)>/g;
    
    content = content.replace(buttonRegex, (match, tag, attributes) => {
        const hasOnClick = /onClick=/.test(attributes);
        const isSubmit = /type=["']submit["']/.test(attributes);
        const hasHref = /href=/.test(attributes);
        const isAsChild = /asChild/.test(attributes);
        const isDisabled = /disabled/.test(attributes);
        const isFormAction = /formAction=/.test(attributes);
        const hasId = /id=/.test(attributes);
        
        // If it really has nothing
        if (!hasOnClick && !isSubmit && !hasHref && !isAsChild && !isFormAction) {
            
            // Avoid touching specific headless UI triggers if possible, but user wants EVERYTHING to do something.
            // Let's add an onClick
            patchedCount++;
            return `<${tag} onClick={() => alert("Ta funkcja (moduł ${tag.toLowerCase()}) zostanie udostępniona wkrótce.")}${attributes}>`;
        }
        
        return match;
    });

    fs.writeFileSync(filePath, content, 'utf8');
}

console.log(`Successfully patched ${patchedCount} buttons with placeholder alerts.`);

const fs = require('fs');
const path = require('path');

const srcDir = 'c:\\Users\\kamil\\.gemini\\antigravity\\scratch\\educational-sales-site\\app';
const componentsDir = 'c:\\Users\\kamil\\.gemini\\antigravity\\scratch\\educational-sales-site\\components';

function getAllFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);

    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function(file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
        } else {
            if (file.endsWith('.tsx')) {
                arrayOfFiles.push(path.join(dirPath, "/", file));
            }
        }
    });

    return arrayOfFiles;
}

const allFiles = [...getAllFiles(srcDir), ...getAllFiles(componentsDir)];

let totalButtons = 0;
let emptyButtons = [];

allFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    
    // Quick regex to find <Button ...> or <button ...> tags
    const buttonRegex = /<(Button|button)\b([^>]*?)>/g;
    let match;
    
    while ((match = buttonRegex.exec(content)) !== null) {
        totalButtons++;
        const attributes = match[2];
        
        // Exclude commented out lines (naive approach)
        const lineStart = content.lastIndexOf('\n', match.index);
        const line = content.substring(lineStart, match.index);
        if (line.trim().startsWith('//')) {
            continue;
        }

        const hasOnClick = /onClick=\{/.test(attributes);
        const isSubmit = /type=["']submit["']/.test(attributes);
        const hasHref = /href=/.test(attributes); // Sometimes Button is used "asChild" with Link
        const isAsChild = /asChild/.test(attributes);
        const isDisabled = /disabled/.test(attributes);
        const isFormAction = /formAction=/.test(attributes);
        
        // If it's asChild, we assume the wrapper (like Link) handles it. But we should ideally check the wrapper.
        // For now, let's flag buttons that definitely have no interaction defined directly on them, unless they are inside a form/asChild.
        if (!hasOnClick && !isSubmit && !hasHref && !isAsChild && !isFormAction) {
            
            // Further check: is it inside a DialogTrigger or similar? This is harder with regex.
            // Let's just collect them and review.
            
            // Get line number
            const lines = content.substring(0, match.index).split('\n');
            const lineNumber = lines.length;
            
            emptyButtons.push({
                file: file.replace('c:\\Users\\kamil\\.gemini\\antigravity\\scratch\\educational-sales-site\\', ''),
                line: lineNumber,
                attributes: attributes.trim().replace(/\s+/g, ' ')
            });
        }
    }
});

console.log(`Total Buttons Found: ${totalButtons}`);
console.log(`Potentially Empty Buttons: ${emptyButtons.length}`);

fs.writeFileSync('c:\\Users\\kamil\\.gemini\\antigravity\\scratch\\educational-sales-site\\empty-buttons-report.json', JSON.stringify(emptyButtons, null, 2));
console.log('Saved report to empty-buttons-report.json');

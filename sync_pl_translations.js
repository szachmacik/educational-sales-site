const fs = require('fs');

const productsData = JSON.parse(fs.readFileSync('lib/data/products.json', 'utf8'));
let tsContent = fs.readFileSync('lib/product-translations-data.ts', 'utf8');

// Map URL slugs to Polish translations
const slugMap = {};
productsData.forEach(p => {
    const slug = p.url.split('/').filter(Boolean).pop();
    slugMap[slug] = {
        title: p.title,
        description: p.description
    };
});

const lines = tsContent.split(/\r?\n/);
let outputLines = [];
let i = 0;

while (i < lines.length) {
    let line = lines[i];
    const productMatch = line.match(/^\s*"([^"]+)": \{/);

    if (productMatch) {
        const productKey = productMatch[1];
        outputLines.push(line);
        i++;

        let productContentLines = [];
        let braceCount = 1;
        let hasPl = false;

        while (i < lines.length && braceCount > 0) {
            let pLine = lines[i];

            // Track braces
            for (let char of pLine) {
                if (char === '{') braceCount++;
                else if (char === '}') braceCount--;
            }

            if (pLine.trim().startsWith('pl:')) hasPl = true;

            if (braceCount > 0) {
                productContentLines.push(pLine);
                i++;
            } else {
                // We reached the end of the product object
                if (!hasPl && slugMap[productKey]) {
                    const { title, description } = slugMap[productKey];
                    const escapedTitle = title.replace(/"/g, '\\"');
                    const escapedDesc = description.replace(/"/g, '\\"').replace(/\n/g, '\\n');

                    // Ensure the last line in productContentLines has a comma if it's a language block
                    if (productContentLines.length > 0) {
                        let lastIdx = productContentLines.length - 1;
                        while (lastIdx >= 0 && productContentLines[lastIdx].trim() === "") lastIdx--;
                        if (lastIdx >= 0) {
                            let lastL = productContentLines[lastIdx];
                            if (lastL.trim().endsWith('}') && !lastL.trim().endsWith('},')) {
                                productContentLines[lastIdx] = lastL.trimEnd().replace(/}$/, '},');
                            }
                        }
                    }

                    productContentLines.push(`        pl: { title: "${escapedTitle}", description: "${escapedDesc}" },`);
                }
                outputLines.push(...productContentLines);
                outputLines.push(pLine); // The closing brace line
                i++;
            }
        }
    } else {
        outputLines.push(line);
        i++;
    }
}

fs.writeFileSync('lib/product-translations-data.ts', outputLines.join('\n'));
console.log("Successfully synced and repaired Polish translations (v5 - brace counting).");

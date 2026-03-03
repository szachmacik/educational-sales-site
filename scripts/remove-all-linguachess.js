
const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');

const filesToClean = [
    'lib/data/products.json',
    'lib/product-catalog.ts',
    'components/header.tsx',
    'components/hero.tsx',
    'public/audit-reports.json'
];

filesToClean.forEach(relPath => {
    const fullPath = path.join(rootDir, relPath);
    if (fs.existsSync(fullPath)) {
        try {
            let content = fs.readFileSync(fullPath, 'utf8');
            if (content.toLowerCase().includes('linguachess')) {
                console.log(`Cleaning ${relPath}...`);
                // Use a regex to replace case-insensitively
                // In URLs we use kamilaenglish.com, in text we use Kamila English
                let newContent = content.replace(/linguachess\.com/gi, 'kamilaenglish.com');
                newContent = newContent.replace(/linguachess/gi, 'Kamila English');

                fs.writeFileSync(fullPath, newContent);
            }
        } catch (e) {
            console.error(`Error cleaning ${relPath}:`, e);
        }
    }
});

// Also check locales just in case anything was missed
const localesPath = path.join(rootDir, 'public', 'locales');
const locales = fs.readdirSync(localesPath);
locales.forEach(locale => {
    const localeDir = path.join(localesPath, locale);
    const files = fs.readdirSync(localeDir);
    files.forEach(file => {
        const fullPath = path.join(localeDir, file);
        if (fs.lstatSync(fullPath).isFile() && file.endsWith('.json')) {
            try {
                let content = fs.readFileSync(fullPath, 'utf8');
                if (content.toLowerCase().includes('linguachess')) {
                    console.log(`Cleaning locale file ${locale}/${file}...`);
                    let newContent = content.replace(/linguachess\.com/gi, 'kamilaenglish.com');
                    newContent = newContent.replace(/linguachess/gi, 'Kamila English');
                    fs.writeFileSync(fullPath, newContent);
                }
            } catch (e) {
                console.error(`Error cleaning locale ${locale}/${file}:`, e);
            }
        }
    });
});

console.log('Finished deep clean of files.');

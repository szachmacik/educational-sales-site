const fs = require('fs');
const path = require('path');

const localesDir = path.resolve(__dirname, '../public/locales');
const locales = fs.readdirSync(localesDir).filter(f => fs.statSync(path.join(localesDir, f)).isDirectory());

const suspects = [
    'c3 b0 c2 9f', // Start of many double-encoded emojis
    'c3 a2 c2 80', // Start of double-encoded punctuation
    'c3 a2 c2 9a',
    'c3 a2 c2 9c'
];

locales.forEach(lang => {
    const langDir = path.join(localesDir, lang);
    const files = fs.readdirSync(langDir).filter(f => f.endsWith('.json'));

    files.forEach(file => {
        const filePath = path.join(langDir, file);
        const buffer = fs.readFileSync(filePath);
        const hex = buffer.toString('hex');

        suspects.forEach(s => {
            const pattern = s.replace(/ /g, '');
            if (hex.includes(pattern)) {
                console.log(`[SUSPECT] ${lang}/${file} contains pattern ${s}`);
            }
        });
    });
});

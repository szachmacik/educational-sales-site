
const fs = require('fs');
const path = require('path');

const localesPath = path.join(__dirname, '..', 'public', 'locales');
const locales = fs.readdirSync(localesPath);

console.log('| Locale | Email | Phone |');
console.log('|---|---|---|');

locales.forEach(locale => {
    const commonPath = path.join(localesPath, locale, 'common.json');
    if (fs.existsSync(commonPath)) {
        try {
            const common = JSON.parse(fs.readFileSync(commonPath, 'utf8'));
            const email = common.contact?.info?.emailValue || 'N/A';
            const phone = common.contact?.info?.phoneValue || 'N/A';
            console.log(`| ${locale} | ${email} | ${phone} |`);
        } catch (e) {
            console.log(`| ${locale} | ERROR | ERROR |`);
        }
    }
});

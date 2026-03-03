
const fs = require('fs');
const path = require('path');

const localesPath = path.join(__dirname, '..', 'public', 'locales');
const locales = fs.readdirSync(localesPath);

const targetEmail = 'contact@kamilaenglish.com';
const targetPhone = '+48 123 456 789';

locales.forEach(locale => {
    const commonPath = path.join(localesPath, locale, 'common.json');
    if (fs.existsSync(commonPath)) {
        try {
            let content = fs.readFileSync(commonPath, 'utf8');
            let common = JSON.parse(content);

            if (common.contact && common.contact.info) {
                common.contact.info.emailValue = targetEmail;
                common.contact.info.phoneValue = targetPhone;

                // Keep same formatting (2 spaces indent)
                fs.writeFileSync(commonPath, JSON.stringify(common, null, 2));
                console.log(`Updated contact info for ${locale}`);
            }
        } catch (e) {
            console.error(`Error updating ${locale}:`, e);
        }
    }
});

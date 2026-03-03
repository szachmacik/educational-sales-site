
const fs = require('fs');
const path = require('path');

const localesPath = path.join(__dirname, '..', 'public', 'locales');
const locales = fs.readdirSync(localesPath);

const targetEmail = 'contact@kamilaenglish.com';
const targetPhone = '+44 20 1234 5678'; // Reverting to what was in EN common earlier

locales.forEach(locale => {
    const commonPath = path.join(localesPath, locale, 'common.json');
    if (fs.existsSync(commonPath)) {
        try {
            let content = fs.readFileSync(commonPath, 'utf8');
            let common = JSON.parse(content);

            if (common.contact && common.contact.info) {
                // Remove linguachess
                if (common.contact.info.emailValue && common.contact.info.emailValue.includes('linguachess')) {
                    common.contact.info.emailValue = targetEmail;
                    console.log(`Reset email for ${locale}`);
                }
                if (common.contact.info.phoneValue === '+48 123 456 789') {
                    common.contact.info.phoneValue = targetPhone;
                    console.log(`Reset phone for ${locale}`);
                }

                // Deep scan for 'linguachess' string in the whole object
                const deepClean = (obj) => {
                    for (let key in obj) {
                        if (typeof obj[key] === 'string' && obj[key].toLowerCase().includes('linguachess')) {
                            console.log(`Found linguachess in ${locale} at key ${key}: ${obj[key]}`);
                            // Replace with something generic or Kamala English
                            obj[key] = obj[key].replace(/linguachess/gi, 'Kamila English');
                        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                            deepClean(obj[key]);
                        }
                    }
                };
                deepClean(common);

                fs.writeFileSync(commonPath, JSON.stringify(common, null, 2));
            }
        } catch (e) {
            console.error(`Error processing ${locale}:`, e);
        }
    }
});
console.log('Finished deep clean of locales.');

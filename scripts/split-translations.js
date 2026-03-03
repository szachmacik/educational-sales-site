const fs = require('fs');
const path = require('path');

const LOCALES_DIR = path.join(process.cwd(), 'public', 'locales');
const NAMESPACES = {
    common: ['nav', 'footer', 'auth', 'cart', 'socialProof', 'newsletter'],
    landing: ['hero', 'features', 'trustBar', 'testimonials', 'aboutAuthor'],
    shop: ['shop', 'categories', 'products', 'checkout'],
    dashboard: ['dashboard', 'course'],
    admin: ['adminSettings', 'adminChat']
};

async function splitTranslations() {
    console.log('Starting translation split from JSON files (JS mode)...');

    const files = fs.readdirSync(LOCALES_DIR).filter(file => file.endsWith('.json'));

    for (const file of files) {
        const lang = path.basename(file, '.json');
        // Only process real language codes (2-3 chars), skip existing directories
        if (lang.length > 3) continue;

        console.log(`Processing ${lang}...`);

        const contentPath = path.join(LOCALES_DIR, file);
        const contentStr = fs.readFileSync(contentPath, 'utf8');
        let content;
        try {
            content = JSON.parse(contentStr);
        } catch (e) {
            console.error(`Failed to parse ${file}: ${e.message}`);
            continue;
        }

        const langDir = path.join(LOCALES_DIR, lang);
        if (!fs.existsSync(langDir)) {
            fs.mkdirSync(langDir, { recursive: true });
        }

        // 1. Generate defined namespaces
        for (const [ns, keys] of Object.entries(NAMESPACES)) {
            const nsContent = {};
            keys.forEach(key => {
                if (content[key]) {
                    nsContent[key] = content[key];
                }
            });

            const filePath = path.join(langDir, `${ns}.json`);
            fs.writeFileSync(filePath, JSON.stringify(nsContent, null, 2));
        }
        console.log(`✓ Split ${lang} into namespaces`);
    }

    console.log('All translations split successfully!');
}

splitTranslations().catch(console.error);

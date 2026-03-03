
import fs from 'fs';
import path from 'path';
import { translations } from '../lib/translations';

const LOCALES_DIR = path.join(process.cwd(), 'public', 'locales');
const NAMESPACES = {
    common: ['nav', 'footer', 'auth', 'cart', 'socialProof', 'newsletter'],
    landing: ['hero', 'features', 'trustBar', 'testimonials', 'aboutAuthor'],
    shop: ['shop', 'categories', 'products', 'checkout'],
    dashboard: ['dashboard', 'course'],
    admin: ['adminSettings', 'adminChat']
};

async function splitTranslations() {
    console.log('Starting translation split from JSON files...');

    const files = fs.readdirSync(LOCALES_DIR).filter(file => file.endsWith('.json'));

    for (const file of files) {
        const lang = path.basename(file, '.json');
        console.log(`Processing ${lang}...`);

        const contentPath = path.join(LOCALES_DIR, file);
        const contentStr = fs.readFileSync(contentPath, 'utf8');
        const content = JSON.parse(contentStr);

        const langDir = path.join(LOCALES_DIR, lang);
        if (!fs.existsSync(langDir)) {
            fs.mkdirSync(langDir, { recursive: true });
        }

        // 1. Generate defined namespaces
        for (const [ns, keys] of Object.entries(NAMESPACES)) {
            const nsContent: Record<string, any> = {};
            keys.forEach(key => {
                if ((content as any)[key]) {
                    nsContent[key] = (content as any)[key];
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

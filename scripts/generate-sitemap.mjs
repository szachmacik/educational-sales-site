import fs from 'fs';
import path from 'path';

const LOCALES = ['pl', 'en', 'uk', 'de', 'es', 'fr', 'it', 'cs', 'sk', 'ro', 'hu', 'pt', 'lt', 'lv', 'et', 'hr', 'sr', 'sl', 'bg', 'el'];
const DOMAIN = 'https://englishteachers.com'; // Parameterize this in real usage

// Mock product slugs for demonstration - in production, this would read products.json
const PRODUCT_SLUGS = [
    'angielski-w-zlobku-zestaw-december',
    'mega-pack-flashcards-premium',
    'lesson-plan-bundle-kindergarten'
];

function generateSitemap() {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n`;

    // 1. Home Pages
    LOCALES.forEach(lang => {
        const url = `${DOMAIN}/${lang}`;
        xml += `  <url>\n`;
        xml += `    <loc>${url}</loc>\n`;
        LOCALES.forEach(altLang => {
            xml += `    <xhtml:link rel="alternate" hreflang="${altLang}" href="${DOMAIN}/${altLang}" />\n`;
        });
        xml += `    <priority>1.0</priority>\n`;
        xml += `  </url>\n`;
    });

    // 2. Product Pages
    PRODUCT_SLUGS.forEach(slug => {
        LOCALES.forEach(lang => {
            const url = `${DOMAIN}/${lang}/products/${slug}`;
            xml += `  <url>\n`;
            xml += `    <loc>${url}</loc>\n`;
            LOCALES.forEach(altLang => {
                xml += `    <xhtml:link rel="alternate" hreflang="${altLang}" href="${DOMAIN}/${altLang}/products/${slug}" />\n`;
            });
            xml += `    <priority>0.8</priority>\n`;
            xml += `  </url>\n`;
        });
    });

    xml += `</urlset>`;

    const outputPath = path.join(process.cwd(), 'public', 'sitemap.xml');
    fs.writeFileSync(outputPath, xml);
    console.log(`✅ Sitemap generated at ${outputPath}`);
}

generateSitemap();

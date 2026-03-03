const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '..', 'public', 'locales');
const languages = ['en', 'uk', 'de', 'es', 'fr', 'it', 'cs', 'sk', 'ro', 'hu', 'pt', 'lt', 'lv', 'et', 'hr', 'sr', 'sl', 'bg', 'el', 'nl', 'sv', 'fi', 'no', 'da'];

const translations = {
    en: { infakt_api_key: "InFakt API Key", stripe_title: "Stripe Payments", stripe_publishable: "Stripe Publishable Key", stripe_secret: "Stripe Secret Key" },
    es: { infakt_api_key: "Clave API de InFakt", stripe_title: "Pagos con Stripe", stripe_publishable: "Clave pública de Stripe", stripe_secret: "Clave secreta de Stripe" },
    de: { infakt_api_key: "InFakt API-Key", stripe_title: "Stripe-Zahlungen", stripe_publishable: "Stripe Publishable Key", stripe_secret: "Stripe Secret Key" },
    fr: { infakt_api_key: "Clé API InFakt", stripe_title: "Paiements Stripe", stripe_publishable: "Clé publique Stripe", stripe_secret: "Clé secrète Stripe" },
    it: { infakt_api_key: "Chiave API InFakt", stripe_title: "Pagamenti Stripe", stripe_publishable: "Chiave pubblica Stripe", stripe_secret: "Chiave segreta Stripe" },
    pt: { infakt_api_key: "Chave API InFakt", stripe_title: "Pagamentos Stripe", stripe_publishable: "Chave pública Stripe", stripe_secret: "Chave secreta Stripe" },
    uk: { infakt_api_key: "API ключ InFakt", stripe_title: "Платежі Stripe", stripe_publishable: "Публічний ключ Stripe", stripe_secret: "Секретний ключ Stripe" },
    sr: { infakt_api_key: "InFakt API ključ", stripe_title: "Stripe plaćanja", stripe_publishable: "Stripe javni ključ", stripe_secret: "Stripe tajni ključ" },
    nl: { infakt_api_key: "InFakt API-sleutel", stripe_title: "Stripe-betalingen", stripe_publishable: "Stripe Publishable Key", stripe_secret: "Stripe Secret Key" }
};

const defaultTrans = { infakt_api_key: "InFakt API Key", stripe_title: "Stripe Payments", stripe_publishable: "Stripe Publishable Key", stripe_secret: "Stripe Secret Key" };

languages.forEach(lang => {
    const adminPath = path.join(localesDir, lang, 'admin.json');
    if (!fs.existsSync(adminPath)) return;

    try {
        const adminData = JSON.parse(fs.readFileSync(adminPath, 'utf8'));

        if (!adminData.adminSettings) adminData.adminSettings = {};
        if (!adminData.adminSettings.taxes) adminData.adminSettings.taxes = {};

        const trans = translations[lang] || defaultTrans;
        Object.assign(adminData.adminSettings.taxes, trans);

        fs.writeFileSync(adminPath, JSON.stringify(adminData, null, 2));
        console.log(`[${lang}] Updated admin.json taxes.`);
    } catch (e) {
        console.log(`[${lang}] Error processing admin.json: ${e.message}`);
    }
});

const fs = require('fs');
const path = require('path');

const localesPath = path.join(__dirname, '..', 'public', 'locales');
const locales = fs.readdirSync(localesPath);

const translations = {
    pl: "Materiały Edukacyjne",
    en: "Educational Materials",
    uk: "Навчальні Матеріали",
    de: "Lehrmaterialien",
    es: "Materiales Educativos",
    fr: "Matériel Pédagogique",
    it: "Materiali Didattici",
    cs: "Vzdělávací materiály",
    sk: "Učebné Materiály",
    ro: "Materiale Educaționale",
    hu: "Oktatási Anyagok",
    pt: "Materiais Educativos",
    lt: "Mokymo priemonės",
    lv: "Mācību materiāli",
    et: "Õppematerjalid",
    hr: "Nastavni materijali",
    sr: "Nastavni materijali",
    sl: "Učna gradiva",
    bg: "Учебни материали",
    el: "Εκπαιδευτικό Υλικό",
    nl: "Educatieve Materialen",
    sv: "Utbildningsmaterial",
    fi: "Oppimateriaalit",
    no: "Undervisningsmateriell",
    da: "Undervisningsmateriale"
};

let fixedCount = 0;

locales.forEach(locale => {
    const commonPath = path.join(localesPath, locale, 'common.json');
    if (fs.existsSync(commonPath)) {
        try {
            let content = fs.readFileSync(commonPath, 'utf8');
            let common = JSON.parse(content);

            let updated = false;

            if (common.brand && common.brand.educationalMaterials) {
                // Check if it's currently hardcoded to Kamila English
                if (common.brand.educationalMaterials === "Kamila English") {
                    const correctTranslation = translations[locale] || "Educational Materials";
                    common.brand.educationalMaterials = correctTranslation;
                    console.log(`[${locale}] Fixed educationalMaterials: ${correctTranslation}`);
                    updated = true;
                }
            }

            // Also check for 'Materiały Edukacyjne' across ALL fields that might have been accidentally changed to 'Kamila English'
            // We'll just do a global string replacement on the JSON if needed for generic texts, but safely.
            const rawContent = JSON.stringify(common, null, 2);
            // Some languages might have "Kamila English" as the brand name (which is fine), 
            // but we need to ensure the `educationalMaterials` key specifically is fixed, which the block above does.

            if (updated) {
                fs.writeFileSync(commonPath, JSON.stringify(common, null, 2));
                fixedCount++;
            }
        } catch (e) {
            console.error(`Error processing ${locale}:`, e);
        }
    }
});

console.log(`Finished fixing ${fixedCount} locales.`);

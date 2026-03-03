const fs = require('fs');
const path = require('path');

const localesDir = path.join(process.cwd(), 'public', 'locales');
const targetFiles = ['common.json', 'shop.json', 'dashboard.json', 'landing.json'];

const translations = {
    'common.json': {
        'nav.materialy': {
            en: 'Materials',
            pt: 'Materiais',
            es: 'Materiales',
            de: 'Materialien',
            fr: 'Matériels',
            it: 'Materiali',
            uk: 'Матеріали',
            cs: 'Materiály',
            sk: 'Materiály',
            ro: 'Materiale',
            hu: 'Anyagok',
            bg: 'Материали',
            el: 'Υλικά',
            et: 'Materjalid',
            hr: 'Materijali',
            lt: 'Medžiagos',
            lv: 'Materiāli',
            sl: 'Materiali',
            sr: 'Materijali'
        }
    },
    'shop.json': {
        'products.productCategories.scenariusze': {
            en: 'Scenarios',
            uk: 'Сценарії',
            de: 'Szenarien',
            fr: 'Scénarios'
        }
        // and more...
    }
};

// Fuller dictionary based on common patterns
const dictionary = {
    'nav': {
        'materialy': { en: 'Materials', pt: 'Materiais', es: 'Materiales', de: 'Materialien', fr: 'Matériels', it: 'Materiali', uk: 'Матеріали' }
    },
    'productCategories': {
        'scenariusze': { en: 'Scenarios', uk: 'Сценарії', de: 'Szenarien', es: 'Escenarios', pt: 'Cenários' },
        'zlobek': { en: 'Nursery', uk: 'Ясла', de: 'Kinderkrippe', es: 'Guardería', pt: 'Creche' },
        'inne': { en: 'Others', uk: 'Інші', de: 'Andere', es: 'Otros', pt: 'Outros' },
        'gry': { en: 'Games', uk: 'Ігри', de: 'Spiele', es: 'Juegos', pt: 'Jogos' }
    }
};

function setNestedValue(obj, keyPath, value) {
    const keys = keyPath.split('.');
    let current = obj;
    for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
}

const locales = fs.readdirSync(localesDir).filter(f => fs.statSync(path.join(localesDir, f)).isDirectory());

locales.forEach(lang => {
    if (lang === 'pl') return;

    targetFiles.forEach(file => {
        const filePath = path.join(localesDir, lang, file);
        if (!fs.existsSync(filePath)) return;

        try {
            const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            let modified = false;

            // Apply nav fixes
            if (file === 'common.json' && dictionary.nav.materialy[lang]) {
                setNestedValue(data, 'nav.materialy', dictionary.nav.materialy[lang]);
                modified = true;
            }

            // Apply category fixes
            if (file === 'shop.json') {
                Object.keys(dictionary.productCategories).forEach(cat => {
                    if (dictionary.productCategories[cat][lang]) {
                        setNestedValue(data, `products.productCategories.${cat}`, dictionary.productCategories[cat][lang]);
                        modified = true;
                    }
                });
            }

            if (modified) {
                fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
                console.log(`[${lang}] Updated ${file}`);
            }
        } catch (e) {
            console.log(`[${lang}] Error updating ${file}: ${e.message}`);
        }
    });
});

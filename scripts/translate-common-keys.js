const fs = require('fs');
const path = require('path');

const localesDir = path.join(process.cwd(), 'public', 'locales');
const targetFile = 'admin.json';

const translations = {
    'channels': {
        en: 'Sales Channels',
        pt: 'Canais de Venda',
        es: 'Canales de Venta',
        de: 'Verkaufskanäle',
        fr: 'Canaux de vente',
        it: 'Canali di vendita',
        uk: 'Канали продажу',
        bg: 'Канали за продажба',
        cs: 'Prodejní kanály',
        el: 'Κανάλια πωλήσεων',
        et: 'Müügikanalid',
        hr: 'Prodajni kanali',
        hu: 'Értékesítési csatornák',
        lt: 'Pardavimo kanalai',
        lv: 'Pārdošanas kanāli',
        ro: 'Canale de vânzare',
        sk: 'Predajné kanály',
        sl: 'Prodajni kanali',
        sr: 'Kanali prodaje'
    },
    'paidAt': {
        en: 'Paid at: {date}',
        pt: 'Pago em: {date}',
        es: 'Pagado el: {date}',
        de: 'Bezahlt am: {date}',
        fr: 'Payé le : {date}',
        it: 'Pagato il: {date}',
        uk: 'Оплачено: {date}',
        bg: 'Платено на: {date}',
        cs: 'Zaplaceno dne: {date}',
        el: 'Πληρώθηκε στις: {date}',
        et: 'Makstud: {date}',
        hr: 'Plaćeno: {date}',
        hu: 'Fizetve: {date}',
        lt: 'Sumokėta: {date}',
        lv: 'Apmaksāts: {date}',
        ro: 'Plătit la: {date}',
        sk: 'Zaplatené dňa: {date}',
        sl: 'Plačano dne: {date}',
        sr: 'Plaćeno: {date}'
    },
    'discount': {
        en: 'Discount',
        pt: 'Desconto',
        es: 'Descuento',
        de: 'Rabatt',
        fr: 'Remise',
        it: 'Sconto',
        uk: 'Знижка',
        bg: 'Отстъпка',
        cs: 'Sleva',
        el: 'Έκπτωση',
        et: 'Allahindlus',
        hr: 'Popust',
        hu: 'Kedvezmény',
        lt: 'Nuolaida',
        lv: 'Atlaide',
        ro: 'Reducere',
        sk: 'Zľava',
        sl: 'Popust',
        sr: 'Popust'
    },
    'total': {
        en: 'Total',
        pt: 'Total',
        es: 'Total',
        de: 'Gesamt',
        fr: 'Total',
        it: 'Totale',
        uk: 'Разом',
        bg: 'Общо',
        cs: 'Celkem',
        el: 'Σύνολο',
        et: 'Kokku',
        hr: 'Ukupno',
        hu: 'Összesen',
        lt: 'Iš viso',
        lv: 'Kopā',
        ro: 'Total',
        sk: 'Celkom',
        sl: 'Skupaj',
        sr: 'Ukupno'
    },
    'usage': {
        en: 'Usage',
        pt: 'Uso',
        es: 'Uso',
        de: 'Nutzung',
        fr: 'Utilisation',
        it: 'Utilizzo',
        uk: 'Використання',
        bg: 'Употреба',
        cs: 'Použití',
        el: 'Χρήση',
        et: 'Kasutamine',
        hr: 'Korištenje',
        hu: 'Használat',
        lt: 'Naudojimas',
        lv: 'Lietošana',
        ro: 'Utilizare',
        sk: 'Použitie',
        sl: 'Uporaba',
        sr: 'Upotreba'
    },
    'expires': {
        en: 'Expires',
        pt: 'Expira',
        es: 'Expira',
        de: 'Läuft ab',
        fr: 'Expire',
        it: 'Scade',
        uk: 'Закінчується',
        bg: 'Изтича',
        cs: 'Vyprší',
        el: 'Λήγει',
        et: 'Aegub',
        hr: 'Istječe',
        hu: 'Lejár',
        lt: 'Baigiasi',
        lv: 'Beidzas',
        ro: 'Expiră',
        sk: 'Vyprší',
        sl: 'Poteče',
        sr: 'Ističe'
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

    const langPath = path.join(localesDir, lang, targetFile);
    if (!fs.existsSync(langPath)) return;

    try {
        const langData = JSON.parse(fs.readFileSync(langPath, 'utf8'));

        if (translations.channels[lang]) setNestedValue(langData, 'adminSettings.tabs.channels', translations.channels[lang]);
        if (translations.paidAt[lang]) setNestedValue(langData, 'adminPanel.orders.details.paidAt', translations.paidAt[lang]);
        if (translations.discount[lang]) setNestedValue(langData, 'adminPanel.orders.details.discount', translations.discount[lang]);
        if (translations.total[lang]) setNestedValue(langData, 'adminPanel.orders.details.total', translations.total[lang]);
        if (translations.discount[lang]) setNestedValue(langData, 'adminPanel.coupons.table.discount', translations.discount[lang]);
        if (translations.usage[lang]) setNestedValue(langData, 'adminPanel.coupons.table.usage', translations.usage[lang]);
        if (translations.expires[lang]) setNestedValue(langData, 'adminPanel.coupons.table.expires', translations.expires[lang]);

        fs.writeFileSync(langPath, JSON.stringify(langData, null, 2), 'utf8');
        console.log(`[${lang}] Translated common keys`);
    } catch (e) {
        console.log(`[${lang}] Error translating: ${e.message}`);
    }
});

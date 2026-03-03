const fs = require('fs');
const path = require('path');
const file = path.join(process.cwd(), 'public', 'locales', 'pl', 'admin.json');
try {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));

    // Updates
    if (!data.adminSettings) data.adminSettings = {};

    // Gamification
    if (!data.adminSettings.gamification) data.adminSettings.gamification = {};
    data.adminSettings.gamification.badges_title = "Odznaki i Osiągnięcia";

    // Market
    if (!data.adminSettings.market) data.adminSettings.market = {};
    if (!data.adminSettings.market.curriculum) data.adminSettings.market.curriculum = {};
    data.adminSettings.market.curriculum.monitor_label = "Monitorowana Podstawa Programowa";

    // Interactive
    if (!data.adminSettings.interactive) data.adminSettings.interactive = {};
    if (!data.adminSettings.interactive.platforms) data.adminSettings.interactive.platforms = {};
    data.adminSettings.interactive.platforms.sync_title = "Synchronizacja Wordwall & Genially";

    // Google
    if (!data.adminSettings.google) data.adminSettings.google = {};
    if (!data.adminSettings.google.drive) data.adminSettings.google.drive = {};
    data.adminSettings.google.drive.description = "Przeglądaj pliki PDF i ZIP gotowe do importu";

    // Economy
    if (!data.adminSettings.economy) data.adminSettings.economy = {};
    if (!data.adminSettings.economy.wallet) data.adminSettings.economy.wallet = {};
    data.adminSettings.economy.wallet.description = "Zarządzaj wirtualnym portfelem klientów";

    if (!data.adminSettings.economy.loyalty) data.adminSettings.economy.loyalty = {};
    data.adminSettings.economy.loyalty.description = "Punkty za aktywność i zakupy";
    data.adminSettings.economy.loyalty.protip = "Pro-tip: Subskrybenci mogą otrzymywać 2x więcej punktów, jeśli włączysz mnożnik w sekcji Grywalizacja.";

    if (!data.adminSettings.gamification.perks) data.adminSettings.gamification.perks = {};
    data.adminSettings.gamification.perks.hidden_tier = "Odblokuj ukryty cennik + 2x punkty";
    data.adminSettings.gamification.perks.auto_discount = "Automatyczny rabat przy koszyku";
    data.adminSettings.gamification.perks.discount = "Stały rabat (%)";

    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
    console.log('Updated pl/admin.json');
} catch (e) {
    console.error('Error updating pl/admin.json:', e);
}

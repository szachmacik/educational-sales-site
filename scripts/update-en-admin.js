const fs = require('fs');
const path = require('path');
const file = path.join(process.cwd(), 'public', 'locales', 'en', 'admin.json');
try {
    let data = {};
    if (fs.existsSync(file)) {
        data = JSON.parse(fs.readFileSync(file, 'utf8'));
    }

    // Updates
    if (!data.adminSettings) data.adminSettings = {};

    // Gamification
    if (!data.adminSettings.gamification) data.adminSettings.gamification = {};
    data.adminSettings.gamification.badges_title = "Badges & Achievements";

    // Market
    if (!data.adminSettings.market) data.adminSettings.market = {};
    if (!data.adminSettings.market.curriculum) data.adminSettings.market.curriculum = {};
    data.adminSettings.market.curriculum.monitor_label = "Monitored Curriculum";

    // Interactive
    if (!data.adminSettings.interactive) data.adminSettings.interactive = {};
    if (!data.adminSettings.interactive.platforms) data.adminSettings.interactive.platforms = {};
    data.adminSettings.interactive.platforms.sync_title = "Wordwall & Genially Sync";

    // Google
    if (!data.adminSettings.google) data.adminSettings.google = {};
    if (!data.adminSettings.google.drive) data.adminSettings.google.drive = {};
    data.adminSettings.google.drive.description = "Browse PDF and ZIP files ready for import";

    // Economy
    if (!data.adminSettings.economy) data.adminSettings.economy = {};
    if (!data.adminSettings.economy.wallet) data.adminSettings.economy.wallet = {};
    data.adminSettings.economy.wallet.description = "Manage customer virtual wallet";

    if (!data.adminSettings.economy.loyalty) data.adminSettings.economy.loyalty = {};
    data.adminSettings.economy.loyalty.description = "Points for activity and purchases";
    data.adminSettings.economy.loyalty.protip = "Pro-tip: Subscribers can receive 2x more points if you enable the multiplier in the Gamification section.";

    if (!data.adminSettings.gamification.perks) data.adminSettings.gamification.perks = {};
    data.adminSettings.gamification.perks.hidden_tier = "Unlock Hidden Pricing Tier + 2x Points";
    data.adminSettings.gamification.perks.auto_discount = "Automatic cart discount";
    data.adminSettings.gamification.perks.discount = "Flat discount (%)";

    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
    console.log('Updated en/admin.json');
} catch (e) {
    console.error('Error updating en/admin.json:', e);
}

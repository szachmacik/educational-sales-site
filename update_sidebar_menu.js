const fs = require('fs');
const path = require('path');

const plPath = "C:\\Users\\kamil\\.gemini\\antigravity\\scratch\\educational-sales-site\\public\\locales\\pl\\admin.json";
const enPath = "C:\\Users\\kamil\\.gemini\\antigravity\\scratch\\educational-sales-site\\public\\locales\\en\\admin.json";

function updateLocale(filePath, menuUpdates) {
    try {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        if (!data.adminPanel) data.adminPanel = {};
        if (!data.adminPanel.sidebar) data.adminPanel.sidebar = {};
        if (!data.adminPanel.sidebar.menu) data.adminPanel.sidebar.menu = {};

        Object.assign(data.adminPanel.sidebar.menu, menuUpdates);

        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        console.log(`Successfully updated ${path.basename(filePath)}`);
    } catch (error) {
        console.error(`Error updating ${filePath}:`, error);
        process.exit(1);
    }
}

const plMenu = {
    "abandoned": "Porzucone Koszyki",
    "offers": "Generator Ofert",
    "workshop": "AI Creative Suite",
    "landing_builder": "Landing Pages"
};

const enMenu = {
    "abandoned": "Abandoned Carts",
    "offers": "Offer Generator",
    "workshop": "AI Creative Suite",
    "landing_builder": "Landing Pages"
};

updateLocale(plPath, plMenu);
updateLocale(enPath, enMenu);

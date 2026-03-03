const fs = require('fs');
const path = require('path');

const localesDir = path.join(process.cwd(), 'public', 'locales');
const targetFile = 'admin.json';
const lang = 'en';

const translations = {
    adminPanel: {
        sidebar: {
            title: "AdminPanel",
            subtitle: "Creative Studio",
            expand: "Expand",
            collapse: "Collapse",
            logout: "Logout Session",
            logoutTooltip: "Logout",
            menu: {
                dashboard: "Dashboard",
                products: "Products",
                orders: "Orders",
                materials: "Materials",
                blog: "Blog",
                settings: "Settings",
                home: "Home Page",
                role: "Administrator",
                online: "Online"
            }
        }
    }
};

const filePath = path.join(localesDir, lang, targetFile);

if (fs.existsSync(filePath)) {
    try {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        if (!data.adminPanel) data.adminPanel = {};
        data.adminPanel.sidebar = translations.adminPanel.sidebar;

        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        console.log(`[${lang}] Updated ${targetFile}`);
    } catch (e) {
        console.error(`[${lang}] Error: ${e.message}`);
    }
} else {
    console.error(`[${lang}] File not found: ${filePath}`);
}

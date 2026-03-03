const fs = require('fs');
const path = require('path');

const localesPath = 'c:/Users/kamil/.gemini/antigravity/scratch/educational-sales-site/public/locales';

const commonMappings = {
    "en": {
        "nav.products": "Products", "nav.materialy": "Materials", "nav.blog": "Blog", "nav.contact": "Contact", "nav.login": "Login", "nav.dashboard": "Dashboard",
        "hero.badge": "Materials for Teachers", "hero.title": "Teach English with Passion and Ease", "hero.cta_main": "Browse materials", "hero.cta_secondary": "About author",
        "footer.rights": "All rights reserved.", "footer.groups.shop": "Shop", "footer.groups.info": "Information", "footer.groups.help": "Help",
        "cart.empty": "Your cart is empty", "cart.total": "Total", "cart.checkout": "Proceed to checkout",
        "checkout.nip": "VAT ID / Tax No.", "checkout.companyName": "Company Name", "checkout.companyAddress": "Company Address", "checkout.nipError": "Enter valid Tax ID",
        "checkout.successTitle": "Thank you for your order!", "checkout.successOrder": "Your order #{orderNumber} has been received.",
        "contact.title": "Get in touch", "contact.form.send": "Send Message",
        "login.title": "Welcome back!", "login.submit": "Log In", "login.email": "Email", "login.password": "Password",
        "common.loading": "Loading...", "quickSale.title": "QUICK PAYMENT", "verify.title": "Certificate Verification"
    },
    "es": {
        "nav.products": "Productos", "nav.materialy": "Materiales", "nav.blog": "Blog", "nav.contact": "Contacto", "nav.login": "Acceso", "nav.dashboard": "Panel",
        "hero.badge": "Materiales para Profesores", "hero.title": "Enseña Inglés con Pasión y Facilidad", "hero.cta_main": "Ver materiales", "hero.cta_secondary": "Sobre la autora",
        "footer.rights": "Todos los derechos reservados.", "footer.groups.shop": "Tienda", "footer.groups.info": "Información", "footer.groups.help": "Ayuda",
        "cart.empty": "Tu carrito está vacío", "cart.total": "Total", "cart.checkout": "Pasar por caja",
        "checkout.nip": "NIF / CIF", "checkout.companyName": "Nombre de la empresa", "checkout.companyAddress": "Dirección de la empresa",
        "checkout.successTitle": "¡Gracias por tu pedido!", "contact.title": "Ponte en contacto", "contact.form.send": "Enviar mensaje"
    },
    "de": {
        "nav.products": "Produkte", "nav.materialy": "Materialien", "nav.blog": "Blog", "nav.contact": "Kontakt", "nav.login": "Anmelden", "nav.dashboard": "Dashboard",
        "hero.badge": "Materialien für Lehrer", "hero.title": "Englisch mit Leidenschaft unterrichten", "hero.cta_main": "Materialien durchsuchen",
        "footer.rights": "Alle Rechte vorbehalten.", "cart.empty": "Dein Warenkorb ist leer", "cart.total": "Gesamt", "cart.checkout": "Zur Kasse",
        "checkout.successTitle": "Vielen Dank für deine Bestellung!", "contact.title": "Kontaktieren Sie uns"
    },
    "fr": {
        "nav.products": "Produits", "nav.materialy": "Matériels", "nav.blog": "Blog", "nav.contact": "Contact", "nav.login": "Connexion", "nav.dashboard": "Tableau de bord",
        "hero.badge": "Matériel pour enseignants", "hero.title": "Enseigner l'anglais avec passion", "hero.cta_main": "Parcourir les produits",
        "footer.rights": "Tous droits réservés.", "cart.empty": "Votre panier est vide", "cart.total": "Total", "cart.checkout": "Commander",
        "checkout.successTitle": "Merci pour votre commande !", "contact.title": "Contactez-nous"
    }
};

const shopMappings = {
    "en": {
        "shop.header": "Materials Store", "shop.search": "Search", "shop.found": "Found {count} products", "shop.add": "Add", "shop.added": "Added to cart",
        "products.addToCart": "Add to cart", "products.description": "Product Description", "products.whatsIncluded": "What is included?", "products.pdfInfo": "You will receive print-ready PDF files"
    }
};

function deepSet(obj, path, value) {
    const parts = path.split('.');
    let current = obj;
    for (let i = 0; i < parts.length - 1; i++) {
        if (!current[parts[i]]) current[parts[i]] = {};
        current = current[parts[i]];
    }
    current[parts[parts.length - 1]] = value;
}

const locales = fs.readdirSync(localesPath).filter(d => {
    const fullPath = path.join(localesPath, d);
    return fs.statSync(fullPath).isDirectory() && d !== 'pl';
});

const files = ['common.json', 'landing.json', 'dashboard.json', 'shop.json'];

for (const locale of locales) {
    for (const file of files) {
        const filePath = path.join(localesPath, locale, file);
        if (!fs.existsSync(filePath)) continue;

        let json = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        let mappings = {};

        if (file === 'common.json') mappings = commonMappings[locale] || commonMappings['en'];
        if (file === 'shop.json') mappings = shopMappings[locale] || shopMappings['en'];

        // For simple keys
        for (const [p, v] of Object.entries(mappings)) {
            deepSet(json, p, v);
        }

        // Special logic for landing.json arrays
        if (file === 'landing.json' && (!json.features || !json.features.items || json.features.items.length === 0)) {
            json.features = json.features || {};
            json.features.items = [
                { "title": locale === 'en' ? "Instant access" : "Acceso/Zugang/Accès", "desc": "Download immediately" }
            ];
        }

        // Final Polish string check (cleanup)
        let content = JSON.stringify(json, null, 2);
        // Replace address if still Polish
        content = content.replace(/Warszawa, ul. Edukacyjna 123/g, "London, Education St 123");
        // Replace Jan Kowalski with John Doe
        content = content.replace(/Jan Kowalski/g, "John Doe");

        fs.writeFileSync(filePath, content);
    }
}

console.log('Global translation fix applied to all files & locales.');


import fs from 'fs';
import path from 'path';
import { PRODUCTS, CATEGORY_COLORS } from '../lib/product-catalog';

const DATA_DIR = path.join(process.cwd(), 'lib', 'data');

if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

console.log(`Processing ${PRODUCTS.length} products...`);

// 1. Process Products
const products = PRODUCTS.map((p, index) => {
    const pricePLN = parseFloat(p.price);
    const priceEUR = parseFloat((pricePLN / 4.3).toFixed(2));

    return {
        id: `prod-${index + 1}`, // Generate a stable ID
        ...p,
        price: pricePLN, // overwrite string with number for consistency in JSON
        pricePLN,
        priceEUR,
    };
});

// 2. Process Categories
const categories = Object.entries(CATEGORY_COLORS).map(([slug, color]) => {
    // Basic capitalization
    const name = slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    return {
        id: slug,
        slug,
        name,
        color
    };
});

// 3. Process Users
const users = [
    {
        id: "usr_admin",
        name: "Admin User",
        email: "admin@kamila.shor.dev",
        role: "admin",
        passwordHash: "$2b$10$EpOku.k7A/1Zj5n4vj.u..C7A.z/...", // placeholder
        isAdmin: true
    },
    {
        id: "usr_std",
        name: "Demo Teacher",
        email: "user@kamila.shor.dev",
        role: "user",
        passwordHash: "$2b$10$EpOku.k7A/1Zj5n4vj.u..C7A.z/...",
        isAdmin: false,
        purchasedProducts: []
    }
];

// Write files
const productsPath = path.join(DATA_DIR, 'products.json');
const categoriesPath = path.join(DATA_DIR, 'categories.json');
const usersPath = path.join(DATA_DIR, 'users.json');

fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
console.log(`Exported products to ${productsPath}`);

fs.writeFileSync(categoriesPath, JSON.stringify(categories, null, 2));
console.log(`Exported categories to ${categoriesPath}`);

fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
console.log(`Exported users to ${usersPath}`);

console.log("Data export completed successfully.");

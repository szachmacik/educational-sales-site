
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../lib/linguachess-products.ts');
const content = fs.readFileSync(filePath, 'utf8');

// Replace category: "value" with categories: ["value"]
// Only if it matches the pattern exactly, to avoid double replacement if I ran it before (though I didn't successfully)
// And we should ensure we don't mess up the interface definition if it's there (but interface uses type definition, not value assignment)

let newContent = content.replace(/category:\s*"([^"]+)"/g, 'categories: ["$1"]');

// Safety check: The interface definition might have been "category: string" -> "categories: string[]"
// My previous tool call updated the interface manually.
// So this regex should specifically target the DATA objects.
// The data objects look like: category: "mega-pack",
// The interface looks like: category: string; (or I changed it to categories: string[])

// If I already changed the interface to `categories: string[]`, then `category: string` is gone from interface.
// But wait, if I used REPLACE on the file content, I changed the interface.
// So I just need to fix the data.

fs.writeFileSync(filePath, newContent);
console.log("Migrated categories successfully.");

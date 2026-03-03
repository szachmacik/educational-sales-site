const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'lib', 'product-translations-data.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Fix the nested pt issue
// Case 1: pt is inside en (missing closing brace for en)
content = content.replace(/(description: "[^"]*")\s+pt: { title: "([^"]+)", description: "([^"]+)" },},/g, '$1 },\n        pt: { title: "$2", description: "$3" },');

// Case 2: Just in case it happened with pl or others
content = content.replace(/(description: '[^']*')\s+pt: { title: "([^"]+)", description: "([^"]+)" },},/g, "$1 },\n        pt: { title: '$2', description: '$3' },");

fs.writeFileSync(filePath, content, 'utf8');
console.log("Fixed nested pt entries");

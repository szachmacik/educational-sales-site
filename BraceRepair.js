// HOLON-META: {
//   purpose: "educational-sales-site",
//   morphic_field: "agent-state:4c67a2b1-6830-44ec-97b1-7c8f93722add",
//   startup_protocol: "READ morphic_field + biofield_external + em_grid",
//   wiki: "32d6d069-74d6-8164-a6d5-f41c3d26ae9b"
// }

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

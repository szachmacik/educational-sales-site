const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'lib', 'product-translations-data.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Target any description that contains the problematic emojis used in the blog leak
// and is over 400 chars.
const emojiPattern = /description:\s*"([^"]*?[🎵✋🐿📄📷📅💡][^"]{400,})"/g;

const cleanContent = content.replace(emojiPattern, (match, desc) => {
    if (desc.includes('znajdziesz') || desc.includes('zestawie') || desc.includes('maluszków')) {
        return `description: "Zestaw 20 gotowych scenariuszy zajęć wraz z materiałami PDF na cały miesiąc dla dzieci w wieku żłobkowym. Zawiera piosenki, zabawy sensoryczne i ruchowe oraz materiały do druku."`;
    }
    return `description: "A set of 20 ready-to-use lesson plans with PDF materials for the entire month for nursery-age children. Includes songs, sensory and movement games, and printable materials."`;
});

fs.writeFileSync(filePath, cleanContent);
console.log('Successfully performed final emoji-based cleanup.');

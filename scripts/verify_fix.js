const fs = require('fs');
const path = require('path');

const targetFile = path.resolve(__dirname, '../public/locales/pl/admin.json');
const buffer = fs.readFileSync(targetFile);

const lines = buffer.toString('utf8').split('\n');
const searchChars = ['🛒', '🪄', '🚀', '⚙️', '–', '•', '…', '✨', '🎯', '📚', '⭐', '🔍', '🧩', '🖼️', '✍️', '💰'];

lines.forEach((line, i) => {
    if (searchChars.some(char => line.includes(char))) {
        console.log(`Line ${i + 1}: ${line.trim()}`);
        const lineBuffer = Buffer.from(line);
        console.log(`Bytes: ${lineBuffer.toString('hex')}`);
    }
});

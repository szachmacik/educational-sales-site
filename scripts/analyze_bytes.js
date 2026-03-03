const fs = require('fs');
const path = require('path');

const targetFile = path.resolve(__dirname, '../public/locales/pl/admin.json');
const buffer = fs.readFileSync(targetFile);

const lines = buffer.toString('utf8').split('\n');
lines.forEach((line, i) => {
    if (line.includes('ð') || line.includes('â')) {
        console.log(`Line ${i + 1}: ${line.trim()}`);
        const lineBuffer = Buffer.from(line);
        console.log(`Bytes: ${lineBuffer.toString('hex')}`);
    }
});

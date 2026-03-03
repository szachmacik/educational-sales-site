const fs = require('fs');
const path = require('path');

const targetFile = path.resolve(__dirname, '../public/locales/pl/admin.json');

const replacements = [
    { moji: 'c3 b0 c2 9f c2 9b c2 92', fixed: '🛒' },
    { moji: 'c3 b0 c2 9f c2 aa c2 84', fixed: '🪄' },
    { moji: 'c3 b0 c2 9f c2 9a c2 80', fixed: '🚀' },
    { moji: 'c3 a2 c2 9a c2 99 c3 af c2 b8 c2 8f', fixed: '⚙️' },
    { moji: 'c3 a2 c2 80 c2 93', fixed: '–' },
    { moji: 'c3 a2 c2 80 c2 a2', fixed: '•' },
    { moji: 'c3 a2 c2 80 c2 a6', fixed: '…' },
    { moji: 'c3 a2 c2 80 c2 99', fixed: '’' },
    { moji: 'c3 a2 c2 80 c2 9e', fixed: '„' },
    { moji: 'c3 a2 c2 9c c2 a8', fixed: '✨' },
    { moji: 'c3 b0 c2 9f c2 8e c2 af', fixed: '🎯' },
    { moji: 'c3 b0 c2 9f c2 93 c2 9a', fixed: '📚' },
    { moji: 'c3 a2 c2 ad c2 90', fixed: '⭐' },
    { moji: 'c3 b0 c2 9f c2 94 c2 8d', fixed: '🔍' },
    { moji: 'c3 b0 c2 9f c2 a7 c2 a9', fixed: '🧩' },
    { moji: 'c3 b0 c2 9f c2 96 c2 bc c3 af c2 b8 c2 8f', fixed: '🖼️' },
    { moji: 'c3 a2 c2 9c c2 8d c3 af c2 b8 c2 8f', fixed: '✍️' },
    { moji: 'c3 b0 c2 9f c2 92 c2 b0', fixed: '💰' }
];

let buffer = fs.readFileSync(targetFile);

replacements.forEach(r => {
    const from = Buffer.from(r.moji.replace(/ /g, ''), 'hex');
    const to = Buffer.from(r.fixed, 'utf8');

    let index = buffer.indexOf(from);
    while (index !== -1) {
        const newBuffer = Buffer.concat([
            buffer.slice(0, index),
            to,
            buffer.slice(index + from.length)
        ]);
        buffer = newBuffer;
        index = buffer.indexOf(from, index + to.length);
    }
});

fs.writeFileSync(targetFile, buffer);
console.log('Targeted fix applied to pl/admin.json');

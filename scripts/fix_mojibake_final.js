const fs = require('fs');
const path = require('path');

const targetFile = path.resolve(__dirname, '../public/locales/pl/admin.json');
const backupFile = targetFile + '.bak';

if (!fs.existsSync(targetFile)) {
    console.error(`File not found: ${targetFile}`);
    process.exit(1);
}

// 1. Read the corrupted UTF-8 file
const corruptedBuffer = fs.readFileSync(targetFile);
const corruptedString = corruptedBuffer.toString('utf8');

// 2. Convert the string back to bytes using 'latin1' mapping
// This reverses the accidental "read as latin1, write as utf8" mistake
const fixedBuffer = Buffer.from(corruptedString, 'latin1');

// 3. Verify if the result is valid UTF-8 and contains the expected emojis
try {
    const finalString = fixedBuffer.toString('utf8');
    if (finalString.includes('🛒') || finalString.includes('🚀') || finalString.includes('–')) {
        console.log('Success! Detected recovered characters.');

        // Backup before writing
        fs.copyFileSync(targetFile, backupFile);

        fs.writeFileSync(targetFile, fixedBuffer);
        console.log(`Successfully fixed encoding in ${targetFile}`);
        console.log(`Backup created at ${backupFile}`);
    } else {
        console.log('Recovery check failed: recovered string does not seem to contain expected characters.');
        // Let's print a sample to see what happened
        console.log('Sample recovered:', finalString.substring(0, 100));
    }
} catch (e) {
    console.error('Failed to decode recovered buffer as UTF-8:', e.message);
}

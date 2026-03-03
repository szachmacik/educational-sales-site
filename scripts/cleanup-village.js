const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

const targetDirs = ['app', 'components'];

targetDirs.forEach(targetDir => {
    const fullPath = path.join(process.cwd(), targetDir);
    if (fs.existsSync(fullPath)) {
        walkDir(fullPath, (filePath) => {
            if (filePath.endsWith('.tsx') || filePath.endsWith('.ts') || filePath.endsWith('.js')) {
                let content = fs.readFileSync(filePath, 'utf8');
                if (content.includes('village')) {
                    // Remove 'village' and any trailing whitespace/newlines
                    let newContent = content.replace(/village\s*$/g, '');
                    // Also check for 'village' followed by nothing
                    newContent = newContent.replace(/village$/g, '');

                    if (content !== newContent) {
                        fs.writeFileSync(filePath, newContent, 'utf8');
                        console.log(`✅ Fixed: ${filePath}`);
                    }
                }
            }
        });
    }
});

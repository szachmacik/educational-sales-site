const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const PRODUCTS_DIR = path.join(__dirname, '..', 'public', 'products');
const CATALOG_PATH = path.join(__dirname, '..', 'lib', 'product-catalog.ts');

if (!fs.existsSync(PRODUCTS_DIR)) {
    fs.mkdirSync(PRODUCTS_DIR, { recursive: true });
}

const catalogContent = fs.readFileSync(CATALOG_PATH, 'utf8');

// Match ALL image values (local or external)
const imageRegex = /image:\s*["'](https?:\/\/(?:www\.sklep\.kamilaenglish\.com|www\.sklep\.linguachess\.com|http:\/\/www\.sklep\.kamilaenglish\.com|http:\/\/www\.sklep\.linguachess\.com)[^"']+)["']/g;

// Also match http:// variant
const imageRegex2 = /image:\s*["']((?:https?:\/\/)[^"']+)["']/g;

const images = [];
let match;
const seen = new Set();

while ((match = imageRegex2.exec(catalogContent)) !== null) {
    const originalUrl = match[1];
    if (seen.has(originalUrl)) continue;
    seen.add(originalUrl);

    // Build the URL to actually download from (swap domain to linguachess)
    let downloadUrl = originalUrl
        .replace('www.sklep.kamilaenglish.com', 'www.sklep.linguachess.com')
        .replace('http://www.sklep.linguachess.com', 'https://www.sklep.linguachess.com');

    // Generate local filename from URL path
    const urlPath = originalUrl.replace(/^https?:\/\/[^/]+/, '');
    const originalName = path.basename(urlPath.split('?')[0]);
    const ext = path.extname(originalName) || '.png';
    const baseName = path.basename(originalName, ext).replace(/[^a-z0-9._-]/gi, '_').slice(0, 80);
    const localName = `${baseName}${ext}`;
    const localPath = path.join(PRODUCTS_DIR, localName);

    images.push({ originalUrl, downloadUrl, localName, localPath });
}

console.log(`Found ${images.length} unique external images to download.`);

function download(url, dest) {
    return new Promise((resolve) => {
        if (fs.existsSync(dest) && fs.statSync(dest).size > 1000) {
            console.log(`  [SKIP] ${path.basename(dest)}`);
            return resolve(dest);
        }
        const proto = url.startsWith('https') ? https : http;
        const file = fs.createWriteStream(dest);
        const req = proto.get(url, { timeout: 15000 }, (res) => {
            if (res.statusCode === 301 || res.statusCode === 302) {
                file.destroy();
                try { fs.unlinkSync(dest); } catch (e) { }
                return download(res.headers.location, dest).then(resolve);
            }
            if (res.statusCode !== 200) {
                file.destroy();
                try { fs.unlinkSync(dest); } catch (e) { }
                console.log(`  [FAIL ${res.statusCode}] ${path.basename(dest)}`);
                return resolve(null);
            }
            res.pipe(file);
            file.on('finish', () => { file.close(); console.log(`  [OK] ${path.basename(dest)}`); resolve(dest); });
            file.on('error', (e) => { try { fs.unlinkSync(dest); } catch (_) { } console.log(`  [ERR-W] ${e.message}`); resolve(null); });
        });
        req.on('error', (e) => {
            try { fs.unlinkSync(dest); } catch (_) { }
            console.log(`  [ERR] ${url.split('/').slice(-1)[0]}: ${e.message}`);
            resolve(null);
        });
        req.on('timeout', () => { req.destroy(); resolve(null); });
    });
}

async function run() {
    let ok = 0, fail = 0;
    for (const img of images) {
        const result = await download(img.downloadUrl, img.localPath);
        if (result) ok++; else fail++;
    }
    console.log(`\nDownloaded: ${ok}, Failed/Skipped: ${fail}`);

    // Update catalog to use local paths
    let updated = catalogContent;
    let replaced = 0;
    for (const img of images) {
        if (fs.existsSync(img.localPath) && fs.statSync(img.localPath).size > 1000) {
            const localRef = `/products/${img.localName}`;
            const escaped = img.originalUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const before = updated;
            updated = updated.replace(new RegExp(escaped, 'g'), localRef);
            if (updated !== before) replaced++;
        }
    }
    fs.writeFileSync(CATALOG_PATH, updated, 'utf8');
    console.log(`✅ Updated ${replaced} image paths in product-catalog.ts.`);
}

run().catch(console.error);

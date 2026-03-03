const chokidar = require('chokidar');
const path = require('path');
const { execSync } = require('child_process');
require('dotenv').config({ path: path.join(__dirname, '../mcp-integrations/.env') });

/**
 * AUTONOMOUS AGENT SYNC
 * Ten skrypt działa w tle i automatycznie wysyła zmiany do GitHub.
 * Pozwala Manusowi i Antigravity współpracować bez Twojej ingerencji.
 */

const WORKSPACE_DIR = path.resolve(__current_dir, '..');
const BRAIN_DIR = path.join(WORKSPACE_DIR, 'brain');

console.log("🤖 [Autonomous Collab] Monitorowanie zmian w:", BRAIN_DIR);

// Inicjalizacja obserwatora
const watcher = chokidar.watch(BRAIN_DIR, {
    ignored: /(^|[\/\\])\../, // ignore dotfiles
    persistent: true
});

let isSyncing = false;

watcher.on('change', async (filePath) => {
    if (isSyncing) return;
    isSyncing = true;

    console.log(`📝 Wykryto zmianę: ${path.basename(filePath)}`);

    try {
        console.log("🚀 Automatyczna synchronizacja z GitHub...");

        // Używamy Git zainstalowanego w systemie
        execSync('git add .', { cwd: WORKSPACE_DIR });
        execSync(`git commit -m "Autonomous Sync: Update ${path.basename(filePath)}"`, { cwd: WORKSPACE_DIR });
        execSync('git push origin main', { cwd: WORKSPACE_DIR });

        console.log("✅ Synchronizacja zakończona pomyślnie.");
    } catch (error) {
        console.error("⚠️ Błąd auto-sync (może brakować tokena lub repozytorium):", error.message);
    }

    setTimeout(() => { isSyncing = false; }, 5000); // Debounce
});

console.log("👀 Czekam na zmiany... (Skrypt działa w tle)");

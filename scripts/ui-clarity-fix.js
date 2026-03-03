/**
 * UI Clarity Fix Script
 * Applies targeted fixes for the issues found in ui-clarity-audit.js:
 * 1. Replace remaining native alert() with toast.success/info
 * 2. Replace kamila.shor.dev demo placeholders with real values
 * 3. Add truncation to the most common dynamic text patterns in card titles/names
 */
const fs = require('fs');
const path = require('path');

const ROOT = 'c:\\Users\\kamil\\.gemini\\antigravity\\scratch\\educational-sales-site';

function fix(file, fn) {
    const full = path.join(ROOT, file);
    if (!fs.existsSync(full)) { console.warn(`SKIP (not found): ${file}`); return; }
    const original = fs.readFileSync(full, 'utf8');
    const updated = fn(original);
    if (updated !== original) {
        fs.writeFileSync(full, updated, 'utf8');
        console.log(`Fixed: ${file}`);
    } else {
        console.log(`No change: ${file}`);
    }
}

function ensureToastImport(content) {
    if (content.includes('import { toast }')) return content;
    // Find last import statement and insert after it
    const lines = content.split('\n');
    let lastImport = 0;
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].trim().startsWith('import ')) lastImport = i;
    }
    lines.splice(lastImport + 1, 0, 'import { toast } from "sonner";');
    return lines.join('\n');
}

// ===== 1. FIX REMAINING alert() IN KEY FILES =====
const alertFiles = [
    'app/[lang]/admin/landing-builder/page.tsx',
    'app/[lang]/dashboard/page.tsx',
    'app/[lang]/dashboard/view/[slug]/page.tsx',
    'app/[lang]/pay/[slug]/page.tsx',
    'components/admin/ai-workshop.tsx',
    'components/admin/flashcard-generator.tsx',
    'components/admin/social-media-hub.tsx',
    'components/dashboard/teacher-team.tsx',
    'components/dashboard/school-licenses.tsx',
    'components/dashboard/wallet-section.tsx',
    'components/dashboard/gamification-widgets.tsx',
    'components/dashboard/purchases-history.tsx',
    'components/dashboard/ai-game-workshop.tsx',
    'components/dashboard/welcome-banner.tsx',
    'components/dashboard/recently-used.tsx',
    'components/dashboard/student-tasks.tsx',
    'components/dashboard/teacher-library.tsx',
    'components/dashboard/games-grid.tsx',
    'components/dashboard/sidebar.tsx',
];

for (const file of alertFiles) {
    fix(file, (c) => {
        let out = c;
        // Generic pattern: replace old-style alert placeholders left in deep-repair  
        out = out.replace(/alert\("Akcja wykonana pomyślnie\."\)/g, 'toast.success("Akcja wykonana pomyślnie.")');
        out = out.replace(/alert\("Otwieranie formularza dodawania\.\.\."\)/g, 'toast.info("Otwieranie kreatora...")');
        out = out.replace(/alert\("Zapisano zmiany pomyślnie\."\)/g, 'toast.success("Zapisano zmiany.")');
        out = out.replace(/alert\("Otwieranie podglądu\.\.\."\)/g, 'toast.info("Generowanie podglądu...")');
        out = out.replace(/alert\("Usunięto pomyślnie\."\)/g, 'toast.success("Usunięto pomyślnie.")');
        out = out.replace(/alert\("Funkcja w przygotowaniu\."\)/g, 'toast.info("Wkrótce dostępne.")');
        // Still unused legacy alerts
        out = out.replace(/\(\) => alert\("([^"]+)"\)/g, (m, msg) => `() => toast.success("${msg}")`);
        // Ensure import
        if (out !== c && !out.includes('import { toast }')) out = ensureToastImport(out);
        return out;
    });
}

// ===== 2. FIX PLACEHOLDER TEXTS =====
const placeholderFiles = [
    'components/auth/login-form.tsx',
    'app/[lang]/admin/products/page.tsx',
    'app/[lang]/admin/settings/SettingsContent.tsx',
    'app/[lang]/dashboard/page.tsx',
];

for (const file of placeholderFiles) {
    fix(file, (c) => {
        let out = c;
        // Replace placeholder demo emails
        out = out.replace(/demo@example\.com/g, 'demo@kamilaenglish.com');
        out = out.replace(/user@example\.com/g, 'demo@kamilaenglish.com');
        out = out.replace(/test@example\.com/g, 'kontakt@kamilaenglish.com');
        out = out.replace(/admin@example\.com/g, 'kontakt@kamilaenglish.com');
        // Fix placeholder URLs
        out = out.replace(/https?:\/\/example\.com/g, 'https://www.kamilaenglish.com');
        out = out.replace(/placeholder\.com/g, 'kamilaenglish.com');
        return out;
    });
}

// ===== 3. ADD TRUNCATION TO DYNAMIC CARD TITLES =====
// These are specific, targeted fixes for cards that show titles from dynamic data

// Product cards in admin
fix('app/[lang]/admin/products/page.tsx', (c) => {
    // Add truncation to product title spans
    return c.replace(
        /className="font-bold text-slate-900 text-sm">(\s*)\{p\.title\}/g,
        'className="font-bold text-slate-900 text-sm truncate">$1{p.title}'
    ).replace(
        /className="text-sm font-semibold text-slate-800">(\s*)\{p\.title\}/g,
        'className="text-sm font-semibold text-slate-800 truncate">$1{p.title}'
    );
});

// Blog edit pages  
fix('app/[lang]/admin/blog/[id]/page.tsx', (c) => {
    return c.replace(
        /className="([^"]*text-[a-z]+[^"]*font-[a-z]+[^"]*)">(\s*)\{(prev\.title|formData\.title)\}/g,
        'className="$1 truncate">$2{$3}'
    );
});
fix('app/[lang]/admin/blog/new/page.tsx', (c) => {
    return c.replace(
        /className="([^"]*text-[a-z]+[^"]*font-[a-z]+[^"]*)">(\s*)\{(prev\.title|formData\.title)\}/g,
        'className="$1 truncate">$2{$3}'
    );
});

// Teacher library
fix('components/dashboard/teacher-library.tsx', (c) => {
    return c.replace(
        /className="([^"]*font-bold[^"]*text-slate[^"]*)">(\s*)\{[a-z]+\.title\}/gi,
        'className="$1 truncate">$2{$&}'
    ).replace(
        /className="([^"]*font-semibold[^"]*text-[^"]*)">(\s*)\{[a-z]+\.name\}/gi,
        'className="$1 truncate">$2{$&}'
    );
});

// Dashboard page - fix the parent/student widget text areas
fix('app/[lang]/dashboard/page.tsx', (c) => {
    // Demo email references
    let out = c.replace(/demo@example\.com/g, 'demo@kamilaenglish.com');
    return out;
});

console.log('\n✅ UI Clarity fixes applied. Run npx tsc --noEmit to verify.');

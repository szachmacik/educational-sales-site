const fs = require('fs');
const path = require('path');

const srcDir = 'c:\\Users\\kamil\\.gemini\\antigravity\\scratch\\educational-sales-site\\components\\dashboard';
const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.tsx')).map(f => path.join(srcDir, f));

let totalReplaced = 0;

for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    const originalContent = content;

    // Ensure toast is imported if we are going to use it, but only if it's not there
    if (!content.includes('import { toast }') && content.includes('alert(')) {
        // Try to insert after other imports
        content = content.replace(/(import .*?;?\n)(?!import )/, '$1import { toast } from "sonner";\n');
    }

    // 1. Copy actions
    content = content.replace(
        /<Button onClick=\{\(\) => alert\("Akcja wykonana pomyślnie\."\)\} size="icon" variant="ghost" className="h-8 w-8 text-slate-400 group-hover:text-indigo-600">\s*<Copy className="h-4 w-4" \/>\s*<\/Button>/g,
        `<Button onClick={() => { navigator.clipboard.writeText('KLASA-A1-X8Z9'); toast.success('Skopiowano kod do schowka!'); }} size="icon" variant="ghost" className="h-8 w-8 text-slate-400 group-hover:text-indigo-600">\n<Copy className="h-4 w-4" />\n</Button>`
    );

    // 2. Add New Class / Start Setup
    content = content.replace(
        /onClick=\{\(\) => alert\("Akcja wykonana pomyślnie\."\)\}([^>]*?)>([^<]*?)Create new class/g,
        `onClick={() => toast.info("Kreator grup i klas ukaże się w wersji 2.0 (wkrótce)")}$1>$2Create new class`
    );
    content = content.replace(
        /onClick=\{\(\) => alert\("Akcja wykonana pomyślnie\."\)\}([^>]*?)>([^<]*?)Start Setup/g,
        `onClick={() => toast.info("Kreator grup ukaże się w wersji 2.0 (wkrótce)")}$1>$2Start Setup`
    );

    // 3. Zadaj grę
    content = content.replace(
        /onClick=\{\(\) => alert\("Akcja wykonana pomyślnie\."\)\}([^>]*?)(>[\s\S]*?Zadaj Grę[\s\S]*?<\/Button>)/g,
        `onClick={() => toast.success("Moduł przypisywania gier zostanie odblokowany po podpięciu kont uczniów.")}$1$2`
    );

    // 4. Team management
    content = content.replace(
        /onClick=\{\(\) => alert\("Akcja wykonana pomyślnie\."\)\}([^>]*?)(>\s*Zarządzaj zespołem & Wgraj \(CSV\)\s*<\/Button>)/g,
        `onClick={() => toast.info("Moduł zarządzania uczniami w trakcie integracji z E-dziennikami.")}$1$2`
    );

    // 5. Upgrade PRO
    content = content.replace(
        /onClick=\{\(\) => alert\("Akcja wykonana pomyślnie\."\)\}([^>]*?)(>\s*Upgrade to PRO\s*<\/Button>)/g,
        `onClick={() => toast.info("Przekierowanie do płatności...")}$1$2`
    );
    
    // 6. Propose ideas
    content = content.replace(
        /onClick=\{\(\) => alert\("Akcja wykonana pomyślnie\."\)\}([^>]*?)(>[\s\S]*?Zgłoś Pomysł[\s\S]*?<\/Button>)/g,
        `onClick={() => window.location.href = "mailto:kontakt@kamilaenglish.com?subject=Pomysł na platformę"}$1$2`
    );

    // Generic fallback replacement for alerts -> toasts in dashboard
    content = content.replace(/alert\("Akcja wykonana pomyślnie\."\)/g, 'toast.success("Funkcja została wywołana.")');
    content = content.replace(/alert\("Otwieranie formularza dodawania\.\.\."\)/g, 'toast.info("Otwieranie formularza (wkrótce)...")');
    content = content.replace(/alert\("Zapisano zmiany pomyślnie\."\)/g, 'toast.success("Zapisano pomyślnie!")');
    content = content.replace(/alert\("Otwieranie podglądu\.\.\."\)/g, 'toast.info("Generowanie podglądu...")');

    if (content !== originalContent) {
        fs.writeFileSync(file, content, 'utf8');
        totalReplaced++;
        console.log(`Updated ${path.basename(file)}`);
    }
}

// ─── ADMIN PANEL SPECIFIC REPLACEMENTS ───
const adminDir = 'c:\\Users\\kamil\\.gemini\\antigravity\\scratch\\educational-sales-site\\app\\[lang]\\admin';
const adminFiles = Object.values(
    // get all files recursively in admin
    (function walk(dir) {
        let results = [];
        fs.readdirSync(dir).forEach(file => {
            const fullPath = path.join(dir, file);
            if (fs.statSync(fullPath).isDirectory()) results = results.concat(walk(fullPath));
            else if (fullPath.endsWith('.tsx')) results.push(fullPath);
        });
        return results;
    })(adminDir)
);

for (const file of adminFiles) {
    let content = fs.readFileSync(file, 'utf8');
    const originalContent = content;

    if (!content.includes('import { toast }') && content.includes('alert(')) {
        content = content.replace(/(import .*?;?\n)(?!import )/, '$1import { toast } from "sonner";\n');
    }

    content = content.replace(/alert\("Akcja wykonana pomyślnie\."\)/g, 'toast.success("Akcja wykonana pomyślnie.")');
    content = content.replace(/confirm\("Czy na pewno chcesz usunąć\?"\) && alert\("Usunięto pomyślnie\."\)/g, 'confirm("Czy na pewno chcesz usunąć?") && toast.success("Usunięto pomyślnie.")');
    content = content.replace(/alert\("Otwieranie formularza dodawania\.\.\."\)/g, 'toast.info("Otwieranie kreatora (integracja w toku)")');
    content = content.replace(/alert\("Zapisano zmiany pomyślnie\."\)/g, 'toast.success("Zapisano zmiany")');
    
    // Admin landing builder specific
    content = content.replace(/alert\("Otwieranie podglądu\.\.\."\)/g, 'toast.info("Generowanie podglądu na żywo...")');

    if (content !== originalContent) {
        fs.writeFileSync(file, content, 'utf8');
        totalReplaced++;
        console.log(`Updated Admin file: ${path.basename(file)}`);
    }
}

console.log(`Deep repair completed on ${totalReplaced} files.`);

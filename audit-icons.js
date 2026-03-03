const fs = require('fs');
const path = require('path');

function getFiles(dir, files = []) {
    const items = fs.readdirSync(dir);
    for (const item of items) {
        const fullPath = path.join(dir, item);
        if (fs.statSync(fullPath).isDirectory()) {
            if (item !== 'node_modules' && item !== '.next') {
                getFiles(fullPath, files);
            }
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            files.push(fullPath);
        }
    }
    return files;
}

const directories = [
    'c:/Users/kamil/.gemini/antigravity/scratch/educational-sales-site/components',
    'c:/Users/kamil/.gemini/antigravity/scratch/educational-sales-site/app'
];

let issues = [];

directories.forEach(dir => {
    const files = getFiles(dir);
    files.forEach(file => {
        const content = fs.readFileSync(file, 'utf8');
        // Simple regex to find <IconName ... > or <IconName />
        const iconMatches = content.match(/<([A-Z][a-zA-Z0-9]+)\s/g);
        if (!iconMatches) return;
        
        const usedIcons = new Set(iconMatches.map(m => m.substring(1).trim()));
        
        // Check if any of these icons are Lucide icons (heuristic: if lucide-react is imported)
        if (content.includes('lucide-react')) {
            const importMatch = content.match(/import\s*{([^}]+)}\s*from\s*['"]lucide-react['"]/);
            if (importMatch) {
                const importedIcons = importMatch[1].split(',').map(i => i.trim().split(/\s+as\s+/)[0]);
                usedIcons.forEach(icon => {
                    // Check if it's likely a Lucide icon (camelCase, capitalized)
                    // and not imported and not a local component/React component
                    // This is a heuristic - we'll filter obvious non-icons manually from results
                    if (!importedIcons.includes(icon) && /^[A-Z][a-zA-Z0-9]+$/.test(icon)) {
                        // Exclude some common React components or known project components
                        const common = ['Link', 'Image', 'Button', 'Card', 'Badge', 'Input', 'Label', 'Dialog', 'Dropdown', 'Avatar', 'Sheet', 'Accordion', 'Tabs', 'Select', 'ScrollArea', 'Calendar', 'Popover', 'Toast', 'Table', 'Form', 'Checkbox', 'Radio', 'Switch', 'Slider', 'Progress', 'Skeleton', 'Separator', 'Tooltip', 'Navigation', 'MenuBar', 'Context', 'Alert', 'AspectRatio', 'Collapsible', 'Hover', 'Scroll', 'Toggle', 'Resizable', 'Carousel', 'Sonner', 'Lucide', 'React', 'Fragment', 'Suspense', 'LanguageProvider', 'LanguageSwitcher', 'BrandLogo', 'Header', 'Footer', 'ProductsContent', 'ProductsGrid', 'ProductDetailView', 'ProductFeatures', 'ProductReviews', 'CartPreview', 'CheckoutForm', 'AdminIntegrations', 'InAppNotifications', 'SearchModal', 'TranslationMerger', 'NamespaceGuard', 'DictionaryProvider', 'AuthGuard', 'RoleGuard'];
                        if (!common.includes(icon) && !content.includes(`const ${icon}`) && !content.includes(`function ${icon}`) && !content.includes(`class ${icon}`) && !content.includes(`import ${icon}`)) {
                            issues.push({ file, icon });
                        }
                    }
                });
            }
        }
    });
});

console.log(JSON.stringify(issues, null, 2));

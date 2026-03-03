const fs = require('fs');
const files = [
    'c:\\Users\\kamil\\.gemini\\antigravity\\scratch\\educational-sales-site\\components\\dashboard\\sidebar.tsx',
    'c:\\Users\\kamil\\.gemini\\antigravity\\scratch\\educational-sales-site\\components\\dashboard\\student-tasks.tsx'
];

for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    // The previous script accidentally inserted 'import { toast } from "sonner";' inside an existing import { ... } block
    // specifically right after the 'import {' line.
    
    // This regex looks for 'import {\nimport { toast } from "sonner";\n' and moves the toast import outside
    content = content.replace(
        /import \{\r?\nimport \{ toast \} from "sonner";/g,
        'import { toast } from "sonner";\nimport {'
    );
    
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Fixed syntax in ${file}`);
}

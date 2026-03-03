const fs = require('fs');
const path = require('path');

const filePath = "C:\\Users\\kamil\\.gemini\\antigravity\\scratch\\educational-sales-site\\public\\locales\\en\\admin.json";

try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    data.landingBuilder = {
        "title": "Landing Page Builder",
        "draftVersion": "Draft Version: {name}",
        "desktop": "Desktop",
        "mobile": "Mobile",
        "preview": "Preview",
        "save": "Save changes",
        "saving": "Saving...",
        "elements": "Page Elements",
        "text": "Text",
        "image": "Image",
        "button": "Button",
        "aiBlock": "AI Block",
        "canvas": "Canvas (Layers)",
        "hero": "Hero Section",
        "features": "Advantages & Benefits",
        "pricing": "Pricing Section",
        "aiMagic": {
            "title": "Ready for magic?",
            "desc": "Use AI to automatically match copy and colors to your product.",
            "optimize": "Optimize with AI"
        },
        "mock": {
            "newCourse": "New Course",
            "heroTitle": "Start teaching the language {joy}",
            "joy": "with joy",
            "heroDesc": "Ready-made scenarios your students will love. Zero stress, 100% results.",
            "buyNow": "Buy now and start teaching",
            "learnMore": "Learn more",
            "addImage": "Add main image (Drag & Drop)"
        },
        "optimization": {
            "title": "AI Landing Optimization",
            "desc": "We detected {count} areas for improvement to increase conversion by approx. {percent}%.",
            "current": "Current Version",
            "aiSuggestion": "AI Suggestion (Improved conversion)",
            "recommendation": "RECOMMENDATION",
            "skip": "Skip changes",
            "apply": "Apply optimization",
            "success": "AI changes have been applied to the project!",
            "processing": "Working on the project...",
            "processingDesc": "\"Scanning your copy for benefit language and analyzing market heatmaps.\"",
            "analysingHeaders": "Analyzing headers...",
            "pickingColors": "Choosing color palette...",
            "renderingPreview": "Rendering preview...",
            "paletteTitle": "Improved Color Palette (Ocean Night)",
            "paletteDesc": "We will change the accents to a more professional navy and energetic blue."
        },
        "toasts": {
            "saved": "Landing page saved successfully!"
        }
    };

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log("Successfully updated en/admin.json");
} catch (error) {
    console.error("Error:", error);
    process.exit(1);
}

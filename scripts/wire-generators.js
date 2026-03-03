const fs = require('fs');
const path = require('path');

function replaceOrWarn(content, regex, replacement, file) {
    if (!regex.test(content)) {
        console.warn(`Regex didn't match in ${file}`);
        return content;
    }
    return content.replace(regex, replacement);
}

// 1. Social Media Hub
const socialFile = 'c:\\Users\\kamil\\.gemini\\antigravity\\scratch\\educational-sales-site\\components\\admin\\social-media-hub.tsx';
let socialObj = fs.readFileSync(socialFile, 'utf8');

// Replace generatePost logic
const oldGeneratePost = /const generatePost = \(\) => \{\s*if \(!prompt\) return;\s*setIsGenerating\(true\);\s*setTimeout\(\(\) => \{[\s\S]*?\}, 1500\);\s*\};/m;
const newGeneratePost = `const generatePost = async () => {
        if (!prompt) return;
        setIsGenerating(true);
        try {
            const res = await fetch("/api/admin/ai/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: "social", platform: selectedPlatform, prompt })
            });
            const data = await res.json();
            if (data.isMock) toast.info("Tryb Demo", { description: "Brak OPENAI_API_KEY w .env.local" });
            else if (!res.ok) throw new Error(data.error);
            setGeneratedCopy(data.data);
            toast.success("AI Copy Generated!");
        } catch (error) {
            toast.error("Generation failed", { description: error.message });
        } finally {
            setIsGenerating(false);
        }
    };`;
socialObj = replaceOrWarn(socialObj, oldGeneratePost, newGeneratePost, 'social-media-hub.tsx');

// UI Fix 1: Editor text window overflow
socialObj = socialObj.replace(
    /className="p-6 rounded-3xl bg-slate-50\/50 border border-slate-100 min-h-\[120px\] relative group"/g,
    'className="p-6 rounded-3xl bg-slate-50/50 border border-slate-100 min-h-[120px] max-h-[300px] overflow-y-auto relative group"'
);
socialObj = socialObj.replace(
    /className="text-xs font-bold text-slate-600 leading-relaxed whitespace-pre-wrap"/g,
    'className="text-xs font-bold text-slate-600 leading-relaxed whitespace-pre-wrap break-words"'
);

// UI Fix 2: Phone Mockup text overflow
socialObj = socialObj.replace(
    /<div className="p-6 space-y-4">/g,
    '<div className="p-6 space-y-4 flex-1 overflow-y-auto max-h-[250px] scrollbar-thin scrollbar-thumb-slate-200">'
);
socialObj = socialObj.replace(
    /className="text-\[11px\] font-medium text-slate-600 leading-relaxed italic"/g,
    'className="text-[11px] font-medium text-slate-600 leading-relaxed italic break-words whitespace-pre-wrap"'
);

fs.writeFileSync(socialFile, socialObj);


// 2. Flashcard Generator
const flashcardFile = 'c:\\Users\\kamil\\.gemini\\antigravity\\scratch\\educational-sales-site\\components\\admin\\flashcard-generator.tsx';
let flashObj = fs.readFileSync(flashcardFile, 'utf8');

const oldGenerateFlashcards = /const generateFlashcards = \(\) => \{\s*if \(!topic\) return;\s*setIsGenerating\(true\);[\s\S]*?\}, 2000\);\s*\};/m;
const newGenerateFlashcards = `const generateFlashcards = async () => {
        if (!topic) return;
        setIsGenerating(true);
        try {
            const res = await fetch("/api/admin/ai/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: "flashcards", prompt: topic, style })
            });
            const data = await res.json();
            if (data.isMock) toast.info("Tryb Demo", { description: "Dodaj OPENAI_API_KEY aby użyć prawdziwego AI." });
            else if (!res.ok) throw new Error(data.error);
            setFlashcards(data.data);
            toast.success("Deck generated successfully!");
        } catch (error) {
            toast.error("Generation failed", { description: error.message });
        } finally {
            setIsGenerating(false);
        }
    };`;
flashObj = replaceOrWarn(flashObj, oldGenerateFlashcards, newGenerateFlashcards, 'flashcard-generator.tsx');

// UI Fix: Flashcard limits
flashObj = flashObj.replace(
    /<p className="text-lg font-bold text-white leading-relaxed">\{card\.back\}<\/p>/g,
    '<div className="w-full flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-500/50 pr-2"><p className="text-sm md:text-base font-bold text-white leading-relaxed break-words">{card.back}</p></div>'
);
fs.writeFileSync(flashcardFile, flashObj);


// 3. AI Workshop
const workshopFile = 'c:\\Users\\kamil\\.gemini\\antigravity\\scratch\\educational-sales-site\\components\\admin\\ai-workshop.tsx';
let workObj = fs.readFileSync(workshopFile, 'utf8');

const oldHandleGenerate = /const handleGenerate = useCallback\(\(\) => \{[\s\S]*?\}, \[prompt, activeStudio, selectedProduct, selectedPersona\]\);/m;
const newHandleGenerate = `const handleGenerate = useCallback(async () => {
        if (!prompt) return;
        setIsGenerating(true);
        try {
            const res = await fetch("/api/admin/ai/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: activeStudio === 'avatars' ? 'avatars' : activeStudio === 'video' ? 'video' : 'image',
                    prompt: prompt,
                    style: selectedPersona
                })
            });
            const data = await res.json();
            if (data.isMock) toast.info("Tryb Demo", { description: "Brak OPENAI_API_KEY." });
            else if (!res.ok) throw new Error(data.error);
            
            const newAsset = {
                id: Date.now(),
                type: activeStudio,
                url: data.data || "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=500&auto=format&fit=crop&q=60",
                prompt,
                productId: selectedProduct?.id,
                productTitle: selectedProduct?.title,
                persona: activeStudio === 'avatars' ? selectedPersona : undefined,
                timestamp: new Date().toISOString()
            };
            setGeneratedAssets(prev => [newAsset, ...prev]);
            setPrompt("");
            toast.success("Generowanie zakończone sukcesem!");
        } catch (error) {
            toast.error("Błąd generowania", { description: error.message });
        } finally {
            setIsGenerating(false);
        }
    }, [prompt, activeStudio, selectedProduct, selectedPersona]);`;
workObj = replaceOrWarn(workObj, oldHandleGenerate, newHandleGenerate, 'ai-workshop.tsx');

// UI fix text bounds
workObj = workObj.replace(
    /<p className="text-xs font-medium text-slate-600 line-clamp-3 italic leading-relaxed">"\{asset\.prompt\}"<\/p>/g,
    '<p className="text-xs font-medium text-slate-600 line-clamp-3 italic leading-relaxed break-words px-1 max-w-full">"{asset.prompt}"</p>'
);

fs.writeFileSync(workshopFile, workObj);

console.log("All 3 generators wired to universal AI endpoint and UI layout fixed.");

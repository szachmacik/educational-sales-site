import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";

// Centralized AI Generation route
// Uses OPENAI_API_KEY from .env.local if available. Otherwise, falls back to demo data.

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function POST(req: Request) {
    const authError = await requireAuth();
    if (authError) return authError;

        try {
        const body = await req.json();
        const { prompt, type, style, platform } = body;

        // --- 1. DEMO MODE (NO API KEY) ---
        if (!OPENAI_API_KEY) {
            // Simulated delay for realism
            await new Promise((resolve) => setTimeout(resolve, 1500));
            return NextResponse.json({
                isMock: true,
                message: "No OPENAI_API_KEY found. Returning demo data.",
                data: getMockData(type, prompt, style, platform)
            });
        }

        // --- 2. LIVE MODE (OPENAI API) ---
        if (type === 'flashcards') {
            const systemPrompt = `You are an expert educator. Create a set of 4-6 high-quality educational flashcards based on the topic: "${prompt}". Style: ${style || 'academic'}. Return ONLY valid JSON in this exact format: [{"front": "Short Term", "back": "Detailed Explanation"}]. Do not include markdown formatting like \`\`\`json.`;
            
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: "gpt-4o-mini",
                    messages: [{ role: "system", content: systemPrompt }],
                    temperature: 0.7
                })
            });
            
            if (!response.ok) throw new Error(`OpenAI API error: ${response.statusText}`);
            const data = await response.json();
            let content = data.choices[0].message.content;
            
            // Clean up backticks if any
            content = content.replace(/```json/g, '').replace(/```/g, '').trim();
            const cards = JSON.parse(content);
            
            // assign random IDs
            const mappedCards = cards.map((c: any, idx: number) => ({ id: `${Date.now()}-${idx}`, ...c }));
            return NextResponse.json({ isMock: false, data: mappedCards });
        } 
        
        else if (type === 'social') {
            const systemPrompt = `Create an engaging viral promotional social media post for the platform: ${platform}. Context/Topic: ${prompt}. Include emojis and hashtags. Return ONLY the post content as plain text.`;
            
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: "gpt-4o-mini",
                    messages: [{ role: "system", content: systemPrompt }],
                    temperature: 0.8
                })
            });
            
            if (!response.ok) throw new Error("OpenAI API error");
            const data = await response.json();
            const post = data.choices[0].message.content;
            return NextResponse.json({ isMock: false, data: post });
        }
        
        else if (type === 'image' || type === 'avatars' || type === 'video') {
            // Using DALL-E 3 for image generation (simulated as image for avatars/video placeholder)
            const imagePrompt = `High quality educational illustration, clean vector style, vivid colors. Topic: ${prompt}. Style: ${style || 'modern'}`;
            
            const response = await fetch("https://api.openai.com/v1/images/generations", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: "dall-e-3",
                    prompt: imagePrompt,
                    n: 1,
                    size: "1024x1024"
                })
            });
            
            if (!response.ok) throw new Error("OpenAI API error (Images)");
            const data = await response.json();
            const imageUrl = data.data[0].url;
            return NextResponse.json({ isMock: false, data: imageUrl });
        }

        return NextResponse.json({ error: "Invalid generation type" }, { status: 400 });

    } catch (error: any) {
        console.error("AI Generation Error:", error);
        return NextResponse.json({ error: error.message || "Generation failed." }, { status: 500 });
    }
}

// --- MOCK DATA GENERATOR FOR DEMO ENVIRONMENT ---
function getMockData(type: string, prompt: string, style?: string, platform?: string) {
    const isEnglish = prompt.toLowerCase().includes("english") || prompt.match(/^[a-zA-Z\s]+$/) !== null;
    
    if (type === 'flashcards') {
        if (isEnglish) {
            return [
                { id: "1", front: "Cat", back: "A small domesticated carnivorous mammal with soft fur." },
                { id: "2", front: "Dog", back: "A domesticated carnivorous mammal that typically has a long snout." },
                { id: "3", front: "Elephant", back: "A heavy plant-eating mammal with a prehensile trunk." },
                { id: "4", front: "Bird", back: "A warm-blooded egg-laying vertebrate distinguished by the possession of feathers." }
            ];
        } else {
            return [
                { id: "1", front: "Kot", back: "Zwierzę domowe, które miauczy." },
                { id: "2", front: "Pies", back: "Najlepszy przyjaciel człowieka." },
                { id: "3", front: "Słoń", back: "Największe zwierzę lądowe." },
                { id: "4", front: "Ptak", back: "Zwierzę, które potrafi latać." }
            ];
        }
    }
    
    if (type === 'social') {
        if (isEnglish) {
            return `✨ Big news! We are launching something special regarding: ${prompt}! 🎮 Setup your ${platform} game today.\n\n#Education #EdTech #LearningIsFun #Growth`;
        } else {
            return `✨ Sprawdź nasze najnowsze materiały: ${prompt}! 🎮 Idealne do angażowania uczniów w klasie i na ${platform}.\n\n#Edukacja #Nauczyciel #Szkola #Rozwoj`;
        }
    }
    
    if (type === 'image' || type === 'avatars' || type === 'video') {
        // Return a reliable Unsplash placeholder based on keywords
        if (prompt.toLowerCase().includes('winter') || prompt.toLowerCase().includes('snow')) {
            return "https://images.unsplash.com/photo-1418985991508-e47386d96a71?w=1024&auto=format&fit=crop&q=80";
        }
        if (prompt.toLowerCase().includes('teacher') || type === 'avatars') {
            return "https://images.unsplash.com/photo-1544717297-fa95b3ee9bc6?w=1024&auto=format&fit=crop&q=80";
        }
        return "https://images.unsplash.com/photo-1544333323-c242b4423403?w=1024&auto=format&fit=crop&q=80";
    }
    
    return null;
}

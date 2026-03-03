import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";

export async function POST(req: NextRequest) {
    const authError = await requireAuth();
    if (authError) return authError;

        try {
        const { prompt, type } = await req.json();

        if (!process.env.GEMINI_API_KEY) {
            console.warn("No GEMINI_API_KEY found. Falling back to simulated generation.");
            return NextResponse.json({ success: false, reason: "missing_key" }, { status: 503 });
        }

        const systemInstruction = `You are an expert educational game designer. Generate JSON output for a '${type}' educational game based on this topic: ${prompt}.
Return only raw JSON. Do not use markdown blocks.

Required schema for ${type}:
- type: string (must be '${type}')
- title: string
- description: string
- content: object
`;

        const geminiPayload = {
            contents: [{ parts: [{ text: systemInstruction }] }],
            generationConfig: {
                responseMimeType: "application/json"
            }
        };

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(geminiPayload)
        });

        if (!response.ok) {
            console.error("Gemini API error", await response.text());
            return NextResponse.json({ success: false, reason: "api_error" }, { status: 500 });
        }

        const data = await response.json();
        const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!textResponse) {
            return NextResponse.json({ success: false, reason: "empty_response" }, { status: 500 });
        }

        const parsedJson = JSON.parse(textResponse);

        return NextResponse.json({
            success: true,
            gameData: parsedJson
        });

    } catch (error: any) {
        console.error("Gemini Generation failed:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

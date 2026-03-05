/**
 * AI Game Generator Service
 * Translates user descriptions into structured game configurations.
 */

export type GameType = 'quiz' | 'memory' | 'sort' | 'flashcards';

export interface GameConfig {
    id: string;
    type: GameType;
    title: string;
    description: string;
    content: any; // Game-specific data (e.g., questions and answers)
    createdAt: string;
}

let lastRequestTime = 0;
const RATE_LIMIT_MS = 10000; // 10 seconds between requests

/**
 * Simulates an AI call to generate game content based on a prompt.
 * In a real app, this would call Gemini 2.0 Flash or 1.5 Pro.
 */
export async function generateGameFromPrompt(prompt: string, type: GameType): Promise<GameConfig> {
    const now_ts = Date.now();
    if (now_ts - lastRequestTime < RATE_LIMIT_MS) {
        const wait_sec = Math.ceil((RATE_LIMIT_MS - (now_ts - lastRequestTime)) / 1000);
        throw new Error(`Zbyt szybko! Spróbuj ponownie za ${wait_sec}s. Oszczędzamy Twoje tokeny i zasoby serwera.`);
    }

    lastRequestTime = now_ts;
    console.info(`[GameGenerator] Generating ${type} for prompt: "${prompt}"`);

    const mockId = `game_${Date.now()}`;
    const now = new Date().toISOString();

    const isSimulatorMode = typeof window !== 'undefined' && localStorage.getItem('feature_simulator_mode') === 'true';

    if (!isSimulatorMode) {
        try {
            const response = await fetch('/api/admin/generate-game', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt, type })
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success && data.gameData) {
                    return {
                        id: mockId,
                        type: data.gameData.type || type,
                        title: data.gameData.title || `Generated ${type}`,
                        description: data.gameData.description || `AI Generated game about ${prompt}`,
                        createdAt: now,
                        content: data.gameData.content
                    };
                }
            } else {
                console.warn("[GameGenerator] API call failed or missing key, falling back to simulated generation for demo purposes.");
            }
        } catch (e) {
            console.error("[GameGenerator] Network error, using fallback.");
        }
    } else {
        console.info("[GameGenerator] Simulator Mode is ON. Using mock game generation.");
        await new Promise(resolve => setTimeout(resolve, 1500));
    }

    // Fallback Simulation if API is not working or no key or simulator mode is on
    switch (type) {
        case 'quiz':
            return {
                id: mockId,
                type: 'quiz',
                title: `Quiz: ${prompt.substring(0, 30)}...`,
                description: `A fun educational quiz about ${prompt}`,
                createdAt: now,
                content: {
                    questions: [
                        { q: "Example Question 1?", a: ["Correct Answer", "Wrong 1", "Wrong 2"], correct: 0 },
                        { q: "Example Question 2?", a: ["Wrong 1", "Correct Answer", "Wrong 2"], correct: 1 },
                        { q: "Example Question 3?", a: ["Wrong 1", "Wrong 2", "Correct Answer"], correct: 2 }
                    ]
                }
            };
        case 'memory':
            return {
                id: mockId,
                type: 'memory',
                title: `Memory: ${prompt.substring(0, 30)}...`,
                description: `Match pairs related to ${prompt}`,
                createdAt: now,
                content: {
                    pairs: [
                        { a: "Term 1", b: "Definition 1" },
                        { a: "Term 2", b: "Definition 2" },
                        { a: "Term 3", b: "Definition 3" },
                        { a: "Term 4", b: "Definition 4" }
                    ]
                }
            };
        case 'sort':
            return {
                id: mockId,
                type: 'sort',
                title: `Sorting: ${prompt.substring(0, 30)}...`,
                description: `Categorize items related to ${prompt}`,
                createdAt: now,
                content: {
                    categories: [
                        { name: "Group A", items: ["Item A1", "Item A2"] },
                        { name: "Group B", items: ["Item B1", "Item B2"] }
                    ]
                }
            };
        default:
            return {
                id: mockId,
                type: 'flashcards',
                title: `Flashcards: ${prompt.substring(0, 30)}...`,
                description: `Learn about ${prompt} with flashcards`,
                createdAt: now,
                content: {
                    cards: [
                        { front: "Front 1", back: "Back 1" },
                        { front: "Front 2", back: "Back 2" }
                    ]
                }
            };
    }
}

/**
 * Saves a generated game to local storage for the demo.
 */
export function saveGeneratedGame(game: GameConfig) {
    const existing = localStorage.getItem('user_generated_games');
    const games = existing ? JSON.parse(existing) : [];
    games.unshift(game);
    localStorage.setItem('user_generated_games', JSON.stringify(games));
}

/**
 * Retrieves all generated games for the current user.
 */
export function getGeneratedGames(): GameConfig[] {
    const existing = localStorage.getItem('user_generated_games');
    return existing ? JSON.parse(existing) : [];
}

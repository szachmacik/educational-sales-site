// Product schema and types for the admin dashboard

export interface Product {
    id: string;
    title: string;
    description: string;
    shortDescription?: string;
    price: number;
    salePrice?: number;
    images: string[];
    category: string;
    teachingMode?: 'online' | 'stationary' | 'hybrid'; // Made optional to support digital products
    externalUrl?: string; // URL for games/external resources
    autoGenerateLesson?: boolean; // Flag to auto-generate lesson structure
    tags: string[];
    status: 'draft' | 'published';
    source?: {
        url: string;
        importedAt: string;
        aiEnhanced: boolean;
        embedHtml?: string;
    };
    slug: string;
    createdAt: string;
    updatedAt: string;
    tptMetadata?: {
        optimizedTitle?: string;
        optimizedDescription?: string;
        suggestedGrades?: string[];
        subjectArea?: string;
        resourceType?: string;
        zipStatus?: 'pending' | 'ready';
    };
}

export interface ProductFormData {
    title: string;
    description: string;
    shortDescription?: string;
    price: number;
    salePrice?: number;
    images: string[];
    category: string;
    teachingMode: 'online' | 'stationary' | 'hybrid';
    externalUrl?: string;
    autoGenerateLesson?: boolean;
    tags: string[];
    status: 'draft' | 'published';
}

// Categories for products
export const PRODUCT_CATEGORIES = [
    { value: "lesson-plans", label: "Scenariusze lekcji" },
    { value: "worksheets", label: "Karty pracy" },
    { value: "flashcards", label: "Fiszki" },
    { value: "games", label: "Gry i zabawy online" },
    { value: "audio", label: "Materiały audio" },
    { value: "video", label: "Materiały wideo" },
    { value: "bundles", label: "Pakiety" },
    { value: "other", label: "Inne" },
] as const;

// AI Provider configuration
export interface AIProviderConfig {
    provider: 'openai' | 'gemini' | 'anthropic';
    apiKey: string;
    model: string;
    enabled: boolean;
}

export const AI_PROVIDERS = [
    {
        id: 'openai',
        name: 'OpenAI',
        models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo'],
        defaultModel: 'gpt-4o-mini',
        placeholder: 'sk-...',
    },
    {
        id: 'gemini',
        name: 'Google Gemini',
        models: ['gemini-2.0-flash', 'gemini-1.5-pro', 'gemini-1.5-flash'],
        defaultModel: 'gemini-2.0-flash',
        placeholder: 'AIza...',
    },
    {
        id: 'anthropic',
        name: 'Anthropic Claude',
        models: ['claude-3-5-sonnet-20241022', 'claude-3-opus-20240229', 'claude-3-haiku-20240307'],
        defaultModel: 'claude-3-5-sonnet-20241022',
        placeholder: 'sk-ant-...',
    },
    {
        id: 'manus',
        name: 'Manus AI (Browser Agent)',
        models: ['manus-browser-v1', 'manus-research-v1'],
        defaultModel: 'manus-browser-v1',
        placeholder: 'manus_key_...',
    },
] as const;

// Helper to generate slug from title
export function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}

// Generate unique ID
export function generateId(): string {
    return `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

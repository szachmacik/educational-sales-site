export interface UserProfile {
    userId: string;
    // B2B MULTI-TIER ARCHITECTURE
    role: 'teacher' | 'school' | 'student';
    employerNip?: string;
    employerName?: string;
    schoolId?: string; // Links teacher/student to a master school account

    teachingLevel: 'preschool' | 'primary' | 'secondary' | 'adults' | 'corporate';
    preferredMaterials: ('pdf' | 'games' | 'video' | 'audio')[];
    monthlyBudget: 'low' | 'medium' | 'high';
    interests: string[];
    // Deep Consumer Insights
    burnoutLevel: number; // 1-10
    prepTimePerWeek: number; // hours
    dreamMaterial: string;
    favoriteTopics: string[];
    isProfileComplete: boolean;
    lastBonusAwarded?: string;
    purchasedProducts?: string[]; // Array of purchased product titles or IDs
    // Scoring & Behavioral
    customerScore?: number; // 0-100 (100 = VIP, buys regardless of price)
    discountSensitivity?: 'low' | 'medium' | 'high'; // low = doesn't care about discounts
}

const PROFILE_DB_KEY = "kamila_profiles_db";

export function getUserProfile(userId: string): UserProfile {
    const defaults: UserProfile = {
        userId,
        role: 'teacher',
        teachingLevel: 'primary',
        preferredMaterials: [],
        monthlyBudget: 'medium',
        interests: [],
        burnoutLevel: 5,
        prepTimePerWeek: 5,
        dreamMaterial: '',
        favoriteTopics: [],
        isProfileComplete: false,
        purchasedProducts: [],
        customerScore: 50,
        discountSensitivity: 'medium'
    };

    if (typeof window === 'undefined') return defaults;

    const db = JSON.parse(localStorage.getItem(PROFILE_DB_KEY) || "{}");
    if (!db[userId]) return defaults;
    return { ...defaults, ...db[userId] };
}

export function saveUserProfile(profile: UserProfile) {
    if (typeof window === 'undefined') return;

    const db = JSON.parse(localStorage.getItem(PROFILE_DB_KEY) || "{}");

    // Check if it's the first time completing the profile
    const oldProfile = getUserProfile(profile.userId);
    const becameComplete = !oldProfile.isProfileComplete && profile.isProfileComplete;

    db[profile.userId] = profile;
    localStorage.setItem(PROFILE_DB_KEY, JSON.stringify(db));

    console.info(`👤 [Profile Service] Profile saved for ${profile.userId}. Complete: ${profile.isProfileComplete}`);

    return becameComplete;
}

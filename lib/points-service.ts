export interface UserPoints {
    userId: string;
    balance: number;
    currentStreak: number;
    lastLoginDate?: string;
    level: number;
    xp: number;
    history: PointTransaction[];
}

export interface PointTransaction {
    id: string;
    amount: number;
    type: 'earn' | 'spend';
    reason: 'purchase' | 'check-in' | 'profile-completion' | 'streak' | 'review' | 'referral' | 'init' | 'level-up';
    timestamp: string;
}

// Rules for the system
export const POINT_EARN_RATE = 10; // 1 PLN = 10 Points
export const POINT_SPEND_RATE = 100; // 100 Points = 1 PLN
export const POINTS_DAILY_LOGIN = 10;
export const STREAK_BONUS_MAP = [0, 5, 10, 15, 20, 25, 50, 100]; // Bonus per day of streak
export const POINTS_PROFILE_COMPLETION = 200;
export const POINTS_REFRERRAL = 500;

export const LEVEL_BASE_XP = 1000;
export const LEVEL_EXPONENT = 1.5;

export function getXpForLevel(level: number): number {
    return Math.floor(LEVEL_BASE_XP * Math.pow(level, LEVEL_EXPONENT));
}

/**
 * Calculates how many points are earned for a given currency amount.
 */
export function calculateEarnedPoints(amount: number): number {
    return Math.floor(amount * POINT_EARN_RATE);
}

/**
 * Calculates the point price for a given cash price.
 * Example: A product costing 49 PLN would cost 4900 points.
 */
export function calculatePointPrice(cashPrice: number): number {
    return Math.floor(cashPrice * POINT_SPEND_RATE);
}

const POINTS_DB_KEY = "kamila_points_db";

/**
 * Client-side persistence for points (syncs with server in prod).
 */
export function getUserPoints(userId: string): UserPoints {
    if (typeof window === 'undefined') return { userId, balance: 0, currentStreak: 0, level: 1, xp: 0, history: [] };

    const db = JSON.parse(localStorage.getItem(POINTS_DB_KEY) || "{}");
    if (!db[userId]) {
        // Initial gift for new users
        return {
            userId,
            balance: 500,
            currentStreak: 0,
            level: 1,
            xp: 0,
            history: [{ id: 'init', amount: 500, type: 'earn', reason: 'init', timestamp: new Date().toISOString() }]
        };
    }
    return db[userId];
}

export function updateUserPoints(userId: string, amount: number, type: 'earn' | 'spend', reason: PointTransaction['reason']) {
    if (typeof window === 'undefined') return;

    const db = JSON.parse(localStorage.getItem(POINTS_DB_KEY) || "{}");
    const userPoints = getUserPoints(userId);

    // Anti-bot/Spam protection: Check if same reason/type happened too recently (e.g., within 5 seconds for generic earns)
    const now = Date.now();
    const lastSameTx = userPoints.history.find(h => h.reason === reason);
    if (lastSameTx && type === 'earn' && reason !== 'purchase') {
        const lastTime = new Date(lastSameTx.timestamp).getTime();
        if (now - lastTime < 5000) {
            console.warn(`🛡️ [Points Security] Rate limit hit for ${userId} (${reason})`);
            return;
        }
    }

    // XP gain (only for earning points)
    let newXp = userPoints.xp + (type === 'earn' ? amount : 0);
    let newLevel = userPoints.level;

    // Level Up Check
    const xpNeeded = getXpForLevel(newLevel);
    if (newXp >= xpNeeded) {
        newLevel++;
        console.info(`🆙 [Points] User ${userId} LEVELED UP to ${newLevel}!`);
    }

    const newBalance = type === 'earn' ? userPoints.balance + amount : userPoints.balance - amount;

    const updated: UserPoints = {
        ...userPoints,
        userId,
        balance: Math.max(0, newBalance),
        level: newLevel,
        xp: newXp,
        history: [
            { id: `tx_${now}`, amount, type, reason, timestamp: new Date(now).toISOString() },
            ...userPoints.history
        ].slice(0, 50) as PointTransaction[]
    };

    db[userId] = updated;
    localStorage.setItem(POINTS_DB_KEY, JSON.stringify(db));

    // In production, we would also call /api/user/points to persist on server
    console.info(`✨ [Points Service] User ${userId} ${type}ed ${amount} points for ${reason}. New balance: ${newBalance}`);
}

/**
 * High-level function to trigger points for specific app events.
 */
export function triggerPointEvent(userId: string, event: PointTransaction['reason']) {
    const userPoints = getUserPoints(userId);
    const now = new Date();
    const db = JSON.parse(localStorage.getItem(POINTS_DB_KEY) || "{}");

    switch (event) {
        case 'check-in':
            const lastCheckinStr = userPoints.lastLoginDate;
            let streak = userPoints.currentStreak;

            if (lastCheckinStr) {
                const lastDate = new Date(lastCheckinStr);
                const diffTime = now.getTime() - lastDate.getTime();
                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays === 0) {
                    console.info("📅 [Points] Already checked in today.");
                    return;
                } else if (diffDays === 1) {
                    streak++;
                } else {
                    streak = 1;
                }
            } else {
                streak = 1;
            }

            // Calculate base + streak bonus
            const bonusIndex = Math.min(streak, STREAK_BONUS_MAP.length - 1);
            const totalEarned = POINTS_DAILY_LOGIN + STREAK_BONUS_MAP[bonusIndex];

            // Update streak and last login date in DB BEFORE updateUserPoints
            const updatedProfile = {
                ...userPoints,
                currentStreak: streak,
                lastLoginDate: now.toISOString()
            };
            db[userId] = updatedProfile;
            localStorage.setItem(POINTS_DB_KEY, JSON.stringify(db));

            updateUserPoints(userId, totalEarned, 'earn', 'check-in');
            if (STREAK_BONUS_MAP[bonusIndex] > 0) {
                updateUserPoints(userId, STREAK_BONUS_MAP[bonusIndex], 'earn', 'streak');
            }
            break;

        case 'profile-completion':
            const alreadyCompleted = userPoints.history.some(h => h.reason === 'profile-completion');
            if (!alreadyCompleted) {
                updateUserPoints(userId, POINTS_PROFILE_COMPLETION, 'earn', 'profile-completion');
            }
            break;

        default:
            console.warn(`⚠️ [Points] Unknown point event: ${event}`);
    }
}

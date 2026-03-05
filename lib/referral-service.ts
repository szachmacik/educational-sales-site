/**
 * Referral & Invite System
 * 
 * How it works:
 * 1. Every logged-in user gets a unique referral code (stored in localStorage)
 * 2. They share a link: /pl/login?ref=XXXXX
 * 3. When a new user registers via that link:
 *    a) The NEW USER gets 300 bonus points (welcome gift)
 *    b) The REFERRER gets 500 bonus points (POINTS_REFERRAL)
 * 4. Each referral is tracked to prevent abuse (max 20/user)
 */

import { updateUserPoints, getUserPoints, POINTS_REFRERRAL } from './points-service';

export interface ReferralRecord {
    code: string;
    ownerId: string;           // user who created the referral
    ownerEmail: string;
    usedBy: ReferralUse[];
    createdAt: string;
}

export interface ReferralUse {
    newUserId: string;
    newUserEmail: string;
    registeredAt: string;
    bonusAwarded: boolean;
}

const REFERRAL_DB_KEY = 'kamila_referrals_db';
const REFERRAL_BONUS_NEW_USER = 300;     // points for joining via referral
const REFERRAL_BONUS_INVITER = POINTS_REFRERRAL; // 500 points for the referrer
const MAX_REFERRALS_PER_USER = 20;
const REFERRAL_CODE_LENGTH = 8;

// --- Code Generation ---

function generateCode(email: string): string {
    const base = email.split('@')[0].replace(/[^a-z0-9]/gi, '').toUpperCase().slice(0, 4).padEnd(4, 'X');
    const rand = Math.random().toString(36).toUpperCase().slice(2, 2 + (REFERRAL_CODE_LENGTH - 4));
    return `${base}${rand}`;
}

function getDB(): Record<string, ReferralRecord> {
    if (typeof window === 'undefined') return {};
    return JSON.parse(localStorage.getItem(REFERRAL_DB_KEY) || '{}');
}

function saveDB(db: Record<string, ReferralRecord>) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(REFERRAL_DB_KEY, JSON.stringify(db));
}

// --- Public API ---

/**
 * Get or create a referral code for the current user.
 */
export function getOrCreateReferralCode(userId: string, userEmail: string): string {
    const db = getDB();
    
    // Find existing code for this user
    const existing = Object.values(db).find(r => r.ownerId === userId);
    if (existing) return existing.code;

    // Create new code (ensure uniqueness)
    let code = generateCode(userEmail);
    let attempts = 0;
    while (db[code] && attempts < 10) {
        code = generateCode(userEmail + attempts);
        attempts++;
    }

    const record: ReferralRecord = {
        code,
        ownerId: userId,
        ownerEmail: userEmail,
        usedBy: [],
        createdAt: new Date().toISOString(),
    };

    db[code] = record;
    saveDB(db);
    return code;
}

/**
 * Get referral stats for a user.
 */
export function getReferralStats(userId: string): {
    code: string;
    totalReferrals: number;
    pendingPayout: number;
    totalEarned: number;
    usedBy: ReferralUse[];
    canEarnMore: boolean;
} {
    const db = getDB();
    const record = Object.values(db).find(r => r.ownerId === userId);
    
    if (!record) {
        return { code: '', totalReferrals: 0, pendingPayout: 0, totalEarned: 0, usedBy: [], canEarnMore: true };
    }

    const awardedCount = record.usedBy.filter(u => u.bonusAwarded).length;
    return {
        code: record.code,
        totalReferrals: record.usedBy.length,
        pendingPayout: record.usedBy.filter(u => !u.bonusAwarded).length * REFERRAL_BONUS_INVITER,
        totalEarned: awardedCount * REFERRAL_BONUS_INVITER,
        usedBy: record.usedBy,
        canEarnMore: record.usedBy.length < MAX_REFERRALS_PER_USER,
    };
}

/**
 * Process a referral when a new user registers via a referral link.
 * Call this after successful registration/login.
 * Returns true if bonus was successfully awarded.
 */
export function processReferral(
    referralCode: string,
    newUserId: string,
    newUserEmail: string
): { success: boolean; bonusForNewUser: number; message: string } {
    if (!referralCode || !newUserId) {
        return { success: false, bonusForNewUser: 0, message: 'Brak kodu polecenia.' };
    }

    const db = getDB();
    const record = db[referralCode];

    if (!record) {
        return { success: false, bonusForNewUser: 0, message: 'Nieprawidłowy kod polecenia.' };
    }

    // Prevent self-referral
    if (record.ownerId === newUserId || record.ownerEmail === newUserEmail) {
        return { success: false, bonusForNewUser: 0, message: 'Nie możesz polecić samego siebie.' };
    }

    // Check if this user already used a referral
    const alreadyUsed = Object.values(db).some(r => r.usedBy.some(u => u.newUserId === newUserId));
    if (alreadyUsed) {
        return { success: false, bonusForNewUser: 0, message: 'Już skorzystałeś z kodu polecenia.' };
    }

    // Check referral cap
    if (record.usedBy.length >= MAX_REFERRALS_PER_USER) {
        return { success: false, bonusForNewUser: 0, message: 'Limit polecen dla tego kodu został osiągnięty.' };
    }

    // Register the use
    const use: ReferralUse = {
        newUserId,
        newUserEmail,
        registeredAt: new Date().toISOString(),
        bonusAwarded: false,
    };
    record.usedBy.push(use);

    // Award bonus to REFERRER
    updateUserPoints(record.ownerId, REFERRAL_BONUS_INVITER, 'earn', 'referral');
    console.info(`🎁 [Referral] ${REFERRAL_BONUS_INVITER} pts awarded to referrer (${record.ownerEmail})`);

    // Mark as awarded
    record.usedBy[record.usedBy.length - 1].bonusAwarded = true;
    db[referralCode] = record;
    saveDB(db);

    console.info(`🎉 [Referral] New user ${newUserEmail} joined via code ${referralCode}. +${REFERRAL_BONUS_NEW_USER} pts for them.`);

    return {
        success: true,
        bonusForNewUser: REFERRAL_BONUS_NEW_USER,
        message: `Witaj! Otrzymujesz ${REFERRAL_BONUS_NEW_USER} punktów powitalnych za dołączenie przez zaproszenie!`,
    };
}

/**
 * Build the full referral URL for sharing.
 */
export function buildReferralUrl(code: string, language: string = 'pl'): string {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://kamilaenglish.com';
    return `${baseUrl}/${language}/login?ref=${code}`;
}

export { REFERRAL_BONUS_NEW_USER, REFERRAL_BONUS_INVITER, MAX_REFERRALS_PER_USER };

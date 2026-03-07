import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  calculateEarnedPoints,
  calculatePointPrice,
  getXpForLevel,
  POINT_EARN_RATE,
  POINT_SPEND_RATE,
  POINTS_DAILY_LOGIN,
  LEVEL_BASE_XP,
} from '@/lib/points-service'

// Mock localStorage for browser-dependent functions
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value },
    removeItem: (key: string) => { delete store[key] },
    clear: () => { store = {} },
  }
})()

Object.defineProperty(global, 'localStorage', { value: localStorageMock })

beforeEach(() => {
  localStorageMock.clear()
})

describe('calculateEarnedPoints', () => {
  it('calculates points at the correct earn rate', () => {
    // 1 PLN = POINT_EARN_RATE points
    expect(calculateEarnedPoints(1)).toBe(POINT_EARN_RATE)
    expect(calculateEarnedPoints(10)).toBe(10 * POINT_EARN_RATE)
    expect(calculateEarnedPoints(49)).toBe(49 * POINT_EARN_RATE)
  })

  it('floors fractional results', () => {
    // 0.5 PLN * 10 = 5 points (exact)
    expect(calculateEarnedPoints(0.5)).toBe(Math.floor(0.5 * POINT_EARN_RATE))
  })

  it('returns 0 for 0 amount', () => {
    expect(calculateEarnedPoints(0)).toBe(0)
  })

  it('handles large amounts correctly', () => {
    expect(calculateEarnedPoints(1000)).toBe(1000 * POINT_EARN_RATE)
  })
})

describe('calculatePointPrice', () => {
  it('calculates point price at the correct spend rate', () => {
    // 1 PLN = POINT_SPEND_RATE points
    expect(calculatePointPrice(1)).toBe(POINT_SPEND_RATE)
    expect(calculatePointPrice(49)).toBe(49 * POINT_SPEND_RATE)
  })

  it('returns 0 for 0 price', () => {
    expect(calculatePointPrice(0)).toBe(0)
  })

  it('floors fractional results', () => {
    expect(calculatePointPrice(0.5)).toBe(Math.floor(0.5 * POINT_SPEND_RATE))
  })

  it('point price is always greater than earned points for same amount', () => {
    // Spend rate (100) > earn rate (10), so buying with points costs more
    const amount = 49
    expect(calculatePointPrice(amount)).toBeGreaterThan(calculateEarnedPoints(amount))
  })
})

describe('getXpForLevel', () => {
  it('returns positive XP for level 1', () => {
    expect(getXpForLevel(1)).toBeGreaterThan(0)
    expect(getXpForLevel(1)).toBe(Math.floor(LEVEL_BASE_XP * Math.pow(1, 1.5)))
  })

  it('XP required increases with each level', () => {
    const xp1 = getXpForLevel(1)
    const xp2 = getXpForLevel(2)
    const xp3 = getXpForLevel(3)
    expect(xp2).toBeGreaterThan(xp1)
    expect(xp3).toBeGreaterThan(xp2)
  })

  it('level 1 XP matches formula: floor(BASE * 1^1.5)', () => {
    expect(getXpForLevel(1)).toBe(LEVEL_BASE_XP)
  })

  it('level 2 XP matches formula', () => {
    expect(getXpForLevel(2)).toBe(Math.floor(LEVEL_BASE_XP * Math.pow(2, 1.5)))
  })

  it('level 5 XP is significantly higher than level 1', () => {
    expect(getXpForLevel(5)).toBeGreaterThan(getXpForLevel(1) * 3)
  })
})

describe('Constants', () => {
  it('POINT_EARN_RATE is 10 (1 PLN = 10 points)', () => {
    expect(POINT_EARN_RATE).toBe(10)
  })

  it('POINT_SPEND_RATE is 100 (100 points = 1 PLN)', () => {
    expect(POINT_SPEND_RATE).toBe(100)
  })

  it('POINTS_DAILY_LOGIN is positive', () => {
    expect(POINTS_DAILY_LOGIN).toBeGreaterThan(0)
  })

  it('LEVEL_BASE_XP is 1000', () => {
    expect(LEVEL_BASE_XP).toBe(1000)
  })

  it('spend rate is 10x earn rate (anti-inflation design)', () => {
    // This ensures points are worth less when spending than earning
    // preventing inflation: you earn 10pts/PLN but need 100pts to spend 1PLN
    expect(POINT_SPEND_RATE / POINT_EARN_RATE).toBe(10)
  })
})

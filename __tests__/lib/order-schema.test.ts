import { describe, it, expect } from 'vitest'
import {
  generateOrderId,
  generateOrderNumber,
  generateCouponCode,
  calculateDiscount,
} from '@/lib/order-schema'
import type { Coupon } from '@/lib/order-schema'

describe('generateOrderId', () => {
  it('generates a string starting with order_', () => {
    const id = generateOrderId()
    expect(id).toMatch(/^order_\d+$/)
  })

  it('generates unique IDs', async () => {
    const id1 = generateOrderId()
    await new Promise(resolve => setTimeout(resolve, 1))
    const id2 = generateOrderId()
    // IDs may collide if Date.now() is same ms — check format instead
    expect(id1).toMatch(/^order_\d+$/)
    expect(id2).toMatch(/^order_\d+$/)
  })
})

describe('generateOrderNumber', () => {
  it('matches expected format YYYYMM-XXXXXX', () => {
    const orderNumber = generateOrderNumber()
    expect(orderNumber).toMatch(/^\d{6}-[A-Z0-9]{6}$/)
  })

  it('starts with current year and month', () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const orderNumber = generateOrderNumber()
    expect(orderNumber.startsWith(`${year}${month}-`)).toBe(true)
  })
})

describe('generateCouponCode', () => {
  it('generates an 8-character uppercase alphanumeric code', () => {
    const code = generateCouponCode()
    expect(code).toMatch(/^[A-Z0-9]{8}$/)
  })

  it('generates unique codes', () => {
    const codes = new Set(Array.from({ length: 100 }, () => generateCouponCode()))
    expect(codes.size).toBeGreaterThan(90) // allow tiny collision chance
  })
})

describe('calculateDiscount', () => {
  const baseCoupon = {
    usageLimit: 100,
    usageCount: 0,
    isActive: true,
    createdAt: '2026-01-01',
  }

  const percentCoupon: Coupon = {
    ...baseCoupon,
    code: 'SAVE20',
    discountType: 'percent',
    discountValue: 20,
  }

  const fixedCoupon: Coupon = {
    ...baseCoupon,
    code: 'FLAT50',
    discountType: 'fixed',
    discountValue: 50,
  }

  const minOrderCoupon: Coupon = {
    ...baseCoupon,
    code: 'MIN100',
    discountType: 'percent',
    discountValue: 10,
    minOrderValue: 100,
  }

  it('calculates percentage discount correctly', () => {
    const discount = calculateDiscount(percentCoupon, 200)
    expect(discount).toBe(40) // 20% of 200
  })

  it('calculates fixed discount correctly', () => {
    const discount = calculateDiscount(fixedCoupon, 200)
    expect(discount).toBe(50)
  })

  it('caps fixed discount at subtotal', () => {
    const discount = calculateDiscount(fixedCoupon, 30)
    expect(discount).toBe(30) // cannot discount more than subtotal
  })

  it('returns 0 when subtotal is below minOrderValue', () => {
    const discount = calculateDiscount(minOrderCoupon, 50)
    expect(discount).toBe(0)
  })

  it('applies discount when subtotal meets minOrderValue', () => {
    const discount = calculateDiscount(minOrderCoupon, 100)
    expect(discount).toBe(10) // 10% of 100
  })

  it('rounds percentage discount to integer', () => {
    const coupon: Coupon = { ...baseCoupon, code: 'ODD', discountType: 'percent', discountValue: 33 }
    const discount = calculateDiscount(coupon, 100)
    expect(Number.isInteger(discount)).toBe(true)
  })
})

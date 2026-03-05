import { describe, it, expect, beforeEach, vi } from 'vitest'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'

// Reset module state between tests by mocking the store
beforeEach(() => {
  // Use unique identifiers per test to avoid state leakage
})

describe('checkRateLimit', () => {
  it('allows first request within limit', () => {
    const result = checkRateLimit(`test-ip-${Date.now()}-1`, { limit: 3, windowSecs: 60 })
    expect(result.success).toBe(true)
    expect(result.remaining).toBe(2)
  })

  it('allows requests up to the limit', () => {
    const id = `test-ip-${Date.now()}-2`
    checkRateLimit(id, { limit: 3, windowSecs: 60 })
    checkRateLimit(id, { limit: 3, windowSecs: 60 })
    const result = checkRateLimit(id, { limit: 3, windowSecs: 60 })
    expect(result.success).toBe(true)
    expect(result.remaining).toBe(0)
  })

  it('blocks requests exceeding the limit', () => {
    const id = `test-ip-${Date.now()}-3`
    checkRateLimit(id, { limit: 2, windowSecs: 60 })
    checkRateLimit(id, { limit: 2, windowSecs: 60 })
    const result = checkRateLimit(id, { limit: 2, windowSecs: 60 })
    expect(result.success).toBe(false)
    expect(result.remaining).toBe(0)
  })

  it('uses default config when none provided', () => {
    const id = `test-ip-${Date.now()}-4`
    const result = checkRateLimit(id)
    expect(result.success).toBe(true)
    expect(result.remaining).toBe(4) // default limit is 5
  })

  it('resets window after expiry', async () => {
    const id = `test-ip-${Date.now()}-5`
    // Fill up the limit with a 1-second window
    checkRateLimit(id, { limit: 1, windowSecs: 0 }) // 0 seconds = immediate expiry
    // Wait a tiny bit for expiry
    await new Promise(resolve => setTimeout(resolve, 10))
    const result = checkRateLimit(id, { limit: 1, windowSecs: 60 })
    expect(result.success).toBe(true)
  })

  it('tracks different identifiers independently', () => {
    const id1 = `test-ip-${Date.now()}-6a`
    const id2 = `test-ip-${Date.now()}-6b`
    checkRateLimit(id1, { limit: 1, windowSecs: 60 })
    checkRateLimit(id1, { limit: 1, windowSecs: 60 }) // blocked
    const result = checkRateLimit(id2, { limit: 1, windowSecs: 60 })
    expect(result.success).toBe(true) // different id, should pass
  })
})

describe('getClientIp', () => {
  it('extracts IP from x-forwarded-for header', () => {
    const req = new Request('http://localhost', {
      headers: { 'x-forwarded-for': '192.168.1.1, 10.0.0.1' }
    })
    expect(getClientIp(req)).toBe('192.168.1.1')
  })

  it('falls back to x-real-ip header', () => {
    const req = new Request('http://localhost', {
      headers: { 'x-real-ip': '10.0.0.5' }
    })
    expect(getClientIp(req)).toBe('10.0.0.5')
  })

  it('returns unknown when no IP headers present', () => {
    const req = new Request('http://localhost')
    expect(getClientIp(req)).toBe('unknown')
  })

  it('handles multiple IPs in x-forwarded-for and returns first', () => {
    const req = new Request('http://localhost', {
      headers: { 'x-forwarded-for': '1.2.3.4, 5.6.7.8, 9.10.11.12' }
    })
    expect(getClientIp(req)).toBe('1.2.3.4')
  })
})

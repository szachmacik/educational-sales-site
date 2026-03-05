import { describe, it, expect } from 'vitest'
import { formatPrice, getCurrencyConfig, CURRENCIES } from '@/lib/currency'

describe('getCurrencyConfig', () => {
  it('returns PLN config for Polish language', () => {
    const config = getCurrencyConfig('pl')
    expect(config.code).toBe('PLN')
    expect(config.symbol).toBe('zł')
    expect(config.rate).toBe(1)
  })

  it('returns USD config for English language', () => {
    const config = getCurrencyConfig('en')
    expect(config.code).toBe('USD')
    expect(config.symbol).toBe('$')
  })

  it('returns EUR config for German language', () => {
    const config = getCurrencyConfig('de')
    expect(config.code).toBe('EUR')
    expect(config.symbol).toBe('€')
  })

  it('falls back to USD for unknown language', () => {
    const config = getCurrencyConfig('xx' as any)
    expect(config.code).toBe('USD')
  })

  it('has configs for all 25 supported languages', () => {
    const languages = ['pl', 'en', 'uk', 'de', 'es', 'fr', 'it', 'cs', 'sk', 'ro', 'hu', 'pt', 'lt', 'lv', 'et', 'hr', 'sr', 'sl', 'bg', 'el', 'nl', 'sv', 'fi', 'no', 'da']
    languages.forEach(lang => {
      expect(CURRENCIES[lang]).toBeDefined()
    })
  })
})

describe('formatPrice', () => {
  it('formats PLN price correctly', () => {
    const result = formatPrice(99, 'pl')
    expect(result).toBe('99.00 zł')
  })

  it('formats USD price with dollar sign prefix', () => {
    const result = formatPrice(100, 'en')
    // 100 PLN * 0.25 = 25 USD
    expect(result).toBe('$25.00')
  })

  it('formats HUF price without decimal places', () => {
    const result = formatPrice(100, 'hu')
    // 100 PLN * 90 = 9000 HUF (with thousands separator)
    expect(result).toBe('9 000 Ft')
  })

  it('handles string input', () => {
    const result = formatPrice('49.99', 'pl')
    expect(result).toBe('49.99 zł')
  })

  it('returns 0.00 for NaN input', () => {
    const result = formatPrice('invalid', 'pl')
    expect(result).toBe('0.00')
  })

  it('adds thousands separator for large values', () => {
    const result = formatPrice(10000, 'pl')
    expect(result).toBe('10 000.00 zł')
  })

  it('formats zero correctly', () => {
    const result = formatPrice(0, 'pl')
    expect(result).toBe('0.00 zł')
  })
})

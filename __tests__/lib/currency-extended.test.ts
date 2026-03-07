import { describe, it, expect } from 'vitest'
import { getCurrencyConfig, formatPrice, CURRENCIES } from '@/lib/currency'
import type { Language } from '@/lib/translations'

describe('CURRENCIES map', () => {
  it('has entries for all 25 supported languages', () => {
    const expectedLanguages: Language[] = [
      'pl', 'en', 'uk', 'de', 'fr', 'es', 'it', 'cs', 'sk', 'ro',
      'hu', 'pt', 'lt', 'lv', 'et', 'hr', 'sr', 'sl', 'bg', 'el',
      'nl', 'sv', 'fi', 'no', 'da'
    ]
    expectedLanguages.forEach(lang => {
      expect(CURRENCIES).toHaveProperty(lang)
    })
  })

  it('each currency has required fields', () => {
    Object.entries(CURRENCIES).forEach(([lang, config]) => {
      expect(config).toHaveProperty('code')
      expect(config).toHaveProperty('symbol')
      expect(config).toHaveProperty('rate')
      expect(config).toHaveProperty('format')
      expect(typeof config.code).toBe('string')
      expect(typeof config.symbol).toBe('string')
      expect(typeof config.rate).toBe('number')
      expect(config.rate).toBeGreaterThan(0)
    })
  })

  it('PLN has rate of 1 (base currency)', () => {
    expect(CURRENCIES.pl.rate).toBe(1)
    expect(CURRENCIES.pl.code).toBe('PLN')
  })

  it('EUR countries share the same rate', () => {
    const eurLanguages: Language[] = ['de', 'fr', 'es', 'it', 'sk', 'lt', 'lv', 'et', 'sl', 'el', 'hr', 'pt', 'nl', 'fi']
    const eurRate = CURRENCIES.de.rate
    eurLanguages.forEach(lang => {
      expect(CURRENCIES[lang].rate).toBe(eurRate)
      expect(CURRENCIES[lang].code).toBe('EUR')
    })
  })
})

describe('getCurrencyConfig', () => {
  it('returns PLN config for Polish', () => {
    const config = getCurrencyConfig('pl')
    expect(config.code).toBe('PLN')
    expect(config.symbol).toBe('zł')
    expect(config.rate).toBe(1)
  })

  it('returns USD config for English', () => {
    const config = getCurrencyConfig('en')
    expect(config.code).toBe('USD')
    expect(config.symbol).toBe('$')
  })

  it('returns EUR config for German', () => {
    const config = getCurrencyConfig('de')
    expect(config.code).toBe('EUR')
    expect(config.symbol).toBe('€')
  })

  it('returns UAH config for Ukrainian', () => {
    const config = getCurrencyConfig('uk')
    expect(config.code).toBe('UAH')
    expect(config.symbol).toBe('₴')
  })

  it('falls back to USD for unknown language', () => {
    // @ts-expect-error testing invalid input
    const config = getCurrencyConfig('xx')
    expect(config.code).toBe('USD')
  })
})

describe('formatPrice', () => {
  it('formats PLN price correctly', () => {
    const result = formatPrice(49, 'pl')
    expect(result).toContain('zł')
    // PLN uses {value} {symbol} format
    expect(result).toMatch(/\d+.*zł/)
  })

  it('formats USD price with dollar sign', () => {
    const result = formatPrice(49, 'en')
    expect(result).toContain('$')
  })

  it('formats EUR price for German', () => {
    const result = formatPrice(49, 'de')
    expect(result).toContain('€')
  })

  it('converts PLN to target currency', () => {
    // 49 PLN at EUR rate 0.23 = ~11.27 EUR
    const plnResult = formatPrice(49, 'pl')
    const eurResult = formatPrice(49, 'de')
    // EUR price should be numerically smaller than PLN price
    // (since EUR rate < 1 relative to PLN)
    const plnNum = parseFloat(plnResult.replace(/[^\d.,]/g, '').replace(',', '.'))
    const eurNum = parseFloat(eurResult.replace(/[^\d.,]/g, '').replace(',', '.'))
    expect(eurNum).toBeLessThan(plnNum)
  })

  it('returns a non-empty string for all supported languages', () => {
    const languages: Language[] = [
      'pl', 'en', 'uk', 'de', 'fr', 'es', 'it', 'cs', 'sk', 'ro',
      'hu', 'pt', 'lt', 'lv', 'et', 'hr', 'sr', 'sl', 'bg', 'el',
      'nl', 'sv', 'fi', 'no', 'da'
    ]
    languages.forEach(lang => {
      const result = formatPrice(49, lang)
      expect(result).toBeTruthy()
      expect(result.length).toBeGreaterThan(0)
    })
  })

  it('handles zero price', () => {
    const result = formatPrice(0, 'pl')
    expect(result).toBeTruthy()
    expect(result).toContain('0')
  })
})

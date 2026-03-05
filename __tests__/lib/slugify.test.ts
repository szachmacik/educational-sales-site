import { describe, it, expect } from 'vitest'
import { slugify } from '@/lib/slugify'

describe('slugify', () => {
  it('converts basic text to slug', () => {
    expect(slugify('Hello World')).toBe('hello-world')
  })

  it('converts Polish characters', () => {
    expect(slugify('Ćwiczenia językowe')).toBe('cwiczenia-jezykowe')
    expect(slugify('Łódź')).toBe('lodz')
    expect(slugify('Źródło')).toBe('zrodlo')
    expect(slugify('Świętokrzyski')).toBe('swietokrzyski')
  })

  it('removes special characters', () => {
    expect(slugify('Hello! World?')).toBe('hello-world')
    expect(slugify('Price: 99.99 zł')).toBe('price-9999-zl')
  })

  it('replaces multiple spaces with single dash', () => {
    expect(slugify('Hello   World')).toBe('hello-world')
  })

  it('replaces multiple dashes with single dash', () => {
    expect(slugify('Hello--World')).toBe('hello-world')
  })

  it('trims whitespace', () => {
    expect(slugify('  Hello World  ')).toBe('hello-world')
  })

  it('handles empty string', () => {
    expect(slugify('')).toBe('')
  })

  it('handles numbers', () => {
    expect(slugify('Pakiet 2w1')).toBe('pakiet-2w1')
  })

  it('converts to lowercase', () => {
    expect(slugify('MEGA PACK')).toBe('mega-pack')
  })

  it('handles product names from catalog', () => {
    expect(slugify('Mega Pack 2w1: Scenariusze + PDF')).toBe('mega-pack-2w1-scenariusze-pdf')
    // Multiple dashes are normalized to single dash by slugify
    expect(slugify('Projekt Stories - Ebooki Audio')).toBe('projekt-stories-ebooki-audio')
  })
})

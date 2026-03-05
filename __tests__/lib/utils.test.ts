import { describe, it, expect } from 'vitest'
import { cn, deepMerge } from '@/lib/utils'

describe('cn (className merger)', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('handles conditional classes', () => {
    expect(cn('base', false && 'hidden', 'visible')).toBe('base visible')
  })

  it('deduplicates Tailwind classes (last wins)', () => {
    expect(cn('p-4', 'p-8')).toBe('p-8')
  })

  it('handles undefined and null gracefully', () => {
    expect(cn('base', undefined, null, 'extra')).toBe('base extra')
  })

  it('handles empty input', () => {
    expect(cn()).toBe('')
  })

  it('merges conflicting Tailwind utilities correctly', () => {
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
  })
})

describe('deepMerge', () => {
  it('merges flat objects', () => {
    const result = deepMerge({ a: 1 }, { b: 2 })
    expect(result).toEqual({ a: 1, b: 2 })
  })

  it('overrides existing keys with source values', () => {
    const result = deepMerge({ a: 1, b: 2 }, { b: 99 })
    expect(result).toEqual({ a: 1, b: 99 })
  })

  it('deep merges nested objects', () => {
    const target = { a: { x: 1, y: 2 } }
    const source = { a: { y: 99, z: 3 } }
    const result = deepMerge(target, source)
    expect(result).toEqual({ a: { x: 1, y: 99, z: 3 } })
  })

  it('does not mutate original objects', () => {
    const target = { a: 1 }
    const source = { b: 2 }
    deepMerge(target, source)
    expect(target).toEqual({ a: 1 })
  })

  it('handles null source gracefully', () => {
    const result = deepMerge({ a: 1 }, null)
    expect(result).toEqual({ a: 1 })
  })

  it('handles arrays as values (does not deep merge arrays)', () => {
    const result = deepMerge({ a: [1, 2] }, { a: [3, 4] })
    expect(result.a).toEqual([3, 4])
  })

  it('merges translation dictionaries correctly', () => {
    const base = { nav: { home: 'Home', about: 'About' }, footer: { contact: 'Contact' } }
    const override = { nav: { home: 'Strona główna' }, cta: { buy: 'Kup teraz' } }
    const result = deepMerge(base, override)
    expect(result.nav.home).toBe('Strona główna')
    expect(result.nav.about).toBe('About') // preserved
    expect(result.footer.contact).toBe('Contact') // preserved
    expect(result.cta.buy).toBe('Kup teraz') // added
  })
})

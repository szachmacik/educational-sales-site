import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { adminPasswordResetEmail, orderConfirmationEmail } from '@/lib/email'

// We test only the pure template functions (no network calls)
// sendEmail() requires real network access and is tested via integration tests

describe('adminPasswordResetEmail', () => {
  beforeEach(() => {
    process.env.ADMIN_EMAIL = 'admin@example.com'
  })

  afterEach(() => {
    delete process.env.ADMIN_EMAIL
  })

  it('returns an EmailPayload with the correct recipient', () => {
    const payload = adminPasswordResetEmail('TestPass123!')
    expect(payload.to).toBe('admin@example.com')
  })

  it('includes the password in the HTML body', () => {
    const payload = adminPasswordResetEmail('MySecret42')
    expect(payload.html).toContain('MySecret42')
  })

  it('includes the password in the text body', () => {
    const payload = adminPasswordResetEmail('MySecret42')
    expect(payload.text).toContain('MySecret42')
  })

  it('has a non-empty subject', () => {
    const payload = adminPasswordResetEmail('pass')
    expect(payload.subject).toBeTruthy()
    expect(payload.subject.length).toBeGreaterThan(5)
  })

  it('HTML contains the admin login URL', () => {
    const payload = adminPasswordResetEmail('pass')
    expect(payload.html).toContain('kamila.ofshore.dev')
  })

  it('falls back to empty string when ADMIN_EMAIL is not set', () => {
    delete process.env.ADMIN_EMAIL
    const payload = adminPasswordResetEmail('pass')
    expect(payload.to).toBe('')
  })
})

describe('orderConfirmationEmail', () => {
  it('returns an EmailPayload with the correct recipient', () => {
    const payload = orderConfirmationEmail(
      'customer@example.com',
      'Jan Kowalski',
      'ORD-001',
      ['SpeakBook'],
      '49 zł'
    )
    expect(payload.to).toBe('customer@example.com')
  })

  it('includes customer name in the HTML', () => {
    const payload = orderConfirmationEmail(
      'customer@example.com',
      'Anna Nowak',
      'ORD-002',
      ['Mega Pack'],
      '99 zł'
    )
    expect(payload.html).toContain('Anna Nowak')
  })

  it('includes order ID in the subject', () => {
    const payload = orderConfirmationEmail(
      'customer@example.com',
      'Jan',
      'ORD-XYZ-123',
      ['SpeakBook'],
      '49 zł'
    )
    expect(payload.subject).toContain('ORD-XYZ-123')
  })

  it('includes all product names in the HTML', () => {
    const products = ['SpeakBook Pro', 'Mega Pack', 'Kurs Podstawowy']
    const payload = orderConfirmationEmail(
      'customer@example.com',
      'Jan',
      'ORD-003',
      products,
      '199 zł'
    )
    products.forEach(product => {
      expect(payload.html).toContain(product)
    })
  })

  it('includes total price in the HTML', () => {
    const payload = orderConfirmationEmail(
      'customer@example.com',
      'Jan',
      'ORD-004',
      ['SpeakBook'],
      '149 zł'
    )
    expect(payload.html).toContain('149 zł')
  })

  it('includes product names in the text body', () => {
    const payload = orderConfirmationEmail(
      'customer@example.com',
      'Jan',
      'ORD-005',
      ['SpeakBook', 'Mega Pack'],
      '99 zł'
    )
    expect(payload.text).toContain('SpeakBook')
    expect(payload.text).toContain('Mega Pack')
  })

  it('handles empty products array gracefully', () => {
    const payload = orderConfirmationEmail(
      'customer@example.com',
      'Jan',
      'ORD-006',
      [],
      '0 zł'
    )
    expect(payload.html).toBeTruthy()
    expect(payload.to).toBe('customer@example.com')
  })

  it('has a non-empty subject', () => {
    const payload = orderConfirmationEmail(
      'customer@example.com',
      'Jan',
      'ORD-007',
      ['SpeakBook'],
      '49 zł'
    )
    expect(payload.subject.length).toBeGreaterThan(10)
  })
})

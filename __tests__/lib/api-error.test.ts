/**
 * Tests for lib/api-error.ts
 * Covers: ApiError class, apiResponse helpers, withErrorHandler middleware,
 * requireFields, parseBody, getQueryParam
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import {
  ApiError,
  apiResponse,
  withErrorHandler,
  requireFields,
  parseBody,
  getQueryParam,
  logApiError,
} from '@/lib/api-error'

// ─── ApiError class ───────────────────────────────────────────────────────────

describe('ApiError', () => {
  it('creates error with correct code and status', () => {
    const err = new ApiError('NOT_FOUND', 'Resource not found')
    expect(err.code).toBe('NOT_FOUND')
    expect(err.status).toBe(404)
    expect(err.message).toBe('Resource not found')
    expect(err.name).toBe('ApiError')
  })

  it('maps all error codes to correct HTTP status', () => {
    const cases: Array<[import('@/lib/api-error').ApiErrorCode, number]> = [
      ['UNAUTHORIZED', 401],
      ['FORBIDDEN', 403],
      ['TOKEN_EXPIRED', 401],
      ['INVALID_TOKEN', 401],
      ['VALIDATION_ERROR', 400],
      ['MISSING_FIELD', 400],
      ['INVALID_FORMAT', 400],
      ['NOT_FOUND', 404],
      ['ALREADY_EXISTS', 409],
      ['CONFLICT', 409],
      ['RATE_LIMITED', 429],
      ['PAYMENT_FAILED', 402],
      ['PAYMENT_REQUIRED', 402],
      ['INVALID_COUPON', 400],
      ['INTERNAL_ERROR', 500],
      ['SERVICE_UNAVAILABLE', 503],
      ['NOT_IMPLEMENTED', 501],
      ['METHOD_NOT_ALLOWED', 405],
    ]
    for (const [code, status] of cases) {
      const err = new ApiError(code, 'test')
      expect(err.status, `${code} should map to ${status}`).toBe(status)
    }
  })

  it('stores context and headers', () => {
    const err = new ApiError('RATE_LIMITED', 'Too many requests', { ip: '1.2.3.4' }, { 'Retry-After': '60' })
    expect(err.context).toEqual({ ip: '1.2.3.4' })
    expect(err.headers).toEqual({ 'Retry-After': '60' })
  })

  it('toJSON includes context when includeContext=true', () => {
    const err = new ApiError('NOT_FOUND', 'Not found', { id: 'abc' })
    const json = err.toJSON(true)
    expect(json.error.code).toBe('NOT_FOUND')
    expect(json.error.message).toBe('Not found')
    expect(json.error.context).toEqual({ id: 'abc' })
  })

  it('toJSON omits context when includeContext=false', () => {
    const err = new ApiError('NOT_FOUND', 'Not found', { id: 'abc' })
    const json = err.toJSON(false)
    expect(json.error.context).toBeUndefined()
  })

  it('is instanceof Error', () => {
    const err = new ApiError('INTERNAL_ERROR', 'Oops')
    expect(err).toBeInstanceOf(Error)
    expect(err).toBeInstanceOf(ApiError)
  })
})

// ─── apiResponse helpers ──────────────────────────────────────────────────────

describe('apiResponse', () => {
  it('ok() returns 200 with data', async () => {
    const res = apiResponse.ok({ id: 1 })
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.data).toEqual({ id: 1 })
  })

  it('ok() includes meta when provided', async () => {
    const res = apiResponse.ok([1, 2, 3], { total: 3, page: 1 })
    const body = await res.json()
    expect(body.meta).toEqual({ total: 3, page: 1 })
  })

  it('created() returns 201 with data', async () => {
    const res = apiResponse.created({ id: 'new' })
    expect(res.status).toBe(201)
    const body = await res.json()
    expect(body.data).toEqual({ id: 'new' })
  })

  it('noContent() returns 204 with no body', async () => {
    const res = apiResponse.noContent()
    expect(res.status).toBe(204)
    const text = await res.text()
    expect(text).toBe('')
  })

  it('fromError() returns correct status and error body', async () => {
    const err = new ApiError('FORBIDDEN', 'Access denied')
    const res = apiResponse.fromError(err)
    expect(res.status).toBe(403)
    const body = await res.json()
    expect(body.error.code).toBe('FORBIDDEN')
    expect(body.error.message).toBe('Access denied')
  })

  it('error() shorthand creates correct response', async () => {
    const res = apiResponse.error('UNAUTHORIZED', 'Please log in')
    expect(res.status).toBe(401)
    const body = await res.json()
    expect(body.error.code).toBe('UNAUTHORIZED')
  })
})

// ─── withErrorHandler ─────────────────────────────────────────────────────────

describe('withErrorHandler', () => {
  const makeRequest = (url = 'https://example.com/api/test') =>
    new NextRequest(url, { method: 'GET' })

  it('passes through successful handler response', async () => {
    const handler = withErrorHandler(async () => apiResponse.ok({ ok: true }))
    const res = await handler(makeRequest())
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.data).toEqual({ ok: true })
  })

  it('catches ApiError and returns typed response', async () => {
    const handler = withErrorHandler(async () => {
      throw new ApiError('NOT_FOUND', 'Item not found')
    })
    const res = await handler(makeRequest())
    expect(res.status).toBe(404)
    const body = await res.json()
    expect(body.error.code).toBe('NOT_FOUND')
  })

  it('catches unknown errors and returns 500', async () => {
    const handler = withErrorHandler(async () => {
      throw new Error('Something exploded')
    })
    const res = await handler(makeRequest())
    expect(res.status).toBe(500)
    const body = await res.json()
    expect(body.error.code).toBe('INTERNAL_ERROR')
  })

  it('passes context params to handler', async () => {
    const handler = withErrorHandler(async (_req, ctx) => {
      return apiResponse.ok({ id: ctx?.params?.id })
    })
    const res = await handler(makeRequest(), { params: { id: 'abc-123' } })
    const body = await res.json()
    expect(body.data.id).toBe('abc-123')
  })
})

// ─── requireFields ────────────────────────────────────────────────────────────

describe('requireFields', () => {
  it('does not throw when all fields are present', () => {
    expect(() => requireFields({ email: 'a@b.com', name: 'Jan' }, ['email', 'name'])).not.toThrow()
  })

  it('throws MISSING_FIELD when a field is missing', () => {
    expect(() => requireFields({ email: 'a@b.com' }, ['email', 'name'])).toThrow(ApiError)
    try {
      requireFields({ email: 'a@b.com' }, ['email', 'name'])
    } catch (err) {
      expect(err).toBeInstanceOf(ApiError)
      if (err instanceof ApiError) {
        expect(err.code).toBe('MISSING_FIELD')
        expect(err.context?.missing).toEqual(['name'])
      }
    }
  })

  it('throws when field is empty string', () => {
    expect(() => requireFields({ email: '' }, ['email'])).toThrow(ApiError)
  })

  it('throws when field is null', () => {
    expect(() => requireFields({ email: null }, ['email'])).toThrow(ApiError)
  })

  it('does not throw for empty fields array', () => {
    expect(() => requireFields({}, [])).not.toThrow()
  })
})

// ─── parseBody ────────────────────────────────────────────────────────────────

describe('parseBody', () => {
  it('parses valid JSON body', async () => {
    const req = new NextRequest('https://example.com/api', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@example.com' }),
      headers: { 'Content-Type': 'application/json' },
    })
    const body = await parseBody(req)
    expect(body.email).toBe('test@example.com')
  })

  it('throws VALIDATION_ERROR for invalid JSON', async () => {
    const req = new NextRequest('https://example.com/api', {
      method: 'POST',
      body: 'not json',
      headers: { 'Content-Type': 'application/json' },
    })
    await expect(parseBody(req)).rejects.toThrow(ApiError)
    try {
      await parseBody(req)
    } catch (err) {
      if (err instanceof ApiError) {
        expect(err.code).toBe('VALIDATION_ERROR')
      }
    }
  })
})

// ─── getQueryParam ────────────────────────────────────────────────────────────

describe('getQueryParam', () => {
  it('returns query parameter value', () => {
    const req = new NextRequest('https://example.com/api?page=2')
    expect(getQueryParam(req, 'page')).toBe('2')
  })

  it('throws MISSING_FIELD when required param is absent', () => {
    const req = new NextRequest('https://example.com/api')
    expect(() => getQueryParam(req, 'page')).toThrow(ApiError)
    try {
      getQueryParam(req, 'page')
    } catch (err) {
      if (err instanceof ApiError) {
        expect(err.code).toBe('MISSING_FIELD')
      }
    }
  })

  it('returns undefined when optional param is absent', () => {
    const req = new NextRequest('https://example.com/api')
    expect(getQueryParam(req, 'page', false)).toBeUndefined()
  })
})

// ─── logApiError ─────────────────────────────────────────────────────────────

describe('logApiError', () => {
  it('calls console.error for 5xx errors', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const err = new ApiError('INTERNAL_ERROR', 'Server crashed')
    logApiError(err)
    expect(spy).toHaveBeenCalled()
    spy.mockRestore()
  })

  it('calls console.warn for 4xx errors', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const err = new ApiError('NOT_FOUND', 'Not found')
    logApiError(err)
    expect(spy).toHaveBeenCalled()
    spy.mockRestore()
  })
})

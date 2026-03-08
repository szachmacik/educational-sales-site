/**
 * Typed API error handling for Zoney educational platform.
 *
 * Provides:
 * - `ApiError` class — typed errors with HTTP status codes and error codes
 * - `withErrorHandler()` — middleware wrapper for API route handlers
 * - `apiResponse()` — consistent JSON response helpers
 * - `logApiError()` — structured server-side error logging
 *
 * @module api-error
 *
 * @example
 * // app/api/orders/route.ts
 * import { withErrorHandler, ApiError, apiResponse } from '@/lib/api-error'
 *
 * export const GET = withErrorHandler(async (req) => {
 *   const orders = await getOrders()
 *   if (!orders) throw new ApiError('NOT_FOUND', 'No orders found')
 *   return apiResponse.ok(orders)
 * })
 */

import { NextRequest, NextResponse } from 'next/server'

// ─────────────────────────────────────────────────────────────────────────────
// ERROR CODES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Standardized error codes used across all API routes.
 * Maps to HTTP status codes via `ERROR_STATUS_MAP`.
 */
export type ApiErrorCode =
  // Auth
  | 'UNAUTHORIZED'          // 401 — not logged in
  | 'FORBIDDEN'             // 403 — logged in but no permission
  | 'TOKEN_EXPIRED'         // 401 — JWT/session expired
  | 'INVALID_TOKEN'         // 401 — malformed token
  // Validation
  | 'VALIDATION_ERROR'      // 400 — request body/params invalid
  | 'MISSING_FIELD'         // 400 — required field missing
  | 'INVALID_FORMAT'        // 400 — field format invalid (email, UUID, etc.)
  // Resources
  | 'NOT_FOUND'             // 404 — resource not found
  | 'ALREADY_EXISTS'        // 409 — duplicate resource
  | 'CONFLICT'              // 409 — state conflict
  // Rate limiting
  | 'RATE_LIMITED'          // 429 — too many requests
  // Payments
  | 'PAYMENT_FAILED'        // 402 — payment processing failed
  | 'PAYMENT_REQUIRED'      // 402 — payment required to access resource
  | 'INVALID_COUPON'        // 400 — coupon code invalid or expired
  // Server
  | 'INTERNAL_ERROR'        // 500 — unexpected server error
  | 'SERVICE_UNAVAILABLE'   // 503 — external service down
  | 'NOT_IMPLEMENTED'       // 501 — feature not yet implemented
  | 'METHOD_NOT_ALLOWED'    // 405 — wrong HTTP method

const ERROR_STATUS_MAP: Record<ApiErrorCode, number> = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  TOKEN_EXPIRED: 401,
  INVALID_TOKEN: 401,
  VALIDATION_ERROR: 400,
  MISSING_FIELD: 400,
  INVALID_FORMAT: 400,
  NOT_FOUND: 404,
  ALREADY_EXISTS: 409,
  CONFLICT: 409,
  RATE_LIMITED: 429,
  PAYMENT_FAILED: 402,
  PAYMENT_REQUIRED: 402,
  INVALID_COUPON: 400,
  INTERNAL_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
  NOT_IMPLEMENTED: 501,
  METHOD_NOT_ALLOWED: 405,
}

// ─────────────────────────────────────────────────────────────────────────────
// API ERROR CLASS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Typed API error that maps to an HTTP status code.
 *
 * @example
 * throw new ApiError('NOT_FOUND', 'Order not found', { orderId: 'ORD-123' })
 * throw new ApiError('VALIDATION_ERROR', 'Email is required', { field: 'email' })
 * throw new ApiError('RATE_LIMITED', 'Too many requests', undefined, { retryAfter: 60 })
 */
export class ApiError extends Error {
  /** Standardized error code */
  readonly code: ApiErrorCode
  /** HTTP status code derived from error code */
  readonly status: number
  /** Additional context data (not exposed to client in production) */
  readonly context?: Record<string, unknown>
  /** Additional headers to include in the response (e.g., Retry-After) */
  readonly headers?: Record<string, string>

  constructor(
    code: ApiErrorCode,
    message: string,
    context?: Record<string, unknown>,
    headers?: Record<string, string>
  ) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.status = ERROR_STATUS_MAP[code] ?? 500
    this.context = context
    this.headers = headers
  }

  /**
   * Converts the error to a JSON-serializable response body.
   * In production, context is omitted to prevent information leakage.
   */
  toJSON(includeContext = process.env.NODE_ENV !== 'production'): ApiErrorResponse {
    return {
      error: {
        code: this.code,
        message: this.message,
        ...(includeContext && this.context ? { context: this.context } : {}),
      },
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// RESPONSE TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface ApiErrorResponse {
  error: {
    code: ApiErrorCode
    message: string
    context?: Record<string, unknown>
  }
}

export interface ApiSuccessResponse<T = unknown> {
  data: T
  meta?: {
    total?: number
    page?: number
    perPage?: number
    [key: string]: unknown
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// RESPONSE HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Consistent JSON response factory for API routes.
 *
 * @example
 * return apiResponse.ok({ orders: [...] })
 * return apiResponse.created({ id: 'new-id' })
 * return apiResponse.noContent()
 * return apiResponse.error('NOT_FOUND', 'Order not found')
 */
export const apiResponse = {
  /**
   * 200 OK — successful GET/PUT/PATCH
   */
  ok<T>(data: T, meta?: ApiSuccessResponse['meta']): NextResponse {
    return NextResponse.json({ data, ...(meta ? { meta } : {}) }, { status: 200 })
  },

  /**
   * 201 Created — successful POST that creates a resource
   */
  created<T>(data: T): NextResponse {
    return NextResponse.json({ data }, { status: 201 })
  },

  /**
   * 204 No Content — successful DELETE or action with no body
   */
  noContent(): NextResponse {
    return new NextResponse(null, { status: 204 })
  },

  /**
   * Error response from an ApiError instance
   */
  fromError(err: ApiError): NextResponse {
    return NextResponse.json(err.toJSON(), {
      status: err.status,
      headers: err.headers,
    })
  },

  /**
   * Shorthand error response
   */
  error(code: ApiErrorCode, message: string, context?: Record<string, unknown>): NextResponse {
    const err = new ApiError(code, message, context)
    return NextResponse.json(err.toJSON(), { status: err.status })
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// LOGGING
// ─────────────────────────────────────────────────────────────────────────────

export interface ApiErrorLogEntry {
  timestamp: string
  code: ApiErrorCode
  message: string
  status: number
  path?: string
  method?: string
  userId?: string
  context?: Record<string, unknown>
}

/**
 * Logs an API error with structured metadata.
 * In production, use this to send to your logging service (Logtail, Sentry, etc.).
 *
 * @param err - The ApiError instance
 * @param request - Optional NextRequest for path/method context
 * @param userId - Optional authenticated user ID
 */
export function logApiError(
  err: ApiError,
  request?: NextRequest,
  userId?: string
): void {
  const entry: ApiErrorLogEntry = {
    timestamp: new Date().toISOString(),
    code: err.code,
    message: err.message,
    status: err.status,
    path: request?.nextUrl?.pathname,
    method: request?.method,
    userId,
    context: err.context,
  }

  if (err.status >= 500) {
    console.error('[API Error]', JSON.stringify(entry))
  } else if (err.status >= 400) {
    console.warn('[API Warning]', JSON.stringify(entry))
  }

  // TODO: Send to external logging service when LOGTAIL_TOKEN is set
  // if (process.env.LOGTAIL_TOKEN) {
  //   sendToLogtail(entry)
  // }
}

// ─────────────────────────────────────────────────────────────────────────────
// MIDDLEWARE WRAPPER
// ─────────────────────────────────────────────────────────────────────────────

// Next.js 15 route handler context type — params is a Promise (Next.js 15+)
export type RouteContext = { params: Promise<Record<string, string>> }
// RouteHandler accepts optional context to work for both /api/route and /api/[id]/route
type RouteHandler = (
  req: NextRequest,
  context: RouteContext
) => Promise<NextResponse>

/**
 * Wraps an API route handler with automatic error handling.
 *
 * Catches:
 * - `ApiError` instances — returns typed error response
 * - Unknown errors — returns 500 INTERNAL_ERROR
 *
 * Also adds standard response headers (CORS, security).
 *
 * @param handler - The async route handler function
 * @returns Wrapped handler with error handling
 *
 * @example
 * export const GET = withErrorHandler(async (req) => {
 *   const data = await fetchData()
 *   if (!data) throw new ApiError('NOT_FOUND', 'Resource not found')
 *   return apiResponse.ok(data)
 * })
 *
 * @example
 * export const POST = withErrorHandler(async (req) => {
 *   const body = await req.json()
 *   if (!body.email) throw new ApiError('MISSING_FIELD', 'Email is required', { field: 'email' })
 *   const result = await createUser(body)
 *   return apiResponse.created(result)
 * })
 */
export function withErrorHandler(handler: RouteHandler): RouteHandler {
  return async (req: NextRequest, context: RouteContext) => {
    try {
      const response = await handler(req, context)
      return response
    } catch (err) {
      if (err instanceof ApiError) {
        logApiError(err, req)
        return apiResponse.fromError(err)
      }

      // Unknown error — log and return generic 500
      const message = err instanceof Error ? err.message : 'An unexpected error occurred'
      const internalErr = new ApiError('INTERNAL_ERROR', message)
      logApiError(internalErr, req)

      // In development, include the original error message
      if (process.env.NODE_ENV === 'development') {
        return NextResponse.json(
          { error: { code: 'INTERNAL_ERROR', message, stack: err instanceof Error ? err.stack : undefined } },
          { status: 500 }
        )
      }

      return apiResponse.fromError(internalErr)
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// VALIDATION HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Validates that required fields are present in a request body.
 * Throws `ApiError('MISSING_FIELD')` if any field is missing.
 *
 * @param body - Parsed request body object
 * @param fields - List of required field names
 *
 * @example
 * const body = await req.json()
 * requireFields(body, ['email', 'password'])
 */
export function requireFields(
  body: Record<string, unknown>,
  fields: string[]
): void {
  const missing = fields.filter(f => body[f] === undefined || body[f] === null || body[f] === '')
  if (missing.length > 0) {
    throw new ApiError(
      'MISSING_FIELD',
      `Required fields missing: ${missing.join(', ')}`,
      { missing }
    )
  }
}

/**
 * Parses and validates a request body as JSON.
 * Throws `ApiError('VALIDATION_ERROR')` if parsing fails.
 *
 * @param req - NextRequest instance
 * @returns Parsed body as Record<string, unknown>
 *
 * @example
 * const body = await parseBody(req)
 * requireFields(body, ['email'])
 */
export async function parseBody(req: NextRequest): Promise<Record<string, unknown>> {
  try {
    const body = await req.json()
    if (typeof body !== 'object' || body === null) {
      throw new ApiError('VALIDATION_ERROR', 'Request body must be a JSON object')
    }
    return body as Record<string, unknown>
  } catch (err) {
    if (err instanceof ApiError) throw err
    throw new ApiError('VALIDATION_ERROR', 'Invalid JSON in request body')
  }
}

/**
 * Extracts and validates a query parameter from the request URL.
 * Throws `ApiError('MISSING_FIELD')` if the parameter is required but missing.
 *
 * @param req - NextRequest instance
 * @param name - Parameter name
 * @param required - Whether the parameter is required (default: true)
 * @returns Parameter value or undefined
 */
export function getQueryParam(
  req: NextRequest,
  name: string,
  required = true
): string | undefined {
  const value = req.nextUrl.searchParams.get(name) ?? undefined
  if (required && !value) {
    throw new ApiError('MISSING_FIELD', `Query parameter '${name}' is required`, { param: name })
  }
  return value
}

/**
 * Simple in-memory rate limiter for Next.js API routes
 * SEC-003 FIX: Prevents brute-force attacks on login endpoint
 *
 * For production with multiple instances, replace with Redis-based solution
 * (e.g., @upstash/ratelimit)
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt < now) {
      store.delete(key);
    }
  }
}, 5 * 60 * 1000);

export interface RateLimitConfig {
  /** Maximum number of requests allowed in the window */
  limit: number;
  /** Window duration in seconds */
  windowSecs: number;
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: number;
}

/**
 * Check rate limit for a given identifier (e.g., IP address or email)
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = { limit: 5, windowSecs: 60 }
): RateLimitResult {
  const now = Date.now();
  const windowMs = config.windowSecs * 1000;
  const key = `rl:${identifier}`;

  const existing = store.get(key);

  if (!existing || existing.resetAt < now) {
    // New window
    const entry: RateLimitEntry = {
      count: 1,
      resetAt: now + windowMs,
    };
    store.set(key, entry);
    return { success: true, remaining: config.limit - 1, resetAt: entry.resetAt };
  }

  if (existing.count >= config.limit) {
    return { success: false, remaining: 0, resetAt: existing.resetAt };
  }

  existing.count++;
  return {
    success: true,
    remaining: config.limit - existing.count,
    resetAt: existing.resetAt,
  };
}

/**
 * Get client IP from Next.js request headers
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return request.headers.get('x-real-ip') || 'unknown';
}

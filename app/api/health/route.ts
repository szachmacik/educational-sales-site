/**
 * Health check endpoint for monitoring and deployment verification.
 *
 * Returns environment status, feature flags, and application health.
 * Used by GitHub Actions CI/CD pipeline to verify successful deployment.
 *
 * Responses:
 * - 200 — healthy or degraded (app is running)
 * - 503 — critical (required env vars missing)
 *
 * @example
 * GET /api/health
 * {
 *   "status": "healthy",
 *   "timestamp": "2026-03-08T12:00:00.000Z",
 *   "environment": "production",
 *   "version": "1.0.0",
 *   "baseUrl": "https://kamila.ofshore.dev",
 *   "summary": "All required vars set. Features enabled: email, ai.",
 *   "validation": {
 *     "valid": true,
 *     "missing": [],
 *     "warnings": [...],
 *     "features": { "email": true, "payments": false, ... }
 *   }
 * }
 */

import { NextResponse } from 'next/server'
import { getEnvHealth } from '@/lib/env'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(): Promise<NextResponse> {
  const health = getEnvHealth()

  // Return 503 only for critical issues (missing required vars)
  // Degraded state still returns 200 — app is running, just with limited features
  const httpStatus = health.status === 'critical' ? 503 : 200

  return NextResponse.json(health, {
    status: httpStatus,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'X-Health-Status': health.status,
    },
  })
}

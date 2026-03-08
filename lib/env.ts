/**
 * Environment variable access and validation for Zoney educational platform.
 *
 * Architecture:
 * - `publicEnv`  — NEXT_PUBLIC_* vars, safe to use in browser and server
 * - `serverEnv`  — server-only secrets, NEVER import in client components
 * - `validateEnv()` — call at server startup to catch misconfigurations early
 * - `isFeatureAvailable()` — check if optional integrations are configured
 * - `getFeatureFlags()` — returns map of all feature statuses
 * - `getEnvHealth()` — full health report for admin dashboard / monitoring
 * - `logEnvStatus()` — prints startup summary to server console
 * - `getAllowedOrigins()` — CORS origin list from env
 *
 * @module env
 *
 * @example
 * // In server component or API route:
 * import { serverEnv, isFeatureAvailable, validateEnv } from '@/lib/env'
 *
 * // In client component:
 * import { publicEnv } from '@/lib/env'
 */

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC ENV (safe for browser)
// ─────────────────────────────────────────────────────────────────────────────

export const publicEnv = {
  /** Base URL of the application, e.g. https://kamila.ofshore.dev */
  BASE_URL: process.env.NEXT_PUBLIC_BASE_URL ?? 'https://kamila.ofshore.dev',
  /** Application name shown in UI */
  APP_NAME: process.env.NEXT_PUBLIC_APP_NAME ?? 'Zoney',
  /** Supabase project URL */
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  /** Supabase anonymous key (safe to expose) */
  SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
  /** Stripe publishable key */
  STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '',
  /** PayNow public key */
  PAYNOW_PUBLIC_KEY: process.env.NEXT_PUBLIC_PAYNOW_PUBLIC_KEY ?? '',
  /** Google Analytics measurement ID */
  GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? '',
  /** Sentry DSN for client-side error tracking */
  SENTRY_DSN_PUBLIC: process.env.NEXT_PUBLIC_SENTRY_DSN ?? '',
  /** Whether the app is running in production */
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  /** Whether the app is running in development */
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  /** App version from package.json or CI */
  APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION ?? '1.0.0',
} as const

// ─────────────────────────────────────────────────────────────────────────────
// SERVER ENV (server-only, never import in client components)
// ─────────────────────────────────────────────────────────────────────────────

export const serverEnv = {
  // ── Supabase ──────────────────────────────────────────────────────────────
  /** Supabase service role key (admin access, never expose to client) */
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
  /** Supabase JWT secret for token verification */
  SUPABASE_JWT_SECRET: process.env.SUPABASE_JWT_SECRET ?? '',

  // ── Stripe ────────────────────────────────────────────────────────────────
  /** Stripe secret key */
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY ?? '',
  /** Stripe webhook signing secret */
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET ?? '',

  // ── PayNow ────────────────────────────────────────────────────────────────
  /** PayNow API key */
  PAYNOW_API_KEY: process.env.PAYNOW_API_KEY ?? '',
  /** PayNow API signature key */
  PAYNOW_API_SIGNATURE: process.env.PAYNOW_API_SIGNATURE ?? '',
  /** PayNow webhook secret */
  PAYNOW_WEBHOOK_SECRET: process.env.PAYNOW_WEBHOOK_SECRET ?? '',

  // ── Email ─────────────────────────────────────────────────────────────────
  /** Resend API key for transactional emails */
  RESEND_API_KEY: process.env.RESEND_API_KEY ?? '',
  /** From email address */
  FROM_EMAIL: process.env.FROM_EMAIL ?? process.env.RESEND_FROM ?? 'noreply@ofshore.dev',
  /** Admin email address for system notifications */
  ADMIN_EMAIL: process.env.ADMIN_EMAIL ?? '',
  /** SMTP host (fallback when Resend is not configured) */
  SMTP_HOST: process.env.SMTP_HOST ?? '',
  /** SMTP port */
  SMTP_PORT: parseInt(process.env.SMTP_PORT ?? '587', 10),
  /** SMTP user */
  SMTP_USER: process.env.SMTP_USER ?? '',
  /** SMTP password */
  SMTP_PASS: process.env.SMTP_PASS ?? '',

  // ── AI ────────────────────────────────────────────────────────────────────
  /** OpenAI API key */
  OPENAI_API_KEY: process.env.OPENAI_API_KEY ?? '',
  /** OpenAI model to use */
  OPENAI_MODEL: process.env.OPENAI_MODEL ?? 'gpt-4o-mini',

  // ── Rate limiting ─────────────────────────────────────────────────────────
  /** Upstash Redis REST URL for distributed rate limiting */
  UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL ?? '',
  /** Upstash Redis REST token */
  UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN ?? '',

  // ── Security ──────────────────────────────────────────────────────────────
  /** Internal API secret for webhook-style endpoints */
  INTERNAL_API_SECRET: process.env.INTERNAL_API_SECRET ?? '',
  /** JWT secret for custom token signing */
  JWT_SECRET: process.env.JWT_SECRET ?? '',
  /** Allowed CORS origins (comma-separated) */
  CORS_ORIGINS: process.env.CORS_ORIGINS ?? '',

  // ── Storage ───────────────────────────────────────────────────────────────
  /** AWS S3 / compatible storage access key */
  S3_ACCESS_KEY: process.env.S3_ACCESS_KEY ?? '',
  /** AWS S3 / compatible storage secret key */
  S3_SECRET_KEY: process.env.S3_SECRET_KEY ?? '',
  /** S3 bucket name */
  S3_BUCKET: process.env.S3_BUCKET ?? '',
  /** S3 region */
  S3_REGION: process.env.S3_REGION ?? 'eu-central-1',
  /** S3 endpoint (for non-AWS providers like Cloudflare R2) */
  S3_ENDPOINT: process.env.S3_ENDPOINT ?? '',

  // ── Monitoring ────────────────────────────────────────────────────────────
  /** Sentry DSN for server-side error tracking */
  SENTRY_DSN: process.env.SENTRY_DSN ?? '',
  /** Logtail / BetterStack source token */
  LOGTAIL_TOKEN: process.env.LOGTAIL_TOKEN ?? '',

  // ── Autodeployment ────────────────────────────────────────────────────────
  /** Coolify webhook URL for deployment triggers */
  COOLIFY_WEBHOOK_URL: process.env.COOLIFY_WEBHOOK_URL ?? '',
  /** Coolify API token */
  COOLIFY_API_TOKEN: process.env.COOLIFY_API_TOKEN ?? '',
  /** GitHub Actions webhook secret */
  GITHUB_WEBHOOK_SECRET: process.env.GITHUB_WEBHOOK_SECRET ?? '',
} as const

// ─────────────────────────────────────────────────────────────────────────────
// FEATURE FLAGS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * All available feature keys for the platform.
 * Each key maps to a set of required environment variables.
 */
export type FeatureKey =
  | 'email'
  | 'payments'
  | 'paynow'
  | 'ai'
  | 'ratelimit'
  | 'storage'
  | 'monitoring'
  | 'autodeployment'

/**
 * Checks if a specific feature is available based on environment configuration.
 * All checks are based on `serverEnv` constants (frozen at module load).
 *
 * @param feature - Feature identifier to check
 * @returns `true` if the feature is configured and available
 *
 * @example
 * if (isFeatureAvailable('email')) {
 *   await sendEmail(payload)
 * } else {
 *   console.warn('Email not configured, skipping notification')
 * }
 *
 * @example
 * if (isFeatureAvailable('payments')) {
 *   // show Stripe checkout
 * } else if (isFeatureAvailable('paynow')) {
 *   // show PayNow checkout
 * } else {
 *   // show manual payment instructions
 * }
 */
export function isFeatureAvailable(feature: FeatureKey): boolean {
  switch (feature) {
    case 'email':
      return Boolean(serverEnv.RESEND_API_KEY || serverEnv.SMTP_HOST)
    case 'payments':
      return Boolean(serverEnv.STRIPE_SECRET_KEY)
    case 'paynow':
      return Boolean(serverEnv.PAYNOW_API_KEY && serverEnv.PAYNOW_API_SIGNATURE)
    case 'ai':
      return Boolean(serverEnv.OPENAI_API_KEY)
    case 'ratelimit':
      return Boolean(serverEnv.UPSTASH_REDIS_REST_URL && serverEnv.UPSTASH_REDIS_REST_TOKEN)
    case 'storage':
      return Boolean(serverEnv.S3_ACCESS_KEY && serverEnv.S3_SECRET_KEY && serverEnv.S3_BUCKET)
    case 'monitoring':
      return Boolean(serverEnv.SENTRY_DSN || serverEnv.LOGTAIL_TOKEN)
    case 'autodeployment':
      return Boolean(serverEnv.COOLIFY_WEBHOOK_URL && serverEnv.COOLIFY_API_TOKEN)
    default:
      return false
  }
}

/**
 * Returns a map of all feature availability statuses.
 * Useful for admin dashboards and health checks.
 *
 * @returns Record mapping each FeatureKey to its availability boolean
 *
 * @example
 * const flags = getFeatureFlags()
 * // { email: true, payments: false, paynow: true, ai: true, ... }
 */
export function getFeatureFlags(): Record<FeatureKey, boolean> {
  const keys: FeatureKey[] = [
    'email', 'payments', 'paynow', 'ai', 'ratelimit',
    'storage', 'monitoring', 'autodeployment',
  ]
  return Object.fromEntries(
    keys.map(key => [key, isFeatureAvailable(key)])
  ) as Record<FeatureKey, boolean>
}

// ─────────────────────────────────────────────────────────────────────────────
// VALIDATION
// ─────────────────────────────────────────────────────────────────────────────

export interface EnvValidationResult {
  /** Whether all required variables are set */
  valid: boolean
  /** List of missing required variable names */
  missing: string[]
  /** Warnings for missing optional variables */
  warnings: string[]
  /** Summary of configured feature groups */
  features: Record<FeatureKey, boolean>
}

/**
 * Validates that all required environment variables are set.
 * Logs warnings for missing optional variables.
 *
 * Call this function in server startup code or middleware to catch
 * misconfiguration early.
 *
 * @returns Full validation result with missing vars, warnings and feature status
 *
 * @example
 * const result = validateEnv()
 * if (!result.valid) {
 *   console.error('Missing required env vars:', result.missing)
 *   process.exit(1)
 * }
 */
export function validateEnv(): EnvValidationResult {
  const required: Array<{ key: string; value: string; label: string }> = [
    { key: 'NEXT_PUBLIC_SUPABASE_URL', value: publicEnv.SUPABASE_URL, label: 'Supabase URL' },
    { key: 'NEXT_PUBLIC_SUPABASE_ANON_KEY', value: publicEnv.SUPABASE_ANON_KEY, label: 'Supabase Anon Key' },
    { key: 'SUPABASE_SERVICE_ROLE_KEY', value: serverEnv.SUPABASE_SERVICE_ROLE_KEY, label: 'Supabase Service Role Key' },
  ]

  const optional: Array<{ key: string; value: string; label: string }> = [
    { key: 'STRIPE_SECRET_KEY', value: serverEnv.STRIPE_SECRET_KEY, label: 'Stripe Secret Key' },
    { key: 'STRIPE_WEBHOOK_SECRET', value: serverEnv.STRIPE_WEBHOOK_SECRET, label: 'Stripe Webhook Secret' },
    { key: 'PAYNOW_API_KEY', value: serverEnv.PAYNOW_API_KEY, label: 'PayNow API Key' },
    { key: 'RESEND_API_KEY', value: serverEnv.RESEND_API_KEY, label: 'Resend API Key (email)' },
    { key: 'OPENAI_API_KEY', value: serverEnv.OPENAI_API_KEY, label: 'OpenAI API Key (AI features)' },
    { key: 'UPSTASH_REDIS_REST_URL', value: serverEnv.UPSTASH_REDIS_REST_URL, label: 'Upstash Redis URL (rate limiting)' },
    { key: 'INTERNAL_API_SECRET', value: serverEnv.INTERNAL_API_SECRET, label: 'Internal API Secret (webhooks)' },
    { key: 'COOLIFY_WEBHOOK_URL', value: serverEnv.COOLIFY_WEBHOOK_URL, label: 'Coolify Webhook URL (autodeployment)' },
  ]

  const missing = required
    .filter(({ value }) => !value)
    .map(({ key }) => key)

  const warnings = optional
    .filter(({ value }) => !value)
    .map(({ key, label }) => `${key} (${label}) is not set — related features will be disabled`)

  return {
    valid: missing.length === 0,
    missing,
    warnings,
    features: getFeatureFlags(),
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// HEALTH CHECK
// ─────────────────────────────────────────────────────────────────────────────

export interface EnvHealthReport {
  status: 'healthy' | 'degraded' | 'critical'
  timestamp: string
  environment: string
  version: string
  baseUrl: string
  validation: EnvValidationResult
  /** Human-readable summary */
  summary: string
}

/**
 * Returns a full health report for the environment configuration.
 * Use this in `/api/health` endpoint for monitoring.
 *
 * Status logic:
 * - `critical` — required vars missing (app may not function)
 * - `degraded` — required vars set, but email or payments not configured
 * - `healthy`  — all required vars set and key features available
 *
 * @example
 * // app/api/health/route.ts
 * import { getEnvHealth } from '@/lib/env'
 * export async function GET() {
 *   const health = getEnvHealth()
 *   const status = health.status === 'critical' ? 503 : 200
 *   return Response.json(health, { status })
 * }
 */
export function getEnvHealth(): EnvHealthReport {
  const validation = validateEnv()
  const flags = validation.features

  let status: EnvHealthReport['status'] = 'healthy'
  if (!validation.valid) {
    status = 'critical'
  } else if (!flags.email || (!flags.payments && !flags.paynow)) {
    status = 'degraded'
  }

  const enabledFeatures = Object.entries(flags)
    .filter(([, v]) => v)
    .map(([k]) => k)
    .join(', ')

  const summary = validation.valid
    ? `All required vars set. Features enabled: ${enabledFeatures || 'none'}.`
    : `CRITICAL: Missing required vars: ${validation.missing.join(', ')}`

  return {
    status,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV ?? 'unknown',
    version: publicEnv.APP_VERSION,
    baseUrl: publicEnv.BASE_URL,
    validation,
    summary,
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// STARTUP LOGGER
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Logs environment status to the server console at startup.
 * Call this in `instrumentation.ts` (Next.js 14+).
 *
 * Only logs in non-test environments to avoid polluting test output.
 *
 * @example
 * // instrumentation.ts
 * import { logEnvStatus } from '@/lib/env'
 * export async function register() {
 *   if (process.env.NEXT_RUNTIME === 'nodejs') {
 *     logEnvStatus()
 *   }
 * }
 */
export function logEnvStatus(): void {
  if (process.env.NODE_ENV === 'test') return

  const { valid, missing, warnings, features } = validateEnv()
  const icon = (ok: boolean) => (ok ? '✓' : '✗')

  const lines = [
    `\n┌─ Zoney Environment Status ─────────────────────────`,
    `│  Node env:    ${process.env.NODE_ENV ?? 'unknown'}`,
    `│  Base URL:    ${publicEnv.BASE_URL}`,
    `│  Version:     ${publicEnv.APP_VERSION}`,
    `│`,
    `│  Required vars: ${valid ? 'ALL SET ✓' : `MISSING: ${missing.join(', ')}`}`,
    `│`,
    `│  Features:`,
    ...Object.entries(features).map(
      ([key, ok]) => `│    ${icon(ok)} ${key.padEnd(16)} ${ok ? 'enabled' : 'disabled'}`
    ),
  ]

  if (warnings.length > 0) {
    lines.push(`│`)
    lines.push(`│  Warnings (${warnings.length}):`)
    warnings.forEach(w => lines.push(`│    ⚠  ${w}`))
  }

  lines.push(`└────────────────────────────────────────────────────\n`)

  if (!valid) {
    console.error(lines.join('\n'))
  } else {
    console.info(lines.join('\n'))
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CORS HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns the list of allowed CORS origins from environment.
 * Falls back to the app's base URL and the English subdomain.
 *
 * @example
 * const origins = getAllowedOrigins()
 * // ['https://kamila.ofshore.dev', 'https://kamilaenglish.ofshore.dev']
 */
export function getAllowedOrigins(): string[] {
  if (serverEnv.CORS_ORIGINS) {
    return serverEnv.CORS_ORIGINS.split(',').map(o => o.trim()).filter(Boolean)
  }
  return [
    publicEnv.BASE_URL,
    'https://kamilaenglish.ofshore.dev',
  ].filter(Boolean)
}

/**
 * Checks if a given origin is in the allowed CORS list.
 *
 * @param origin - The Origin header value from the request
 * @returns `true` if the origin is allowed
 */
export function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false
  const allowed = getAllowedOrigins()
  return allowed.includes(origin)
}

/**
 * Environment variable validation and typed access.
 *
 * Validates required environment variables at startup and provides
 * type-safe access to all configuration values.
 *
 * @module env
 *
 * @example
 * import { env } from '@/lib/env'
 * const url = env.NEXT_PUBLIC_SUPABASE_URL
 */

/**
 * Public environment variables (safe to expose to the browser).
 * All values prefixed with NEXT_PUBLIC_ are available client-side.
 */
export const publicEnv = {
  /** Supabase project URL */
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  /** Supabase anonymous key (safe for client) */
  SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
  /** Base URL of the application (used for sitemap, OG tags, etc.) */
  BASE_URL: process.env.NEXT_PUBLIC_BASE_URL ?? 'https://kamila.ofshore.dev',
  /** App name displayed in UI */
  APP_NAME: process.env.NEXT_PUBLIC_APP_NAME ?? 'Zoney',
} as const

/**
 * Server-only environment variables (never exposed to the browser).
 * Access these only in server components, API routes, and middleware.
 */
export const serverEnv = {
  /** Supabase service role key (admin access) */
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
  /** Stripe secret key */
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY ?? '',
  /** Stripe webhook signing secret */
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET ?? '',
  /** Resend API key for transactional email */
  RESEND_API_KEY: process.env.RESEND_API_KEY ?? '',
  /** From email address for transactional email */
  FROM_EMAIL: process.env.FROM_EMAIL ?? process.env.RESEND_FROM ?? 'noreply@ofshore.dev',
  /** Internal API secret for webhook-style endpoints */
  INTERNAL_API_SECRET: process.env.INTERNAL_API_SECRET ?? '',
  /** OpenAI API key (for AI features in admin) */
  OPENAI_API_KEY: process.env.OPENAI_API_KEY ?? '',
  /** Upstash Redis URL (for distributed rate limiting) */
  UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL ?? '',
  /** Upstash Redis token */
  UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN ?? '',
} as const

/**
 * Validates that all required environment variables are set.
 * Logs warnings for missing optional variables.
 *
 * Call this function in server startup code or middleware to catch
 * misconfiguration early.
 *
 * @returns An object with `valid` boolean and `missing` array of missing variable names
 *
 * @example
 * const { valid, missing } = validateEnv()
 * if (!valid) {
 *   console.error('Missing env vars:', missing)
 * }
 */
export function validateEnv(): { valid: boolean; missing: string[]; warnings: string[] } {
  const required: Array<{ key: string; value: string; label: string }> = [
    { key: 'NEXT_PUBLIC_SUPABASE_URL', value: publicEnv.SUPABASE_URL, label: 'Supabase URL' },
    { key: 'NEXT_PUBLIC_SUPABASE_ANON_KEY', value: publicEnv.SUPABASE_ANON_KEY, label: 'Supabase Anon Key' },
    { key: 'SUPABASE_SERVICE_ROLE_KEY', value: serverEnv.SUPABASE_SERVICE_ROLE_KEY, label: 'Supabase Service Role Key' },
  ]

  const optional: Array<{ key: string; value: string; label: string }> = [
    { key: 'STRIPE_SECRET_KEY', value: serverEnv.STRIPE_SECRET_KEY, label: 'Stripe Secret Key' },
    { key: 'STRIPE_WEBHOOK_SECRET', value: serverEnv.STRIPE_WEBHOOK_SECRET, label: 'Stripe Webhook Secret' },
    { key: 'RESEND_API_KEY', value: serverEnv.RESEND_API_KEY, label: 'Resend API Key (email)' },
    { key: 'OPENAI_API_KEY', value: serverEnv.OPENAI_API_KEY, label: 'OpenAI API Key (AI features)' },
    { key: 'UPSTASH_REDIS_REST_URL', value: serverEnv.UPSTASH_REDIS_REST_URL, label: 'Upstash Redis URL (rate limiting)' },
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
  }
}

/**
 * Checks if a specific feature is available based on environment configuration.
 *
 * @example
 * if (isFeatureAvailable('email')) {
 *   await sendEmail(...)
 * }
 */
export function isFeatureAvailable(feature: 'email' | 'payments' | 'ai' | 'ratelimit'): boolean {
  switch (feature) {
    case 'email':
      return Boolean(serverEnv.RESEND_API_KEY || process.env.SMTP_HOST)
    case 'payments':
      return Boolean(serverEnv.STRIPE_SECRET_KEY)
    case 'ai':
      return Boolean(serverEnv.OPENAI_API_KEY)
    case 'ratelimit':
      return Boolean(serverEnv.UPSTASH_REDIS_REST_URL && serverEnv.UPSTASH_REDIS_REST_TOKEN)
    default:
      return false
  }
}

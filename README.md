# Zoney — Educational Sales Platform

A multilingual e-commerce platform for educational materials, built with Next.js 15 App Router. Supports 25 languages with automatic currency conversion, a full checkout flow, user dashboard, blog, and admin panel.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router, SSR) |
| Language | TypeScript 5 (strict) |
| Styling | Tailwind CSS + shadcn/ui |
| Auth | Supabase Auth |
| Database | Supabase (PostgreSQL) |
| Payments | Stripe (via API routes) |
| i18n | Custom middleware (25 languages) |
| Testing | Vitest + @testing-library/react |

## Getting Started

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# Fill in SUPABASE_URL, SUPABASE_ANON_KEY, STRIPE_SECRET_KEY, etc.

# Run development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
npm run start
```

## Project Structure

```
app/
  [lang]/           # Localized routes (25 languages via middleware)
    page.tsx        # Home page
    products/       # Product catalog & detail pages
    blog/           # Blog with categories
    checkout/       # Multi-step checkout
    dashboard/      # User dashboard (courses, certificates)
    admin/          # Admin panel (products, orders, blog, analytics)
    legal/          # Privacy policy, terms, cookie policy
components/
  ui/               # shadcn/ui base components
  product/          # Product detail view, reviews
  products/         # Product grid, filters
  checkout/         # Checkout form, order summary
  course/           # Course player, quiz, progress
  marketing/        # Hero, FOMO banners, exit-intent
  seo/              # JSON-LD structured data
hooks/
  use-debounce.ts   # Debounced value hook
  use-countdown.ts  # Countdown timer for limited offers
  use-local-storage.ts  # Persistent state
  use-clipboard.ts  # Copy to clipboard
  use-media-query.ts    # Responsive breakpoints
  use-previous.ts   # Previous state value
  use-scroll-position.ts  # Scroll tracking
lib/
  product-service.ts  # Product queries with i18n
  currency.ts         # Multi-currency formatting (25 currencies)
  slugify.ts          # URL slug generation (Polish diacritics)
  rate-limit.ts       # In-memory rate limiter for API routes
  order-schema.ts     # Order validation & coupon logic
  auth.ts             # Auth helpers (requireAdmin, requireUser)
__tests__/
  lib/              # Unit tests for all lib/ utilities
  hooks/            # Unit tests for custom hooks
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Supabase service role (server-only) |
| `STRIPE_SECRET_KEY` | ✅ | Stripe secret key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | ✅ | Stripe publishable key |
| `NEXT_PUBLIC_BASE_URL` | ✅ | Public URL (e.g., `https://kamila.ofshore.dev`) |
| `RESEND_API_KEY` | ⚠️ | Email sending (Resend) |
| `OPENAI_API_KEY` | ⚠️ | AI features (product descriptions, chat) |

## Supported Languages

Polish (pl), English (en), Ukrainian (uk), German (de), Spanish (es), French (fr), Italian (it), Czech (cs), Slovak (sk), Romanian (ro), Hungarian (hu), Portuguese (pt), Lithuanian (lt), Latvian (lv), Estonian (et), Croatian (hr), Serbian (sr), Slovenian (sl), Bulgarian (bg), Greek (el), Dutch (nl), Swedish (sv), Finnish (fi), Norwegian (no), Danish (da)

## Security

- Rate limiting on all public API endpoints (`/api/contact`, `/api/nip-lookup`, `/api/telemetry`)
- Admin routes protected by `requireAdmin()` middleware
- Content Security Policy headers configured in `next.config.mjs`
- Input sanitization on all form submissions
- TypeScript strict mode enabled (no `@ts-ignore`, no `any`)

## Testing

```bash
npm test                    # Run all tests
npm test -- --coverage      # Run with coverage report
npm test -- --reporter=verbose  # Verbose output
```

**Current status:** 87 tests, 9 test files, 100% pass rate

## Deployment

The project is deployed on Coolify at `kamila.ofshore.dev`.

For manual deployment:
```bash
npm run build
npm run start
```

The project requires Node.js SSR (uses `middleware.ts` for i18n routing) and **cannot** be deployed as a static export.

## License

Private — all rights reserved.

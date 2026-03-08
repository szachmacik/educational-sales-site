# ─────────────────────────────────────────────────────────────────────────────
# Zoney Educational Sales Platform — Multi-stage Dockerfile
# Node: 22-alpine | Next.js standalone output | Health check included
# Standard: ofshore.dev autodeployment (Coolify + DigitalOcean)
# ─────────────────────────────────────────────────────────────────────────────

# Stage 1: Install dependencies
FROM node:22-alpine AS deps
WORKDIR /app

# Install libc6-compat for Alpine compatibility
RUN apk add --no-cache libc6-compat

COPY package.json package-lock.json* ./
# Use npm ci for reproducible installs (faster, stricter than npm install)
RUN npm ci --legacy-peer-deps

# Stage 2: Build
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build args for public env vars (passed from Coolify build args)
ARG NEXT_PUBLIC_BASE_URL=https://kamila.ofshore.dev
ARG NEXT_PUBLIC_SITE_URL=https://kamila.ofshore.dev
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY

ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# Stage 3: Production runner (minimal image)
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

# Health check — required by Coolify for deployment verification
# /api/health returns 200 (healthy/degraded) or 503 (critical)
HEALTHCHECK --interval=30s --timeout=10s --start-period=90s --retries=3 \
  CMD wget -qO- http://localhost:3000/api/health || exit 1

CMD ["node", "server.js"]

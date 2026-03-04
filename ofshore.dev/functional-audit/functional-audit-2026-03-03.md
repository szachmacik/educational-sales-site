# Tygodniowy Audyt Funkcjonalny — offshore.dev
**Data:** 2026-03-03  
**Status:** 🔴 2 CRITICAL/HIGH ISSUES  
**Znalezione problemy:** 6 (0 critical, 2 high, 1 medium, 3 low)  
**Auto-naprawione:** 0

---

## Podsumowanie

| Projekt | TypeScript | CVE | Obrazy | i18n | Ogółem |
|---------|-----------|-----|--------|------|--------|
| educational-sales-site | ✅ | ✅ | ✅ | ✅ | ❌ 1 |
| ai-control-center | ✅ | ❌ | ✅ | ✅ | ❌ 2 |
| polaris-track | ✅ | ❌ | ✅ | ✅ | ❌ 2 |
| manus-autodeploy-test | ✅ | ✅ | ✅ | ✅ | ❌ 1 |

---

## Szczegółowe wyniki

### 🔵 [LOW] LOG-001 — educational-sales-site
10 console.log statements in server code (first: app/api/admin/manus/report/route.ts:34)

### 🟠 [HIGH] DEP-001 — ai-control-center
18 vulnerabilities (2 low | 13 moderate | 3 high) — run 'pnpm audit --audit-level=high' for details

### 🔵 [LOW] LOG-001 — ai-control-center
10 console.log statements in server code (first: server/initDb.ts:49)

### 🟠 [HIGH] DEP-001 — polaris-track
18 vulnerabilities (2 low | 13 moderate | 3 high) — run 'pnpm audit --audit-level=high' for details

### 🔵 [LOW] LOG-001 — polaris-track
19 console.log statements in server code (first: server/cronJobs.ts:143)

### 🟡 [MEDIUM] ENV-001 — manus-autodeploy-test
Missing .env.example file

---

## Następne kroki

Następujące problemy wymagają ręcznej interwencji:

- **DEP-001** (ai-control-center): 18 vulnerabilities (2 low | 13 moderate | 3 high) — run 'pnpm audit --audit-level=high' for details
- **DEP-001** (polaris-track): 18 vulnerabilities (2 low | 13 moderate | 3 high) — run 'pnpm audit --audit-level=high' for details

---
*Raport wygenerowany automatycznie | Następny audyt: 2026-03-10 08:30*

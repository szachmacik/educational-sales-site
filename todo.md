# Educational Sales Site - TODO

## Completed

- [x] Fix spurious "Akcja wykonana pomyślnie" toasts across all 15 files (replaced with contextual messages)
- [x] Add admin loading skeleton (app/[lang]/admin/loading.tsx)
- [x] Expand blog from 13 to 20 articles (8 new: differentiation, vocabulary games, digital tools, parent communication, writing skills, exam prep, PBL, listening skills)
- [x] Update all blog consumers to use ALL_BLOG_POSTS (combined export)
- [x] Fix TypeScript errors: ProductWithSlug.image vs Product.images[] mismatch across 8 files
- [x] Fix cart-context.tsx to accept both Product and ProductWithSlug types in addItem()
- [x] Fix CustomerInfo.name → firstName+lastName in purchases-history.tsx
- [x] Fix formatPrice() missing language argument in search-modal.tsx
- [x] Fix LanguageProvider initialLanguage → lang prop in pakiety page
- [x] Fix product.category → product.categories[0] in porownaj and search-modal pages

## Pending / Future

- [ ] Payment gateway integration (Stripe/PayNow/ZEN) - requires API keys
- [ ] Email sending via Resend - requires RESEND_API_KEY
- [ ] Certificate template creator (admin) - requires design work
- [ ] AI exam generator - requires LLM integration
- [ ] Social media publishing integration - requires OAuth tokens
- [ ] Children account management feature
- [ ] Anki export for flashcards
- [ ] PDF export for certificates

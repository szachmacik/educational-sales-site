# WordPress → Educational Sales Site — Migration Guide

## Co migruje ten system

| Dane | Status |
|------|--------|
| Konta użytkowników (email, imię, rola) | ✅ |
| Zakupione produkty (z WooCommerce) | ✅ |
| Dostęp do plików (WooCommerce Downloads) | ✅ |
| Hasła (SHA-256 hash) | ✅ |
| WP password hash (fallback) | ✅ |
| Powiadomienia email do klientów | ❌ BRAK |
| Reset haseł | ❌ BRAK |

---

## Krok 1 — Przygotowanie WordPress

### Utwórz Application Password w WP
1. Zaloguj się do WP Admin
2. Idź do: **Users → Profile → Application Passwords**
3. Wpisz nazwę np. "Migration" i kliknij **Add New Application Password**
4. Skopiuj hasło (format: `xxxx xxxx xxxx xxxx xxxx xxxx`)

### Wymagane wtyczki WP
- **JWT Authentication for WP REST API** — do logowania przez JWT
- **WooCommerce** — do pobierania zamówień i plików (opcjonalne)

---

## Krok 2 — Konfiguracja zmiennych środowiskowych

Ustaw w Coolify (lub `.env.local`):

```env
# Migracja
MIGRATION_SECRET=twoj-tajny-klucz-migracji-min-32-znaki

# WordPress (opcjonalne — do logowania przez WP JWT)
NEXT_PUBLIC_WORDPRESS_URL=https://stara-strona.pl
```

---

## Krok 3 — Uruchomienie migracji

### Opcja A: Skrypt automatyczny (zalecane)

```bash
# Dry run — sprawdź co zostanie zmigrowane bez zapisywania
WP_URL=https://stara-strona.pl \
WP_APP_PASSWORD="admin:xxxx xxxx xxxx xxxx xxxx xxxx" \
MIGRATION_SECRET=twoj-tajny-klucz \
SHOP_URL=https://kamila.ofshore.dev \
DRY_RUN=true \
node scripts/export-wp-users.mjs

# Live — zapisz dane
WP_URL=https://stara-strona.pl \
WP_APP_PASSWORD="admin:xxxx xxxx xxxx xxxx xxxx xxxx" \
MIGRATION_SECRET=twoj-tajny-klucz \
SHOP_URL=https://kamila.ofshore.dev \
node scripts/export-wp-users.mjs
```

### Opcja B: Ręczne wywołanie API

```bash
curl -X POST https://kamila.ofshore.dev/api/admin/migrate-wp \
  -H "Authorization: Bearer twoj-tajny-klucz" \
  -H "Content-Type: application/json" \
  -d '{
    "dryRun": false,
    "users": [
      {
        "id": 123,
        "email": "klient@example.com",
        "name": "Jan Kowalski",
        "roles": ["subscriber"],
        "meta": {
          "purchased_products": ["Materiały do angielskiego", "Gry językowe"],
          "accessible_files": ["https://stara-strona.pl/wp-content/uploads/materialy.pdf"]
        }
      }
    ]
  }'
```

---

## Krok 4 — Po migracji

### Sprawdź status
```bash
curl https://kamila.ofshore.dev/api/admin/migrate-wp \
  -H "Authorization: Bearer twoj-tajny-klucz"
```

### Tymczasowe hasła
Skrypt wypisze tymczasowe hasła dla nowych kont w terminalu.
**Zapisz je i przekaż klientom ręcznie** (przez SMS, telefon, itp.) — NIE przez email.

### Logowanie klientów po migracji
Klienci mogą się logować:
1. Swoim starym hasłem z WP (jeśli `NEXT_PUBLIC_WORDPRESS_URL` jest ustawiony)
2. Tymczasowym hasłem wygenerowanym podczas migracji
3. Demo kontem: `student@kamila.shor.dev` / `demo123`

---

## Architektura

```
WordPress REST API
    ↓ (export-wp-users.mjs)
POST /api/admin/migrate-wp
    ↓
lib/data/users.json          ← konta użytkowników
lib/data/user-access.json    ← dostęp do plików
    ↓
GET /api/auth/access?email=  ← sprawdzenie dostępu po logowaniu
POST /api/auth/login         ← logowanie przez local hash lub WP JWT
```

---

## Bezpieczeństwo

- Endpoint `/api/admin/migrate-wp` wymaga `MIGRATION_SECRET` — bez niego zwraca 503
- Wszystkie operacje są logowane w konsoli serwera
- Hasła są hashowane SHA-256 — nigdy nie są przechowywane w plaintext
- WP password hashe (phpass) są przechowywane tylko jako fallback do WP JWT
- Brak jakichkolwiek email do klientów podczas migracji

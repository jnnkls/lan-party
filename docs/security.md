# Security baseline

Living checklist. Everything below is implemented and covered by a test (unit or e2e) unless noted otherwise.

## Content Security Policy

Configured via SvelteKit's native `kit.csp` in `svelte.config.js`, not hand-rolled in `hooks.server.ts` — this matters because SvelteKit auto-generates a per-request nonce and applies it to its own inline `<style>`/`<script>` output, and to the inline theme-bootstrap script in `app.html` via `%sveltekit.nonce%`. A hand-rolled header (what Phase 0 originally shipped) has no way to do this, and silently broke that inline script under CSP — caught while verifying this phase in a real browser (`page.on('console')`), not by any automated check, which is why `tests/e2e/security.spec.ts` now asserts `script-src` is nonce-based.

- `script-src 'self' https://kit.fontawesome.com 'nonce-...'` — no `unsafe-inline`, ever.
- `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://ka-f.fontawesome.com` — `unsafe-inline` **is** required here: several components set dynamic `style="..."` attributes (XP bars, rarity gradients), and CSP has no nonce mechanism for style attributes, only `<style>` elements. This is a documented trade-off (SvelteKit's own `csp` docs call it out), not an oversight. Style-only injection can't execute JS.
- `frame-ancestors 'none'`, `default-src 'self'`, plus `font-src`/`img-src`/`connect-src` scoped to what the app actually loads (Google Fonts, Font Awesome kit).
- Verified against a real browser for `/login`, `/register`, and `/wheel` (zero console CSP violations) — not just "the header looks right on paper."

## Other headers

Set in `src/hooks.server.ts` (`handleSecurityHeaders`) since they don't need nonces:

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` — camera/microphone/geolocation denied (unused by this app).

Asserted present in `tests/e2e/security.spec.ts`.

## CSRF

SvelteKit's built-in origin check (`csrf.checkOrigin`, on by default — see `svelte.config.js`) rejects cross-origin `POST`/`PUT`/`PATCH`/`DELETE` form submissions with a 403. `tests/e2e/security.spec.ts` exercises both directions: a mismatched `Origin` header is rejected, and a matching one isn't — the second case matters because Playwright's API request context doesn't send an `Origin` header by default, so without it the "positive" case would trivially pass for the wrong reason.

## Session cookies

Set in `src/lib/server/auth.ts` (`setSessionTokenCookie`):

- `httpOnly: true` — not readable from client-side JS.
- `secure: true` in production (relaxed only under `dev` for local HTTP).
- `sameSite: 'lax'`.

Asserted present in `tests/e2e/security.spec.ts`.

## Passwords

Hashed with `@node-rs/argon2` using explicit OWASP-recommended parameters (`memoryCost: 19456, timeCost: 2, outputLen: 32, parallelism: 1`) in `src/lib/server/password.ts`. Covered by `password.test.ts` (hash/verify round-trip, mismatch rejection, salt uniqueness).

## Rate limiting

`/login` and `/register` are rate-limited per client address (`src/lib/server/rate-limit.ts`) — 10/15min and 5/15min respectively. The limiter algorithm itself is thoroughly unit-tested (`rate-limit.test.ts`, deterministic via an injected clock). It's deliberately **not** re-exercised end-to-end: the limiter is a single in-memory store shared by the whole preview server process that every e2e test file hits, so a test that intentionally exhausts it would leak into other files' legitimate logins for the rest of the window. See the comment in `security.spec.ts`.

## OIDC

GitHub login (`src/lib/server/oauth/github.ts`) uses Arctic's `state` parameter, stored in a short-lived `httpOnly`/`sameSite=lax` cookie and compared on callback — standard OAuth2 CSRF protection for the auth-code flow. GitHub's classic OAuth app flow doesn't support PKCE, so it isn't used here; if a future provider requires or supports it, add it via Arctic's `generateCodeVerifier()`/`createS256CodeChallenge()` in that provider's module. Account-linking logic (`upsertGithubUser`) is integration-tested against a real database.

## Input validation

All form actions (`register`, `login`) validate with `zod` (`src/lib/server/validation.ts`) before touching the database.

## Dependency audit

`pnpm audit` was run and direct dependencies bumped to their latest patched versions where a fix existed without a risky major-version jump: `drizzle-orm` (fixed a SQL-identifier-escaping vulnerability — this one mattered, it's a runtime dependency), `@sveltejs/kit`, `vite` (patch-level within its current major), `eslint`/`typescript-eslint`/`eslint-plugin-svelte`.

Remaining findings (`pnpm audit`, checked periodically — see Dependabot) are all in transitive **dev/build tooling** with no direct upgrade path short of a major-version bump of `vite`/`tailwindcss` carrying real compatibility risk for marginal benefit:

- `tar`, via `@tailwindcss/vite → @tailwindcss/oxide` (native CSS bundler's packaging dependency)
- `rollup`, via `vite`'s bundled copy
- `minimatch` / `flatted` / `js-yaml` / `brace-expansion` / `picomatch`, via `eslint` / `typescript-eslint` / `vitest` coverage tooling internals
- `shell-quote` (critical-severity advisory), via `drizzle-orm`'s optional `gel` (EdgeDB) driver support — we only ever import `drizzle-orm/postgres-js` and `drizzle-orm/pg-core`; the `gel` code path is never executed by this app.

None of these run in the deployed production server process — they're build-time/lint-time only, or an unused optional driver. Re-check `pnpm audit` next time a dependency bump is due (Dependabot will surface most of these automatically).

## Reporting

Secrets live only in `.env` (gitignored, never committed) and CI secrets — never in client-bundled code.

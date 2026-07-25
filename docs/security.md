# Security baseline

This is a living checklist, extended in the dedicated security-hardening phase. Current state:

## Transport & headers

Set in `src/hooks.server.ts` (`handleSecurityHeaders`):

- `Content-Security-Policy` — self by default; explicit allowances for the Font Awesome kit script/styles and Google Fonts already used by the app.
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` — camera/microphone/geolocation denied (unused by this app).

## Session cookies

Set in `src/lib/server/auth.ts` (`setSessionTokenCookie`):

- `httpOnly: true` — not readable from client-side JS.
- `secure: true` in production (relaxed only under `dev` for local HTTP).
- `sameSite: 'lax'`.

## Passwords

Hashed with `@node-rs/argon2`. Parameter tuning against current OWASP recommendations is tracked for the security-hardening phase.

## Still to do (security-hardening phase)

- Rate limiting on `/login` and `/register`.
- `zod` input validation on all form actions.
- CSRF: confirm SvelteKit's built-in origin check is exercised by a test.
- `pnpm audit` clean (or documented exceptions).
- OIDC-specific review once a provider is wired up (state/PKCE handling via Arctic).

## Reporting

Secrets live only in `.env` (gitignored, never committed) and CI secrets — never in client-bundled code.

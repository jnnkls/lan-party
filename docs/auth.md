# Auth

## Session mechanics

Unchanged from before this phase — `src/lib/server/auth.ts` + `src/hooks.server.ts` implement a hand-rolled Lucia-style session:

- A random session token is generated client-side-visible (in the cookie), but only its SHA-256 hash is stored as the session id in the `session` table.
- `src/hooks.server.ts` validates the session cookie on every request and populates `event.locals.user` / `event.locals.session`.
- Sessions auto-renew when within 15 days of their 30-day expiry.
- The cookie is `httpOnly`, `secure` in production, `sameSite: 'lax'` (see `docs/security.md`).

## Password auth

- `/register` (`src/routes/register/`) and `/login` (`src/routes/login/`) are real pages now — the previous `/demo/lucia` tutorial scaffold is gone.
- Passwords are hashed with Argon2id via `src/lib/server/password.ts` (`hashPassword`/`verifyPassword`), using OWASP-recommended parameters.
- Input is validated with `zod` schemas in `src/lib/server/validation.ts` (`registerSchema`, `loginSchema`).
- Both actions are rate-limited via `src/lib/server/rate-limit.ts` (in-memory, per-`getClientAddress()` key) — 5 attempts/15min for register, 10/15min for login.
- Registering creates both a `user` row and a linked `player_profile` row in one transaction, so a new account is immediately a first-class player (shows up on the leaderboard, etc).
- `/logout` is a POST-only form action (not a GET link) that invalidates the session and clears the cookie.

## OIDC / OAuth

Structured so adding a second provider is config + one file, not a redesign:

- `src/lib/server/oauth/<provider>.ts` — provider client setup (via [Arctic](https://arcticjs.dev)) plus an `upsertXUser(profile)` function that finds-or-creates the `user`/`player_profile`/`oauth_account` rows for that profile. This function is deliberately separate from the HTTP flow so it can be integration-tested against a real database without live provider credentials (see `github.test.ts`).
- `src/routes/login/<provider>/+server.ts` — redirects to the provider's authorization URL, storing `state` in a short-lived cookie.
- `src/routes/login/<provider>/callback/+server.ts` — validates `state`, exchanges the code for a token, fetches the profile, and calls `upsertXUser`.
- `oauth_account` links `user.id` to `(provider, provider_account_id)` (unique together). `user.passwordHash` is nullable so OIDC-only accounts don't need one.
- GitHub is the concrete provider implemented (`src/lib/server/oauth/github.ts`). It's inert unless `GITHUB_CLIENT_ID`/`GITHUB_CLIENT_SECRET` (and optionally `GITHUB_REDIRECT_URI`) are set — `githubEnabled` gates both the "Continue with GitHub" button and the route handlers (404 when unconfigured). Adding e.g. Google or Discord later is: install nothing new (Arctic already ships every provider), add `src/lib/server/oauth/google.ts` following the same shape, add its two routes, add its env vars.
- If a provider's account username collides with an existing local username, the new user gets a random suffix (`login-ab12`) rather than failing.

## What isn't gated yet

The app currently has no write actions beyond auth itself (check-in, adding owned games, etc. don't exist yet — see the gamification phase). `event.locals.user` is available everywhere to gate those once they exist; there's nothing to retrofit today.

## Environment variables

| Variable                                    | Required | Purpose                                                 |
| ------------------------------------------- | -------- | ------------------------------------------------------- |
| `DATABASE_URL`                              | yes      | Postgres connection string                              |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | no       | Enables GitHub login when both are set                  |
| `GITHUB_REDIRECT_URI`                       | no       | Override the OAuth redirect URI if it can't be inferred |

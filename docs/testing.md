# Testing

## Layers

- **Unit/component** — Vitest + `@testing-library/svelte`, for component logic and pure server-side helpers. Run with `pnpm test` (or `pnpm test:watch`).
- **Integration** — Vitest tests that hit a real PostgreSQL instance (no mocked DB) for Drizzle queries and auth flows. These run in the same `pnpm test` command; point `DATABASE_URL` at a disposable database before running locally.
- **E2E** — Playwright, for critical user journeys (browsing, auth, adding a game to a library). Run with `pnpm test:e2e`. This builds the app and serves the production preview (see `playwright.config.ts`).

## Running locally

```bash
docker compose up -d
pnpm db:push
pnpm test        # unit + integration
pnpm test:e2e     # end-to-end (builds + serves the app first)
```

## CI

- `.github/workflows/ci.yml` — type check, lint, `db:push` against an ephemeral Postgres service container, unit/integration tests, build. Runs on every push to `main` and every PR.
- `.github/workflows/e2e.yml` — Playwright suite against a built preview, same Postgres service container pattern.
- `.github/workflows/codeql.yml` — static security analysis, on push/PR and a weekly schedule.

## Definition of ready

No feature is considered done without a test that would fail if the behavior broke — see the plan's "Definition of Ready" for the full checklist (tests, docs, lint/build clean, CI green, security review where relevant).

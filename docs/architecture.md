# Architecture

## Stack

- **Framework**: SvelteKit 2 (Svelte 5 runes), Tailwind CSS 4.
- **Database**: PostgreSQL, accessed via Drizzle ORM (`drizzle-orm/postgres-js`).
- **Auth**: session-cookie based (Lucia-style, hand-rolled — see `docs/auth.md`), with OIDC/OAuth providers layered on top via [Arctic](https://arcticjs.dev).
- **Package manager**: pnpm.

## Layering

- `src/routes/**/+page.server.ts` — server load functions. These are the only place route data is fetched; they query Drizzle directly (no client-side fetching of app data).
- `src/lib/server/db/` — `schema.ts` (Drizzle table definitions), `index.ts` (DB client), `seed.ts` (sample data for local dev).
- `src/lib/server/auth.ts` — session creation/validation, cookie handling.
- `src/hooks.server.ts` — request-level auth resolution (`event.locals.user`/`session`) and the security headers that aren't nonce-based (see `docs/security.md`; CSP itself is configured in `svelte.config.js`).
- `src/lib/types.ts` — view-model types returned by load functions to components. These are shaped for display, not a 1:1 mirror of the DB schema.
- `src/lib/components/` — presentational Svelte components (cards, badges, nav).

## Multi-tenancy

The schema has a `tenant` table, but there is currently no multi-tenant UI or signup flow — every query is scoped to a single seeded tenant referenced via `DEFAULT_TENANT_ID` (`src/lib/server/tenant.ts`, added in the data-wiring phase). This keeps the schema forward-compatible with real multi-tenancy without building that UI now.

## Local development

```bash
pnpm install
docker compose up -d      # starts local Postgres on 5432
pnpm db:migrate            # applies the tracked drizzle/ migrations
pnpm db:seed
pnpm dev
```

`pnpm db:push` is also available for quick local schema prototyping (no migration file generated), but `db:migrate` against the committed `drizzle/` files is what CI and any real deployment use — see `docs/testing.md`.

See `docs/testing.md` for running the test suites and `docs/data-model.md` for the schema.

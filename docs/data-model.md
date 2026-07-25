# Data model

Schema lives in `src/lib/server/db/schema.ts` (Drizzle, PostgreSQL). Query functions that map schema rows into the view-model types consumed by pages live in `src/lib/server/db/queries.ts` — every `+page.server.ts` load function goes through there, never straight through `db`.

## Multi-tenancy

Every tenant-scoped table (`player_profile`, `lan_party`, `game`, `console`, `tournament`, `title`, `achievement`) has a `tenant_id`. There is no signup/tenant-switching UI yet — all queries filter on `DEFAULT_TENANT_ID` from `src/lib/server/tenant.ts`. When real multi-tenancy lands, that constant becomes a session-derived value; the column layout doesn't need to change.

## Core entities

- **tenant** — currently a single seeded row.
- **user** / **session** — auth identity and session tokens (see `docs/auth.md`). `password_hash` is nullable since OIDC-only users have none.
- **oauth_account** — links a `user` to an external OIDC/OAuth identity (`provider` + `provider_account_id`, unique together). Empty until the auth phase adds a provider.
- **player_profile** — the public-facing player identity (username, avatar, active title, rarity, xp, longest streak). Optionally linked to a `user` via `user_id`; a player profile can exist without a login (e.g. someone tracked by the group before they register).
- **lan_party** — an event: title, description, theme, location, cover image, `starts_at`/`ends_at`, `status` (`future`/`ongoing`/`expired`).
- **lan_attendance** — join table between `lan_party` and `player_profile` (composite PK), tracking `joined_at`, `checked_in`, and `xp_awarded` for that event.
- **game** / **console** — catalogs. `lan_game` / `lan_console` link them to a specific LAN (what's planned for that event); `player_gear` links consoles to a player's personal collection.
- **player_game** — a player's personally-owned games (playerId + gameId, optional platform/notes). This is what the "who has which games" feature is built on — see the gamification phase for the UI that surfaces it.
- **tournament** / **tournament_match** — bracket results for a LAN's games; matches reference players by id (`player_a_id`/`player_b_id`/`winner_player_id`), resolved to usernames in the query layer.
- **title** / **player_title** — unlockable titles a player has earned; `achievement.title_reward_id` optionally grants one.
- **achievement** / **player_achievement** — XP-granting unlocks a player has earned.

## Query layer conventions (`queries.ts`)

- Functions return the presentation-shaped types in `src/lib/types.ts` (`LanOverview`, `LanDetail`, `PlayerDetail`, `TournamentOverview`, `LeaderboardEntry`), not raw table rows — `+page.server.ts` files should never need to reshape data themselves.
- Tournament matches store player _ids_; the query layer resolves them to usernames because that's what the UI has always displayed (mirrors the original mock data's shape).
- A player's "current" win streak isn't tracked as its own column yet — `winStreakFrom()` derives a placeholder from `longest_streak`, same heuristic the old mock data used. A real "current streak" concept is future work, not part of this phase.
- Batch-fetch patterns: get the primary rows first, then fetch related child rows with `inArray` on the collected ids, then assemble in JS. This app's data volume (one friend group's LAN history) doesn't need heavier query optimization; prefer readability.

## Seeding

`src/lib/server/db/seed.ts` (run via `pnpm db:seed`) clears and repopulates the tables with realistic sample data — the same roster/events/tournaments the old `mock-data.ts` had, ported into real rows. It connects directly with `process.env.DATABASE_URL` (via `dotenv`) rather than through `$env/dynamic/private`, since it runs standalone via `tsx`, not through Vite.

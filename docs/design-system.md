# Design system

"Arcade-modern fusion": a pixel/arcade-cabinet identity (NES.css-style chunky borders, hard-edged shadows, a pixel display font) applied to an otherwise modern, spacious layout — not a full retro 8-bit reskin.

## Typography

- **Press Start 2P** — headings (`h1`–`h3`, `.page-title`, `.font-display`), nav links, buttons, badges/tags (`.stat-chip`, `.quest-tag`, `.section-kicker`, date/level/placement badges), and numeric displays (`.tabular-nums`, `.metric-card strong`). This is "compact display text" — short labels and headings, not paragraphs.
- **Open Sans** — body copy, descriptions, and any dense/variable-length content. This is the default (`* { font-family: 'Open Sans', ... } `); Press Start 2P is opted into explicitly.
- Press Start 2P has no bold cut, so every rule using it sets `font-weight: 400` explicitly — leaving a heavier weight causes the browser to synthesize a faux-bold, which blurs the pixel edges.
- Heading font sizes are much smaller than a typical Open Sans scale (e.g. `h1` clamps to `2.75rem` max, not `7.2rem`) because Press Start 2P glyphs are far wider per character.

## Color tokens (`src/app.css`)

- `--accent` (`#ff7f50`, coral) / `--accent-strong` (`#ff9466`) / `--accent-soft` — primary interactive color.
- `--party-blue` / `--party-green` / `--party-yellow` / `--party-pink` / `--party-purple` — secondary accents for status/variety (tournament results, rarity, etc).
- `--dark` / `--cabinet` (`#35393c`, graphite) / `--bg` / `--surface*` — the graphite dark palette. There is currently only one real palette (the `.dark` class variables match the root defaults) — the theme toggle exists in the UI but does not yet switch to a distinct light palette; that's a known gap, not something this pass fixed.
- `--text` / `--text-muted` — foreground colors.

Never hardcode Tailwind slate/amber/indigo classes — use these tokens. There used to be an `!important` compatibility shim in `app.css` translating old slate/amber classes to the token palette; it's been removed because nothing in the codebase uses those classes anymore. If you're tempted to add it back, fix the component's classes instead.

## Shape & shadow

- Panels (`.game-panel`, `.quest-card`, `.screen-header`, `.command-card`, `.metric-card`, `.empty-state`) use 2px borders and a small border-radius (3px) — chunky, not fully square.
- Chips/badges use a 1px border and 2px radius (they're small; a 2px border would overwhelm them).
- Shadows (`--shadow`, `--pixel-shadow`, `--glow`) are hard-edged stepped offsets with no blur (e.g. `4px 4px 0 0 rgba(0,0,0,.45)`), not soft drop shadows — that's what reads as "pixel/cabinet" rather than generic dark-mode glow. `--glow` is accent-colored and used on hover states; buttons shift up 1px on hover and reset on `:active`, giving a physical "pressed button" feel.

## Component conventions

- Presentational components use Svelte 5 `$props()` runes, not the legacy `export let` — all of `src/lib/components/*` was converted in this pass.
- Reuse existing primitives (`game-panel`, `quest-card`, `quest-tag`, `stat-chip`, `screen-header`, `command-card`, `metric-card`, `segmented-control`, `party-divider`) instead of one-off styles when building new UI.

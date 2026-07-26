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
- `--dark` / `--bg` / `--surface*` — surface tokens. The base `html {}` selector holds a genuinely distinct **light** palette (cool off-white surfaces, near-black text) and `html.dark {}` overrides it with the graphite palette; the theme toggle switches by adding/removing the `.dark` class on `<html>` (see `src/lib/theme.ts`). Both palettes share the same `--accent`/`--on-accent` pair, which is why the coral accent and its near-black foreground text work unchanged in either theme.
- `--text` / `--text-muted` — foreground colors.

Never hardcode Tailwind slate/amber/indigo classes — use these tokens. There used to be an `!important` compatibility shim in `app.css` translating old slate/amber classes to the token palette; it's been removed because nothing in the codebase uses those classes anymore. If you're tempted to add it back, fix the component's classes instead.

## Shape & shadow

The pixel/arcade identity is deliberately spent in a small number of places — headings, buttons, badges, and the hero `.screen-header` — rather than applied uniformly to every panel. Repeating the heaviest chrome (thick borders, scanline textures, deep shadows) on every card was the main source of visual clutter in an earlier pass; the fix was restraint, not removing the identity.

- `.screen-header` (page-level hero banner) keeps the heaviest treatment: 2px border, `--pixel-shadow`, and an accent underline — it's meant to read as the "cabinet" of the page.
- Everyday content panels (`.game-panel`, `.quest-card`, `.command-card`, `.metric-card`, `.empty-state`) use a 1px border, 4px radius, a flat surface background, and a thin accent strip along the top edge instead of a full gradient/scanline overlay. `.quest-card` (clickable list items like `LanCard`/`UserCard`) adds a hover lift + `--glow` shadow as the interactive affordance.
- Chips/badges use a 1px border and 2px radius (they're small; a 2px border would overwhelm them).
- Shadows (`--shadow`, `--pixel-shadow`, `--glow`) are hard-edged stepped offsets with no blur, not soft drop shadows — that's what reads as "pixel/cabinet" rather than generic dark-mode glow. Both alpha and offset are tuned per theme (lighter/smaller in the light palette, since a heavy black shadow reads as muddy on a white surface). `--glow` is accent-colored and used on hover states; buttons shift up 1px on hover and reset on `:active`, giving a physical "pressed button" feel.
- Avoid nesting more than one level of bordered/background "box" inside another (e.g. a stat row split by thin dividers inside one bordered container, not three separately-chromed boxes side by side) — that box-in-box pattern was the other main clutter source.

## Component conventions

- Presentational components use Svelte 5 `$props()` runes, not the legacy `export let` — all of `src/lib/components/*` was converted in this pass.
- Reuse existing primitives (`game-panel`, `quest-card`, `quest-tag`, `stat-chip`, `screen-header`, `command-card`, `metric-card`, `segmented-control`, `party-divider`) instead of one-off styles when building new UI.

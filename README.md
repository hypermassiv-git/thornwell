# Thornwell — Neverland Sorting Quiz

A quiz-based sorting microsite for **Neverland** (a lending app on Monad). Visitors arrive at the crossroads, meet **Thornwell the Talking Cactus**, answer his questions, and get sorted into one of four archetypes — **Pirate, Pixie, Mermaid, Lost Boy** — with a downloadable, shareable result image.

Plain static site: **no build step, no dependencies.** Just files.

## Run locally

Any static server works (the share-image canvas needs `http://`, not `file://`):

```bash
python3 -m http.server 8080
```

…or with Node (the `--yes` skips the install prompt):

```bash
npx --yes serve -l 8080 .
```

Then open <http://localhost:8080>.

## Deploy

Drop the whole folder onto any static host — Vercel, Netlify, GitHub Pages, Cloudflare Pages, or IPFS. No configuration needed.

## Swapping in real content

Everything you'll change lives in a few obvious places:

| What | Where |
|------|-------|
| **Brand colors, fonts, logo, site URL, social handle** | `js/config.js` (`BRAND`) — the main swap target |
| **Quiz questions & answer weights** | `js/questions.js` (schema documented at the top) |
| **Archetype names, blurbs, Thornwell's verdict lines** | `js/archetypes.js` |
| **Crossroads background scene** | drop `assets/crossroads.jpg` (a CSS placeholder shows until then) |
| **Thornwell art** | drop `assets/thornwell.png` — transparent PNG (a CSS-drawn cactus shows until then) |
| **Neverland logo** | `assets/logo.svg` (official full logo) + `assets/logomark.svg` (stars mark) |
| **Archetype emblems** | replace files in `assets/emblems/` |

Drop replacement assets in with the **exact same filenames** (all lowercase — e.g. `thornwell.png`, not `Thornwell.png`) and no code changes are needed. Filenames are case-sensitive on most web hosts even though macOS ignores case, so keep them lowercase.

### Brand (from neverland.money/brand)
Applied from the official Neverland brand guide:
- **Colors** — Neverland Blue `#192170`, Purple `#480052`, Magenta `#b506f5` (the UI accent), White `#FFFFFF`. Defined in `js/config.js` (`BRAND.colors`) and mirrored to CSS variables.
- **Fonts** — Cinzel (headings) + Quicksand (app/body text), loaded in `index.html`.
- **Logo** — the official `assets/logo.svg` (full logo, white) is used in the shareable result card footer.
- `siteUrl` is `neverland.money`; **confirm the real social `handle`** in `js/config.js` (currently a placeholder).

### The two hero images (already in place)
The site uses a **visual-novel layout**: the crossroads scene fills the screen, Thornwell stays planted dead-center as the on-screen speaker, and all copy sits in a dialogue box docked at the bottom.
- **`assets/crossroads.jpg`** — the crossroads scene, shown full-bleed (centered on the signpost). A CSS placeholder scene shows if it's missing.
- **`assets/thornwell.png`** — the transparent cactus, planted at the crossroads center and **reused automatically in the shareable result image**. A CSS-drawn cactus shows if it's missing.

## Scoring

Each answer adds points to one or more archetypes (`js/questions.js`). Highest total wins; ties break in the order Pirate → Pixie → Mermaid → Lost Boy. When the top two are within `TIE_MARGIN` (in `js/quiz.js`), Thornwell delivers a grumpy "mixed read" line instead of a clean verdict.

## File map

```
index.html          # single-page shell (screens toggled by JS)
css/style.css        # crossroads scene, screens, result card, responsive
js/config.js         # BRAND kit — colors, fonts, logo, URL, handle  ← start here
js/archetypes.js     # 4 archetypes + Thornwell's verdict/tie lines
js/questions.js      # the quiz (placeholder set; documented schema)
js/quiz.js           # state machine + weighted scoring + tie logic
js/share.js          # canvas result-image render + download / Web Share
js/main.js           # boot + screen wiring
assets/              # crossroads.jpg, thornwell.png, logo.svg, emblems/
```

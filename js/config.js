/* =============================================================================
 * config.js - Neverland brand kit + site settings
 * -----------------------------------------------------------------------------
 * THIS IS THE MAIN SWAP TARGET. Everything the user needs to rebrand the site
 * lives here. Replace the values marked `TODO` when the real brand kit arrives.
 * Colors defined here are mirrored into CSS custom properties on boot
 * (see applyBrandToCss() at the bottom), so you rarely need to touch style.css.
 * ========================================================================== */

const BRAND = {
  // --- Identity -------------------------------------------------------------
  projectName: "Neverland",
  tagline: "A lending app on Monad",
  siteUrl: "neverland.money",        // shown on share image (no protocol)
  handle: "@neverland",              // TODO: confirm the real social handle
  logo: "assets/logo.svg",           // official Neverland full logo (white)
  logomark: "assets/logomark.svg",   // official Neverland stars logomark (white)

  // --- Core palette ---------------------------------------------------------
  // UI tokens match the live app (app.neverland.money); brand guide colors
  // (neverland.money/brand) kept below as blue / purple / magenta.
  colors: {
    bg:        "#10002C",   // app page base (deep violet)
    bgSoft:    "#2a0b51",   // app panel surface
    ink:       "#ffffff",   // primary text
    inkSoft:   "#D4CEDC",   // app secondary text
    muted:     "#A194B3",   // app muted text / labels
    gold:      "#C757D8",   // app primary button gradient top (var name kept)
    goldDeep:  "#9A00B2",   // app primary button gradient bottom
    line:      "rgba(255, 255, 255, 0.1)", // app hairline borders
    danger:    "#FF7E98",
    blue:      "#192170",   // Neverland Blue
    purple:    "#480052",   // Neverland Purple
    magenta:   "#b506f5",   // Neverland Magenta
  },

  // --- Archetype accent colors ---------------------------------------------
  // Territory identities. Pixie uses the brand magenta for an on-brand tie-in.
  archetypeColors: {
    pirate:  { main: "#c0433b", deep: "#7d221d", ink: "#fff2ee" }, // rust red
    pixie:   { main: "#b506f5", deep: "#6a0a8f", ink: "#fdefff" }, // Neverland magenta
    mermaid: { main: "#37a89b", deep: "#1d6b62", ink: "#eafff9" }, // teal shallows
    lostboy: { main: "#6f9a4d", deep: "#456029", ink: "#f2ffe6" }, // forest green
  },

  // --- Typography (Neverland brand fonts; loaded in index.html) --------------
  //   Cinzel - titles & headings · Quicksand - application/body text
  fonts: {
    display: '"Cinzel", Georgia, "Times New Roman", serif', // headings / archetype names
    body:    '"Quicksand", system-ui, -apple-system, sans-serif',
  },

  // --- Assets ---------------------------------------------------------------
  assets: {
    crossroads:  "assets/crossroads.jpg", // background scene (user supplies; CSS fallback until then)
    thornwell:   "assets/thornwell.png",  // transparent cactus PNG (reused in share image)
  },

  // --- Share image ----------------------------------------------------------
  share: {
    width: 1080,       // portrait, X/Instagram friendly
    height: 1350,
    fileName: "neverland-sorting",     // -> neverland-sorting-mermaid.png
    shareTitle: "Thornwell read me at the Neverland crossroads",
    // Where "Share on X" sends people (the quiz microsite itself), no protocol.
    linkUrl: "crossroads.neverland.money",
    // Preset comment used when posting the pass to X.
    tweetText: (name, territory) =>
      `Thornwell the Talking Cactus pointed me down the path to ${territory}. I'm a ${name}. Which path is yours?`,
  },
};

/* Mirror brand colors into CSS custom properties so style.css stays generic. */
function applyBrandToCss() {
  const root = document.documentElement;
  const c = BRAND.colors;
  root.style.setProperty("--bg", c.bg);
  root.style.setProperty("--bg-soft", c.bgSoft);
  root.style.setProperty("--ink", c.ink);
  root.style.setProperty("--ink-soft", c.inkSoft);
  root.style.setProperty("--ink-muted", c.muted);
  root.style.setProperty("--gold", c.gold);
  root.style.setProperty("--gold-deep", c.goldDeep);
  root.style.setProperty("--line", c.line);
  root.style.setProperty("--danger", c.danger);
  root.style.setProperty("--font-display", BRAND.fonts.display);
  root.style.setProperty("--font-body", BRAND.fonts.body);
}

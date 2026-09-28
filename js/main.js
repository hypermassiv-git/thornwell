/* =============================================================================
 * main.js - boot, screen navigation, and event wiring
 * -----------------------------------------------------------------------------
 * Depends on: config.js, archetypes.js, questions.js, quiz.js, share.js
 * ========================================================================== */

(() => {
  "use strict";

  // Thornwell's "sizing you up" mutterings (transition flavor).
  const READING_LINES = [
    "Hold still. This takes a second.",
    "Mm. Mm-hm. Oh, that's telling.",
    "Seen your type before. Thousands of times, actually.",
    "Getting a good read on you... don't rush me, I'm rooted here.",
  ];

  // Short send-off line shown above the result (not repeated on the card).
  const SENDOFF_LINES = [
    "There. That's your path. Off you go.",
    "That way. Don't argue, I'm never wrong. Rarely.",
    "Down you go. Mind the roots on your way out.",
    "Your way's marked. Go on, I've got others to point.",
  ];

  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  // Fisher-Yates: return [0..n-1] in a random order.
  function shuffledIndices(n) {
    const a = Array.from({ length: n }, (_, i) => i);
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  let els = {};
  let lastResult = null;

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    applyBrandToCss();
    setupBackground();
    setupParallax();

    // Fill brand-driven text bits.
    setText("[data-brand-name]", BRAND.projectName);
    setText("[data-brand-tagline]", BRAND.tagline);

    els = {
      screens: document.querySelectorAll(".screen"),
      // intro
      beginBtn: byId("begin-btn"),
      // quiz
      progressFill: byId("progress-fill"),
      progressLabel: byId("progress-label"),
      qPrompt: byId("question-prompt"),
      qOptions: byId("question-options"),
      backBtn: byId("back-btn"),
      // reading
      readingLine: byId("reading-line"),
      // result
      resultAccent: byId("result-accent"),
      resultSendoff: byId("result-sendoff"),
      resultMixed: byId("result-mixed"),
      shareCanvas: byId("share-canvas"),
      downloadBtn: byId("download-btn"),
      shareBtn: byId("share-btn"),
      continueBtn: byId("continue-btn"),
      retakeBtn: byId("retake-btn"),
      shareStatus: byId("share-status"),
      stage: byId("stage"),
    };

    els.beginBtn.addEventListener("click", startQuiz);
    els.backBtn.addEventListener("click", onBack);
    els.retakeBtn.addEventListener("click", startQuiz);
    els.downloadBtn.addEventListener("click", onDownload);
    els.shareBtn.addEventListener("click", onShareX);

    // Point "Continue to Neverland" at the real site.
    if (els.continueBtn) els.continueBtn.href = siteUrl();

    showScreen("intro");
  }

  /* Load the crossroads background at a document-relative (subpath-safe) path.
   * The CSS placeholder scene stays hidden unless the real image fails, so it
   * never flashes before the assets load. */
  function setupBackground() {
    const bg = document.querySelector(".stage__bg");
    const stage = document.getElementById("stage");
    if (!bg || !BRAND.assets.crossroads) return;
    const img = new Image();
    img.onload = () => { bg.style.backgroundImage = `url("${img.src}")`; };
    img.onerror = () => { stage.classList.add("crossroads-failed"); }; // show placeholder only on failure
    img.src = BRAND.assets.crossroads; // resolves relative to the document
  }

  /* Subtle pointer-parallax: scene and Thornwell drift slightly opposite the
   * cursor for depth. Skipped on touch and when reduced motion is requested. */
  function setupParallax() {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reduced) return;

    const bg = document.querySelector(".stage__bg");
    const thornwell = document.getElementById("thornwell");
    if (!bg || !thornwell) return;

    window.addEventListener("pointermove", (e) => {
      const nx = e.clientX / window.innerWidth - 0.5;   // -0.5 .. 0.5
      const ny = e.clientY / window.innerHeight - 0.5;
      bg.style.setProperty("--bgx", `${-nx * 16}px`);
      bg.style.setProperty("--bgy", `${-ny * 12}px`);
      thornwell.style.setProperty("--parx-x", `${nx * 14}px`);
    }, { passive: true });
  }

  /* --- Screen management -------------------------------------------------- */

  function showScreen(name) {
    els.screens.forEach((s) => {
      s.classList.toggle("is-active", s.dataset.screen === name);
    });
    if (els.stage) els.stage.dataset.screen = name;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function startQuiz() {
    Quiz.reset();
    renderQuestion();
    showScreen("quiz");
  }

  /* --- Quiz rendering ----------------------------------------------------- */

  function renderQuestion() {
    const q = Quiz.current();
    const pos = Quiz.position();
    const total = Quiz.total();

    els.progressLabel.textContent = `Question ${pos + 1} of ${total}`;
    els.progressFill.style.width = `${((pos) / total) * 100}%`;
    els.backBtn.disabled = pos === 0;

    els.qPrompt.textContent = q.prompt;

    els.qOptions.innerHTML = "";
    // Randomise the on-screen order each render; the ORIGINAL index (origIdx)
    // is what gets scored, so each answer keeps its own weights.
    shuffledIndices(q.options.length).forEach((origIdx) => {
      const opt = q.options[origIdx];
      const btn = document.createElement("button");
      btn.className = "option";
      btn.type = "button";
      btn.textContent = opt.label;
      btn.addEventListener("click", () => onAnswer(origIdx, btn));
      els.qOptions.appendChild(btn);
    });
  }

  function onAnswer(optionIndex, btn) {
    Quiz.answer(optionIndex);

    // highlight the button that was actually clicked, then advance
    els.qOptions.querySelectorAll(".option").forEach((b) => b.classList.toggle("is-picked", b === btn));

    els.progressFill.style.width =
      `${((Quiz.position() + 1) / Quiz.total()) * 100}%`;

    setTimeout(() => {
      if (Quiz.isLast()) {
        runReading();
      } else {
        Quiz.next();
        renderQuestion();
      }
    }, 320);
  }

  function onBack() {
    Quiz.back();
    renderQuestion();
  }

  /* --- Reading transition ------------------------------------------------- */

  function runReading() {
    showScreen("reading");
    let i = 0;
    els.readingLine.textContent = READING_LINES[0];
    const cycle = setInterval(() => {
      i = (i + 1) % READING_LINES.length;
      els.readingLine.style.opacity = 0;
      setTimeout(() => {
        els.readingLine.textContent = READING_LINES[i];
        els.readingLine.style.opacity = 1;
      }, 220);
    }, 900);

    setTimeout(() => {
      clearInterval(cycle);
      showResult();
    }, 2600);
  }

  /* --- Result ------------------------------------------------------------- */

  async function showResult() {
    const result = Quiz.result();
    lastResult = result;
    const ac = BRAND.archetypeColors[result.key];

    // Tint the result screen with the archetype color.
    els.resultAccent.style.setProperty("--accent", ac.main);
    els.resultAccent.style.setProperty("--accent-deep", ac.deep);

    els.resultSendoff.textContent = pick(SENDOFF_LINES);
    els.resultMixed.hidden = !result.mixed;

    // Point the "Share on X" link at X's composer, prefilled with the comment.
    // The shared link goes to the quiz microsite (BRAND.share.linkUrl).
    const text = BRAND.share.tweetText(result.archetype.name, result.archetype.territory);
    const shareLink = /^https?:/.test(BRAND.share.linkUrl)
      ? BRAND.share.linkUrl : "https://" + BRAND.share.linkUrl;
    els.shareBtn.href = "https://x.com/intent/post?text=" +
      encodeURIComponent(text) + "&url=" + encodeURIComponent(shareLink);

    els.shareStatus.textContent = "";
    showScreen("result");

    // Render the shareable image.
    try {
      await Share.render(els.shareCanvas, result);
    } catch (err) {
      console.error("Share image render failed:", err);
    }
  }

  async function onDownload() {
    if (!lastResult) return;
    await Share.download(els.shareCanvas, lastResult);
    flashStatus("Image downloaded.");
  }

  // The link itself opens X's composer (native, never popup-blocked). This just
  // saves the pass image alongside so it can be attached to the post.
  function onShareX() {
    if (!lastResult) return;
    Share.download(els.shareCanvas, lastResult);
    flashStatus("Opening X. Your pass image was saved to attach.");
  }

  function siteUrl() {
    return /^https?:/.test(BRAND.siteUrl) ? BRAND.siteUrl : "https://" + BRAND.siteUrl;
  }

  let statusTimer;
  function flashStatus(msg) {
    els.shareStatus.textContent = msg;
    clearTimeout(statusTimer);
    statusTimer = setTimeout(() => (els.shareStatus.textContent = ""), 3000);
  }

  /* --- helpers ------------------------------------------------------------ */

  function byId(id) { return document.getElementById(id); }
  function setText(sel, text) {
    document.querySelectorAll(sel).forEach((n) => (n.textContent = text));
  }
})();

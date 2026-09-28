/* =============================================================================
 * quiz.js - quiz state machine + weighted scoring with tie personality
 * -----------------------------------------------------------------------------
 * Depends on: questions.js (QUESTIONS), archetypes.js (ARCHETYPES, TIE_ORDER)
 * Exposes a single `Quiz` object used by main.js.
 * ========================================================================== */

const Quiz = (() => {
  // If the top two archetype totals are within this many points, Thornwell
  // treats it as a "mixed read" and uses a tieLine instead of a clean verdict.
  const TIE_MARGIN = 1;

  const state = {
    index: 0,                 // current question index
    answers: [],              // answers[i] = chosen option index for question i
  };

  function reset() {
    state.index = 0;
    state.answers = new Array(QUESTIONS.length).fill(null);
  }

  function current() {
    return QUESTIONS[state.index];
  }

  function total() {
    return QUESTIONS.length;
  }

  function position() {
    return state.index; // 0-based
  }

  function isAnswered(i = state.index) {
    return state.answers[i] !== null && state.answers[i] !== undefined;
  }

  function answer(optionIndex) {
    state.answers[state.index] = optionIndex;
  }

  function next() {
    if (state.index < QUESTIONS.length - 1) state.index++;
    return state.index;
  }

  function back() {
    if (state.index > 0) state.index--;
    return state.index;
  }

  function isLast() {
    return state.index === QUESTIONS.length - 1;
  }

  function allAnswered() {
    return state.answers.every((a) => a !== null && a !== undefined);
  }

  /* --- Scoring ------------------------------------------------------------ */

  function tally() {
    const totals = { pirate: 0, pixie: 0, mermaid: 0, lostboy: 0 };
    state.answers.forEach((optIdx, qIdx) => {
      if (optIdx === null || optIdx === undefined) return;
      const w = QUESTIONS[qIdx].options[optIdx].weights || {};
      for (const key in totals) {
        if (typeof w[key] === "number") totals[key] += w[key];
      }
    });
    return totals;
  }

  /* Optional override hook: return an archetype key string to force a result,
   * or null to score normally. Currently unused. */
  function applyOverride(/* totals, answers */) {
    return null;
  }

  // Sort keys by score desc, breaking ties by TIE_ORDER (canonical order).
  function rankKeys(totals) {
    return [...TIE_ORDER].sort((a, b) => {
      if (totals[b] !== totals[a]) return totals[b] - totals[a];
      return TIE_ORDER.indexOf(a) - TIE_ORDER.indexOf(b);
    });
  }

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  /* Compute the final result object consumed by the result screen + share. */
  function result() {
    const totals = tally();

    const override = applyOverride(totals, state.answers);
    const winnerKey = override || rankKeys(totals)[0];

    const ranked = rankKeys(totals);
    const top = totals[ranked[0]];
    const runnerUp = ranked.length > 1 ? totals[ranked[1]] : -Infinity;
    const mixed = !override && top - runnerUp <= TIE_MARGIN && runnerUp > 0;

    const arch = ARCHETYPES[winnerKey];
    const verdict = mixed && arch.tieLines && arch.tieLines.length
      ? pick(arch.tieLines)
      : pick(arch.verdicts);

    return {
      key: winnerKey,
      archetype: arch,
      totals,
      ranked,
      mixed,          // true when it was a near-tie (Thornwell grumbles)
      runnerUpKey: ranked[1] || null,
      verdict,        // the specific line Thornwell says this run
    };
  }

  return {
    reset, current, total, position, isAnswered, isLast, allAnswered,
    answer, next, back, tally, result,
    getAnswers: () => state.answers.slice(),
  };
})();

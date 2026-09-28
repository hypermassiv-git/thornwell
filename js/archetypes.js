/* =============================================================================
 * archetypes.js - the four Neverland territories + Thornwell's verdicts
 * -----------------------------------------------------------------------------
 * Each archetype has:
 *   key        internal id (matches the weight keys in questions.js)
 *   name       display name (shown big on result + share image)
 *   territory  flavor location name
 *   emblem     filename in assets/emblems/
 *   blurb      1-2 sentence description shown on the result screen
 *   verdicts   array of Thornwell verdict lines (one is picked at random so
 *              retakes feel fresh). Written in his dry, prickly voice.
 *   tieLines   mixed-read lines used when this archetype WINS but only just -
 *              Thornwell grumbling that the read wasn't clean.
 *
 * TIE_ORDER decides ties: earlier = wins. (Also the canonical display order.)
 * ========================================================================== */

const TIE_ORDER = ["pirate", "pixie", "mermaid", "lostboy"];

const ARCHETYPES = {
  pirate: {
    key: "pirate",
    name: "Pirate",
    territory: "Pirate Cove",
    emblem: "assets/emblems/pirate.svg",
    blurb:
      "Loud, grabby, and allergic to patience. Pirates take the shortest line to what they want and argue with anyone in the way, including Thornwell.",
    verdicts: [
      "You told a rooted cactus to hurry up. Pirate. Obviously.",
      "You swore at me. At a plant that can't move. Pirate, no notes.",
      "You'd have me uprooted if it got you moving a second faster. Pirate.",
      "You tried to just push past and skip the whole thing. Pirate.",
    ],
    tieLines: [
      "There's some grit in there fighting it, but you swore first. Pirate. We're calling it Pirate.",
      "Half of you wanted to be something softer. The half that yelled at me won. Pirate.",
    ],
  },

  pixie: {
    key: "pixie",
    name: "Pixie",
    territory: "Pixie Hollow",
    emblem: "assets/emblems/pixie.svg",
    blurb:
      "Fast, bright, and a menace for fun. Pixies treat everything, including your pain, as a bit, and they will absolutely poke Thornwell back.",
    verdicts: [
      "You laughed. At me. To my face. Pixie, and I want it on record that I don't respect it.",
      "I insulted you and you just poked me back. Out of spite. Pixie. Insufferable.",
      "Giggling. You're actually giggling. I'm being deadly serious and you think it's a bit. Pixie.",
      "You did a little spin at the end. A victory spin. Over me. Pixie, unfortunately.",
    ],
    tieLines: [
      "You almost passed for something calmer, and then you laughed. Pixie. It's always the laugh.",
      "Close call, but you poked back. Nobody serious pokes back. Pixie.",
    ],
  },

  mermaid: {
    key: "mermaid",
    name: "Mermaid",
    territory: "Mermaid Lagoon",
    emblem: "assets/emblems/mermaid.svg",
    blurb:
      "Cool, unbothered, elsewhere. Mermaids drift through the crossroads half-noticing it exists and are already thinking about something you'll never hear.",
    verdicts: [
      "Didn't even notice I was talking to you, did you. Mermaid. Off in your own current as usual.",
      "You looked right through me. I'm three feet of spines and you clocked nothing. Mermaid.",
      "Barely a blink. Halfway down a path before I'd finished a sentence. Mermaid, unbothered.",
      "I could have been shouting and you'd have drifted right off. Mermaid.",
    ],
    tieLines: [
      "Something in you nearly reacted, then drifted off mid-thought. Mermaid. You lost the thread and I lost the argument.",
      "You almost had an opinion. It floated away. Mermaid.",
    ],
  },

  lostboy: {
    key: "lostboy",
    name: "Lost Boy",
    territory: "the Lost Boys' Hideout",
    emblem: "assets/emblems/lostboy.svg",
    blurb:
      "Earnest, loyal, a little too sweet for their own good. Lost Boys apologize to furniture and mean it. They'd defend you and Thornwell in the same breath.",
    verdicts: [
      "You asked if I get lonely out here. Lost Boy, and honestly, kind of sweet.",
      "You asked if *I* was doing alright, stuck at a crossroads. Lost Boy.",
      "You patted my pot like we're friends now. We're not. But. Lost Boy.",
      "You offered to water me. Twice. Lost Boy. Don't water me.",
    ],
    tieLines: [
      "You had a sharper edge in you, and then you went and asked if I was okay anyway. Lost Boy. The soft side always wins with you lot.",
      "Nearly something spikier, but you wanted to make sure I was doing alright first. Lost Boy.",
    ],
  },
};

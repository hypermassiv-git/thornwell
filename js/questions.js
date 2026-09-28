/* =============================================================================
 * questions.js - the quiz
 * -----------------------------------------------------------------------------
 * SCHEMA
 *   QUESTIONS = [
 *     {
 *       id:     "q1",                       // unique string
 *       prompt: "Thornwell asks something", // the question, in his voice
 *       options: [
 *         {
 *           label: "What the user picks",
 *           // Points added to each archetype for this answer. Omit an
 *           // archetype to give it 0. Values can be any number (weighting).
 *           weights: { pirate: 3 },
 *         },
 *         ... (2-4 options recommended)
 *       ],
 *     },
 *     ...
 *   ];
 *
 * ARCHETYPE TELLS (what each answer should embody):
 *   pirate  - loud, grabby, impatient; takes what it wants, argues, threatens,
 *             wants to be feared/respected. ("Mine. Move.")
 *   pixie   - mischief for its own sake; jokes, pranks, laughs at pain,
 *             pokes back out of spite, can't be serious. ("Watch this.")
 *   mermaid - cool, elsewhere, unbothered; drifts, forgets, half-notices,
 *             off in its own current. ("Hm? Oh. Anyway.")
 *   lostboy - earnest, loyal, too sweet; apologizes, helps, guards, checks in,
 *             defends others. ("Are you okay?")
 *
 * NOTES
 *   - Keep the weight keys exactly: pirate, pixie, mermaid, lostboy.
 *   - Each option leans one archetype (3 pts). The archetype ORDER is mixed
 *     between questions on purpose, so no single slot always maps to one type.
 *   - Number of questions is flexible; the progress meter adapts.
 * ========================================================================== */

const QUESTIONS = [
  {
    id: "q1",
    prompt:
      "You come up the path and there I am: a talking cactus at the crossroads. What is your first reaction?",
    options: [
      { label: "\"Great. A talking weed. This had better be quick.\"", weights: { pirate: 3 } },
      { label: "\"Wait, you talk? Okay, this just got fun.\"",         weights: { pixie: 3 } },
      { label: "\"...huh.\" I mostly keep walking.",                   weights: { mermaid: 3 } },
      { label: "\"Oh, hello! Are you out here all on your own?\"",     weights: { lostboy: 3 } },
    ],
  },
  {
    id: "q2",
    prompt:
      "The path you want is blocked: thornbushes, and a heap of someone's dropped crates. What do you do?",
    options: [
      { label: "Clear the cargo and stack it neatly, in case they come back for it.", weights: { lostboy: 3 } },
      { label: "Shove through and kick the cargo aside. It's my road now.",           weights: { pirate: 3 } },
      { label: "Drift off toward whichever way looks nicer. I'll get there.",         weights: { mermaid: 3 } },
      { label: "Build a little ramp out of it and turn it into a stunt.",             weights: { pixie: 3 } },
    ],
  },
  {
    id: "q3",
    prompt:
      "Someone drops a gold coin right in front of you and walks off without noticing. What do you do?",
    options: [
      { label: "I probably don't see it. I'm watching the light on the water.", weights: { mermaid: 3 } },
      { label: "\"Hey, you dropped this!\" I chase them down to hand it back.",  weights: { lostboy: 3 } },
      { label: "Mine now. It was on the ground. That's the rule.",              weights: { pirate: 3 } },
      { label: "I balance it on my nose, then flick it at a friend's head.",    weights: { pixie: 3 } },
    ],
  },
  {
    id: "q4",
    prompt:
      "It's the middle of the night. Everyone else is asleep. What are you doing?",
    options: [
      { label: "Wide awake, quietly rearranging someone's boots for the laugh.", weights: { pixie: 3 } },
      { label: "Drifting somewhere quiet, watching the stars do nothing.",       weights: { mermaid: 3 } },
      { label: "Taking the last watch so nobody else has to.",                   weights: { lostboy: 3 } },
      { label: "Awake, counting what's mine and planning how to get more.",      weights: { pirate: 3 } },
    ],
  },
  {
    id: "q5",
    prompt:
      "You lose at something, and everyone saw it happen. How do you take it?",
    options: [
      { label: "I don't lose. We go again until the record says otherwise.",       weights: { pirate: 3 } },
      { label: "I congratulate them and mean it. Then I apologize for something.",  weights: { lostboy: 3 } },
      { label: "I take a dramatic bow and make it the best part of the show.",      weights: { pixie: 3 } },
      { label: "Lose what? I'd already floated off halfway through.",              weights: { mermaid: 3 } },
    ],
  },
  {
    id: "q6",
    prompt:
      "Be honest, I'll know if you're lying. What do you want people to think when they hear your name?",
    options: [
      { label: "That they never quite figured me out.",              weights: { mermaid: 3 } },
      { label: "That they'd be wise not to cross me.",               weights: { pirate: 3 } },
      { label: "That I'd show up for them, no questions asked.",     weights: { lostboy: 3 } },
      { label: "That things are about to get a lot more fun.",       weights: { pixie: 3 } },
    ],
  },
  {
    id: "q7",
    prompt:
      "You walk into a room full of strangers. What is your first move?",
    options: [
      { label: "Find whoever's standing on their own and go say hi.",     weights: { lostboy: 3 } },
      { label: "Make sure they notice me. Loud, front and center.",       weights: { pirate: 3 } },
      { label: "I'm already mid-joke before the door shuts behind me.",   weights: { pixie: 3 } },
      { label: "Slip in quietly and drift over to a window.",             weights: { mermaid: 3 } },
    ],
  },
  {
    id: "q8",
    prompt:
      "Last one. You're finally leaving, off into Neverland. What do you do about me on your way out?",
    options: [
      { label: "I say goodbye. And I feel a little bad about the walking-into-you part.", weights: { lostboy: 3 } },
      { label: "One last flick of a spine, just to hear you complain.",                   weights: { pixie: 3 } },
      { label: "You're lucky I didn't uproot you. Don't push it.",                        weights: { pirate: 3 } },
      { label: "I'm already gone. Was there someone there?",                              weights: { mermaid: 3 } },
    ],
  },
];

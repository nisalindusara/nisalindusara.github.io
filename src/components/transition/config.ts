// Settings for the intro loader and the page transitions (Panel.tsx, TransitionProvider.tsx).
// Every number of both effects lives here. Docs: docs/design-and-motion.md, "Intro and page transitions".

/** The intro stays at least this long (ms, counted from the start of the page load). */
export const INTRO_MIN_MS = 1000;
/** The intro always ends by then, even if the fonts have not loaded (ms). */
export const INTRO_MAX_MS = 3000;

/** One full opacity wave of a letter while the intro waits (ms). */
export const LOOP_PERIOD_MS = 1400;
/** Each letter starts its wave this much after the previous one (ms). */
export const LOOP_STAGGER_MS = 60;
/** Lowest letter opacity in the wave. */
export const LOOP_MIN_OPACITY = 0.3;

/** All letters go to full opacity (ms). */
export const SETTLE_MS = 250;
/** Pause on the full name before the panel lifts (ms). */
export const HOLD_MS = 150;

/** Panel rises from below to cover the page (ms). */
export const COVER_MS = 400;
/** Destination label slides up from behind its mask (ms). */
export const LABEL_IN_MS = 300;
/** The label stays at least this long once it is in (ms). */
export const LABEL_HOLD_MIN_MS = 400;
/** Panel exits upward, revealing the page (ms). Used by the intro and by transitions. */
export const REVEAL_MS = 500;
/** If the new page has not arrived by then, the panel reveals anyway (ms). */
export const ROUTE_TIMEOUT_MS = 2000;

/** Easing of the panel's cover and reveal movement (cubic-bezier). */
export const PANEL_EASE = [0.76, 0, 0.24, 1] as const;

/** CSS-only safety net: a pending intro panel hides itself after this, even if the script failed (ms). */
export const FAILSAFE_MS = 4000;

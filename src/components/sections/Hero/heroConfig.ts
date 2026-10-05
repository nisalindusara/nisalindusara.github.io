// Settings for the home hero (Hero.tsx, Wordmark.tsx). Every number of the hero lives here.
// Docs: docs/design-and-motion.md, "Home hero".

/** Wordmark entrance: each letter slides up over NAME_LETTER_S, starting NAME_STAGGER_S after the previous one. */
export const NAME_LETTER_S = 0.9;
export const NAME_STAGGER_S = 0.06;

/*
 * Slice effect on hover (mouse only). The wordmark is cut into SLICE_COUNT horizontal bands. Moving the
 * pointer across it pushes the bands near the pointer sideways, in a short window around the pointer,
 * so the letters there break into stair-steps; they settle back when the pointer stops.
 */
/** false: no hover effect. */
export const SLICE_ENABLED = true;
/** Number of horizontal bands. More = finer steps. */
export const SLICE_COUNT = 18;
/** How far a band moves per px of pointer speed (per frame). */
export const SLICE_GAIN = 2.4;
/** Largest sideways shift of a band, px. */
export const SLICE_MAX_PX = 110;
/** How many bands react: the spread above and below the pointer, as a share of the wordmark's height. */
export const SLICE_SPREAD = 0.3;
/** Width of the broken window around the pointer, as a share of the wordmark's width: random between these. */
export const SLICE_WIDTH_MIN = 0.06;
export const SLICE_WIDTH_MAX = 0.24;
/** While moving, each band picks a new window width and direction this often, ms. Lower = more jitter. */
export const SLICE_SHUFFLE_MS = 110;
/** Share of the remaining distance a band covers each frame (0 to 1). Higher = snappier. */
export const SLICE_FOLLOW = 0.28;
/** Share of the pointer speed kept each frame after the pointer stops (0 to 1). Higher = longer settle. */
export const SLICE_DECAY = 0.88;

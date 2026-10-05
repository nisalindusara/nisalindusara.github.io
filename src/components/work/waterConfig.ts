// Settings for the water ball on project rows without a preview image (WaterBall.tsx).
// Every number of the effect lives here. Tuning guide: docs/design-and-motion.md, "Water ball".

/** false: a plain circle fades in at the cursor instead of the water effect. */
export const WATER_ENABLED = true;

/** Multiplies every duration. 5 = slow motion for tuning. */
export const TIME_SCALE = 1;

/** Radius of the finished ball, px. */
export const BALL_RADIUS = 48;
/** Number of droplets the film beads into. */
export const BLOB_COUNT = 9;
/** Droplet radius while lying in the film, px. */
export const BLOB_START_R = 2;
/** Droplet radius after beading up, px. */
export const BLOB_BEAD_R = 14;
/** Film thickness along the row's bottom line, px. */
export const FILM_HEIGHT = 3;

/** Film fades in. */
export const FILM_MS = 100;
/** Film draws itself into beads. */
export const BEAD_MS = 220;
/** One droplet's trip to the ball. */
export const GATHER_MS = 340;
/** Extra start delay for the droplet farthest from the ball. */
export const GATHER_STAGGER_MS = 120;
/** Ball settles from its overshoot; the label fades in. */
export const SETTLE_MS = 120;
/** Ball drops back into the film and fades out (also the longest reverse of an unfinished formation). */
export const RELEASE_MS = 350;

/** Goo filter: blur radius. Larger = droplets merge from farther apart. */
export const GOO_BLUR = 8;
/** Goo filter: alpha contrast. Larger = sharper edges. */
export const GOO_ALPHA_MULT = 20;
/** Goo filter: alpha threshold. More negative = thinner, more separated droplets. */
export const GOO_ALPHA_OFFSET = -9;

/** Spring that moves the ball toward the pointer. */
export const FOLLOW_STIFFNESS = 220;
export const FOLLOW_DAMPING = 24;

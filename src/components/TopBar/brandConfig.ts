// Settings for the top-left logo / name swap (BrandSwap.tsx). Docs: docs/design-and-motion.md, "Logo".

/** Time each state (logo, then name) stays before swapping, ms. */
export const BRAND_SWAP_MS = 5000;
/** The name slides up from below over this, seconds (the logo draws itself in instead, Logo.tsx). */
export const BRAND_IN_S = 0.5;
/** The outgoing state slides up and out over this, seconds (the next one starts after it). */
export const BRAND_OUT_S = 0.3;

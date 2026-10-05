"use client";

import { motion, useReducedMotion } from "framer-motion";
import { EASE_OUT } from "@/components/ui/motion";
import styles from "./Logo.module.css";

/*
 * Monogram for Nisal Indusara Paranawithana: an N whose right stem is also the I and the stem of the P,
 * so one shape carries all three initials. The blue dot is a full stop in the site's blue.
 * Drawn in currentColor (dark on light pages, light on dark pages). Geometry: viewBox 40 x 28,
 * strokes 3 units wide, cap height from y 2 to y 26. The favicon (src/app/icon.svg) uses the same paths.
 */
// The N as a filled outline, so its joins are flat (a stroked N gets a sharp mitre spike at the bottom).
const N = "M3 26V2h3.6L18 21V2h3v24h-3.6L6 7v19z";
// The P's bowl, stroked from the shared stem.
const P_BOWL = "M19.5 3.5H25a5.5 5.5 0 0 1 0 11h-5.5";

/** `draw`: on mount the N wipes up, the bowl draws itself and the dot springs in. Reduced motion: shown at once. */
export function Logo({ draw = false, className }: { draw?: boolean; className?: string }) {
  const reduce = useReducedMotion();
  const animate = draw && !reduce;

  return (
    <svg viewBox="0 0 40 28" className={`${styles.logo} ${className ?? ""}`} aria-hidden="true" focusable="false">
      <motion.path
        d={N}
        className={styles.fill}
        {...(animate
          ? {
              initial: { clipPath: "inset(100% 0% 0% 0%)" },
              animate: { clipPath: "inset(0% 0% 0% 0%)" },
              transition: { duration: 0.6, ease: EASE_OUT },
            }
          : {})}
      />
      <motion.path
        d={P_BOWL}
        className={styles.stroke}
        {...(animate
          ? {
              initial: { pathLength: 0 },
              animate: { pathLength: 1 },
              transition: { duration: 0.5, ease: EASE_OUT, delay: 0.3 },
            }
          : {})}
      />
      <motion.circle
        cx="35.5"
        cy="23.5"
        r="2.75"
        className={styles.dot}
        {...(animate
          ? {
              initial: { scale: 0 },
              animate: { scale: 1 },
              transition: { type: "spring", stiffness: 500, damping: 14, delay: 0.6 },
            }
          : {})}
      />
    </svg>
  );
}

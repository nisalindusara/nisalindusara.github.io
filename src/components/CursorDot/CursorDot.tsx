"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { EASE_OUT } from "@/components/ui/motion";
import styles from "./CursorDot.module.css";

/** What counts as clickable (where the browser shows the pointer cursor). */
const CLICKABLE =
  'a[href], button:not(:disabled), [role="button"], summary, label[for], select, input[type="checkbox"], input[type="radio"]';

/**
 * A small blue dot that always sits under the mouse pointer.
 * Over anything clickable (the pointer becomes a hand) it shrinks away: links and buttons
 * have their own blue hover fill, so the dot seems to melt into it.
 * Mouse only; with reduced motion it follows directly instead of with a spring.
 */
export function CursorDot() {
  const reduce = useReducedMotion();
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 600, damping: 40, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 600, damping: 40, mass: 0.4 });
  const [active, setActive] = useState(false);
  const seen = useRef(false);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      if (!seen.current) {
        // First move: start at the cursor instead of flying in from the corner.
        seen.current = true;
        sx.jump(e.clientX);
        sy.jump(e.clientY);
      }
      x.set(e.clientX);
      y.set(e.clientY);
      const target = e.target instanceof Element ? e.target : null;
      setActive(!target?.closest(CLICKABLE));
    };
    const onLeave = () => setActive(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [x, y, sx, sy]);

  return (
    <motion.div
      aria-hidden="true"
      className={styles.dot}
      style={{ x: reduce ? x : sx, y: reduce ? y : sy }}
      initial={false}
      animate={{ scale: active ? 1 : 0, opacity: active ? 1 : 0 }}
      transition={{ duration: 0.25, ease: EASE_OUT }}
    />
  );
}

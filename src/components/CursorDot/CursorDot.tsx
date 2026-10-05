"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { EASE_OUT } from "@/components/ui/motion";
import styles from "./CursorDot.module.css";

/** What counts as clickable (where the browser shows the pointer cursor). */
const CLICKABLE =
  'a[href], button:not(:disabled), [role="button"], summary, label[for], select, input[type="checkbox"], input[type="radio"]';

/** Elements whose hover fill grows out of the dot: buttons with `fill-hover`, and the nav links. */
const FILLS = '.fill-hover, [data-cursor-fill]';

/** Dot diameter in px; must match .dot in CursorDot.module.css. */
const DOT = 18;
const FILL_MS = 500;
/** Leaving is quicker; the dot reappears only once the fill has shrunk back into it. */
const LEAVE_MS = 350;
const FILL_EASE = `cubic-bezier(${EASE_OUT.join(", ")})`;

const running = new WeakMap<Element, Animation>();

/**
 * Animate an element's ::before fill between the cursor dot (at x, y, dot-sized) and its full size.
 * Entering: dot -> full. Leaving: full -> dot at the exit point, then hidden. Returns the duration in ms.
 * `data-fill-leave="instant"` skips the leave animation (the menu circle, whose blend mode returns at once).
 */
function morphFill(el: HTMLElement, x: number, y: number, entering: boolean): number {
  const r = el.getBoundingClientRect();
  const size = parseFloat(getComputedStyle(el, "::before").width) || r.width;
  const dx = x - (r.left + r.width / 2);
  const dy = y - (r.top + r.height / 2);
  const dot = `translate(-50%, -50%) translate(${dx}px, ${dy}px) scale(${DOT / size})`;
  const full = "translate(-50%, -50%) scale(1)";
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const instant = reduce || (!entering && el.dataset.fillLeave === "instant");
  const duration = instant ? 0 : entering ? FILL_MS : LEAVE_MS;

  running.get(el)?.cancel();
  const animation = el.animate(
    entering
      ? [
          { transform: dot, opacity: 1 },
          { transform: full, opacity: 1 },
        ]
      : [
          { transform: full, opacity: 1 },
          { transform: dot, opacity: 1, offset: 0.99 },
          { transform: dot, opacity: 0 },
        ],
    { pseudoElement: "::before", duration, easing: FILL_EASE, fill: "forwards" },
  );
  running.set(el, animation);
  if (!entering) {
    // Hand back to the CSS (hidden) state once the fill is gone.
    animation.onfinish = () => {
      animation.cancel();
      running.delete(el);
    };
  }
  return duration;
}

/**
 * A small blue dot that always sits under the mouse pointer.
 * Over a link or button it shrinks away. On buttons and nav links the blue hover fill grows out of
 * that exact spot, so the dot seems to become the fill. Leaving, the fill shrinks back toward the exit
 * point; only after it is gone does the dot grow in again, directly under the pointer (it never travels).
 * Mouse only; with reduced motion the dot follows directly and the fills appear without growing.
 */
export function CursorDot() {
  const reduce = useReducedMotion();
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 600, damping: 40, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 600, damping: 40, mass: 0.4 });
  const [overClickable, setOverClickable] = useState(true);
  // While a fill shrinks back, the dot waits; then it grows in under the pointer.
  const [handingBack, setHandingBack] = useState(false);
  const seen = useRef(false);
  const fillTarget = useRef<HTMLElement | null>(null);
  const handBackTimer = useRef(0);

  useEffect(() => {
    const switchFill = (next: HTMLElement | null, px: number, py: number) => {
      if (next === fillTarget.current) return;
      const leaving = fillTarget.current;
      fillTarget.current = next;
      if (next) morphFill(next, px, py, true);
      if (!leaving) return;

      const duration = morphFill(leaving, px, py, false);
      window.clearTimeout(handBackTimer.current);
      if (next) return; // straight into another fill: no dot in between
      setHandingBack(true);
      handBackTimer.current = window.setTimeout(() => {
        if (fillTarget.current) return;
        // The dot only ever appears under the pointer: place it there, then let it grow in.
        sx.jump(x.get());
        sy.jump(y.get());
        setHandingBack(false);
      }, duration);
    };

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
      const clickable = !!target?.closest(CLICKABLE);
      setOverClickable(clickable);
      switchFill((target?.closest(FILLS) as HTMLElement | null) ?? null, e.clientX, e.clientY);
    };
    const onLeave = (e: PointerEvent) => {
      setOverClickable(true);
      switchFill(null, e.clientX, e.clientY);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.clearTimeout(handBackTimer.current);
    };
  }, [x, y, sx, sy]);

  const visible = !overClickable && !handingBack;

  return (
    <motion.div
      aria-hidden="true"
      className={styles.dot}
      style={{ x: reduce ? x : sx, y: reduce ? y : sy }}
      initial={false}
      animate={{ scale: visible ? 1 : 0, opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.25, ease: EASE_OUT }}
    />
  );
}

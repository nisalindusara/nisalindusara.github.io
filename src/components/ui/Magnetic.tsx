"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

const SPRING = { stiffness: 220, damping: 14, mass: 0.4 };

/**
 * Subtle "magnetic" hover: while a mouse pointer moves over the element it drifts slightly
 * towards the cursor (at most `max` px), and springs back when the pointer leaves.
 * Mouse only (not touch), and off with reduced motion. Spread the result on a motion element.
 */
export function useMagnetic({ strength = 0.2, max = 6 } = {}) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, SPRING);
  const sy = useSpring(y, SPRING);
  const clamp = (v: number) => Math.max(-max, Math.min(max, v));

  return {
    style: { x: sx, y: sy },
    onPointerMove: (e: React.PointerEvent<HTMLElement>) => {
      if (reduce || e.pointerType !== "mouse") return;
      const r = e.currentTarget.getBoundingClientRect();
      // Measure from the element's resting centre (the rect already includes the drift).
      const cx = r.left - sx.get() + r.width / 2;
      const cy = r.top - sy.get() + r.height / 2;
      x.set(clamp((e.clientX - cx) * strength));
      y.set(clamp((e.clientY - cy) * strength));
    },
    onPointerLeave: () => {
      x.set(0);
      y.set(0);
    },
  };
}

/** Wrapper version of useMagnetic for elements that can't take motion props themselves. */
export function Magnetic({
  children,
  className,
  block = false,
  strength,
  max,
}: {
  children: React.ReactNode;
  className?: string;
  /** display: block instead of inline-block (e.g. to stretch full width). */
  block?: boolean;
  strength?: number;
  max?: number;
}) {
  const magnetic = useMagnetic({ strength, max });
  return (
    <motion.span
      className={className}
      {...magnetic}
      style={{ ...magnetic.style, display: block ? "block" : "inline-block" }}
    >
      {children}
    </motion.span>
  );
}

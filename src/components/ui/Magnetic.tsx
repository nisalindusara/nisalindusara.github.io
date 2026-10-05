"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

/** Share of the pointer's distance from the centre that the element moves. */
const STRENGTH = 0.5;
/** Largest movement on each axis, px. */
const MAX_OFFSET = 30;
const STIFFNESS = 200;
const DAMPING = 20;

/** Extra hit area around the element, px (padding with an equal negative margin: no layout change). */
const HIT = 8;

const clamp = (v: number) => Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, v));

/**
 * Magnetic hover: the outer wrapper never moves and tracks the pointer; the inner element moves
 * toward it ((pointer - wrapper centre) x STRENGTH, at most MAX_OFFSET px per axis) on a spring,
 * and springs back to rest when the pointer leaves. Transform only.
 * Hover-capable devices with a fine pointer only; no movement on keyboard focus or with reduced motion.
 */
export function Magnetic({
  children,
  className,
  block = false,
}: {
  children: React.ReactNode;
  /** Classes for the fixed outer wrapper (e.g. its position). */
  className?: string;
  /** display: block instead of inline-block (e.g. to stretch full width). */
  block?: boolean;
}) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: STIFFNESS, damping: DAMPING });
  const sy = useSpring(y, { stiffness: STIFFNESS, damping: DAMPING });

  const onPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (reduce || e.pointerType === "touch") return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set(clamp((e.clientX - (r.left + r.width / 2)) * STRENGTH));
    y.set(clamp((e.clientY - (r.top + r.height / 2)) * STRENGTH));
  };
  const onPointerLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <span
      className={className}
      style={{ display: block ? "block" : "inline-block", padding: HIT, margin: -HIT }}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <motion.span style={{ display: "block", x: sx, y: sy }}>{children}</motion.span>
    </span>
  );
}

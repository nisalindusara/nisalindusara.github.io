"use client";

import { motion } from "framer-motion";
import { EASE_OUT } from "./motion";

/** A 1px rule that draws in from left to right (once). Colour comes from currentColor via the className. */
export function Hairline({
  className,
  delay = 0,
  trigger = "view",
}: {
  className?: string;
  delay?: number;
  trigger?: "view" | "load";
}) {
  const play =
    trigger === "load" ? { animate: { scaleX: 1 } } : { whileInView: { scaleX: 1 }, viewport: { once: true } };
  return (
    <motion.div
      aria-hidden="true"
      data-reveal
      className={className}
      style={{ height: 1, background: "var(--line)", transformOrigin: "0 50%" }}
      initial={{ scaleX: 0 }}
      transition={{ duration: 0.6, ease: EASE_OUT, delay }}
      {...play}
    />
  );
}

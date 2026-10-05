"use client";

import { motion } from "framer-motion";
import { EASE_OUT } from "./motion";
import { useReveal } from "./useReveal";

/** A 1px rule that draws in from left to right (once, once the page is ready). Colour comes from currentColor via the className. */
export function Hairline({
  className,
  delay = 0,
  trigger = "view",
}: {
  className?: string;
  delay?: number;
  trigger?: "view" | "load";
}) {
  const { ref, play } = useReveal<HTMLDivElement>({ trigger });
  return (
    <motion.div
      ref={ref}
      aria-hidden="true"
      data-reveal
      className={className}
      style={{ height: 1, background: "var(--line)", transformOrigin: "0 50%" }}
      initial={{ scaleX: 0 }}
      animate={{ scaleX: play ? 1 : 0 }}
      transition={{ duration: 0.6, ease: EASE_OUT, delay }}
    />
  );
}

"use client";

import { motion } from "framer-motion";
import { DURATION, EASE_OUT } from "./motion";
import { useReveal } from "./useReveal";

type Props = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

/** Fades and lifts its content in once, when it enters the viewport (and the page is ready). */
export function Reveal({ children, className, delay = 0 }: Props) {
  const { ref, play } = useReveal<HTMLDivElement>({ amount: 0.2 });
  return (
    <motion.div
      ref={ref}
      data-reveal
      className={className}
      initial={{ opacity: 0, y: 24 }}
      animate={play ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: DURATION, ease: EASE_OUT, delay }}
    >
      {children}
    </motion.div>
  );
}

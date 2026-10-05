"use client";

import { motion } from "framer-motion";
import { DURATION, EASE_OUT } from "./motion";

type Props = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

/** Fades and lifts its content in once, when it enters the viewport. */
export function Reveal({ children, className, delay = 0 }: Props) {
  return (
    <motion.div
      data-reveal
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: DURATION, ease: EASE_OUT, delay }}
    >
      {children}
    </motion.div>
  );
}

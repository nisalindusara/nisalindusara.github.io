"use client";

import { motion, type Variants } from "framer-motion";
import { EASE_OUT } from "./motion";

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.025 } },
};

const word: Variants = {
  hidden: { opacity: 0, y: "0.3em" },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE_OUT } },
};

type Props = {
  text: string;
  as?: "p" | "h1" | "h2";
  className?: string;
  /** "view": when scrolled into view (default); "load": straight away. */
  trigger?: "view" | "load";
  id?: string;
};

/** Reveals a sentence word by word. Each word fades and rises into place. */
export function WordReveal({ text, as = "p", className, trigger = "view", id }: Props) {
  const Tag = motion[as];
  const play =
    trigger === "load"
      ? { animate: "visible" }
      : { whileInView: "visible", viewport: { once: true, amount: 0.3 } };

  return (
    <Tag id={id} className={className} variants={container} initial="hidden" {...play}>
      {text.split(" ").map((w, i) => (
        <span key={i}>
          <motion.span data-reveal style={{ display: "inline-block" }} variants={word}>
            {w}
          </motion.span>{" "}
        </span>
      ))}
    </Tag>
  );
}

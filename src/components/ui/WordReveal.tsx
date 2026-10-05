"use client";

import { motion, type Variants } from "framer-motion";
import { EASE_OUT } from "./motion";
import { useReveal } from "./useReveal";

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
  /** "view": when scrolled into view (default); "load": straight away. Both wait for the page to be ready. */
  trigger?: "view" | "load";
  id?: string;
};

/** Reveals a sentence word by word. Each word fades and rises into place. */
export function WordReveal({ text, as = "p", className, trigger = "view", id }: Props) {
  const Tag = motion[as];
  const { ref, play } = useReveal<HTMLParagraphElement & HTMLHeadingElement>({ trigger, amount: 0.3 });

  return (
    <Tag
      ref={ref}
      id={id}
      className={className}
      variants={container}
      initial="hidden"
      animate={play ? "visible" : "hidden"}
    >
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

"use client";

import { motion, type Variants } from "framer-motion";
import { EASE_OUT } from "./motion";
import { useReveal } from "./useReveal";

const slide: Variants = {
  hidden: { y: "110%" },
  visible: { y: "0%", transition: { duration: 0.5, ease: EASE_OUT } },
};

const tags = { span: motion.span, h2: motion.h2, p: motion.p };

/**
 * Text that slides up from behind a mask when it enters the viewport (once, once the page is ready).
 * The mask (not the hidden text, which is clipped away) is what's watched for visibility.
 */
export function MaskText({
  children,
  as = "span",
  className,
  id,
}: {
  children: React.ReactNode;
  as?: keyof typeof tags;
  className?: string;
  id?: string;
}) {
  const Tag = tags[as];
  const { ref, play } = useReveal<HTMLParagraphElement & HTMLHeadingElement & HTMLSpanElement>();
  return (
    <Tag
      ref={ref}
      id={id}
      className={className}
      style={{ display: "block", overflow: "hidden" }}
      initial="hidden"
      animate={play ? "visible" : "hidden"}
    >
      <motion.span data-reveal style={{ display: "block" }} variants={slide}>
        {children}
      </motion.span>
    </Tag>
  );
}

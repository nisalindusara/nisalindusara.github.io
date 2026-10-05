"use client";

import { forwardRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Project } from "@/content/projects";
import { EASE_OUT } from "@/components/ui/motion";
import { useReveal } from "@/components/ui/useReveal";
import { TransitionLink } from "@/components/transition/TransitionLink";
import styles from "./ProjectList.module.css";

type Props = {
  project: Project;
  /** Position in the full visible list (stays the same while filtering). */
  index: number;
  /** Stagger on first load only. */
  delay: number;
  linkProps: React.ComponentProps<"a">;
  /** Cursor effect drawn inside the row (the blue ball for projects without a preview). */
  effect?: React.ReactNode;
};

// forwardRef: AnimatePresence's popLayout mode measures exiting rows.
export const ProjectRow = forwardRef<HTMLLIElement, Props>(function ProjectRow(
  { project, index, delay, linkProps, effect },
  ref,
) {
  // Rows that are there on arrival wait for the page to be ready; rows that return after filtering play at once.
  const { play } = useReveal({ trigger: "load" });
  return (
    <motion.li
      ref={ref}
      layout
      className={styles.item}
      initial={{ opacity: 0, y: 16 }}
      animate={
        play ? { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE_OUT, delay } } : { opacity: 0, y: 16 }
      }
      exit={{ opacity: 0, y: -8, transition: { duration: 0.25, ease: EASE_OUT } }}
      transition={{ duration: 0.25, ease: EASE_OUT }}
    >
      <TransitionLink href={`/work/${project.slug}/`} className={styles.row} {...linkProps}>
        <span className={styles.index}>{String(index + 1).padStart(2, "0")}</span>
        <span className={styles.title}>{project.title}</span>
        <span className={styles.type}>{project.type}</span>
        <span className={styles.stack}>{project.stack.join(", ")}</span>
        <span className={styles.year}>{project.year}</span>
        {project.preview && (
          <span className={styles.thumb}>
            <Image src={project.preview} alt="" width={800} height={600} />
          </span>
        )}
        {effect}
      </TransitionLink>
    </motion.li>
  );
});

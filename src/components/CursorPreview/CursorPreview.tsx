"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import type { Project } from "@/content/projects";
import { EASE_OUT } from "@/components/ui/motion";
import { BlueBall } from "@/components/work/BlueBall";
import styles from "./CursorPreview.module.css";

/**
 * The cursor effect for project rows (home Work section, /work, "Next project"). The single place that
 * decides per project: with a `preview` image, the cursor-following image card ("View"); without one,
 * the blue ball (BlueBall.tsx) that follows the cursor inside the row.
 * Spread `listProps` on the list and `rowProps(slug)` on each row link, render `rowEffect(project)` inside
 * each row link, and render `bubble` once. Only on devices with hover and a fine pointer (see CSS).
 */
export function useCursorPreview(projects: Project[], { label = "View" }: { label?: string } = {}) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<string | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const spring = { stiffness: 300, damping: 30, mass: 0.6 };
  const sx = useSpring(x, spring);
  const sy = useSpring(y, spring);

  const listProps = {
    onPointerEnter: (e: React.PointerEvent) => {
      // Start at the cursor instead of flying in from the corner.
      sx.jump(e.clientX);
      sy.jump(e.clientY);
      x.set(e.clientX);
      y.set(e.clientY);
    },
    onPointerMove: (e: React.PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    },
    onPointerLeave: () => setActive(null),
  };

  const rowProps = (slug: string) => ({
    onPointerEnter: () => setActive(slug),
    // Keyboard focus shouldn't leave a bubble floating somewhere else.
    onFocus: () => setActive(null),
  });

  // Only projects with a preview image use the floating card.
  const current = projects.find((p) => p.slug === active && p.preview);

  /** Inside each row link: the blue ball for projects without a preview image. */
  const rowEffect = (project: Project) => (project.preview ? null : <BlueBall label={label} />);

  const bubble = (
    <motion.div
      className={styles.bubble}
      // Reduced motion: follow the cursor directly, no spring lag.
      style={{ x: reduce ? x : sx, y: reduce ? y : sy }}
      initial={false}
      animate={{ scale: current ? 1 : 0, opacity: current ? 1 : 0 }}
      transition={{ duration: 0.35, ease: EASE_OUT }}
      aria-hidden="true"
    >
      <div className={styles.card}>
        {projects.map(
          (project) =>
            project.preview && (
              <Image
                key={project.slug}
                src={project.preview}
                alt=""
                width={800}
                height={600}
                className={styles.image}
                style={{ opacity: active === project.slug ? 1 : 0 }}
              />
            ),
        )}
        <span className={styles.view}>{label}</span>
      </div>
    </motion.div>
  );

  return { listProps, rowProps, rowEffect, bubble };
}

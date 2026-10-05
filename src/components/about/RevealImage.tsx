"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionStyle,
  type Variants,
} from "framer-motion";
import type { AboutImage } from "@/content/about";
import { EASE_OUT } from "@/components/ui/motion";
import { useReveal } from "@/components/ui/useReveal";
import styles from "./about.module.css";

const reveal = { duration: 0.8, ease: EASE_OUT };
const instant = { duration: 0 };

// Reduced motion still ends "visible", just instantly (the hidden start state is already applied on load).
const frameVariants = (reduce: boolean): Variants => ({
  hidden: { clipPath: "inset(100% 0% 0% 0%)" },
  visible: { clipPath: "inset(0% 0% 0% 0%)", transition: reduce ? instant : reveal },
});
const imageVariants = (reduce: boolean): Variants => ({
  hidden: { scale: 1.12 },
  visible: { scale: 1, transition: reduce ? instant : reveal },
});

/**
 * Rounded image that unveils upwards (clip-path) while the photo settles from 1.12 to 1, once.
 * The unclipped <figure> is what's watched for visibility (a fully clipped element never "intersects").
 * `parallax`: the oversized photo drifts ±30px inside its frame as the page scrolls.
 * Reduced motion: shown straight away, no reveal or parallax.
 */
export function RevealImage({
  image,
  parallax = false,
  eager = false,
  className,
}: {
  image: AboutImage;
  parallax?: boolean;
  eager?: boolean;
  className?: string;
}) {
  const reduce = useReducedMotion();
  // Reduced motion: shown on load, without waiting to be scrolled into view.
  const { ref, play } = useReveal<HTMLElement>({ trigger: reduce ? "load" : "view", amount: 0.15 });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-30, 30]);

  return (
    <motion.figure ref={ref} className={className} initial="hidden" animate={play ? "visible" : "hidden"}>
      <motion.div
        data-reveal-clip
        className={styles.frame}
        // --ratio caps the width in about.module.css so the frame never exceeds the viewport height.
        style={{ aspectRatio: `${image.width} / ${image.height}`, "--ratio": image.width / image.height } as MotionStyle}
        variants={frameVariants(!!reduce)}
      >
        <motion.img
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          className={parallax ? `${styles.img} ${styles.imgParallax}` : styles.img}
          style={parallax ? { y } : undefined}
          variants={imageVariants(!!reduce)}
        />
      </motion.div>
      {image.caption && <figcaption className={styles.caption}>{image.caption}</figcaption>}
    </motion.figure>
  );
}

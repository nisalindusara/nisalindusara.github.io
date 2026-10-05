"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type Variants } from "framer-motion";
import type { AboutImage } from "@/content/about";
import { EASE_OUT } from "@/components/ui/motion";
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
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-30, 30]);
  const play = reduce
    ? { initial: "hidden", animate: "visible" }
    : { initial: "hidden", whileInView: "visible", viewport: { once: true, amount: 0.15 } };

  return (
    <motion.figure ref={ref} className={className} {...play}>
      <motion.div
        data-reveal-clip
        className={styles.frame}
        style={{ aspectRatio: `${image.width} / ${image.height}` }}
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

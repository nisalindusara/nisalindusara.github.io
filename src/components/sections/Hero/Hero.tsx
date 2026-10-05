"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { profile } from "@/content/profile";
import { useReveal } from "@/components/ui/useReveal";
import { TopBar } from "@/components/TopBar/TopBar";
import { Wordmark } from "./Wordmark";
import styles from "./Hero.module.css";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  // The wordmark enters when the page is ready (as the intro or transition panel lifts).
  const { play } = useReveal({ trigger: "load" });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.25]);

  return (
    <section ref={ref} id="top" className={styles.hero} aria-label="Introduction" data-nav-sentinel>
      {/* Top row: logo, then a role line (1024px and wider); the global nav sits top right.
          Not the nav sentinel here: the whole hero is. */}
      <div className={`container ${styles.top}`}>
        <TopBar theme="light" sentinel={false} />
        <p className={styles.role}>{profile.heroRole}</p>
      </div>

      <motion.div className={`container ${styles.inner}`} style={reduce ? undefined : { y, opacity }}>
        {/* The page's only <h1>. Screen readers get the full name; the wordmark is decoration. */}
        <h1 className={styles.title}>
          <span className="visually-hidden">{profile.fullName}</span>
          <Wordmark word={profile.heroWord} play={play} />
        </h1>
      </motion.div>
    </section>
  );
}

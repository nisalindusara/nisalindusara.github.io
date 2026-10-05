"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { profile } from "@/content/profile";
import { EASE_OUT } from "@/components/ui/motion";
import { TopBar } from "@/components/TopBar/TopBar";
import styles from "./Hero.module.css";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.25]);

  return (
    <section ref={ref} id="top" className={styles.hero} aria-label="Introduction" data-nav-sentinel>
      {/* Name top left, as on every page. Not the nav sentinel here: the whole hero is. */}
      <div className={`container ${styles.topBar}`}>
        <TopBar name={profile.name} theme="light" sentinel={false} />
      </div>
      <motion.div className={`container ${styles.inner}`} style={reduce ? undefined : { y, opacity }}>
        <h1 className={styles.name}>
          <span className={styles.mask} aria-hidden="true">
            <motion.span
              data-reveal
              className={styles.line}
              initial={{ y: "110%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 0.65, ease: EASE_OUT, delay: 0.1 }}
            >
              {profile.firstName}
            </motion.span>
          </span>
          {/* Screen readers and search engines get the full name. */}
          <span className="visually-hidden">{profile.name}</span>
        </h1>
      </motion.div>
    </section>
  );
}

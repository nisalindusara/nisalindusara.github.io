"use client";

import { motion } from "framer-motion";
import { about } from "@/content/about";
import { EASE_OUT } from "@/components/ui/motion";
import { AboutBlock } from "./AboutBlock";
import styles from "./about.module.css";

export function Achievements() {
  const items = about.achievements;
  if (!items.length) return null;

  return (
    <AboutBlock label={about.labels.achievements} id="achievements-label">
      <ul className={styles.achievements}>
        {items.map((a, i) => (
          <motion.li
            key={a.title}
            data-reveal
            className={styles.achievement}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.45, ease: EASE_OUT, delay: i * 0.08 }}
          >
            <span className={styles.year}>{a.year}</span>
            <span className={styles.achievementTitle}>{a.title}</span>
            {a.note && <span className={styles.note}>{a.note}</span>}
          </motion.li>
        ))}
      </ul>
    </AboutBlock>
  );
}

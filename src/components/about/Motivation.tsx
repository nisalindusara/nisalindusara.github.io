"use client";

import { motion } from "framer-motion";
import { about } from "@/content/about";
import { EASE_OUT } from "@/components/ui/motion";
import { WordReveal } from "@/components/ui/WordReveal";
import { AboutBlock } from "./AboutBlock";
import styles from "./about.module.css";

export function Motivation() {
  const { statement, paragraphs } = about.motivation;
  if (!statement && !paragraphs.length) return null;

  return (
    <AboutBlock label={about.labels.motivation} id="motivation-label">
      {statement && <WordReveal text={statement} className={styles.motivation} />}
      {paragraphs.map((p, i) => (
        <motion.p
          key={i}
          data-reveal
          className={styles.paragraph}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, ease: EASE_OUT, delay: 0.1 + i * 0.08 }}
        >
          {p}
        </motion.p>
      ))}
    </AboutBlock>
  );
}

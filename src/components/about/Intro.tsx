"use client";

import { motion } from "framer-motion";
import { about } from "@/content/about";
import { EASE_OUT } from "@/components/ui/motion";
import { Hairline } from "@/components/ui/Hairline";
import { MaskText } from "@/components/ui/MaskText";
import { WordReveal } from "@/components/ui/WordReveal";
import { RevealImage } from "./RevealImage";
import styles from "./about.module.css";

/** Statement, short paragraph, facts and portrait. */
export function Intro() {
  const { statement, body, facts, images, labels } = about;
  const rows = facts.filter((f) => f.value.trim());
  if (!statement && !body && rows.length === 0 && !images.portrait) return null;

  return (
    <section className={styles.intro} aria-labelledby="about-title">
      {statement && (
        <WordReveal as="h1" id="about-title" trigger="load" text={statement} className={styles.statement} />
      )}

      <div className={styles.introGrid}>
        <div className={styles.introText}>
          <MaskText as="p" className={styles.label}>
            {labels.about}
          </MaskText>
          {body && (
            <motion.p
              data-reveal
              className={styles.body}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.3 }}
            >
              {body}
            </motion.p>
          )}
        </div>

        {images.portrait && <RevealImage image={images.portrait} parallax eager className={styles.portrait} />}

        {rows.length > 0 && (
          <ul className={styles.facts}>
            {rows.map((f, i) => (
              <li key={f.label}>
                <Hairline trigger="load" delay={0.3 + i * 0.08} />
                <motion.div
                  data-reveal
                  className={styles.fact}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, ease: EASE_OUT, delay: 0.4 + i * 0.08 }}
                >
                  <span className={styles.factLabel}>{f.label}</span>
                  <span className={styles.factValue}>{f.value}</span>
                </motion.div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

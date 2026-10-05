"use client";

import { motion } from "framer-motion";
import { about } from "@/content/about";
import { EASE_OUT } from "@/components/ui/motion";
import { AboutBlock } from "./AboutBlock";
import styles from "./about.module.css";

export function Toolbox() {
  const groups = about.toolbox.filter((g) => g.items.length);
  if (!groups.length) return null;

  return (
    <AboutBlock label={about.labels.toolbox} id="toolbox-label">
      <div className={styles.toolbox}>
        {groups.map((g, i) => (
          <motion.div
            key={g.label}
            data-reveal
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, ease: EASE_OUT, delay: i * 0.08 }}
          >
            <p className={styles.groupLabel}>{g.label}</p>
            <ul>
              {g.items.map((item) => (
                <li key={item} className={styles.tool}>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </AboutBlock>
  );
}

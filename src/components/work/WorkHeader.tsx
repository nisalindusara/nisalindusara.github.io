"use client";

import { motion } from "framer-motion";
import { workPage } from "@/content/work";
import { EASE_OUT } from "@/components/ui/motion";
import { useReveal } from "@/components/ui/useReveal";
import { TopBar } from "@/components/TopBar/TopBar";
import styles from "./WorkHeader.module.css";

/** Name (top left, scrolls away) and the two-line headline. The global nav sits top right. */
export function WorkHeader() {
  const { play } = useReveal({ trigger: "load" });
  return (
    <header className={styles.header}>
      <div className="container">
        <TopBar theme="light" />
      </div>

      <div className="container">
        <h1 className={styles.headline}>
          {workPage.headline.map((line, i) => (
            <span key={line} className={styles.mask}>
              <motion.span
                data-reveal
                className={styles.line}
                initial={{ y: "110%" }}
                animate={{ y: play ? "0%" : "110%" }}
                transition={{ duration: 0.65, ease: EASE_OUT, delay: 0.1 + i * 0.1 }}
              >
                {line}
              </motion.span>{" "}
            </span>
          ))}
        </h1>
      </div>
    </header>
  );
}

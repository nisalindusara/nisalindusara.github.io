"use client";

import Link from "next/link";
import { profile } from "@/content/profile";
import { WordReveal } from "@/components/ui/WordReveal";
import { Arrow } from "@/components/ui/Arrow";
import styles from "./About.module.css";

/** `moreLabel` comes from the server page so the About page's content isn't bundled here. */
export function About({ moreLabel }: { moreLabel: string }) {
  return (
    <section id="about" className={styles.about} aria-labelledby="about-label">
      <div className="container">
        <h2 id="about-label" className="visually-hidden">
          About
        </h2>
        <WordReveal text={profile.about} className={styles.statement} />
        <Link href="/about/" className={styles.more}>
          {moreLabel}
          <Arrow className={styles.arrow} />
        </Link>
      </div>
    </section>
  );
}

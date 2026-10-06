"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { profile, socials } from "@/content/profile";
import { Button, ScrollLink } from "@/components/ui/Button";
import { Magnetic } from "@/components/ui/Magnetic";
import { EASE_OUT } from "@/components/ui/motion";
import styles from "./Footer.module.css";

/**
 * A full-screen contact section, fixed behind the page. The page wrapper gets a
 * bottom margin equal to this footer's height, so scrolling to the end slides
 * the page up to reveal it. If it is taller than the viewport it stays in flow.
 */
export function Footer() {
  const ref = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(false);

  // The footer is fixed behind the page, so it is always "in view". Instead, watch the marker at the
  // bottom of the page wrapper (layout.tsx): once it has risen above 65% of the window, about a third of
  // the footer is uncovered. The root reaches one window above the top so the marker still counts at the
  // very end of the page. Scrolling back up resets it, so the slide plays on every reveal.
  useEffect(() => {
    const marker = document.querySelector("[data-footer-sentinel]");
    if (!marker) return;
    const observer = new IntersectionObserver(([entry]) => setRevealed(entry.isIntersecting), {
      rootMargin: "100% 0px -35% 0px",
    });
    observer.observe(marker);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const root = document.documentElement;

    const measure = () => {
      const height = el.offsetHeight;
      const fits = height <= window.innerHeight;
      el.dataset.fixed = String(fits);
      root.style.setProperty("--footer-h", fits ? `${height}px` : "0px");
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
      root.style.removeProperty("--footer-h");
    };
  }, []);

  // "Let's work together": avatar sits in front of the first two words, the rest wraps below.
  const words = profile.closingLine.split(" ");
  const firstLine = words.slice(0, 2).join(" ");
  const secondLine = words.slice(2).join(" ");

  return (
    <footer
      ref={ref}
      className={styles.footer}
      aria-labelledby="footer-title"
      // Keyboard focus inside a still-covered footer: uncover it so the focus ring is visible.
      onFocus={() => {
        if (ref.current?.dataset.fixed === "true") {
          window.scrollTo({ top: document.documentElement.scrollHeight });
        }
      }}
    >
      <div className={styles.inner}>
        <div className={styles.content}>
          <div className={styles.top}>
            <h2 id="footer-title" className={styles.title}>
              {/* Each line slides up into place from behind a mask when the footer is revealed. */}
              <span className={styles.mask}>
                <motion.span
                  data-reveal
                  className={styles.firstLine}
                  initial={{ y: "110%" }}
                  animate={{ y: revealed ? "0%" : "110%" }}
                  transition={{ duration: 0.65, ease: EASE_OUT }}
                >
                  <Image
                    src={profile.avatar}
                    alt=""
                    width={200}
                    height={200}
                    className={styles.avatar}
                  />
                  {firstLine}
                </motion.span>
              </span>{" "}
              <span className={styles.mask}>
                <motion.span
                  data-reveal
                  className={styles.secondLine}
                  initial={{ y: "110%" }}
                  animate={{ y: revealed ? "0%" : "110%" }}
                  transition={{ duration: 0.65, ease: EASE_OUT, delay: revealed ? 0.1 : 0 }}
                >
                  {secondLine}
                </motion.span>
              </span>
            </h2>
            <span className={styles.arrow} aria-hidden="true">
              ↙
            </span>
          </div>

          <div className={styles.rule}>
            {/* The wrapper is positioned (and tracks the pointer); the circle drifts and scales on hover. */}
            <Magnetic className={styles.ctaPos}>
              <a href={`mailto:${profile.email}`} className={styles.cta}>
                {profile.contactCta}
              </a>
            </Magnetic>
          </div>

          <ul className={styles.buttons}>
            <li>
              <Magnetic block>
                <Button href={`mailto:${profile.email}`} className={`fill-hover ${styles.pill}`}>
                  Email
                </Button>
              </Magnetic>
            </li>
            {socials.map((s) => (
              <li key={s.label}>
                <Magnetic block>
                  <Button href={s.href} className={`fill-hover ${styles.pill}`}>
                    {s.label}
                  </Button>
                </Magnetic>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.bottom}>
          <p>
            © {profile.copyrightYear} {profile.name}
          </p>
          <ScrollLink href="#main" className={styles.toTop}>
            Back to top <span aria-hidden="true">↑</span>
          </ScrollLink>
        </div>
      </div>
    </footer>
  );
}

"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { navItems } from "@/content/nav";
import { useLenis } from "@/components/LenisProvider";
import { EASE_OUT } from "@/components/ui/motion";
import styles from "./MenuOverlay.module.css";

type Props = {
  open: boolean;
  /** Centre of the menu button, where the circular reveal starts. */
  origin: { x: number; y: number };
  /** Href of the current page's item; the dot sits there (null: none). */
  current: string | null;
  onClose: (returnFocus?: boolean) => void;
  /** Scrolls in place or lets the link navigate; closes the menu either way. */
  onItemClick: (e: React.MouseEvent, href: string) => void;
};

/** Each letter rolls up on hover and a copy rolls in from below (CSS, staggered per letter). */
function RollingText({ text }: { text: string }) {
  return (
    <span className={styles.roll} aria-hidden="true">
      {Array.from(text).map((ch, i) => (
        <span key={i} className={styles.char} style={{ "--i": i } as React.CSSProperties}>
          <span className={styles.charInner} data-char={ch}>
            {ch}
          </span>
        </span>
      ))}
    </span>
  );
}

export function MenuOverlay({ open, origin, current, onClose, onItemClick }: Props) {
  const reduce = useReducedMotion();
  const lenis = useLenis();
  const ref = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Lock page scroll while open.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    lenis?.stop();
    root.style.overflow = "hidden";
    return () => {
      lenis?.start();
      root.style.overflow = "";
    };
  }, [open, lenis]);

  // Focus the close button, close on Escape, keep Tab inside the dialog.
  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus({ preventScroll: true });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !ref.current) return;
      const focusables = ref.current.querySelectorAll<HTMLElement>("a[href], button");
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const activeEl = document.activeElement;
      if (!ref.current.contains(activeEl)) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && activeEl === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && activeEl === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const reveal = () => {
    if (reduce) {
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.2 },
      };
    }
    const { x, y } = origin;
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    return {
      initial: { clipPath: `circle(0px at ${x}px ${y}px)` },
      animate: {
        clipPath: `circle(${radius}px at ${x}px ${y}px)`,
        transition: { duration: 0.6, ease: EASE_OUT },
      },
      exit: {
        clipPath: `circle(0px at ${x}px ${y}px)`,
        transition: { duration: 0.45, ease: EASE_OUT },
      },
    };
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="menu"
          ref={ref}
          id="site-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className={styles.overlay}
          {...reveal()}
        >
          <button
            ref={closeRef}
            type="button"
            className={styles.close}
            aria-label="Close menu"
            onClick={() => onClose()}
          >
            {/* The hamburger's two lines rotate into an X. */}
            <span className={styles.lines} aria-hidden="true">
              <motion.span
                initial={reduce ? false : { y: -3.5, rotate: 0 }}
                animate={{ y: 0, rotate: 45 }}
                transition={{ duration: 0.4, ease: EASE_OUT, delay: 0.1 }}
              />
              <motion.span
                initial={reduce ? false : { y: 3.5, rotate: 0 }}
                animate={{ y: 0, rotate: -45 }}
                transition={{ duration: 0.4, ease: EASE_OUT, delay: 0.1 }}
              />
            </span>
          </button>

          <nav aria-labelledby="menu-label" className={styles.nav}>
            <p id="menu-label" className={styles.heading}>
              Navigation
            </p>
            <ul className={styles.list}>
              {navItems.map((item, i) => {
                const content = (
                  <>
                    <motion.span
                      className={styles.dot}
                      aria-hidden="true"
                      initial={false}
                      animate={{ scale: current === item.href ? 1 : 0 }}
                      transition={{ duration: 0.3, ease: EASE_OUT }}
                    />
                    <span className={styles.mask}>
                      <motion.span
                        className={styles.label}
                        initial={reduce ? false : { y: "110%" }}
                        animate={{ y: "0%" }}
                        transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.2 + i * 0.06 }}
                      >
                        <RollingText text={item.label} />
                        <span className="visually-hidden">{item.label}</span>
                      </motion.span>
                    </span>
                  </>
                );
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={styles.link}
                      aria-current={item.href === current ? "page" : undefined}
                      onClick={(e) => onItemClick(e, item.href)}
                    >
                      {content}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

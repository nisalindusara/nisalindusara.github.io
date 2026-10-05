"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { EASE_OUT } from "@/components/ui/motion";
import { Logo } from "@/components/Logo/Logo";
import { BRAND_IN_S, BRAND_OUT_S, BRAND_SWAP_MS } from "./brandConfig";
import styles from "./TopBar.module.css";

/**
 * Top-left brand: the logo, then `text` ("Nisal Indusara"), swapping every BRAND_SWAP_MS.
 * The outgoing one slides up out of a mask. The name slides up into it from below; the logo draws itself
 * in (the N wipes up, the P's bowl draws, the dot springs in), except on page load, where it is just shown.
 * Paused while hovered or focused and while the tab is hidden. Reduced motion: the logo only, no swap.
 * Decorative: the link around it carries the accessible name.
 */
export function BrandSwap({ text }: { text: string }) {
  const reduce = useReducedMotion();
  const [showLogo, setShowLogo] = useState(true);
  // The logo draws itself only when it comes back after the name, not on page load.
  const [swapped, setSwapped] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (reduce) return;
    // Hover and focus land on the link around this span.
    const link = ref.current?.parentElement;
    let paused = false;
    const pause = () => (paused = true);
    const resume = () => (paused = false);
    link?.addEventListener("pointerenter", pause);
    link?.addEventListener("pointerleave", resume);
    link?.addEventListener("focus", pause);
    link?.addEventListener("blur", resume);
    const id = window.setInterval(() => {
      if (paused || document.visibilityState !== "visible") return;
      setSwapped(true);
      setShowLogo((v) => !v);
    }, BRAND_SWAP_MS);
    return () => {
      window.clearInterval(id);
      link?.removeEventListener("pointerenter", pause);
      link?.removeEventListener("pointerleave", resume);
      link?.removeEventListener("focus", pause);
      link?.removeEventListener("blur", resume);
    };
  }, [reduce]);

  // Out through the top for both; in from below for the name (the logo draws itself in instead).
  const exit = { y: "-110%", transition: { duration: BRAND_OUT_S, ease: EASE_OUT } };
  const slideIn = {
    initial: { y: "110%" },
    animate: { y: "0%", transition: { duration: BRAND_IN_S, ease: EASE_OUT } },
    exit,
  };

  return (
    <span ref={ref} className={styles.brand} aria-hidden="true">
      <AnimatePresence mode="wait" initial={false}>
        {showLogo || reduce ? (
          <motion.span key="logo" className={styles.logoSlot} exit={exit}>
            <Logo draw={swapped} />
          </motion.span>
        ) : (
          <motion.span key="name" className={styles.nameSlot} {...slideIn}>
            {text}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

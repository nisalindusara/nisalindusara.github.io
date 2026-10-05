"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import Lenis from "lenis";
import { MotionConfig } from "framer-motion";

const LenisContext = createContext<Lenis | null>(null);

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    let instance: Lenis | null = null;
    let frame = 0;

    const start = () => {
      instance = new Lenis({ duration: 1.1 });
      setLenis(instance);
      const raf = (time: number) => {
        instance?.raf(time);
        frame = requestAnimationFrame(raf);
      };
      frame = requestAnimationFrame(raf);
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      instance?.destroy();
      instance = null;
      setLenis(null);
    };
    const sync = () => {
      stop();
      if (!query.matches) start();
    };

    sync();
    query.addEventListener("change", sync);
    return () => {
      query.removeEventListener("change", sync);
      stop();
    };
  }, []);

  return (
    <LenisContext.Provider value={lenis}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LenisContext.Provider>
  );
}

/** The Lenis instance, or null when smooth scrolling is off (reduced motion). */
export function useLenis() {
  return useContext(LenisContext);
}

/** Scroll to "#id" via Lenis, or natively when Lenis is off (reduced motion). */
export function useScrollTo() {
  const lenis = useContext(LenisContext);

  return useCallback(
    (hash: string) => {
      const el = document.getElementById(hash.slice(1));
      if (!el) return;
      // A fixed element (the reveal footer) lives at the very end of the page.
      const atEnd = getComputedStyle(el).position === "fixed";
      if (lenis) {
        lenis.scrollTo(atEnd ? "bottom" : el);
      } else if (atEnd) {
        window.scrollTo({ top: document.documentElement.scrollHeight });
      } else {
        el.scrollIntoView();
      }
      // "#main" is just "the top": keep the URL clean.
      history.replaceState(null, "", hash === "#main" ? window.location.pathname : hash);
      // Move focus for keyboard and screen reader users without jumping.
      if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
      el.focus({ preventScroll: true });
    },
    [lenis],
  );
}

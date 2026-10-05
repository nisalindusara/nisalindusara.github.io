"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { usePathname, useRouter } from "next/navigation";
import { useLenis } from "@/components/LenisProvider";
import { getTransitionLabel } from "@/content/transitions";
import {
  COVER_MS,
  HOLD_MS,
  INTRO_MAX_MS,
  INTRO_MIN_MS,
  LABEL_HOLD_MIN_MS,
  LABEL_IN_MS,
  PANEL_EASE,
  REVEAL_MS,
  ROUTE_TIMEOUT_MS,
  SETTLE_MS,
} from "./config";
import { Panel } from "./Panel";

export type Phase = "idle" | "introLooping" | "introLeaving" | "covering" | "waiting" | "revealing";

type TransitionContext = {
  /** Runs the panel transition to `href`. Returns false when the link should navigate normally. */
  navigate: (href: string) => boolean;
  /** False while the intro or a transition hides the page; load animations wait for true. */
  pageReady: boolean;
  /** Where the panel is in its state flow (see TransitionProvider). */
  phase: Phase;
  /** Calls `fn` each time the panel has fully covered the page. Returns the unsubscribe function. */
  onCovered: (fn: () => void) => () => void;
};

const Context = createContext<TransitionContext>({
  navigate: () => false,
  pageReady: true,
  phase: "idle",
  onCovered: () => () => {},
});

const EASE = `cubic-bezier(${PANEL_EASE.join(", ")})`;
const INTRO_KEY = "intro-seen";

const sleep = (ms: number) => new Promise<void>((r) => window.setTimeout(r, Math.max(0, ms)));
const nextFrame = () => new Promise<void>((r) => requestAnimationFrame(() => r()));
/** "/work/" and "/work" are the same page. */
const normalize = (path: string) => path.replace(/\/+$/, "") || "/";
const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Did the inline script in layout.tsx ask for the intro? (Only readable in the browser.) */
const introPending = () =>
  typeof document !== "undefined" && document.documentElement.dataset.intro === "pending";

/**
 * Owns the full-screen panel (Panel.tsx): the first-visit intro and the curtain between pages.
 * State flow: introLooping -> introLeaving -> idle (first visit), and
 * idle -> covering -> waiting -> revealing -> idle (each TransitionLink click).
 * Every path ends with Lenis started, the panel hidden and pageReady true.
 */
export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const lenis = useLenis();

  const [phase, setPhase] = useState<Phase>(() => (introPending() ? "introLooping" : "idle"));
  const [pageReady, setPageReady] = useState(() => !introPending());
  // null: the intro name; a string: a transition's destination label.
  const [text, setText] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState("");

  const panelRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const lenisRef = useRef(lenis);
  const locked = useRef(false);
  const busy = useRef(false);
  const introStarted = useRef(false);
  const coverListeners = useRef(new Set<() => void>());
  const routeWaiter = useRef<{ path: string; resolve: () => void } | null>(null);
  const popped = useRef(false);

  // Lenis is created after the first render; stop it as soon as it exists if the page is locked.
  useEffect(() => {
    lenisRef.current = lenis;
    if (lenis && locked.current) lenis.stop();
  }, [lenis]);

  const lock = useCallback(() => {
    locked.current = true;
    lenisRef.current?.stop();
  }, []);
  const unlock = useCallback(() => {
    locked.current = false;
    lenisRef.current?.start();
  }, []);

  /** Jump (no smooth scroll) to "#id", or to the top when there is no such element. */
  const jumpTo = useCallback((hash: string) => {
    const el = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null;
    const l = lenisRef.current;
    if (el) {
      if (l) l.scrollTo(el, { immediate: true, force: true });
      else el.scrollIntoView();
      return;
    }
    l?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);
  }, []);

  // ---- Intro (first visit in this browser session) ----
  useEffect(() => {
    if (!introPending() || introStarted.current) return;
    introStarted.current = true;
    const root = document.documentElement;
    const panel = panelRef.current;

    const run = async () => {
      lock();
      // Ready when the fonts are in and INTRO_MIN_MS has passed; never later than INTRO_MAX_MS.
      // Both are counted from the start of the page load.
      const ready = Promise.all([document.fonts.ready, sleep(INTRO_MIN_MS - performance.now())]);
      await Promise.race([ready, sleep(INTRO_MAX_MS - performance.now())]);

      // Settle: each letter goes from its current wave opacity to 1.
      panel?.querySelectorAll<HTMLElement>("[data-letter]").forEach((letter) => {
        const from = getComputedStyle(letter).opacity;
        letter.style.animation = "none";
        letter.animate([{ opacity: from }, { opacity: 1 }], {
          duration: SETTLE_MS,
          easing: "ease-out",
          fill: "forwards",
        });
      });
      await sleep(SETTLE_MS + HOLD_MS);

      if (window.location.hash) jumpTo(window.location.hash);
      try {
        sessionStorage.setItem(INTRO_KEY, "1");
      } catch {}
      unlock();
      setPageReady(true);
      setPhase("introLeaving");
      await panel?.animate([{ transform: "translateY(0)" }, { transform: "translateY(-100%)" }], {
        duration: REVEAL_MS,
        easing: EASE,
        fill: "forwards",
      }).finished;
    };

    run()
      .catch(() => {})
      .finally(() => {
        // Whatever happened: page unlocked and visible, panel hidden.
        delete root.dataset.intro;
        panel?.getAnimations({ subtree: true }).forEach((a) => a.cancel());
        unlock();
        setPageReady(true);
        setPhase("idle");
      });
  }, [lock, unlock, jumpTo]);

  // ---- Route changes ----
  useEffect(() => {
    const onPop = () => {
      popped.current = true;
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    const waiter = routeWaiter.current;
    if (waiter && normalize(pathname) === waiter.path) {
      waiter.resolve();
      return;
    }
    // Back / forward: no panel, the page switches at once and starts at the top.
    if (popped.current && !busy.current) {
      popped.current = false;
      jumpTo("");
      requestAnimationFrame(() => jumpTo(""));
    }
  }, [pathname, jumpTo]);

  // ---- Page transition (curtain) ----
  const run = useCallback(
    async (href: string, path: string) => {
      const panel = panelRef.current;
      if (!panel) return;
      const label = getTransitionLabel(path);
      try {
        flushSync(() => {
          setText(label);
          setPhase("covering");
          setPageReady(false);
        });
        panel.dataset.active = "";
        lock();

        // (1) Cover, while (3) the route loads underneath.
        const routeDone = new Promise<void>((resolve) => {
          routeWaiter.current = { path, resolve };
        });
        const pushedAt = performance.now();
        router.push(href, { scroll: false });
        await panel.animate([{ transform: "translateY(100%)" }, { transform: "translateY(0)" }], {
          duration: COVER_MS,
          easing: EASE,
          fill: "forwards",
        }).finished;

        // Covered: close the fullscreen menu if open. Its cleanup restarts Lenis, so stop it again.
        coverListeners.current.forEach((fn) => fn());
        await nextFrame();
        await nextFrame();
        if (locked.current) lenisRef.current?.stop();

        // (2) Label slides up from behind its mask.
        await labelRef.current?.animate([{ transform: "translateY(110%)" }, { transform: "translateY(0)" }], {
          duration: LABEL_IN_MS,
          easing: EASE,
          fill: "forwards",
        }).finished;
        setPhase("waiting");

        // (4) New page committed (or timed out) and the label shown long enough.
        await Promise.all([
          Promise.race([routeDone, sleep(ROUTE_TIMEOUT_MS - (performance.now() - pushedAt))]),
          sleep(LABEL_HOLD_MIN_MS),
        ]);
        routeWaiter.current = null;
        jumpTo(new URL(href, window.location.href).hash);
        lenisRef.current?.resize();
        const main = document.getElementById("main") ?? document.querySelector("main");
        if (main) {
          if (!main.hasAttribute("tabindex")) main.setAttribute("tabindex", "-1");
          main.focus({ preventScroll: true });
        }

        // (5) Reveal.
        unlock();
        setPageReady(true);
        setPhase("revealing");
        labelRef.current?.animate([{ opacity: 1 }, { opacity: 0 }], {
          duration: REVEAL_MS,
          easing: "ease-out",
          fill: "forwards",
        });
        await panel.animate([{ transform: "translateY(0)" }, { transform: "translateY(-100%)" }], {
          duration: REVEAL_MS,
          easing: EASE,
          fill: "forwards",
        }).finished;
        setAnnouncement(`Navigated to ${label}`);
      } catch {
        // An interrupted animation lands here; the finally block still cleans up.
      } finally {
        routeWaiter.current = null;
        delete panel.dataset.active;
        panel.getAnimations({ subtree: true }).forEach((a) => a.cancel());
        unlock();
        setPageReady(true);
        setPhase("idle");
        busy.current = false;
      }
    },
    [router, lock, unlock, jumpTo],
  );

  const navigate = useCallback(
    (href: string) => {
      if (reducedMotion()) return false;
      const url = new URL(href, window.location.href);
      if (url.origin !== window.location.origin) return false;
      const path = normalize(url.pathname);
      if (path === normalize(window.location.pathname)) return false;
      if (busy.current) return true; // a transition is running: ignore the click
      busy.current = true;
      setAnnouncement("");
      run(href, path);
      return true;
    },
    [run],
  );

  const onCovered = useCallback((fn: () => void) => {
    coverListeners.current.add(fn);
    return () => {
      coverListeners.current.delete(fn);
    };
  }, []);

  const value = useMemo(
    () => ({ navigate, pageReady, phase, onCovered }),
    [navigate, pageReady, phase, onCovered],
  );

  return (
    <Context.Provider value={value}>
      {children}
      <Panel ref={panelRef} labelRef={labelRef} text={text} />
      <p className="visually-hidden" role="status" aria-live="polite">
        {announcement}
      </p>
    </Context.Provider>
  );
}

/** `navigate(href)` (used by TransitionLink), `pageReady` and `onCovered`. */
export function useTransition() {
  return useContext(Context);
}

/** True when the page is visible: no intro or transition is covering it. */
export function usePageReady() {
  return useContext(Context).pageReady;
}

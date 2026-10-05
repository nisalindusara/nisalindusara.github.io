"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { TransitionLink } from "@/components/transition/TransitionLink";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { navItems } from "@/content/nav";
import { useLenis, useScrollTo } from "@/components/LenisProvider";
import { EASE_OUT } from "@/components/ui/motion";
import { Magnetic } from "@/components/ui/Magnetic";
import { useTransition } from "@/components/transition/TransitionProvider";
import { MenuOverlay } from "./MenuOverlay";
import styles from "./Nav.module.css";

const fade = { duration: 0.35, ease: EASE_OUT };
// The circle grows in from nothing, with a slight overshoot.
const pop = { duration: 0.6, ease: [0.34, 1.4, 0.64, 1] as const };

/** Phones (same breakpoint as the CSS): no top-right links, the menu circle is always shown. */
const MOBILE = "(max-width: 767px)";
const subscribeMobile = (onChange: () => void) => {
  const query = window.matchMedia(MOBILE);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};
const useIsMobile = () =>
  useSyncExternalStore(subscribeMobile, () => window.matchMedia(MOBILE).matches, () => false);

/** "/work/" and "/work" are the same page. */
const normalize = (path: string) => path.replace(/\/+$/, "") || "/";

/** Pages that start with a top row the links sit on (marked with data-nav-sentinel). */
const hasTopRow = (path: string) =>
  path === "/" || path.startsWith("/work") || path === "/about" || path === "/contact";

/** If clicking `href` should stay on this page, return the element hash to scroll to. */
function inPageTarget(href: string, path: string): string | null {
  const [base, hash] = href.split("#");
  if (normalize(base) !== path) return null;
  if (!hash) return "#main";
  return document.getElementById(hash) ? `#${hash}` : null;
}

/**
 * Global nav. While the page's header (home hero, /work header) is under it, small links sit top
 * right; past it they fade out and a menu circle scales in. Pages without one (e.g. 404) show the circle.
 */
export function Nav() {
  const path = normalize(usePathname());
  const isMobile = useIsMobile();
  const lenis = useLenis();
  const scrollTo = useScrollTo();
  const scrollToRef = useRef(scrollTo);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // The page whose header is currently under the nav (null: none).
  const [linksFor, setLinksFor] = useState<string | null>(hasTopRow(path) ? path : null);
  const [open, setOpen] = useState(false);
  const [origin, setOrigin] = useState({ x: 0, y: 0 });

  const { onCovered } = useTransition();

  useEffect(() => {
    scrollToRef.current = scrollTo;
  });

  // A page transition keeps the menu open until the panel covers the page, then closes it underneath.
  useEffect(() => onCovered(() => setOpen(false)), [onCovered]);

  // Is the header under the nav? Watches a strip from 40px down to 10% of the viewport;
  // the 40px skips the sliver of hero left under the About section's rounded corners.
  useEffect(() => {
    const sentinel = document.querySelector("[data-nav-sentinel]");
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => setLinksFor(entry.isIntersecting ? path : null),
      { rootMargin: "-40px 0px -90% 0px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [path]);

  // Arriving with a hash (e.g. "/#about" from another page): scroll there once the page is in.
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;
    const t = window.setTimeout(() => scrollToRef.current(hash), 150);
    return () => window.clearTimeout(t);
  }, [path]);

  const openMenu = () => {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (rect) setOrigin({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
    setOpen(true);
  };

  const closeMenu = useCallback((returnFocus = true) => {
    setOpen(false);
    if (returnFocus) requestAnimationFrame(() => buttonRef.current?.focus());
  }, []);

  /**
   * Shared by the header links and the menu: scroll in place, or let the link navigate.
   * e.defaultPrevented: the page transition took over and closes the menu once the page is covered.
   */
  const onItemClick = (e: React.MouseEvent, href: string) => {
    const target = inPageTarget(href, path);
    if (!target) {
      if (!e.defaultPrevented) setOpen(false);
      return;
    }
    setOpen(false);
    e.preventDefault();
    // Unlock first if the menu had stopped scrolling (Lenis ignores scrollTo while stopped).
    lenis?.start();
    document.documentElement.style.removeProperty("overflow");
    scrollTo(target);
  };

  // Which item the current page belongs to (project pages count as Work).
  const current =
    path === "/"
      ? "/"
      : path.startsWith("/work")
        ? "/work/"
        : path === "/about" || path === "/contact"
          ? `${path}/`
          : null;
  const showLinks = linksFor === path && !isMobile;
  const onLightTop = path === "/" || path === "/work";

  return (
    <>
      {/* Links: plain colours, dark text on the light pages' top (home, /work), light text elsewhere. */}
      <div className={`${styles.bar} ${onLightTop ? styles.onLight : styles.onDark}`}>
        <AnimatePresence initial={false}>
          {showLinks && (
            <motion.nav
              key="links"
              aria-label="Primary"
              className={styles.links}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={fade}
            >
              <ul>
                {navItems
                  .filter((item) => item.href !== "/")
                  .map((item) => (
                    <li key={item.href}>
                      <Magnetic>
                        <TransitionLink
                          href={item.href}
                          className={styles.link}
                          data-cursor-fill
                          aria-current={item.href === current ? "page" : undefined}
                          onClick={(e) => onItemClick(e, item.href)}
                        >
                          {item.label}
                        </TransitionLink>
                      </Magnetic>
                    </li>
                  ))}
              </ul>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>

      {/* Menu circle: floats over any section, so it inverts what is behind it (blend difference). */}
      <div className={styles.circleBar}>
        <AnimatePresence initial={false}>
          {!showLinks && (
            <Magnetic key="menu" className={styles.circleSlot}>
              <motion.button
                ref={buttonRef}
                type="button"
                className={`fill-hover ${styles.circle}`}
                data-fill-leave="instant"
                aria-label="Open menu"
                aria-expanded={open}
                aria-controls="site-menu"
                onClick={openMenu}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1, transition: pop }}
                exit={{ opacity: 0, scale: 0, transition: fade }}
              >
                <span className={styles.lines} aria-hidden="true">
                  <span />
                  <span />
                </span>
              </motion.button>
            </Magnetic>
          )}
        </AnimatePresence>
      </div>

      <MenuOverlay
        open={open}
        origin={origin}
        current={current}
        onClose={closeMenu}
        onItemClick={onItemClick}
      />
    </>
  );
}

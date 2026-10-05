"use client";

import { useRef, useState } from "react";
import { useInView } from "framer-motion";
import { usePageReady } from "@/components/transition/TransitionProvider";

/**
 * The one gate for entrance animations. `play` turns true once (and stays true) when the page is
 * ready (no intro or transition panel over it) and, for trigger "view", the element is in view.
 * So animations on arrival play as the panel lifts, not underneath it.
 * Put `ref` on the watched element and animate to the shown state only while `play` is true.
 */
export function useReveal<T extends Element = HTMLElement>({
  trigger = "view",
  amount,
}: {
  /** "view": once in view (default); "load": as soon as the page is ready. */
  trigger?: "view" | "load";
  /** Share of the element that must be visible, as in Framer Motion's viewport.amount. */
  amount?: "some" | "all" | number;
} = {}) {
  const ref = useRef<T>(null);
  const inView = useInView(ref, { once: true, amount });
  const ready = usePageReady();
  const [play, setPlay] = useState(false);
  // Latched: once played, a later transition (pageReady false again) never hides it.
  if (!play && ready && (trigger === "load" || inView)) setPlay(true);
  return { ref, play };
}

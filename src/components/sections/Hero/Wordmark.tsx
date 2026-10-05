"use client";

import { useEffect, useRef, type RefObject } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { EASE_OUT } from "@/components/ui/motion";
import {
  NAME_LETTER_S,
  NAME_STAGGER_S,
  SLICE_COUNT,
  SLICE_DECAY,
  SLICE_ENABLED,
  SLICE_FOLLOW,
  SLICE_GAIN,
  SLICE_MAX_PX,
  SLICE_SHUFFLE_MS,
  SLICE_SPREAD,
  SLICE_WIDTH_MAX,
  SLICE_WIDTH_MIN,
} from "./heroConfig";
import styles from "./Hero.module.css";

const rand = (a: number, b: number) => a + Math.random() * (b - a);
const clampAbs = (v: number, max: number) => Math.max(-max, Math.min(max, v));

/** The word as one inline-block span per letter, plus the ®. Base and bands share it, so they line up exactly. */
export function Letters({ word, letter }: { word: string; letter?: (i: number) => object }) {
  return (
    <>
      {Array.from(word).map((ch, i) =>
        letter ? (
          <motion.span key={i} data-reveal className={styles.letter} {...letter(i)}>
            {ch}
          </motion.span>
        ) : (
          <span key={i} className={styles.letter}>
            {ch}
          </span>
        ),
      )}
      <span className={styles.reg}>®</span>
    </>
  );
}

/**
 * The full-width wordmark. Entrance: the letters slide up from below, one after another.
 * Hover (mouse only): the slice effect. SLICE_COUNT copies of the word sit over it, one per horizontal
 * band, hidden at rest. Moving the pointer shows the bands near it, clipped to a short window around the
 * pointer and shifted sideways by the pointer's speed; each copy has the hero background, so it covers
 * the letters under it. The bands settle back when the pointer stops. Settings: heroConfig.ts.
 * `hostRef`: the element that receives the pointer (the stage, whose click button covers the word).
 * `interactive`: false while the photo shows or a reveal runs (no hover effect). `hidden`: the photo covers it.
 */
export function Wordmark({
  word,
  play,
  hostRef,
  interactive,
  hidden,
}: {
  word: string;
  play: boolean;
  hostRef: RefObject<HTMLElement | null>;
  interactive: boolean;
  hidden: boolean;
}) {
  const reduce = useReducedMotion();
  const wrapRef = useRef<HTMLSpanElement>(null);
  // Read inside the pointer handlers without re-binding them.
  const interactiveRef = useRef(interactive);
  useEffect(() => {
    interactiveRef.current = interactive;
  }, [interactive]);
  const bandRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const innerRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    if (!SLICE_ENABLED || reduce) return;
    const wrap = wrapRef.current;
    const host = hostRef.current;
    if (!wrap || !host) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const n = SLICE_COUNT;
    const bands = bandRefs.current;
    const inners = innerRefs.current;
    const offset = new Float32Array(n);
    const width = new Float32Array(n);
    const dir = new Float32Array(n);

    // Each band: a window width and a direction. Most go with the pointer, some against it.
    const shuffle = () => {
      for (let i = 0; i < n; i++) {
        width[i] = rand(SLICE_WIDTH_MIN, SLICE_WIDTH_MAX);
        dir[i] = Math.random() < 0.75 ? rand(0.5, 1.2) : -rand(0.2, 0.7);
      }
    };
    shuffle();

    let w = 0;
    let h = 0;
    let px = 0;
    let py = 0;
    let last: { x: number; y: number } | null = null;
    let speed = 0;
    let inside = false;
    let frame = 0;
    let lastShuffle = 0;

    const tick = (now: number) => {
      if (Math.abs(speed) > 0.5 && now - lastShuffle > SLICE_SHUFFLE_MS) {
        shuffle();
        lastShuffle = now;
      }
      let active = Math.abs(speed) > 0.05;
      for (let i = 0; i < n; i++) {
        const band = bands[i];
        const inner = inners[i];
        if (!band || !inner) continue;
        // Bands near the pointer's height react most.
        const d = (((i + 0.5) / n) * h - py) / (h * SLICE_SPREAD);
        const weight = inside ? Math.exp(-d * d) : 0;
        const target = clampAbs(speed * SLICE_GAIN * weight * dir[i], SLICE_MAX_PX);
        offset[i] += (target - offset[i]) * SLICE_FOLLOW;
        if (Math.abs(offset[i]) < 0.4) {
          offset[i] = 0;
          band.style.visibility = "hidden";
          continue;
        }
        active = true;
        const half = (width[i] * w) / 2;
        // The first and last bands reach past the box, so glyph tops and bottoms are covered too.
        const top = i === 0 ? "-50%" : `${(i / n) * 100}%`;
        const bottom = i === n - 1 ? "-50%" : `${((n - i - 1) / n) * 100}%`;
        band.style.visibility = "visible";
        band.style.clipPath = `inset(${top} ${Math.max(0, w - px - half)}px ${bottom} ${Math.max(0, px - half)}px)`;
        inner.style.transform = `translate3d(${offset[i]}px, 0, 0)`;
      }
      speed *= SLICE_DECAY;
      frame = active ? requestAnimationFrame(tick) : 0;
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || !fine.matches) return;
      if (!interactiveRef.current) {
        inside = false;
        return;
      }
      const rect = wrap.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      px = e.clientX - rect.left;
      py = e.clientY - rect.top;
      // Speed: mostly horizontal movement, some vertical, smoothed.
      if (last) speed = speed * 0.5 + (px - last.x + (py - last.y) * 0.5) * 0.5;
      last = { x: px, y: py };
      inside = true;
      if (!frame) frame = requestAnimationFrame(tick);
    };
    const onLeave = () => {
      inside = false;
      last = null;
    };

    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    return () => {
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(frame);
    };
  }, [reduce, hostRef]);

  /** Entrance of one letter: slides up from below. Reduced motion: a fade. */
  const letter = (i: number) => {
    const from = reduce ? { opacity: 0 } : { y: "110%" };
    const to = reduce ? { opacity: 1 } : { y: "0%" };
    return {
      initial: from,
      animate: play ? to : from,
      transition: { duration: NAME_LETTER_S, ease: EASE_OUT, delay: i * NAME_STAGGER_S },
    };
  };

  return (
    // A span (display: block in CSS): it sits inside the <h1>.
    <span
      ref={wrapRef}
      className={styles.wordmark}
      aria-hidden="true"
      // Opacity, not visibility: hover bands set their own visibility and would show through.
      style={hidden ? { opacity: 0 } : undefined}
    >
      <span className={styles.mask}>
        <Letters word={word} letter={letter} />
      </span>
      {/* Always rendered (hidden until the effect shows them), so server and client markup match. */}
      {SLICE_ENABLED &&
        Array.from({ length: SLICE_COUNT }, (_, i) => (
          <span
            key={i}
            ref={(el) => {
              bandRefs.current[i] = el;
            }}
            className={styles.band}
          >
            <span
              ref={(el) => {
                innerRefs.current[i] = el;
              }}
              className={styles.bandInner}
            >
              <Letters word={word} />
            </span>
          </span>
        ))}
    </span>
  );
}

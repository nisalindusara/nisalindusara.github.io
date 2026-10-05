"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { profile } from "@/content/profile";
import { Letters, Wordmark } from "./Wordmark";
import { REVEAL_BANDS, REVEAL_JITTER_PX, REVEAL_MS, REVEAL_SHIFT_PX, REVEAL_SHUFFLE_MS } from "./heroConfig";
import styles from "./Hero.module.css";

type Side = "word" | "photo";

const rand = (a: number, b: number) => a + Math.random() * (b - a);
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

/** The photo, filling the wordmark's box. `decorative`: the copies inside the reveal bands. */
function Photo({ decorative = false }: { decorative?: boolean }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- static export with unoptimized images; the copies must match exactly
    <img
      src={profile.heroImage.src}
      alt={decorative ? "" : profile.heroImage.alt}
      className={styles.photoImg}
      decoding="async"
      draggable={false}
    />
  );
}

/**
 * The hero's wordmark and photo, which take turns in the same box.
 * Click or tap (or Enter on the button): a circle grows from the click point (from the centre with the
 * keyboard) over REVEAL_MS. Inside it, REVEAL_BANDS horizontal bands show the other side; each band's
 * edge is ragged by up to REVEAL_JITTER_PX and its content shifted sideways by up to REVEAL_SHIFT_PX,
 * both shrinking to 0 as the circle covers the box. Then the other side is shown plainly and the bands hide.
 * The hover slice effect (Wordmark.tsx) runs only while the wordmark shows. Reduced motion: an instant swap.
 */
export function HeroStage({ play }: { play: boolean }) {
  const reduce = useReducedMotion();
  const [side, setSide] = useState<Side>("word");
  const [busy, setBusy] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const bandRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const innerRefs = useRef<(HTMLSpanElement | null)[]>([]);

  // After the swap is on screen, the bands (which showed the same picture) disappear in the same frame.
  useLayoutEffect(() => {
    for (const band of bandRefs.current) if (band) band.style.visibility = "hidden";
  }, [side]);

  const reveal = (cx: number, cy: number) => {
    const stage = stageRef.current;
    if (!stage || busy) return;
    const target: Side = side === "word" ? "photo" : "word";
    if (reduce) {
      setSide(target);
      return;
    }
    setBusy(true);
    // The bands show the side being revealed.
    stage.dataset.target = target;

    const w = stage.clientWidth;
    const h = stage.clientHeight;
    const n = REVEAL_BANDS;
    // Far enough to cover the farthest corner, ragged edge included.
    const maxR = Math.hypot(Math.max(cx, w - cx), Math.max(cy, h - cy)) + REVEAL_JITTER_PX;
    const shift = new Float32Array(n);
    const jitter = new Float32Array(n);
    const shuffle = () => {
      for (let i = 0; i < n; i++) {
        shift[i] = Math.random() < 0.7 ? rand(-1, 1) * REVEAL_SHIFT_PX : 0;
        jitter[i] = rand(-1, 1) * REVEAL_JITTER_PX;
      }
    };
    shuffle();
    const start = performance.now();
    let lastShuffle = start;

    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / REVEAL_MS);
      const e = easeInOut(p);
      const r = e * maxR;
      const calm = 1 - e; // shifts and ragged edges fade out as the circle grows
      if (now - lastShuffle > REVEAL_SHUFFLE_MS) {
        shuffle();
        lastShuffle = now;
      }
      for (let i = 0; i < n; i++) {
        const band = bandRefs.current[i];
        const inner = innerRefs.current[i];
        if (!band || !inner) continue;
        const dy = Math.abs(((i + 0.5) / n) * h - cy);
        const chord = r > dy ? Math.sqrt(r * r - dy * dy) : 0;
        const half = p >= 1 ? w * 2 : chord + jitter[i] * calm;
        if (half <= 0) {
          band.style.visibility = "hidden";
          continue;
        }
        // The first and last bands reach past the box, so glyph tops and bottoms are covered too.
        // Neighbours overlap by 1px, so no hairline seam shows between them.
        const top = i === 0 ? "-50%" : `calc(${(i / n) * 100}% - 1px)`;
        const bottom = i === n - 1 ? "-50%" : `calc(${((n - i - 1) / n) * 100}% - 1px)`;
        band.style.visibility = "visible";
        band.style.clipPath = `inset(${top} ${Math.max(0, w - cx - half)}px ${bottom} ${Math.max(0, cx - half)}px)`;
        inner.style.transform = `translate3d(${p >= 1 ? 0 : shift[i] * calm}px, 0, 0)`;
      }
      if (p < 1) {
        requestAnimationFrame(tick);
      } else {
        setSide(target);
        setBusy(false);
      }
    };
    requestAnimationFrame(tick);
  };

  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    // Keyboard (detail 0): from the centre.
    const fromPointer = e.detail > 0;
    reveal(fromPointer ? e.clientX - rect.left : rect.width / 2, fromPointer ? e.clientY - rect.top : rect.height / 2);
  };

  return (
    <div ref={stageRef} className={styles.stage} data-side={side}>
      {/* The page's only <h1>. Screen readers get the full name; the wordmark is decoration. */}
      <h1 className={styles.title}>
        <span className="visually-hidden">{profile.fullName}</span>
        <Wordmark
          word={profile.heroWord}
          play={play}
          hostRef={stageRef}
          interactive={side === "word" && !busy}
          hidden={side === "photo"}
        />
      </h1>

      {/* The photo, in the wordmark's box. Hidden (but loaded) while the wordmark shows. */}
      <span className={styles.photo} aria-hidden={side !== "photo"}>
        <Photo />
      </span>

      {/* Reveal bands: each holds both sides; data-target on the stage picks the one shown. */}
      {Array.from({ length: REVEAL_BANDS }, (_, i) => (
        <span
          key={i}
          ref={(el) => {
            bandRefs.current[i] = el;
          }}
          className={styles.revealBand}
          aria-hidden="true"
        >
          <span
            ref={(el) => {
              innerRefs.current[i] = el;
            }}
            className={styles.revealInner}
          >
            <span className={styles.revealPhoto}>
              <Photo decorative />
            </span>
            <span className={`${styles.wordmark} ${styles.revealWord}`}>
              <span className={styles.bandInner}>
                <Letters word={profile.heroWord} />
              </span>
            </span>
          </span>
        </span>
      ))}

      {/* The click target over the whole box. */}
      <button
        type="button"
        className={styles.stageButton}
        aria-label={side === "word" ? "Show photo" : "Show name"}
        aria-pressed={side === "photo"}
        onClick={onClick}
      />
    </div>
  );
}

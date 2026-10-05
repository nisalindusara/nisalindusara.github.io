"use client";

import { useEffect, useId, useRef } from "react";
import {
  BALL_RADIUS,
  BEAD_MS,
  BLOB_BEAD_R,
  BLOB_COUNT,
  BLOB_START_R,
  FILM_HEIGHT,
  FILM_MS,
  FOLLOW_DAMPING,
  FOLLOW_STIFFNESS,
  GATHER_MS,
  GATHER_STAGGER_MS,
  GOO_ALPHA_MULT,
  GOO_ALPHA_OFFSET,
  GOO_BLUR,
  RELEASE_MS,
  SETTLE_MS,
  TIME_SCALE,
  WATER_ENABLED,
} from "./waterConfig";
import styles from "./WaterBall.module.css";

/*
 * Water gathering into a ball, for project rows without a preview image.
 * On pointer enter: FILM (a thin film fades in on the row's bottom line) -> BEAD (it draws into droplets)
 * -> GATHER (droplets flow to the ball position B, the live pointer smoothed by a spring, and merge into a
 * core that overshoots slightly) -> SETTLE (the goo filter is removed, one plain circle stays, the label
 * fades in; the ball follows the pointer). On leave: before SETTLE the formation plays backwards; after it,
 * RELEASE drops the ball to the bottom line, flattens it into the film and fades it out. Re-entering
 * continues from the current state. All numbers: waterConfig.ts.
 */

// ---- One shared animation loop, running only while at least one row is active ----

type Tick = (dt: number) => void;
const ticks = new Set<Tick>();
let frame = 0;
let last = 0;

function loop(now: number) {
  const dt = Math.min(0.05, (now - last) / 1000); // seconds, capped after a stall
  last = now;
  for (const tick of [...ticks]) tick(dt);
  frame = ticks.size ? requestAnimationFrame(loop) : 0;
}

function startTick(tick: Tick) {
  ticks.add(tick);
  if (!frame) {
    last = performance.now();
    frame = requestAnimationFrame(loop);
  }
}

function stopTick(tick: Tick) {
  ticks.delete(tick); // the loop ends itself when the set is empty
}

// ---- Easing ----

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);
const easeOut = (t: number) => 1 - (1 - t) ** 3;
const smoothstep = (a: number, b: number, t: number) => {
  const x = clamp01((t - a) / (b - a));
  return x * x * (3 - 2 * x);
};

/** CSS cubic-bezier(x1, y1, x2, y2) as a function of time 0..1. */
function cubicBezier(x1: number, y1: number, x2: number, y2: number) {
  const coord = (t: number, a: number, b: number) => 3 * a * t * (1 - t) ** 2 + 3 * b * t * t * (1 - t) + t ** 3;
  return (x: number) => {
    let lo = 0;
    let hi = 1;
    for (let i = 0; i < 24; i++) {
      const mid = (lo + hi) / 2;
      if (coord(mid, x1, x2) < x) lo = mid;
      else hi = mid;
    }
    return coord((lo + hi) / 2, y1, y2);
  };
}
const gatherEase = cubicBezier(0.65, 0, 0.35, 1);

// ---- Timeline (ms, scaled) ----

const T = {
  film: FILM_MS * TIME_SCALE,
  bead: BEAD_MS * TIME_SCALE,
  gather: GATHER_MS * TIME_SCALE,
  stagger: GATHER_STAGGER_MS * TIME_SCALE,
  settle: SETTLE_MS * TIME_SCALE,
  release: RELEASE_MS * TIME_SCALE,
  fade: 150 * TIME_SCALE,
};
const GATHER_START = T.film + T.bead;
const SETTLE_START = GATHER_START + T.stagger + T.gather;
const TOTAL = SETTLE_START + T.settle;
const OVERSHOOT = 1.1;

export function WaterBall({ label }: { label: string }) {
  const gooId = `goo${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const filterRef = useRef<SVGFilterElement>(null);
  const gooRef = useRef<SVGGElement>(null);
  const filmRef = useRef<SVGRectElement>(null);
  const blobRefs = useRef<(SVGCircleElement | null)[]>([]);
  const coreRef = useRef<SVGCircleElement>(null);
  const ballRef = useRef<SVGEllipseElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const host = wrap?.parentElement;
    const svg = svgRef.current;
    const filter = filterRef.current;
    const goo = gooRef.current;
    const film = filmRef.current;
    const core = coreRef.current;
    const ball = ballRef.current;
    const text = labelRef.current;
    if (!wrap || !host || !svg || !filter || !goo || !film || !core || !ball || !text) return;
    const blobs = blobRefs.current.filter((b): b is SVGCircleElement => !!b);

    // The whole row (its <li> when there is one) is lifted while active, so the ball overlaps neighbours.
    const lift = (host.closest("li") as HTMLElement | null) ?? host;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    let w = 0;
    let h = 0;
    const resize = () => {
      w = wrap.clientWidth;
      h = wrap.clientHeight;
      svg.setAttribute("width", String(w));
      svg.setAttribute("height", String(h));
      svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
      // Filter region 100px larger than the row on every side, so nothing is clipped.
      filter.setAttribute("x", "-100");
      filter.setAttribute("y", "-100");
      filter.setAttribute("width", String(w + 200));
      filter.setAttribute("height", String(h + 200));
    };
    const observer = new ResizeObserver(resize);
    observer.observe(wrap);
    resize();

    // State. Positions are in row pixels.
    let inside = false;
    let simple = false; // reduced motion or WATER_ENABLED = false: a plain circle that fades
    let mode: "idle" | "form" | "release" = "idle";
    let f = 0; // formation time, ms (0..TOTAL)
    let r = 0; // release progress 0..1
    let fade = 0; // simple mode presence 0..1
    let releaseRadius = BALL_RADIUS;
    let delays: number[] | null = null;
    const pointer = { x: 0, y: 0 };
    const B = { x: 0, y: 0, vx: 0, vy: 0 };

    const blobBase = (i: number, bead: number) => ({
      x: (w * (i + 0.5)) / BLOB_COUNT,
      y: h - BLOB_BEAD_R * 0.6 * bead,
    });

    const hideAll = () => {
      film.setAttribute("opacity", "0");
      goo.setAttribute("opacity", "0");
      goo.removeAttribute("filter");
      ball.setAttribute("opacity", "0");
      text.style.opacity = "0";
    };

    const placeLabel = (opacity: number, scale: number) => {
      text.style.opacity = String(opacity);
      text.style.transform = `translate(${B.x}px, ${B.y}px) translate(-50%, -50%) scale(${scale})`;
    };

    const drawBall = (cx: number, cy: number, rx: number, ry: number, opacity: number) => {
      ball.setAttribute("cx", String(cx));
      ball.setAttribute("cy", String(cy));
      ball.setAttribute("rx", String(rx));
      ball.setAttribute("ry", String(ry));
      ball.setAttribute("opacity", String(opacity));
    };

    const render = () => {
      if (simple) {
        film.setAttribute("opacity", "0");
        goo.setAttribute("opacity", "0");
        drawBall(B.x, B.y, BALL_RADIUS, BALL_RADIUS, fade);
        placeLabel(fade, 1);
        return;
      }

      if (mode === "release") {
        // Drops to the bottom line and flattens first, then spreads along it while fading out.
        const drop = easeOut(clamp01(r / 0.6));
        const spread = easeInOut(r);
        film.setAttribute("opacity", "0");
        drawBall(
          lerp(B.x, w / 2, spread),
          lerp(B.y, h - FILM_HEIGHT / 2, drop),
          lerp(releaseRadius, w / 2, spread),
          lerp(releaseRadius, FILM_HEIGHT / 2, drop),
          1 - smoothstep(0.25, 1, r),
        );
        placeLabel(clamp01(1 - r * 3), 1);
        return;
      }

      if (f >= SETTLE_START) {
        // SETTLE: one plain circle; the goo layer is gone.
        film.setAttribute("opacity", "0");
        goo.setAttribute("opacity", "0");
        goo.removeAttribute("filter");
        const s = clamp01((f - SETTLE_START) / T.settle);
        const radius = BALL_RADIUS * lerp(OVERSHOOT, 1, easeOut(s));
        drawBall(B.x, B.y, radius, radius, 1);
        placeLabel(easeOut(s), lerp(0.6, 1, easeOut(s)));
        return;
      }

      // FILM, BEAD, GATHER: film and droplets under the goo filter.
      ball.setAttribute("opacity", "0");
      text.style.opacity = "0";
      goo.setAttribute("filter", `url(#${gooId})`);
      const filmIn = clamp01(f / T.film);
      goo.setAttribute("opacity", String(filmIn));
      film.setAttribute("opacity", String(filmIn));

      const bead = easeInOut(clamp01((f - T.film) / T.bead));
      const filmH = FILM_HEIGHT * (1 - bead);
      film.setAttribute("x", "0");
      film.setAttribute("width", String(w));
      film.setAttribute("y", String(h - filmH / 2));
      film.setAttribute("height", String(filmH));
      film.setAttribute("rx", String(filmH / 2));

      let arrived = 0;
      blobs.forEach((blob, i) => {
        const base = blobBase(i, bead);
        let x = base.x;
        let y = base.y;
        let radius = lerp(BLOB_START_R, BLOB_BEAD_R, bead);
        if (delays && f >= GATHER_START) {
          const e = gatherEase(clamp01((f - GATHER_START - delays[i]) / T.gather));
          x = lerp(base.x, B.x, e);
          y = lerp(base.y, B.y, e);
          radius *= 1 - smoothstep(0.75, 1, e); // absorbed into the core on arrival
          arrived += e;
        }
        blob.setAttribute("cx", String(x));
        blob.setAttribute("cy", String(y));
        blob.setAttribute("r", String(radius));
      });

      // Core grows with the droplets that have arrived, up to a slight overshoot.
      const coreR = BALL_RADIUS * OVERSHOOT * Math.sqrt(arrived / BLOB_COUNT);
      core.setAttribute("cx", String(B.x));
      core.setAttribute("cy", String(B.y));
      core.setAttribute("r", String(coreR));
    };

    const finish = () => {
      mode = "idle";
      f = 0;
      r = 0;
      fade = 0;
      delays = null;
      hideAll();
      stopTick(tick);
      lift.style.zIndex = "";
      lift.style.position = "";
    };

    function tick(dt: number) {
      const ms = dt * 1000;

      // Ball position: the pointer, smoothed by a spring (direct with reduced motion).
      const sdt = dt / TIME_SCALE;
      if (reducedQuery.matches) {
        B.x = pointer.x;
        B.y = pointer.y;
      } else {
        B.vx += (FOLLOW_STIFFNESS * (pointer.x - B.x) - FOLLOW_DAMPING * B.vx) * sdt;
        B.vy += (FOLLOW_STIFFNESS * (pointer.y - B.y) - FOLLOW_DAMPING * B.vy) * sdt;
        B.x += B.vx * sdt;
        B.y += B.vy * sdt;
      }

      if (simple) {
        fade = clamp01(fade + (inside ? ms : -ms) / T.fade);
        render();
        if (!inside && fade <= 0) finish();
        return;
      }

      if (mode === "form") {
        if (inside) {
          f = Math.min(TOTAL, f + ms);
        } else if (f >= SETTLE_START) {
          // Left after the ball formed: drop it back into the film.
          const s = clamp01((f - SETTLE_START) / T.settle);
          releaseRadius = BALL_RADIUS * lerp(OVERSHOOT, 1, easeOut(s));
          mode = "release";
          r = 0;
        } else {
          // Left during the formation: play it backwards (at most RELEASE_MS for the whole way).
          f -= ms * Math.max(1, SETTLE_START / T.release);
          if (f <= 0) {
            finish();
            return;
          }
        }
        // Gather order is fixed when gathering starts: droplets nearest to B leave first.
        if (f < GATHER_START) delays = null;
        else if (!delays) {
          const dist = Array.from({ length: BLOB_COUNT }, (_, i) => {
            const base = blobBase(i, 1);
            return Math.hypot(base.x - B.x, base.y - B.y);
          });
          const max = Math.max(...dist) || 1;
          delays = dist.map((d) => (d / max) * T.stagger);
        }
      } else if (mode === "release") {
        r += (inside ? -ms : ms) / T.release;
        if (r <= 0) {
          r = 0;
          mode = "form"; // back to the settled ball
        } else if (r >= 1) {
          finish();
          return;
        }
      }
      render();
    }

    const toRow = (e: PointerEvent) => {
      const rect = wrap.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
    };

    const onEnter = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || !fine.matches) return;
      toRow(e);
      inside = true;
      if (mode === "idle" && fade <= 0) {
        // Start: the ball only ever forms at the pointer.
        simple = reducedQuery.matches || !WATER_ENABLED;
        B.x = pointer.x;
        B.y = pointer.y;
        B.vx = 0;
        B.vy = 0;
        mode = simple ? "idle" : "form";
        f = 0;
        r = 0;
        delays = null;
        lift.style.position = "relative";
        lift.style.zIndex = "2";
      }
      startTick(tick);
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "mouse") toRow(e);
    };
    const onLeave = () => {
      inside = false;
    };

    hideAll();
    host.addEventListener("pointerenter", onEnter);
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    return () => {
      host.removeEventListener("pointerenter", onEnter);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      observer.disconnect();
      stopTick(tick);
      lift.style.zIndex = "";
      lift.style.position = "";
    };
  }, [gooId]);

  return (
    <div ref={wrapRef} className={styles.water} aria-hidden="true">
      <svg ref={svgRef} className={styles.svg}>
        <defs>
          <filter ref={filterRef} id={gooId} filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feGaussianBlur in="SourceGraphic" stdDeviation={GOO_BLUR} />
            <feColorMatrix values={`1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${GOO_ALPHA_MULT} ${GOO_ALPHA_OFFSET}`} />
          </filter>
        </defs>
        {/* The film is drawn plain: at FILM_HEIGHT it is too thin to survive the goo filter's threshold. */}
        <rect ref={filmRef} className={styles.fill} />
        <g ref={gooRef} className={styles.fill}>
          {Array.from({ length: BLOB_COUNT }, (_, i) => (
            <circle
              key={i}
              ref={(el) => {
                blobRefs.current[i] = el;
              }}
            />
          ))}
          <circle ref={coreRef} />
        </g>
        <ellipse ref={ballRef} className={styles.fill} />
      </svg>
      <span ref={labelRef} className={styles.label}>
        {label}
      </span>
    </div>
  );
}

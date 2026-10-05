"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { EASE_OUT } from "@/components/ui/motion";
import styles from "./BlueBall.module.css";

/**
 * Blue circle with a label ("View" / "Next project") for project rows without a preview image.
 * It scales in at the pointer on enter, follows the pointer with a spring, and scales out on leave.
 * Mouse only (see CSS).
 */
export function BlueBall({ label }: { label: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [active, setActive] = useState(false);
  const unliftRef = useRef(() => {});

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const spring = { stiffness: 300, damping: 30, mass: 0.6 };
  const sx = useSpring(x, spring);
  const sy = useSpring(y, spring);

  useEffect(() => {
    const wrap = wrapRef.current;
    const host = wrap?.parentElement;
    if (!wrap || !host) return;

    // The whole row (its <li> when there is one) is lifted while active, so the ball overlaps neighbours.
    const lift = (host.closest("li") as HTMLElement | null) ?? host;
    const unlift = () => {
      lift.style.zIndex = "";
      lift.style.position = "";
    };
    unliftRef.current = unlift;

    const toRow = (e: PointerEvent) => {
      const rect = wrap.getBoundingClientRect();
      x.set(e.clientX - rect.left);
      y.set(e.clientY - rect.top);
    };

    const onEnter = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      toRow(e);
      // Start at the pointer instead of flying in from the last position.
      sx.jump(x.get());
      sy.jump(y.get());
      lift.style.position = "relative";
      lift.style.zIndex = "2";
      setActive(true);
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "mouse") toRow(e);
    };
    const onLeave = () => setActive(false);

    host.addEventListener("pointerenter", onEnter);
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    return () => {
      host.removeEventListener("pointerenter", onEnter);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      unlift();
    };
  }, [x, y, sx, sy]);

  return (
    <div ref={wrapRef} className={styles.layer} aria-hidden="true">
      <motion.div
        className={styles.ball}
        // Reduced motion: follow the pointer directly, no spring lag.
        style={{ x: reduce ? x : sx, y: reduce ? y : sy }}
        initial={false}
        animate={{ scale: active ? 1 : 0, opacity: active ? 1 : 0 }}
        transition={{ duration: 0.35, ease: EASE_OUT }}
        // Drop the row back once the ball has fully scaled out.
        onAnimationComplete={() => !active && unliftRef.current()}
      >
        <span className={styles.label}>{label}</span>
      </motion.div>
    </div>
  );
}

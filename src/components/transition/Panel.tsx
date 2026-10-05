import { introName } from "@/content/transitions";
import { FAILSAFE_MS, LOOP_MIN_OPACITY, LOOP_PERIOD_MS, LOOP_STAGGER_MS } from "./config";
import styles from "./Panel.module.css";

// The CSS reads its timings from config.ts through these variables (set inline, so they are in the static HTML).
const vars = {
  "--loop-period": `${LOOP_PERIOD_MS}ms`,
  "--loop-stagger": `${LOOP_STAGGER_MS}ms`,
  "--loop-min": LOOP_MIN_OPACITY,
  "--failsafe": `${FAILSAFE_MS}ms`,
} as React.CSSProperties;

/**
 * The full-screen panel shared by the first-visit intro and every page transition.
 * Hidden by default (CSS). Shown by html[data-intro="pending"] (intro, set by the inline script in
 * layout.tsx before first paint) or by data-active (a transition). TransitionProvider moves it.
 * `text`: null shows the intro name letter by letter; a string is a transition's destination label.
 */
export function Panel({
  ref,
  labelRef,
  text,
}: {
  ref: React.Ref<HTMLDivElement>;
  labelRef: React.Ref<HTMLSpanElement>;
  text: string | null;
}) {
  let i = 0;
  return (
    <div ref={ref} className={styles.panel} aria-hidden="true" style={vars}>
      {text === null ? (
        <div className={styles.label} role="img" aria-label={introName}>
          {introName.split(" ").map((word, w) => (
            <span key={w} className={styles.word}>
              {Array.from(word).map((ch) => (
                <span
                  key={i}
                  data-letter
                  aria-hidden="true"
                  className={styles.letter}
                  style={{ "--i": i++ } as React.CSSProperties}
                >
                  {ch}
                </span>
              ))}
            </span>
          ))}
        </div>
      ) : (
        <div className={styles.label}>
          <span className={styles.mask}>
            <span ref={labelRef} className={styles.text}>
              {text}
            </span>
          </span>
        </div>
      )}
    </div>
  );
}

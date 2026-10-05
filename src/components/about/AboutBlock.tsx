import { Hairline } from "@/components/ui/Hairline";
import { MaskText } from "@/components/ui/MaskText";
import styles from "./about.module.css";

/** A section with a drawn hairline, a (desktop: sticky) label on the left and content on the right. */
export function AboutBlock({ label, id, children }: { label: string; id: string; children: React.ReactNode }) {
  return (
    <section className={styles.block} aria-labelledby={id}>
      <Hairline />
      <div className={styles.blockGrid}>
        <div className={styles.side}>
          <MaskText as="h2" id={id} className={styles.label}>
            {label}
          </MaskText>
        </div>
        <div className={styles.main}>{children}</div>
      </div>
    </section>
  );
}

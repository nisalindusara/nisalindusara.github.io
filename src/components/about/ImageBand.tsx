import { about } from "@/content/about";
import { RevealImage } from "./RevealImage";
import styles from "./about.module.css";

/** Wide image, then a staggered pair of smaller ones. */
export function ImageBand() {
  const { wide, detailOne, detailTwo } = about.images;
  if (!wide && !detailOne && !detailTwo) return null;

  return (
    <section className={styles.band} aria-label="Images">
      {wide && <RevealImage image={wide} parallax />}
      {(detailOne || detailTwo) && (
        <div className={styles.pair}>
          {detailOne && <RevealImage image={detailOne} />}
          {detailTwo && <RevealImage image={detailTwo} className={styles.offset} />}
        </div>
      )}
    </section>
  );
}

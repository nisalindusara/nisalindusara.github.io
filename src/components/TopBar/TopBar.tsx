import Link from "next/link";
import styles from "./TopBar.module.css";

/**
 * Top row of a page: a name linking home on the left; the global nav's links sit on the right.
 * By default it is the nav's sentinel: the links show while this row is under them, then the menu
 * circle takes over. `sentinel={false}` where something else plays that role (the home hero) or
 * where the nav shows only the circle (404). Place it inside a padded container.
 * `theme` sets the name's colour (default: inherit the page's).
 */
export function TopBar({
  name,
  theme,
  sentinel = true,
}: {
  name: string;
  theme?: "light" | "dark";
  sentinel?: boolean;
}) {
  return (
    <div
      className={`${styles.top} ${theme ? styles[theme] : ""}`}
      {...(sentinel ? { "data-nav-sentinel": true } : {})}
    >
      <Link href="/" className={styles.name}>
        {name}
      </Link>
    </div>
  );
}

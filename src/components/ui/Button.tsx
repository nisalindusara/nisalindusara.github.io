"use client";

import { TransitionLink } from "@/components/transition/TransitionLink";
import { useScrollTo } from "@/components/LenisProvider";
import styles from "./Button.module.css";

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: "solid" | "outline";
  className?: string;
};

/**
 * One link-styled-as-button for the whole site.
 * "#id" scrolls in-page via Lenis, "/path" is a client-side route, anything else opens externally.
 */
export function Button({ href, children, variant = "outline", className }: Props) {
  const scrollTo = useScrollTo();
  const cls = [styles.button, styles[variant], className].filter(Boolean).join(" ");

  if (href.startsWith("#")) {
    return (
      <a
        href={href}
        className={cls}
        onClick={(e) => {
          e.preventDefault();
          scrollTo(href);
        }}
      >
        {children}
      </a>
    );
  }

  if (href.startsWith("/") && !/\.\w+$/.test(href)) {
    return (
      <TransitionLink href={href} className={cls}>
        {children}
      </TransitionLink>
    );
  }

  // Files (e.g. /cv.pdf) and mailto: stay in the same tab; other links open a new one.
  const newTab = !href.startsWith("/") && !href.startsWith("mailto:");
  return (
    <a
      href={href}
      className={cls}
      {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
      {newTab && (
        <>
          <span aria-hidden="true" className={styles.arrow}>
            ↗
          </span>
          <span className="visually-hidden"> (opens in a new tab)</span>
        </>
      )}
    </a>
  );
}

/** Plain text link that scrolls in-page via Lenis. */
export function ScrollLink({
  href,
  children,
  className,
}: {
  href: `#${string}`;
  children: React.ReactNode;
  className?: string;
}) {
  const scrollTo = useScrollTo();
  return (
    <a
      href={href}
      className={className}
      onClick={(e) => {
        e.preventDefault();
        scrollTo(href);
      }}
    >
      {children}
    </a>
  );
}

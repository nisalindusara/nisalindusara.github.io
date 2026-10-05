"use client";

import Link from "next/link";
import { useTransition } from "./TransitionProvider";

type Props = Omit<React.ComponentProps<typeof Link>, "href"> & { href: string };

/**
 * next/link with the page transition. Use it for EVERY internal link.
 * A plain left-click to another page runs the panel (TransitionProvider). Modifier-key clicks,
 * target="_blank", other mouse buttons, links to the current page and reduced motion behave like a normal link.
 * The transition decides first; the link's own onClick runs after (e.defaultPrevented tells it the panel took over).
 */
export function TransitionLink({ href, onClick, target, ...rest }: Props) {
  const { navigate } = useTransition();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const plain = e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;
    if (plain && target !== "_blank" && !e.defaultPrevented && navigate(href)) e.preventDefault();
    onClick?.(e);
  };

  return <Link href={href} target={target} onClick={handleClick} {...rest} />;
}

// Controls: the navigation items (top-right links, all but Home, and the fullscreen menu).
// Each item is a page; clicking the current page scrolls back to its top.
// Docs: docs/content-map.md, recipe "Add or remove a navigation item".
export const navItems = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/work/" },
  { label: "About", href: "/about/" },
  { label: "Contact", href: "/contact/" },
] as const;

export type NavItem = (typeof navItems)[number];

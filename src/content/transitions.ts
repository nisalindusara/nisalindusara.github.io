// Controls: the label shown on the panel during a page transition (and the intro name).
// Docs: docs/content-map.md, docs/design-and-motion.md ("Intro and page transitions").

import { projects } from "./projects";
import { profile } from "./profile";

/** Shown by the first-visit intro, and for any page without its own label. */
export const introName = profile.name;

/** Fixed labels per page. Project pages use the project's title. */
const labels: Record<string, string> = {
  "/": "Home",
  "/work": "Work",
  "/about": "About",
  "/contact": "Contact",
};

/** Label for the destination of a transition. "/work/" and "/work" are the same page. */
export function getTransitionLabel(pathname: string): string {
  const path = pathname.replace(/\/+$/, "") || "/";
  if (labels[path]) return labels[path];
  const slug = path.match(/^\/work\/([^/]+)$/)?.[1];
  const project = slug ? projects.find((p) => p.slug === slug) : undefined;
  return project?.title ?? introName;
}

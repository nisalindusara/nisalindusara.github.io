// Controls: which projects are shown (home list, /work, project pages) and in what order.
// To tailor the site: add a view, point ACTIVE_VIEW at it, rebuild.
// Docs: docs/projects.md, recipes "Create a view for a job application" and "Switch the active view".

import { projects, type Project } from "./projects";

// Named lists of project slugs, in display order.
export const views = {
  default: ["fitnesshub", "payments-api-design"], // payments-api-design is a SAMPLE project: replace or remove
} satisfies Record<string, string[]>;

export const ACTIVE_VIEW: keyof typeof views = "default";

/** Projects in the active view, in the view's order. Hidden projects are never built. */
export function getVisibleProjects(): Project[] {
  return views[ACTIVE_VIEW].map((slug) => {
    const project = projects.find((p) => p.slug === slug);
    if (!project) throw new Error(`views.ts: unknown project slug "${slug}"`);
    return project;
  });
}

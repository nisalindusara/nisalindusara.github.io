// Controls: the shape every project file must follow (fields, required or optional).
// Docs: docs/projects.md, section "Field reference".

export type Project = {
  /** URL of the project page (/work/<slug>/) and the id used in src/content/views.ts. */
  slug: string;
  /** Home list row, /work row, project page heading and browser tab, "Next project" link, /work search. */
  title: string;
  /** /work "Year" column, Year filter chips, project page "Year". */
  year: string;
  /** Project page "Role". */
  role: string;
  /** /work "Type" column, Type filter chips, project page "Type", home row label when category is missing. */
  type: string;
  /** /work "Stack" column, Stack filter chips, /work search, project page "Stack". */
  stack: string[];
  /** Home list row label on the right, e.g. "Gym Management System". Missing: `type` is shown. */
  category?: string;
  /** Project page description for search engines and link previews, and /work search. Not shown on the page. */
  summary: string;
  /** Project page "Links" buttons "Live site" and "Repository". Empty or missing: that button is hidden. */
  links: { live?: string; repo?: string };
  /** Full-width image on the project page under the details. Missing: no image block. */
  cover?: string;
  /** Cursor bubble image (mouse) and row thumbnail (touch) in the home and /work lists. Missing: blue "View" circle, no thumbnail. */
  preview?: string;

  // Optional sections on the project page, in this order. Missing or empty: the section is not shown.
  /** Project page "Overview". */
  overview?: string;
  /** Project page "What I built" (numbered list). */
  whatIBuilt?: string[];
  /** Project page "Key decisions". */
  decisions?: { title: string; body: string }[];
  /** Project page "Outcome". */
  outcome?: string;
  /** Project page "Gallery" (image paths). */
  gallery?: string[];
};

// Controls: text on the /work page (headline, filters, columns, counts, empty state),
// the "All work" link on the home page, and the "Next project" block on project pages.
// Docs: docs/content-map.md.
export const workPage = {
  metaTitle: "Work | Nisal Paranawithana",
  metaDescription: "Selected projects by Nisal Paranawithana.",
  headline: ["Things built slowly,", "for the people who use them."],
  allWorkLabel: "All work",

  columns: { project: "Project", type: "Type", stack: "Stack", year: "Year" },

  filters: {
    all: "All",
    filter: "Filter",
    panelLabel: "Filter projects",
    searchLabel: "Search",
    searchPlaceholder: "Title, summary or stack",
    groups: { type: "Type", stack: "Stack", year: "Year" },
    more: (n: number) => `+${n} more`,
    less: "Show less",
    clearAll: "Clear all",
    done: "Done",
    remove: (value: string) => `Remove filter ${value}`,
  },

  count: (n: number) => `${String(n).padStart(2, "0")} ${n === 1 ? "project" : "projects"}`,
  empty: "Nothing matches these filters.",
  clearFilters: "Clear filters",
};

// The "next project" block at the bottom of each project page.
export const nextProject = {
  label: "Next project",
  cursor: "Next project",
};

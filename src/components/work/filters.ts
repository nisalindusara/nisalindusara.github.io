import type { Project } from "@/content/projects";

export type GroupKey = "type" | "stack" | "year";

export type Filters = Record<GroupKey, string[]> & { query: string };

export const EMPTY_FILTERS: Filters = { type: [], stack: [], year: [], query: "" };

export const GROUP_KEYS: GroupKey[] = ["type", "stack", "year"];

/** The values a project has for a filter group. */
const valuesOf = (p: Project, key: GroupKey): string[] =>
  key === "stack" ? p.stack : key === "type" ? [p.type] : [p.year];

/** OR within a group, AND across groups; the search ANDs with everything. */
export function matches(p: Project, f: Filters): boolean {
  for (const key of GROUP_KEYS) {
    if (f[key].length && !valuesOf(p, key).some((v) => f[key].includes(v))) return false;
  }
  const q = f.query.trim().toLowerCase();
  if (!q) return true;
  return [p.title, p.summary, ...p.stack].some((s) => s.toLowerCase().includes(q));
}

export type Option = { value: string; count: number };

/** Chip options for a group, built from the projects themselves: A–Z, years newest first. */
export function optionsFor(projects: Project[], key: GroupKey): Option[] {
  const counts = new Map<string, number>();
  for (const p of projects) {
    for (const v of valuesOf(p, key)) counts.set(v, (counts.get(v) ?? 0) + 1);
  }
  const options = [...counts].map(([value, count]) => ({ value, count }));
  return key === "year"
    ? options.sort((a, b) => b.value.localeCompare(a.value))
    : options.sort((a, b) => a.value.localeCompare(b.value));
}

/** Number of active filters (each chip counts, a search counts as one). */
export const activeCount = (f: Filters) =>
  f.type.length + f.stack.length + f.year.length + (f.query.trim() ? 1 : 0);

"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Project } from "@/content/projects";
import { workPage } from "@/content/work";
import { useCursorPreview } from "@/components/CursorPreview/CursorPreview";
import { EMPTY_FILTERS, matches, type Filters } from "./filters";
import { ProjectRow } from "./ProjectRow";
import { WorkFilters } from "./WorkFilters";
import styles from "./ProjectList.module.css";

/** Filter bar, column headers and the project rows for /work. */
export function ProjectList({ projects }: { projects: Project[] }) {
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [firstLoad, setFirstLoad] = useState(true);
  const { listProps, rowProps, rowEffect, bubble } = useCursorPreview(projects);

  // Stagger the rows on the first load only; later filter changes animate together.
  useEffect(() => {
    const t = window.setTimeout(() => setFirstLoad(false), 800);
    return () => window.clearTimeout(t);
  }, []);

  const visible = projects.filter((p) => matches(p, filters));
  const cols = workPage.columns;

  return (
    <section className="container" aria-label="Projects">
      <WorkFilters
        projects={projects}
        filters={filters}
        onChange={setFilters}
        resultCount={visible.length}
      />

      <div className={`${styles.columns}`} aria-hidden="true">
        <span />
        <span>{cols.project}</span>
        <span>{cols.type}</span>
        <span>{cols.stack}</span>
        <span className={styles.right}>{cols.year}</span>
      </div>

      <ul className={styles.list} {...listProps}>
        <AnimatePresence mode="popLayout" initial>
          {visible.map((project, i) => (
            <ProjectRow
              key={project.slug}
              project={project}
              index={projects.indexOf(project)}
              delay={firstLoad ? i * 0.05 : 0}
              linkProps={rowProps(project.slug)}
              effect={rowEffect(project)}
            />
          ))}
        </AnimatePresence>
      </ul>

      <AnimatePresence>
        {visible.length === 0 && (
          <motion.div
            className={styles.empty}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <p>{workPage.empty}</p>
            <button type="button" className={styles.clear} onClick={() => setFilters(EMPTY_FILTERS)}>
              {workPage.clearFilters}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {bubble}
    </section>
  );
}

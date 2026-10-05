"use client";

import Link from "next/link";
import type { Project } from "@/content/projects";
import { nextProject } from "@/content/work";
import { Reveal } from "@/components/ui/Reveal";
import { useCursorPreview } from "@/components/CursorPreview/CursorPreview";
import styles from "./NextProject.module.css";

/** Centred "Next project" link at the end of a project page, with a blue "Next project" water ball. */
export function NextProject({ project }: { project: Project }) {
  // Always the water ball here, even if the project has a preview image.
  const { rowEffect } = useCursorPreview([{ ...project, preview: undefined }], {
    label: nextProject.cursor,
  });

  return (
    <Reveal>
      <Link href={`/work/${project.slug}/`} className={styles.next}>
        <span className={styles.label}>{nextProject.label}</span>
        <span className={styles.title}>{project.title}</span>
        {rowEffect({ ...project, preview: undefined })}
      </Link>
    </Reveal>
  );
}

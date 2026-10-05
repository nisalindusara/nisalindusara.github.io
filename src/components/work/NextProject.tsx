"use client";

import Link from "next/link";
import type { Project } from "@/content/projects";
import { nextProject } from "@/content/work";
import { Reveal } from "@/components/ui/Reveal";
import { useCursorPreview } from "@/components/CursorPreview/CursorPreview";
import styles from "./NextProject.module.css";

/** Centred "Next project" link at the end of a project page, with a blue "Next project" cursor. */
export function NextProject({ project }: { project: Project }) {
  // Always the blue circle here, even if the project has a preview image.
  const { listProps, rowProps, bubble } = useCursorPreview([{ ...project, preview: undefined }], {
    label: nextProject.cursor,
  });
  const row = rowProps(project.slug);

  return (
    <>
      <Reveal>
        <Link
          href={`/work/${project.slug}/`}
          className={styles.next}
          onPointerEnter={(e) => {
            listProps.onPointerEnter(e);
            row.onPointerEnter();
          }}
          onPointerMove={listProps.onPointerMove}
          onPointerLeave={listProps.onPointerLeave}
          onFocus={row.onFocus}
        >
          <span className={styles.label}>{nextProject.label}</span>
          <span className={styles.title}>{project.title}</span>
        </Link>
      </Reveal>
      {bubble}
    </>
  );
}

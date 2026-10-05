"use client";

import { TransitionLink } from "@/components/transition/TransitionLink";
import type { Project } from "@/content/projects";
import { nextProject } from "@/content/work";
import { Reveal } from "@/components/ui/Reveal";
import { BlueBall } from "@/components/work/BlueBall";
import styles from "./NextProject.module.css";

/** Centred "Next project" link at the end of a project page, with a blue "Next project" ball. */
export function NextProject({ project }: { project: Project }) {
  return (
    <Reveal>
      <TransitionLink href={`/work/${project.slug}/`} className={styles.next}>
        <span className={styles.label}>{nextProject.label}</span>
        <span className={styles.title}>{project.title}</span>
        {/* Always the blue ball here, even if the project has a preview image. */}
        <BlueBall label={nextProject.cursor} />
      </TransitionLink>
    </Reveal>
  );
}

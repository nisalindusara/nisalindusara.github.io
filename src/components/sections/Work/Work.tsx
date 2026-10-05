"use client";

import Image from "next/image";
import Link from "next/link";
import { getVisibleProjects } from "@/content/views";
import { workPage } from "@/content/work";
import { Reveal } from "@/components/ui/Reveal";
import { useCursorPreview } from "@/components/CursorPreview/CursorPreview";
import styles from "./Work.module.css";

export function Work() {
  const projects = getVisibleProjects();
  const { listProps, rowProps, bubble } = useCursorPreview(projects);

  return (
    <section id="work" className={styles.work} aria-labelledby="work-title">
      <div className="container">
        <Reveal>
          <h2 id="work-title" className={styles.heading}>
            Selected work
          </h2>
        </Reveal>

        <ul className={styles.list} {...listProps}>
          {projects.map((project, i) => (
            <li key={project.slug} className={styles.item}>
              <Reveal delay={i * 0.06}>
                <Link href={`/work/${project.slug}/`} className={styles.row} {...rowProps(project.slug)}>
                  <h3 className={styles.title}>{project.title}</h3>
                  <span className={styles.category}>{project.category ?? project.type}</span>
                  {project.preview && (
                    <span className={styles.thumb}>
                      <Image src={project.preview} alt="" width={800} height={600} />
                    </span>
                  )}
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>

        <div className={styles.more}>
          <Link href="/work/" className={`fill-hover ${styles.allWork}`}>
            {workPage.allWorkLabel} <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>

      {bubble}
    </section>
  );
}

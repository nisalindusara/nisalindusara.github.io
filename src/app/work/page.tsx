import type { Metadata } from "next";
import { getVisibleProjects } from "@/content/views";
import { workPage } from "@/content/work";
import { WorkHeader } from "@/components/work/WorkHeader";
import { ProjectList } from "@/components/work/ProjectList";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: workPage.metaTitle,
  description: workPage.metaDescription,
  openGraph: { title: workPage.metaTitle, description: workPage.metaDescription, images: ["/og.png"] },
};

export default function WorkPage() {
  // Only projects in the active view (src/content/views.ts).
  const projects = getVisibleProjects();

  return (
    <main id="main" className={styles.page}>
      <WorkHeader />
      <ProjectList projects={projects} />
    </main>
  );
}

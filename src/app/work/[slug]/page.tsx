import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getVisibleProjects } from "@/content/views";
import { profile } from "@/content/profile";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { NextProject } from "@/components/work/NextProject";
import { TopBar } from "@/components/TopBar/TopBar";
import styles from "./page.module.css";

// Only projects in the active view are built; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return getVisibleProjects().map((p) => ({ slug: p.slug }));
}

function findProject(slug: string) {
  const visible = getVisibleProjects();
  const i = visible.findIndex((p) => p.slug === slug);
  return i === -1 ? null : { project: visible[i], next: visible[i + 1] };
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const found = findProject((await params).slug);
  if (!found) return {};
  const { project } = found;
  const title = `${project.title} | ${profile.siteTitle}`;
  return {
    title,
    description: project.summary,
    openGraph: { title, description: project.summary, images: ["/og.png"] },
  };
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className={styles.section}>
      <Reveal className={styles.sectionGrid}>
        <h2 className="label">{label}</h2>
        <div className={styles.sectionBody}>{children}</div>
      </Reveal>
    </section>
  );
}

export default async function ProjectPage({ params }: PageProps<"/work/[slug]">) {
  const found = findProject((await params).slug);
  if (!found) notFound();
  const { project, next } = found;
  const { live, repo } = project.links;

  return (
    <main id="main" className={`container ${styles.page}`}>
      <TopBar />

      <header className={styles.header}>
        <Reveal delay={0.05}>
          <h1 className={`display ${styles.title}`}>{project.title}</h1>
        </Reveal>

        <Reveal delay={0.12}>
          <dl className={styles.meta}>
            <div>
              <dt className="label">Role</dt>
              <dd>{project.role}</dd>
            </div>
            <div>
              <dt className="label">Year</dt>
              <dd>{project.year}</dd>
            </div>
            <div>
              <dt className="label">Type</dt>
              <dd>{project.type}</dd>
            </div>
            <div>
              <dt className="label">Stack</dt>
              <dd>{project.stack.join(", ")}</dd>
            </div>
            {(live || repo) && (
              <div>
                <dt className="label">Links</dt>
                <dd className={styles.links}>
                  {live && <Button href={live}>Live site</Button>}
                  {repo && <Button href={repo}>Repository</Button>}
                </dd>
              </div>
            )}
          </dl>
        </Reveal>
      </header>

      {project.cover && (
        <Reveal delay={0.18}>
          <Image
            src={project.cover}
            alt={`${project.title} cover image`}
            width={1600}
            height={1000}
            priority
            className={styles.cover}
          />
        </Reveal>
      )}

      {project.overview && (
        <Section label="Overview">
          <p className={styles.lead}>{project.overview}</p>
        </Section>
      )}

      {project.whatIBuilt && project.whatIBuilt.length > 0 && (
        <Section label="What I built">
          <ol className={styles.built}>
            {project.whatIBuilt.map((item, i) => (
              <li key={i}>
                <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </Section>
      )}

      {project.decisions && project.decisions.length > 0 && (
        <Section label="Key decisions">
          <div className={styles.decisions}>
            {project.decisions.map((d) => (
              <div key={d.title}>
                <h3 className={styles.decisionTitle}>{d.title}</h3>
                <p className={styles.muted}>{d.body}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {project.outcome && (
        <Section label="Outcome">
          <p className={styles.lead}>{project.outcome}</p>
        </Section>
      )}

      {project.gallery && project.gallery.length > 0 && (
        <Section label="Gallery">
          <div className={styles.gallery}>
            {project.gallery.map((src, i) => (
              <Image
                key={src}
                src={src}
                alt={`${project.title} screen ${i + 1}`}
                width={1600}
                height={1000}
                className={styles.galleryImage}
              />
            ))}
          </div>
        </Section>
      )}

      {next && <NextProject project={next} />}
    </main>
  );
}

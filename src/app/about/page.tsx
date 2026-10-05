import type { Metadata } from "next";
import { about } from "@/content/about";
import { TopBar } from "@/components/TopBar/TopBar";
import { Intro } from "@/components/about/Intro";
import { ImageBand } from "@/components/about/ImageBand";
import { Achievements } from "@/components/about/Achievements";
import { Motivation } from "@/components/about/Motivation";
import { Toolbox } from "@/components/about/Toolbox";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: about.metaTitle,
  description: about.metaDescription,
  openGraph: { title: about.metaTitle, description: about.metaDescription, images: ["/og.png"] },
};

export default function AboutPage() {
  return (
    <main id="main" className={`container ${styles.page}`}>
      <TopBar theme="dark" />
      <Intro />
      <ImageBand />
      <Achievements />
      <Motivation />
      <Toolbox />
    </main>
  );
}

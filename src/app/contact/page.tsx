import type { Metadata } from "next";
import { contactSection, profile } from "@/content/profile";
import { Contact } from "@/components/sections/Contact/Contact";
import { TopBar } from "@/components/TopBar/TopBar";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: contactSection.metaTitle,
  description: contactSection.metaDescription,
  openGraph: {
    title: contactSection.metaTitle,
    description: contactSection.metaDescription,
    images: ["/og.png"],
  },
};

export default function ContactPage() {
  return (
    <main id="main" className={styles.page}>
      <div className="container">
        <TopBar name={profile.name} />
      </div>
      <Contact />
    </main>
  );
}

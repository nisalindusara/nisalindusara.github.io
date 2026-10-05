// Controls: all text and images on the /about page, plus the "More about me" link label on the home page.
// Empty a section's data to hide that section. The only place that may state location or studies.
// Docs: docs/content-map.md (text), docs/media.md (images).

import { profile } from "./profile";

export type AboutImage = {
  src: string;
  alt: string;
  caption?: string;
  /** Real pixel size of the file, so there is no layout shift. */
  width: number;
  height: number;
};

export const about = {
  metaTitle: `About | ${profile.siteTitle}`,
  metaDescription: "About Nisal Paranawithana: how I work and what I care about.",

  // Small "More about me" link under the home page About statement.
  moreLink: "More about me",

  labels: {
    about: "About",
    achievements: "Achievements",
    motivation: "Motivation",
    toolbox: "Toolbox",
  },

  statement:
    "I care about the quiet parts of software: the flow nobody notices, the error that explains itself, the screen that simply makes sense.", // SAMPLE: replace

  body: "I work across design, planning and code, which lets me see a product from the first sketch to the last detail.", // SAMPLE: replace

  // Rows with an empty value are skipped.
  facts: [
    { label: "Name", value: "Nisal Paranawithana" },
    { label: "Based in", value: "Colombo, Sri Lanka" },
    { label: "What I do", value: "UI/UX design, project management and development" },
    {
      label: "Studying",
      value: "Computer Science (undergraduate), University of Colombo School of Computing",
    },
    { label: "Working at", value: "[SAMPLE] Company name, or Independent" }, // SAMPLE: replace
  ],

  images: {
    portrait: {
      src: "/about/portrait.svg", // SAMPLE: replace with a real photo (4:5)
      alt: "Portrait of Nisal Paranawithana",
      width: 1200,
      height: 1500,
    },
    wide: {
      src: "/about/wide.svg", // SAMPLE: replace with a real photo (21:9)
      alt: "[SAMPLE] Describe the wide photo", // SAMPLE: replace
      caption: "[SAMPLE] Optional caption", // SAMPLE: replace
      width: 2100,
      height: 900,
    },
    detailOne: {
      src: "/about/detail-1.svg", // SAMPLE: replace with a real photo (4:3)
      alt: "[SAMPLE] Describe the first detail photo", // SAMPLE: replace
      width: 1200,
      height: 900,
    },
    detailTwo: {
      src: "/about/detail-2.svg", // SAMPLE: replace with a real photo (4:3)
      alt: "[SAMPLE] Describe the second detail photo", // SAMPLE: replace
      width: 1200,
      height: 900,
    },
  } as Partial<Record<"portrait" | "wide" | "detailOne" | "detailTwo", AboutImage>>,

  achievements: [
    {
      year: "2026",
      title: "Led design and project management on a four-person team building a platform for a real client",
      note: "FitnessHub",
    },
    { year: "2026", title: "[SAMPLE] Award, competition or recognition", note: "[SAMPLE] One line of context." }, // SAMPLE: replace
    { year: "2025", title: "[SAMPLE] Certification or course", note: "[SAMPLE] One line of context." }, // SAMPLE: replace
    {
      year: "2025",
      title: "[SAMPLE] Open-source contribution or community work",
      note: "[SAMPLE] One line of context.",
    }, // SAMPLE: replace
  ],

  // SAMPLE: replace
  motivation: {
    statement: "I want to make things people come to rely on.",
    paragraphs: [
      "What keeps me building is the moment someone uses something I made and doesn’t have to think about it.",
      "Over time I’d like to turn that into products of my own, and a team to build them with.",
    ],
  },

  // SAMPLE: replace
  toolbox: [
    { label: "Languages", items: ["JavaScript", "TypeScript", "PHP", "SQL"] },
    { label: "Frontend", items: ["React", "Next.js", "CSS"] },
    { label: "Backend", items: ["Node.js", "MySQL"] },
    { label: "Tools", items: ["Git", "Figma"] },
  ],
};

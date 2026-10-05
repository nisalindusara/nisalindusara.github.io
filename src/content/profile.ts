// Controls: name, top-left brand name, home hero wordmark and role line, home About statement, footer text, email and social links, CV path,
// Contact page links and labels, and the site title, description and URL (metadata).
// Docs: docs/content-map.md; links and email: recipe "Add or remove a contact link".

const name = "Nisal Paranawithana";
// Top left (taking turns with the logo) and the browser tab title.
const brandName = "Nisal Indusara";
// One sentence; feeds the page description (siteDescription below).
const tagline = "Software, shaped slowly and with care.";

export const profile = {
  name,
  lastName: "Paranawithana",
  // Accessible name of the top-left logo link ("<fullName>, home").
  fullName: "Nisal Indusara Paranawithana",
  brandName,
  // Browser tab title of the home page, and the end of every other page's title ("Work | Nisal Indusara").
  siteTitle: brandName,
  tagline,
  // Home hero wordmark, shown lowercase across the full width with a ® after it. One short word.
  heroWord: "nisal",
  // Small line in the home hero's top row (1024px and wider), next to the logo.
  heroRole: "design, planning and code", // SAMPLE: replace
  about:
    "I like the moment a messy problem goes quiet and becomes obvious. I build software the way a carpenter builds a table: for the person who will actually use it, with the joinery hidden.",
  closingLine: "Let’s work together",
  contactCta: "Get in touch",
  avatar: "/avatar.svg", // SAMPLE: replace with a real photo (square image, e.g. public/avatar.jpg)
  email: "nisal@example.com", // SAMPLE: replace
  github: "https://github.com/nisal-sample", // SAMPLE: replace
  linkedin: "https://www.linkedin.com/in/nisal-sample", // SAMPLE: replace
  cv: "/cv.pdf", // SAMPLE: replace (placeholder file in public/cv.pdf)
  copyrightYear: "2026",

  // Used for <meta> tags and Open Graph.
  siteDescription: `${name}. ${tagline}`,
  siteUrl: "https://nisal-sample.github.io", // SAMPLE: replace with the real deployed URL (needed for absolute Open Graph links)
};

// Links in the Contact section, in this order. Add or remove entries here; the section renders this list.
// external: opens in a new tab.
export const contactLinks = [
  { label: "GitHub", href: profile.github, external: true },
  { label: "LinkedIn", href: profile.linkedin, external: true },
  { label: "E-Mail", href: `mailto:${profile.email}`, external: false },
  { label: "CV", href: profile.cv, external: true },
];

export const contactSection = {
  label: "Contact",
  metaTitle: `Contact | ${brandName}`,
  metaDescription: "Get in touch with Nisal Paranawithana.",
};

// Contact buttons in the footer, in this order. Email is added separately.
export const socials = [
  { label: "LinkedIn", href: profile.linkedin },
  { label: "GitHub", href: profile.github },
];

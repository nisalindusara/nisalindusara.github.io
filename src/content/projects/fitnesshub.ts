// Controls: everything about the FitnessHub project (list rows, filters, its page /work/fitnesshub/).
// Docs: docs/projects.md (fields and recipes), docs/media.md (images).

import type { Project } from "./types";

export const fitnesshub: Project = {
  slug: "fitnesshub",
  title: "FitnessHub",
  year: "2026",
  role: "UI/UX design, project management and development",
  type: "Web platform",
  stack: ["PHP", "MySQL", "PWA"],
  category: "Gym Management System",
  summary: "A gym management platform for a real client.",
  links: { live: "", repo: "" },
  cover: "/projects/fitnesshub/cover.svg", // SAMPLE: replace (placeholder image)
  preview: "/projects/fitnesshub/preview.svg", // SAMPLE: replace (placeholder image)

  overview:
    "A group project with a team of four, building one integrated platform for a real client: a gym with multiple branches. The platform brings 11 functional modules together in one place.",

  whatIBuilt: [
    "Designed the interface and managed the project.",
    "Built the e-commerce module.",
    "Built the payment module, including a proof of concept with the OnePay sandbox in PHP.",
    "Built the accounting module, with permissions and authorization.",
  ],

  decisions: [
    {
      title: "One adaptive dashboard",
      body: "Instead of a separate dashboard for every type of user, there is one dashboard that adapts to whoever signs in. Simple on/off switches decide what each person sees, so there is one place to look after instead of many.",
    },
    {
      title: "One registration flow",
      body: "Everyone signs up through the same flow, and a few simple markers record what they came for. Sign-up stays consistent, without a separate form for each kind of user.",
    },
  ],

  outcome:
    "Delivered a working multi-branch platform covering e-commerce, payments and accounting for a real client.", // SAMPLE: replace with the real outcome

  gallery: [
    "/projects/fitnesshub/gallery-1.svg", // SAMPLE: replace (placeholder image)
    "/projects/fitnesshub/gallery-2.svg", // SAMPLE: replace (placeholder image)
  ],
};

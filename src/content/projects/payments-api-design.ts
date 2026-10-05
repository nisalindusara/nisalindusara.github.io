// Controls: everything about the Payments API Design project (its page /work/payments-api-design/).
// Docs: docs/projects.md.

import type { Project } from "./types";

// SAMPLE: replace — placeholder project (no images) to exercise the Work page and filters.
export const paymentsApiDesign: Project = {
  slug: "payments-api-design",
  title: "Payments API Design",
  year: "2026",
  role: "API design",
  type: "API design",
  stack: ["REST", "OpenAPI", "JSON"],
  summary: "A clean, versioned REST API for online payments.",
  links: { live: "", repo: "" },

  overview:
    "A design-first approach to a payments API: resources, errors and versioning planned on paper before any code was written.",

  whatIBuilt: [
    "Defined the resource model and endpoint structure.",
    "Wrote the OpenAPI specification.",
    "Designed one consistent error format and idempotent payment requests.",
  ],

  decisions: [
    {
      title: "Idempotent by default",
      body: "Every payment request carries a key, so a retry can never charge twice.",
    },
    {
      title: "Errors that explain themselves",
      body: "One error shape across the API, with a stable code and a human-readable message.",
    },
  ],

  outcome: "[SAMPLE] Replace with the real outcome.", // SAMPLE: replace
};

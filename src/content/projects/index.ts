// Controls: the registry of every project file. A project must be listed here AND in src/content/views.ts to appear.
// Docs: docs/projects.md, recipe "Add a project (with images)".

import type { Project } from "./types";
import { fitnesshub } from "./fitnesshub";
import { paymentsApiDesign } from "./payments-api-design";

// Registry of every project. To add one: create a file next to this one and list it here.
// Whether it is shown is decided in src/content/views.ts.
export const projects: Project[] = [fitnesshub, paymentsApiDesign];

export type { Project };

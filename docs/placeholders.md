# Placeholders

Use this when: replacing the sample content before sharing the site.
Time: about 60 minutes for all.

Find every marker in VS Code: press Ctrl+Shift+F, type `SAMPLE`, set "files to include" to `src, public`. When a value is real, also delete its `// SAMPLE: replace ...` comment so the search shrinks to zero.

| File | Field | Current value | What to put there | Done |
|---|---|---|---|---|
| `src/content/profile.ts` | `email` | `paranawithananisal19@gmail.com` | your real email | [x] |
| `src/content/profile.ts` | `github` | `https://github.com/nisal-sample` | your GitHub profile URL | [ ] |
| `src/content/profile.ts` | `linkedin` | `https://www.linkedin.com/in/nisal-sample` | your LinkedIn profile URL | [ ] |
| `src/content/profile.ts` + `public/cv.pdf` | `cv` | `/cv.pdf` (placeholder PDF) | keep the path, replace the file ([media.md](media.md#replace-the-cv)) | [ ] |
| `src/content/profile.ts` + `public/avatar.svg` | `avatar` | `/avatar.svg` (gray silhouette) | a square photo ([media.md](media.md#replace-the-footer-avatar)) | [ ] |
| `src/content/profile.ts` | `siteUrl` | `https://nisal-sample.github.io` | `https://YOUR-USERNAME.github.io` | [ ] |
| `src/content/profile.ts` + `public/hero/photo.svg` | `heroImage.src` | `/hero/photo.svg` (gray SAMPLE PHOTO) | a wide photo, 2400 x 1040 ([media.md](media.md#replace-the-hero-photo)) | [ ] |
| `src/content/profile.ts` | `heroRole` | design, planning and code | a few words on what you do, shown in the home hero's top row | [ ] |
| `src/content/about.ts` | `statement` | I care about the quiet parts of software... | your own statement, or keep it | [ ] |
| `src/content/about.ts` | `body` | I work across design, planning and code... | one short paragraph, or keep it | [ ] |
| `src/content/about.ts` | `facts`, "Working at" | `[SAMPLE] Company name, or Independent` | company name or `Independent`; `""` hides the row | [ ] |
| `src/content/about.ts` + `public/about/portrait.svg` | `images.portrait` | gray placeholder | portrait photo 4:5 ([media.md](media.md#replace-the-portrait-and-about-images)) | [ ] |
| `src/content/about.ts` + `public/about/wide.svg` | `images.wide` (`src`, `alt`, `caption`) | gray placeholder, `[SAMPLE]` alt and caption | wide photo 21:9, real alt, caption or no caption | [ ] |
| `src/content/about.ts` + `public/about/detail-1.svg` | `images.detailOne` (`src`, `alt`) | gray placeholder, `[SAMPLE]` alt | photo 4:3, real alt | [ ] |
| `src/content/about.ts` + `public/about/detail-2.svg` | `images.detailTwo` (`src`, `alt`) | gray placeholder, `[SAMPLE]` alt | photo 4:3, real alt | [ ] |
| `src/content/about.ts` | `achievements` entries 2 to 4 | `[SAMPLE] Award...`, `[SAMPLE] Certification...`, `[SAMPLE] Open-source...` | real achievements, or delete the entries | [ ] |
| `src/content/about.ts` | `motivation` | I want to make things people come to rely on. | your own words, or keep them | [ ] |
| `src/content/about.ts` | `toolbox` | Languages, Frontend, Backend, Tools | the tools you use | [ ] |
| `src/content/projects/fitnesshub.ts` + `public/projects/fitnesshub/` | `cover`, `preview`, `gallery` | colored placeholder SVGs | screenshots ([media.md](media.md#replace-a-sample-placeholder-image)) | [ ] |
| `src/content/projects/fitnesshub.ts` | `outcome` | Delivered a working multi-branch platform... | the real outcome | [ ] |
| `src/content/projects/payments-api-design.ts` | whole project | sample project | replace with a real project, or remove it ([projects.md](projects.md#remove-a-project)) | [ ] |
| `src/content/projects/payments-api-design.ts` | `outcome` | `[SAMPLE] Replace with the real outcome.` | the real outcome | [ ] |
| `src/content/views.ts` | `default` | contains `payments-api-design` | the slugs you want shown | [ ] |

Not marked SAMPLE but worth checking: `public/og.png` (the share image shows the name and tagline) and `copyrightYear: "2026"` in `src/content/profile.ts`.

# Nisal Paranawithana: portfolio

Use this when: you come back to the site and need to find the right recipe.

Personal portfolio site. Live at https://YOUR-USERNAME.github.io

## Stack

- Next.js 16.3.8 (App Router), React 19, TypeScript
- Static export (`output: "export"` in `next.config.ts`), hosted on GitHub Pages
- Animation: Framer Motion 14
- Smooth scrolling: Lenis 1.3
- Styling: plain CSS, `src/app/globals.css` plus one CSS Module per component
- Node.js 20.9 or newer

## Commands

Run in the VS Code terminal (Terminal > New Terminal), in the project folder.

| Command | What it does |
|---|---|
| `npm install` | Installs the packages (first time, or after `package.json` changes) |
| `npm run dev` | Runs the site at http://localhost:3000 and reloads on save |
| `npm run build` | Builds the static site into `out/` and reports errors |
| `npx serve out` | Serves the built `out/` folder at http://localhost:3000 (answer `y` the first time) |

## Coming back after a long break

1. Open the project folder in VS Code and open a terminal (Terminal > New Terminal).
2. Run `node -v`. If it prints lower than `v20.9.0`, install Node 20 LTS or newer from https://nodejs.org and reopen VS Code.
3. Run `npm install`.
4. Run `npm run dev` and open http://localhost:3000.
5. Find your task in [I want to...](#i-want-to) below and open that recipe.

## I want to...

| Task | Open |
|---|---|
| add a new project | [projects.md: Add a project](docs/projects.md#add-a-project-with-images) |
| edit an existing project | [projects.md: Edit a project](docs/projects.md#edit-a-project) |
| remove or hide a project | [projects.md: Remove](docs/projects.md#remove-a-project), [Hide](docs/projects.md#hide-a-project-without-deleting-it) |
| show different projects for a different job application | [projects.md: Create a view](docs/projects.md#create-a-view-for-a-job-application) |
| change the order of projects | [projects.md: Reorder](docs/projects.md#reorder-projects) |
| add or replace a project image | [media.md: Replace a placeholder image](docs/media.md#replace-a-sample-placeholder-image) |
| replace my portrait and About images | [media.md: About images](docs/media.md#replace-the-portrait-and-about-images) |
| replace my CV | [media.md: Replace the CV](docs/media.md#replace-the-cv) |
| change my name or tagline | [content-map.md: Change a text](docs/content-map.md#change-a-text), then [design-and-motion.md: hero name](docs/design-and-motion.md#change-the-first-name-in-the-hero) |
| change the About text, achievements, motivation or toolbox | [content-map.md: About page](docs/content-map.md#about-page-about) |
| change the contact links or my email | [content-map.md: Contact link](docs/content-map.md#add-or-remove-a-contact-link) |
| change the navigation items | [content-map.md: Navigation item](docs/content-map.md#add-or-remove-a-navigation-item) |
| change colors or fonts | [design-and-motion.md: Palette](docs/design-and-motion.md#change-the-palette), [Font](docs/design-and-motion.md#change-a-font) |
| change animation speed or turn an animation off | [design-and-motion.md: Animation settings](docs/design-and-motion.md#animation-settings) |
| change the page title, description, favicon or share image | [content-map.md: Page title](docs/content-map.md#page-title-and-description-browser-tab-search-results-link-previews), [media.md: Favicon](docs/media.md#replace-the-favicon-or-the-share-image) |
| find every SAMPLE placeholder still left | [placeholders.md](docs/placeholders.md) |
| run the site locally | [Coming back after a long break](#coming-back-after-a-long-break) |
| deploy for the first time | [deployment.md: First deployment](docs/deployment.md#first-deployment) |
| deploy a change | [deployment.md: Every later deployment](docs/deployment.md#every-later-deployment) |
| undo a bad deploy | [deployment.md: Undo](docs/deployment.md#undo-a-bad-deployment) |
| fix a build error | [troubleshooting.md: Build error](docs/troubleshooting.md#how-to-read-a-build-error) |
| fix a broken page after deploying | [troubleshooting.md](docs/troubleshooting.md#troubleshooting) |

Before every deploy and before sharing the link: [docs/checklists.md](docs/checklists.md). How it fits together: [docs/architecture.md](docs/architecture.md).

## Project map

```
.github/workflows/deploy.yml   builds and publishes to GitHub Pages on push to main
docs/                          these docs; docs/templates/ has the project template
public/                        files served as they are
  about/                       About page photos
  projects/<slug>/             project images, one folder per project
  avatar.svg, cv.pdf, og.png   footer avatar, CV, share image
  .nojekyll                    stops GitHub Pages from running Jekyll (which hides folders starting with _)
src/
  app/                         pages (one folder per URL), layout, global CSS, favicon
    about/  contact/  work/    /about/, /contact/, /work/ and /work/<slug>/
  components/                  building blocks of the pages
    Nav/  TopBar/              navigation, fullscreen menu, name row
    sections/                  home sections, Contact section, footer
    work/  about/              /work and /about pieces
    CursorDot/  CursorPreview/ blue cursor dot, "View" bubble
    ui/                        small shared animation helpers and buttons
  content/                     ALL editable text, links and image paths
    projects/                  one file per project, registry, Project type
  fonts/                       local font files (Nimbus Sans, Zodiak)
next.config.ts                 static export settings
```

## Rules that must not be broken

- Location and studies appear only on the About page; nowhere else, including page titles.
- My age and a phone number appear nowhere.
- Copy stays quiet and poetic.
- One animation style (200 to 500 ms, ease-out); every animation respects reduced motion.
- No GSAP, no new heavy libraries, no 3D or WebGL.
- No URL parameters that reveal tailoring; use `ACTIVE_VIEW` only.

Full list: [docs/decisions-and-rules.md](docs/decisions-and-rules.md#rules).

## Keeping the docs true

| If I change | Update |
|---|---|
| a field in `src/content/projects/types.ts` | `docs/projects.md` (Field reference), `docs/templates/project-template.ts.txt` |
| a field name in any `src/content/*.ts` file | `docs/content-map.md` |
| an image slot, size or folder | `docs/media.md` |
| a CSS variable, font or animation setting | `docs/design-and-motion.md` |
| a page or route | `docs/architecture.md` (Routes), `docs/content-map.md` |
| `.github/workflows/deploy.yml` or `next.config.ts` | `docs/deployment.md` |
| a SAMPLE value | `docs/placeholders.md` (tick or delete the row) |
| a rule or a deliberate quirk | `docs/decisions-and-rules.md` |

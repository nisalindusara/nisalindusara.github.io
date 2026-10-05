# Projects

Use this when: adding, editing, hiding, removing or reordering projects, or tailoring the site for a job application.
Time: about 10 minutes per recipe.

A project is shown only when both are true:

1. Its file is listed in `src/content/projects/index.ts` (the registry).
2. Its slug is in the active view in `src/content/views.ts`.

Projects not in the active view are not built at all: no list row, no page.

## Add a project (with images)

Goal: a new project with images appears on the home page, on /work and at /work/<slug>/.

Files to edit:

- `src/content/projects/<slug>.ts` (new)
- `src/content/projects/index.ts`
- `src/content/views.ts`
- `public/projects/<slug>/` (new folder with images)

Steps:

1. Choose a slug that follows [Slug rules](#slug-rules), for example `shop-redesign`.
2. Copy the template into the projects folder (run in the VS Code terminal, project root):

   ```
   cp docs/templates/project-template.ts.txt src/content/projects/<REPLACE: slug>.ts
   ```

3. Open the new file. Replace every `<REPLACE: ...>`. Delete optional fields you do not use. Field meanings: [Field reference](#field-reference).
4. Create the folder `public/projects/<slug>/` and put the images in it, named exactly as in the file (`cover.jpg`, `preview.jpg`, `gallery-1.jpg`). Image sizes: [docs/media.md](media.md#image-slots).
5. Open `src/content/projects/index.ts`. Add an import line and add the export name to the `projects` array:

   ```ts
   import { <REPLACE: exportName> } from "./<REPLACE: slug>";

   export const projects: Project[] = [fitnesshub, paymentsApiDesign, <REPLACE: exportName>];
   ```

6. Open `src/content/views.ts`. Add the slug to the view named in `ACTIVE_VIEW`, at the position where it should appear:

   ```ts
   default: ["fitnesshub", "payments-api-design", "<REPLACE: slug>"],
   ```

7. Run `npm run build`.

Done when: the build ends without errors, `out/work/<slug>/index.html` exists, and `npm run dev` shows the project on http://localhost:3000/, on http://localhost:3000/work/ and at http://localhost:3000/work/<slug>/.

If it fails: [troubleshooting: build fails with a type error](troubleshooting.md#t-type-error), [a new project does not appear](troubleshooting.md#t-not-appear).

## Add a project without images

Goal: a project with text only.

Files to edit: same as [Add a project (with images)](#add-a-project-with-images), without the `public/projects/<slug>/` folder.

Steps:

1. Follow steps 1 to 3 of [Add a project (with images)](#add-a-project-with-images).
2. Delete the lines `cover:`, `preview:` and `gallery:` from the new file.
3. Follow steps 5 to 7 of the same recipe.

Done when: the project page has no image block, and hovering the row on /work shows the blue "View" circle.

If it fails: [troubleshooting: build fails with a type error](troubleshooting.md#t-type-error).

## Edit a project

Goal: change the text, links or images of an existing project.

Files to edit: `src/content/projects/<slug>.ts`

Steps:

1. Open the file. Change the field values. Field meanings: [Field reference](#field-reference).
2. To change an image: replace the file in `public/projects/<slug>/` with the same name, or put a new file there and change the path in the field.
3. Run `npm run dev` and open http://localhost:3000/work/<slug>/.

Done when: the page shows the new values.

If it fails: [troubleshooting: build fails with a type error](troubleshooting.md#t-type-error).

Changing the slug changes the URL. Change it in the project file AND in `src/content/views.ts`.

## Remove a project

Goal: delete a project completely.

Files to edit: `src/content/views.ts`, `src/content/projects/index.ts`, `src/content/projects/<slug>.ts`, `public/projects/<slug>/`

Steps:

1. In `src/content/views.ts`, delete the slug from every view.
2. In `src/content/projects/index.ts`, delete its import line and its name from the `projects` array.
3. Delete the file `src/content/projects/<slug>.ts`.
4. Delete the folder `public/projects/<slug>/`.
5. Run `npm run build`.

Done when: the build passes and `out/work/<slug>/` does not exist.

If it fails: [troubleshooting: build fails with a type error](troubleshooting.md#t-type-error).

## Hide a project without deleting it

Goal: keep the file but take the project off the site.

Files to edit: `src/content/views.ts`

Steps:

1. Delete the slug from the view named in `ACTIVE_VIEW`. Keep the file and the registry entry.
2. Run `npm run build`.

Done when: the project is missing from the home list and /work, and `out/work/<slug>/` does not exist.

If it fails: [troubleshooting: build fails with a type error](troubleshooting.md#t-type-error).

## Reorder projects

Goal: change the order on the home page, on /work and the "Next project" chain.

Files to edit: `src/content/views.ts`

Steps:

1. Reorder the slugs in the view named in `ACTIVE_VIEW`. The first slug is shown first and numbered 01.
2. Run `npm run dev`.

Done when: http://localhost:3000/work/ lists the projects in the new order.

If it fails: [troubleshooting: a new project does not appear](troubleshooting.md#t-not-appear).

## Create a view for a job application

Goal: a named list of projects for one application. No URL parameter is involved.

Files to edit: `src/content/views.ts`

Steps:

1. Add a new entry next to `default`. Use a name with letters, digits and underscores:

   ```ts
   export const views = {
     default: ["fitnesshub", "payments-api-design"],
     <REPLACE: view_name>: ["<REPLACE: slug>", "<REPLACE: slug>"],
   } satisfies Record<string, string[]>;
   ```

2. Every slug must exist in `src/content/projects/index.ts`. A slug that does not exist stops the build with `views.ts: unknown project slug "<slug>"`.
3. Follow [Switch the active view](#switch-the-active-view).

Done when: see [Switch the active view](#switch-the-active-view).

If it fails: [troubleshooting: build fails with a type error](troubleshooting.md#t-type-error).

## Switch the active view

Goal: the site shows the projects of another view.

Files to edit: `src/content/views.ts`

Steps:

1. Change the one line:

   ```ts
   export const ACTIVE_VIEW: keyof typeof views = "<REPLACE: view_name>";
   ```

2. Run `npm run build`.
3. Deploy: [docs/deployment.md](deployment.md#every-later-deployment).

Done when: `out/work/` contains one folder per slug of that view and no other project folders. The folder `out/work/__next.work/` is always there; it belongs to Next.js.

If it fails: [troubleshooting: build fails with a type error](troubleshooting.md#t-type-error).

## Field reference

All fields of the `Project` type in `src/content/projects/types.ts`.

| Field | Required | Example | Where it appears | When empty or missing |
|---|---|---|---|---|
| `slug` | required | `"fitnesshub"` | URL `/work/<slug>/`, views | build fails if a view lists a slug that no project has |
| `title` | required | `"FitnessHub"` | home row, /work row, project page heading, browser tab, "Next project", /work search | empty heading |
| `year` | required | `"2026"` | /work Year column, Year filter chip, project page "Year" | empty cell, empty chip |
| `role` | required | `"API design"` | project page "Role" | empty value |
| `type` | required | `"Web platform"` | /work Type column, Type filter chip, project page "Type", home row label if no `category` | empty cell, empty chip |
| `stack` | required | `["PHP", "MySQL"]` | /work Stack column, Stack filter chips, /work search, project page "Stack" | `[]`: empty cell, no chips |
| `category` | optional | `"Gym Management System"` | home row label (right) | `type` is shown |
| `summary` | required | `"A gym management platform..."` | project page description (search results, link previews), /work search | empty description |
| `links.live` | optional | `"https://..."` | project page "Live site" button | button hidden |
| `links.repo` | optional | `"https://github.com/..."` | project page "Repository" button | button hidden; both empty: "Links" hidden |
| `cover` | optional | `"/projects/fitnesshub/cover.svg"` | project page image under the details | no image block |
| `preview` | optional | `"/projects/fitnesshub/preview.svg"` | cursor bubble (mouse) and thumbnail (touch) on home and /work | blue "View" circle, no thumbnail |
| `overview` | optional | text | project page "Overview" | section hidden |
| `whatIBuilt` | optional | list of text | project page "What I built" | section hidden (also when `[]`) |
| `decisions` | optional | `[{ title, body }]` | project page "Key decisions" | section hidden (also when `[]`) |
| `outcome` | optional | text | project page "Outcome" | section hidden |
| `gallery` | optional | list of image paths | project page "Gallery" | section hidden (also when `[]`) |

The number in front of each row (01, 02) is the position in the active view. It is not a field.

## Slug rules

- Lowercase letters `a-z`, digits `0-9` and hyphens `-` only. No spaces, no capitals, no other characters.
- Unique across all projects.
- Name the project file `<slug>.ts` and the image folder `public/projects/<slug>/`.
- Export name: the slug in camelCase (`shop-redesign` becomes `shopRedesign`).
- List each slug at most once per view.

## Filter behavior

The /work filter chips are built from the visible projects in `src/components/work/filters.ts`. Nothing is listed by hand.

- Type chips come from `type`, Stack chips from every `stack` entry, Year chips from `year`.
- Values are compared exactly. `"React"` and `"react"` are two chips. `"Next.js"` and `"NextJS"` are two chips. A trailing space makes a separate chip. Copy existing spellings from other project files.
- Type and Stack chips are sorted A to Z. Year chips are sorted newest first by text, so write years as four digits.
- The small number on a chip is how many visible projects have that value.
- A group with more than 8 chips shows 8 and a "+N more" button.
- Search matches `title`, `summary` and `stack`, ignoring capitals.
- Within a group, chips combine with OR. Across groups, with AND. Search combines with AND.

## The project template

The file `docs/templates/project-template.ts.txt` is a complete project with every field and a comment on each. It has the `.txt` extension so it is not compiled. Copy it as in step 2 of [Add a project (with images)](#add-a-project-with-images). The copy must end in `.ts`.

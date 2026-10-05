# Troubleshooting

Use this when: something does not build, does not show, or looks wrong.
Time: about 5 to 15 minutes per problem.

Find the symptom in the left column. Each row has an id other docs link to.

| Symptom | Cause | Fix |
|---|---|---|
| <a id="t-type-error"></a>`npm run build` fails after editing content, with `error TS...` and `Failed to type check.`, or with `Turbopack build failed` | A required field is missing, a value has the wrong type (text without quotes, a list without `[ ]`), a quote or comma is missing, or a name is misspelled | Read the error: it names the file and line ([How to read a build error](#how-to-read-a-build-error)). Compare that line with [docs/projects.md](projects.md#field-reference) or the template `docs/templates/project-template.ts.txt`. Undo the last edit if the error is unclear (Ctrl+Z, save). |
| `npm run build` fails with `views.ts: unknown project slug "..."` | A view lists a slug that no project file has, or the slug is spelled differently | Make the slug in `src/content/views.ts` match the `slug:` in the project file exactly, and check the project is in `src/content/projects/index.ts`. |
| <a id="t-not-appear"></a>A new project does not appear | The project is missing from `src/content/projects/index.ts`, or its slug is not in the view named in `ACTIVE_VIEW` | Do steps 5 and 6 of [Add a project](projects.md#add-a-project-with-images). Restart `npm run dev` (Ctrl+C, then `npm run dev`). |
| A project appears on the home page but not on /work | Both lists come from `getVisibleProjects()`. /work has an active filter or search, or the browser shows a cached /work page | Click "All" on /work. Reload with Ctrl+F5. |
| <a id="t-image-case"></a>An image shows locally but not on the deployed site | The file name or folder differs in capitals from the path in the content file (Windows ignores case, GitHub Pages does not), or the file was not committed | Rename the file to all lowercase and make the content path match it exactly. Run `git status` to check the file is committed, then [deploy](deployment.md#every-later-deployment). |
| An image shows nowhere | The path in the content file does not match a file in `public/`, or the path does not start with `/` | Path `"/projects/shop/cover.jpg"` needs the file `public/projects/shop/cover.jpg`. Fix the path or the file name. |
| <a id="t-no-style"></a>The deployed page has no styling | The repository is not named `YOUR-USERNAME.github.io`, so the site is served under `/<repo>/` | Rename the repository (Settings > General > Repository name) or follow [Repository name and base path](deployment.md#repository-name-and-base-path). |
| <a id="t-404"></a>A route returns 404 after deploying | The project is not in the active view (its page is not built), the URL is misspelled, or the change was not pushed | Check `out/work/<slug>/index.html` exists after `npm run build`. Check the slug in `src/content/views.ts`. Push and wait for a green run. |
| <a id="t-old-content"></a>The deployed site shows old content after a successful run | Browser cache | Reload with Ctrl+F5, or open the page in a private window. Link previews (LinkedIn, WhatsApp) keep their own cache: [media.md](media.md#replace-the-favicon-or-the-share-image). |
| A filter chip is missing | No visible project has that value, or the project is not in the active view | Add the value to a visible project's `type`, `stack` or `year`. Groups with more than 8 chips hide the rest behind "+N more". |
| A filter chip is duplicated | Two projects spell the same value differently (`React` and `react`, a trailing space) | Make the spelling identical in every project file ([Filter behavior](projects.md#filter-behavior)). |
| The sticky footer reveal is broken (footer covers the page or never appears) | `.page` in `src/app/globals.css` lost `background`, `margin-bottom: var(--footer-h)` or `overflow: clip`, or the window is shorter than the footer (then it stays in normal flow on purpose) | Restore those lines ([Sticky reveal footer](design-and-motion.md#sticky-reveal-footer)). |
| "Let’s work together" in the footer stays hidden | The marker `<span data-footer-sentinel aria-hidden="true" />` is missing from the end of `<div className="page">` in `src/app/layout.tsx` | Put the marker back as the last child of that `div` ([Sticky reveal footer](design-and-motion.md#sticky-reveal-footer)). |
| The hamburger circle does not appear | On desktop it shows only after the top bar has scrolled out of view, by design (on phones it is always shown). On a new page: no `<TopBar ... />`, or the path is missing from `hasTopRow` in `src/components/Nav/Nav.tsx` | Scroll down 100px. For a new page, add both ([Navigation colors](design-and-motion.md#navigation-colors-and-blend-mode)). |
| Top-right links are invisible on a new page | The page top is light but the path is not in `onLightTop` in `src/components/Nav/Nav.tsx` | Add the path to `onLightTop`. |
| Text overflows on a phone | A long word (for example a long project title) at a large size | Shorten the text, or add a space. Check at 375px wide: F12, then Ctrl+Shift+M, choose a 375px device. |
| The hero name overflows or does not fill the width | `firstName` or the hero font changed | Re-tune `--name-em`: [Change the first name](design-and-motion.md#change-the-first-name-in-the-hero). |
| <a id="t-water-clipped"></a>The water ball is cut off at the row edges | A parent of the row got `overflow: hidden` or `overflow: clip`, or the row lost `position: relative` | Remove that overflow from the parents of the row (`.item`, `.list`), and keep `position: relative` on `.row` in `Work.module.css` and `ProjectList.module.css` and on `.next` in `NextProject.module.css`. |
| <a id="t-water-missing"></a>The water ball does not appear | The project has a `preview` (it then gets the image card), the device has no fine pointer (touch), or `rowEffect(project)` is missing from the row | Check `preview` in the project file. Check that the row renders `{rowEffect(project)}` (`Work.tsx`) or `effect={rowEffect(project)}` (`ProjectList.tsx`). |
| <a id="t-water-jump"></a>Visible jump when the ball finishes forming | The goo filter changes the core's visible edge; with large `GOO_BLUR` or a strongly negative `GOO_ALPHA_OFFSET` the plain circle that replaces it is a different size | Set `GOO_BLUR` and `GOO_ALPHA_OFFSET` in `src/components/work/waterConfig.ts` back to `8` and `-9`. |
| <a id="t-water-jank"></a>The water ball stutters on a slow machine | The goo filter (blur) is redrawn every frame while forming | Lower `BLOB_COUNT` to `6` or `GOO_BLUR` to `6`, or set `WATER_ENABLED = false`. |
| <a id="t-actions"></a>The Actions run fails | Build error, or Pages not enabled | GitHub > Actions tab > click the red run > click the red job > open the red step. Read it like a local error ([below](#how-to-read-a-build-error)). Run `npm run build` locally; it shows the same error. "Get Pages site failed" or "Not Found" in the deploy job: set Settings > Pages > Source to "GitHub Actions" and click "Run workflow". |
| `npm install` or `npm ci` fails | Node is older than 20.9, or the network failed | Run `node -v`. Install Node 20 LTS or newer from https://nodejs.org, close and reopen VS Code, run `npm install` again. |
| `npm run build` fails with a font download error | `next/font/google` downloads Inter at build time and there is no internet | Connect to the internet and build again. |
| `npm run dev` says port 3000 is in use | Another `npm run dev` is still running | Close the other terminal, or use the address it prints (for example http://localhost:3001). |

## How to read a build error

There are two kinds of error. Both name the file and the line.

A mistake in the writing (missing comma, quote or bracket):

```
Error: Turbopack build failed with 1 error:
./src/content/projects/fitnesshub.ts:11:3
Error: Expected ',', got 'type'
```

1. Look at the line that starts with `./src/`. The numbers are line `11`, column `3`.
2. The output shows the lines around it, with `>` on the reported line. A missing comma is reported where the next field starts, so the comma belongs at the end of the line above (here line 10).

A wrong or missing field:

```
src/content/projects/fitnesshub.ts(6,14): error TS2741: Property 'role' is missing in type ... but required in type 'Project'.
Failed to type check.
```

1. Look at the line that contains `error TS`. The numbers in brackets are line `6`, column `14`.
2. The text after the code says what is wrong: here the field `role` is missing. Add it, or fix its value.

Then run `npm run build` again. Fix one error at a time; the build stops at the first one.

# Architecture

Use this when: you need to know which file builds which page, or how data reaches a component.
Time: about 5 minutes to read.

## Static export

`next.config.ts` sets `output: "export"`, `trailingSlash: true` and `images: { unoptimized: true }`. `npm run build` renders every page to plain HTML, CSS and JavaScript in the folder `out/`. There is no server: GitHub Pages serves the files in `out/` as they are. Every page URL ends with `/` and is a folder with an `index.html` (for example `out/work/index.html`). Only projects in the active view get a page; any other URL shows `out/404.html`.

## Data flow

```
src/content/*.ts                  text, links, image paths (edit these)
src/content/projects/<slug>.ts    one file per project
        |
        v
src/content/projects/index.ts     registry: projects[]
        |
        v
src/content/views.ts              views + ACTIVE_VIEW -> getVisibleProjects()
        |
        v
src/app/**/page.tsx               pages: read content, pass it to components
        |
        v
src/components/**                 render; no text of their own except the "component" rows in docs/content-map.md
        |
        v
npm run build -> out/             static files deployed to GitHub Pages
```

## Routes

| URL | File | Data source |
|---|---|---|
| `/` | `src/app/page.tsx` | `profile.ts`, `about.ts` (`moreLink`), `views.ts`, `work.ts` (`allWorkLabel`) |
| `/work/` | `src/app/work/page.tsx` | `views.ts`, `work.ts`, `profile.ts` |
| `/work/<slug>/` | `src/app/work/[slug]/page.tsx` | `views.ts` (only visible slugs are built), `profile.ts`, `work.ts` (`nextProject`) |
| `/about/` | `src/app/about/page.tsx` | `about.ts`, `profile.ts` |
| `/contact/` | `src/app/contact/page.tsx` | `profile.ts` (`contactLinks`, `contactSection`) |
| any other URL | `src/app/not-found.tsx` | none |

Every page also gets `src/app/layout.tsx`: fonts, metadata defaults from `profile.ts`, the navigation, the page wrapper, the footer and the cursor dot. The favicon is `src/app/icon.svg`.

## Shared pieces

| Piece | File | Used where |
|---|---|---|
| Navigation (top-right links, menu circle) | `src/components/Nav/Nav.tsx` | every page, from `layout.tsx` |
| Fullscreen menu | `src/components/Nav/MenuOverlay.tsx` | opened by the menu circle, from `Nav.tsx` |
| Top bar (name top left linking home, nav sentinel) | `src/components/TopBar/TopBar.tsx` | every page; on the home hero and the 404 page with `sentinel={false}` |
| Page wrapper (`<div className="page">`) | `src/app/layout.tsx`, styles in `src/app/globals.css` (`.page`) | every page |
| Footer (sticky reveal) | `src/components/sections/Footer/Footer.tsx` | every page, from `layout.tsx` |
| Contact section | `src/components/sections/Contact/Contact.tsx` | /contact/ only |
| Project list for /work | `src/components/work/ProjectList.tsx`, `ProjectRow.tsx`, `WorkFilters.tsx`, `filters.ts` | /work/ |
| Project list for the home page | `src/components/sections/Work/Work.tsx` | / |
| Cursor preview (decides per row: image card, or water ball) | `src/components/CursorPreview/CursorPreview.tsx` | home list, /work list, "Next project" |
| Water ball ("View" / "Next project" on rows without a `preview`) | `src/components/work/WaterBall.tsx`, settings in `src/components/work/waterConfig.ts` | rendered inside each such row by `rowEffect(project)` from the cursor preview |
| Cursor dot | `src/components/CursorDot/CursorDot.tsx` | every page, from `layout.tsx` |
| Smooth scrolling and reduced motion | `src/components/LenisProvider.tsx` | wraps every page, from `layout.tsx` |
| Small animation helpers | `src/components/ui/` (`Reveal`, `WordReveal`, `MaskText`, `Hairline`, `Magnetic`, `Arrow`, `Button`) | across pages |

## How views work

`src/content/views.ts` has an object `views` with named lists of slugs and one line `ACTIVE_VIEW`. `getVisibleProjects()` returns the projects of the active view in that order. The home list, /work, the project pages (`generateStaticParams`) and the "Next project" link all call it. A slug in the view that is not in the registry stops the build with `views.ts: unknown project slug "<slug>"`. Nothing in the URL selects a view. Recipes: [docs/projects.md](projects.md#create-a-view-for-a-job-application).

## How filters get their options

`src/components/work/filters.ts` builds the chips from the visible projects: `optionsFor` collects every `type`, every `stack` entry and every `year`, counts them, and sorts them (A to Z, years newest first). `matches` decides which rows show. Exact rules: [docs/projects.md](projects.md#filter-behavior). The filter state is not stored; reloading /work/ clears it.

## Water ball phases

`src/components/work/WaterBall.tsx` draws an SVG layer over its row. One shared `requestAnimationFrame` loop runs only while at least one ball is forming, settled or releasing; it stops when every row is idle.

| Phase | What happens | Duration setting |
|---|---|---|
| FILM | a thin film fades in on the row's bottom line | `FILM_MS` |
| BEAD | the film draws into `BLOB_COUNT` droplets | `BEAD_MS` |
| GATHER | droplets flow to the pointer (spring-smoothed) and merge into the ball under the goo filter; nearest first | `GATHER_MS`, `GATHER_STAGGER_MS` |
| SETTLE | the goo filter is removed; one plain circle settles from 1.1x and follows the pointer; the label fades in | `SETTLE_MS` |
| RELEASE | on leave after SETTLE: the ball drops to the bottom line, flattens into the film and fades | `RELEASE_MS` |

Leaving before SETTLE plays the formation backwards. Re-entering during the backwards play or RELEASE continues from the current state. While active, the row's `<li>` gets `position: relative` and `z-index: 2` so the ball overlaps the neighbouring rows.

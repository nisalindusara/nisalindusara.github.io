# Decisions and rules

Use this when: about to change content or design, to check what must stay true.
Time: about 5 minutes to read.

## Rules

- The About page (`src/content/about.ts`) is the only page that states my full name together with where I live, where I work and that I study Computer Science at the University of Colombo School of Computing.
- No other page states that I am a student or undergraduate, names my college, or gives my location. This includes the page titles and descriptions.
- My age appears nowhere on the site.
- No phone number appears anywhere on the site.
- Copy stays quiet and poetic.
- One animation style: 200 to 500 ms, ease-out (`EASE_OUT` in `src/components/ui/motion.ts`, `--ease-out` in `src/app/globals.css`). The About image reveal (800 ms) and the menu circle (600 ms) are the existing exceptions.
- Every animation respects prefers-reduced-motion ([how](design-and-motion.md#reduced-motion)).
- No GSAP and no new heavy libraries.
- No 3D or WebGL.
- No URL parameters that reveal tailoring. Tailoring is done only with `ACTIVE_VIEW` in `src/content/views.ts`.

## Decisions

| Decision | Reason |
|---|---|
| Static export on GitHub Pages | Free hosting, no server to maintain. |
| Plain CSS (one global file plus CSS Modules) | No build-tool dependency to keep updated. |
| Framer Motion | One library for every animation, with built-in reduced-motion support. |
| Lenis | Smooth scrolling that turns itself off for reduced motion. |
| Switching projects by editing one line in `src/content/views.ts` | Tailoring per job application without any visible sign on the site. |
| Filters built from project data | New `type`, `stack` and `year` values appear as chips without editing a list. |
| SVG goo filter for the water ball (blur, then an alpha threshold) | It merges separate droplets into one liquid shape without a library; it is a few SVG nodes. |
| The goo filter is removed once the ball has formed | A blur filter is redrawn every frame; a plain circle following the pointer costs almost nothing and keeps a crisp edge. |

## Looks like a bug but is intentional

- The top-right links fade out after scrolling and the round menu button appears instead.
- Below 768px wide (phones) there are no top-right links at all; the round menu button is always shown.
- On the 404 page the round menu button shows from the start (its top row is not a nav sentinel).
- The blue cursor dot disappears over links and buttons. On buttons and nav links the blue fill grows out of the spot where the dot was; on leave it shrinks toward the exit point, and only after it is gone does the dot grow in again, directly under the pointer; on the menu circle the fill disappears at once on leave (its blend mode returns immediately).
- On phones and tablets there is no cursor dot and no "View" bubble; rows with a `preview` show a small thumbnail instead.
- The row numbers on /work keep their positions while filtering (02 stays 02 when 01 is filtered out).
- The small counts on filter chips do not change when other filters are active; they count all visible projects.
- A search counts as one active filter in the "Filter" count.
- The filters reset when /work is reloaded.
- The last project in the active view has no "Next project" block.
- The "Next project" link always uses the water ball, even when that project has a `preview` image.
- The film of the water ball is drawn without the goo filter: at `FILM_HEIGHT` 3px the filter's threshold would erase it.
- The hero shows only `firstName`; the full name is in the page heading for screen readers.
- `profile.tagline` is not shown on any page; it lives on in `public/og.png` and `profile.siteDescription`.
- The footer stays in normal page flow (no reveal) when the window is shorter than the footer.
- The footer heading slides in again every time the footer is uncovered, not only the first time.
- "Studying" on /about/ wraps to three lines on a 375px phone.
- Rows on the About facts list with an empty `value` are not shown.
- The sample project `payments-api-design` is in the default view until replaced.
- `--fs-statement` in `src/app/globals.css` is not used.

## Not built on purpose

- No blog.
- No contact form (only email and links).
- No analytics or cookies.
- No CMS; content is edited in `src/content/`.
- No light/dark theme switch.
- No grid view on /work (list only).
- No sitemap or robots file.
- No multiple languages.

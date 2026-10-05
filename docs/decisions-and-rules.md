# Decisions and rules

Use this when: about to change content or design, to check what must stay true.
Time: about 5 minutes to read.

## Rules

- The About page (`src/content/about.ts`) is the only page that states my full name together with where I live, where I work and that I study Computer Science at the University of Colombo School of Computing.
- No other page states that I am a student or undergraduate, names my college, or gives my location. This includes the page titles and descriptions.
- My age appears nowhere on the site.
- No phone number appears anywhere on the site.
- Copy stays quiet and poetic.
- One animation style: 200 to 500 ms, ease-out (`EASE_OUT` in `src/components/ui/motion.ts`, `--ease-out` in `src/app/globals.css`). The About image reveal (800 ms) and the menu circle (600 ms) are exceptions. The home hero wordmark's letters (900 ms each) and the top-left logo and name swap (every 5 s) are exceptions. The intro (about 2 seconds when the fonts load in time, 3.9 seconds at most) and page transitions (about 1 second in total) are exceptions too; the panel moves with `PANEL_EASE` (`[0.76, 0, 0.24, 1]`, in `src/components/transition/config.ts`), not ease-out. Each single step of them takes 150 to 500 ms.
- Every internal link uses `TransitionLink` (`src/components/transition/TransitionLink.tsx`). External links, `mailto:` links, the CV file and same-page `#` links stay plain `<a>` (or `Button`, which picks the right one).
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
| Intro plays once per browser session (sessionStorage `intro-seen`) | It greets a first visit; repeating it on every page load or refresh would make returning visitors wait. A new tab or a new browser session shows it again. |
| Page transitions are a curtain (one panel covers, the label shows, the panel lifts) | The new page loads and settles underneath, so no half-loaded page or layout jump is ever seen, and the intro and transitions share one look. |
| Back and forward skip the panel | The visitor is retracing steps and expects an instant switch, as in any browser. |
| Entrance animations wait for `pageReady` (`useReveal`) | Otherwise they would play underneath the panel and be finished when it lifts. |
| The home hero is one full-width wordmark, "nisal®" | A single word filling the screen is the boldest way to say whose site it is, and it leaves the work directly below. The ® treats the name as a brand, matching the logo. The `<h1>` holds the full name for screen readers. |
| The wordmark uses Urbanist 700, not Inter | Its single-storey "a", circular "o" and round dots read as a logotype at this size; Inter stays for all other text. It is a Google font loaded with `next/font`, so it adds no package. |
| A click on the wordmark reveals a photo, with the slice look spreading from the click point | The hover effect hints that the word can break apart; the click follows through and shows the person behind the name. Reusing the bands keeps one visual language and needs no image effects library. |
| The hover effect is DOM bands with `clip-path`, not WebGL or a canvas | The rest state is real, crisp text that needs no script; the effect only adds hidden copies of the word. No new library, no 3D. |
| The logo is an N, I and P monogram with a blue dot | One shape carries all three initials (the N's right stem is the I and the P's stem). The blue dot is a full stop in the same `--cursor-blue` as the cursor dot and the ball on project rows, so the mark ties the site's blue together. It is an inline SVG in `currentColor`, so one file works on light and dark pages. |
| The top left swaps between the logo and "Nisal Indusara" | The logo alone does not say whose site it is; the name alone is not a mark. Taking turns teaches the visitor that the mark means the name. |
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
- The intro shows only on the first visit in a browser session; a refresh or a link inside the site does not show it again.
- Back and forward buttons switch pages without the panel and start at the top of the page.
- Ctrl/Cmd/Shift/Alt-click, middle-click and links to the page you are on navigate without the panel.
- The page transition panel shows "Contact" for /contact/ and the name for pages without a label (404).
- The hero shows "nisal", and the top left and the browser tab titles show "Nisal Indusara", while the intro, the footer and the share image show "Nisal Paranawithana" (`profile.name`).
- `profile.tagline` is not shown on any page; it lives on in `public/og.png` and `profile.siteDescription`.
- The hero wordmark breaks apart only while the mouse moves over it; a still pointer leaves it whole. Phones, tablets and reduced motion get no effect.
- The hero is not a full screen tall: it ends below the wordmark, and the About section follows directly.
- The hero photo has no hover effect; only the wordmark breaks apart on hover. Clicks during a reveal are ignored until it ends.
- The hero photo is cropped to the wordmark's box (about 2.3:1), not shown at its own shape.
- The hero always opens on the wordmark, also after visiting another page; the photo is never remembered.
- With the keyboard (Enter on the wordmark button) the reveal starts from the centre, as there is no click point.
- The role line in the hero's top row shows only from 1024px wide; below that the row holds the logo and the menu circle.
- Text in the home hero cannot be selected: dragging across the wordmark highlights nothing. Screen readers still read the full name.
- The top-left logo and name keep swapping while the visitor reads; the swap stops only while the pointer is on it, it has keyboard focus, or the tab is hidden.
- Every page opens on the logo, also after a page transition; the name comes after `BRAND_SWAP_MS`.
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

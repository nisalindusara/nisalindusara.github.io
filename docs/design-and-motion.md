# Design and motion

Use this when: changing colors, fonts, spacing, animation speed, or turning an animation off.
Time: about 15 minutes.

## CSS variables

Global variables are in `src/app/globals.css` under `:root`. Below 768px wide, `--pad`, `--radius`, `--nav-top` and `--nav-circle` get the smaller values from the `@media (max-width: 767px)` block in the same file.

| Variable | File | What it controls |
|---|---|---|
| `--bg` | `src/app/globals.css` | Dark page background (page wrapper, About page) |
| `--bg-deep` | `src/app/globals.css` | Black behind everything, home About section, Contact page top bar |
| `--text` | `src/app/globals.css` | Light text on dark pages |
| `--text-muted` | `src/app/globals.css` | Dimmed text: small labels, project page labels, About labels |
| `--surface` | `src/app/globals.css` | Light gray card on /contact/ |
| `--line` | `src/app/globals.css` | Hairlines on dark pages |
| `--bg-soft` | `src/app/globals.css` | Footer and fullscreen menu background, image frames on /about/ |
| `--accent` | `src/app/globals.css` | Blue: cursor dot, nav hover circles, menu circle fill, footer button fill, "Get in touch", menu close button, "View" label on image bubbles |
| `--cursor-blue` | `src/app/globals.css` | The dot in the logo, and the blue ball on rows of projects without a `preview` and on "Next project" |
| `--hero-bg` | `src/app/globals.css` | Light background of the home hero and /work |
| `--hero-text` | `src/app/globals.css` | Dark text on the home hero and /work, dark nav links there |
| `--pad` | `src/app/globals.css` | Side padding of the page (40px, 20px below 768px) |
| `--radius` | `src/app/globals.css` | Rounded corners of page sections (28px, 20px below 768px) |
| `--ease-out` | `src/app/globals.css` | Easing curve of all CSS transitions |
| `--fs-tiny`, `--fs-small`, `--fs-body`, `--fs-lead`, `--fs-h2` | `src/app/globals.css` | Shared font sizes |
| `--fs-statement` | `src/app/globals.css` | Not used by any rule |
| `--nav-top`, `--nav-circle` | `src/app/globals.css` | Position of the top bar and size of the menu circle and close button |
| `--about-image-filter` | `src/app/globals.css` | Gray filter on /about/ photos ([media.md](media.md#turn-the-gray-filter-off-or-on)) |
| `--footer-h` | `src/app/globals.css` | Set by code, do not edit (see [Sticky reveal footer](#sticky-reveal-footer)) |
| `--work-bg`, `--work-text`, `--work-muted`, `--work-line` | `src/components/sections/Work/Work.module.css` | White "Selected work" section on the home page |
| `--ink`, `--paper`, `--hair`, `--muted` | `src/app/work/page.module.css` | Colors of the /work page (from `--hero-text` and `--hero-bg`) |
| `--ink` | `src/components/sections/Contact/Contact.module.css` | Near-black text on /contact/ |
| `--footer-bg`, `--cta-bg`, `--cta-size` | `src/components/sections/Footer/Footer.module.css` | Footer background, "Get in touch" color and size |
| `--fill`, `--fill-text` | each element with class `fill-hover` | Hover fill color and text color (global rule in `src/app/globals.css`) |
| `--word-em` | `src/components/sections/Hero/Hero.module.css` | Size of the hero wordmark (see [Change the hero word](#change-the-hero-word)) |

## Change the palette

1. Open `src/app/globals.css`.
2. Change the hex values in `:root`. Keep text and background contrast high (dark text on `--hero-bg`, light text on `--bg`).
3. The white home Work section has its own colors in `src/components/sections/Work/Work.module.css` (`--work-bg`, `--work-text`).
4. The theme color of the mobile browser bar is `themeColor: "#0a0a0a"` in `src/app/layout.tsx`.
5. Run `npm run dev` and check /, /work/, /about/, /contact/ and one project page.

Done when: all five pages show the new colors and all text is readable.

## Change a font

The site has three fonts, all set in `src/app/layout.tsx`:

| Font | Variable | Used for |
|---|---|---|
| Inter (Google Fonts, `next/font/google`) | `--font-inter` | All text, set on `body` in `src/app/globals.css` |
| Urbanist 700 (Google Fonts, `next/font/google`) | `--font-urbanist` | Home hero wordmark (`.wordmark` in `src/components/sections/Hero/Hero.module.css`); after replacing it, re-measure `--word-em` ([Change the hero word](#change-the-hero-word)) |
| Nimbus Sans (`src/fonts/NimbusSans-Regular.otf`) | `--font-nimbus` | Home About statement (`src/components/sections/About/About.module.css`) |

Replace Inter with another Google font:

1. In `src/app/layout.tsx`, change `import { Inter } from "next/font/google";` to the new font, for example `import { DM_Sans } from "next/font/google";`.
2. Change `const inter = Inter({` to `const inter = DM_Sans({`. Keep `variable: "--font-inter"`, so no CSS changes.
3. Run `npm run build` (the build downloads the font; it needs internet).

Replace a local font:

1. Put the new file (`.woff2` preferred) in `src/fonts/`.
2. In `src/app/layout.tsx`, change the `src` of `nimbus` to the new file name. Keep the `variable` value.
3. Nimbus Sans is AGPL-licensed with a font exception (`src/fonts/NimbusSans-LICENSE.txt`). Delete that license file when the font is removed.

## Home hero

The home hero is `src/components/sections/Hero/Hero.tsx`, modelled on a studio wordmark layout: a row of small text at the top and one word across the full width below it.

- Top row: the logo on the left (`TopBar`), then, from 1024px wide, the role line `profile.heroRole` (lowercase), and the global nav links on the right.
- Text in the hero cannot be selected or highlighted (`user-select: none` on `.hero` in `Hero.module.css`); delete those two lines to allow it again.
- Wordmark: `profile.heroWord` ("nisal") with a small ® at its top right, in Urbanist 700, from the left page margin to the right one (`src/components/sections/Hero/Wordmark.tsx`). It is inside the page's only `<h1>`, which gives screen readers `profile.fullName`.
- Height: the hero ends below the wordmark (it is not a full screen tall); the About section follows and slides over it.

Texts: [content-map.md](content-map.md#home-page-).

Wordmark type (`.wordmark` in `src/components/sections/Hero/Hero.module.css`): Urbanist 700, letter-spacing `-0.02em`, line-height `0.82`, font size = content width / `--word-em`. The ® is `0.17em`.

Entrance: each letter slides up from below the line, one after another (`NAME_STAGGER_S` apart), ease-out.

Slice effect (mouse only, from `heroConfig.ts`): the word is cut into `SLICE_COUNT` horizontal bands. While the mouse moves over the word, the bands near the pointer's height are pushed sideways by the pointer's speed, inside a short window around the pointer (a random width per band between `SLICE_WIDTH_MIN` and `SLICE_WIDTH_MAX` of the word's width). Most bands move with the pointer, some against it, and each band picks a new width and direction every `SLICE_SHUFFLE_MS`, so the letters there break into stair-steps. When the pointer stops or leaves, the bands slide back and disappear. Each band is a copy of the word on the hero background, so the word at rest is plain text.

| Setting | Default | What it changes |
|---|---|---|
| `NAME_LETTER_S` | `0.9` | Seconds each letter takes to slide up |
| `NAME_STAGGER_S` | `0.06` | Seconds between the starts of neighbouring letters |
| `SLICE_ENABLED` | `true` | `false`: no hover effect, and the band copies are not rendered |
| `SLICE_COUNT` | `18` | Number of horizontal bands; more bands give finer steps |
| `SLICE_GAIN` | `2.4` | px a band moves per px of pointer speed per frame; higher breaks the word more |
| `SLICE_MAX_PX` | `110` | Largest sideways shift of a band, px |
| `SLICE_SPREAD` | `0.3` | How many bands react above and below the pointer, as a share of the word's height; higher reaches more bands |
| `SLICE_WIDTH_MIN`, `SLICE_WIDTH_MAX` | `0.06`, `0.24` | Width of the broken window around the pointer, as a share of the word's width |
| `SLICE_SHUFFLE_MS` | `110` | ms between new widths and directions while moving; lower is more jittery |
| `SLICE_FOLLOW` | `0.28` | Share of the remaining distance a band covers per frame (0 to 1); higher is snappier |
| `SLICE_DECAY` | `0.88` | Share of the pointer speed kept per frame after the pointer stops (0 to 1); higher settles more slowly |

The effect runs only on devices with hover and a fine pointer, and not with reduced motion. Its animation loop runs only while bands are moving and stops by itself.

### Change the hero word

The wordmark fills the width because its font size is the content width divided by `--word-em` in `src/components/sections/Hero/Hero.module.css`: the ink width of the word plus the ® per 1em of font size. For "nisal" in Urbanist 700 it is `2.03`.

1. Change `heroWord` in `src/content/profile.ts`. Keep it one short word.
2. Run `npm run dev` and open http://localhost:3000/ at full window width.
3. If the ® sticks out past the right margin (the right edge of the "Contact" link above it), increase `--word-em` by 0.05. If it stops short, decrease it by 0.05.
4. Repeat until the ® ends at the right margin. Check again at 375px wide in the browser's device toolbar (F12, then Ctrl+Shift+M).

Done when: the word runs from the left margin to the right margin with no horizontal scrollbar.

The left edge: `margin-left: -0.05em` on `.mask` and `.bandInner` pulls the first letter's ink onto the margin. A first letter with a different side bearing needs a different value; change both to the same number.

## Logo

The logo is `src/components/Logo/Logo.tsx`: an N whose right stem is also the I and the stem of the P (Nisal Indusara Paranawithana), followed by a blue dot, a full stop. It is an inline SVG in `currentColor`, so it is dark on the light pages (home, /work) and light on the dark pages. The dot is `--cursor-blue`.

Where it shows: top left on every page, in the row with the top-right links (`src/components/TopBar/TopBar.tsx`). It links to the home page; screen readers hear `profile.fullName`, "home".

Swap: the logo and the name `profile.brandName` ("Nisal Indusara") take turns in that spot (`src/components/TopBar/BrandSwap.tsx`). The outgoing one slides up and out of a mask the size of the slot. Then the name slides up into it from below, or the logo draws itself in: the N wipes up, the P's bowl draws itself and the blue dot springs in (timings in `Logo.tsx`). On page load the logo is shown without the draw-in. A page always opens on the logo. The swap pauses while the pointer is on the link or the link has keyboard focus, and while the browser tab is hidden.

| Setting (`src/components/TopBar/brandConfig.ts`) | Default | What it changes |
|---|---|---|
| `BRAND_SWAP_MS` | `5000` | ms each state (logo, then name) stays before the swap |
| `BRAND_IN_S` | `0.5` | Seconds the name takes to slide up from below |
| `BRAND_OUT_S` | `0.3` | Seconds the outgoing state takes to slide up and out; the incoming one starts after it |

Sizes (`src/components/TopBar/TopBar.module.css`): logo height `clamp(22px, 2vw, 30px)` (`.logoSlot`), name `clamp(14px, 1.4vw, 20px)` (`.nameSlot`).

Stop the swap (logo only): in `src/components/TopBar/BrandSwap.tsx`, change `{showLogo || reduce ? (` to `{true ? (`. Show only the name instead: change it to `{false ? (`.

Change the logo's shape: edit the path data `N` and `P_BOWL` and the `<circle>` in `Logo.tsx`. The view box is 40 x 28 and the strokes are 3 units wide. The favicon `src/app/icon.svg` uses the same path data; copy the change there too.

## Animation settings

| What | File | Setting |
|---|---|---|
| Easing of all Framer Motion animations | `src/components/ui/motion.ts` | `EASE_OUT = [0.22, 1, 0.36, 1]` |
| Fade-up of blocks (`Reveal`) | `src/components/ui/motion.ts` | `DURATION = 0.5` (seconds) |
| Easing of all CSS transitions | `src/app/globals.css` | `--ease-out` |
| Hero wordmark entrance and slice effect | `src/components/sections/Hero/heroConfig.ts` | every number; see [Home hero](#home-hero) |
| Top-left logo and name swap | `src/components/TopBar/brandConfig.ts` | every number; see [Logo](#logo) |
| Word-by-word statements | `src/components/ui/WordReveal.tsx` | `staggerChildren: 0.025`, `duration: 0.45` |
| Masked labels | `src/components/ui/MaskText.tsx` | `duration: 0.5` |
| Hairlines drawing in | `src/components/ui/Hairline.tsx` | `duration: 0.6` |
| /work headline | `src/components/work/WorkHeader.tsx` | `duration: 0.65` |
| /work rows | `src/components/work/ProjectRow.tsx`, `ProjectList.tsx` | enter `0.4`, exit `0.25`, first-load stagger `i * 0.05` |
| /contact/ links | `src/components/sections/Contact/Contact.tsx` | `duration: 0.6`, `staggerChildren: 0.08` |
| Footer "Let’s work together" slide-up | `src/components/sections/Footer/Footer.tsx` | `duration: 0.65`, second line `delay: 0.1`; starts when about a third of the footer is uncovered |
| Nav links and menu circle | `src/components/Nav/Nav.tsx` | `fade` 0.35s, `pop` 0.6s |
| Fullscreen menu open and close | `src/components/Nav/MenuOverlay.tsx` | `0.6` open, `0.45` close |
| Menu item letter roll | `src/components/Nav/MenuOverlay.module.css` | `550ms`, `25ms` per letter |
| About images reveal | `src/components/about/RevealImage.tsx` | `reveal = { duration: 0.8 }`, parallax `[-30, 30]` px |
| Hover fill on buttons and nav links (grows out of the cursor dot) | `src/components/CursorDot/CursorDot.tsx` | `FILL_MS = 500` (grow), `LEAVE_MS = 350` (shrink back; the dot then grows in under the pointer), easing from `EASE_OUT` |
| Same fill without a mouse (keyboard focus) | `src/app/globals.css` (`.fill-hover::before`), `src/components/Nav/Nav.module.css` (`.link::before`) | `500ms`, `350ms` |
| Cursor bubble spring | `src/components/CursorPreview/CursorPreview.tsx` | `stiffness: 300, damping: 30, mass: 0.6` |
| Cursor dot spring | `src/components/CursorDot/CursorDot.tsx` | `stiffness: 600, damping: 40, mass: 0.4` |
| Magnetic hover (nav links, menu circle, footer buttons) | `src/components/ui/Magnetic.tsx` | `STRENGTH = 0.5`, `MAX_OFFSET = 30` px, spring `STIFFNESS = 200`, `DAMPING = 20` |
| Smooth scrolling | `src/components/LenisProvider.tsx` | `new Lenis({ duration: 1.1 })` |
| Intro and page transitions | `src/components/transition/config.ts` | every number; see [Intro and page transitions](#intro-and-page-transitions) |

Change a speed: edit the number. Durations in `.tsx` files are seconds; in `.css` files milliseconds; in `config.ts` and `waterConfig.ts` milliseconds (the names end in `_MS`).

Entrance animations start only when the page is ready (no intro or transition panel over it): `useReveal` in `src/components/ui/useReveal.ts` gates them.

## Turn off one animation

- Entrance animation of a Framer Motion element: replace its `initial={...}` with `initial={false}` and its `animate={play ? ... : ...}` with the shown state alone (for example `animate={{ opacity: 1, y: 0 }}`). The element then shows in its final state.
- Intro: in `src/app/layout.tsx`, delete the line `<script dangerouslySetInnerHTML={{ __html: introScript }} />`. Page transitions stay.
- CSS hover animation: delete the `transition:` line of that rule.
- Smooth scrolling: in `src/components/LenisProvider.tsx`, delete the line `if (!query.matches) start();`. Native scrolling is then used everywhere.
- Cursor dot: in `src/app/layout.tsx`, delete the line `<CursorDot />`. The hover fills then grow from the center (the CSS fallback) instead of out of the dot.
- Magnetic hover: in `src/components/ui/Magnetic.tsx`, change `MAX_OFFSET = 30` to `MAX_OFFSET = 0`.

## Reduced motion

When the visitor's system has "reduce motion" turned on:

- `MotionConfig reducedMotion="user"` in `src/components/LenisProvider.tsx` makes Framer Motion skip movement; opacity fades stay.
- Lenis is not started; native scrolling is used.
- `src/app/globals.css` sets every CSS transition and animation to 0.01ms.
- About images show at once, without clip-path or parallax (`RevealImage.tsx`).
- The fullscreen menu fades instead of the circle reveal (`MenuOverlay.tsx`).
- Home hero: the wordmark's letters fade in instead of sliding up, and the slice effect is off.
- Top left: the logo stays; it does not swap with the name and does not draw itself in.
- Cursor bubble and dot follow the mouse without a spring; magnetic hover is off.
- The water ball has no film, droplets or goo: it fades in at the pointer in 150ms, follows it, and fades out in 150ms.
- No intro and no page transition panel: the inline script does not set `data-intro`, and `TransitionLink` navigates like a normal link.

Test it in Chrome: F12, Ctrl+Shift+P, type "Emulate CSS prefers-reduced-motion", choose "reduce".

## Water ball

On rows of projects without a `preview` image (home list, /work, and "Next project"), a blue ball labelled "View" forms at the pointer. Component: `src/components/work/WaterBall.tsx`. Every number is in `src/components/work/waterConfig.ts`. It runs only with a mouse (`hover: hover` and `pointer: fine`).

Phases on pointer enter: FILM (a thin film fades in on the row's bottom line), BEAD (it draws into droplets), GATHER (the droplets flow to the pointer and merge into the ball, which overshoots to 1.1x), SETTLE (one plain circle remains, the label fades in, the ball follows the pointer). On leave: before SETTLE the formation plays backwards; after it, RELEASE drops the ball onto the bottom line, flattens it into the film and fades it out. With the defaults the formation takes 900 ms.

| Setting | Default | What it changes |
|---|---|---|
| `WATER_ENABLED` | `true` | `false`: a plain circle fades in at the pointer instead |
| `TIME_SCALE` | `1` | Multiplies every duration; `5` is slow motion |
| `BALL_RADIUS` | `48` | Radius of the finished ball, px |
| `BLOB_COUNT` | `9` | Number of droplets |
| `BLOB_START_R` | `2` | Droplet radius in the film, px |
| `BLOB_BEAD_R` | `14` | Droplet radius after beading, px |
| `FILM_HEIGHT` | `3` | Film thickness, px |
| `FILM_MS` | `100` | Film fade-in |
| `BEAD_MS` | `220` | Film turning into droplets |
| `GATHER_MS` | `340` | One droplet's trip to the ball |
| `GATHER_STAGGER_MS` | `120` | Extra delay for the farthest droplet (nearest leave first) |
| `SETTLE_MS` | `120` | Ball settling from 1.1x to 1x, label fading in |
| `RELEASE_MS` | `350` | Ball dropping back into the film; also the longest backwards play |
| `GOO_BLUR` | `8` | How far apart droplets start to merge |
| `GOO_ALPHA_MULT` | `20` | Edge sharpness of merged droplets |
| `GOO_ALPHA_OFFSET` | `-9` | Droplet thickness; more negative is thinner |
| `FOLLOW_STIFFNESS`, `FOLLOW_DAMPING` | `220`, `24` | Spring that moves the ball toward the pointer |

Tuning:

| I want it | Change in `waterConfig.ts` |
|---|---|
| more watery | `GOO_BLUR` to `10`, `BLOB_COUNT` to `12` |
| faster | `TIME_SCALE` to `0.7` |
| bigger ball | `BALL_RADIUS` to `60` |
| see it in slow motion | `TIME_SCALE` to `5` (set back to `1` before deploying) |

Turn it off: set `WATER_ENABLED = false` (plain fading circle). Rows with a `preview` image always use the image card instead.

## Intro and page transitions

One full-screen panel (`src/components/transition/Panel.tsx`) is the first-visit intro and the curtain between pages. The intro shows the name; a transition shows the destination's label. State flow and files: [architecture.md](architecture.md#intro-and-page-transitions).

Settings, all in `src/components/transition/config.ts` (milliseconds unless noted):

| Setting | Value | What it controls | Change it |
|---|---|---|---|
| `INTRO_MIN_MS` | `1000` | shortest intro, counted from the start of the page load | lower for a quicker intro; `0` ends it as soon as the fonts are in |
| `INTRO_MAX_MS` | `3000` | the intro ends by then even if the fonts are still loading | keep it at or below `FAILSAFE_MS - SETTLE_MS - HOLD_MS - REVEAL_MS` (3100) |
| `LOOP_PERIOD_MS` | `1400` | one opacity wave of a letter while the intro waits | higher is a slower wave |
| `LOOP_STAGGER_MS` | `60` | delay between neighbouring letters' waves | `0` makes all letters pulse together |
| `LOOP_MIN_OPACITY` | `0.3` | lowest letter opacity in the wave (0 to 1) | `1` turns the wave off |
| `SETTLE_MS` | `250` | letters go to full opacity before the lift | higher is a slower settle |
| `HOLD_MS` | `150` | pause on the full name before the lift | `0` lifts at once |
| `COVER_MS` | `400` | panel rises from below to cover the page | higher is a slower cover |
| `LABEL_IN_MS` | `300` | destination label slides up from its mask | higher is a slower slide |
| `LABEL_HOLD_MIN_MS` | `400` | shortest time the label stays once in | higher keeps the label longer |
| `REVEAL_MS` | `500` | panel exits upward (intro and transitions) | higher is a slower lift |
| `ROUTE_TIMEOUT_MS` | `2000` | the panel reveals even if the new page has not arrived | higher waits longer on a slow connection |
| `PANEL_EASE` | `[0.76, 0, 0.24, 1]` | easing (cubic-bezier) of the panel's cover and reveal movement | any four numbers, as in CSS `cubic-bezier()` |
| `FAILSAFE_MS` | `4000` | CSS-only safety net: a pending intro panel hides itself after this, even without a working script | keep it above the longest intro (`INTRO_MAX_MS + SETTLE_MS + HOLD_MS + REVEAL_MS` = 3900) |

A transition takes `COVER_MS + LABEL_IN_MS + LABEL_HOLD_MIN_MS + REVEAL_MS` = 1600 ms when the page loads in time.

The panel text uses the site font (Inter), weight 400, `clamp(32px, 6vw, 88px)`, in `Panel.module.css`. Below 601px wide the name is on two lines.

Labels shown during a transition (`getTransitionLabel` in `src/content/transitions.ts`):

| Destination | Label |
|---|---|
| `/` | Home |
| `/work/` | Work |
| `/about/` | About |
| `/contact/` | Contact |
| `/work/<slug>/` | that project's `title` |
| any other path | Nisal Paranawithana (`introName`) |

See the intro again: delete the `intro-seen` key under DevTools (F12) > Application > Session Storage > the site's address, then reload. Or open the site in a private window.

Turn the intro off: [Turn off one animation](#turn-off-one-animation).

## Fragile areas

### Sticky reveal footer

How it works: `src/components/sections/Footer/Footer.tsx` measures the footer height and writes it to `--footer-h`. The page wrapper `.page` in `src/app/globals.css` has `margin-bottom: var(--footer-h)`, `z-index: 1`, a solid `background` and `overflow: clip`. The footer is `position: fixed` with `z-index: 0` behind it (`.footer[data-fixed="true"]` in `Footer.module.css`).

The footer heading slide is started by an invisible marker `<span data-footer-sentinel />` at the end of the page wrapper in `src/app/layout.tsx`. Keep it as the last child of `.page`, or the heading stays hidden.

Breaks when: `.page` loses its background (the footer shows through), `overflow: clip` is removed (rounded corners disappear over white sections), or `margin-bottom` is removed (the footer is never revealed). A footer taller than the window stays in normal flow on purpose.

### Navigation colors and blend mode

Below 768px wide there are no top-right links: `useIsMobile` in `Nav.tsx` always shows the menu circle, and `.bar` is hidden by a `@media (max-width: 767px)` rule in `Nav.module.css`. Change both together.

How it works: in `src/components/Nav/Nav.tsx`, top-right links use dark text when `onLightTop` is true (paths `/` and `/work`) and light text elsewhere. The menu circle sits in `.circleBar`, which has `mix-blend-mode: difference` so it is visible on light and dark sections. While hovered, the blend turns off so the fill shows as true blue.

Breaks when: a new page with a light top is not added to `onLightTop` (links become invisible), the circle is moved into `.bar`, or a parent of `.circleBar` gets `transform`, `filter` or `isolation` (the blend stops working). A new page needs `<TopBar name={profile.name} />` (it marks the row with `data-nav-sentinel`) and an entry in `hasTopRow` in `Nav.tsx`, or it shows only the circle. `sentinel={false}` turns the marker off (home hero, 404). Link to a new page with `TransitionLink` (`src/components/transition/TransitionLink.tsx`), never with `next/link` or a plain `<a>`.

### Fullscreen menu clip-path

How it works: `openMenu` in `Nav.tsx` stores the center of the menu circle. `MenuOverlay.tsx` grows a `clip-path: circle(...)` from that point. The close button uses the same `--nav-top` and `--nav-circle` as the circle, and `scrollbar-gutter: stable` on `html` keeps it from shifting when scrolling is locked.

Breaks when: `--nav-top` or `--nav-circle` change in only one place, `scrollbar-gutter` is removed (the X jumps sideways), or the overlay `z-index: 70` drops below the nav (`60`).

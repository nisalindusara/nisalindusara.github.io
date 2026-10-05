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
| `--cursor-blue` | `src/app/globals.css` | Blue circle bubble on list rows of projects without a `preview`, and "Next project" |
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
| `--name-em` | `src/components/sections/Hero/Hero.module.css` | Size of the hero name (see [Change the first name](#change-the-first-name-in-the-hero)) |

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
| Nimbus Sans (`src/fonts/NimbusSans-Regular.otf`) | `--font-nimbus` | Home About statement (`src/components/sections/About/About.module.css`) |
| Zodiak (`src/fonts/Zodiak-Regular.woff2`) | `--font-zodiak` | Hero name (`src/components/sections/Hero/Hero.module.css`) |

Replace Inter with another Google font:

1. In `src/app/layout.tsx`, change `import { Inter } from "next/font/google";` to the new font, for example `import { DM_Sans } from "next/font/google";`.
2. Change `const inter = Inter({` to `const inter = DM_Sans({`. Keep `variable: "--font-inter"`, so no CSS changes.
3. Run `npm run build` (the build downloads the font; it needs internet).

Replace a local font:

1. Put the new file (`.woff2` preferred) in `src/fonts/`.
2. In `src/app/layout.tsx`, change the `src` of `nimbus` or `zodiak` to the new file name. Keep the `variable` value.
3. Nimbus Sans is AGPL-licensed with a font exception (`src/fonts/NimbusSans-LICENSE.txt`). Delete that license file when the font is removed.
4. After replacing Zodiak, re-tune the hero name: [Change the first name](#change-the-first-name-in-the-hero).

## Change the first name in the hero

The hero shows `profile.firstName` from `src/content/profile.ts` across the full width. The size comes from `--name-em` in `src/components/sections/Hero/Hero.module.css`: the width of the word per 1em of font size, measured for "NISAL" in Zodiak (3.07).

1. Change `firstName` in `src/content/profile.ts`.
2. Run `npm run dev` and open http://localhost:3000/ at full window width.
3. If the name sticks out past the right margin, increase `--name-em` by 0.1. If it stops short, decrease it by 0.1.
4. Repeat until the last letter ends at the right margin (the right edge of the text above it). Check again at 375px wide in the browser's device toolbar (F12, then Ctrl+Shift+M).

Done when: the name fills the width with no horizontal scrollbar.

## Animation settings

| What | File | Setting |
|---|---|---|
| Easing of all Framer Motion animations | `src/components/ui/motion.ts` | `EASE_OUT = [0.22, 1, 0.36, 1]` |
| Fade-up of blocks (`Reveal`) | `src/components/ui/motion.ts` | `DURATION = 0.5` (seconds) |
| Easing of all CSS transitions | `src/app/globals.css` | `--ease-out` |
| Hero name slide-up | `src/components/sections/Hero/Hero.tsx` | `duration: 0.65` |
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
| Hover fill on buttons | `src/app/globals.css` (`.fill-hover::before`) | `600ms` |
| Nav link hover circle | `src/components/Nav/Nav.module.css` (`.link::before`) | `350ms` |
| Cursor bubble spring | `src/components/CursorPreview/CursorPreview.tsx` | `stiffness: 300, damping: 30, mass: 0.6` |
| Cursor dot spring | `src/components/CursorDot/CursorDot.tsx` | `stiffness: 600, damping: 40, mass: 0.4` |
| Magnetic hover | `src/components/ui/Magnetic.tsx` | `SPRING`, and `max` per use in `Nav.tsx` and `Footer.tsx` |
| Smooth scrolling | `src/components/LenisProvider.tsx` | `new Lenis({ duration: 1.1 })` |

Change a speed: edit the number. Durations in `.tsx` files are seconds; in `.css` files milliseconds.

## Turn off one animation

- Entrance animation of a Framer Motion element: replace its `initial={...}` with `initial={false}`. The element then shows in its final state.
- CSS hover animation: delete the `transition:` line of that rule.
- Smooth scrolling: in `src/components/LenisProvider.tsx`, delete the line `if (!query.matches) start();`. Native scrolling is then used everywhere.
- Cursor dot: in `src/app/layout.tsx`, delete the line `<CursorDot />`.
- Magnetic hover: in `src/components/ui/Magnetic.tsx`, change `max = 6` to `max = 0`. Uses that pass `max={...}` (in `Nav.tsx`, `Footer.tsx`) need `max={0}` too.

## Reduced motion

When the visitor's system has "reduce motion" turned on:

- `MotionConfig reducedMotion="user"` in `src/components/LenisProvider.tsx` makes Framer Motion skip movement; opacity fades stay.
- Lenis is not started; native scrolling is used.
- `src/app/globals.css` sets every CSS transition and animation to 0.01ms.
- About images show at once, without clip-path or parallax (`RevealImage.tsx`).
- The fullscreen menu fades instead of the circle reveal (`MenuOverlay.tsx`).
- Cursor bubble and dot follow the mouse without a spring; magnetic hover is off.

Test it in Chrome: F12, Ctrl+Shift+P, type "Emulate CSS prefers-reduced-motion", choose "reduce".

## Fragile areas

### Sticky reveal footer

How it works: `src/components/sections/Footer/Footer.tsx` measures the footer height and writes it to `--footer-h`. The page wrapper `.page` in `src/app/globals.css` has `margin-bottom: var(--footer-h)`, `z-index: 1`, a solid `background` and `overflow: clip`. The footer is `position: fixed` with `z-index: 0` behind it (`.footer[data-fixed="true"]` in `Footer.module.css`).

The footer heading slide is started by an invisible marker `<span data-footer-sentinel />` at the end of the page wrapper in `src/app/layout.tsx`. Keep it as the last child of `.page`, or the heading stays hidden.

Breaks when: `.page` loses its background (the footer shows through), `overflow: clip` is removed (rounded corners disappear over white sections), or `margin-bottom` is removed (the footer is never revealed). A footer taller than the window stays in normal flow on purpose.

### Navigation colors and blend mode

Below 768px wide there are no top-right links: `useIsMobile` in `Nav.tsx` always shows the menu circle, and `.bar` is hidden by a `@media (max-width: 767px)` rule in `Nav.module.css`. Change both together.

How it works: in `src/components/Nav/Nav.tsx`, top-right links use dark text when `onLightTop` is true (paths `/` and `/work`) and light text elsewhere. The menu circle sits in `.circleBar`, which has `mix-blend-mode: difference` so it is visible on light and dark sections. While hovered, the blend turns off so the fill shows as true blue.

Breaks when: a new page with a light top is not added to `onLightTop` (links become invisible), the circle is moved into `.bar`, or a parent of `.circleBar` gets `transform`, `filter` or `isolation` (the blend stops working). A new page needs `<TopBar name={profile.name} />` (it marks the row with `data-nav-sentinel`) and an entry in `hasTopRow` in `Nav.tsx`, or it shows only the circle. `sentinel={false}` turns the marker off (home hero, 404).

### Fullscreen menu clip-path

How it works: `openMenu` in `Nav.tsx` stores the center of the menu circle. `MenuOverlay.tsx` grows a `clip-path: circle(...)` from that point. The close button uses the same `--nav-top` and `--nav-circle` as the circle, and `scrollbar-gutter: stable` on `html` keeps it from shifting when scrolling is locked.

Breaks when: `--nav-top` or `--nav-circle` change in only one place, `scrollbar-gutter` is removed (the X jumps sideways), or the overlay `z-index: 70` drops below the nav (`60`).

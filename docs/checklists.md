# Checklists

Use this when: before deploying, after changing the intro or transitions, after adding a project, or before sending the link to an employer.
Time: about 10 minutes per checklist.

## Before every deploy

- [ ] `npm run build` ends without errors.
- [ ] `npm run lint` prints no errors.
- [ ] `npx serve out` (then http://localhost:3000) shows /, /work/, /about/ and /contact/.
- [ ] Every project page opens from /work/.
- [ ] New image files have lowercase names that match the content paths exactly.
- [ ] `git status` lists the new or changed files you expect, and nothing else.
- [ ] `ACTIVE_VIEW` in `src/content/views.ts` is the view you want live.

## Intro and page transitions

Run these after changing anything in `src/components/transition/`, `src/content/transitions.ts`, `src/app/layout.tsx` or a link.

- [ ] First visit: in a private window, the name shows on a dark panel, its letters pulse, then the panel lifts, the letters of the "nisal" wordmark slide up one by one.
- [ ] Home hero wordmark: moving the mouse across it breaks the letters near the pointer into sideways-shifted bands; they settle back when the mouse stops. The word runs from the left page margin to the right one with no horizontal scrollbar, at 1440px and at 375px.
- [ ] Home hero click: clicking a point on the wordmark breaks it apart from that point outward and reveals the photo; clicking the photo does the same back to the wordmark. On a phone a tap does the same. Tab to the wordmark and press Enter: the reveal starts from the centre.
- [ ] Refresh: no intro.
- [ ] New tab (same site, typed address): the intro plays again.
- [ ] Clicking Work, About, Contact, a project row, "All work", "More about me" and "Next project": the panel rises, shows the right label, and lifts on the new page at its top.
- [ ] Back and forward buttons: the page switches at once, with no panel.
- [ ] A link clicked in the open fullscreen menu: the menu is gone when the panel lifts, and the page scrolls.
- [ ] Reduced motion (F12, Ctrl+Shift+P, "Emulate CSS prefers-reduced-motion", "reduce"): no intro and no panel; links still work.
- [ ] Phone (375px): the intro name is on two lines and nothing overflows; transitions run from the menu.

## After adding a project

- [ ] The project file is in `src/content/projects/` and its export is in `src/content/projects/index.ts`.
- [ ] Its slug is in the active view in `src/content/views.ts`.
- [ ] `out/work/<slug>/index.html` exists after `npm run build`.
- [ ] The row shows on http://localhost:3000/ and http://localhost:3000/work/.
- [ ] The `type` and `stack` values reuse existing spellings (no duplicate filter chips on /work/).
- [ ] Hovering the row shows the image bubble (with `preview`) or the blue "View" circle (without).
- [ ] The project page shows every section you filled in, and the cover if set.
- [ ] No `<REPLACE:` text is left: Ctrl+Shift+F for `<REPLACE:` with "files to include" set to `src` finds nothing.

## Before sending the link to an employer

- [ ] Ctrl+Shift+F for `SAMPLE` in `src` and `public` finds nothing ([docs/placeholders.md](placeholders.md)).
- [ ] The email in the footer and on /contact/ opens your real address.
- [ ] The CV link on /contact/ opens your real CV.
- [ ] GitHub and LinkedIn links open your real profiles.
- [ ] `ACTIVE_VIEW` shows the projects chosen for this employer, in the right order.
- [ ] The live site shows the latest version (Ctrl+F5 on https://YOUR-USERNAME.github.io).
- [ ] On a phone: home, /work/ (open the filter), one project page, /about/, /contact/ and the menu all work, with no sideways scrolling.
- [ ] Only /about/ states location and studies ([rules](decisions-and-rules.md#rules)).
- [ ] Sharing the link in a chat app shows the share image and title.

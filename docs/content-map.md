# Content map

Use this when: changing any text you see on the site.
Time: about 5 minutes per change.

"Component" in the Field column means the text is written inside that component file, not in `src/content/`. Change it there.

## Where is the text I see on the site?

### Every page

| Page and section | What I see | File | Field name |
|---|---|---|---|
| Top left (every page, links to the home page) | Nisal Paranawithana | `src/content/profile.ts` | `profile.name` |
| Top-right links, fullscreen menu | Home, Work, About, Contact | `src/content/nav.ts` | `navItems[].label` |
| Fullscreen menu heading | Navigation | `src/components/Nav/MenuOverlay.tsx` | component |
| Footer statement | Let’s work together | `src/content/profile.ts` | `profile.closingLine` |
| Footer blue circle | Get in touch | `src/content/profile.ts` | `profile.contactCta` |
| Footer first button | the email address | `src/content/profile.ts` | `profile.email` |
| Footer other buttons | LinkedIn, GitHub | `src/content/profile.ts` | `socials[].label` |
| Footer bottom row | © 2026 Nisal Paranawithana | `src/content/profile.ts` | `profile.copyrightYear`, `profile.name` |
| Footer bottom row | Back to top | `src/components/sections/Footer/Footer.tsx` | component |
| Keyboard skip link | Skip to content | `src/app/layout.tsx` | component |

### Home page (/)

| Page and section | What I see | File | Field name |
|---|---|---|---|
| Hero | NISAL (shown in capitals by CSS) | `src/content/profile.ts` | `profile.firstName` |
| About statement | I like the moment... | `src/content/profile.ts` | `profile.about` |
| About link | More about me | `src/content/about.ts` | `about.moreLink` |
| Work heading | Selected work | `src/components/sections/Work/Work.tsx` | component |
| Work rows | project title and label | project file | `title`, `category` (or `type`) |
| Work button | All work | `src/content/work.ts` | `workPage.allWorkLabel` |
| Cursor bubble | View | `src/components/CursorPreview/CursorPreview.tsx` | component (`label = "View"`) |

### Work page (/work/)

| Page and section | What I see | File | Field name |
|---|---|---|---|
| Headline (two lines) | Things built slowly, / for the people who use them. | `src/content/work.ts` | `workPage.headline` |
| Filter bar | All, Filter | `src/content/work.ts` | `workPage.filters.all`, `.filter` |
| Result count | 02 PROJECTS | `src/content/work.ts` | `workPage.count` |
| Filter panel | search placeholder | `src/content/work.ts` | `workPage.filters.searchPlaceholder` |
| Filter panel | Type, Stack, Year | `src/content/work.ts` | `workPage.filters.groups` |
| Filter panel | +N more, Show less | `src/content/work.ts` | `workPage.filters.more`, `.less` |
| Filter panel | Clear all, Done | `src/content/work.ts` | `workPage.filters.clearAll`, `.done` |
| Column labels | Project, Type, Stack, Year | `src/content/work.ts` | `workPage.columns` |
| Empty state | Nothing matches these filters. | `src/content/work.ts` | `workPage.empty` |
| Empty state button | Clear filters | `src/content/work.ts` | `workPage.clearFilters` |
| Rows | title, type, stack, year | project file | `title`, `type`, `stack`, `year` |

### Project pages (/work/<slug>/)

| Page and section | What I see | File | Field name |
|---|---|---|---|
| Heading and details | title, role, year, type, stack | project file | `title`, `role`, `year`, `type`, `stack` |
| Detail labels | Role, Year, Type, Stack, Links | `src/app/work/[slug]/page.tsx` | component |
| Link buttons | Live site, Repository | `src/app/work/[slug]/page.tsx` | component |
| Section labels | Overview, What I built, Key decisions, Outcome, Gallery | `src/app/work/[slug]/page.tsx` | component |
| Section texts | | project file | `overview`, `whatIBuilt`, `decisions`, `outcome` |
| Next project block | Next project | `src/content/work.ts` | `nextProject.label` |
| Next project cursor | Next project | `src/content/work.ts` | `nextProject.cursor` |

### About page (/about/)

| Page and section | What I see | File | Field name |
|---|---|---|---|
| Statement | I care about the quiet parts... | `src/content/about.ts` | `about.statement` |
| Small labels | About, Achievements, Motivation, Toolbox | `src/content/about.ts` | `about.labels` |
| Paragraph | I work across design... | `src/content/about.ts` | `about.body` |
| Facts | Name, Based in, What I do, Studying, Working at | `src/content/about.ts` | `about.facts` |
| Image captions | caption under an image | `src/content/about.ts` | `about.images.<slot>.caption` |
| Achievements | year, title, note | `src/content/about.ts` | `about.achievements` |
| Motivation | statement and paragraphs | `src/content/about.ts` | `about.motivation` |
| Toolbox | group labels and items | `src/content/about.ts` | `about.toolbox` |

### Contact page (/contact/) and 404

| Page and section | What I see | File | Field name |
|---|---|---|---|
| Small label | Contact | `src/content/profile.ts` | `contactSection.label` |
| Big links | GitHub, LinkedIn, E-Mail, CV | `src/content/profile.ts` | `contactLinks[].label` |
| 404 page | Not found., Back to the start | `src/app/not-found.tsx` | component |

### Page title and description (browser tab, search results, link previews)

| Page | File | Fields |
|---|---|---|
| Home, 404 | `src/content/profile.ts` | `profile.name`, `profile.siteDescription` |
| /work/ | `src/content/work.ts` | `workPage.metaTitle`, `workPage.metaDescription` |
| /work/<slug>/ | project file | title is `<title> \| <profile.name>`; description is `summary` |
| /about/ | `src/content/about.ts` | `about.metaTitle`, `about.metaDescription` |
| /contact/ | `src/content/profile.ts` | `contactSection.metaTitle`, `contactSection.metaDescription` |

`profile.tagline` and `profile.lastName` are not shown anywhere. The share image `public/og.png` contains the name and tagline as pixels: [docs/media.md](media.md#replace-the-favicon-or-the-share-image).

## Change a text

Goal: any visible text changes.

Files to edit: the file in the tables above.

Steps:

1. Find the text in the tables above.
2. Open the file. Change the value between the quotes. Keep the quotes and the comma at the end of the line.
3. Use `’` (typographic apostrophe) or `\'` inside single-quoted text. Inside double quotes, `'` is fine.
4. Run `npm run dev` and open the page.

Done when: the page shows the new text.

If it fails: [troubleshooting: build fails with a type error](troubleshooting.md#t-type-error).

## Add or remove an achievement

Goal: the About page achievements list changes.

Files to edit: `src/content/about.ts`

Steps:

1. Find `achievements: [`.
2. To add, insert a line in the position you want:

   ```ts
   { year: "<REPLACE: 2026>", title: "<REPLACE: What I achieved>", note: "<REPLACE: One line of context.>" },
   ```

3. To remove, delete the whole `{ ... },` entry. An empty list `achievements: [],` hides the section.
4. Run `npm run dev` and open http://localhost:3000/about/.

Done when: the list shows the change. Each title must be unique (it is used as the React key).

If it fails: [troubleshooting: build fails with a type error](troubleshooting.md#t-type-error).

## Add or remove a toolbox group or item

Goal: the About page toolbox changes.

Files to edit: `src/content/about.ts`

Steps:

1. Find `toolbox: [`.
2. Add an item: add a quoted name to the `items` list of a group, for example `items: ["Git", "Figma", "Docker"]`.
3. Add a group:

   ```ts
   { label: "<REPLACE: Group name>", items: ["<REPLACE: Item>", "<REPLACE: Item>"] },
   ```

4. Remove a group: delete its whole `{ ... },` line. A group with `items: []` is not shown. `toolbox: [],` hides the section.
5. Run `npm run dev` and open http://localhost:3000/about/.

Done when: the toolbox shows the change.

If it fails: [troubleshooting: build fails with a type error](troubleshooting.md#t-type-error).

## Add or remove a facts row

Goal: the About page facts list changes.

Files to edit: `src/content/about.ts`

Steps:

1. Find `facts: [`.
2. Add a row: `{ label: "<REPLACE: Label>", value: "<REPLACE: Value>" },`
3. Remove a row: delete it, or set `value: ""` (a row with an empty value is skipped).
4. Keep [the content rules](decisions-and-rules.md#rules): location and studies appear only here.
5. Run `npm run dev` and open http://localhost:3000/about/.

Done when: the facts list shows the change.

If it fails: [troubleshooting: build fails with a type error](troubleshooting.md#t-type-error).

## Add or remove a contact link

Goal: the big links on /contact/ change. The footer buttons are a separate list.

Files to edit: `src/content/profile.ts`

Steps:

1. Change an address: edit `email`, `github`, `linkedin` or `cv` in `profile`. Both lists below use these.
2. Contact page links: edit `contactLinks`. Add an entry in the position you want:

   ```ts
   { label: "<REPLACE: Label>", href: "<REPLACE: https://...>", external: true },
   ```

   `external: true` opens a new tab. Use `false` for `mailto:` links.
3. Footer buttons: edit `socials`. The email button is always first and comes from `profile.email`.

   ```ts
   { label: "<REPLACE: Label>", href: "<REPLACE: https://...>" },
   ```

4. Run `npm run dev`. Open http://localhost:3000/contact/ and scroll to the footer.

Done when: both places show the change and each link opens the right address. Do not add a phone number ([rules](decisions-and-rules.md#rules)).

If it fails: [troubleshooting: build fails with a type error](troubleshooting.md#t-type-error).

## Add or remove a navigation item

Goal: the top-right links and the fullscreen menu change.

Files to edit: `src/content/nav.ts`

Steps:

1. Rename or reorder: edit `label` or move entries. The Home entry (`href: "/"`) is shown only in the fullscreen menu.
2. Remove: delete the entry.
3. Add: insert `{ label: "<REPLACE: Label>", href: "<REPLACE: /existing-page/>" },`. The page must exist (see the routes table in [docs/architecture.md](architecture.md#routes)). End internal paths with `/`.
4. Run `npm run dev` and click every item on every page.

Done when: each item opens its page. The current-page dot exists only for `/`, `/work/`, `/about/` and `/contact/` (the `current` value in `src/components/Nav/Nav.tsx`).

If it fails: [troubleshooting: a route returns 404](troubleshooting.md#t-404).

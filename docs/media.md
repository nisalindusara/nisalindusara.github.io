# Images, CV, favicon and share image

Use this when: adding or replacing any image, the CV, the favicon or the share image.
Time: about 10 minutes per image.

## Image slots

| Slot | Folder | File name rule | Size | Max file size | Format | Referenced in (file and field) |
|---|---|---|---|---|---|---|
| Project cover | `public/projects/<slug>/` | `cover.jpg` | 1600 x 1000 (16:10) | 400 KB | JPG or WebP | `src/content/projects/<slug>.ts`, `cover` |
| Project preview | `public/projects/<slug>/` | `preview.jpg` | 800 x 600 (4:3) | 150 KB | JPG or WebP | `src/content/projects/<slug>.ts`, `preview` |
| Project gallery | `public/projects/<slug>/` | `gallery-1.jpg`, `gallery-2.jpg`, ... | 1600 x 1000 (16:10) | 400 KB each | JPG or WebP | `src/content/projects/<slug>.ts`, `gallery` |
| About portrait | `public/about/` | `portrait.jpg` | 1200 x 1500 (4:5) | 400 KB | JPG | `src/content/about.ts`, `images.portrait` |
| About wide | `public/about/` | `wide.jpg` | 2100 x 900 (21:9) | 500 KB | JPG | `src/content/about.ts`, `images.wide` |
| About detail 1 | `public/about/` | `detail-1.jpg` | 1200 x 900 (4:3) | 300 KB | JPG | `src/content/about.ts`, `images.detailOne` |
| About detail 2 | `public/about/` | `detail-2.jpg` | 1200 x 900 (4:3) | 300 KB | JPG | `src/content/about.ts`, `images.detailTwo` |
| Home hero photo (shown by clicking the wordmark) | `public/hero/` | `photo.jpg` | 2400 x 1040 (about 2.3:1) | 400 KB | JPG or WebP | `src/content/profile.ts`, `heroImage.src` and `heroImage.alt` |
| Footer avatar | `public/` | `avatar.jpg` | 400 x 400 (1:1) | 80 KB | JPG | `src/content/profile.ts`, `avatar` |
| CV | `public/` | `cv.pdf` | | 2 MB | PDF | `src/content/profile.ts`, `cv` |
| Favicon | `src/app/` | `icon.svg` | 32 x 32 view box | 5 KB | SVG | Next.js file convention, no field |
| Share image | `public/` | `og.png` | 1200 x 630 | 300 KB | PNG | `src/app/layout.tsx` and the `metadata` of every `page.tsx` |

Project images use fixed size attributes in the components: cover and gallery 1600 x 1000, preview 800 x 600. Other aspect ratios display correctly after loading; matching ratios avoid a jump while loading.

## Rules

- A path in a content file is the path inside `public/`, starting with `/`. `"/projects/shop/cover.jpg"` is the file `public/projects/shop/cover.jpg`.
- File names are case-sensitive on the deployed site. Windows ignores case, so `Cover.JPG` works locally and fails on GitHub Pages when the field says `cover.jpg`. Use lowercase names and lowercase extensions only.
- Naming: lowercase letters, digits and hyphens. No spaces.
- Project images go in a folder named exactly like the project slug.

## Compress an image

1. Open https://squoosh.app in the browser.
2. Drop the image on the page.
3. On the right, set "Resize" to the width from the [Image slots](#image-slots) table (keep "Maintain aspect ratio" on).
4. Set the format to "MozJPEG" and the quality to 75.
5. Check the file size shown at the bottom right. It must be under the max file size in the table. If not, lower the quality to 65.
6. Click the download button and rename the file to the name from the table.

## Set width and height for About images

About images have `width` and `height` fields so the page does not jump while loading.

1. Right-click the image file in Windows Explorer, choose Properties, open the Details tab, and read "Width" and "Height".
2. Put the numbers in `src/content/about.ts`:

   ```ts
   portrait: {
     src: "/about/portrait.jpg",
     alt: "<REPLACE: what the photo shows>",
     width: <REPLACE: width in pixels>,
     height: <REPLACE: height in pixels>,
   },
   ```

## Replace a SAMPLE placeholder image

Goal: a real photo replaces a gray "SAMPLE PHOTO" or a colored placeholder.

Files to edit: the content file from the [Image slots](#image-slots) table, plus the image folder.

Steps:

1. Compress the photo: [Compress an image](#compress-an-image).
2. Copy it into the folder from the table with the name from the table.
3. Open the content file. Change the path from `.svg` to the new file, for example `"/about/portrait.svg"` to `"/about/portrait.jpg"`. Delete the `// SAMPLE: replace ...` comment on that line.
4. For About images: set `width`, `height` and `alt` ([Set width and height](#set-width-and-height-for-about-images)). Delete `[SAMPLE]` from `alt` and `caption`. A `caption` is optional; delete the line to show no caption.
5. Delete the old `.svg` file from the folder.
6. Run `npm run dev` and open the page.

Done when: the photo shows, and `Ctrl+Shift+F` for the old file name finds nothing in `src/`.

If it fails: [troubleshooting: image does not show](troubleshooting.md#t-image-case).

## Replace the portrait and About images

Goal: your own photos on /about/.

Files to edit: `src/content/about.ts`, `public/about/`

Steps:

1. Follow [Replace a SAMPLE placeholder image](#replace-a-sample-placeholder-image) four times: `portrait`, `wide`, `detailOne`, `detailTwo`.
2. To show fewer images, delete a whole slot entry (for example the `detailTwo: { ... },` block). With `wide`, `detailOne` and `detailTwo` all deleted, the image band is hidden.

Done when: http://localhost:3000/about/ shows the photos in gray.

If it fails: [troubleshooting: image does not show](troubleshooting.md#t-image-case).

## Turn the gray filter off or on

The About photos are gray because of one CSS variable in `src/app/globals.css`:

```css
--about-image-filter: grayscale(1) contrast(1.05);
```

- Color: change the value to `none`.
- Gray again: set it back to `grayscale(1) contrast(1.05)`.

Project images have no filter.

## Replace the CV

Goal: the CV links open your real CV.

Files to edit: `public/cv.pdf`

Steps:

1. Export the CV as PDF.
2. Name it `cv.pdf` and replace `public/cv.pdf`.
3. Open `src/content/profile.ts` and delete the `// SAMPLE: replace ...` comment after `cv: "/cv.pdf",`. Keep the value.
4. Run `npm run dev`. Open http://localhost:3000/contact/ and click CV.

Done when: the new CV opens in a new tab.

If it fails: [troubleshooting: image does not show](troubleshooting.md#t-image-case) (same cause for PDFs).

## Replace the favicon or the share image

Goal: a new browser tab icon, or a new preview image when the link is shared.

Files to edit: `src/app/icon.svg`, `public/og.png`

Steps:

1. Favicon: replace `src/app/icon.svg` with an SVG of the same name. Keep a square `viewBox`. The current one is the logo (`src/components/Logo/Logo.tsx`, same path data) in white with its blue dot, on no background, scaled by `0.88` to fill the width, with slightly thicker strokes so it reads at 16px. White shows on dark browser tab bars and is faint on light ones. After changing the logo's shape, copy the new path data into `icon.svg` too.
2. Share image: make a 1200 x 630 PNG in any image editor (Figma, Canva). It currently shows the name "Nisal Paranawithana" and the tagline on black. Save it as `public/og.png`, replacing the old file.
3. Run `npm run build`.

Done when: `out/icon.svg` and `out/og.png` are the new files. Link previews on LinkedIn or WhatsApp update only after those services refresh their cache; LinkedIn's Post Inspector (https://www.linkedin.com/post-inspector/) forces a refresh.

If it fails: [troubleshooting: deployed site shows old content](troubleshooting.md#t-old-content).

## Replace the hero photo

Goal: your photo in the home hero. Clicking (or tapping) the "nisal®" wordmark reveals it in the wordmark's place; clicking the photo brings the wordmark back.

Files to edit: `src/content/profile.ts`, `public/hero/`

The photo fills the box the wordmark takes up. That box is always about 2.3 times as wide as it is tall (about 1345 x 583 px on a 1440px-wide screen, 335 x 145 px on a phone), with rounded corners. A photo with another shape is cropped to fit from the centre (`object-fit: cover`), so nothing is stretched.

Steps:

1. Crop the photo to 2400 x 1040 (2.3:1). Keep the subject in the middle: on phones the photo is small, and a crop at another ratio cuts the edges first.
2. Compress it to 400 KB or less ([Compress an image](#compress-an-image)).
3. Save it as `public/hero/photo.jpg`. Lowercase name and extension.
4. In `src/content/profile.ts`, in the `heroImage` block, change `src: "/hero/photo.svg",` to `src: "/hero/photo.jpg",` and delete the `// SAMPLE` comment on that line.
5. Check `alt` in the same block: it describes the photo for screen readers. Change it if "Photo of Nisal Indusara Paranawithana" does not describe your photo.
6. Delete `public/hero/photo.svg`.
7. Run `npm run dev`, open http://localhost:3000/ and click the wordmark.

Done when: the click reveals your photo, with no gray "SAMPLE PHOTO" placeholder, at full width and at 375px wide.

If it fails: [troubleshooting: image does not show](troubleshooting.md#t-image-case).

## Replace the footer avatar

Goal: your photo in the footer next to "Let’s work together".

Files to edit: `src/content/profile.ts`, `public/`

Steps:

1. Crop the photo square, 400 x 400, and compress it ([Compress an image](#compress-an-image)).
2. Save it as `public/avatar.jpg`.
3. In `src/content/profile.ts`, change `avatar: "/avatar.svg",` to `avatar: "/avatar.jpg",` and delete the `// SAMPLE` comment.
4. Delete `public/avatar.svg`.

Done when: the footer shows the photo in a circle.

If it fails: [troubleshooting: image does not show](troubleshooting.md#t-image-case).

# Deployment

Use this when: publishing the site for the first time, publishing a change, or undoing a bad publish.
Time: first deployment about 20 minutes; later deployments about 3 minutes.

The site is published by GitHub Actions to GitHub Pages. The workflow file is `.github/workflows/deploy.yml`.

## First deployment

Before you start:

- Set `siteUrl` in `src/content/profile.ts` to `"https://YOUR-USERNAME.github.io"` (no slash at the end).
- Git is installed (`git --version` prints a version).
- Run `npm run build` once; it must end without errors.

Steps:

1. On https://github.com click the "+" at the top right, then "New repository".
2. Repository name: `YOUR-USERNAME.github.io`. Choose "Public". Leave "Add a README file", ".gitignore" and "license" off. Click "Create repository".
3. In VS Code, open a terminal in the project folder (Terminal > New Terminal) and run:

   ```
   git init
   git add .
   git commit -m "First version of the site"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/YOUR-USERNAME.github.io.git
   git push -u origin main
   ```

   If git asks who you are, run these two lines, then run `git commit -m "First version of the site"` again and continue with `git branch -M main`:

   ```
   git config --global user.name "<REPLACE: your name>"
   git config --global user.email "<REPLACE: your email>"
   ```

4. On GitHub, open the repository, then Settings > Pages. Under "Build and deployment", set "Source" to "GitHub Actions".
5. Open the "Actions" tab. The push in step 3 started a run named "Deploy to GitHub Pages". That first run fails at the "deploy" job because Pages was not enabled yet. This failure is expected.
6. In the "Actions" tab, click "Deploy to GitHub Pages" in the left list, then "Run workflow" on the right, then the green "Run workflow" button.
7. Wait until the run shows a green check (about 2 minutes). Click the run; the "deploy" box shows the site URL.

Done when: https://YOUR-USERNAME.github.io shows the site, and https://YOUR-USERNAME.github.io/work/ and https://YOUR-USERNAME.github.io/about/ open.

If it fails: [troubleshooting: the Actions run fails](troubleshooting.md#t-actions).

## Every later deployment

Run in the VS Code terminal, in the project folder:

```
git add .
git commit -m "<REPLACE: what changed>"
git push
```

Done when: the newest run in the "Actions" tab has a green check and the live site shows the change after a reload with Ctrl+F5.

If it fails: [troubleshooting: the Actions run fails](troubleshooting.md#t-actions), [deployed site shows old content](troubleshooting.md#t-old-content).

## Undo a bad deployment

Goal: the live site goes back to the version before the last commit.

Steps:

1. Run:

   ```
   git revert HEAD --no-edit
   git push
   ```

2. `git revert` makes a new commit that undoes the last one; the push deploys it.
3. To undo more than one commit, run `git log --oneline`, copy the id of the last good commit, and run `git revert --no-edit <REPLACE: good-commit-id>..HEAD`, then `git push`.

Done when: the newest run in the "Actions" tab is green and the live site shows the old version.

If it fails: [troubleshooting: the Actions run fails](troubleshooting.md#t-actions).

## Repository name and base path

The repository must be named `YOUR-USERNAME.github.io`. Only that name serves the site at the root URL `https://YOUR-USERNAME.github.io/`. Any other name serves it at `https://YOUR-USERNAME.github.io/<repo>/`, and without the changes below every image, the CV and every internal link break.

To use another repository name `<repo>`:

1. In `next.config.ts`, add `basePath: "/<repo>",` inside `nextConfig`. This fixes internal links, scripts, styles and fonts.
2. `next/image`, the About page `<img>` tags and the CV link do not add the base path. In the content files, put `/<repo>` in front of every path that starts with `/`:
   - `src/content/profile.ts`: `avatar`, `cv`
   - `src/content/about.ts`: `src` of `portrait`, `wide`, `detailOne`, `detailTwo`
   - `src/content/projects/*.ts`: `cover`, `preview`, every `gallery` entry

   Example: `"/about/portrait.jpg"` becomes `"/<repo>/about/portrait.jpg"`.
3. In `src/content/profile.ts`, set `siteUrl` to `"https://YOUR-USERNAME.github.io/<repo>"`. The share image URL then becomes `https://YOUR-USERNAME.github.io/<repo>/og.png`.
4. Run `npm run build`; it must end without errors. With a `basePath`, the local preview `npx serve out` shows no styles and no images, because it serves at the root and the pages point to `/<repo>/`. Check the site after deploying instead.

## Custom domain

1. Buy the domain at a registrar.
2. At the registrar, add DNS records. For `example.com`: four `A` records pointing to `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`. For `www.example.com`: a `CNAME` record pointing to `YOUR-USERNAME.github.io`.
3. On GitHub: Settings > Pages > "Custom domain", enter the domain, click "Save". Tick "Enforce HTTPS" once it becomes available.
4. In `src/content/profile.ts`, set `siteUrl` to `"https://<REPLACE: your domain>"` and deploy.

CNAME file: this workflow deploys with GitHub Actions, and GitHub ignores a `CNAME` file in that case; the domain lives in the Settings > Pages field. No `CNAME` file is needed. (Only for the older "Deploy from a branch" source would it go in `public/CNAME`.)

## What the workflow does

`.github/workflows/deploy.yml`:

1. Runs on every push to `main` and on "Run workflow" in the Actions tab.
2. Installs Node 20 and the exact packages from `package-lock.json` (`npm ci`).
3. Runs `npm run build`, which writes the static site to `out/`.
4. Uploads `out/` and publishes it to GitHub Pages; one run at a time (`concurrency: pages`).

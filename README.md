# Ilia Nekrasov’s academic homepage

The site remains at **https://inekras.github.io/**. Edit `source/`; the existing static exporter generates `dist/` at the repository root. Generated output is ignored by Git.

## Setup, build, and preview

Use Node **24.21.0** (pinned in `.nvmrc`) and its bundled npm **11.19.0**. With [nvm](https://github.com/nvm-sh/nvm) installed, run these commands from the repository root:

```sh
nvm install
nvm use
npm --prefix source ci
npm --prefix source run build
npm --prefix source run check
npm --prefix source run preview
```

Open **http://127.0.0.1:8080/**. Preview serves the generated `dist/` website; rebuild after editing and refresh the browser. Stop preview with Ctrl+C. `npm ci` installs exactly `source/package-lock.json`; keep that lockfile with the source. No environment file, CV download, or private service is needed to build.

## Editing

- Text and formulas: `source/content/{research,teaching,advising,contact}.md`. Use `$...$` for inline math and `$$...$$` for display math; see [examples](source/content/README.md).
- Introduction, profile links, and page structure: `source/app/page.tsx`.
- Design and header behavior: `source/app/globals.css` and `source/app/scroll-header.tsx`.
- CV: replace `source/public/documents/ilia-nekrasov-cv.pdf`, retaining the filename to preserve its public URL.
- Portrait and sharing image: `source/public/ilia-nekrasov-portrait.jpg` and `source/public/og.png`.

Build, check, and preview each update. Keep public documents and images in `source/public/`; its contents become public.

## Publishing and recovery

Pull requests run the build and checks without deploying. After the one-time switch to **Settings → Pages → Build and deployment → Source: GitHub Actions**, a successful push to `main` publishes only `dist/`. The address does not change. See [PUBLISHING.md](PUBLISHING.md) for the initial handoff and workflow details.

To undo a bad published update, revert its commit through a pull request, let checks pass, and merge the revert into `main`; Actions rebuilds and republishes the restored source. Revert only the bad content changes, keeping the source-based workflow in place. A failed build does not replace the last successful deployment. [EXPORT-NOTES.md](EXPORT-NOTES.md) describes preservation and export scope.

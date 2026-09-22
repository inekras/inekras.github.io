# Editable homepage source

This directory is the authoritative project for **https://inekras.github.io/**. Follow the [root README](../README.md) for the pinned runtime, exact setup/build/check/preview commands, editing guide, CV replacement, and recovery instructions. [PUBLISHING.md](../PUBLISHING.md) describes automatic publication from `main`.

`npm run build` (also available as `npm run export:github-pages`) runs the existing `scripts/export-github-pages.mjs` exporter and writes to `../dist/`. It renders the real page, stylesheet, and header component. `npm run preview` serves that generated directory at `http://127.0.0.1:8080/`; rebuild and refresh after changes.

Edit section text and formulas in `content/*.md` ([math examples](content/README.md)), the introduction in `app/page.tsx`, styling in `app/globals.css`, and header behavior in `app/scroll-header.tsx`. Public images, licenses, and documents live in `public/`. The CV is `public/documents/ilia-nekrasov-cv.pdf` and is copied locally during each build.

The original Sites/Cloudflare configuration and starter helpers remain as references; GitHub Pages uses the static exporter. [ORIGINAL-STARTER-README.md](ORIGINAL-STARTER-README.md) is historical documentation, not the current build/publishing guide. See [export notes](../EXPORT-NOTES.md) for preservation and compatibility details.

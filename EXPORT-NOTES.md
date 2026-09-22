# Static export notes

## Source and preservation

`source/` is the authoritative editable project. The existing Vite/React static-export pipeline still renders `app/page.tsx`, compiles the original stylesheet, and bundles `app/scroll-header.tsx`. The migration does not change frameworks or redesign the homepage.

The imported source was compared with the generated website originally stored at the repository root. No newer homepage content was found in that root export. The portrait, sharing image, and CV matched the imported copies byte for byte. The original export notes identify source revision `a9a50f871cca7a3a9bdfc44748b0d6e0f2d6bd3e` as their provenance; this repository’s source and lockfile are the build inputs going forward.

The production rebuild was also compared before removing the root export: its HTML body, all 61 CSS/JavaScript/font assets, five license texts, CV, portrait, social image, and robots file were byte-identical. All 60 anchor destinations were unchanged. The deliberate metadata change adds the final public canonical URL and absolute social-image URLs.

The preservation baseline includes:

- Warm-white background, original CSS, Georgia/Palatino font choices, responsive portrait layout, and rounded corners.
- Centered name, textured gradient scrolling header, Research/Teaching/Advising/Contact links, “To top”, section anchors, focus handling, history, and reduced-motion behavior.
- Native expandable sections, thesis-publication wording, and bold “email me!”.
- Pre-rendered KaTeX mathematics and accessible MathML, with local CSS and fonts.
- Portrait, social-sharing image, CV, scholarly references, arXiv/DOI links, course links, email links, and seminar link.
- The public homepage, image, document, section-anchor, and third-party-license paths. These notes and `PUBLISHING.md` also remain available at their existing public paths.

Generated root HTML/assets are replaced by reproducible `dist/` output after comparison. Public images, the CV, and existing third-party license texts are retained under `source/public/`. Keep unique source material and documents there even when they are not currently linked from the homepage.

## Build inputs and output

All homepage build inputs live in this repository, including `source/package-lock.json`, Markdown, page components, styles, images, and `source/public/documents/ilia-nekrasov-cv.pdf`. The original CV snapshot was obtained on 2026-09-21; builds copy the local PDF and never download it. Replace that file to update the CV while preserving `/documents/ilia-nekrasov-cv.pdf`.

The build uses pinned Node/npm versions and locked dependencies; dependency installation requires access to the public npm registry. Once dependencies are installed, static export requires no network service, file elsewhere on the owner’s Mac, ChatGPT session, secret, environment file, or private preview URL. Canonical and social metadata use `https://inekras.github.io/`.

Only the repository-root `dist/` directory is published. It contains static HTML, CSS, JavaScript, fonts, public assets, third-party runtime licenses, and these publishing/export notes. Editable code, dependency caches, credentials, Git history, and original hosting configuration are excluded. See the [README](https://github.com/inekras/inekras.github.io/blob/main/README.md) for exact build/check/preview commands and [PUBLISHING.md](https://github.com/inekras/inekras.github.io/blob/main/PUBLISHING.md) for the workflow.

## Compatibility and external services

Text, formulas, and native expandable sections work without JavaScript. The scrolling-header transformations and enhanced navigation use JavaScript. Georgia and Palatino remain system-font choices with the existing fallbacks; proprietary system fonts are not redistributed.

The original starter’s ChatGPT authentication helpers, Cloudflare image endpoint, and database helper are retained as source references and are not deployed. No visible homepage feature requires them. Request-time metadata detection is replaced by static production metadata. The original Sites access gate is hosting functionality; GitHub Pages publishes this homepage publicly.

The Algebra Seminar remains a Google Docs link so its schedule can change independently. Journals, arXiv, publishers, university profiles, Canvas, and bCourses remain external links. Their availability and access permissions remain with their owners; no authenticated course materials are bundled.

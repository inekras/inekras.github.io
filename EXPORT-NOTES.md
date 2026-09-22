# Static export notes

## What is preserved

- Approved content and layout from source revision `a9a50f871cca7a3a9bdfc44748b0d6e0f2d6bd3e`, including the latest thesis-publication wording and bold “email me!”.
- Warm-white background, original CSS, Georgia/Palatino font choices, responsive portrait layout and rounded corners.
- Centered name, textured gradient scrolling header, four section links, and “To top”. The export uses the original React header component, including section opening, deep links, focus management, history and reduced-motion behavior.
- Native expandable Research, Teaching, Advising and Contact sections.
- KaTeX formulas, including accessible MathML, pre-rendered into HTML. All needed KaTeX font files and CSS are local; no math CDN or server is required.
- Portrait and existing social-sharing image as local files.
- CV downloaded from the existing publicly accessible Google Drive link on 2026-09-21 and bundled as `documents/ilia-nekrasov-cv.pdf`; the visible CV link now opens that file.
- Scholarly references, arXiv/DOI links, course links, email links and seminar link.

## Server-dependent items, explicitly accounted for

No user-facing homepage feature needs a backend. The original server-rendering step now runs only when generating these files, not when someone visits the website.

The original request-header-based metadata URL detection cannot run on GitHub Pages. It is replaced with static metadata and an optional build-time `SITE_URL`. Without that value, the export deliberately omits canonical/og:url and uses a relative local social image; some social crawlers need absolute URLs to show a card. The site itself works immediately without configuration.

The original starter's ChatGPT authentication helpers, Cloudflare Worker image-optimization endpoint and database helper are not used by the approved homepage. They are not deployed. Their original source is retained in the separate editable source archive for completeness. No login, form, upload, analytics or database feature has been removed from the visible page.

The original Sites hosting access gate is platform functionality, not portable website code. A normal GitHub Pages publication is public; this export cannot preserve owner-only Sites access.

## External links that remain external

The Algebra Seminar remains a live Google Docs link so its schedule can keep changing. arXiv, journals, textbook publishers and university profiles remain links to their original hosts. Canvas/bCourses course pages may require university authentication; they cannot be made public or exported through this homepage. No authenticated course materials have been copied. Google Docs access also remains subject to its owner's sharing settings.

There are no private or temporary preview URLs used to load the website's CSS, JavaScript, images, math fonts or CV. External destinations may still change or require login; preserving their links does not bypass their access controls.

## Editing and compatibility

All text/formulas and native expandable sections work without JavaScript. JavaScript is needed for the scrolling-header transformations and enhanced navigation. These use the same modern browser features as the approved version.

Georgia and Palatino are system-font choices, as on the original website; the same fallback fonts apply if a visitor does not have them installed. Proprietary system font files are not redistributed.

The static ZIP contains only deployable files and these instructions. The separate source ZIP excludes credentials, environment files, dependency caches, Git history and private preview state. Third-party runtime licenses accompany the static assets.

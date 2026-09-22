# Publish the homepage on GitHub Pages

1. Unzip the ready-to-publish website ZIP.
2. Put its **contents** into your GitHub repository. `index.html`, `.nojekyll`, `assets/`, `documents/`, and the images must be at the repository's top level, not inside an extra enclosing folder. On macOS, use Command–Shift–Period to show `.nojekyll` if it is hidden.
3. In the repository, open **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**, then your branch (normally `main`) and **/(root)**. Save.
4. When GitHub finishes publishing, use **Visit site** on that page.

No npm installation, Cloudflare account, Sites account, database, or GitHub Actions build configuration is needed for these already-built files. Keep `.nojekyll`; it disables Jekyll processing.

The same ZIP works for a personal site (`https://USERNAME.github.io/`) and a project site (`https://USERNAME.github.io/REPOSITORY/`). All local asset links are relative.

The website will normally be publicly accessible. GitHub Pages does not inherit the private access restrictions of the original Sites preview. Only publish when ready for the homepage and bundled CV to be public.

The editable-source ZIP is a separate development copy, not something you must upload to publish. Its README explains how to edit Markdown and rebuild.

The final GitHub address was not supplied, so no made-up canonical URL or old preview URL is embedded. The social-preview image is included; for reliable social sharing, regenerate with `SITE_URL` set to your final HTTPS homepage URL as explained in the source README. This is optional for the actual website and all its interactions to work.

Official instructions: https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site

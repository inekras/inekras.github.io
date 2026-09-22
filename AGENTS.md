# Repository instructions

- Edit the authoritative project in `source/`. Do not hand-edit generated `dist/` output or recreate generated website files at the repository root.
- Preserve the existing design, mathematics, navigation, portrait, CV, and public URLs unless the user requests a change.
- After edits, run `npm --prefix source run build` and `npm --prefix source run check`. For visible changes, preview the generated site with `npm --prefix source run preview` and inspect it at `http://127.0.0.1:8080/`.
- Do not add dependencies or alter deployment without the user’s approval.
- Do not commit, push, merge, deploy, or change GitHub settings without the user’s permission.
- Keep necessary source files, the npm lockfile, public assets, and licenses. Do not add credentials, environment files, dependency caches, generated output, or nested Git repositories.

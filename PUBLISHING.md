# Publishing the homepage

The public address is **https://inekras.github.io/**. `source/` is the editable project, and `dist/` is the sole deployment directory. The repository root is no longer a ready-made website. Use the exact local commands in the [repository README](https://github.com/inekras/inekras.github.io/blob/main/README.md).

## One-time handoff

1. Review the `source-setup` changes and their local production preview. When ready, commit and push them and open a pull request to `main`.
2. Wait for the **Pages / Build and check** pull-request check to pass. It does not call the Pages API and works while the repository still uses branch-based publishing.
3. Immediately before merging, the repository owner should select **Settings → Pages → Build and deployment → Source: GitHub Actions**. Coordinate this switch with the merge because this change removes the old generated website from the root.
4. Merge the reviewed pull request. The push to `main` builds, checks, and deploys the site. Check the **Pages** workflow in the Actions tab, then visit the homepage.

The setup changes alone do not perform these steps. The workflow does not enable Pages or change repository settings. No personal access token or repository secret is needed. GitHub documents the [publishing-source setting](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site) and [custom Pages workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

## Normal updates

Edit source, run the production build and checks, and preview `dist/`. After review, merge into `main`. Do not copy generated files back into the repository root or upload a ZIP. The build fixes canonical and social-sharing URLs to `https://inekras.github.io/`; no `SITE_URL` setting is needed.

The [workflow](https://github.com/inekras/inekras.github.io/blob/main/.github/workflows/pages.yml) uses GitHub-hosted Linux runners and official GitHub actions:

- Every pull request installs the locked npm dependencies, builds, and checks the exported site with read-only repository access. It never deploys.
- A push to `main` performs the same steps, then uploads only `dist/` as the Pages artifact. Deployment depends on successful completion of that job.
- Only the deployment job receives `pages: write` and `id-token: write`, using the built-in GitHub token and the `github-pages` environment. Other branches cannot deploy.
- Build concurrency is scoped to each ref; a pull request cannot cancel a production run. Deployment jobs are serialized without cancelling a running deployment.

The homepage, local CV, and other files in `source/public/` are public. Original Sites authentication and private preview access are not part of this static site.

## Recovering from a bad update

Revert the faulty content commit in a new pull request, run the same checks and preview, and merge the revert into `main`. For a merge commit, GitHub’s pull-request **Revert** action can prepare the reversal. Preserve the source-based build/deployment setup when selecting changes to revert. The next successful workflow republishes the restored source; no generated files need editing.

If a build or check fails, inspect its Actions log and fix the source. The deploy job will be skipped and the last successful site stays published. If deployment fails after a successful build, check the Pages source setting and any `github-pages` environment restrictions, then rerun the failed workflow after correcting the cause.

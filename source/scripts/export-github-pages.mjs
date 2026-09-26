import { build } from "vite";
import react from "@vitejs/plugin-react";
import { cp, mkdir, mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
import assert from "node:assert/strict";

const root = fileURLToPath(new URL("../", import.meta.url));
const repository = path.resolve(root, "..");
const outputParent = path.join(root, ".cache");
const destination = path.join(repository, "dist");
process.env.NODE_ENV = "production";
await mkdir(outputParent, { recursive: true });
const stage = await mkdtemp(path.join(outputParent, "github-pages-build-"));
const renderDir = path.join(stage, "renderer");
const output = path.join(stage, "website");
await mkdir(output);

// Keep production metadata independent of the preview host or environment.
const siteUrl = "https://inekras.github.io/";

try {
  const common = {
    root, configFile: false, base: "./", logLevel: "warn",
    plugins: [react(), {
      name: "scope-export-css-sources",
      enforce: "pre",
      transform(code, id) {
        if (id === path.join(root, "app/globals.css")) {
          // Do not let temporary build/output folders influence generated CSS.
          return code.replace('@import "tailwindcss";', '@import "tailwindcss" source(none);\n@source "./";\n@source "../content";');
        }
      },
    }],
    resolve: { alias: { tailwindcss: path.join(root, "node_modules/tailwindcss/index.css") } },
  };
  await build({
    ...common,
    build: {
      ssr: "export/github-pages/render.tsx", outDir: renderDir,
      copyPublicDir: false, ssrEmitAssets: true, minify: false,
      rollupOptions: { output: { entryFileNames: "render.mjs" } },
    },
  });
  await build({
    ...common,
    build: {
      outDir: output, copyPublicDir: false,
      rollupOptions: {
        input: "export/github-pages/client.tsx",
        output: { entryFileNames: "assets/site.js", assetFileNames: "assets/[name]-[hash][extname]" },
      },
    },
  });
  await cp(path.join(renderDir, "assets"), path.join(output, "assets"), { recursive: true });
  await cp(path.join(root, "public"), output, {
    recursive: true,
    filter: filename => path.basename(filename) !== ".DS_Store",
  });
  await mkdir(path.join(output, "licenses"), { recursive: true });
  for (const [name, filename] of [["katex", "LICENSE"], ["react", "LICENSE"], ["react-dom", "LICENSE"], ["scheduler", "LICENSE"], ["tailwindcss", "LICENSE"]]) {
    await cp(path.join(root, "node_modules", name, filename), path.join(output, "licenses", name + ".txt"));
  }

  const { renderPage } = await import(pathToFileURL(path.join(renderDir, "render.mjs")).href);
  let body = renderPage();
  // Add only a hydration boundary around the unchanged fixed header.
  body = body.replace(/(<header\b[\s\S]*?<\/header>)/, '<div id="site-header-root">$1</div>');
  body = body.replaceAll('="/ilia-nekrasov-portrait.jpg"', '="./ilia-nekrasov-portrait.jpg"');
  assert.ok(body.includes('href="./documents/ilia-nekrasov-cv.pdf"'));
  assert.ok(body.includes('id="site-header-root"'));

  const escape = value => value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;");
  const imageUrl = new URL("og.png", siteUrl).href;
  const styles = (await readdir(path.join(output, "assets"))).filter(name => name.endsWith(".css"));
  assert.ok(styles.length, "Missing compiled CSS");
  for (const name of styles) {
    const filename = path.join(output, "assets", name);
    const css = (await readFile(filename, "utf8")).replace(/url\((["']?)\/assets\//g, "url($1./");
    assert.doesNotMatch(css, /url\(["']?\/(?!\/)/, "Root-relative CSS asset would fail on project Pages");
    await writeFile(filename, css);
  }
  const html = `<!doctype html>
  <html lang="en">
  <head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Ilia Nekrasov | Mathematician</title>
  <link rel="icon" href="./favicon.ico" sizes="16x16 32x32 48x48">
  <link rel="icon" href="./favicon.svg" type="image/svg+xml" sizes="any">
  <meta name="description" content="Academic homepage of Ilia Nekrasov: research, publications, teaching, advising, and contact information.">
  <meta name="application-name" content="Ilia Nekrasov / Homepage">
  <meta name="author" content="Ilia Nekrasov">
  <meta name="creator" content="Ilia Nekrasov">
  <meta name="keywords" content="Ilia Nekrasov, mathematics, tensor categories, model theory, algebra">
  <meta name="robots" content="index, follow">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="en_US">
  <meta property="og:title" content="Ilia Nekrasov | Mathematician">
  <meta property="og:description" content="Research, publications, teaching, and advising in algebra, tensor categories, and model theory.">
  <meta property="og:image" content="${escape(imageUrl)}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="Ilia Nekrasov — Mathematics, Tensor Categories, Model Theory">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Ilia Nekrasov | Mathematician">
  <meta name="twitter:description" content="Research, publications, teaching, and advising in algebra, tensor categories, and model theory.">
  <meta name="twitter:image" content="${escape(imageUrl)}">
  <link rel="canonical" href="${escape(siteUrl)}">
  <meta property="og:url" content="${escape(siteUrl)}">
  ${styles.map(name => `<link rel="stylesheet" href="./assets/${name}">`).join("\n")}
  <script type="module" src="./assets/site.js"></script>
  </head>
  <body>${body}</body>
  </html>
  `;
  await writeFile(path.join(output, "index.html"), html);
  await writeFile(path.join(output, ".nojekyll"), "");
  await cp(path.join(repository, "PUBLISHING.md"), path.join(output, "PUBLISHING.md"));
  await cp(path.join(repository, "EXPORT-NOTES.md"), path.join(output, "EXPORT-NOTES.md"));

  // All assets are relative, so both username.github.io and /repository/ work.
  assert.doesNotMatch(html, /(?:src|href)="\/(?!\/)/);
  assert.doesNotMatch(html, /chatgpt\.site|localhost|127\.0\.0\.1|_vinext|sign[inout-]*-with-chatgpt/i);
  for (const id of ["research", "teaching", "advising", "contact"]) assert.ok(html.includes(`id="${id}"`));
  assert.ok(html.includes('class="katex"'));
  const pdf = await readFile(path.join(output, "documents/ilia-nekrasov-cv.pdf"));
  assert.equal(pdf.subarray(0, 5).toString(), "%PDF-");
  // Replace only generated output, after rendering and validating the new export.
  await rm(destination, { recursive: true, force: true });
  await cp(output, destination, { recursive: true });
  console.log(`Static website: ${destination}`);
  console.log("Preview with: npm --prefix source run preview");
} finally {
  await rm(stage, { recursive: true, force: true });
}

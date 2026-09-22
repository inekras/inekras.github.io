import assert from "node:assert/strict";
import { lstat, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const dist = path.resolve(fileURLToPath(new URL("../../dist/", import.meta.url)));
const publicDir = fileURLToPath(new URL("../public/", import.meta.url));
const siteUrl = "https://inekras.github.io/";
const sections = ["research", "teaching", "advising", "contact"];

function decodeEntities(value) {
  const named = { amp: "&", quot: '"', apos: "'", lt: "<", gt: ">" };
  return value.replace(/&(#x[\da-f]+|#\d+|amp|quot|apos|lt|gt);/gi, (_, entity) => {
    if (entity[0] !== "#") return named[entity.toLowerCase()];
    return String.fromCodePoint(entity[1].toLowerCase() === "x"
      ? parseInt(entity.slice(2), 16)
      : parseInt(entity.slice(1), 10));
  });
}

// The exporter emits standard quoted HTML attributes. No browser or service is
// needed to check its links; browser interaction is a separate preview check.
function tags(html) {
  return [...html.matchAll(/<([a-z][a-z\d:-]*)\b([^>]*?)>/gi)].map((match) => {
    const attrs = {};
    for (const attr of match[2].matchAll(/([a-z_:][\w:.-]*)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/gi)) {
      attrs[attr[1].toLowerCase()] = decodeEntities(attr[2] ?? attr[3] ?? attr[4]);
    }
    return { name: match[1].toLowerCase(), attrs };
  });
}

function idsIn(html) {
  const ids = tags(html).map(({ attrs }) => attrs.id).filter(Boolean);
  assert.equal(new Set(ids).size, ids.length, "HTML IDs must be unique");
  return new Set(ids);
}

async function filesIn(directory, relative = "") {
  const files = [];
  for (const entry of await readdir(path.join(directory, relative), { withFileTypes: true })) {
    const name = path.posix.join(relative, entry.name);
    assert.ok(!entry.isSymbolicLink(), `Symlinks must not be published: ${name}`);
    if (entry.isDirectory()) files.push(...await filesIn(directory, name));
    else {
      assert.ok(entry.isFile(), `Unexpected filesystem entry: ${name}`);
      files.push(name);
    }
  }
  return files;
}

async function checkLocalReference(reference, from, { allowData = false } = {}) {
  if (allowData && reference.startsWith("data:")) return;
  const base = new URL(from, siteUrl);
  const url = new URL(reference, base);
  assert.equal(url.origin, new URL(siteUrl).origin, `External runtime dependency in ${from}: ${reference}`);
  assert.equal(url.protocol, "https:", `Unsupported protocol in ${from}: ${reference}`);
  assert.ok(!url.username && !url.password, `Credentials in URL: ${from}`);
  let relative = decodeURIComponent(url.pathname).replace(/^\/+/, "");
  if (!relative || relative.endsWith("/")) relative += "index.html";
  const filename = path.resolve(dist, relative);
  assert.ok(filename.startsWith(dist + path.sep), `Reference escapes dist: ${reference}`);
  const info = await lstat(filename).catch((error) => {
    assert.fail(`Missing local target in ${from}: ${reference} (${error.code})`);
  });
  assert.ok(info.isFile() && !info.isSymbolicLink(), `Target is not a regular file: ${reference}`);
  if (url.hash && path.extname(filename) === ".html") {
    const ids = idsIn(await readFile(filename, "utf8"));
    assert.ok(ids.has(decodeURIComponent(url.hash.slice(1))), `Broken fragment in ${from}: ${reference}`);
  }
}

test("exports accessible content, mathematics, and native section navigation", async () => {
  const html = await readFile(path.join(dist, "index.html"), "utf8");
  const elements = tags(html);
  const ids = idsIn(html);
  assert.match(html, /^<!doctype html>/i);
  assert.ok(elements.some(({ name, attrs }) => name === "html" && attrs.lang === "en"));
  assert.match(html, /<title>Ilia Nekrasov \| Mathematician<\/title>/);
  assert.equal(elements.filter(({ name }) => name === "h1").length, 1);
  assert.ok(ids.has("page-title") && ids.has("site-header-root") && ids.has("top"));
  assert.match(html, /<button\b[^>]*class="to-top"/);
  for (const id of sections) {
    assert.ok(elements.some(({ name, attrs }) => name === "details" && attrs.id === id), `Missing native section: ${id}`);
    assert.ok(elements.some(({ name, attrs }) => name === "a" && attrs.href === `#${id}`), `Missing navigation link: ${id}`);
  }
  for (const fold of html.matchAll(/<details\b[^>]*>([\s\S]*?)<\/details>/g)) {
    assert.match(fold[1], /^<summary>[\s\S]*?<h2\b/);
    assert.match(fold[1], /class="section-content"[\s\S]*class="markdown-content"/);
  }
  for (const { name, attrs } of elements) {
    if (name === "img") assert.ok(attrs.alt?.trim(), "Images need descriptive alt text");
    for (const id of (attrs["aria-labelledby"] ?? "").split(/\s+/).filter(Boolean)) {
      assert.ok(ids.has(id), `Broken accessible label: ${id}`);
    }
    if (name === "a" && attrs.target === "_blank") {
      assert.match(attrs.rel ?? "", /\b(?:noreferrer|noopener)\b/, "New-window links need a safe rel value");
    }
  }
  const math = [...html.matchAll(/<math\b[^>]*>([\s\S]*?)<\/math>/g)];
  assert.ok(math.length > 0, "Mathematics must be rendered into accessible MathML");
  assert.equal(elements.filter(({ attrs }) => attrs.class === "katex").length, math.length);
  for (const formula of math) {
    assert.match(formula[1], /<semantics>/);
    assert.match(formula[1], /<annotation encoding="application\/x-tex">[^<]+<\/annotation>/);
  }
  assert.doesNotMatch(html, /katex-error|ParseError|codex-preview|chatgpt\.site|_vinext|signin-with-chatgpt/i);
});

test("uses the unchanged public address and local social-sharing image", async () => {
  const elements = tags(await readFile(path.join(dist, "index.html"), "utf8"));
  const canonical = elements.filter(({ name, attrs }) => name === "link" && attrs.rel === "canonical");
  assert.equal(canonical.length, 1);
  assert.equal(canonical[0].attrs.href, siteUrl);
  const metadata = new Map(elements.filter(({ name }) => name === "meta")
    .map(({ attrs }) => [attrs.property ?? attrs.name, attrs.content]));
  assert.equal(metadata.get("og:url"), siteUrl);
  assert.equal(metadata.get("og:image"), new URL("og.png", siteUrl).href);
  assert.equal(metadata.get("twitter:image"), new URL("og.png", siteUrl).href);
  assert.ok(metadata.get("description")?.trim());
  assert.match(metadata.get("viewport") ?? "", /width=device-width/);
  assert.doesNotMatch(metadata.get("robots") ?? "", /noindex|nofollow/i);
});

test("resolves every local HTML URL and forbids remote runtime resources", async () => {
  const files = await filesIn(dist);
  for (const filename of files.filter((name) => name.endsWith(".html"))) {
    const elements = tags(await readFile(path.join(dist, filename), "utf8"));
    for (const { name, attrs } of elements) {
      for (const attribute of ["href", "src", "poster", "data"]) {
        if (!(attribute in attrs)) continue;
        if (attribute === "data" && name !== "object") continue;
        const reference = attrs[attribute];
        const url = new URL(reference, new URL(filename, siteUrl));
        if (name === "a" && attribute === "href" && url.origin !== new URL(siteUrl).origin) {
          assert.ok(["https:", "http:", "mailto:", "tel:"].includes(url.protocol), `Unsafe link protocol: ${reference}`);
          continue;
        }
        await checkLocalReference(reference, filename, { allowData: name === "img" });
      }
      // The current portrait needs one source. Check future responsive image
      // candidates too, so adding srcset cannot silently introduce a CDN.
      if (attrs.srcset) {
        for (const candidate of attrs.srcset.split(",")) {
          await checkLocalReference(candidate.trim().split(/\s+/)[0], filename);
        }
      }
      assert.ok(!("srcdoc" in attrs), "Inline frames require a separate dependency audit");
    }
    assert.ok(elements.some(({ name, attrs }) => name === "link" && attrs.rel === "stylesheet"), "Missing compiled stylesheet");
    assert.ok(elements.some(({ name, attrs }) => name === "script" && attrs.type === "module" && attrs.src), "Missing navigation module");
  }
});

test("keeps all CSS imports, images, and math fonts local and resolvable", async () => {
  const styles = (await filesIn(dist)).filter((name) => name.endsWith(".css"));
  assert.ok(styles.length > 0, "Missing compiled CSS");
  let fonts = 0;
  for (const filename of styles) {
    const css = await readFile(path.join(dist, filename), "utf8");
    fonts += [...css.matchAll(/@font-face\b/g)].length;
    for (const match of css.matchAll(/url\(\s*(?:"([^"]+)"|'([^']+)'|([^\s)]+))\s*\)/gi)) {
      await checkLocalReference(match[1] ?? match[2] ?? match[3], filename, { allowData: true });
    }
    for (const match of css.matchAll(/@import\s+(?:"([^"]+)"|'([^']+)')/gi)) {
      await checkLocalReference(match[1] ?? match[2], filename);
    }
    assert.doesNotMatch(css, /sourceMappingURL\s*=/);
  }
  assert.ok(fonts > 0, "KaTeX fonts must be bundled with the site");
});

test("copies the public assets and CV exactly, with runtime licenses", async () => {
  const publicFiles = await filesIn(publicDir);
  for (const filename of publicFiles) {
    assert.deepEqual(await readFile(path.join(dist, filename)), await readFile(path.join(publicDir, filename)), `Public asset changed during export: ${filename}`);
  }
  for (const filename of ["ilia-nekrasov-portrait.jpg", "og.png", "robots.txt", "documents/ilia-nekrasov-cv.pdf"]) {
    assert.ok(publicFiles.includes(filename), `Missing versioned build input: public/${filename}`);
  }
  const pdf = await readFile(path.join(dist, "documents/ilia-nekrasov-cv.pdf"));
  assert.equal(pdf.subarray(0, 5).toString(), "%PDF-");
  assert.match(pdf.subarray(-1024).toString(), /%%EOF/, "The local CV must be a complete PDF");
  const elements = tags(await readFile(path.join(dist, "index.html"), "utf8"));
  assert.ok(elements.some(({ name, attrs }) => name === "a" && new URL(attrs.href ?? "", siteUrl).href === new URL("documents/ilia-nekrasov-cv.pdf", siteUrl).href), "The CV link must use the bundled PDF");
  for (const name of ["katex", "react", "react-dom", "scheduler", "tailwindcss"]) {
    const license = await readFile(path.join(dist, "licenses", `${name}.txt`), "utf8");
    assert.ok(license.trim().length > 100, `Missing or truncated ${name} license`);
  }
  assert.match(await readFile(path.join(dist, "robots.txt"), "utf8"), /Allow:\s*\//);
});

test("publishes only static output, without source, credentials, caches, or symlinks", async () => {
  const files = await filesIn(dist);
  const publicFiles = new Set(await filesIn(publicDir));
  assert.ok(files.includes("index.html") && files.includes(".nojekyll"));
  assert.equal((await readFile(path.join(dist, ".nojekyll"))).length, 0);
  for (const filename of files) {
    const parts = filename.split("/");
    assert.ok(filename === ".nojekyll" || parts.every((part) => !part.startsWith(".")), `Hidden output file: ${filename}`);
    assert.ok(parts.every((part) => !["source", "node_modules", "coverage", "outputs", "renderer", "server", "tests", "scripts"].includes(part)), `Non-public output directory: ${filename}`);
    assert.doesNotMatch(filename, /(?:^|\/)(?:package(?:-lock)?\.json|AGENTS\.md|README\.md|[^/]*\.env(?:\.[^/]*)?)$/i);
    assert.doesNotMatch(filename, /\.(?:map|ts|tsx|jsx|mjs|cjs|pem|key|p12|pfx|log|zip)$/i);
    const generated = ["index.html", ".nojekyll", "PUBLISHING.md", "EXPORT-NOTES.md"].includes(filename)
      || /^assets\/[a-z\d_.-]+\.(?:css|js|woff2?|ttf|otf|png|jpe?g|svg|webp|gif|avif)$/i.test(filename)
      || /^licenses\/[a-z\d-]+\.txt$/i.test(filename);
    assert.ok(generated || publicFiles.has(filename), `Unexpected publication file: ${filename}`);
  }
});

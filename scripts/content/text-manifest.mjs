// Lists the editable texts of every page (run before each build: `npm run prebuild`).
// Writes src/lib/content/text-manifest.generated.json: { "<page slug>": ["text", …] } in source order.
// Candidates are the <Tx> literals plus prose-like strings in the page's component and data files; the
// admin keeps only those that actually appear in the rendered page.
import fs from "node:fs";
import path from "node:path";
import ts from "typescript";
import { ROOT, decodeEntities, jsxText, pageFiles, parse } from "./page-files.mjs";

const registry = fs.readFileSync(path.join(ROOT, "src/lib/content/page-registry.ts"), "utf8");
const slugs = [...registry.matchAll(/slug: "([^"]+)"/g)].map((m) => m[1]);

const ATTRS = new Set(["className", "href", "src", "srcSet", "sizes", "id", "style", "type", "rel", "target", "role", "name", "htmlFor", "key", "loading", "decoding", "fetchPriority", "media", "as", "method", "action", "autoComplete", "inputMode", "pattern", "d", "viewBox", "fill", "stroke", "xmlns", "transform", "data-bs-target", "data-bs-toggle", "aria-controls", "aria-labelledby"]);

function prose(s) {
  const t = s.trim();
  if (!/[A-Za-z]{2}/.test(t) || t.length > 20000) return false;
  if (/^(\/|https?:|mailto:|tel:|#|\.|data:)/.test(t)) return false; // paths, links, selectors
  if (/\.(webp|png|jpe?g|gif|svg|avif|mp4|webm|pdf|css|js|json|woff2?)(\?|$)/i.test(t)) return false;
  if (/^[a-z0-9_-]+$/.test(t)) return false; // identifiers, slugs, keys
  if (/^\(.*:.*\)$/.test(t) || /^[a-z-]+( [a-z-]+)*$/.test(t) && /-/.test(t)) return false; // media queries, class lists
  if (/^[a-z0-9]+(?:[A-Z][a-z0-9]*)+$/.test(t)) return false; // camelCase
  if (/(^|\s)[a-z-]+:[^\s]/.test(t) && !/\s[a-z]+:\s/.test(t)) return false; // tailwind variants like md:flex
  if (/[[\]{}]|=>|;$/.test(t) && !/[.!?]$/.test(t)) return false; // code-ish
  if (/^[\w-]+( [\w-]+)*$/.test(t) && /(^| )(flex|grid|px-|py-|mt-|mb-|text-|bg-|w-|h-|rounded|border|items-|justify-|gap-|col-|row|container|d-none|d-flex)/.test(t)) return false; // class lists
  return true;
}

const manifest = {};
for (const slug of slugs) {
  const seen = new Set();
  const list = [];
  const add = (s) => {
    if (prose(s) && !seen.has(s)) {
      seen.add(s);
      list.push(s);
    }
  };
  for (const file of pageFiles(slug).filter((f) => /\.(tsx?|)$/.test(f)).sort()) {
    const { sf } = parse(file);
    (function visit(n) {
      if (ts.isJsxText(n)) add(decodeEntities(jsxText(n.getFullText())));
      else if (ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n)) {
        const p = n.parent;
        const skip =
          ts.isExpressionStatement(p) /* "use client" */ || ts.isImportDeclaration(p) || ts.isExportDeclaration(p) || ts.isLiteralTypeNode(p) || ts.isExternalModuleReference(p) ||
          (ts.isJsxAttribute(p) && ATTRS.has(p.name.getText())) ||
          (ts.isJsxExpression(p) && ts.isJsxAttribute(p.parent) && ATTRS.has(p.parent.name.getText())) ||
          (ts.isPropertyAssignment(p) && p.name === n) ||
          (ts.isCallExpression(p) && /^(cn|clsx|withBasePath|img|fullImg|fullSource|responsiveImg|require|import|transcodedUrl|transcodedSrcSet|withBasePathSrcSet|storedHtml)$/.test(p.expression.getText()));
        if (!skip) add(n.text);
      }
      ts.forEachChild(n, visit);
    })(sf);
  }
  manifest[slug] = list;
}
const out = path.join(ROOT, "src/lib/content/text-manifest.generated.json");
fs.writeFileSync(out, JSON.stringify(manifest) + "\n");
console.log(`text manifest: ${Object.values(manifest).reduce((n, l) => n + l.length, 0)} candidate texts on ${slugs.length} pages`);

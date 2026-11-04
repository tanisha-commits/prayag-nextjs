// Shared by the text codemod and the text manifest: which component files make up each page, and
// which of them run in the browser. Walks imports from src/app/(pages)/<slug>/page.tsx (and the
// homepage) through src/components/sites/prayag and src/content.
import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

export const ROOT = process.cwd();
const COMPONENTS = path.join(ROOT, "src/components/sites/prayag");

/** Site chrome and homepage sections have their own editors (Content → Site & homepage). */
export const SKIP = new Set(
  [
    "site-header.tsx", "site-header-client.tsx", "site-footer.tsx", "category-panel.tsx", "category-panel-client.tsx",
    "hero-video-slider.tsx", "hero-video-slider-client.tsx", "why-prayag.tsx", "experience-section.tsx", "customer-service.tsx",
    "latest-insights.tsx", "explore-products.tsx", "sporting-spirit.tsx", "sporting-spirit-client.tsx", "icons.tsx",
    "prayag-button.tsx", "seo.tsx", "data.ts", "responsive-image.tsx", "page-banner.tsx",
  ].map((f) => path.join(COMPONENTS, f)),
);

export function pageEntry(slug) {
  return slug === "home" ? path.join(ROOT, "src/app/page.tsx") : path.join(ROOT, "src/app/(pages)", slug, "page.tsx");
}

function resolveImport(from, spec) {
  let base;
  if (spec.startsWith("@/")) base = path.join(ROOT, "src", spec.slice(2));
  else if (spec.startsWith(".")) base = path.resolve(path.dirname(from), spec);
  else return null;
  for (const c of [base, `${base}.tsx`, `${base}.ts`, path.join(base, "index.tsx"), path.join(base, "index.ts")]) if (fs.existsSync(c) && fs.statSync(c).isFile()) return c;
  return null;
}

const parsed = new Map();
export function parse(file) {
  if (!parsed.has(file)) {
    const src = fs.readFileSync(file, "utf8");
    parsed.set(file, { src, sf: ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true, file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS) });
  }
  return parsed.get(file);
}

export function imports(file) {
  const { sf } = parse(file);
  const out = [];
  for (const st of sf.statements) {
    if ((ts.isImportDeclaration(st) || ts.isExportDeclaration(st)) && st.moduleSpecifier && ts.isStringLiteral(st.moduleSpecifier) && !st.importClause?.isTypeOnly) {
      const r = resolveImport(file, st.moduleSpecifier.text);
      if (r && /\.(tsx?|)$/.test(r) && !r.endsWith(".css")) out.push(r);
    }
  }
  return out;
}

const inScope = (f) => (f.startsWith(COMPONENTS) || f.startsWith(path.join(ROOT, "src/content"))) && !SKIP.has(f) && !f.includes(`${path.sep}cms${path.sep}`);

/** Component/content files reachable from a page entry (excluding skipped ones). */
export function pageFiles(slug) {
  const seen = new Set();
  const stack = [pageEntry(slug)];
  while (stack.length) {
    const f = stack.pop();
    for (const i of imports(f)) if (inScope(i) && !seen.has(i)) {
      seen.add(i);
      stack.push(i);
    }
  }
  return [...seen];
}

export const isClientFile = (f) => /^\s*["']use client["']/.test(parse(f).src);

/** Files that run in the browser: "use client" files and everything they import. */
export function clientFiles(files) {
  const out = new Set();
  const stack = files.filter(isClientFile);
  while (stack.length) {
    const f = stack.pop();
    if (out.has(f)) continue;
    out.add(f);
    for (const i of imports(f)) if (inScope(i)) stack.push(i);
  }
  return out;
}

/** React's JSX text whitespace rule (what actually renders). */
export function jsxText(raw) {
  const lines = raw.split(/\r\n|\n|\r/);
  const parts = [];
  lines.forEach((line, i) => {
    let l = line.replace(/\t/g, " ");
    if (i !== 0) l = l.replace(/^[ ]+/, "");
    if (i !== lines.length - 1) l = l.replace(/[ ]+$/, "");
    if (l) parts.push(l);
  });
  return parts.join(" ");
}

export const decodeEntities = (s) =>
  s.replace(/&(nbsp|amp|lt|gt|quot|apos|#\d+|#x[0-9a-f]+);/gi, (m, e) => {
    const map = { nbsp: " ", amp: "&", lt: "<", gt: ">", quot: '"', apos: "'" };
    if (map[e.toLowerCase()]) return map[e.toLowerCase()];
    if (e[1] === "x" || e[1] === "X") return String.fromCodePoint(parseInt(e.slice(2), 16));
    return String.fromCodePoint(parseInt(e.slice(1), 10));
  });

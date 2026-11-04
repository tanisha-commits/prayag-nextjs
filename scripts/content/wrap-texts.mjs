// One-off codemod (re-runnable): wraps the visible text of every page's components in <Tx> so it can
// be edited in the admin (Pages → Texts), by .md, or by Claude, without changing the design.
//   node scripts/content/wrap-texts.mjs [--dry]
// Wraps JSX text and simple {value} children ({item.title}, {name}); skips <option>, <title>,
// <textarea>, <style>, <script> and SVG. Client files get the client Tx.
import fs from "node:fs";
import path from "node:path";
import ts from "typescript";
import { ROOT, clientFiles, decodeEntities, jsxText, pageFiles, parse } from "./page-files.mjs";

const dry = process.argv.includes("--dry");
const registry = fs.readFileSync(path.join(ROOT, "src/lib/content/page-registry.ts"), "utf8");
const slugs = [...registry.matchAll(/slug: "([^"]+)"/g)].map((m) => m[1]);

const files = new Set();
for (const s of slugs) for (const f of pageFiles(s)) if (f.endsWith(".tsx")) files.add(f);
const client = clientFiles([...files]);

const NO_WRAP_TAGS = new Set(["option", "title", "textarea", "style", "script", "svg", "text", "tspan", "Tx"]);
const tagName = (el) => (ts.isJsxElement(el) ? el.openingElement.tagName.getText() : ts.isJsxSelfClosingElement(el) ? el.tagName.getText() : "");

function simpleValue(e) {
  if (!e) return false;
  if (ts.isIdentifier(e)) return e.text !== "children" && e.text !== "undefined";
  if (ts.isPropertyAccessExpression(e)) return simpleValue(e.expression) || ts.isIdentifier(e.expression) || ts.isPropertyAccessExpression(e.expression);
  if (ts.isElementAccessExpression(e)) return true;
  if (ts.isStringLiteral(e) || ts.isNoSubstitutionTemplateLiteral(e)) return true;
  return false;
}

let total = 0;
const report = [];
for (const file of files) {
  const { src, sf } = parse(file);
  if (/from "@\/components\/sites\/prayag\/cms\/tx(-client)?"/.test(src)) continue; // already done
  const edits = [];
  (function visit(node, blocked) {
    if (ts.isJsxElement(node) || ts.isJsxFragment(node)) {
      const name = ts.isJsxElement(node) ? tagName(node) : "";
      const block = blocked || NO_WRAP_TAGS.has(name);
      for (const child of node.children) {
        if (!block && ts.isJsxText(child)) {
          const text = decodeEntities(jsxText(child.getFullText()));
          if (/[A-Za-z]{2}/.test(text)) {
            // Keep the original whitespace around the text: only the rendered characters move into Tx.
            const raw = child.getFullText();
            const lead = raw.match(/^\s*/)[0];
            const trail = raw.match(/\s*$/)[0];
            // Leading/trailing spaces on the same line are part of the rendered text.
            const keepLead = lead.includes("\n") ? lead : "";
            const keepTrail = trail.includes("\n") ? trail : "";
            edits.push({ start: child.getFullStart(), end: child.getEnd(), text: `${keepLead}<Tx>{${JSON.stringify(text)}}</Tx>${keepTrail}` });
          }
        } else if (!block && ts.isJsxExpression(child) && simpleValue(child.expression)) {
          edits.push({ start: child.getStart(), end: child.getEnd(), text: `<Tx>${child.getText()}</Tx>` });
        }
        visit(child, block);
      }
      if (ts.isJsxElement(node)) visit(node.openingElement, block);
      return;
    }
    ts.forEachChild(node, (c) => visit(c, blocked));
  })(sf, false);
  if (!edits.length) continue;
  let out = src;
  for (const e of edits.sort((a, b) => b.start - a.start)) out = out.slice(0, e.start) + e.text + out.slice(e.end);
  const mod = client.has(file) ? "@/components/sites/prayag/cms/tx-client" : "@/components/sites/prayag/cms/tx";
  // Import after the last top-level import (or the "use client" line).
  const lastImport = [...sf.statements].filter(ts.isImportDeclaration).pop();
  const at = lastImport ? lastImport.getEnd() : /^\s*["']use client["'];?\s*\n/.exec(src)?.[0].length ?? 0;
  const imp = `\nimport { Tx } from "${mod}";`;
  const shift = edits.filter((e) => e.start < at).length ? null : at; // edits never precede imports
  out = out.slice(0, shift) + imp + out.slice(shift);
  total += edits.length;
  report.push(`${String(edits.length).padStart(4)}  ${client.has(file) ? "client" : "server"}  ${path.relative(ROOT, file)}`);
  if (!dry) fs.writeFileSync(file, out);
}
console.log(report.sort().join("\n"));
console.log(`${dry ? "Would wrap" : "Wrapped"} ${total} text node(s) in ${report.length} file(s).`);

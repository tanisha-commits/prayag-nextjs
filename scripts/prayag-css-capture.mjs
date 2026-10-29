// Usage: PLAYWRIGHT_DIR=<dir containing node_modules/playwright> node scripts/prayag-css-capture.mjs <out-dir> <slug>...
// Loads each https://prayagindia.com/<slug> in Chrome at 1440px (GET only) and writes
//   <out-dir>/<slug>.used.json      external theme-stylesheet rules whose selector matches an element
//                                   of the page content (header/footer/drawer excluded), with a global
//                                   rule index so pages can be merged in source order;
//   <out-dir>/<slug>.pagecss.json   the page's own inline <style> blocks, every rule, in source order.
// Then run scripts/prayag-css-generate.py to write the scoped CSS files.
import { createRequire } from "module";
const require = createRequire((process.env.PLAYWRIGHT_DIR ?? process.cwd()).replace(/\/?$/, "/"));
const { chromium } = require("playwright");
import fs from "fs";
const [outDir, ...pages] = process.argv.slice(2);
const browser = await chromium.launch({ executablePath: "/usr/bin/google-chrome" });
for (const slug of pages) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto("https://prayagindia.com/" + slug, { waitUntil: "load", timeout: 90000 });
  await page.waitForTimeout(3000);
  const res = await page.evaluate(() => {
    const content = [...document.querySelectorAll("body *")].filter(el =>
      !el.closest("header, footer, aside, .navik-header, script, style, noscript"));
    const set = new Set([...content, document.body, document.documentElement]);
    const out = []; let idx = 0;
    const strip = s => s.replace(/::?(before|after|placeholder|marker|selection|-webkit-[a-z-]+|-moz-[a-z-]+)/g, "")
      .replace(/:(hover|focus|focus-visible|focus-within|active|visited|checked|disabled|first-letter|first-line)/g, "");
    function walk(rules, media, href) {
      for (const r of rules) { idx++;
        if (r instanceof CSSMediaRule) { walk(r.cssRules, (media ? media + " and " : "") + r.conditionText, href); continue; }
        if (r instanceof CSSSupportsRule) { walk(r.cssRules, media, href); continue; }
        if (r instanceof CSSKeyframesRule || r instanceof CSSFontFaceRule) { out.push({ idx, href, media, kind: "at", text: r.cssText }); continue; }
        if (!(r instanceof CSSStyleRule)) continue;
        const sels = r.selectorText.split(",").map(s => s.trim());
        const used = sels.filter(s => { const q = strip(s) || "*"; try { return [...document.querySelectorAll(q)].some(e => set.has(e)); } catch { return false; } });
        if (used.length) out.push({ idx, href, media, kind: "rule", sel: used.join(", "), body: r.style.cssText, all: sels.length === used.length });
      }
    }
    for (const sh of document.styleSheets) {
      if (!sh.href) continue; // inline <style> = page CSS, handled separately
      try { walk(sh.cssRules, "", sh.href); } catch (e) { out.push({ href: sh.href, error: String(e) }); }
    }
    return { out, sheets: [...document.styleSheets].map(s => s.href) };
  });
  fs.writeFileSync(`${outDir}/${slug}.used.json`, JSON.stringify(res, null, 1));
  const sheets = await page.evaluate(() => [...document.styleSheets].filter((s) => !s.href && s.ownerNode && s.ownerNode.tagName === "STYLE").map((s) => {
    const rules = [];
    const walk = (list, media) => { for (const r of list) {
      if (r instanceof CSSMediaRule) walk(r.cssRules, (media ? media + " and " : "") + r.conditionText);
      else if (r instanceof CSSSupportsRule) walk(r.cssRules, media);
      else if (r instanceof CSSStyleRule) rules.push({ media, sel: r.selectorText, body: r.style.cssText });
      else rules.push({ media, at: r.cssText });
    } };
    walk(s.cssRules, "");
    return { where: s.ownerNode.closest("head") ? "head" : "content", len: s.ownerNode.textContent.length, rules };
  }));
  fs.writeFileSync(`${outDir}/${slug}.pagecss.json`, JSON.stringify(sheets, null, 1));
  console.log(slug, res.out.length, res.out.filter(r => r.error).length);
  await page.close();
}
await browser.close();

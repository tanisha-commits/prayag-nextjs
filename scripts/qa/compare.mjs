// Usage: PLAYWRIGHT_DIR=... node scripts/qa/compare.mjs <out-dir> [--widths=1440,390] <path>...
// Loads each path on prayagindia.com and on the local server (GET only; every non-GET request is
// aborted so no form or tracker on the live site is triggered), then writes full-page screenshots
// <out-dir>/<slug>-<width>-{live,local}.png and prints page heights and the vertical size of every
// top-level block between header and footer, so section-by-section differences stand out.
import fs from "fs";
import { LIVE, LOCAL, launch, settle } from "./browser.mjs";

const args = process.argv.slice(2);
const outDir = args.shift();
const widthsArg = args.find((a) => a.startsWith("--widths="));
const widths = widthsArg ? widthsArg.slice(9).split(",").map(Number) : [1440, 390];
const paths = args.filter((a) => !a.startsWith("--"));
fs.mkdirSync(outDir, { recursive: true });

const browser = await launch();
const report = [];
for (const path of paths) {
  for (const width of widths) {
    const row = { path, width };
    for (const [name, origin] of [["live", LIVE], ["local", LOCAL]]) {
      const page = await browser.newPage({ viewport: { width, height: 900 } });
      await page.route("**/*", (r) => (r.request().method() === "GET" ? r.continue() : r.abort()));
      try {
        await page.goto(origin + path, { waitUntil: "load", timeout: 120000 });
        await settle(page);
        row[name] = await page.evaluate(() => {
          const skip = (el) => el.matches("header, footer, script, style, noscript, aside, .navik-header, [hidden]") || el.offsetHeight === 0;
          const main = document.querySelector("main") ?? document.querySelector(".dialog-off-canvas-main-canvas") ?? document.body;
          let blocks = [...main.children].filter((el) => !skip(el));
          // Unwrap single wrappers (layout divs) so the list shows real sections.
          while (blocks.length === 1 && blocks[0].children.length) blocks = [...blocks[0].children].filter((el) => !skip(el));
          return {
            height: document.documentElement.scrollHeight,
            overflowX: document.documentElement.scrollWidth - window.innerWidth,
            blocks: blocks.map((el) => `${el.tagName.toLowerCase()}.${[...el.classList].slice(0, 2).join(".")}:${Math.round(el.getBoundingClientRect().height)}`),
          };
        });
        const slug = path === "/" ? "home" : path.replace(/^\//, "").replace(/\W+/g, "_");
        await page.screenshot({ path: `${outDir}/${slug}-${width}-${name}.png`, fullPage: true });
      } catch (e) {
        row[name] = { error: String(e).slice(0, 200) };
      }
      await page.close();
    }
    const d = (row.local.height ?? 0) - (row.live.height ?? 0);
    console.log(`${path} @${width}: live ${row.live.height} local ${row.local.height} (Δ${d}) overflowX live=${row.live.overflowX} local=${row.local.overflowX}`);
    console.log(`   live : ${(row.live.blocks ?? [row.live.error]).join("  ")}`);
    console.log(`   local: ${(row.local.blocks ?? [row.local.error]).join("  ")}`);
    report.push(row);
  }
}
fs.writeFileSync(`${outDir}/compare.json`, JSON.stringify(report, null, 1));
await browser.close();

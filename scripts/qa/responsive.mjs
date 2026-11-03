// Usage: PLAYWRIGHT_DIR=... node scripts/qa/responsive.mjs <out.json> [--widths=375,390,768,1366,1440,1920] [--all | path...]
// Opens each local page at each width (GET only) after scrolling it through, and records:
//   overflowX     document wider than the viewport (horizontal scroll) + the widest offending elements
//   brokenImages  <img> that finished loading with no pixels
//   consoleErrors console errors / uncaught exceptions
//   failed        requests answering >= 400 or failing
// --all takes the paths from the local sitemap. Prints only pages with findings.
import fs from "fs";
import { LOCAL, WIDTHS, launch, settle, sitemapPaths } from "./browser.mjs";

const args = process.argv.slice(2);
const outFile = args.shift();
const widthsArg = args.find((a) => a.startsWith("--widths="));
const widths = widthsArg ? widthsArg.slice(9).split(",").map(Number) : WIDTHS;
const paths = args.includes("--all") ? await sitemapPaths() : args.filter((a) => !a.startsWith("--"));
const CONCURRENCY = Number(process.env.QA_CONCURRENCY ?? 4);

const browser = await launch();
const jobs = paths.flatMap((path) => widths.map((width) => ({ path, width })));
const results = [];
let done = 0;

async function run({ path, width }) {
  const context = await browser.newContext({ viewport: { width, height: 900 }, isMobile: width < 768, hasTouch: width < 768 });
  const page = await context.newPage();
  const consoleErrors = [];
  const failed = [];
  page.on("console", (m) => m.type() === "error" && consoleErrors.push(m.text().slice(0, 200)));
  page.on("pageerror", (e) => consoleErrors.push(`uncaught: ${String(e).slice(0, 200)}`));
  page.on("response", (r) => r.status() >= 400 && failed.push(`${r.status()} ${r.url().replace(LOCAL, "")}`));
  page.on("requestfailed", (r) => {
    const f = r.failure()?.errorText ?? "";
    // Aborted media/prefetch requests are normal when navigation/scrolling cancels them.
    if (!/ERR_ABORTED/.test(f)) failed.push(`failed ${f} ${r.url().replace(LOCAL, "")}`);
  });
  await page.route("**/*", (r) => (r.request().method() === "GET" || r.request().url().startsWith(LOCAL) ? r.continue() : r.abort()));
  const row = { path, width };
  try {
    const res = await page.goto(LOCAL + path, { waitUntil: "load", timeout: 120000 });
    row.status = res?.status();
    await settle(page);
    Object.assign(
      row,
      await page.evaluate(() => {
        const vw = document.documentElement.clientWidth;
        const overflowX = document.documentElement.scrollWidth - vw;
        const offenders = [];
        if (overflowX > 0)
          for (const el of document.querySelectorAll("body *")) {
            const r = el.getBoundingClientRect();
            if (r.width && r.right > vw + 1) {
              // Skip elements clipped by an ancestor with overflow hidden/auto.
              let clipped = false;
              for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) {
                const s = getComputedStyle(a);
                if (/(hidden|auto|scroll|clip)/.test(s.overflowX) && a.getBoundingClientRect().right <= vw + 1) {
                  clipped = true;
                  break;
                }
              }
              if (!clipped) offenders.push(`${el.tagName.toLowerCase()}${el.id ? "#" + el.id : ""}.${[...el.classList].slice(0, 3).join(".")} right=${Math.round(r.right)}`);
            }
          }
        const brokenImages = [...document.images].filter((i) => i.complete && i.naturalWidth === 0 && i.getAttribute("src")).map((i) => i.getAttribute("src"));
        return { overflowX, offenders: offenders.slice(0, 6), brokenImages };
      }),
    );
  } catch (e) {
    row.error = String(e).slice(0, 200);
  }
  row.consoleErrors = [...new Set(consoleErrors)];
  row.failed = [...new Set(failed)];
  await context.close();
  results.push(row);
  const bad = row.error || row.status !== 200 || row.overflowX > 0 || row.brokenImages?.length || row.consoleErrors.length || row.failed.length;
  if (bad) console.log(JSON.stringify(row));
  if (++done % 100 === 0) console.error(`… ${done}/${jobs.length}`);
}

await Promise.all(
  Array.from({ length: CONCURRENCY }, async () => {
    while (jobs.length) {
      const job = jobs.shift();
      // A page that never settles is reported, not waited on forever.
      await Promise.race([run(job), new Promise((r) => setTimeout(r, 240000))]).catch(() => {});
    }
  }),
);
await browser.close();
fs.writeFileSync(outFile, JSON.stringify(results, null, 1));
const count = (f) => results.filter(f).length;
console.log(
  `\n${results.length} page-widths: ${count((r) => r.overflowX > 0)} overflow, ${count((r) => r.brokenImages?.length)} broken-image, ${count((r) => r.consoleErrors.length)} console-error, ${count((r) => r.failed.length)} failed-request, ${count((r) => r.error || r.status !== 200)} load-error`,
);

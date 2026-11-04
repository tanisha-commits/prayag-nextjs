import fs from "fs";

const base = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");
const outFile = process.argv[3];
const ORIGIN = process.env.SITE_URL ?? "https://prayagindia.com";
const CONCURRENCY = Number(process.env.QA_CONCURRENCY ?? 6);

const xml = await (await fetch(`${base}/sitemap.xml`)).text();
const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const paths = locs.map((l) => new URL(l).pathname);
const decode = (s) => s.replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">");
const attr = (tag, name) => decode(tag.match(new RegExp(`\\s${name}="([^"]*)"`, "i"))?.[1] ?? "");

async function audit(path) {
  const r = await fetch(base + path, { redirect: "manual", signal: AbortSignal.timeout(180000) });
  const html = r.ok ? await r.text() : "";
  const head = html.slice(0, html.indexOf("</head>") + 7);
  const body = html.slice(head.length).replace(/<script[\s\S]*?<\/script>/gi, (s) => (s.includes("application/ld+json") ? s : ""));
  const metas = [...head.matchAll(/<meta\b[^>]*>/gi)].map((m) => m[0]);
  const meta = (key, val) => attr(metas.find((m) => new RegExp(`${key}="${val}"`, "i").test(m)) ?? "", "content");
  const titles = [...head.matchAll(/<title>([\s\S]*?)<\/title>/gi)].map((m) => decode(m[1]));
  const canonical = attr(head.match(/<link\b[^>]*rel="canonical"[^>]*>/i)?.[0] ?? "", "href");
  const headings = [...body.matchAll(/<h([1-6])\b/gi)].map((m) => Number(m[1]));
  const skips = headings.filter((h, i) => i > 0 && h > headings[i - 1] + 1).length;
  const imgs = [...body.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0]);
  const noAlt = imgs.filter((t) => !/\salt="/i.test(t)).length;
  const jsonLd = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)].map((m) => m[1]);
  let jsonLdTypes = [];
  let jsonLdErrors = 0;
  for (const j of jsonLd) {
    try {
      const d = JSON.parse(j);
      jsonLdTypes.push(...[d].flat().map((x) => x["@type"]));
    } catch {
      jsonLdErrors++;
    }
  }
  const robots = meta("name", "robots");
  const problems = [];
  if (r.status !== 200) problems.push(`status ${r.status}`);
  if (titles.length !== 1) problems.push(`${titles.length} titles`);
  if (!meta("name", "description")) problems.push("no meta description");
  if (!canonical) problems.push("no canonical");
  else if (canonical.replace(/\/$/, "") !== (ORIGIN + path).replace(/\/$/, "")) problems.push(`canonical ${canonical}`);
  if (/noindex/i.test(robots)) problems.push(`robots ${robots}`);
  const h1 = headings.filter((h) => h === 1).length;
  if (h1 !== 1) problems.push(`${h1} h1`);
  if (skips) problems.push(`${skips} heading-level skips`);
  if (noAlt) problems.push(`${noAlt}/${imgs.length} img without alt`);
  if (!meta("property", "og:title") || !meta("property", "og:url")) problems.push("og incomplete");
  if (jsonLdErrors) problems.push(`${jsonLdErrors} invalid JSON-LD`);
  return { path, status: r.status, title: titles[0] ?? "", description: meta("name", "description"), canonical, h1, jsonLdTypes, problems };
}

const results = [];
const queue = [...paths];
await Promise.all(
  Array.from({ length: CONCURRENCY }, async () => {
    while (queue.length) {
      const p = queue.shift();
      try {
        results.push(await audit(p));
      } catch (e) {
        results.push({ path: p, problems: [`fetch failed ${String(e).slice(0, 60)}`] });
      }
    }
  }),
);
const dup = (key) => {
  const m = new Map();
  for (const r of results) if (r[key]) m.set(r[key], [...(m.get(r[key]) ?? []), r.path]);
  return [...m].filter(([, v]) => v.length > 1).map(([value, pages]) => ({ value, pages }));
};
const site = {
  robotsTxt: await (await fetch(`${base}/robots.txt`)).text(),
  notFoundStatus: (await fetch(`${base}/this-page-does-not-exist-qa`)).status,
  sitemapUrls: locs.length,
  sitemapForeignOrigin: locs.filter((l) => !l.startsWith(ORIGIN)).length,
};
const report = { site, pages: results.length, withProblems: results.filter((r) => r.problems.length), duplicateTitles: dup("title"), duplicateDescriptions: dup("description"), all: results };
if (outFile) fs.writeFileSync(outFile, JSON.stringify(report, null, 1));
console.log(JSON.stringify(site, null, 1));
const tally = new Map();
for (const r of results) for (const p of r.problems) tally.set(p.replace(/^canonical .*/, "canonical mismatch").replace(/^\d+(\/\d+)?/, "N"), (tally.get(p.replace(/^canonical .*/, "canonical mismatch").replace(/^\d+(\/\d+)?/, "N")) ?? 0) + 1);
console.log(`\n${results.length} pages; ${report.withProblems.length} with problems`);
for (const [k, v] of [...tally].sort((a, b) => b[1] - a[1])) console.log(`  ${v}× ${k}`);
console.log(`duplicate titles: ${report.duplicateTitles.length}; duplicate descriptions: ${report.duplicateDescriptions.length}`);
for (const d of report.duplicateTitles.slice(0, 15)) console.log("  T", d.value, d.pages.join(" "));
for (const d of report.duplicateDescriptions.slice(0, 15)) console.log("  D", d.value.slice(0, 60), d.pages.join(" "));

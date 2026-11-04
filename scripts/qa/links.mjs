import fs from "fs";

const base = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");
const outFile = process.argv[3];
const LIVE_RE = /^https?:\/\/(www\.)?prayagindia\.com/i;
const LOCAL_RE = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i;
const MAX_PAGES = Number(process.env.QA_MAX_PAGES ?? 4000);
const CONCURRENCY = Number(process.env.QA_CONCURRENCY ?? 6);

const sitemap = [...(await (await fetch(`${base}/sitemap.xml`)).text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
const inSitemap = new Set(sitemap);
const status = new Map();
const refs = new Map();
const issues = { hash: [], toLive: [], toLocal: [] };
const queue = [...sitemap];
const seen = new Set(queue);

function addRef(url, from) {
  if (!refs.has(url)) refs.set(url, new Set());
  if (refs.get(url).size < 5) refs.get(url).add(from);
}

async function check(url) {
  if (status.has(url)) return status.get(url);
  const p = (async () => {
    try {
      const r = await fetch(base + url, { redirect: "manual", signal: AbortSignal.timeout(120000) });
      await r.body?.cancel();
      return { code: r.status, location: r.headers.get("location") };
    } catch (e) {
      return { code: 0, location: String(e).slice(0, 80) };
    }
  })();
  status.set(url, p);
  return p;
}

const decode = (s) => s.replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"');

async function crawl(path) {
  let html;
  try {
    const r = await fetch(base + path, { signal: AbortSignal.timeout(180000) });
    status.set(path, Promise.resolve({ code: r.status, location: null }));
    if (!r.ok || !(r.headers.get("content-type") ?? "").includes("text/html")) return;
    html = await r.text();
  } catch (e) {
    status.set(path, Promise.resolve({ code: 0, location: String(e).slice(0, 80) }));
    return;
  }
  html = html.replace(/<script[\s\S]*?<\/script>/gi, "");
  const checks = [];
  for (const m of html.matchAll(/<(a|img|source|video|iframe|link|script)\b[^>]*?\s(href|src|srcset|poster)="([^"]*)"/gi)) {
    const [, tag, attr, raw] = m;
    const value = decode(raw).trim();
    if (tag.toLowerCase() === "a" && attr === "href" && (value === "" || value === "#" || value.startsWith("javascript:"))) {
      issues.hash.push({ page: path, href: value || "(empty)" });
      continue;
    }
    for (const candidate of attr === "srcset" ? value.split(",").map((s) => s.trim().split(/\s+/)[0]) : [value]) {
      if (!candidate || candidate.startsWith("data:") || candidate.startsWith("mailto:") || candidate.startsWith("tel:") || candidate.startsWith("#")) continue;
      if (LIVE_RE.test(candidate)) issues.toLive.push({ page: path, tag, url: candidate });
      if (LOCAL_RE.test(candidate)) issues.toLocal.push({ page: path, tag, url: candidate });
      let url;
      try {
        const u = new URL(candidate, base + path);
        if (u.origin !== new URL(base).origin) continue;
        url = u.pathname + u.search;
      } catch {
        continue;
      }
      if (url.startsWith("/_next/image")) continue;
      addRef(url, path);
      checks.push(check(url));
      const isPage = tag.toLowerCase() === "a" && !/\.(pdf|webp|png|jpe?g|svg|gif|mp4|webm|zip)$/i.test(url.split("?")[0]);
      if (isPage && !seen.has(url) && seen.size < MAX_PAGES) {
        seen.add(url);
        queue.push(url);
      }
    }
  }
  await Promise.all(checks);
}

let done = 0;
async function worker() {
  while (queue.length) {
    const path = queue.shift();
    await crawl(path);
    if (++done % 200 === 0) console.error(`… ${done} pages crawled, ${queue.length} queued`);
  }
}
await Promise.all(Array.from({ length: CONCURRENCY }, worker));

const resolved = await Promise.all([...status].map(async ([url, p]) => [url, await p]));
const broken = [];
const redirected = [];
for (const [url, s] of resolved) {
  const from = [...(refs.get(url) ?? [])];
  if (s.code >= 400 || s.code === 0) broken.push({ url, code: s.code, from });
  else if (s.code >= 300) redirected.push({ url, code: s.code, to: s.location, from });
}
const undiscovered = [...seen].filter((u) => !inSitemap.has(u) && !u.includes("?"));
const report = { base, pagesCrawled: done, urlsChecked: resolved.length, broken, redirected, ...issues, undiscovered };
if (outFile) fs.writeFileSync(outFile, JSON.stringify(report, null, 1));
console.log(`crawled ${done} pages, checked ${resolved.length} URLs`);
for (const k of ["broken", "redirected", "hash", "toLive", "toLocal", "undiscovered"]) {
  console.log(`\n${k}: ${report[k].length}`);
  for (const x of report[k].slice(0, 40)) console.log("  ", JSON.stringify(x));
}

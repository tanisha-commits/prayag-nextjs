import { createRequire } from "module";

const require = createRequire((process.env.PLAYWRIGHT_DIR ?? process.cwd()).replace(/\/?$/, "/"));
const { chromium } = require("playwright");

export const LIVE = "https://prayagindia.com";
export const LOCAL = process.env.QA_BASE ?? "http://localhost:3000";
export const WIDTHS = [375, 390, 768, 1366, 1440, 1920];

export function launch() {
  return chromium.launch({ executablePath: process.env.CHROME_PATH ?? "/usr/bin/google-chrome" });
}

export async function sitemapPaths(base = LOCAL) {
  const xml = await (await fetch(`${base}/sitemap.xml`)).text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
}

export async function settle(page) {
  await page.evaluate(async () => {
    for (let y = 0, n = 0; y < document.documentElement.scrollHeight && n < 120; y += 600, n++) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(500);
}

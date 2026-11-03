// Shared Playwright loader for the QA scripts. Playwright is not a project dependency; point
// PLAYWRIGHT_DIR at a directory whose node_modules holds it (e.g. the global @playwright/cli install:
// PLAYWRIGHT_DIR=$(npm root -g)/@playwright/cli). Uses the system Chrome.
import { createRequire } from "module";

const require = createRequire((process.env.PLAYWRIGHT_DIR ?? process.cwd()).replace(/\/?$/, "/"));
const { chromium } = require("playwright");

export const LIVE = "https://prayagindia.com";
export const LOCAL = process.env.QA_BASE ?? "http://localhost:3000";
export const WIDTHS = [375, 390, 768, 1366, 1440, 1920];

export function launch() {
  return chromium.launch({ executablePath: process.env.CHROME_PATH ?? "/usr/bin/google-chrome" });
}

/** Paths from the local sitemap (production URLs rewritten to paths). */
export async function sitemapPaths(base = LOCAL) {
  const xml = await (await fetch(`${base}/sitemap.xml`)).text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
}

/** Scroll to the bottom in steps so lazy images load, then back to the top. */
export async function settle(page) {
  await page.evaluate(async () => {
    // Capped: pages that grow while scrolling (lazy sections) must not loop forever.
    for (let y = 0, n = 0; y < document.documentElement.scrollHeight && n < 120; y += 600, n++) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(500);
}

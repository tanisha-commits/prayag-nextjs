// Start-up tasks for the content system (called from src/instrumentation.ts).
import { timingSafeEqual } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { BASE_PATH } from "@/lib/base-path";
import { importContent } from "./store";

const SYNC_FILE = "content-sync.json";

/**
 * Merge content-sync.json (written into the deploy package by `npm run deploy:package`) into this
 * server's database: an entry is applied only when it is newer than the server's own copy, so
 * edits made in the live admin since the last export are kept. The file is deleted afterwards.
 */
export function applyContentSync() {
  const file = path.resolve(/* turbopackIgnore: true */ process.cwd(), SYNC_FILE);
  if (!fs.existsSync(file)) return;
  try {
    const result = importContent(JSON.parse(fs.readFileSync(file, "utf8")));
    console.log(`[content-sync] applied ${result.applied}, kept ${result.kept} newer server edit(s)${result.skipped.length ? `, skipped invalid: ${result.skipped.join(", ")}` : ""}.`);
    try {
      fs.rmSync(file);
    } catch {
      console.warn(`[content-sync] could not delete ${file}; re-applying it is harmless.`);
    }
  } catch (e) {
    console.error(`[content-sync] not applied (${file} kept): ${(e as Error).message}`);
  }
}

/** Shared secret for the internal refresh call (never leaves this machine). */
export function revalidateSecretMatches(given: string | null): boolean {
  const secret = process.env.BETTER_AUTH_SECRET ?? "";
  if (!secret || !given) return false;
  const a = Buffer.from(given);
  const b = Buffer.from(secret);
  return a.length === b.length && timingSafeEqual(a, b);
}

/**
 * Pages are pre-rendered at build time from the build machine's database. Once this server is
 * listening, ask it to re-render them from its own database (content and catalog edits made on the
 * live admin), so a deploy never shows older content.
 */
export function scheduleRevalidateAll() {
  const secret = process.env.BETTER_AUTH_SECRET;
  if (!secret || process.env.NEXT_PHASE === "phase-production-build") return;
  const host = !process.env.HOSTNAME || process.env.HOSTNAME === "0.0.0.0" || process.env.HOSTNAME === "::" ? "127.0.0.1" : process.env.HOSTNAME;
  const url = `http://${host}:${process.env.PORT || 3000}${BASE_PATH}/api/internal/revalidate`;
  let tries = 0;
  const attempt = () => {
    tries++;
    fetch(url, { method: "POST", headers: { "x-prayag-revalidate": secret } })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        console.log("[startup] pages refreshed from this server's database.");
      })
      .catch((e: Error) => {
        if (tries < 5) setTimeout(attempt, 3000).unref();
        else console.warn(`[startup] could not refresh pages (${e.message}); they refresh on the next admin save.`);
      });
  };
  setTimeout(attempt, 2000).unref();
}

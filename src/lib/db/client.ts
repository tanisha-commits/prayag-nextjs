import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import * as schema from "./schema";

// Plain module so CLI scripts (tsx) can use it; app code imports ./index (server-only) instead.
// turbopackIgnore: the database is a runtime file; do not trace the project into the server bundle.
export const dbPath = path.resolve(/* turbopackIgnore: true */ process.cwd(), process.env.PRAYAG_DB_PATH || "data/prayag.db");

export function openDb(file = dbPath) {
  if (file !== ":memory:") fs.mkdirSync(path.dirname(file), { recursive: true });
  const sqlite = new Database(file);
  sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("foreign_keys = ON");
  return { sqlite, db: drizzle(sqlite, { schema }) };
}

export type Db = ReturnType<typeof openDb>["db"];

export function migrateDb(db: Db) {
  migrate(db, { migrationsFolder: path.join(/* turbopackIgnore: true */ process.cwd(), "drizzle") });
}

// One connection per server process (kept on globalThis so dev hot reloads do not open more).
const globalForDb = globalThis as unknown as { prayagDb?: ReturnType<typeof openDb> };

export function getDb() {
  return (globalForDb.prayagDb ??= openDb()).db;
}

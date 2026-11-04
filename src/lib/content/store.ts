// Content storage shared by the website, the admin, the local MCP server (scripts/mcp) and the
// sync scripts. Plain module (no server-only / next imports) so CLI code can use it.
//
// Rules: a missing row means "built-in default"; every save is validated by the entry's zod schema
// and written with an audit_log row in one transaction; removing a blog post leaves a tombstone
// (deletedAt) so the removal travels with content sync.
import fs from "node:fs";
import path from "node:path";
import type Database from "better-sqlite3";
import { z } from "zod";
import { openDb } from "@/lib/db/client";
import { mapHtml, sanitizeContentHtml } from "./fields";
import { LISTS, SINGLETONS, SLUG, isList, isSingleton, type BlogPost, type ListId, type SingletonData, type SingletonId } from "./schemas";

export type ContentRow = {
  collection: string;
  key: string;
  data: unknown;
  updatedAt: number;
  updatedBy: string;
  deletedAt: number | null;
};

type Sqlite = Database.Database;

const DDL = `CREATE TABLE IF NOT EXISTS content_entries (
  collection text NOT NULL,
  key text NOT NULL,
  data text NOT NULL,
  updated_at integer NOT NULL,
  updated_by text NOT NULL,
  deleted_at integer,
  PRIMARY KEY(collection, key)
)`;

let shared: Sqlite | undefined;
const ensured = new WeakSet<Sqlite>();

/** The process-wide connection (same file as the catalog), with the content table ensured. */
export function contentDb(sqlite?: Sqlite): Sqlite {
  const db = sqlite ?? (shared ??= (globalThis as { prayagDb?: { sqlite: Sqlite } }).prayagDb?.sqlite ?? openDb().sqlite);
  if (!ensured.has(db)) {
    // Servers updated by upload do not run migrations; the table is created on first use instead
    // (same definition as drizzle/0001_content_entries.sql).
    db.exec(DDL);
    ensured.add(db);
  }
  return db;
}

function toRow(r: { collection: string; key: string; data: string; updated_at: number; updated_by: string; deleted_at: number | null }): ContentRow {
  return { collection: r.collection, key: r.key, data: JSON.parse(r.data), updatedAt: r.updated_at, updatedBy: r.updated_by, deletedAt: r.deleted_at };
}

export function getRow(collection: string, key: string, db = contentDb()): ContentRow | undefined {
  const r = db.prepare("SELECT * FROM content_entries WHERE collection = ? AND key = ?").get(collection, key) as Parameters<typeof toRow>[0] | undefined;
  return r && toRow(r);
}

export function allRows(db = contentDb()): ContentRow[] {
  return (db.prepare("SELECT * FROM content_entries ORDER BY collection, key").all() as Parameters<typeof toRow>[0][]).map(toRow);
}

function split(id: SingletonId): [string, string] {
  const i = id.indexOf("/");
  return [id.slice(0, i), id.slice(i + 1)];
}

// ---------- reads ----------

/**
 * Current value of a single-document entry: the saved row when it still validates, else the
 * built-in default (an invalid row is reported, never rendered).
 */
export function readSingleton<K extends SingletonId>(id: K, db?: Sqlite): { data: SingletonData<K>; source: "saved" | "default"; updatedAt?: number; updatedBy?: string } {
  const def = SINGLETONS[id];
  let row: ContentRow | undefined;
  try {
    row = getRow(...split(id), db);
  } catch (e) {
    console.error(`[content] ${id}: could not read (${(e as Error).message}); using the default`);
  }
  if (row && row.deletedAt === null) {
    const parsed = def.schema.safeParse(row.data);
    if (parsed.success) return { data: parsed.data as SingletonData<K>, source: "saved", updatedAt: row.updatedAt, updatedBy: row.updatedBy };
    console.error(`[content] ${id}: saved value no longer valid; using the default`);
  }
  return { data: def.schema.parse(def.default()) as SingletonData<K>, source: "default" };
}

const BLOG_DIR = "src/content/prayag/blog/articles";

/** Built-in blog posts (the imported articles), slug → post. Read once per process. */
let builtInBlog: Map<string, BlogPost> | undefined;
export function builtInBlogPosts(): Map<string, BlogPost> {
  if (builtInBlog) return builtInBlog;
  // Not turbopackIgnore'd: the build must trace these files into the standalone output.
  const dir = path.join(process.cwd(), BLOG_DIR);
  const map = new Map<string, BlogPost>();
  if (fs.existsSync(dir)) {
    for (const file of fs.readdirSync(dir)) {
      if (!file.endsWith(".json")) continue;
      const { slug, ...post } = JSON.parse(fs.readFileSync(path.join(dir, file), "utf8")) as BlogPost & { slug: string };
      map.set(slug, post);
    }
  }
  return (builtInBlog = map);
}

export type ListEntry = { key: string; data: BlogPost; source: "saved" | "default"; updatedAt?: number; updatedBy?: string };

/** Entries of a list collection: built-in posts overlaid with saved rows, minus removed ones. */
export function readList(id: ListId, db?: Sqlite): ListEntry[] {
  const out = new Map<string, ListEntry>();
  for (const [key, data] of builtInBlogPosts()) out.set(key, { key, data, source: "default" });
  let rows: ContentRow[] = [];
  try {
    rows = (db ?? contentDb()).prepare("SELECT * FROM content_entries WHERE collection = ?").all(id).map((r) => toRow(r as Parameters<typeof toRow>[0]));
  } catch (e) {
    console.error(`[content] ${id}: could not read (${(e as Error).message}); using built-in entries`);
  }
  for (const row of rows) {
    if (row.deletedAt !== null) {
      out.delete(row.key);
      continue;
    }
    const parsed = LISTS[id].schema.safeParse(row.data);
    if (parsed.success) out.set(row.key, { key: row.key, data: parsed.data, source: "saved", updatedAt: row.updatedAt, updatedBy: row.updatedBy });
    else console.error(`[content] ${id}/${row.key}: saved value no longer valid; skipped`);
  }
  return [...out.values()];
}

export function readListEntry(id: ListId, key: string, db?: Sqlite): ListEntry | undefined {
  return readList(id, db).find((e) => e.key === key);
}

// ---------- writes ----------

export class ContentError extends Error {
  constructor(
    message: string,
    public issues?: { path: string; message: string }[],
  ) {
    super(message);
  }
}

function issues(error: z.ZodError) {
  return error.issues.map((i) => ({ path: i.path.join("."), message: i.message }));
}

function write(db: Sqlite, collection: string, key: string, data: unknown, actor: string, action: string, deleted: boolean) {
  const before = getRow(collection, key, db);
  const now = Date.now();
  db.transaction(() => {
    db.prepare(
      `INSERT INTO content_entries (collection, key, data, updated_at, updated_by, deleted_at) VALUES (?, ?, ?, ?, ?, ?)
       ON CONFLICT(collection, key) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at, updated_by = excluded.updated_by, deleted_at = excluded.deleted_at`,
    ).run(collection, key, JSON.stringify(data), now, actor, deleted ? now : null);
    db.prepare("INSERT INTO audit_log (actor, action, entity, entity_id, before, after, created_at) VALUES (?, ?, 'content', ?, ?, ?, ?)").run(
      actor,
      action,
      `${collection}/${key}`,
      before ? JSON.stringify(before.data) : null,
      deleted ? null : JSON.stringify(data),
      now,
    );
  })();
}

/** Validate and save an entry (singleton id like "site/contact", or a list id + key). */
export function saveEntry(target: { id: string; key?: string }, data: unknown, actor: string, db = contentDb()) {
  if (isSingleton(target.id)) {
    const schema = SINGLETONS[target.id].schema;
    const parsed = schema.safeParse(mapHtml(schema, data, sanitizeContentHtml));
    if (!parsed.success) throw new ContentError("Some fields are not valid.", issues(parsed.error));
    const [collection, key] = split(target.id);
    write(db, collection, key, parsed.data, actor, "content.update", false);
    return parsed.data;
  }
  if (isList(target.id)) {
    const key = target.key ?? "";
    if (!SLUG.test(key) || key.length > 120) throw new ContentError("The key must be lower-case words joined by hyphens (it becomes the URL).");
    const schema = LISTS[target.id].schema;
    const parsed = schema.safeParse(mapHtml(schema, data, sanitizeContentHtml));
    if (!parsed.success) throw new ContentError("Some fields are not valid.", issues(parsed.error));
    const exists = readListEntry(target.id, key, db);
    if (!exists) assertFreeRootSlug(key, db);
    write(db, target.id, key, parsed.data, actor, exists ? "content.update" : "content.create", false);
    return parsed.data;
  }
  throw new ContentError(`Unknown content entry "${target.id}".`);
}

/**
 * Blog posts, products, categories and pages all live at /<slug>: a new post may not take a slug
 * that is already in use.
 */
function assertFreeRootSlug(slug: string, db: Sqlite) {
  const pages = path.join(process.cwd(), "src/app/(pages)");
  // "new" and "import" are admin pages under /admin/content/blog/.
  const reserved = new Set(["admin", "api", "products", "blog", "search", "_next", "sites", "media", "new", "import"]);
  if (fs.existsSync(pages)) for (const d of fs.readdirSync(pages)) if (!d.startsWith("[")) reserved.add(d);
  const taken =
    reserved.has(slug) ||
    !!db.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'products'").get() &&
      (!!db.prepare("SELECT 1 FROM products WHERE slug = ?").get(slug) || !!db.prepare("SELECT 1 FROM categories WHERE slug = ? OR slug LIKE ?").get(slug, `${slug}/%`));
  if (taken) throw new ContentError(`"/${slug}" is already used by a page, product or category. Choose another slug.`);
}

/** Singleton: back to the built-in default. List entry: removed (tombstone). */
export function deleteEntry(target: { id: string; key?: string }, actor: string, db = contentDb()) {
  if (isSingleton(target.id)) {
    const [collection, key] = split(target.id);
    const before = getRow(collection, key, db);
    db.transaction(() => {
      db.prepare("DELETE FROM content_entries WHERE collection = ? AND key = ?").run(collection, key);
      db.prepare("INSERT INTO audit_log (actor, action, entity, entity_id, before, after, created_at) VALUES (?, 'content.reset', 'content', ?, ?, NULL, ?)").run(
        actor,
        target.id,
        before ? JSON.stringify(before.data) : null,
        Date.now(),
      );
    })();
    return;
  }
  if (isList(target.id)) {
    const key = target.key ?? "";
    if (!readListEntry(target.id, key, db)) throw new ContentError(`No ${target.id} entry "${key}".`);
    write(db, target.id, key, {}, actor, "content.delete", true);
    return;
  }
  throw new ContentError(`Unknown content entry "${target.id}".`);
}

// ---------- sync between copies of the database ----------

export const SYNC_VERSION = 1;
export type SyncFile = { version: number; exportedAt: number; entries: ContentRow[] };

export function exportContent(db = contentDb()): SyncFile {
  return { version: SYNC_VERSION, exportedAt: Date.now(), entries: allRows(db) };
}

const syncRow = z.object({
  collection: z.string().min(1).max(60),
  key: z.string().min(1).max(160),
  data: z.unknown(),
  updatedAt: z.number().int(),
  updatedBy: z.string().max(200),
  deletedAt: z.number().int().nullable(),
});
const syncFile = z.object({ version: z.literal(SYNC_VERSION), exportedAt: z.number(), entries: z.array(syncRow) });

/**
 * Merge an export into this database: an incoming entry wins only when it is newer than the local
 * one (or the local one does not exist), so edits made here since that export are kept. Entries
 * whose data does not validate are skipped and reported.
 */
export function importContent(input: unknown, db = contentDb()): { applied: number; kept: number; skipped: string[] } {
  const file = syncFile.parse(input);
  let applied = 0;
  let kept = 0;
  const skipped: string[] = [];
  const upsert = db.prepare(
    `INSERT INTO content_entries (collection, key, data, updated_at, updated_by, deleted_at) VALUES (?, ?, ?, ?, ?, ?)
     ON CONFLICT(collection, key) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at, updated_by = excluded.updated_by, deleted_at = excluded.deleted_at`,
  );
  const audit = db.prepare("INSERT INTO audit_log (actor, action, entity, entity_id, before, after, created_at) VALUES (?, 'content.sync', 'content', ?, ?, ?, ?)");
  db.transaction(() => {
    for (const row of file.entries) {
      const id = `${row.collection}/${row.key}`;
      const schema = isSingleton(id) ? SINGLETONS[id].schema : isList(row.collection) ? LISTS[row.collection].schema : null;
      const data = schema && row.deletedAt === null ? schema.safeParse(mapHtml(schema, row.data, sanitizeContentHtml)) : null;
      if (!schema || (data && !data.success)) {
        skipped.push(id);
        continue;
      }
      const local = getRow(row.collection, row.key, db);
      if (local && local.updatedAt >= row.updatedAt) {
        kept++;
        continue;
      }
      const value = data?.success ? data.data : {};
      upsert.run(row.collection, row.key, JSON.stringify(value), row.updatedAt, row.updatedBy, row.deletedAt);
      audit.run(`sync:${row.updatedBy}`, id, local ? JSON.stringify(local.data) : null, row.deletedAt === null ? JSON.stringify(value) : null, Date.now());
      applied++;
    }
  })();
  return { applied, kept, skipped };
}

import Database from "better-sqlite3";
import { beforeEach, describe, expect, it } from "vitest";
import { describe as describeFields, sanitizeContentHtml } from "@/lib/content/fields";
import { LISTS, SINGLETONS, type SingletonId } from "@/lib/content/schemas";
import { ContentError, contentDb, deleteEntry, exportContent, importContent, readList, readListEntry, readSingleton, saveEntry } from "@/lib/content/store";

function freshDb() {
  const db = new Database(":memory:");
  db.exec(`CREATE TABLE audit_log (id integer primary key autoincrement, actor text not null, action text not null, entity text not null, entity_id text not null, before text, after text, created_at integer not null default (unixepoch() * 1000));
           CREATE TABLE products (id integer primary key, slug text not null, title text, item_code text, status text, public_id text);
           CREATE TABLE categories (id integer primary key, slug text not null, name text);
           INSERT INTO products (id, slug, title, public_id) VALUES (1, '132-sink-cock', 'Sink cock', 'p1');
           INSERT INTO categories (id, slug, name) VALUES (1, 'faucets', 'Faucets');`);
  return contentDb(db);
}

const post = (title = "Hello") => ({
  title,
  published: "4-Nov-2026",
  timestamp: 1_793_800_000,
  metaTitle: null,
  description: null,
  bannerImage: "/sites/prayag/files/x.webp",
  bannerAlt: "x",
  bodyHtml: "<p>Body</p>",
  related: [],
});

let db: Database.Database;
beforeEach(() => {
  db = freshDb();
});

describe("defaults", () => {
  it("every built-in default validates and has a form description", () => {
    for (const id of Object.keys(SINGLETONS) as SingletonId[]) {
      expect(SINGLETONS[id].schema.safeParse(SINGLETONS[id].default()).success, id).toBe(true);
      expect(() => describeFields(SINGLETONS[id].schema)).not.toThrow();
    }
    expect(() => describeFields(LISTS.blog.schema)).not.toThrow();
  });

  it("unsaved entries read as the built-in content", () => {
    const r = readSingleton("site/contact", db);
    expect(r.source).toBe("default");
    expect(r.data.email).toBe("enquiry@prayagindia.in");
    expect(readList("blog", db).length).toBeGreaterThan(100);
  });
});

describe("saving", () => {
  it("validates, saves and audits", () => {
    const data = { ...readSingleton("site/contact", db).data, email: "sales@prayagindia.in" };
    saveEntry({ id: "site/contact" }, data, "tester", db);
    const r = readSingleton("site/contact", db);
    expect(r.source).toBe("saved");
    expect(r.data.email).toBe("sales@prayagindia.in");
    expect(db.prepare("SELECT actor, action, entity_id FROM audit_log").all()).toEqual([{ actor: "tester", action: "content.update", entity_id: "site/contact" }]);
  });

  it("rejects invalid data with field paths", () => {
    const data = { ...readSingleton("site/contact", db).data, email: "nope" };
    expect(() => saveEntry({ id: "site/contact" }, data, "t", db)).toThrow(ContentError);
    try {
      saveEntry({ id: "site/contact" }, data, "t", db);
    } catch (e) {
      expect((e as ContentError).issues?.[0].path).toBe("email");
    }
  });

  it("rejects script links", () => {
    const data = { ...readSingleton("site/social", db).data, facebook: "javascript:alert(1)" };
    expect(() => saveEntry({ id: "site/social" }, data, "t", db)).toThrow(ContentError);
  });

  it("sanitizes HTML fields but keeps entities", () => {
    saveEntry({ id: "pages/privacy-policy" }, { html: '<p onclick="x()">a&nbsp;b<script>bad()</script><a href="javascript:x">l</a></p>' }, "t", db);
    expect(readSingleton("pages/privacy-policy", db).data.html).toBe('<p>a&nbsp;b<a href="#">l</a></p>');
    expect(sanitizeContentHtml('<iframe src="x"></iframe><img src=x onerror=alert(1)>')).toBe("<img src=x>");
  });

  it("resetting a singleton restores the default", () => {
    saveEntry({ id: "home/insights" }, { ...readSingleton("home/insights", db).data, heading: "New" }, "t", db);
    deleteEntry({ id: "home/insights" }, "t", db);
    expect(readSingleton("home/insights", db).data.heading).toBe("Our Latest Insights");
  });
});

describe("blog posts", () => {
  it("creates, edits and removes posts", () => {
    saveEntry({ id: "blog", key: "new-post" }, post(), "t", db);
    expect(readListEntry("blog", "new-post", db)?.data.title).toBe("Hello");
    saveEntry({ id: "blog", key: "new-post" }, post("Edited"), "t", db);
    expect(readListEntry("blog", "new-post", db)?.data.title).toBe("Edited");
    deleteEntry({ id: "blog", key: "new-post" }, "t", db);
    expect(readListEntry("blog", "new-post", db)).toBeUndefined();
  });

  it("removes built-in posts with a tombstone", () => {
    const first = readList("blog", db)[0].key;
    deleteEntry({ id: "blog", key: first }, "t", db);
    expect(readListEntry("blog", first, db)).toBeUndefined();
  });

  it("refuses slugs used by pages, products and categories, and malformed slugs", () => {
    for (const slug of ["faq", "132-sink-cock", "faucets", "admin"]) expect(() => saveEntry({ id: "blog", key: slug }, post(), "t", db), slug).toThrow(/already used/);
    expect(() => saveEntry({ id: "blog", key: "Bad Slug" }, post(), "t", db)).toThrow(/lower-case/);
  });
});

describe("sync", () => {
  it("applies newer entries and keeps newer local edits", () => {
    const other = freshDb();
    saveEntry({ id: "site/contact" }, { ...readSingleton("site/contact", other).data, email: "a@prayagindia.in" }, "local", other);
    saveEntry({ id: "blog", key: "synced-post" }, post(), "local", other);
    const exported = exportContent(other);

    // This copy edited the footer after the export: it must survive.
    saveEntry({ id: "site/social" }, readSingleton("site/social", db).data, "live", db);
    const r = importContent(exported, db);
    expect(r).toEqual({ applied: 2, kept: 0, skipped: [] });
    expect(readSingleton("site/contact", db).data.email).toBe("a@prayagindia.in");
    expect(readListEntry("blog", "synced-post", db)).toBeDefined();

    // Same export again: nothing newer, nothing applied.
    expect(importContent(exported, db)).toEqual({ applied: 0, kept: 2, skipped: [] });

    // A live edit newer than the export wins over it.
    saveEntry({ id: "site/contact" }, { ...readSingleton("site/contact", db).data, email: "live@prayagindia.in" }, "live", db);
    importContent(exported, db);
    expect(readSingleton("site/contact", db).data.email).toBe("live@prayagindia.in");
  });

  it("carries removals and skips invalid rows", () => {
    const other = freshDb();
    saveEntry({ id: "blog", key: "gone-post" }, post(), "local", other);
    importContent(exportContent(other), db);
    deleteEntry({ id: "blog", key: "gone-post" }, "local", other);
    const file = exportContent(other);
    file.entries.push({ collection: "site", key: "contact", data: { email: "bad" }, updatedAt: Date.now() + 1000, updatedBy: "x", deletedAt: null });
    const r = importContent(file, db);
    expect(readListEntry("blog", "gone-post", db)).toBeUndefined();
    expect(r.skipped).toEqual(["site/contact"]);
  });
});

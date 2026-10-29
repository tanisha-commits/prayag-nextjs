"use server";

import { randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prepareReconciliation } from "@/lib/admin/import-run";
import { applyCategorySuggestion, runCatalogChecks } from "@/lib/ai/assistant";
import { AuthError, requireAdmin } from "@/lib/auth/server";
import { applyChangeSet, recordPreview } from "@/lib/catalog/importer";
import { codeKey, slugify } from "@/lib/catalog/normalize";
import { reservedSlugs } from "@/lib/catalog/reserved";
import { writeReport } from "@/lib/catalog/report";
import { sanitizeHtml } from "@/lib/catalog/sanitize";
import { getDb } from "@/lib/db";
import { dbPath } from "@/lib/db/client";
import {
  aiSuggestions,
  auditLog,
  categories,
  importRuns,
  productAttributes,
  productCategories,
  productImages,
  productRelations,
  products,
} from "@/lib/db/schema";

export type ActionState = { ok: boolean; message: string; errors?: Record<string, string> } | null;

async function guard(): Promise<{ actor: string } | NonNullable<ActionState>> {
  try {
    const s = await requireAdmin();
    return { actor: s.email };
  } catch (e) {
    return { ok: false, message: e instanceof AuthError && e.status === 401 ? "Please sign in again." : "You are not allowed to do this." };
  }
}
const isState = (x: unknown): x is NonNullable<ActionState> => !!x && typeof x === "object" && "ok" in x;

const lines = (v: FormDataEntryValue | null) =>
  String(v ?? "")
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);

const productSchema = z.object({
  publicId: z.string().uuid().optional().or(z.literal("")),
  title: z.string().trim().min(2, "Title is required").max(200),
  slug: z
    .string()
    .trim()
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Lower-case letters, digits and single hyphens only")
    .optional()
    .or(z.literal("")),
  itemCode: z.string().trim().max(60).optional(),
  status: z.enum(["published", "draft", "archived"]),
  shortDescription: z.string().trim().max(600).optional(),
  descriptionHtml: z.string().max(50000).optional(),
  specsHtml: z.string().max(50000).optional(),
  sizesHtml: z.string().max(50000).optional(),
  seoTitle: z.string().trim().max(200).optional(),
  seoDescription: z.string().trim().max(400).optional(),
});

/** Create or update a product. Fields left out of the form are not touched. */
export async function saveProduct(_prev: ActionState, form: FormData): Promise<ActionState> {
  const g = await guard();
  if (isState(g)) return g;
  const parsed = productSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success)
    return { ok: false, message: "Please fix the highlighted fields.", errors: Object.fromEntries(parsed.error.issues.map((i) => [String(i.path[0]), i.message])) };
  const v = parsed.data;
  const db = getDb();
  const categoryIds = form.getAll("categoryIds").map(Number).filter(Number.isInteger);
  const attributes = lines(form.get("attributes")).map((l) => {
    const i = l.indexOf(":");
    return i > 0 ? { key: l.slice(0, i).trim().toLowerCase(), value: l.slice(i + 1).trim() } : null;
  });
  if (attributes.some((a) => !a || !a.key || !a.value)) return { ok: false, message: "Attributes must be one `key: value` per line.", errors: { attributes: "Use key: value" } };
  const images = lines(form.get("images")).map((l) => {
    const [src, alt = ""] = l.split("|").map((s) => s.trim());
    return { src, alt };
  });
  if (images.some((i) => !/^(\/|https:\/\/)/.test(i.src))) return { ok: false, message: "Image paths must start with / or https://", errors: { images: "Invalid image path" } };
  const relatedCodes = { addon: lines(form.get("addons")), related: lines(form.get("related")) };
  if (!categoryIds.length && v.status === "published") return { ok: false, message: "A published product needs at least one category.", errors: { categoryIds: "Pick a category" } };

  const existing = v.publicId ? db.select().from(products).where(eq(products.publicId, v.publicId)).get() : undefined;
  if (v.publicId && !existing) return { ok: false, message: "This product no longer exists." };
  const slug = v.slug || existing?.slug || slugify(v.title);
  const reserved = reservedSlugs(JSON.parse(fs.readFileSync(path.join(/* turbopackIgnore: true */ process.cwd(), "src/content/prayag/catalog/taxonomy.json"), "utf8")));
  if (reserved.has(slug)) return { ok: false, message: `The URL /${slug} is used by another page.`, errors: { slug: "Reserved" } };
  const clash = db.select({ publicId: products.publicId }).from(products).where(eq(products.slug, slug)).get();
  if (clash && clash.publicId !== v.publicId) return { ok: false, message: `The URL /${slug} belongs to another product.`, errors: { slug: "Already used" } };

  const values = {
    title: v.title,
    slug,
    itemCode: v.itemCode || null,
    itemCodeKey: codeKey(v.itemCode) || null,
    status: v.status,
    shortDescription: v.shortDescription || null,
    descriptionHtml: sanitizeHtml(v.descriptionHtml),
    specsHtml: sanitizeHtml(v.specsHtml),
    sizesHtml: sanitizeHtml(v.sizesHtml),
    seoTitle: v.seoTitle || null,
    seoDescription: v.seoDescription || null,
    features: lines(form.get("features")),
    applications: lines(form.get("applications")),
    highlights: lines(form.get("highlights")).map((text) => ({ text })),
    updatedAt: new Date(),
  };

  const publicId = db.transaction((tx) => {
    let id: number;
    let pid: string;
    if (existing) {
      // Keep highlight icons that the editor did not change.
      const icons = new Map(existing.highlights.map((h) => [h.text, h.icon]));
      values.highlights = values.highlights.map((h) => ({ ...h, icon: icons.get(h.text) }));
      tx.update(products).set(values).where(eq(products.id, existing.id)).run();
      id = existing.id;
      pid = existing.publicId;
    } else {
      pid = randomUUID();
      id = tx.insert(products).values({ ...values, publicId: pid, origin: "admin" }).returning({ id: products.id }).get().id;
    }
    tx.delete(productCategories).where(eq(productCategories.productId, id)).run();
    categoryIds.forEach((categoryId, i) => tx.insert(productCategories).values({ productId: id, categoryId, isPrimary: i === 0 }).run());
    const kept = tx.select().from(productAttributes).where(eq(productAttributes.productId, id)).all();
    tx.delete(productAttributes).where(eq(productAttributes.productId, id)).run();
    for (const a of attributes as { key: string; value: string }[]) {
      const before = kept.find((k) => k.key === a.key && k.valueSlug === slugify(a.value));
      tx.insert(productAttributes)
        .values({ productId: id, key: a.key, value: a.value, valueSlug: slugify(a.value), hex: before?.hex ?? null, source: before?.source ?? "admin" })
        .onConflictDoNothing()
        .run();
    }
    tx.delete(productImages).where(eq(productImages.productId, id)).run();
    images.forEach((img, i) => tx.insert(productImages).values({ productId: id, src: img.src, alt: img.alt, sortOrder: i }).run());
    tx.delete(productRelations).where(eq(productRelations.productId, id)).run();
    for (const kind of ["addon", "related"] as const)
      relatedCodes[kind].forEach((code, i) => {
        const other = tx.select({ id: products.id }).from(products).where(eq(products.itemCodeKey, codeKey(code))).all();
        if (other.length === 1 && other[0].id !== id) tx.insert(productRelations).values({ productId: id, relatedId: other[0].id, kind, sortOrder: i }).run();
      });
    tx.insert(auditLog)
      .values({ actor: g.actor, action: existing ? "product.update" : "product.create", entity: "product", entityId: pid, before: existing ? { title: existing.title, status: existing.status, slug: existing.slug } : null, after: { title: values.title, status: values.status, slug, categoryIds } })
      .run();
    return pid;
  });
  revalidatePath("/", "layout");
  if (!existing) redirect(`/admin/products/${publicId}?created=1`);
  return { ok: true, message: "Saved." };
}

/** Publish / unpublish (draft) / archive one or more products. */
export async function setProductStatus(_prev: ActionState, form: FormData): Promise<ActionState> {
  const g = await guard();
  if (isState(g)) return g;
  const status = z.enum(["published", "draft", "archived"]).safeParse(form.get("status"));
  const ids = form.getAll("publicId").map(String).filter((s) => z.string().uuid().safeParse(s).success);
  if (!status.success || !ids.length) return { ok: false, message: "Nothing selected." };
  if (status.data === "archived" && form.get("confirm") !== "yes") return { ok: false, message: "Confirm archiving first." };
  const db = getDb();
  let blocked = 0;
  db.transaction((tx) => {
    for (const pid of ids) {
      const p = tx.select().from(products).where(eq(products.publicId, pid)).get();
      if (!p) continue;
      if (status.data === "published" && !tx.select().from(productCategories).where(eq(productCategories.productId, p.id)).get()) {
        blocked++;
        continue;
      }
      tx.update(products).set({ status: status.data, updatedAt: new Date() }).where(eq(products.id, p.id)).run();
      tx.insert(auditLog).values({ actor: g.actor, action: `product.${status.data}`, entity: "product", entityId: pid, before: { status: p.status }, after: { status: status.data } }).run();
    }
  });
  revalidatePath("/", "layout");
  return { ok: true, message: `${ids.length - blocked} product(s) set to ${status.data}.${blocked ? ` ${blocked} skipped: no category.` : ""}` };
}

const categorySchema = z.object({
  id: z.coerce.number().int().positive().optional().or(z.literal("")),
  name: z.string().trim().min(2).max(120),
  slug: z.string().trim().regex(/^[a-z0-9]+(?:[-/][a-z0-9]+)*$/, "Lower-case words separated by - or /"),
  parentId: z.coerce.number().int().positive().optional().or(z.literal("")),
  published: z.enum(["on"]).optional(),
  description: z.string().trim().max(2000).optional(),
  seoTitle: z.string().trim().max(200).optional(),
  seoDescription: z.string().trim().max(400).optional(),
});

export async function saveCategory(_prev: ActionState, form: FormData): Promise<ActionState> {
  const g = await guard();
  if (isState(g)) return g;
  const parsed = categorySchema.safeParse(Object.fromEntries(form));
  if (!parsed.success)
    return { ok: false, message: "Please fix the highlighted fields.", errors: Object.fromEntries(parsed.error.issues.map((i) => [String(i.path[0]), i.message])) };
  const v = parsed.data;
  const db = getDb();
  const id = v.id || undefined;
  const parentId = v.parentId || null;
  if (id && parentId === id) return { ok: false, message: "A category cannot be its own parent." };
  const clash = db.select({ id: categories.id }).from(categories).where(eq(categories.slug, v.slug)).get();
  if (clash && clash.id !== id) return { ok: false, message: "That URL is used by another category.", errors: { slug: "Already used" } };
  const values = { name: v.name, slug: v.slug, parentId, published: v.published === "on", description: v.description || null, seoTitle: v.seoTitle || null, seoDescription: v.seoDescription || null, updatedAt: new Date() };
  db.transaction((tx) => {
    const before = id ? tx.select().from(categories).where(eq(categories.id, id)).get() : undefined;
    if (id) tx.update(categories).set(values).where(eq(categories.id, id)).run();
    else tx.insert(categories).values(values).run();
    tx.insert(auditLog).values({ actor: g.actor, action: id ? "category.update" : "category.create", entity: "category", entityId: String(id ?? v.slug), before: before ?? null, after: values }).run();
  });
  revalidatePath("/", "layout");
  return { ok: true, message: "Category saved." };
}

/** Run the sheet reconciliation and store it as a preview (nothing in the catalog changes). */
export async function previewImport(): Promise<ActionState> {
  const g = await guard();
  if (isState(g)) return g;
  const db = getDb();
  const prep = prepareReconciliation(db);
  if (!prep.ok) return { ok: false, message: prep.message };
  const runId = recordPreview(db, prep.cs, prep.sourceFile, prep.hash, g.actor);
  writeReport(path.join(/* turbopackIgnore: true */ process.cwd(), "data/catalog/reports"), runId, { records: prep.records, mappings: prep.mappings, cs: prep.cs, hash: prep.hash, db });
  revalidatePath("/admin/import");
  return { ok: true, message: `Preview run ${runId} recorded. Review it below before applying.` };
}

/** Apply a previewed run: verified mapping updates + new drafts only, after a database backup. */
export async function applyImport(_prev: ActionState, form: FormData): Promise<ActionState> {
  const g = await guard();
  if (isState(g)) return g;
  const runId = Number(form.get("runId"));
  if (form.get("confirm") !== "APPLY") return { ok: false, message: 'Type APPLY to confirm.' };
  const db = getDb();
  const run = db.select().from(importRuns).where(eq(importRuns.id, runId)).get();
  if (!run || run.status !== "preview") return { ok: false, message: "That run is not an open preview." };
  const prep = prepareReconciliation(db);
  if (!prep.ok) return { ok: false, message: prep.message };
  if (prep.hash !== run.sourceHash) return { ok: false, message: "The source or the approved mappings changed since this preview. Run a new preview." };
  for (const k of ["category", "new"])
    if ((prep.cs.counts[k] ?? 0) !== (run.summary[k] ?? 0)) return { ok: false, message: "The catalog changed since this preview. Run a new preview." };
  const backups = path.join(/* turbopackIgnore: true */ process.cwd(), "data/backups");
  fs.mkdirSync(backups, { recursive: true });
  const backupPath = path.join(backups, `prayag-before-run-${runId}-${Date.now()}.db`);
  const { openDb } = await import("@/lib/db/client");
  const conn = openDb(dbPath);
  await conn.sqlite.backup(backupPath);
  conn.sqlite.close();
  db.update(importRuns).set({ backupPath }).where(eq(importRuns.id, runId)).run();
  const result = applyChangeSet(db, prep.cs, runId, g.actor, reservedSlugs(prep.taxonomy));
  revalidatePath("/", "layout");
  return { ok: true, message: `Applied: ${result.categoryUpdates} mapping update(s), ${result.newProducts} new draft product(s). Backup: ${path.basename(backupPath)}` };
}

/** Run the rules-based catalog checks; results wait in the suggestion queue. */
export async function runAssistant(): Promise<ActionState> {
  const g = await guard();
  if (isState(g)) return g;
  const n = runCatalogChecks(getDb());
  getDb().insert(auditLog).values({ actor: g.actor, action: "ai.checks", entity: "catalog", entityId: "all", after: { suggestions: n } }).run();
  revalidatePath("/admin/ai");
  return { ok: true, message: `${n} suggestion(s) waiting for review.` };
}

/**
 * Approve or reject a suggestion. Only an approved *category* suggestion changes data (it gives an
 * uncategorised product that category); other kinds are guidance for the editor.
 */
export async function decideSuggestion(_prev: ActionState, form: FormData): Promise<ActionState> {
  const g = await guard();
  if (isState(g)) return g;
  const id = Number(form.get("id"));
  const decision = z.enum(["approved", "rejected"]).safeParse(form.get("decision"));
  if (!Number.isInteger(id) || !decision.success) return { ok: false, message: "Invalid request." };
  const db = getDb();
  const s = db.select().from(aiSuggestions).where(and(eq(aiSuggestions.id, id), eq(aiSuggestions.status, "pending"))).get();
  if (!s) return { ok: false, message: "This suggestion was already decided." };
  let applied = false;
  db.transaction((tx) => {
    tx.update(aiSuggestions).set({ status: decision.data, decidedBy: g.actor }).where(eq(aiSuggestions.id, id)).run();
    const p = s.proposal as { categoryId?: number };
    if (decision.data === "approved" && s.kind === "category" && s.productPublicId && p.categoryId)
      applied = applyCategorySuggestion(tx as unknown as typeof db, s.productPublicId, p.categoryId);
    tx.insert(auditLog).values({ actor: g.actor, action: `ai.${decision.data}`, entity: "ai_suggestion", entityId: String(id), before: null, after: { kind: s.kind, proposal: s.proposal, applied } }).run();
  });
  revalidatePath("/", "layout");
  return { ok: true, message: `Suggestion ${decision.data}${applied ? " and category applied" : ""}.` };
}

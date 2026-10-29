import { sql } from "drizzle-orm";
import { index, integer, primaryKey, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

const timestamps = {
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().default(sql`(unixepoch() * 1000)`),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull().default(sql`(unixepoch() * 1000)`),
};

export type ProductStatus = "published" | "draft" | "archived";

/**
 * Category tree. Rows imported from Drupal keep their taxonomy term id (`drupalTid`) so repeated
 * imports update the same row; admin-created categories have none.
 */
export const categories = sqliteTable(
  "categories",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    parentId: integer("parent_id"),
    drupalTid: integer("drupal_tid"),
    description: text("description"),
    seoTitle: text("seo_title"),
    seoDescription: text("seo_description"),
    sortOrder: integer("sort_order").notNull().default(0),
    published: integer("published", { mode: "boolean" }).notNull().default(true),
    ...timestamps,
  },
  (t) => [uniqueIndex("categories_slug").on(t.slug), uniqueIndex("categories_drupal_tid").on(t.drupalTid)],
);

/**
 * Products. `publicId` is the stable identity used in URLs of the API, the admin, Redux state and
 * relations; it never changes. `drupalNid` ties a row to its live-site node so the importer
 * recognises it again. `itemCode` is the manufacturer code (not unique on the live site).
 */
export const products = sqliteTable(
  "products",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    publicId: text("public_id").notNull(),
    slug: text("slug").notNull(),
    itemCode: text("item_code"),
    itemCodeKey: text("item_code_key"),
    title: text("title").notNull(),
    shortDescription: text("short_description"),
    descriptionHtml: text("description_html"),
    specsHtml: text("specs_html"),
    sizesHtml: text("sizes_html"),
    features: text("features", { mode: "json" }).$type<string[]>().notNull().default(sql`'[]'`),
    applications: text("applications", { mode: "json" }).$type<string[]>().notNull().default(sql`'[]'`),
    highlights: text("highlights", { mode: "json" }).$type<{ text: string; icon?: string }[]>().notNull().default(sql`'[]'`),
    seoTitle: text("seo_title"),
    seoDescription: text("seo_description"),
    status: text("status").$type<ProductStatus>().notNull().default("published"),
    drupalNid: integer("drupal_nid"),
    origin: text("origin").$type<"live-site" | "sheet" | "admin">().notNull(),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("products_public_id").on(t.publicId),
    uniqueIndex("products_slug").on(t.slug),
    uniqueIndex("products_drupal_nid").on(t.drupalNid),
    index("products_item_code_key").on(t.itemCodeKey),
    index("products_status").on(t.status),
  ],
);

export const productCategories = sqliteTable(
  "product_categories",
  {
    productId: integer("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
    categoryId: integer("category_id").notNull().references(() => categories.id, { onDelete: "restrict" }),
    isPrimary: integer("is_primary", { mode: "boolean" }).notNull().default(false),
  },
  (t) => [primaryKey({ columns: [t.productId, t.categoryId] }), index("product_categories_category").on(t.categoryId)],
);

/**
 * Filterable attributes (series, collection, type, colour, finish, range, capacity, size…).
 * `source` records where a value came from ("live-site", "sheet:<tab>:<row>", "admin").
 */
export const productAttributes = sqliteTable(
  "product_attributes",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    productId: integer("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
    key: text("key").notNull(),
    value: text("value").notNull(),
    valueSlug: text("value_slug").notNull(),
    hex: text("hex"),
    source: text("source").notNull(),
  },
  (t) => [
    uniqueIndex("product_attributes_unique").on(t.productId, t.key, t.valueSlug),
    index("product_attributes_filter").on(t.key, t.valueSlug),
  ],
);

export const productImages = sqliteTable(
  "product_images",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    productId: integer("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
    src: text("src").notNull(),
    alt: text("alt").notNull().default(""),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (t) => [index("product_images_product").on(t.productId)],
);

/** Add-ons and related products. None exist on the source site yet; managed in the admin. */
export const productRelations = sqliteTable(
  "product_relations",
  {
    productId: integer("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
    relatedId: integer("related_id").notNull().references(() => products.id, { onDelete: "cascade" }),
    kind: text("kind").$type<"addon" | "related">().notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (t) => [primaryKey({ columns: [t.productId, t.relatedId, t.kind] })],
);

/** One previewed or applied import. Re-running the same source produces an identical change set. */
export const importRuns = sqliteTable("import_runs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  source: text("source").notNull(),
  sourceHash: text("source_hash").notNull(),
  status: text("status").$type<"preview" | "applied" | "failed">().notNull(),
  summary: text("summary", { mode: "json" }).$type<Record<string, number>>().notNull(),
  actor: text("actor").notNull(),
  backupPath: text("backup_path"),
  createdAt: timestamps.createdAt,
  appliedAt: integer("applied_at", { mode: "timestamp_ms" }),
});

export const importChanges = sqliteTable(
  "import_changes",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    runId: integer("run_id").notNull().references(() => importRuns.id, { onDelete: "cascade" }),
    action: text("action").notNull(),
    productPublicId: text("product_public_id"),
    itemCode: text("item_code"),
    sourceRef: text("source_ref"),
    reason: text("reason").notNull(),
    before: text("before", { mode: "json" }),
    after: text("after", { mode: "json" }),
    applied: integer("applied", { mode: "boolean" }).notNull().default(false),
  },
  (t) => [index("import_changes_run").on(t.runId)],
);

export const auditLog = sqliteTable(
  "audit_log",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    actor: text("actor").notNull(),
    action: text("action").notNull(),
    entity: text("entity").notNull(),
    entityId: text("entity_id").notNull(),
    before: text("before", { mode: "json" }),
    after: text("after", { mode: "json" }),
    at: timestamps.createdAt,
  },
  (t) => [index("audit_log_entity").on(t.entity, t.entityId)],
);

/** AI proposals wait here for an admin decision; they never change product rows by themselves. */
export const aiSuggestions = sqliteTable("ai_suggestions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  productPublicId: text("product_public_id"),
  kind: text("kind").notNull(),
  proposal: text("proposal", { mode: "json" }).notNull(),
  basis: text("basis").notNull(),
  provider: text("provider").notNull(),
  status: text("status").$type<"pending" | "approved" | "rejected">().notNull().default("pending"),
  decidedBy: text("decided_by"),
  createdAt: timestamps.createdAt,
});

/* ---------- Better Auth (email + password, admin plugin) ---------- */

export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" }).notNull().default(false),
  image: text("image"),
  role: text("role"),
  banned: integer("banned", { mode: "boolean" }),
  banReason: text("ban_reason"),
  banExpires: integer("ban_expires", { mode: "timestamp_ms" }),
  ...timestamps,
});

export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  token: text("token").notNull().unique(),
  expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  impersonatedBy: text("impersonated_by"),
  ...timestamps,
});

export const account = sqliteTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: integer("access_token_expires_at", { mode: "timestamp_ms" }),
  refreshTokenExpiresAt: integer("refresh_token_expires_at", { mode: "timestamp_ms" }),
  scope: text("scope"),
  password: text("password"),
  ...timestamps,
});

export const verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
  ...timestamps,
});

export const rateLimit = sqliteTable("rate_limit", {
  id: text("id").primaryKey(),
  key: text("key").notNull().unique(),
  count: integer("count").notNull(),
  lastRequest: integer("last_request").notNull(),
});

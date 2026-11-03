import type { MetadataRoute } from "next";
import { and, eq, isNull } from "drizzle-orm";
import { SITE_URL } from "@/components/sites/prayag/seo";
import { blogIndex } from "@/lib/blog";
import { getDb } from "@/lib/db";
import { categories, products } from "@/lib/db/schema";

// Every indexable page: the hand-built pages, top-level category landings, published products and
// blog articles. Nested category paths (/kitchen-sinks/quartz) are local filter views the live site
// does not serve, and search/admin/API routes are not pages, so none of them are listed.
const STATIC_PATHS = [
  "/",
  "/products",
  "/about-prayag",
  "/ceo-profile",
  "/sustainability",
  "/manufacturing-process",
  "/dealership-enquiry",
  "/contact-us",
  "/blog",
  "/press-coverages",
  "/product-video",
  "/video-tv-advertisement",
  "/feedback-videos",
  "/warranty-policy",
  "/download-cataglogue",
  "/faq",
  "/privacy-policy",
  "/prayag-ka-bablu-plumbers-loyalty-program",
  "/plumbing-solutions",
  "/hdpe",
  "/agritech",
  "/swr-plumbing-solution",
  "/cpvc-plumbing-solution",
  "/casing-pipes",
  "/composite-pipes",
  "/ugd-pipes-fittings",
  "/upvc-column-pipes",
  "/ppr-pipes",
  "/pvc-o-pipes",
];

// Rebuilt at most hourly, so catalog edits in the admin reach the sitemap without a deploy.
export const revalidate = 3600;

export default function sitemap(): MetadataRoute.Sitemap {
  const db = getDb();
  const categoryPaths = db
    .select({ slug: categories.slug })
    .from(categories)
    .where(and(eq(categories.published, true), isNull(categories.parentId)))
    .all()
    .map((c) => `/${c.slug}`);
  const entries = new Map<string, Date | undefined>();
  for (const path of [...STATIC_PATHS, ...categoryPaths]) entries.set(path, undefined);
  for (const post of blogIndex) entries.set(`/${post.slug}`, new Date(post.timestamp * 1000));
  for (const p of db.select({ slug: products.slug, updatedAt: products.updatedAt }).from(products).where(eq(products.status, "published")).all())
    entries.set(`/${p.slug}`, p.updatedAt);
  return [...entries].map(([path, lastModified]) => ({ url: `${SITE_URL}${path === "/" ? "" : path}`, ...(lastModified ? { lastModified } : {}) }));
}

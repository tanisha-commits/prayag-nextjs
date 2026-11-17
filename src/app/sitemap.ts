import type { MetadataRoute } from "next";
import { SITE_URL } from "@/components/sites/prayag/seo";
import { blogIndex } from "@/lib/blog";
import { allCategories, allProducts } from "@/lib/catalog/queries";

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

export default function sitemap(): MetadataRoute.Sitemap {
  const categoryPaths = allCategories.filter((c) => c.published && c.parentId === null).map((c) => `/${c.slug}`);
  const entries = new Map<string, Date | undefined>();
  for (const path of [...STATIC_PATHS, ...categoryPaths]) entries.set(path, undefined);
  for (const post of blogIndex) entries.set(`/${post.slug}`, new Date(post.timestamp * 1000));
  for (const p of allProducts) if (p.status === "published") entries.set(`/${p.slug}`, p.updatedAt);
  return [...entries].map(([path, lastModified]) => ({ url: `${SITE_URL}${path === "/" ? "" : path}`, ...(lastModified ? { lastModified } : {}) }));
}

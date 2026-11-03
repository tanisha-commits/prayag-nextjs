import type { MetadataRoute } from "next";
import { SITE_URL } from "@/components/sites/prayag/seo";

// Public pages are indexable; the admin, the API and search result pages are not.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api/", "/search"] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}

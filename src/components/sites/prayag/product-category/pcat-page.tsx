import { cn } from "@/lib/utils";
import "./pcat-base.css";

/**
 * Root of a product-category page. `.pcat` carries the source theme CSS (pcat-base.css) and
 * `.pcat-<slug>` the page's own ported <style> block. Every page reuses the same source class
 * names with different rules, so each page's CSS must stay nested under its own slug class —
 * stylesheets of visited routes stay loaded during client-side navigation.
 */
export function PcatPage({ slug, children }: { slug: string; children: React.ReactNode }) {
  return <div className={cn("pcat", `pcat-${slug}`)}>{children}</div>;
}

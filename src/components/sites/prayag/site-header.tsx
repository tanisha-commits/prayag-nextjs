import { getDrawer, getHeaderMenus } from "@/lib/content";
import { SiteHeaderClient } from "./site-header-client";

/** Site header; menus come from editable content (site/header, site/drawer). */
export function SiteHeader({ variant = "overlay" }: { variant?: "overlay" | "solid" }) {
  return <SiteHeaderClient variant={variant} menus={getHeaderMenus()} drawer={getDrawer()} />;
}

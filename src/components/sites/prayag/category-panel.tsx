import { getDrawer } from "@/lib/content";
import { CategoryPanelClient } from "./category-panel-client";

/** Off-canvas "Product category" drawer; its links come from editable content (site/drawer). */
export function CategoryPanel() {
  return <CategoryPanelClient drawer={getDrawer()} />;
}

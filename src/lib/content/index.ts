import "server-only";
import { cache } from "react";
import type { MegaMenu, NavLink } from "@/components/sites/prayag/data";
import type { SingletonData, SingletonId } from "./schemas";
import { readSingleton } from "./store";

/** Current content of an entry (saved value, or the built-in default). Memoised per request. */
const read = cache((id: SingletonId) => readSingleton(id).data);
export function getContent<K extends SingletonId>(id: K): SingletonData<K> {
  return read(id) as SingletonData<K>;
}

/** Header menu in the shape the header component uses. */
export function getHeaderMenus(): (MegaMenu | NavLink)[] {
  return getContent("site/header").menus.map((m) =>
    m.links.length
      ? {
          label: m.label,
          links: m.links,
          image: m.image ?? "",
          imageSize: { width: m.imageWidth ?? 1000, height: m.imageHeight ?? 600 },
          columns: m.columns,
        }
      : { label: m.label, href: m.href ?? "/" },
  );
}

export type DrawerData = SingletonData<"site/drawer"> & { social: SingletonData<"site/social"> };

/** Side drawer / mobile-menu extras plus the social links they show. */
export function getDrawer(): DrawerData {
  return { ...getContent("site/drawer"), social: getContent("site/social") };
}

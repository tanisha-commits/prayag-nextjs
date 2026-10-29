"use client";

import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface TabGroupItem {
  /** Source tab id, if it has one (otherwise `tab-<paneId>`). */
  tabId?: string;
  paneId: string;
  label: ReactNode;
  panel: ReactNode;
}

/**
 * The source pages' vanilla tab scripts (`.prayag-specs__tab` / `.prayag-fitting-specs__tab`):
 * clicking a tab moves `active` (+ `show` on Bootstrap `.tab-pane`s) to it and its pane. Renders the
 * source `ul.nav[role=tablist]` followed by the pane container, keeping the source classes so the
 * ported CSS applies. Added: WAI-ARIA tabs pattern (aria-controls/labelledby, roving tabindex,
 * arrow keys / Home / End with automatic activation).
 */
export function TabGroup({
  items,
  listClassName,
  listId,
  listLabel,
  tabClassName,
  contentClassName,
  contentId,
  paneClassName,
  activePaneClassName,
  paneTabIndex,
}: {
  items: TabGroupItem[];
  listClassName: string;
  listId?: string;
  listLabel?: string;
  tabClassName: string;
  contentClassName: string;
  contentId?: string;
  paneClassName: string;
  /** "active" for `.prayag-specs__pane`, "show active" for Bootstrap `.tab-pane.fade`. */
  activePaneClassName: string;
  paneTabIndex?: number;
}) {
  const [selected, setSelected] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const tabIdOf = (item: TabGroupItem) => item.tabId ?? `tab-${item.paneId}`;

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const last = items.length - 1;
    const keys: Record<string, number> = {
      ArrowRight: i === last ? 0 : i + 1,
      ArrowLeft: i === 0 ? last : i - 1,
      Home: 0,
      End: last,
    };
    if (!(e.key in keys)) return;
    e.preventDefault();
    setSelected(keys[e.key]);
    tabRefs.current[keys[e.key]]?.focus();
  };

  return (
    <>
      <ul className={listClassName} id={listId} role="tablist" aria-label={listLabel}>
        {items.map((item, i) => (
          <li key={item.paneId} className="nav-item" role="presentation">
            <button
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              type="button"
              className={cn(tabClassName, i === selected && "active")}
              id={tabIdOf(item)}
              role="tab"
              aria-controls={item.paneId}
              aria-selected={i === selected}
              tabIndex={i === selected ? 0 : -1}
              onClick={() => setSelected(i)}
              onKeyDown={(e) => onKeyDown(e, i)}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
      <div className={contentClassName} id={contentId}>
        {items.map((item, i) => (
          <div
            key={item.paneId}
            className={cn(paneClassName, i === selected && activePaneClassName)}
            id={item.paneId}
            role="tabpanel"
            aria-labelledby={tabIdOf(item)}
            tabIndex={paneTabIndex}
          >
            {item.panel}
          </div>
        ))}
      </div>
    </>
  );
}

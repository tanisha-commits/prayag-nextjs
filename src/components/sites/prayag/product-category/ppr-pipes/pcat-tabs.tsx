"use client";

import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type PcatTab = {
  id: string;
  paneId: string;
  label: string;
  content: ReactNode;
};

/**
 * Source Bootstrap-markup tabs (`ul.nav > li.nav-item > button` + `.tab-content > .tab-pane.fade`)
 * driven by the page's inline script: a click moves `active` to the button and `active show` to its
 * pane. Adds the WAI-ARIA tabs keyboard pattern (roving tabindex, arrow keys / Home / End, automatic
 * activation) on top; panes stay `tabindex=0` as on the source. Sliders inside hidden panes need no
 * re-measuring (SlickCarousel lays out in percentages).
 */
export function PcatTabs({
  tabs,
  listId,
  listClassName,
  listAriaLabel,
  tabClassName,
  contentId,
  contentClassName,
}: {
  tabs: PcatTab[];
  listId: string;
  listClassName: string;
  listAriaLabel?: string;
  tabClassName: string;
  contentId: string;
  contentClassName: string;
}) {
  const [selected, setSelected] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const last = tabs.length - 1;
    const next: Record<string, number> = {
      ArrowRight: i === last ? 0 : i + 1,
      ArrowLeft: i === 0 ? last : i - 1,
      Home: 0,
      End: last,
    };
    if (!(e.key in next)) return;
    e.preventDefault();
    setSelected(next[e.key]);
    tabRefs.current[next[e.key]]?.focus();
  };

  return (
    <>
      <ul className={cn("nav", listClassName)} id={listId} role="tablist" aria-label={listAriaLabel}>
        {tabs.map((tab, i) => (
          <li key={tab.id} className="nav-item" role="presentation">
            <button
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              className={cn(tabClassName, i === selected && "active")}
              id={tab.id}
              type="button"
              role="tab"
              aria-controls={tab.paneId}
              aria-selected={i === selected}
              tabIndex={i === selected ? 0 : -1}
              onClick={() => setSelected(i)}
              onKeyDown={(e) => onKeyDown(e, i)}
            >
              {tab.label}
            </button>
          </li>
        ))}
      </ul>
      <div className={cn("tab-content", contentClassName)} id={contentId}>
        {tabs.map((tab, i) => (
          <div
            key={tab.paneId}
            className={cn("tab-pane fade", i === selected && "show active")}
            id={tab.paneId}
            role="tabpanel"
            aria-labelledby={tab.id}
            tabIndex={0}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </>
  );
}

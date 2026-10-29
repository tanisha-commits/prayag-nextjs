"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type SpecTab = {
  /** Source id suffix: the button is `#tab-<id>`, the pane `#pane-<id>`. */
  id: string;
  label: string;
  content: React.ReactNode;
};

const FADE_MS = 150; // Bootstrap `.fade { transition: opacity .15s linear }`

/**
 * Source `.prayag-specs` tab strip + `.tab-content` (shared by the cPVC and UGD pages); keeps the
 * Bootstrap classes (`active` on the tab, `fade show active` on the pane) the ported CSS targets.
 * With `fade` it reproduces Bootstrap 5.1's tab switch: the old pane fades out, then the new one
 * becomes active and fades in. Without it the classes swap at once, like cPVC's inline script.
 * Added over the source: WAI-ARIA tabs keyboard support (roving tabindex, arrow keys / Home / End
 * with automatic activation) and `aria-labelledby` + `tabindex=0` on every pane.
 */
export function SpecTabs({ tabs, fade = false }: { tabs: SpecTab[]; fade?: boolean }) {
  const [selected, setSelected] = useState(0);
  const [active, setActive] = useState(0);
  const [shown, setShown] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const timers = useRef<{ timeout?: number; frame?: number }>({});

  const cancel = () => {
    window.clearTimeout(timers.current.timeout);
    cancelAnimationFrame(timers.current.frame ?? 0);
  };
  useEffect(() => {
    const t = timers.current;
    return () => {
      window.clearTimeout(t.timeout);
      cancelAnimationFrame(t.frame ?? 0);
    };
  }, []);

  const select = (i: number, focus = false) => {
    if (focus) tabRefs.current[i]?.focus();
    if (i === selected) return;
    setSelected(i);
    if (!fade) {
      setActive(i);
      setShown(i);
      return;
    }
    // Fade the old pane out, then display the new one and fade it in on a later frame.
    cancel();
    setShown(-1);
    timers.current.timeout = window.setTimeout(() => {
      setActive(i);
      timers.current.frame = requestAnimationFrame(() => {
        timers.current.frame = requestAnimationFrame(() => setShown(i));
      });
    }, FADE_MS);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, i: number) => {
    const last = tabs.length - 1;
    const keys: Record<string, number> = {
      ArrowRight: i === last ? 0 : i + 1,
      ArrowLeft: i === 0 ? last : i - 1,
      Home: 0,
      End: last,
    };
    if (e.key in keys) {
      e.preventDefault();
      select(keys[e.key], true);
    }
  };

  return (
    <>
      <ul className="nav prayag-specs__tabs" id="prayagSpecsTabs" role="tablist">
        {tabs.map((tab, i) => (
          <li key={tab.id} className="nav-item" role="presentation">
            <button
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              className={cn("prayag-specs__tab", selected === i && "active")}
              id={`tab-${tab.id}`}
              type="button"
              role="tab"
              aria-controls={`pane-${tab.id}`}
              aria-selected={selected === i}
              tabIndex={selected === i ? 0 : -1}
              onClick={() => select(i)}
              onKeyDown={(e) => onKeyDown(e, i)}
            >
              {tab.label}
            </button>
          </li>
        ))}
      </ul>
      <div className="tab-content prayag-specs__content" id="prayagSpecsTabsContent">
        {tabs.map((tab, i) => (
          <div
            key={tab.id}
            className={cn("tab-pane fade", shown === i && "show", active === i && "active")}
            id={`pane-${tab.id}`}
            role="tabpanel"
            aria-labelledby={`tab-${tab.id}`}
            tabIndex={0}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </>
  );
}

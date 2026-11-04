"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils";

export interface SpecsTab {
  id: string;
  label: string;
  pane: React.ReactNode;
}

export function SpecsTabs({ tabs }: { tabs: SpecsTab[] }) {
  const [selected, setSelected] = useState(0);
  const [activePane, setActivePane] = useState(0);
  const [shown, setShown] = useState(true);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach((t) => clearTimeout(t)), []);

  const select = (i: number) => {
    if (i === selected) return;
    setSelected(i);
    timers.current.forEach((t) => clearTimeout(t));
    setShown(false);
    const duration = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 150;
    timers.current = [
      window.setTimeout(() => {
        setActivePane(i);
        timers.current.push(window.setTimeout(() => setShown(true), 16));
      }, duration),
    ];
  };

  const onKeyDown = (e: KeyboardEvent, i: number) => {
    const last = tabs.length - 1;
    const to =
      e.key === "ArrowRight" ? (i === last ? 0 : i + 1)
      : e.key === "ArrowLeft" ? (i === 0 ? last : i - 1)
      : e.key === "Home" ? 0
      : e.key === "End" ? last
      : null;
    if (to === null) return;
    e.preventDefault();
    select(to);
    buttons.current[to]?.focus();
  };

  return (
    <>
      <ul className="nav prayag-specs__tabs" id="prayagSpecsTabs" role="tablist">
        {tabs.map((t, i) => (
          <li key={t.id} className="nav-item" role="presentation">
            <button
              ref={(el) => {
                buttons.current[i] = el;
              }}
              className={cn("prayag-specs__tab", i === selected && "active")}
              id={`tab-${t.id}`}
              data-bs-toggle="tab"
              data-bs-target={`#pane-${t.id}`}
              type="button"
              role="tab"
              aria-controls={`pane-${t.id}`}
              aria-selected={i === selected}
              tabIndex={i === selected ? 0 : -1}
              onClick={() => select(i)}
              onKeyDown={(e) => onKeyDown(e, i)}
            >
              {t.label}
            </button>
          </li>
        ))}
      </ul>
      <div className="tab-content prayag-specs__content" id="prayagSpecsTabsContent">
        {tabs.map((t, i) => (
          <div
            key={t.id}
            className={cn("tab-pane fade", i === activePane && "active", i === activePane && shown && "show")}
            id={`pane-${t.id}`}
            role="tabpanel"
            aria-labelledby={`tab-${t.id}`}
            tabIndex={0}
          >
            {t.pane}
          </div>
        ))}
      </div>
    </>
  );
}

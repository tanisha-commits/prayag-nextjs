"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { AdvantageItem } from "./data";

/**
 * Source `.prayag-accordion`: the first card starts `active`; the page's inline script moves
 * `active` to whichever card the pointer enters (no click/keyboard handling on the source).
 * The closed cards' text stays in the DOM, so it remains available to assistive technology.
 */
export function AdvantageAccordion({ items }: { items: AdvantageItem[] }) {
  const [active, setActive] = useState(0);
  return (
    <div className="prayag-accordion">
      {items.map((item, i) => (
        <div
          key={item.num}
          className={cn("prayag-acc-card", active === i && "active")}
          onMouseEnter={() => setActive(i)}
        >
          <div className="prayag-acc-head">
            <span className="prayag-acc-num">{item.num}</span>
            <h3>{item.title}</h3>
          </div>
          <div className="prayag-acc-content">
            <p>{item.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

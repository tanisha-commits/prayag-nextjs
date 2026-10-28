"use client";

import { useEffect, useRef, useState } from "react";

import type { FaqItem, FaqTab } from "@/content/prayag/faq/faq";

import "./faq.css";

const ARROW =
  "m795.05 563.36-328.05-393.54c-13.57-16.309-37.848-18.516-54.145-4.8945-16.332 13.645-18.539 37.824-4.9453 54.145l307.55 368.93-307.55 368.9c-13.57 16.355-11.363 40.547 4.9453 54.168 16.285 13.621 40.57 11.41 54.145-4.8945l328.05-393.52c5.9766-7.1523 8.9531-15.914 8.9531-24.66 0-8.7617-2.9766-17.508-8.9531-24.637z";

/**
 * Source `section.faq`: Bootstrap vertical pills + one flush accordion per tab.
 * Initial state matches the live page: the Faucets pane is shown and every answer is collapsed; the
 * Faucets pill is *not* highlighted until a pill is chosen (the source markup omits its `active` class).
 * One answer open at a time per tab (Bootstrap `data-bs-parent`). Tabs follow the WAI-ARIA tabs pattern
 * (roving tabindex, arrow keys / Home / End, automatic activation); accordions are buttons with
 * aria-expanded / aria-controls.
 */
export function FaqTabs({ tabs }: { tabs: FaqTab[] }) {
  const [selected, setSelected] = useState(0);
  const [highlight, setHighlight] = useState(false);
  const [openItem, setOpenItem] = useState<(number | null)[]>(() => tabs.map(() => null));
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const select = (i: number, focus = false) => {
    setSelected(i);
    setHighlight(true);
    if (focus) tabRefs.current[i]?.focus();
  };

  const onTabKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, i: number) => {
    const last = tabs.length - 1;
    const next: Record<string, number> = {
      ArrowDown: i === last ? 0 : i + 1,
      ArrowRight: i === last ? 0 : i + 1,
      ArrowUp: i === 0 ? last : i - 1,
      ArrowLeft: i === 0 ? last : i - 1,
      Home: 0,
      End: last,
    };
    if (e.key in next) {
      e.preventDefault();
      select(next[e.key], true);
    }
  };

  return (
    <section className="faq">
      {/* Source `.container-fluid { overflow: hidden }` clips overflowing card text. */}
      <div className="prayag-container overflow-hidden">
        <div className="faq_content">
          <div className="faq-layout">
            <div className="nav" role="tablist" aria-orientation="vertical" aria-label="FAQ categories">
              {tabs.map((tab, i) => (
                <button
                  key={tab.label}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`faq-tab-${i + 1}`}
                  aria-controls={`faq-panel-${i + 1}`}
                  aria-selected={selected === i}
                  tabIndex={selected === i ? 0 : -1}
                  className={highlight && selected === i ? "nav-link active" : "nav-link"}
                  onClick={() => select(i)}
                  onKeyDown={(e) => onTabKeyDown(e, i)}
                >
                  {tab.label}
                  <svg viewBox="0 0 1200 1200" aria-hidden="true" focusable="false">
                    <path d={ARROW} />
                  </svg>
                </button>
              ))}
            </div>
            <div className="tab-content">
              {tabs.map((tab, t) => (
                <div
                  key={tab.label}
                  className="tab-pane"
                  id={`faq-panel-${t + 1}`}
                  role="tabpanel"
                  aria-labelledby={`faq-tab-${t + 1}`}
                  hidden={selected !== t}
                >
                  <div className="accordion">
                    {tab.items.map((item, q) => (
                      <AccordionItem
                        key={item.question}
                        id={`faq-${t + 1}-${q + 1}`}
                        item={item}
                        open={openItem[t] === q}
                        onToggle={() =>
                          setOpenItem((prev) => prev.map((v, k) => (k === t ? (v === q ? null : q) : v)))
                        }
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function AccordionItem({ id, item, open, onToggle }: { id: string; item: FaqItem; open: boolean; onToggle: () => void }) {
  const panel = useRef<HTMLDivElement>(null);
  const prev = useRef(open);

  // Bootstrap-style height transition (0.35s); `hidden` keeps closed answers out of the tab order / AT.
  useEffect(() => {
    const el = panel.current;
    if (!el || prev.current === open) return;
    prev.current = open;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const done = () => {
      el.style.height = "";
      if (!open) el.hidden = true;
    };
    if (open) el.hidden = false;
    if (reduce) return done();
    el.style.height = open ? "0px" : `${el.scrollHeight}px`;
    void el.offsetHeight; // commit the start height before transitioning
    el.style.height = open ? `${el.scrollHeight}px` : "0px";
    const timer = window.setTimeout(done, 360);
    return () => window.clearTimeout(timer);
  }, [open]);

  return (
    <div className="accordion-item">
      <h2 className="accordion-header">
        <button
          type="button"
          id={`${id}-q`}
          className="accordion-button"
          aria-expanded={open}
          aria-controls={`${id}-a`}
          onClick={onToggle}
        >
          {item.question}
        </button>
      </h2>
      <div ref={panel} id={`${id}-a`} className="accordion-collapse" role="region" aria-labelledby={`${id}-q`} hidden>
        {/* Answer HTML is copied verbatim from the source page (trusted, static content). */}
        <div className="accordion-body" dangerouslySetInnerHTML={{ __html: item.answerHtml }} />
      </div>
    </div>
  );
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { PressItem } from "@/content/prayag/press/items";
import type { ResponsiveImgProps } from "@/lib/optimized-image";

export type PressGalleryItem = PressItem & { card: ResponsiveImgProps; thumb: ResponsiveImgProps; full: ResponsiveImgProps };

import { PressLightbox } from "./press-lightbox";
import "./press.css";
import { withBasePath } from "@/lib/base-path";

const HASH = /^#gallery0-(\d+)$/;

export function PressGallery({ items }: { items: PressGalleryItem[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  const show = useCallback((i: number) => {
    setOpen(i);
    history.replaceState(null, "", `#gallery0-${i + 1}`);
  }, []);

  const close = useCallback(() => {
    setOpen(null);
    history.replaceState(null, "", window.location.pathname + window.location.search);
    returnFocus.current?.focus();
  }, []);

  useEffect(() => {
    const m = HASH.exec(window.location.hash);
    const n = m ? Number(m[1]) : 0;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync from the URL hash after hydration
    if (n >= 1 && n <= items.length) setOpen(n - 1);
  }, [items.length]);

  const opener = (i: number) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    returnFocus.current = e.currentTarget;
    show(i);
  };

  return (
    <section className="press_wrapper">
      <div className="prayag-container overflow-hidden">
        <div className="press-row">
          {items.map((item, i) => {
            const label = item.title || `Press coverage ${i + 1}`;
            return (
              <div className="press-col" key={item.image}>
                <div className="press_item">
                  <a
                    href={withBasePath(item.image)}
                    className="press-img-link"
                    onClick={opener(i)}
                    aria-label={`View image: ${label}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element -- source sizing (fixed 199/180px cover crop) on 96 press scans */}
                    <img {...item.card} alt={item.title} loading={i < 8 ? "eager" : "lazy"} decoding="async" />
                  </a>
                  {item.title ? <h3 className="press_title">{item.title}</h3> : <div className="press_title" />}
                  <p className="press_details">{item.details}</p>
                  {item.href ? (
                    <a href={withBasePath(item.href)} target="_blank" rel="noopener noreferrer" className="press-more">
                      Know More<span className="sr-only">: {label} (opens in a new tab)</span>
                    </a>
                  ) : (
                    <a href={withBasePath(item.image)} onClick={opener(i)} className="press-more">
                      Know More<span className="sr-only">: view image of {label}</span>
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {open !== null ? (
        <PressLightbox
          slides={items.map((it) => ({ src: it.image, alt: it.title, full: it.full, thumb: it.thumb }))}
          index={open}
          onIndexChange={show}
          onClose={close}
        />
      ) : null}
    </section>
  );
}

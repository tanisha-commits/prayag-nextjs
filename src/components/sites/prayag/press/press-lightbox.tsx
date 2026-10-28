"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export interface LightboxSlide {
  src: string;
  alt: string;
}

const SLIDESHOW_MS = 3000; // Fancybox v4 default `Slideshow.delay`

/**
 * Accessible image gallery modal reproducing the source's Fancybox v4 gallery (`data-fancybox="gallery0"`):
 * counter, slideshow / full-screen / thumbnails / close buttons, prev/next arrows (looping), thumbnail
 * strip, ←/→ keys, Esc to close, swipe on touch. Focus is trapped inside while open and returned to the
 * element that opened it. Fancybox's zoom button is not reproduced (it is disabled for images that already
 * fit, which is the case for most of these scans).
 */
export function PressLightbox({
  slides,
  index,
  onIndexChange,
  onClose,
}: {
  slides: LightboxSlide[];
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const thumbsRef = useRef<HTMLDivElement>(null);
  const swipeX = useRef<number | null>(null);
  const swiped = useRef(false);
  const [showThumbs, setShowThumbs] = useState(true);
  const [playing, setPlaying] = useState(false);
  const count = slides.length;
  const slide = slides[index];

  const go = useCallback((delta: number) => onIndexChange((index + delta + count) % count), [index, count, onIndexChange]);

  // Body scroll lock + initial focus on the dialog itself (like Fancybox).
  useEffect(() => {
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    return () => {
      document.body.style.overflow = overflow;
      if (document.fullscreenElement) void document.exitFullscreen();
    };
  }, []);

  useEffect(() => {
    if (!playing) return;
    const t = window.setTimeout(() => go(1), SLIDESHOW_MS);
    return () => window.clearTimeout(t);
  }, [playing, go]);

  // Keep the selected thumbnail in view.
  useEffect(() => {
    const strip = thumbsRef.current;
    const el = strip?.querySelector<HTMLElement>(`[data-i="${index}"]`);
    if (strip && el) strip.scrollTo({ left: el.offsetLeft - (strip.clientWidth - el.offsetWidth) / 2, behavior: "smooth" });
  }, [index, showThumbs]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    } else if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      go(e.key === "ArrowRight" ? 1 : -1);
    } else if (e.key === "Tab") {
      const nodes = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>("button") ?? []).filter((b) => b.tabIndex >= 0);
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === dialogRef.current)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  const toggleFullscreen = () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void dialogRef.current?.requestFullscreen?.();
  };

  return createPortal(
    <div
      ref={dialogRef}
      className="press-lb"
      role="dialog"
      aria-modal="true"
      aria-label="Press coverage gallery. Close with the Escape key."
      tabIndex={-1}
      onKeyDown={onKeyDown}
    >
      <div className="press-lb__backdrop" onClick={onClose} aria-hidden="true" />
      <div className="press-lb__toolbar">
        <div className="press-lb__items">
          <div className="press-lb__counter" aria-live="polite" aria-atomic="true">
            <span className="sr-only">Image </span>
            {index + 1}&nbsp;/&nbsp;{count}
          </div>
        </div>
        <div className="press-lb__items">
          <button
            type="button"
            className="press-lb__btn"
            title="Toggle slideshow"
            aria-pressed={playing}
            onClick={() => setPlaying((p) => !p)}
          >
            {playing ? (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M7 4v15M17 4v15" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 4v16" />
                <path d="M20 12L6 20" />
                <path d="M20 12L6 4" />
              </svg>
            )}
          </button>
          <button type="button" className="press-lb__btn" title="Toggle full-screen mode" onClick={toggleFullscreen}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3 8 V3h5" />
              <path d="M21 8V3h-5" />
              <path d="M8 21H3v-5" />
              <path d="M16 21h5v-5" />
            </svg>
          </button>
          <button
            type="button"
            className="press-lb__btn"
            title="Toggle thumbnails"
            aria-pressed={showThumbs}
            onClick={() => setShowThumbs((s) => !s)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              {[4, 12, 20].flatMap((y) => [4, 12, 20].map((x) => <circle key={`${x}-${y}`} data-dot="" cx={x} cy={y} r="1" />))}
            </svg>
          </button>
          <button type="button" className="press-lb__btn" title="Close" onClick={onClose}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20 20L4 4m16 0L4 20" />
            </svg>
          </button>
        </div>
      </div>

      <div
        className="press-lb__stage"
        onClick={(e) => {
          if (swiped.current) swiped.current = false;
          else if (e.target === e.currentTarget) onClose();
        }}
        onPointerDown={(e) => {
          swipeX.current = e.clientX;
        }}
        onPointerUp={(e) => {
          if (swipeX.current === null) return;
          const dx = e.clientX - swipeX.current;
          swipeX.current = null;
          if (Math.abs(dx) > 50) {
            swiped.current = true;
            go(dx < 0 ? 1 : -1);
          }
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- full-size press scan, natural size capped to the viewport like Fancybox */}
        <img key={slide.src} src={slide.src} alt={slide.alt} className="press-lb__image" draggable={false} />
        {/* Arrows are centred on the slide area (above the thumbnails), like Fancybox. */}
        <button type="button" className="press-lb__btn press-lb__nav press-lb__nav--prev" title="Previous" onClick={() => go(-1)}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M15 3l-9 9 9 9" />
          </svg>
        </button>
        <button type="button" className="press-lb__btn press-lb__nav press-lb__nav--next" title="Next" onClick={() => go(1)}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M9 3l9 9-9 9" />
          </svg>
        </button>
      </div>

      {showThumbs ? (
        <div ref={thumbsRef} className="press-lb__thumbs" role="group" aria-label="Thumbnails">
          {slides.map((s, i) => (
            <button
              key={s.src}
              type="button"
              data-i={i}
              className="press-lb__thumb"
              aria-label={`Show image ${i + 1} of ${count}${s.alt ? `: ${s.alt}` : ""}`}
              aria-current={i === index ? "true" : undefined}
              tabIndex={i === index ? 0 : -1}
              onClick={() => onIndexChange(i)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- 96x64 thumbnail of the same file, lazy-loaded in the scrolling strip */}
              <img src={s.src} alt="" loading="lazy" decoding="async" />
            </button>
          ))}
        </div>
      ) : null}
    </div>,
    document.body,
  );
}

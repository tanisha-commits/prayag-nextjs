"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { modalEmbedUrl, type VideoCard } from "./data";

const FADE_MS = 300; // Bootstrap .modal.fade dialog transition

/**
 * Source `section.video_wrapper` on /video-tv-advertisement: `a.video-link[data-video-id]`
 * cards opening Bootstrap modal `#exampleModal`, whose iframe gets
 * `embed/<id>?autoplay=1&feature=oembed` on click and `src=""` on hide (stops playback).
 * Closes on Esc and backdrop click like Bootstrap; adds a keyboard-visible close button,
 * keeps focus inside while open and returns it to the card that opened it.
 */
export function TvVideoGrid({ cards }: { cards: VideoCard[] }) {
  const [active, setActive] = useState<VideoCard | null>(null);
  const [shown, setShown] = useState(false);
  const [playing, setPlaying] = useState(false);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const open = (card: VideoCard, opener: HTMLButtonElement) => {
    clearTimeout(hideTimer.current);
    openerRef.current = opener;
    setActive(card);
    setPlaying(true);
    // Two frames so the .fade start state is painted before .is-shown transitions in.
    requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)));
  };

  const close = useCallback(() => {
    setPlaying(false); // source: $('#videoFrame').attr('src', '') on hide.bs.modal
    setShown(false);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setActive(null), FADE_MS);
  }, []);

  useEffect(() => () => clearTimeout(hideTimer.current), []);

  const isOpen = active !== null && playing;

  useEffect(() => {
    if (!isOpen) return;
    const opener = openerRef.current;
    // Bootstrap .modal-open: lock page scroll and compensate for the scrollbar.
    const bodyStyle = document.body.style;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    const prev = { overflow: bodyStyle.overflow, paddingRight: bodyStyle.paddingRight };
    bodyStyle.setProperty("overflow", "hidden");
    if (scrollbar > 0) bodyStyle.setProperty("padding-right", `${scrollbar}px`);
    closeRef.current?.focus({ preventScroll: true });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      } else if (e.key === "Tab" && e.shiftKey && document.activeElement === closeRef.current) {
        e.preventDefault();
        modalRef.current?.querySelector("iframe")?.focus();
      }
    };
    // Focus leaving the dialog (e.g. tabbing out of the player) is sent back to it.
    const onFocusIn = (e: FocusEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) closeRef.current?.focus({ preventScroll: true });
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("focusin", onFocusIn);
    return () => {
      bodyStyle.setProperty("overflow", prev.overflow);
      bodyStyle.setProperty("padding-right", prev.paddingRight);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("focusin", onFocusIn);
      // After the trap is gone, return focus to the card that opened the player.
      opener?.focus({ preventScroll: true });
    };
  }, [isOpen, close]);

  return (
    <div className="-mx-3 flex flex-wrap gap-y-6">
      {cards.map((card) => (
        <div key={card.id} className="w-full px-3 min-[768px]:w-1/3">
          <div className="vd-item">
            <button
              type="button"
              className="vd-link"
              aria-label={`Play video: ${card.title}`}
              aria-haspopup="dialog"
              onClick={(e) => open(card, e.currentTarget)}
            >
              <span className="vd-icon" aria-hidden="true">
                <PlayIcon />
              </span>
              {/* eslint-disable-next-line @next/next/no-img-element -- natural-ratio thumbnail (250px cover-crop below 768px), as the source */}
              <img src={card.thumb} alt="" width={600} height={400} loading="lazy" />
            </button>
            <h3>{card.title}</h3>
          </div>
        </div>
      ))}

      {/* Source `.video_modal_outer` is a full-width, zero-height flex item of the row, so the
          row gets one more 24px row-gap below the last cards — kept for identical spacing. */}
      <div className="w-full px-3">
        {active && (
          <>
            <div className={cn("vd-backdrop", shown && "is-shown")} aria-hidden="true" />
            <div
              ref={modalRef}
              className={cn("vd-modal", shown && "is-shown")}
              role="dialog"
              aria-modal="true"
              aria-label={active.title}
              tabIndex={-1}
              onClick={(e) => {
                if (e.target === e.currentTarget) close();
              }}
            >
              {/* pointer-events: none, so clicks beside the player reach the backdrop handler above */}
              <div className="vd-dialog">
                <div className="vd-content">
                  <button ref={closeRef} type="button" className="vd-close" aria-label="Close video" onClick={close}>
                    <span aria-hidden="true">×</span>
                  </button>
                  <div className="vd-body">
                    {playing ? (
                      <iframe
                        src={modalEmbedUrl(active.id)}
                        title={active.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                      />
                    ) : (
                      <div className="vd-frame-gap" aria-hidden="true" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function PlayIcon() {
  return (
    <svg width="38" height="38" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" focusable="false">
      <path
        d="m84.199 43.602-59.801-39.801c-5.1016-3.3984-12 0.30078-12 6.3984v79.5c0 6.1992 6.8984 9.8008 12 6.3984l59.801-39.801c4.5-2.8984 4.5-9.6953 0-12.695z"
        fill="#fff"
      />
    </svg>
  );
}

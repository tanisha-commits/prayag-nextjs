"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { SusProject } from "./data";

const pad = (n: number) => (n < 10 ? `0${n}` : String(n));

/**
 * "Our Projects" slider: native horizontal scroll with snap (swipe / trackpad work as-is);
 * prev/next buttons, "01 / 02" counter, progress line and arrow keys, as in the source.
 */
export function SusProjects({ title, projects }: { title: string; projects: SusProject[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const [index, setIndex] = useState(0);
  const total = projects.length;
  const hasControls = total >= 2;

  const current = useCallback(() => {
    const track = trackRef.current;
    if (!track) return 0;
    const i = Math.round(track.scrollLeft / Math.max(track.clientWidth, 1));
    return Math.min(Math.max(i, 0), total - 1);
  }, [total]);

  const go = useCallback(
    (i: number) => {
      const track = trackRef.current;
      if (!track) return;
      const target = Math.min(Math.max(i, 0), total - 1);
      const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
      track.scrollTo({ left: target * track.clientWidth, behavior: reduce ? "auto" : "smooth" });
    },
    [total],
  );

  useEffect(() => {
    const track = trackRef.current;
    if (!track || !hasControls) return;
    let ticking = false;
    let raf = 0;
    const update = () => {
      ticking = false;
      const i = current();
      setIndex(i);
      // Set imperatively (as the source does) so the line grows from scaleX(0) on load.
      if (fillRef.current) fillRef.current.style.transform = `scaleX(${(i + 1) / total})`;
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      raf = requestAnimationFrame(update);
    };
    const onResize = () => {
      go(current());
      update();
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    onScroll();
    return () => {
      track.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, [current, go, hasControls, total]);

  return (
    <section className="sus-projects">
      <div className="sus-wrap">
        <h2 className="sus-projects__title" id="sus-projects-title" data-rv="">
          {title}
        </h2>
        <div
          className="sus-track"
          role="region"
          aria-labelledby="sus-projects-title"
          tabIndex={0}
          ref={trackRef}
          onKeyDown={(e) => {
            if (!hasControls) return;
            if (e.key === "ArrowRight") {
              e.preventDefault();
              go(current() + 1);
            }
            if (e.key === "ArrowLeft") {
              e.preventDefault();
              go(current() - 1);
            }
          }}
        >
          {projects.map((p, i) => (
            <div
              className="sus-slide"
              key={p.title}
              {...(hasControls
                ? { role: "group", "aria-roledescription": "slide", "aria-label": `${i + 1} / ${total}` }
                : {})}
            >
              <div className="sus-slide__grid">
                <div className="sus-slide__media">
                  {/* eslint-disable-next-line @next/next/no-img-element -- cover-cropped slide photo, as the source */}
                  <img src={p.image} alt={p.imageAlt} loading="lazy" />
                </div>
                <div className="sus-slide__body">
                  <div className="sus-slide__text">
                    <h3>{p.title}</h3>
                    {p.points ? (
                      <ul>
                        {p.points.map((t) => (
                          <li key={t}>{t}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>{p.text}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="sus-projects__foot">
          <div className="sus-progress" hidden={!hasControls}>
            <span className="sus-progress__fill" ref={fillRef} />
          </div>
          <div className="sus-controls" hidden={!hasControls}>
            <span className="sus-count" aria-live="polite">
              {`${pad(index + 1)} / ${pad(total)}`}
            </span>
            <button
              type="button"
              className="sus-btn sus-btn--prev"
              aria-label="Previous project"
              disabled={index === 0}
              onClick={() => go(current() - 1)}
            />
            <button
              type="button"
              className="sus-btn sus-btn--next"
              aria-label="Next project"
              disabled={index === total - 1}
              onClick={() => go(current() + 1)}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

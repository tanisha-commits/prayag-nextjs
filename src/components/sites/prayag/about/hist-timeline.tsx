"use client";

import { useEffect, useRef } from "react";

export function HistTimeline({ items }: { items: { year: string; text: string }[] }) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const root = track?.closest<HTMLElement>(".hist-page");
    if (!track || !root || !("IntersectionObserver" in window)) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    const els = Array.from(track.querySelectorAll<HTMLElement>(".hist-item"));
    if (!els.length) return;
    root.classList.add("hist-js");

    const nodes = els.map((el) => el.querySelector<HTMLElement>(".hist-node")!);
    let centers: number[] = [];
    let ticking = false;
    let raf = 0;

    const measure = () => {
      const y = window.pageYOffset;
      const trackTop = track.getBoundingClientRect().top + y;
      centers = nodes.map((n) => {
        const r = n.getBoundingClientRect();
        return r.top + y + r.height / 2;
      });
      track.style.setProperty("--spine-top", `${centers[0] - trackTop}px`);
      track.style.setProperty(
        "--spine-bottom",
        `${track.offsetHeight - (centers[centers.length - 1] - trackTop)}px`,
      );
    };

    const update = () => {
      ticking = false;
      const vh = window.innerHeight;
      const mid = window.pageYOffset + vh * 0.5;
      const first = centers[0];
      const last = centers[centers.length - 1];
      const p = Math.min(Math.max((mid - first) / Math.max(last - first, 1), 0), 1);
      track.style.setProperty("--p", p.toFixed(4));

      let best = -1;
      let bestDist = Infinity;
      els.forEach((el, i) => {
        const d = Math.abs(centers[i] - mid);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
        el.classList.toggle("is-passed", centers[i] <= mid);
        if (!el.classList.contains("is-in") && el.getBoundingClientRect().top < vh * 0.9) {
          el.classList.add("is-in");
        }
      });

      const inRange = mid > first - vh * 0.35 && mid < last + vh * 0.35;
      els.forEach((el, i) => el.classList.toggle("is-active", inRange && i === best));
    };

    const request = () => {
      if (!ticking) {
        ticking = true;
        raf = requestAnimationFrame(update);
      }
    };
    const remeasure = () => {
      measure();
      update();
    };

    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", remeasure);
    window.addEventListener("load", remeasure);
    const ro = new ResizeObserver(remeasure);
    ro.observe(root);
    remeasure();

    return () => {
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", remeasure);
      window.removeEventListener("load", remeasure);
      ro.disconnect();
      cancelAnimationFrame(raf);
      root.classList.remove("hist-js");
    };
  }, []);

  return (
    <div className="hist-track" ref={trackRef}>
      <div className="hist-spine" aria-hidden="true">
        <span className="hist-spine__fill" />
        <span className="hist-spine__head" />
      </div>
      <ol className="hist-timeline">
        {items.map((item, i) => (
          <li className="hist-item" key={i}>
            <span className="hist-node" aria-hidden="true" />
            <div className="hist-card">
              <span className="hist-year">{item.year}</span>
              <h3 className="hist-text">{item.text}</h3>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

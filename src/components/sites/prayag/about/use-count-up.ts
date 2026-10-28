"use client";

import { useEffect, useRef, useState } from "react";

const DURATION = 1800; // ms, as in the source scripts

type Parsed = { prefix: string; target: number; suffix: string; comma: boolean };

function parse(text: string): Parsed | null {
  const m = text.trim().match(/^(\D*)([\d,]+)(.*)$/);
  if (!m) return null;
  return { prefix: m[1], target: parseInt(m[2].replace(/,/g, ""), 10), suffix: m[3], comma: m[2].includes(",") };
}

function format(n: number, info: Parsed) {
  return info.prefix + (info.comma ? n.toLocaleString("en-US") : String(n)) + info.suffix;
}

/**
 * Source counter behaviour (About + CEO pages): the final value is rendered up front; when
 * 60% of the element is visible it jumps to `start` and counts up over 1.8s with a cubic
 * ease-out. Skipped entirely with prefers-reduced-motion or without IntersectionObserver.
 */
export function useCountUp<T extends HTMLElement>(value: string, start = 0) {
  const ref = useRef<T>(null);
  const [text, setText] = useState(value);

  useEffect(() => {
    const el = ref.current;
    const info = parse(value);
    if (!el || !info || Number.isNaN(info.target)) return;
    if (!("IntersectionObserver" in window)) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const run = () => {
      let t0: number | null = null;
      setText(format(start, info));
      const tick = (now: number) => {
        if (t0 === null) t0 = now;
        const p = Math.min((now - t0) / DURATION, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setText(format(p < 1 ? Math.round(start + (info.target - start) * eased) : info.target, info));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          io.disconnect();
          run();
        }
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, start]);

  return { ref, text };
}

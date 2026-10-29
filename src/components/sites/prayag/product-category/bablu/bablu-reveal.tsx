"use client";

import { useEffect, useRef } from "react";

/**
 * `.bablu-page` wrapper with the theme's reveal-on-scroll (script.js `bablu-reveal`): with
 * IntersectionObserver available it adds `bablu-js` (which hides `.reveal` items) and gives
 * each item `visible` once 12% of it is in view. Classes are set on the DOM like the source,
 * so server-rendered children are never re-rendered.
 */
export function BabluReveal({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const page = ref.current;
    if (!page || !("IntersectionObserver" in window)) return;
    page.classList.add("bablu-js");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.12 },
    );
    page.querySelectorAll(".reveal").forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="bablu-page">
      {children}
    </div>
  );
}

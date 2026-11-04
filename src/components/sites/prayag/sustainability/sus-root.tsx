"use client";

import { useEffect, useRef } from "react";

export function SusRoot({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || !("IntersectionObserver" in window)) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    let io: IntersectionObserver | null = null;
    try {
      root.classList.add("sus-js");
      root.querySelectorAll(".sus-text").forEach((group) => {
        Array.from(group.children).forEach((child, i) => {
          child.classList.add("sus-rv");
          (child as HTMLElement).style.setProperty("--d", `${Math.min(i, 5) * 90}ms`);
        });
      });
      root.querySelectorAll<HTMLElement>("[data-rv]").forEach((el, i) => {
        el.classList.add("sus-rv");
        el.style.setProperty("--d", `${el.classList.contains("sus-report") ? (i % 2) * 120 : 0}ms`);
      });

      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting || entry.boundingClientRect.top < 0) {
              entry.target.classList.add("is-in");
              observer.unobserve(entry.target);
            }
          }
        },
        { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
      );
      io = observer;
      root.querySelectorAll(".sus-rv, .sus-mask").forEach((el) => observer.observe(el));
    } catch {
      root.classList.remove("sus-js");
    }
    return () => io?.disconnect();
  }, []);

  return (
    <div className="sus-page" ref={ref}>
      {children}
    </div>
  );
}

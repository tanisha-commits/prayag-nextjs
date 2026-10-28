"use client";

import { useEffect, useRef } from "react";

/**
 * `.mf-page` root + the source script's scroll reveals and image safety:
 * - children of `.mf-text` / `.mf-index` and every `[data-rv]` element ease in, markers and
 *   step lines draw in, `.mf-mask` photos reveal with a clip mask (12% visible, or already
 *   above the viewport). Off with reduced motion; if anything throws, content stays visible.
 * - a photo that fails to load hides its figure and collapses the grid to one column.
 */
export function MfRoot({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const drop = (img: HTMLImageElement) => {
      const fig = img.closest<HTMLElement>(".mf-media");
      if (!fig) return;
      fig.hidden = true;
      const grid = fig.closest<HTMLElement>(".mf-intro__grid, .mf-detail__grid");
      if (grid) grid.style.gridTemplateColumns = "minmax(0, 1fr)";
    };
    const imgs = Array.from(root.querySelectorAll<HTMLImageElement>(".mf-media img"));
    const onError = (e: Event) => drop(e.currentTarget as HTMLImageElement);
    imgs.forEach((img) => {
      if (!img.getAttribute("src") || (img.complete && img.naturalWidth === 0)) drop(img);
      else img.addEventListener("error", onError, { once: true });
    });

    let io: IntersectionObserver | null = null;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (!reduce && "IntersectionObserver" in window) {
      try {
        root.classList.add("mf-js");
        root.querySelectorAll(".mf-text, .mf-index").forEach((group) => {
          Array.from(group.children).forEach((child, i) => {
            child.classList.add("mf-rv");
            (child as HTMLElement).style.setProperty("--d", `${Math.min(i, 6) * 80}ms`);
          });
        });
        root.querySelectorAll("[data-rv]").forEach((el) => el.classList.add("mf-rv"));

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
        root.querySelectorAll(".mf-rv, .mf-mask").forEach((el) => observer.observe(el));
      } catch {
        root.classList.remove("mf-js"); // never leave content hidden
      }
    }

    return () => {
      io?.disconnect();
      imgs.forEach((img) => img.removeEventListener("error", onError));
    };
  }, []);

  return (
    <div className="mf-page" ref={ref}>
      {children}
    </div>
  );
}

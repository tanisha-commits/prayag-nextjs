"use client";

import { useEffect, useRef } from "react";

/**
 * Source `section.product_split_reveal_sec` (shared by the product-category pages) with the theme
 * script.js scroll-progress reveal: `.psr-image-wrap` slides in from the left and `.psr-content`
 * from the right (100px, 50px at <=768px), fading in while the section top travels from the
 * viewport bottom to 40% of the viewport, eased out-cubic. Reduced motion shows the final state.
 * Before hydration both stay hidden, as on the source before its script runs (pcat-base.css).
 */
export function SplitRevealSection({ id, children }: { id?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = ref.current;
    const imageWrap = section?.querySelector<HTMLElement>(".psr-image-wrap");
    const content = section?.querySelector<HTMLElement>(".psr-content");
    if (!section || !imageWrap || !content) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      for (const el of [imageWrap, content]) {
        el.style.opacity = "1";
        el.style.transform = "none";
      }
      return;
    }

    let frame = 0;
    let vh = window.innerHeight;
    const update = () => {
      frame = 0;
      const top = section.getBoundingClientRect().top;
      const progress = Math.min(1, Math.max(0, (vh - top) / (vh - vh * 0.4)));
      const eased = 1 - Math.pow(1 - progress, 3);
      const from = window.innerWidth <= 768 ? 50 : 100;
      imageWrap.style.opacity = eased.toFixed(3);
      imageWrap.style.transform = `translate3d(${(-from * (1 - eased)).toFixed(2)}px, 0, 0)`;
      content.style.opacity = eased.toFixed(3);
      content.style.transform = `translate3d(${(from * (1 - eased)).toFixed(2)}px, 0, 0)`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const onResize = () => {
      vh = window.innerHeight;
      onScroll();
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <section ref={ref} className="product_split_reveal_sec" id={id}>
      {children}
    </section>
  );
}

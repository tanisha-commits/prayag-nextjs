"use client";

import { useEffect, useRef, type ReactNode } from "react";

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Theme script.js "scroll-progress-linked reveal" of `.product_split_reveal_sec`: the image slides
 * in from the left and the text from the right (100px, 50px at ≤768px) while the section's top
 * travels from the viewport bottom to 40% of the viewport height, eased out-cubic. Writes the
 * same inline opacity / transform as the source; reduced motion shows the final state.
 */
export function SplitReveal({ image, content }: { image: ReactNode; content: ReactNode }) {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const imageWrap = imageRef.current;
    const text = contentRef.current;
    if (!section || !imageWrap || !text) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      for (const el of [imageWrap, text]) {
        el.style.opacity = "1";
        el.style.transform = "none";
      }
      return;
    }

    let ticking = false;
    let frame = 0;
    let vh = window.innerHeight;

    const update = () => {
      const top = section.getBoundingClientRect().top;
      const eased = easeOutCubic(clamp((vh - top) / (vh - vh * 0.4), 0, 1));
      const mobile = window.innerWidth <= 768;
      const imgX = (mobile ? -50 : -100) * (1 - eased);
      const textX = (mobile ? 50 : 100) * (1 - eased);
      imageWrap.style.opacity = eased.toFixed(3);
      imageWrap.style.transform = `translate3d(${imgX.toFixed(2)}px, 0, 0)`;
      text.style.opacity = eased.toFixed(3);
      text.style.transform = `translate3d(${textX.toFixed(2)}px, 0, 0)`;
      ticking = false;
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      frame = requestAnimationFrame(update);
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
    <section ref={sectionRef} className="product_split_reveal_sec">
      <div className="psr-container">
        <div className="psr-image-col">
          <div ref={imageRef} className="psr-image-wrap">
            {image}
          </div>
        </div>
        <div className="psr-content-col">
          <div ref={contentRef} className="psr-content">
            {content}
          </div>
        </div>
      </div>
    </section>
  );
}

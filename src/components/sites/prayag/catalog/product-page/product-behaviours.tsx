"use client";

import { useEffect } from "react";

// Port of the source theme's Drupal.behaviors.ppProduct (gallery, tabs, related slider, copy link),
// attached to the server-rendered markup of the product page. The tabs are rendered already
// initialised (`is-ready`, first tab selected), so nothing shifts when this runs.
export function ProductBehaviours() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".pcat-product");
    if (!root) return;
    const off: (() => void)[] = [];
    const on = <K extends keyof HTMLElementEventMap>(el: HTMLElement | Window, type: K, fn: (e: HTMLElementEventMap[K]) => void, opts?: AddEventListenerOptions) => {
      el.addEventListener(type, fn as EventListener, opts);
      off.push(() => el.removeEventListener(type, fn as EventListener, opts));
    };

    // Gallery
    const gallery = root.querySelector<HTMLElement>("[data-pp-gallery]");
    const main = gallery?.querySelector<HTMLImageElement>("[data-pp-main]");
    const thumbs = gallery ? [...gallery.querySelectorAll<HTMLButtonElement>("[data-pp-thumb]")] : [];
    if (gallery && main && thumbs.length > 1) {
      let current = 0;
      const show = (index: number) => {
        current = (index + thumbs.length) % thumbs.length;
        const t = thumbs[current];
        // The main image has responsive sources; swap the set along with the fallback src.
        if (t.dataset.srcset) main.srcset = t.dataset.srcset;
        main.src = t.dataset.src ?? main.src;
        main.alt = t.dataset.alt ?? "";
        thumbs.forEach((el, i) => {
          el.classList.toggle("is-active", i === current);
          if (i === current) el.setAttribute("aria-current", "true");
          else el.removeAttribute("aria-current");
        });
        // Keep the active thumbnail visible by scrolling the thumbnail rail only (never the page).
        const rail = t.parentElement;
        rail?.scrollTo({ top: t.offsetTop - (rail.clientHeight - t.offsetHeight) / 2, left: t.offsetLeft - (rail.clientWidth - t.offsetWidth) / 2, behavior: "smooth" });
      };
      thumbs.forEach((t, i) => on(t, "click", () => show(i)));
      on(gallery, "keydown", (e) => {
        if (e.key === "ArrowLeft") show(current - 1);
        if (e.key === "ArrowRight") show(current + 1);
      });
      const stage = gallery.querySelector<HTMLElement>(".pp-gallery__main");
      let startX: number | null = null;
      if (stage) {
        on(stage, "touchstart", (e) => (startX = e.changedTouches[0].clientX), { passive: true });
        on(stage, "touchend", (e) => {
          if (startX === null) return;
          const dx = e.changedTouches[0].clientX - startX;
          startX = null;
          if (Math.abs(dx) > 40) show(dx < 0 ? current + 1 : current - 1);
        }, { passive: true });
      }
    }

    // Tabs
    const tabsRoot = root.querySelector<HTMLElement>("[data-pp-tabs]");
    const tabs = tabsRoot ? [...tabsRoot.querySelectorAll<HTMLButtonElement>("[data-pp-tab]")] : [];
    const panels = tabsRoot ? [...tabsRoot.querySelectorAll<HTMLElement>(".pp-panel")] : [];
    const select = (tab: HTMLButtonElement, focus: boolean) => {
      tabs.forEach((t) => {
        t.setAttribute("aria-selected", t === tab ? "true" : "false");
        t.tabIndex = t === tab ? 0 : -1;
      });
      panels.forEach((p) => (p.hidden = p.id !== tab.dataset.ppTab));
      if (focus) tab.focus();
    };
    tabs.forEach((tab, i) => {
      on(tab, "click", () => select(tab, false));
      on(tab, "keydown", (e) => {
        const target = { ArrowRight: tabs[(i + 1) % tabs.length], ArrowLeft: tabs[(i - 1 + tabs.length) % tabs.length], Home: tabs[0], End: tabs[tabs.length - 1] }[e.key];
        if (target) {
          e.preventDefault();
          select(target, true);
        }
      });
    });

    // Related products slider
    const rel = root.querySelector<HTMLElement>("[data-pp-rel]");
    const track = rel?.querySelector<HTMLElement>("[data-pp-rel-track]");
    const prev = rel?.querySelector<HTMLButtonElement>("[data-pp-rel-prev]");
    const next = rel?.querySelector<HTMLButtonElement>("[data-pp-rel-next]");
    if (track && prev && next) {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const update = () => {
        prev.disabled = track.scrollLeft <= 2;
        next.disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 2;
      };
      const go = (dir: number) => track.scrollBy({ left: dir * track.clientWidth * 0.9, behavior: reduce ? "auto" : "smooth" });
      on(prev, "click", () => go(-1));
      on(next, "click", () => go(1));
      on(track, "scroll", update, { passive: true });
      on(window, "resize", update);
      update();
    }

    // Copy link
    const copy = root.querySelector<HTMLButtonElement>("[data-pp-copy]");
    const status = root.querySelector<HTMLElement>("[data-pp-copy-status]");
    if (copy) {
      const say = (msg: string) => {
        if (!status) return;
        status.textContent = msg;
        setTimeout(() => (status.textContent = ""), 2500);
      };
      on(copy, "click", () => {
        navigator.clipboard?.writeText(copy.dataset.url ?? window.location.href).then(
          () => say("Link copied"),
          () => say("Copy failed"),
        );
      });
    }

    return () => off.forEach((f) => f());
  }, []);
  return null;
}

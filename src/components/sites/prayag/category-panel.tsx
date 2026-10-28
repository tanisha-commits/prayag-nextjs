"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { closeCategoryPanel } from "@/lib/features/ui-slice";
import {
  logo,
  pageLinks,
  panelQuickLinks,
  plumbingSubcategories,
  productCategories,
  socialIcons,
  socialLinks,
} from "./data";
import { CloseIcon, LinkedInIcon, PhoneIcon, SparkleIcon } from "./icons";

const chevron = "inline-block size-2 border-r-2 border-b-2 border-solid transition-transform duration-300";

/** Off-canvas "Product category" drawer opened by the header hamburger (source `.pm-panel`). */
export function CategoryPanel() {
  const dispatch = useAppDispatch();
  const open = useAppSelector((s) => s.ui.categoryPanelOpen);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && dispatch(closeCategoryPanel());
    document.addEventListener("keydown", onKey);
    // Source locks page scroll only at <= 991px.
    const lock = window.matchMedia("(max-width: 991px)").matches;
    if (lock) document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      if (lock) document.documentElement.style.overflow = "";
    };
  }, [open, dispatch]);

  const close = () => dispatch(closeCategoryPanel());

  return (
    <>
      <div
        aria-hidden="true"
        onClick={close}
        className={cn(
          "fixed inset-0 z-[1000000] bg-black/40 backdrop-blur-[4px] transition-opacity duration-300",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />
      <aside
        id="pm-category-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Product category menu"
        className={cn(
          "fixed top-0 left-0 z-[1000001] box-border flex h-dvh w-[380px] max-w-[92vw] flex-col bg-white text-[18px] leading-[28.8px] text-black",
          "transition-[transform,visibility] duration-[350ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]",
          open ? "visible translate-x-0" : "invisible -translate-x-full",
        )}
      >
        <div className="flex min-h-[72px] flex-none items-center justify-between border-b border-[#ececec] px-5">
          <Link href="/" aria-label="Prayag home" className="inline-block leading-none">
            {/* eslint-disable-next-line @next/next/no-img-element -- fixed-size source logo */}
            <img src={logo} alt="Prayag" width={110} height={22} className="block h-auto w-[110px] max-w-full" />
          </Link>
          <button
            ref={closeRef}
            type="button"
            onClick={close}
            aria-label="Close category menu"
            className="flex size-9 cursor-pointer items-center justify-center rounded-lg bg-[#f1f1f1] text-[#111] transition-colors duration-200 hover:bg-[#e4e4e4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111]"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="min-h-0 flex-auto overflow-y-auto overscroll-contain px-5 pt-4 pb-6 [scrollbar-color:#c9c9c9_transparent] [scrollbar-width:thin]">
          <a
            href={pageLinks.hdpe}
            className="flex items-center gap-[14px] rounded-[14px] border border-[#ececec] bg-[#f6f6f6] p-[14px] text-black transition-colors duration-200 hover:border-[#111]"
          >
            <span className="flex size-10 flex-none items-center justify-center rounded-[10px] bg-[#111] text-white">
              <SparkleIcon />
            </span>
            <span className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="text-[16px] leading-[1.3] font-semibold">
                HDPE{" "}
                <span className="ml-1.5 inline-block rounded-[10px] bg-[#111] px-[7px] py-px align-[2px] text-[11px] font-semibold text-white">
                  New
                </span>
              </span>
              <span className="text-[13px] text-[#777]">Latest launch</span>
            </span>
            <span aria-hidden="true" className={cn(chevron, "-rotate-45 border-[#007ac3]")} />
          </a>

          <a
            href={pageLinks.bablu}
            className="mt-2.5 flex items-center gap-[14px] rounded-[14px] bg-gradient-to-br from-[#007ac3] to-[#00aeef] p-[14px] text-white shadow-[0_6px_16px_rgba(0,122,195,0.28)] transition-[transform,box-shadow] duration-200 hover:-translate-y-px hover:shadow-[0_8px_20px_rgba(0,122,195,0.38)]"
          >
            <span className="flex size-10 flex-none items-center justify-center rounded-[10px] bg-white/20 text-white">
              <PhoneIcon />
            </span>
            <span className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="text-[16px] leading-[1.3] font-semibold">
                Prayag Ka Bablu App{" "}
                <span className="ml-1.5 inline-block rounded-[10px] bg-white px-[7px] py-px align-[2px] text-[11px] font-bold text-[#007ac3]">
                  New
                </span>
              </span>
              <span className="text-[13px] text-white/90">Plumbers Loyalty Program</span>
            </span>
            <span aria-hidden="true" className={cn(chevron, "-rotate-45 border-white")} />
          </a>

          <PanelLabel>Product Category</PanelLabel>
          <ul>
            <li>
              <details className="group/details">
                <summary className="group/row flex cursor-pointer list-none items-center gap-2 rounded-[10px] px-2.5 py-3 transition-colors duration-200 hover:bg-[#f6f6f6] [&::-webkit-details-marker]:hidden">
                  <span className="flex-1 text-[16px] text-black transition-colors duration-200 group-hover/row:text-[#007ac3]">
                    {productCategories[0].label}
                  </span>
                  <span
                    aria-label={`${plumbingSubcategories.length} categories`}
                    className="min-w-6 flex-none rounded-xl bg-[#ececec] px-2 py-0.5 text-center text-[12px] leading-[1.5] font-semibold text-[#333]"
                  >
                    {plumbingSubcategories.length}
                  </span>
                  <span aria-hidden="true" className={cn(chevron, "-rotate-45 border-[#007ac3] group-open/details:rotate-45")} />
                </summary>
                <ul className="mt-1 mb-2 ml-[14px] animate-[prayag-drop_0.25s_ease] border-l-2 border-[#e5e5e5] pl-2.5">
                  <li>
                    <a href={productCategories[0].href} className="block rounded-lg px-3 py-[9px] text-[15px] font-semibold text-black transition-colors duration-200 hover:bg-[#f6f6f6] hover:text-[#007ac3]">
                      View all {productCategories[0].label}
                    </a>
                  </li>
                  {plumbingSubcategories.map((link) => (
                    <li key={link.label}>
                      <a href={link.href} className="block rounded-lg px-3 py-[9px] text-[15px] text-black transition-colors duration-200 hover:bg-[#f6f6f6] hover:text-[#007ac3]">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </details>
            </li>
          </ul>

          <PanelLabel>Quick links</PanelLabel>
          <ul>
            {panelQuickLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="block rounded-lg p-2.5 text-[15px] text-black transition-colors duration-200 hover:bg-[#f6f6f6] hover:text-[#007ac3]"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex-none border-t border-[#ececec] bg-white px-5 pt-2.5 pb-[calc(10px+env(safe-area-inset-bottom,0px))]">
          <ul aria-label="Follow Prayag" className="flex justify-around gap-1">
            {(["facebook", "youtube", "instagram"] as const).map((key) => (
              <li key={key}>
                <a
                  href={socialLinks[key]}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={key === "youtube" ? "YouTube" : key[0].toUpperCase() + key.slice(1)}
                  className="flex size-10 items-center justify-center rounded-lg text-[#111] transition-colors duration-200 hover:bg-[#f1f1f1]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- 24px source icon */}
                  <img src={socialIcons[key]} alt="" aria-hidden="true" width={24} height={24} loading="lazy" className="block size-6 brightness-0" />
                </a>
              </li>
            ))}
            <li>
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex size-10 items-center justify-center rounded-lg text-[#111] transition-colors duration-200 hover:bg-[#f1f1f1]"
              >
                <LinkedInIcon width={22} height={22} />
              </a>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
}

function PanelLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-7 mb-2 flex items-center gap-3 text-[12px] leading-[1.3] font-bold tracking-[0.04em] text-[#00aeef] uppercase after:h-px after:flex-1 after:bg-[#e5e5e5] after:content-['']">
      <span>{children}</span>
    </h2>
  );
}

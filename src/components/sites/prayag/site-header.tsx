"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  closeMobileNav,
  openCategoryPanel,
  toggleMobileNav,
} from "@/lib/features/ui-slice";
import { logo, megaMenus, searchHref, type MegaMenu, type NavLink } from "./data";
import { SearchIcon } from "./icons";

const STICKY_OFFSET = 90; // source: header height; `.sticky` once scrollTop exceeds it

function isMega(item: MegaMenu | NavLink): item is MegaMenu {
  return "links" in item;
}

function linkProps(link: NavLink) {
  return link.external ? { target: "_blank", rel: "noopener noreferrer" } : {};
}

/**
 * Desktop (>= 991px): transparent over the hero with white text, white on hover,
 * fixed + white after scrolling past 90px. Below 991px: static white bar with a
 * burger that slides the menu open.
 */
export function SiteHeader() {
  const dispatch = useAppDispatch();
  const panelOpen = useAppSelector((s) => s.ui.categoryPanelOpen);
  const mobileOpen = useAppSelector((s) => s.ui.mobileNavOpen);
  const [sticky, setSticky] = useState(false);
  const [openSub, setOpenSub] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setSticky(window.scrollY > STICKY_OFFSET);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 991px)");
    const onChange = () => desktop.matches && dispatch(closeMobileNav());
    desktop.addEventListener("change", onChange);
    return () => desktop.removeEventListener("change", onChange);
  }, [dispatch]);

  return (
    <header
      data-sticky={sticky}
      className={cn(
        "group/header relative z-[99] w-full bg-white py-[15px] text-[16px] leading-[1.42857] text-[#212529]",
        "lg:absolute lg:inset-x-0 lg:top-0 lg:bg-transparent lg:py-0 lg:transition-[background-color] lg:duration-500 lg:ease-in-out lg:hover:bg-white",
        sticky && "lg:fixed lg:bg-white lg:animate-[prayag-sticky-in_0.5s_both]",
      )}
    >
      <div className="w-full px-6 py-3 md:px-[60px] md:py-0 2xl:px-[90px]">
        <div
          className={cn(
            "relative flex flex-col items-center gap-x-[30px] lg:static sm:flex-row sm:flex-wrap sm:justify-between",
            "lg:h-[90px] lg:flex-nowrap lg:group-data-[sticky=true]/header:h-[70px]",
          )}
        >
          {/* Brand: category-panel hamburger + logo */}
          <div className="flex items-center gap-2 md:gap-[14px]">
            <button
              type="button"
              aria-label="Open category menu"
              aria-expanded={panelOpen}
              aria-controls="pm-category-panel"
              onClick={() => dispatch(openCategoryPanel())}
              className="flex size-9 shrink-0 cursor-pointer flex-col justify-center gap-[5px] p-[7px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111] md:size-10 md:p-[9px]"
            >
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="block h-0.5 w-[22px] bg-white transition-[background-color] duration-500 ease-in-out group-hover/header:bg-[#111] group-data-[sticky=true]/header:bg-[#111]"
                />
              ))}
            </button>
            <Link href="/" className="inline-block w-[133px] sm:w-[200px]">
              {/* eslint-disable-next-line @next/next/no-img-element -- logo is a fixed-size source asset */}
              <img
                src={logo}
                alt="logo"
                width={150}
                height={30}
                className={cn(
                  "h-auto w-[133px] object-cover brightness-0 sm:w-[85%]",
                  "lg:brightness-[10000] lg:group-hover/header:brightness-0 lg:group-data-[sticky=true]/header:brightness-0",
                )}
              />
            </Link>
          </div>

          {/* Mobile burger (source `.burger-menu`) */}
          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => dispatch(toggleMobileNav())}
            className={cn(
              "absolute top-[5px] right-8 flex h-[17px] w-5 cursor-pointer flex-col justify-between transition-transform duration-[330ms] ease-out sm:top-[10px] lg:hidden",
              mobileOpen && "-rotate-45",
            )}
          >
            <span
              className={cn(
                "h-[3px] w-1/2 origin-right rounded-[2px] bg-[#111] transition-transform duration-[330ms] ease-[cubic-bezier(0.54,-0.81,0.57,0.57)]",
                mobileOpen && "[transform:rotate(-90deg)_translateX(3px)]",
              )}
            />
            <span className="h-[3px] w-full rounded-[2px] bg-[#111]" />
            <span
              className={cn(
                "h-[3px] w-1/2 origin-left self-end rounded-[2px] bg-[#111] transition-transform duration-[330ms] ease-[cubic-bezier(0.54,-0.81,0.57,0.57)]",
                mobileOpen && "[transform:rotate(-90deg)_translateX(-3px)]",
              )}
            />
          </button>

          {/* Desktop navigation */}
          <nav aria-label="Main" className="hidden items-center lg:flex">
            <ul className="flex flex-wrap items-center justify-end">
              {megaMenus.map((item, idx) => {
                const last = idx === megaMenus.length - 1;
                const topLink = cn(
                  "relative flex h-[30px] items-start whitespace-nowrap text-[17px] leading-6 font-medium text-white transition-colors duration-200 ease-in-out",
                  "group-hover/header:text-black group-data-[sticky=true]/header:h-[70px] group-data-[sticky=true]/header:leading-[70px] group-data-[sticky=true]/header:text-black",
                  last ? "pr-0 pl-5" : "px-[25px]",
                );
                if (!isMega(item)) {
                  return (
                    <li key={item.label}>
                      <a href={item.href} className={topLink}>
                        {item.label}
                      </a>
                    </li>
                  );
                }
                return (
                  <li key={item.label} className="group/item">
                    <button type="button" className={cn(topLink, "cursor-pointer")} aria-haspopup="true">
                      {item.label}
                      <span
                        aria-hidden="true"
                        className={cn(
                          "relative -top-[3px] box-content size-1 self-center rotate-[135deg] border-t-2 border-r-2 border-[#f7f7f7] group-hover/header:border-black",
                          // Source markup has a trailing space after "Inspiration" before the caret.
                          item.label === "Inspiration" ? "ml-[12.5px]" : "ml-2",
                        )}
                      />
                    </button>
                    <MegaPanel menu={item} />
                  </li>
                );
              })}
            </ul>
            <a href={searchHref} aria-label="search" className="ml-[50px] block text-white group-hover/header:text-black group-data-[sticky=true]/header:text-black">
              <SearchIcon />
            </a>
          </nav>

          {/* Mobile navigation */}
          {mobileOpen && (
            <nav aria-label="Main" className="w-full lg:hidden">
              <ul className="w-full pt-8 pb-5">
                {megaMenus.map((item) => (
                  <li key={item.label} className="relative">
                    {isMega(item) ? (
                      <>
                        <button
                          type="button"
                          aria-expanded={openSub === item.label}
                          onClick={() => setOpenSub(openSub === item.label ? null : item.label)}
                          className="relative block w-full cursor-pointer px-[15px] py-[14px] text-left text-[17px] font-medium text-black"
                        >
                          {item.label}
                          <span aria-hidden="true" className="absolute top-6 right-[18px] h-[1.5px] w-[13px] bg-[#111]" />
                          {openSub !== item.label && (
                            <span aria-hidden="true" className="absolute top-6 right-[18px] h-[1.5px] w-[13px] rotate-90 bg-[#111]" />
                          )}
                        </button>
                        {openSub === item.label && (
                          <ul className="grid gap-[14px] px-[15px] pt-[15px] pb-[15px]">
                            {item.links.map((link) => (
                              <li key={link.label}>
                                <a href={link.href} {...linkProps(link)} className="text-[17px] text-black hover:text-[#007ac3]">
                                  {link.label}
                                </a>
                              </li>
                            ))}
                          </ul>
                        )}
                      </>
                    ) : (
                      <a href={item.href} className="block px-[15px] py-[14px] text-[17px] font-medium text-black">
                        {item.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}

function MegaPanel({ menu }: { menu: MegaMenu }) {
  return (
    <div
      className={cn(
        "invisible absolute top-full left-0 z-[999999] w-full bg-white px-5 pt-[25px] pb-[15px] opacity-0 shadow-[0_20px_30px_-2px_rgba(0,0,0,0.1)] transition-all duration-200 ease-in-out",
        "group-hover/item:visible group-hover/item:opacity-100 group-focus-within/item:visible group-focus-within/item:opacity-100",
      )}
    >
      <div className="px-[15px] pt-[15px]">
        <div className="grid grid-cols-2 gap-6 px-20">
          <ul className={cn("grid content-start gap-[14px]", menu.columns === 2 ? "grid-cols-2" : "grid-cols-1")}>
            {menu.links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  {...linkProps(link)}
                  className="text-[17px] leading-[1.42857] font-normal !text-black transition-colors duration-500 hover:!text-[#007ac3]"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mb-[30px]">
            {/* eslint-disable-next-line @next/next/no-img-element -- decorative menu thumbnail, natural aspect */}
            <img src={menu.image} alt="thumbnail" loading="lazy" className="h-auto w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

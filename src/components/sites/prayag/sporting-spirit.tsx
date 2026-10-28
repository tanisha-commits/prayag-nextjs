"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { sponsors } from "./data";

const AUTOPLAY_MS = 2000;
const SPEED_MS = 500;

// Source slick responsive settings: 4 per view, 3 below 768px, 2 below 576px.
function slidesForWidth(width: number) {
  if (width < 576) return 2;
  if (width < 768) return 3;
  return 4;
}

export function SportingSpirit() {
  const [perView, setPerView] = useState(4);
  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(true);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const update = () => setPerView(slidesForWidth(window.innerWidth));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      setAnimate(true);
      setIndex((i) => i + 1);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [paused]);

  // Infinite loop: the track repeats the first `perView` logos; after sliding onto that
  // copy, snap back to the real start without a transition.
  useEffect(() => {
    if (index < sponsors.length) return;
    const id = setTimeout(() => {
      setAnimate(false);
      setIndex(0);
    }, SPEED_MS);
    return () => clearTimeout(id);
  }, [index]);

  const track = [...sponsors, ...sponsors.slice(0, perView)];

  return (
    <section className="relative bg-white py-10 md:pt-0 md:pb-[100px]">
      <div className="prayag-container">
        <div className="-mx-3 mb-2 flex flex-wrap">
          <div className="w-full px-3 md:w-7/12">
            <h2 className="mb-0 text-center text-[32px] leading-8 font-bold text-[#333] md:text-left md:text-[40px] md:leading-[62px]">
              Fueling India’s Sporting Spirit
            </h2>
          </div>
          <div className="w-full px-3 md:w-5/12">
            <p className="mb-[25px] text-center text-[18px] leading-7 text-black md:mb-6 md:text-left">
              At Prayag, our commitment extends beyond products to celebrating Indian sports. We&apos;ve proudly
              supported teams like Kings XI Punjab, U Mumba, and events like the Arise Asia Cup, reflecting our
              belief in the unifying power of sports and our dedication to nurturing talent and championing the
              spirit of competition.
            </p>
          </div>
        </div>
        <div
          className="relative overflow-hidden rounded-[10px] bg-white pt-[30px]"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          aria-roledescription="carousel"
          aria-label="Sports sponsorships"
        >
          <ul
            className={cn("flex", animate && "transition-transform ease-[ease]")}
            style={{
              transform: `translate3d(-${(index * 100) / perView}%, 0, 0)`,
              transitionDuration: animate ? `${SPEED_MS}ms` : "0ms",
            }}
          >
            {track.map((sponsor, i) => (
              <li
                key={`${sponsor.src}-${i}`}
                aria-hidden={i < index || i >= index + perView}
                className="shrink-0 px-[22px]"
                style={{ width: `${100 / perView}%` }}
              >
                <div className="group flex min-h-[100px] items-center justify-center rounded-[15px] border border-[#eee] bg-white p-5 transition-all duration-300 ease-[ease] hover:-translate-y-[5px] hover:shadow-[0_8px_25px_rgba(0,0,0,0.15)]">
                  {/* eslint-disable-next-line @next/next/no-img-element -- contained logo, natural ratio */}
                  <img
                    src={sponsor.src}
                    alt={sponsor.alt}
                    className="block max-h-[120px] max-w-full object-contain grayscale-[0.3] transition-[filter] duration-300 group-hover:grayscale-0"
                  />
                </div>
                <p className="mt-3 mb-4 text-center text-[22px] leading-8 font-normal text-[#555]">{sponsor.years}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

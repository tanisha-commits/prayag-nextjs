"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { heroSlides } from "./data";
import { ChevronRightIcon, SoundOffIcon, SoundOnIcon } from "./icons";

/**
 * Source `.video-showcase`: each slide shows a poster <picture> until its webm can play,
 * then cross-fades to the video. A slide advances when its video ends; the next button
 * and dots switch manually. Videos load lazily (first one when the browser is idle).
 */
export function HeroVideoSlider() {
  const [current, setCurrent] = useState(0);
  const [muted, setMuted] = useState(true);
  const [loaded, setLoaded] = useState<boolean[]>(() => heroSlides.map(() => false));
  const [ready, setReady] = useState<boolean[]>(() => heroSlides.map(() => false));
  const videos = useRef<(HTMLVideoElement | null)[]>([]);

  const startLoading = useCallback((index: number) => {
    setLoaded((prev) => (prev[index] ? prev : prev.map((v, i) => (i === index ? true : v))));
  }, []);

  useEffect(() => {
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(() => startLoading(0), { timeout: 2500 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(() => startLoading(0), 800);
    return () => clearTimeout(id);
  }, [startLoading]);

  // Play the active slide's video (from the start) once it is ready; pause the others.
  useEffect(() => {
    videos.current.forEach((video, i) => {
      if (!video) return;
      if (i === current && ready[i]) {
        video.play().catch(() => {});
      } else if (i !== current) {
        video.pause();
      }
    });
  }, [current, ready]);

  useEffect(() => {
    videos.current.forEach((video) => {
      if (video) video.muted = muted;
    });
  }, [muted]);

  useEffect(() => {
    const onVisibility = () => {
      const video = videos.current[current];
      if (!video || !ready[current]) return;
      if (document.hidden) video.pause();
      else video.play().catch(() => {});
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [current, ready]);

  const goTo = (index: number) => {
    if (index === current) return;
    const next = videos.current[index];
    if (next && ready[index]) next.currentTime = 0;
    setCurrent(index);
    startLoading(index);
  };
  const goNext = () => goTo((current + 1) % heroSlides.length);

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden bg-black md:aspect-[16/7]">
      {heroSlides.map((slide, i) => (
        <div
          key={slide.alt}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000 ease-in-out motion-reduce:duration-300",
            i === current ? "opacity-100" : "opacity-0",
          )}
          aria-hidden={i !== current}
        >
          <video
            ref={(el) => {
              videos.current[i] = el;
            }}
            muted
            playsInline
            preload={loaded[i] ? "auto" : "none"}
            src={loaded[i] ? slide.video : undefined}
            onCanPlay={() => setReady((prev) => (prev[i] ? prev : prev.map((v, j) => (j === i ? true : v))))}
            onEnded={goNext}
            className={cn(
              "absolute inset-0 size-full object-cover transition-opacity duration-[600ms] ease-in-out",
              ready[i] ? "z-[3] opacity-100" : "z-[1] opacity-0",
            )}
          />
          <picture
            className={cn(
              "absolute inset-0 z-[2] block size-full transition-opacity duration-[600ms] ease-in-out",
              ready[i] && "pointer-events-none opacity-0",
            )}
          >
            <source media="(max-width: 768px)" srcSet={slide.mobile} type="image/webp" />
            <source media="(min-width: 769px)" srcSet={slide.desktop} type="image/webp" />
            <img
              src={slide.desktop}
              alt={slide.alt}
              width={1920}
              height={840}
              loading={i === 0 ? "eager" : "lazy"}
              fetchPriority={i === 0 ? "high" : "auto"}
              decoding={i === 0 ? "sync" : "async"}
              className="absolute inset-0 size-full object-cover object-[center_top]"
            />
          </picture>
        </div>
      ))}

      <div className="absolute bottom-[30px] left-1/2 z-10 flex -translate-x-1/2 gap-2.5">
        {heroSlides.map((slide, i) => (
          <button
            key={slide.alt}
            type="button"
            aria-label={`Show slide ${i + 1}`}
            aria-current={i === current}
            onClick={() => goTo(i)}
            className={cn(
              "h-2 cursor-pointer rounded-full transition-all duration-300 ease-in-out",
              i === current ? "w-[30px] rounded-[4px] bg-white" : "w-2 bg-white/30",
            )}
          />
        ))}
      </div>

      <div className="absolute right-5 bottom-5 z-10 flex gap-[15px] md:right-[30px] md:bottom-[30px]">
        <ControlButton label="Toggle sound" onClick={() => setMuted((m) => !m)}>
          {muted ? <SoundOffIcon className="size-6" /> : <SoundOnIcon className="size-6" />}
        </ControlButton>
        <ControlButton label="Next video" onClick={goNext}>
          <ChevronRightIcon className="size-6" />
        </ControlButton>
      </div>
    </div>
  );
}

function ControlButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex size-10 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-white/10 text-white outline-none backdrop-blur-[10px] transition-all duration-300 ease-in-out hover:scale-110 hover:bg-white/20 md:size-[50px]"
    >
      {children}
    </button>
  );
}

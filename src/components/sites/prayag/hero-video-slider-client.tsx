"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { preload } from "react-dom";
import { cn } from "@/lib/utils";
export type HeroSlide = { alt: string; video: string; desktop: string; mobile: string; desktopSrcSet?: string; mobileSrcSet?: string };
import { ChevronRightIcon, SoundOffIcon, SoundOnIcon } from "./icons";
import { withBasePath, withBasePathSrcSet } from "@/lib/base-path";

/**
 * Source `.video-showcase`: each slide shows a poster <picture> until its webm can play,
 * then cross-fades to the video. A slide advances when its video ends; the next button
 * and dots switch manually. Videos load lazily (first one when the browser is idle).
 *
 * The video sits under the poster picture (always opaque) and the picture fades out once the
 * video can play. The video deliberately has no `poster`: a poster is one fixed URL for every
 * viewport, so phones would fetch the desktop banner as well and the <video> (not the banner
 * <img>) became the mobile "largest contentful paint", tied to the multi-MB video download.
 * Banners use static pre-resized srcsets (scripts/images/hero-banners.mjs) rather than the image
 * optimizer, whose q75 output was larger than these already-compact originals.
 */
/** Without any interaction, the first video starts this long after the window `load` event. */
const VIDEO_START_DELAY_MS = 8000;

export function HeroVideoSliderClient({
  slides: heroSlides,
  placeholder,
}: {
  slides: HeroSlide[];
  /** Blurred data-URI previews of the first banner (desktop / mobile art). */
  placeholder?: { desktop?: string; mobile?: string };
}) {
  // The first banner is the page's largest paint. It sits in a <picture> (which React does not
  // preload on its own) after ~70 KB of inline CSS, so hint both variants at the top of <head>.
  const first = heroSlides[0];
  preload(withBasePath(first.mobile), {
    as: "image",
    imageSrcSet: withBasePathSrcSet(first.mobileSrcSet ?? first.mobile),
    imageSizes: "100vw",
    fetchPriority: "high",
    media: "(max-width: 768px)",
  });
  preload(withBasePath(first.desktop), {
    as: "image",
    imageSrcSet: withBasePathSrcSet(first.desktopSrcSet ?? first.desktop),
    imageSizes: "100vw",
    fetchPriority: "high",
    media: "(min-width: 769px)",
  });
  const [current, setCurrent] = useState(0);
  const [muted, setMuted] = useState(true);
  const [loaded, setLoaded] = useState<boolean[]>(() => heroSlides.map(() => false));
  const [ready, setReady] = useState<boolean[]>(() => heroSlides.map(() => false));
  const videos = useRef<(HTMLVideoElement | null)[]>([]);

  const startLoading = useCallback((index: number) => {
    setLoaded((prev) => (prev[index] ? prev : prev.map((v, i) => (i === index ? true : v))));
  }, []);

  // The first video (2–3.5 MB) starts on the visitor's first interaction after the page has loaded
  // (pointer move, touch, scroll, key), or after VIDEO_START_DELAY_MS without one. The banner shows
  // from the first paint either way. Starting it unprompted a few seconds after load kept the hero
  // changing (video frames) while PageSpeed was still recording, which pushed Speed Index to 2.4–3.1 s
  // on desktop, and its download competed with fonts on slow phones. Data-saver mode keeps the banner.
  useEffect(() => {
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (connection?.saveData) return;
    const EVENTS = ["pointermove", "pointerdown", "touchstart", "scroll", "wheel", "keydown"] as const;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      cleanup();
      startLoading(0);
    };
    const arm = () => {
      EVENTS.forEach((e) => window.addEventListener(e, start, { passive: true, once: true }));
      timer = setTimeout(start, VIDEO_START_DELAY_MS);
    };
    const cleanup = () => {
      window.removeEventListener("load", arm);
      EVENTS.forEach((e) => window.removeEventListener(e, start));
      clearTimeout(timer);
    };
    if (document.readyState === "complete") arm();
    else window.addEventListener("load", arm, { once: true });
    return cleanup;
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
      {/* Until the first banner has loaded, its blurred preview fills the hero (instead of black). */}
      {current === 0 && !ready[0] && placeholder && (
        <>
          {placeholder.mobile && <div aria-hidden="true" className="absolute inset-0 bg-cover bg-[center_top] md:hidden" style={{ backgroundImage: `url(${placeholder.mobile})` }} />}
          {placeholder.desktop && <div aria-hidden="true" className="absolute inset-0 hidden bg-cover bg-[center_top] md:block" style={{ backgroundImage: `url(${placeholder.desktop})` }} />}
        </>
      )}
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
            src={withBasePath(loaded[i] ? slide.video : undefined)}
            onCanPlay={() => setReady((prev) => (prev[i] ? prev : prev.map((v, j) => (j === i ? true : v))))}
            onEnded={goNext}
            className="absolute inset-0 z-[1] size-full object-cover"
          />
          {(i === 0 || i === current || loaded[0]) && (
            <picture
              className={cn(
                "absolute inset-0 z-[2] block size-full transition-opacity duration-[600ms] ease-in-out",
                ready[i] && "pointer-events-none opacity-0",
              )}
            >
              <source media="(max-width: 768px)" srcSet={withBasePathSrcSet(slide.mobileSrcSet ?? slide.mobile)} sizes="100vw" type="image/webp" />
              <source media="(min-width: 769px)" srcSet={withBasePathSrcSet(slide.desktopSrcSet ?? slide.desktop)} sizes="100vw" type="image/webp" />
              <img
                src={withBasePath(slide.desktop)}
                alt={slide.alt}
                width={1920}
                height={840}
                loading={i === 0 ? "eager" : "lazy"}
                fetchPriority={i === 0 ? "high" : "auto"}
                decoding={i === 0 ? "sync" : "async"}
                className="absolute inset-0 size-full object-cover object-[center_top]"
              />
            </picture>
          )}
        </div>
      ))}

      {/* Each dot is drawn by a span inside a transparent 24px-tall button (WCAG 2.5.8 target size);
          the buttons abut, so the dots sit 16px apart and keep their size, colour and bottom offset. */}
      <div className="absolute bottom-[22px] left-1/2 z-10 flex -translate-x-1/2">
        {heroSlides.map((slide, i) => (
          <button
            key={slide.alt}
            type="button"
            aria-label={`Show slide ${i + 1}`}
            aria-current={i === current}
            onClick={() => goTo(i)}
            className="flex h-6 min-w-6 cursor-pointer items-center justify-center px-2 outline-none focus-visible:outline-2 focus-visible:outline-white"
          >
            <span
              aria-hidden="true"
              className={cn(
                "block h-2 rounded-full transition-all duration-300 ease-in-out",
                i === current ? "w-[30px] rounded-[4px] bg-white" : "w-2 bg-white/30",
              )}
            />
          </button>
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

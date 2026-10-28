"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import type { MfVideo as MfVideoData } from "./data";

/**
 * Click-to-play YouTube video (source `.mf-video`): the poster is a real link to the video
 * (works without JS); click / Enter / Space swaps in the embed with autoplay, shows a
 * "Loading video…" status, and after 8s without a load offers a "watch it on YouTube" link.
 */
export function MfVideo({ video, cinema = false }: { video: MfVideoData; cinema?: boolean }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playingRef = useRef(false);
  const slowTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [status, setStatus] = useState<"" | "loading" | "slow">("");
  const watchUrl = `https://www.youtube.com/watch?v=${video.id}`;

  useEffect(() => () => clearTimeout(slowTimer.current), []);

  const play = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const box = boxRef.current;
    const frame = frameRef.current;
    const iframe = iframeRef.current;
    if (!box || !frame || !iframe) return;

    setStatus("loading");
    playingRef.current = true;
    iframe.src = `https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1`;
    // Toggled on the DOM (as the source does) so React never rewrites the reveal classes.
    box.classList.add("is-playing");

    clearTimeout(slowTimer.current);
    slowTimer.current = setTimeout(() => {
      setStatus((s) => (s === "loading" ? "slow" : s));
    }, 8000);

    if (!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      frame.style.opacity = "0";
      frame.style.transition = "opacity 0.3s ease";
      requestAnimationFrame(() => {
        frame.style.opacity = "1";
      });
    }
    iframe.focus(); // keyboard users land on the player
  };

  return (
    <div ref={boxRef} className={cn("mf-video", cinema && "mf-video--cinema")} data-video-id={video.id} data-rv="">
      <a
        className="mf-video__poster"
        href={watchUrl}
        aria-label={video.label}
        onClick={play}
        onKeyDown={(e) => {
          if (e.key === " " || e.key === "Spacebar") play(e); // links only react to Enter by default
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- cover-cropped video poster, as the source */}
        <img src={video.poster} alt="" loading="lazy" />
        <span className="mf-video__play" aria-hidden="true" />
        <span className="mf-corners" aria-hidden="true" />
      </a>
      <div className={cn("mf-video__status", status === "slow" && "is-slow")} role="status" aria-live="polite">
        {status === "loading" && "Loading video…"}
        {status === "slow" && (
          <span>
            Still loading. If the video doesn{"’"}t start,{" "}
            <a href={watchUrl} target="_blank" rel="noopener">
              watch it on YouTube
            </a>
            .
          </span>
        )}
      </div>
      <div className="mf-video__frame" ref={frameRef}>
        <iframe
          ref={iframeRef}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          title={video.title}
          onLoad={() => {
            if (!playingRef.current) return; // ignore the initial about:blank load
            clearTimeout(slowTimer.current);
            setStatus("");
          }}
        />
      </div>
    </div>
  );
}

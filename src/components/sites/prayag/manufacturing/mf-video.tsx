"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import type { MfVideo as MfVideoData } from "./data";
import { withBasePath } from "@/lib/base-path";

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
    iframe.focus();
  };

  return (
    <div ref={boxRef} className={cn("mf-video", cinema && "mf-video--cinema")} data-video-id={video.id} data-rv="">
      <a
        className="mf-video__poster"
        href={withBasePath(watchUrl)}
        aria-label={video.label}
        onClick={play}
        onKeyDown={(e) => {
          if (e.key === " " || e.key === "Spacebar") play(e);
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- cover-cropped video poster, as the source */}
        <img {...(video.posterImg ?? { src: withBasePath(video.poster) })} alt="" loading="lazy" />
        <span className="mf-video__play" aria-hidden="true" />
        <span className="mf-corners" aria-hidden="true" />
      </a>
      <div className={cn("mf-video__status", status === "slow" && "is-slow")} role="status" aria-live="polite">
        {status === "loading" && "Loading video…"}
        {status === "slow" && (
          <span>
            Still loading. If the video doesn{"’"}t start,{" "}
            <a href={withBasePath(watchUrl)} target="_blank" rel="noopener">
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
            if (!playingRef.current) return;
            clearTimeout(slowTimer.current);
            setStatus("");
          }}
        />
      </div>
    </div>
  );
}

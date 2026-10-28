"use client";

import { useEffect, useRef, useState } from "react";

import { inlineEmbedUrl, type VideoCard } from "./data";

/**
 * Source `.video_item` with `.video-thumbnail-wrapper[data-video]`: clicking the thumbnail
 * hides it and loads the YouTube embed (autoplay) in its place, at the same 250px height.
 * The thumbnail is a real button (Enter/Space); focus moves to the player after the swap.
 */
export function InlineVideoCard({ card }: { card: VideoCard }) {
  const [playing, setPlaying] = useState(false);
  const frameRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (playing) frameRef.current?.focus();
  }, [playing]);

  return (
    <div className="vd-item vd-item--inline">
      <div className="vd-thumb-wrap">
        {playing ? (
          <iframe
            ref={frameRef}
            className="vd-frame"
            src={inlineEmbedUrl(card.id)}
            title={card.title}
            allow="autoplay; encrypted-media"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <button type="button" className="vd-thumb" aria-label={`Play video: ${card.title}`} onClick={() => setPlaying(true)}>
            {/* eslint-disable-next-line @next/next/no-img-element -- cover-cropped 250px thumbnail, as the source background-image */}
            <img src={card.thumb} alt="" loading="lazy" />
            <span className="vd-play" aria-hidden="true" />
          </button>
        )}
      </div>
      <h3>{card.title}</h3>
    </div>
  );
}

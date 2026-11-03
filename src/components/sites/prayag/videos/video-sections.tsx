import "./videos.css";

import type { VideoCard } from "./data";
import { InlineVideoCard } from "./inline-video-card";
import { TvVideoGrid } from "./tv-video-grid";
import { img } from "@/lib/image-dimensions";

/** Both grids are 3-up from 768px (one column below), so a thumbnail is at most ~34vw / 100vw wide. */
const withThumbs = (cards: VideoCard[]) => cards.map((c) => ({ ...c, thumbImg: img(c.thumb, "(min-width: 768px) 34vw, 100vw") }));

/** Product / feedback pages: 3-up grid (col-md-4 from 768px) of inline click-to-play cards. */
export function InlineVideoSection({ cards }: { cards: VideoCard[] }) {
  return (
    <section className="vd-page">
      <div className="prayag-container">
        <div className="-mx-3 flex flex-wrap gap-y-6">
          {withThumbs(cards).map((card) => (
            <div key={card.id + card.title} className="w-full px-3 min-[768px]:w-1/3">
              <InlineVideoCard card={card} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Video / TV advertisement page: cards open a modal YouTube player. */
export function TvVideoSection({ cards }: { cards: VideoCard[] }) {
  return (
    <section className="vd-page">
      <div className="prayag-container">
        <TvVideoGrid cards={withThumbs(cards)} />
      </div>
    </section>
  );
}

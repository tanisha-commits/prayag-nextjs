import "./videos.css";

import type { VideoCard } from "./data";
import { InlineVideoCard } from "./inline-video-card";
import { TvVideoGrid } from "./tv-video-grid";

/** Product / feedback pages: 3-up grid (col-md-4 from 768px) of inline click-to-play cards. */
export function InlineVideoSection({ cards }: { cards: VideoCard[] }) {
  return (
    <section className="vd-page">
      <div className="prayag-container">
        <div className="-mx-3 flex flex-wrap gap-y-6">
          {cards.map((card) => (
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
        <TvVideoGrid cards={cards} />
      </div>
    </section>
  );
}

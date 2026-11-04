import "../about/theme-base.css";
import "./ceo.css";

import { CeoFact } from "./ceo-fact";
import { CeoStory } from "./ceo-story";
import { ceoBanner, ceoFacts, ceoPortrait, ceoStory, ceoVisibleItems } from "./data";

import { fullImg } from "@/lib/image-dimensions";

export function CeoPage() {
  return (
    <div className="ceo-profile-page">
      <section className="ceo-body">
        <div className="ceo-wrap">
          <div className="ceo-grid">
            <CeoStory items={ceoStory} visible={ceoVisibleItems} title={ceoBanner.title} />
            <aside className="ceo-aside">
              <figure className="ceo-portrait">
                {/* eslint-disable-next-line @next/next/no-img-element -- natural-ratio portrait, as the source */}
                <img {...fullImg(ceoPortrait.src)}
                 
                  alt={ceoPortrait.alt}
                  width={ceoPortrait.width}
                  height={ceoPortrait.height}
                  loading="lazy"
                />
              </figure>
            </aside>
          </div>
          <ul className="ceo-facts">
            {ceoFacts.map((f) => (
              <CeoFact key={f.label} {...f} />
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

import "./theme-base.css";
import "./about.css";

import {
  aboutCounters,
  aboutIntro,
  aboutMilestones,
  aboutMilestonesTitle,
  aboutStory,
} from "./data";
import { HistCounter } from "./hist-counter";
import { HistTimeline } from "./hist-timeline";

/** Body of /about-prayag (source `.hist-page`; styles ported 1:1 into about.css). */
export function AboutPage() {
  return (
    <div className="hist-page">
      <section className="hist-intro">
        <div className="hist-wrap">
          <div className="hist-lead">
            <p>{aboutIntro}</p>
          </div>
        </div>
      </section>
      <section className="hist-story">
        <div className="hist-wrap">
          <div className="hist-story__grid">
            <div className="hist-figure">
              <figure className="hist-figure__frame">
                {/* eslint-disable-next-line @next/next/no-img-element -- natural-ratio editorial image, as the source */}
                <img src={aboutStory.image} alt="" loading="lazy" />
              </figure>
            </div>
            <div className="hist-desc">
              {aboutStory.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="hist-counters">
        <div className="hist-wrap">
          <ul className="hist-counters__list">
            {aboutCounters.map((c) => (
              <li key={c.label}>
                <HistCounter value={c.value} label={c.label} />
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="hist-miles">
        <div className="hist-wrap">
          <h2 className="hist-miles__title">{aboutMilestonesTitle}</h2>
          <HistTimeline items={aboutMilestones} />
        </div>
      </section>
    </div>
  );
}

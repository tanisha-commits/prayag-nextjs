import "../about/theme-base.css";
import "./manufacturing.css";

import { mfDetail, mfFilm, mfIntro, mfOpvc, mfPlant } from "./data";
import { MfRoot } from "./mf-root";
import { MfVideo } from "./mf-video";

const pad = (n: number) => (n < 10 ? `0${n}` : String(n));

function Marker({ n }: { n: number }) {
  return (
    <div className="mf-marker" aria-hidden="true" data-rv="">
      <span>{pad(n)}</span>
      <i />
    </div>
  );
}

/** Body of /manufacturing-process (source `.mf-page`; styles ported 1:1 into manufacturing.css). */
export function MfPage() {
  return (
    <MfRoot>
      <section className="mf-intro">
        <div className="mf-wrap">
          <Marker n={1} />
          <div className="mf-intro__grid">
            <div className="mf-intro__main">
              <div className="mf-text">
                <p>{mfIntro.lead}</p>
              </div>
              <div className="mf-text">
                {mfIntro.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </div>
            <aside className="mf-intro__side">
              <figure className="mf-media mf-mask">
                <div className="mf-media__frame">
                  {/* eslint-disable-next-line @next/next/no-img-element -- natural-ratio photo, as the source */}
                  <img src={mfIntro.image} alt="" loading="lazy" />
                  <span className="mf-corners" aria-hidden="true" />
                </div>
              </figure>
            </aside>
          </div>
        </div>
      </section>
      <section className="mf-film mf-dark">
        <div className="mf-wrap">
          <Marker n={2} />
          <MfVideo video={mfFilm} cinema />
        </div>
      </section>
      <section className="mf-plant">
        <div className="mf-wrap">
          <Marker n={3} />
          <div className="mf-plant__grid">
            <div className="mf-plant__main">
              <div className="mf-text">
                <h2>
                  {mfPlant.headingLines[0]}
                  <br />
                  {mfPlant.headingLines[1]}
                </h2>
                {mfPlant.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
              <ol className="mf-index" aria-hidden="true">
                {mfPlant.index.map((item, i) => (
                  <li key={item}>
                    <b>{pad(i + 1)}</b>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="mf-plant__side">
              <MfVideo video={mfPlant.video} />
            </div>
          </div>
        </div>
      </section>
      <section className="mf-opvc mf-dark">
        <div className="mf-wrap">
          <Marker n={4} />
          <div className="mf-opvc__grid">
            <h2 className="mf-opvc__title" data-rv="">
              {mfOpvc.title}
            </h2>
            <MfVideo video={mfOpvc.video} />
          </div>
        </div>
      </section>
      <section className="mf-detail">
        <div className="mf-wrap">
          <div className="mf-detail__grid">
            <aside className="mf-detail__side">
              <figure className="mf-media mf-mask">
                <div className="mf-media__frame">
                  {/* eslint-disable-next-line @next/next/no-img-element -- natural-ratio photo, as the source */}
                  <img src={mfDetail.image} alt={mfDetail.imageAlt} loading="lazy" />
                  <span className="mf-corners" aria-hidden="true" />
                </div>
              </figure>
            </aside>
            <ol className="mf-steps">
              {mfDetail.steps.map((step, i) => (
                <li data-rv="" key={step}>
                  <span className="mf-steps__n" aria-hidden="true">
                    {pad(i + 1)}
                  </span>
                  <p>{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </MfRoot>
  );
}

import "../about/theme-base.css";
import "./sustainability.css";

import { susProjects, susProjectsTitle, susPurpose, susReports, susTrust } from "./data";
import { SusProjects } from "./sus-projects";
import { SusRoot } from "./sus-root";
import { withBasePath } from "@/lib/base-path";
import { fullImg } from "@/lib/image-dimensions";

/** Body of /sustainability (source `.sus-page`; styles ported 1:1 into sustainability.css). */
export function SusPage() {
  return (
    <SusRoot>
      <section className="sus-purpose">
        <div className="sus-wrap">
          <div className="sus-purpose__grid">
            <div className="sus-text">
              <h2>{susPurpose.heading}</h2>
              <p>{susPurpose.text}</p>
            </div>
            <figure className="sus-media sus-mask" data-from="right">
              <div className="sus-media__frame">
                {/* eslint-disable-next-line @next/next/no-img-element -- natural-ratio photo, as the source */}
                <img {...fullImg(susPurpose.image)} alt="" loading="lazy" />
              </div>
            </figure>
          </div>
        </div>
      </section>
      <section className="sus-trust">
        <div className="sus-wrap">
          <div className="sus-trust__grid">
            <div className="sus-text">
              <h2>{susTrust.heading}</h2>
              {susTrust.intro.map((t) => (
                <p key={t}>{t}</p>
              ))}
              <ul>
                {susTrust.projects.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              <p>{susTrust.outro}</p>
            </div>
            <figure className="sus-media sus-mask" data-from="left">
              <div className="sus-media__frame">
                {/* eslint-disable-next-line @next/next/no-img-element -- natural-ratio photo, as the source */}
                <img {...fullImg(susTrust.image)} alt="" loading="lazy" />
              </div>
            </figure>
          </div>
        </div>
      </section>
      <SusProjects title={susProjectsTitle} projects={susProjects.map((p) => ({ ...p, imageImg: fullImg(p.image) }))} />
      <section className="sus-reports">
        <div className="sus-wrap">
          <div className="sus-reports__grid">
            {susReports.map((r) => (
              <a className="sus-report" data-rv="" href={withBasePath(r.href)} target="_blank" rel="noopener" key={r.href}>
                <span className="sus-report__thumb">
                  {/* eslint-disable-next-line @next/next/no-img-element -- cover-cropped report thumbnail, as the source */}
                  <img {...fullImg(r.image)} alt={r.imageAlt} loading="lazy" />
                </span>
                <h3 className="sus-report__name">{r.name}</h3>
                <span className="sus-report__icon" aria-hidden="true">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="square"
                  >
                    <path d="M12 3v13M6 11l6 6 6-6M5 21h14" />
                  </svg>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </SusRoot>
  );
}

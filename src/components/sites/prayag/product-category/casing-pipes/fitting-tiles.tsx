"use client";

import { useRef } from "react";

export interface Fitting {
  line: string;
  name: string;
  sub: string;
  mark: React.ReactNode;
  intro: string;
  points: string[];
}

/**
 * Source `section.pt-fittings` tiles, each opening its `dialog.pt-fitting-dialog` with
 * showModal(). Closes on the close button, a backdrop click and Esc (native); focus then
 * returns to the tile that opened it. The dialogs follow the section, as on the source.
 */
export function FittingTiles({ fittings }: { fittings: Fitting[] }) {
  const dialogs = useRef(new Map<string, HTMLDialogElement>());
  const tiles = useRef(new Map<string, HTMLButtonElement>());

  return (
    <>
      <section className="pt-fittings" id="advantge">
        <div className="container-fluid">
          <div className="pt-inner">
            <p className="pt-eyebrow">ADVANTAGE</p>
            <h2 className="pt-title">How Prayag Casing Pipes Work</h2>
            <p className="pt-lede">
              Prayag Casing Pipes are installed along the borewell wall to create a strong and stable lining that
              prevents the surrounding soil from collapsing into the borehole. The casing protects the borewell from
              sand, silt, and external contaminants while providing a secure passage for the installation of column
              pipes and pumping systems. In water-bearing zones, well screen pipes with precision slots allow
              groundwater to enter while filtering out unwanted particles, ensuring a clean and efficient water supply.
            </p>

            <div className="pt-tile-grid">
              {fittings.map((f) => (
                <button
                  key={f.line}
                  ref={(el) => {
                    if (el) tiles.current.set(f.line, el);
                  }}
                  type="button"
                  className="pt-tile"
                  data-line={f.line}
                  data-target={`pt-dlg-${f.line}`}
                  aria-haspopup="dialog"
                  aria-controls={`pt-dlg-${f.line}`}
                  onClick={() => dialogs.current.get(f.line)?.showModal()}
                >
                  <span className="pt-tile-mark" aria-hidden="true">
                    {f.mark}
                  </span>
                  <div>
                    <p className="pt-tile-name">{f.name}</p>
                    <p className="pt-tile-sub">{f.sub}</p>
                  </div>
                  <span className="pt-tile-hint">
                    View details
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {fittings.map((f) => (
        <dialog
          key={f.line}
          ref={(el) => {
            if (el) dialogs.current.set(f.line, el);
          }}
          id={`pt-dlg-${f.line}`}
          className="pt-fitting-dialog"
          aria-labelledby={`pt-dlg-${f.line}-title`}
          onClick={(e) => {
            if (e.target === e.currentTarget) e.currentTarget.close();
          }}
          onClose={() => tiles.current.get(f.line)?.focus()}
        >
          <div className="pt-dialog-head">
            <div>
              <h3 id={`pt-dlg-${f.line}-title`}>{f.name}</h3>
              <p>{f.sub}</p>
            </div>
            <button
              type="button"
              className="pt-dialog-close"
              aria-label="Close dialog"
              data-pt-close=""
              onClick={() => dialogs.current.get(f.line)?.close()}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
          <div className="pt-dialog-body">
            <p>{f.intro}</p>
            <ul className="pt-dialog-list">
              {f.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
        </dialog>
      ))}
    </>
  );
}

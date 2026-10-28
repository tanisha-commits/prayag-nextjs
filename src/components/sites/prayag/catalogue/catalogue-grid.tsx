import { catalogues } from "./data";
import "./catalogue.css";

/**
 * Source `section.catalogue_wrapper`. On the source each card is a single link with the typo
 * `taregt="blank"`, so the PDF opens in the same tab. Here the cover and title open the PDF in a new
 * tab (rel="noopener noreferrer") and the "Download" label is its own link with the `download`
 * attribute, so the file can be saved directly. Visually identical to the source card.
 */
export function CatalogueGrid() {
  return (
    <section className="catalogue_wrapper">
      {/* Source `.container-fluid { overflow: hidden }` clips overflowing card text. */}
      <div className="prayag-container overflow-hidden">
        <div className="catalogue-row">
          {catalogues.map((c) => (
            <div className="catalogue-col" key={c.pdf}>
              <div className="catalogue_item">
                <a href={c.pdf} target="_blank" rel="noopener noreferrer" className="catalogue-cover" tabIndex={-1} aria-hidden="true">
                  <div className="catalogue_image">
                    {/* eslint-disable-next-line @next/next/no-img-element -- source keeps the cover's natural ratio */}
                    <img src={c.image} alt={c.alt} />
                  </div>
                </a>
                <div className="catalogue_content">
                  <h3>
                    <a href={c.pdf} target="_blank" rel="noopener noreferrer">
                      {c.title}
                      <span className="sr-only"> (PDF, {c.size}, opens in a new tab)</span>
                    </a>
                  </h3>
                  <h4>
                    <a href={c.pdf} download>
                      Download<span className="sr-only"> {c.title.trim()} (PDF, {c.size})</span>
                    </a>
                  </h4>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

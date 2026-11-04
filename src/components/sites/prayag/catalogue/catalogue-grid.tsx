import { catalogues } from "./data";
import "./catalogue.css";
import { withBasePath } from "@/lib/base-path";
import { fullImg } from "@/lib/image-dimensions";

export function CatalogueGrid() {
  return (
    <section className="catalogue_wrapper">
      <div className="prayag-container overflow-hidden">
        <div className="catalogue-row">
          {catalogues.map((c) => (
            <div className="catalogue-col" key={c.pdf}>
              <div className="catalogue_item">
                <a href={withBasePath(c.pdf)} target="_blank" rel="noopener noreferrer" className="catalogue-cover" tabIndex={-1} aria-hidden="true">
                  <div className="catalogue_image">
                    {/* eslint-disable-next-line @next/next/no-img-element -- source keeps the cover's natural ratio */}
                    <img {...fullImg(c.image)} alt={c.alt} />
                  </div>
                </a>
                <div className="catalogue_content">
                  <h3>
                    <a href={withBasePath(c.pdf)} target="_blank" rel="noopener noreferrer">
                      {c.title}
                      <span className="sr-only"> (PDF, {c.size}, opens in a new tab)</span>
                    </a>
                  </h3>
                  <h4>
                    <a href={withBasePath(c.pdf)} download>
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

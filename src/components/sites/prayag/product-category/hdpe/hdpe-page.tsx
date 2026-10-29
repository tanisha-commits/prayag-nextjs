import { PcatPage } from "../pcat-page";
import { SlickCarousel, type SlickSettings } from "../slick-carousel";
import { PtDialog, PtTile } from "./pt-dialog";
import { SplitRevealSection } from "../split-reveal";
import { TabGroup } from "./tab-group";
import "./hdpe.css";

// Slick settings verbatim from the page's inline script (it initialises before the theme's
// Drupal behavior for .ngp-features-slider, so the inline settings are the ones in effect).
const NGP_SLICK: SlickSettings = {
  infinite: true,
  swipe: true,
  adaptiveHeight: false,
  arrows: true,
  dots: false,
  slidesToShow: 4,
  slidesToScroll: 1,
  responsive: [
    { breakpoint: 1200, settings: { slidesToShow: 3, slidesToScroll: 1 } },
    { breakpoint: 992, settings: { slidesToShow: 2, slidesToScroll: 1 } },
    { breakpoint: 576, settings: { slidesToShow: 1, slidesToScroll: 1 } },
  ],
};

const GRADES_SLICK: SlickSettings = {
  infinite: true,
  swipe: true,
  adaptiveHeight: false,
  arrows: true,
  dots: false,
  slidesToShow: 3,
  slidesToScroll: 1,
  responsive: [
    { breakpoint: 992, settings: { slidesToShow: 2, slidesToScroll: 1 } },
    { breakpoint: 768, settings: { slidesToShow: 1, slidesToScroll: 1 } },
  ],
};

/** https://prayagindia.com/hdpe (taxonomy term 221), content between the header and the footer. */
export function HdpePage() {
  return (
    <PcatPage slug="hdpe">
      <div className="breadcrumb_main">
        <div className="container-fluid p-0">
          <div className="row">
            <div className="col-md-6">
              {/* eslint-disable-next-line @next/next/no-img-element -- source <img> kept 1:1 (intrinsic sizing) */}
              <img src="/sites/prayag/files/styles/medium/public/2026-10/main-banner-hdpe.webp" srcSet="/sites/prayag/files/styles/thumbnail/public/2026-10/main-banner-hdpe.webp 300w, /sites/prayag/files/styles/thumbnail/public/2026-10/main-banner-hdpe.webp 600w, /sites/prayag/files/styles/large/public/2026-10/main-banner-hdpe.webp 1200w, /sites/prayag/files/styles/wide/public/2026-10/main-banner-hdpe.webp 2000w" sizes="(max-width: 300px) 300px, (max-width: 600px) 600px, (max-width: 1200px) 1200px, 2000px" alt="HDPE" width="800" height="450" className="img-fluid" decoding="async" fetchPriority="high" />
            </div>
            <div className="col-md-6">
              <div className="breadcrumb_title">
                <h1 className="black_title">HDPE Pipes</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
      <section className="prayag-section overflow-hidden">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-12 col-md-6">
              <div className="prayag-content-box">
                <h2>Strong Built</h2>
                <p className="prayag-subtitle">For Reliable Fluid Transportation</p>
                <p>
                  Prayag HDPE Pipes &amp; Coils are designed for dependable performance across water supply, drainage, sewerage and other demanding piping applications. Manufactured from High Density Polyethylene, these pipes offer excellent resistance to corrosion and chemicals while providing a smooth internal surface for efficient flow.
                </p>
              </div>
            </div>
            <div className="col-12 col-md-6 p-0">
              {/* eslint-disable-next-line @next/next/no-img-element -- source <img> kept 1:1 (intrinsic sizing) */}
              <img src="/sites/prayag/theme/HDPE/IMAGE-2.webp" alt="Prayag HDPE Pipes and Coils" className="prayag-pipe-img" />
            </div>
          </div>
        </div>
      </section>
      <section className="ngp-section" style={{ background: "#1a1a1a", padding: "60px 0" }}>
        <div className="container-fluid">
          <h2 className="text-center" style={{ color: "#fff" }}>Why Choose <strong>Prayag HDPE</strong> Pipes</h2>
          <SlickCarousel className="ngp-features-slider" style={{ color: "#fff" }} settings={NGP_SLICK} aria-label="Why Choose Prayag HDPE Pipes">
            <div className="ngp-feature-item">
              <div className="ngp-icon-circle">
                {/* eslint-disable-next-line @next/next/no-img-element -- source <img> kept 1:1 (intrinsic sizing) */}
                <img src="/sites/prayag/theme/HDPE/icon%20webp/Excellent-Chemical-Resistance.webp" alt="" />
              </div>
              <h3 className="ngp-feature-label">Excellent Chemical Resistance</h3>
              <p className="ngp_para">Resists a wide range of chemicals for demanding fluid transportation applications.</p>
            </div>
            <div className="ngp-feature-item">
              <div className="ngp-icon-circle">
                {/* eslint-disable-next-line @next/next/no-img-element -- source <img> kept 1:1 (intrinsic sizing) */}
                <img src="/sites/prayag/theme/HDPE/icon%20webp/Corrosion-Resistant.webp" alt="" />
              </div>
              <h3 className="ngp-feature-label">Corrosion Resistant</h3>
              <p className="ngp_para">Withstands internal and external corrosion for long-lasting performance.</p>
            </div>
            <div className="ngp-feature-item">
              <div className="ngp-icon-circle">
                {/* eslint-disable-next-line @next/next/no-img-element -- source <img> kept 1:1 (intrinsic sizing) */}
                <img src="/sites/prayag/theme/HDPE/icon%20webp/Lightweight-Easy-to-Handle.webp" alt="" />
              </div>
              <h3 className="ngp-feature-label">Lightweight &amp; Easy to Handle</h3>
              <p className="ngp_para">Lighter than steel, making transportation, handling and installation easier.</p>
            </div>
            <div className="ngp-feature-item">
              <div className="ngp-icon-circle">
                {/* eslint-disable-next-line @next/next/no-img-element -- source <img> kept 1:1 (intrinsic sizing) */}
                <img src="/sites/prayag/theme/HDPE/icon%20webp/Faster-Installation.webp" alt="" />
              </div>
              <h3 className="ngp-feature-label">Faster Installation</h3>
              <p className="ngp_para">Welded joints enable faster installation with less excavation and backfilling.</p>
            </div>
            <div className="ngp-feature-item">
              <div className="ngp-icon-circle">
                {/* eslint-disable-next-line @next/next/no-img-element -- source <img> kept 1:1 (intrinsic sizing) */}
                <img src="/sites/prayag/theme/HDPE/icon%20webp/Smooth-Internal-Bore.webp" alt="" />
              </div>
              <h3 className="ngp-feature-label">Smooth Internal Bore</h3>
              <p className="ngp_para">Provides lower flow resistance and reduced head loss for efficient fluid flow.</p>
            </div>
            <div className="ngp-feature-item">
              <div className="ngp-icon-circle">
                {/* eslint-disable-next-line @next/next/no-img-element -- source <img> kept 1:1 (intrinsic sizing) */}
                <img src="/sites/prayag/theme/HDPE/icon%20webp/Low-Maintenance.webp" alt="" />
              </div>
              <h3 className="ngp-feature-label">Low Maintenance</h3>
              <p className="ngp_para">Durable and corrosion-resistant construction helps minimize maintenance needs.</p>
            </div>
          </SlickCarousel>
        </div>
      </section>
      <section className="main_filled_scrolled_sec">
        <div className="msf-track">
          <div className="msf-stage">
            <div className="msf-slide-wrap">
              <div className="msf-image-wrap">
                {/* eslint-disable-next-line @next/next/no-img-element -- source <img> kept 1:1 (intrinsic sizing) */}
                <img className="msf-image" src="/sites/prayag/theme/HDPE/IMAGE-3-BANNER-.webp" alt="Prayag HDPE pipes for water supply and underground infrastructure" />
              </div>
            </div>
          </div>
        </div>
      </section>
      <SplitRevealSection>
        <div className="psr-container">
          <div className="psr-image-col">
            <div className="psr-image-wrap">
              {/* eslint-disable-next-line @next/next/no-img-element -- source <img> kept 1:1 (intrinsic sizing) */}
              <img className="psr-image" src="/sites/prayag/theme/HDPE/IMAGE-4.webp" alt="What are HDPE Pipes" />
            </div>
          </div>
          <div className="psr-content-col">
            <div className="psr-content">
              <h2>What are HDPE Pipes?</h2>
              <p className="psr-description">
                HDPE stands for High Density Polyethylene, a durable thermoplastic material widely used for piping applications. Prayag HDPE Pipes are manufactured using polyethylene grades including PE-63, PE-80 and PE-100. Prayag HDPE pipes range offers products as per IS 4984:2016, with the range covering multiple nominal outside diameters and pressure classes.
              </p>
              <p className="psr-description">
                The pipes are designed to combine strength, flexibility, chemical resistance and ease of installation, making them suitable for a wide range of infrastructure and utility applications.
              </p>
              <a href="#hdpe-grades" className="prayag-btn">
                <svg width="22" height="12" viewBox="0 0 22 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21.2308 5.99866C21.2211 5.78469 21.1301 5.53538 20.9771 5.37908L15.9807 0.279282C15.6418 -0.0128267 14.993 -0.133765 14.6154 0.204859C14.2436 0.537901 14.2533 1.18352 14.6251 1.51656L18.1381 5.09813H0.937304C0.420215 5.09813 0 5.50188 0 5.99864C0 6.49542 0.420245 6.89914 0.937304 6.89914H18.1381L14.6251 10.4807C14.3055 10.7877 14.2455 11.4557 14.6154 11.7924C14.9834 12.1292 15.6573 12.0213 15.9807 11.718L20.9771 6.61819C21.1475 6.4433 21.2308 6.23868 21.2308 5.99866Z" fill="black" />
                </svg>
                {" "}
                Know More
              </a>
            </div>
          </div>
        </div>
      </SplitRevealSection>
      <section className="ka-applications pt-0">
        <div className="container-fluid">
          <h2 className="ka-title">Application</h2>
          <div className="ka-grid">
            <div className="ka-card">
              <div className="ka-image">
                {/* eslint-disable-next-line @next/next/no-img-element -- source <img> kept 1:1 (intrinsic sizing) */}
                <img src="/sites/prayag/theme/HDPE/Applications/WATER-SUPPY-Application-.webp" alt="Water supply" />
              </div>
              <div className="ka-card-body">
                <h3>Water Supply</h3>
                <p>Suitable for durable and reliable water transportation and distribution systems.</p>
              </div>
            </div>
            <div className="ka-card">
              <div className="ka-image">
                {/* eslint-disable-next-line @next/next/no-img-element -- source <img> kept 1:1 (intrinsic sizing) */}
                <img src="/sites/prayag/theme/HDPE/Applications/Drainage-Sewerage-Application-.webp" alt="Underground drainage and sewerage" />
              </div>
              <div className="ka-card-body">
                <h3>Underground Drainage &amp; Sewerage</h3>
                <p>Used for drainage and sewerage systems, including undulating terrains.</p>
              </div>
            </div>
            <div className="ka-card">
              <div className="ka-image">
                {/* eslint-disable-next-line @next/next/no-img-element -- source <img> kept 1:1 (intrinsic sizing) */}
                <img src="/sites/prayag/theme/HDPE/Applications/Effluent-Wastewater-Disposal-Application-.webp" alt="Effluent and wastewater disposal" />
              </div>
              <div className="ka-card-body">
                <h3>Effluent &amp; Wastewater Disposal</h3>
                <p>Suitable for transporting wastewater and chemically varied effluents.</p>
              </div>
            </div>
            <div className="ka-card">
              <div className="ka-image">
                {/* eslint-disable-next-line @next/next/no-img-element -- source <img> kept 1:1 (intrinsic sizing) */}
                <img src="/sites/prayag/theme/HDPE/Applications/Gas-Distribution-Application.webp" alt="Domestic gas distribution" />
              </div>
              <div className="ka-card-body">
                <h3>Domestic Gas Distribution</h3>
                <p>Suitable for underground gas distribution systems.</p>
              </div>
            </div>
            <div className="ka-card">
              <div className="ka-image">
                {/* eslint-disable-next-line @next/next/no-img-element -- source <img> kept 1:1 (intrinsic sizing) */}
                <img src="/sites/prayag/theme/HDPE/Applications/Submarine-Pipelines-Application-.webp" alt="Submarine pipelines" />
              </div>
              <div className="ka-card-body">
                <h3>Submarine Pipelines</h3>
                <p>Used for underwater applications, including river crossings and marine outfalls.</p>
              </div>
            </div>
            <div className="ka-card">
              <div className="ka-image">
                {/* eslint-disable-next-line @next/next/no-img-element -- source <img> kept 1:1 (intrinsic sizing) */}
                <img src="/sites/prayag/theme/HDPE/Applications/Infrastructure-Utility-Networks.webp" alt="Infrastructure and utility networks" />
              </div>
              <div className="ka-card-body">
                <h3>Infrastructure &amp; Utility Networks</h3>
                <p>Suitable for underground utility networks requiring durability and corrosion resistance.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="prayag-work-section" id="advantage">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-lg-6 col-md-12 p-0">
              <div className="visual-wrapper">
                {/* eslint-disable-next-line @next/next/no-img-element -- source <img> kept 1:1 (intrinsic sizing) */}
                <img src="/sites/prayag/theme/HDPE/IMAGE-4.webp" alt="Prayag HDPE Pipes advantage" className="img-fluid main-img" />
              </div>
            </div>
            <div className="col-lg-6 col-md-12 p-0">
              <div className="prayag_work_content">
                <h2>The Prayag Advantage</h2>
                <ul className="advantages_list">
                  <li>
                    <div>
                      <strong>Excellent Chemical Resistance</strong>
                      <span>Resists a wide range of chemicals for reliable fluid transportation.</span>
                    </div>
                  </li>
                  <li>
                    <div>
                      <strong>Superior Corrosion Resistance</strong>
                      <span>Provides lasting protection against internal and external corrosion.</span>
                    </div>
                  </li>
                  <li>
                    <div>
                      <strong>Lightweight &amp; Easy to Handle</strong>
                      <span>Makes transportation, handling and installation more convenient.</span>
                    </div>
                  </li>
                  <li>
                    <div>
                      <strong>Flexible &amp; Durable</strong>
                      <span>Offers flexibility and strength for varied installation conditions.</span>
                    </div>
                  </li>
                  <li>
                    <div>
                      <strong>Efficient Water Flow</strong>
                      <span>Smooth internal surface supports efficient fluid movement.</span>
                    </div>
                  </li>
                  <li>
                    <div>
                      <strong>Leak-Resistant Jointing</strong>
                      <span>Click ring supported or welded joints provide strong and secure connections.</span>
                    </div>
                  </li>
                  <li>
                    <div>
                      <strong>Faster Installation</strong>
                      <span>Lightweight construction and welded jointing help simplify installation.</span>
                    </div>
                  </li>
                  <li>
                    <div>
                      <strong>Low Maintenance</strong>
                      <span>Durable construction helps reduce long-term maintenance requirements.</span>
                    </div>
                  </li>
                  <li>
                    <div>
                      <strong>Versatile Applications</strong>
                      <span>Suitable for water supply, drainage, sewerage and utility networks.</span>
                    </div>
                  </li>
                  <li>
                    <div>
                      <strong>Long Service Life</strong>
                      <span>Designed for dependable performance over an extended service life.</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="prayag-fitting-specs" id="hdpe-grades" aria-labelledby="hdpe-grades-heading">
        <div className="container-fluid">
          <header className="prayag-fitting-specs__header">
            <h2 id="hdpe-grades-heading">HDPE Pipe Grades</h2>
          </header>
          <div className="tab-content prayag-fitting-specs__content">
            <div className="tab-pane fade show active" id="pane-hdpe-grades" role="tabpanel" tabIndex={0}>
              <SlickCarousel className="cfs-slider js-cfs-slider" settings={GRADES_SLICK} aria-label="HDPE pipe grades">
                <article className="cfs-card">
                  <figure className="cfs-card__figure">
                    {/* eslint-disable-next-line @next/next/no-img-element -- source <img> kept 1:1 (intrinsic sizing) */}
                    <img src="/sites/prayag/theme/HDPE/HDPE%20Pipe%20Grades/PE-63.webp" alt="PE-63 HDPE pipe grade" loading="lazy" width="600" height="400" className="cfs-card__img" />
                  </figure>
                  <div className="cfs-card__body">
                    <h3 className="cfs-card__title">PE-63</h3>
                    <p className="cfs-card__desc">Polyethylene grade used in the specified HDPE pipe range.</p>
                    <p className="cfs-card__usage-label">Usage</p>
                    <ul className="cfs-card__usage">
                      <li>Agricultural irrigation and sprinkler systems</li>
                      <li>Drinking water supply in rural and urban areas</li>
                      <li>Industrial wastewater and chemical transportation</li>
                      <li>Protection of underground cables and drainage systems</li>
                    </ul>
                  </div>
                </article>
                <article className="cfs-card">
                  <figure className="cfs-card__figure">
                    {/* eslint-disable-next-line @next/next/no-img-element -- source <img> kept 1:1 (intrinsic sizing) */}
                    <img src="/sites/prayag/theme/HDPE/HDPE%20Pipe%20Grades/PE--80.webp" alt="PE-80 HDPE pipe grade" loading="lazy" width="600" height="400" className="cfs-card__img" />
                  </figure>
                  <div className="cfs-card__body">
                    <h3 className="cfs-card__title">PE-80</h3>
                    <p className="cfs-card__desc">Polyethylene grade available for water supply and sewerage applications.</p>
                    <p className="cfs-card__usage-label">Usage</p>
                    <ul className="cfs-card__usage">
                      <li>Drinking water supply systems</li>
                      <li>Agricultural sprinkler and drip irrigation systems</li>
                      <li>Sewage and wastewater pipelines</li>
                      <li>Low-pressure gas distribution systems</li>
                    </ul>
                  </div>
                </article>
                <article className="cfs-card">
                  <figure className="cfs-card__figure">
                    {/* eslint-disable-next-line @next/next/no-img-element -- source <img> kept 1:1 (intrinsic sizing) */}
                    <img src="/sites/prayag/theme/HDPE/HDPE%20Pipe%20Grades/PE--100.webp" alt="PE-100 HDPE pipe grade" loading="lazy" width="600" height="400" className="cfs-card__img" />
                  </figure>
                  <div className="cfs-card__body">
                    <h3 className="cfs-card__title">PE-100</h3>
                    <p className="cfs-card__desc">Higher-performance polyethylene grade available across specified pressure classes.</p>
                    <p className="cfs-card__usage-label">Usage</p>
                    <ul className="cfs-card__usage">
                      <li>Municipal drinking water supply and borewell systems</li>
                      <li>Agricultural drip and sprinkler irrigation systems</li>
                      <li>Industrial fluid, chemical, and slurry transportation</li>
                      <li>Sewage, drainage, and underground pipeline installations</li>
                    </ul>
                  </div>
                </article>
              </SlickCarousel>
            </div>
          </div>
        </div>
      </section>
      <section className="prayag-specs" id="specification">
        <div className="container-fluid">
          <div className="prayag-specs__header">
            <h2 className="prayag-specs__title">Specification</h2>
          </div>
          <TabGroup
            listClassName="nav prayag-specs__tabs"
            tabClassName="prayag-specs__tab"
            contentClassName="prayag-specs__content"
            paneClassName="prayag-specs__pane"
            activePaneClassName="active"
            items={[
              {
                paneId: "spec-pe63-80",
                label: "HDPE Pipes PE-63 / PE-80",
                panel: (
                  <div className="prayag-specs__table-wrap">
                    <table className="prayag-specs__table">
                      <thead>
                        <tr>
                          <th>Specification</th>
                          <th>Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td data-label="Specification">Product</td>
                          <td data-label="Details">HDPE Pipes</td>
                        </tr>
                        <tr>
                          <td data-label="Specification">Material</td>
                          <td data-label="Details">High Density Polyethylene</td>
                        </tr>
                        <tr>
                          <td data-label="Specification">Grades</td>
                          <td data-label="Details">PE-63 &amp; PE-80</td>
                        </tr>
                        <tr>
                          <td data-label="Specification">Nominal Pressure</td>
                          <td data-label="Details">2.5 to 16</td>
                        </tr>
                        <tr>
                          <td data-label="Specification">Nominal Diameter</td>
                          <td data-label="Details">63 mm to 400 mm</td>
                        </tr>
                        <tr>
                          <td data-label="Specification">Jointing</td>
                          <td data-label="Details">Welded jointing / click-ring type fittings</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ),
              },
              {
                paneId: "spec-pe100",
                label: "HDPE Pipes PE-100",
                panel: (
                  <div className="prayag-specs__table-wrap">
                    <table className="prayag-specs__table">
                      <thead>
                        <tr>
                          <th>Specification</th>
                          <th>Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td data-label="Specification">Product</td>
                          <td data-label="Details">HDPE Pipes</td>
                        </tr>
                        <tr>
                          <td data-label="Specification">Material</td>
                          <td data-label="Details">High Density Polyethylene</td>
                        </tr>
                        <tr>
                          <td data-label="Specification">Grades</td>
                          <td data-label="Details">PE-100</td>
                        </tr>
                        <tr>
                          <td data-label="Specification">Nominal Pressure</td>
                          <td data-label="Details">6 to 16</td>
                        </tr>
                        <tr>
                          <td data-label="Specification">Nominal Diameter</td>
                          <td data-label="Details">63 mm to 400 mm</td>
                        </tr>
                        <tr>
                          <td data-label="Specification">Jointing</td>
                          <td data-label="Details">Welded jointing / click-ring type fittings</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ),
              },
            ]}
          />
        </div>
      </section>
      <section className="pt-fittings pe-section pe-section--grey" id="plb-ducts">
        <div className="container-fluid">
          <div className="pt-inner">
            <p className="pt-eyebrow">PLB HDPE Ducts</p>
            <h2 className="pt-title">Permanently Lubricated (PLB) HDPE Ducts</h2>
            <p className="pt-lede">
              Prayag Permanently Lubricated (PLB) HDPE Ducts are manufactured using the Co-extrusion technique and are designed for laying Optic Fiber Cables in underground ducting and conduits. These ducts are available in multiple sizes ranging from 20 mm to 110 mm.
            </p>
            <div className="pt-tile-grid">
              <PtTile target="pt-dlg-plb-app">
                <span className="pt-tile-mark" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor">
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                    <rect x="14" y="14" width="7" height="7" rx="1" />
                  </svg>
                </span>
                <div>
                  <p className="pt-tile-name">Applications</p>
                  <p className="pt-tile-sub">Telecom, railways, highways, broadband and more</p>
                </div>
                <span className="pt-tile-hint">
                  View details
                  {" "}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              </PtTile>
              {" "}
              <PtTile target="pt-dlg-plb-adv">
                <span className="pt-tile-mark" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor">
                    <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" />
                    <path d="M8.5 12l2.5 2.5 4.5-5" />
                  </svg>
                </span>
                <div>
                  <p className="pt-tile-name">Key Advantages</p>
                  <p className="pt-tile-sub">Easier, safer and more cost-efficient cable installation</p>
                </div>
                <span className="pt-tile-hint">
                  View details
                  {" "}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              </PtTile>
            </div>
          </div>
        </div>
      </section>
      <PtDialog id="pt-dlg-plb-app" title="Applications" subtitle="PLB HDPE Ducts">
        <p>PLB HDPE Ducts are suitable for a wide range of applications, including:</p>
        <ul className="pt-dialog-list">
          <li>Telecommunication</li>
          <li>Computer Networks</li>
          <li>Automatic Signalling</li>
          <li>Railways Information Network</li>
          <li>Highways</li>
          <li>Cable Service Cabling</li>
          <li>Broadband Networks</li>
          <li>Electric Cable Installations</li>
        </ul>
      </PtDialog>
      <PtDialog id="pt-dlg-plb-adv" title="Key Advantages" subtitle="PLB HDPE Ducts">
        <ul className="pt-dialog-list">
          <li><strong>Reduced Cable Stress:</strong> Helps reduce stress on the cable during installation.</li>
          <li><strong>Longer Installation Lengths:</strong> Makes installation of longer lengths more feasible.</li>
          <li><strong>Safe Handling:</strong> Safe to handle with no toxic and dermatic hazards.</li>
          <li><strong>Fewer Joints:</strong> Reduces the number of joints and minimizes the number of splices.</li>
          <li><strong>Easy Installation:</strong> Enables faster and easier cable installation with lesser manpower.</li>
          <li><strong>Long-Term Performance:</strong> Retains its properties throughout its lifespan.</li>
          <li><strong>Cable Deployment:</strong> Existing cables can be deployed after de-blowing from the duct.</li>
          <li><strong>Easy Cable Movement:</strong> Makes cable movement through bends and deflections easier.</li>
          <li><strong>Cost Efficiency:</strong> Helps reduce the overall cost of installation, maintenance and future upgrades.</li>
        </ul>
      </PtDialog>
      <section className="mdpe-section" id="mdpe">
        <div className="container-fluid">
          <div className="mdpe-wrap">
            <div className="mdpe-left">
              <h2>Medium Density Polyethylene (MDPE) Pipes</h2>
              <p>
                Prayag MDPE Pipes offer a durable, tough, resilient and cost-effective piping solution. The range is an ISO / BIS certified product, made from quality raw materials and highly recommended for potable water supplies.
              </p>
              <div className="mdpe-certs">
                <span className="mdpe-cert">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" />
                    <path d="M8.5 12l2.5 2.5 4.5-5" />
                  </svg>
                  {" "}
                  ISO Certified
                </span>
                {" "}
                <span className="mdpe-cert">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" />
                    <path d="M8.5 12l2.5 2.5 4.5-5" />
                  </svg>
                  {" "}
                  BIS Certified
                </span>
              </div>
            </div>
            <div className="mdpe-right">
              <PtTile target="pt-dlg-mdpe-features">
                <span className="pt-tile-mark" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor">
                    <path d="M12 3c-3 4-6 7-6 11a6 6 0 0 0 12 0c0-4-3-7-6-11z" />
                  </svg>
                </span>
                <div>
                  <p className="pt-tile-name">Features</p>
                  <p className="pt-tile-sub">Drinking water compatible, gas transport and eco-friendly</p>
                </div>
                <span className="pt-tile-hint">
                  View more
                  {" "}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              </PtTile>
              {" "}
              <PtTile target="pt-dlg-mdpe-adv">
                <span className="pt-tile-mark" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor">
                    <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" />
                    <path d="M8.5 12l2.5 2.5 4.5-5" />
                  </svg>
                </span>
                <div>
                  <p className="pt-tile-name">Advantages of MDPE Pipes</p>
                  <p className="pt-tile-sub">Long life, UV resistance, leak-proof jointing and more</p>
                </div>
                <span className="pt-tile-hint">
                  View more
                  {" "}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              </PtTile>
            </div>
          </div>
        </div>
      </section>
      <PtDialog id="pt-dlg-mdpe-features" title="Features" subtitle="Medium Density Polyethylene (MDPE) Pipes">
        <ul className="pt-dialog-list">
          <li>Drinking water compatible</li>
          <li>Can easily transport GAS</li>
          <li>Eco-friendly</li>
        </ul>
      </PtDialog>
      <PtDialog id="pt-dlg-mdpe-adv" title="Advantages of MDPE Pipes" subtitle="Medium Density Polyethylene (MDPE) Pipes">
        <ul className="pt-dialog-list">
          <li><strong>Smooth Inner Wall:</strong> C-Value 150 offers minimum resistance to flow, helping reduce operating cost.</li>
          <li><strong>Longer Life:</strong> Life expectancy of more than 50 years.</li>
          <li><strong>High Impact Strength:</strong> Provides reliable performance under demanding conditions.</li>
          <li><strong>Lightweight:</strong> Helps reduce transportation and installation cost.</li>
          <li><strong>Food Grade Material:</strong> Highly recommended for potable water.</li>
          <li><strong>Bacteria &amp; Algae Resistance:</strong> Resists the growth of bacteria or algae.</li>
          <li><strong>Temperature Resistance:</strong> Suitable for temperatures from -40 to 60°C.</li>
          <li><strong>UV Resistance:</strong> Offers resistance to UV rays.</li>
          <li><strong>Water Hammer / Surge:</strong> Provides excellent water hammer / surge characteristics.</li>
          <li><strong>Versatile Applications:</strong> Preferred material for horizontal drilling, pipe bursting etc.</li>
          <li><strong>Leak-Proof Jointing:</strong> Provides leak-proof joints; butt fusion jointing is recommended.</li>
          <li><strong>Flexible Supply:</strong> Flexible pipe is available in coils up to 110 mm diameter.</li>
        </ul>
      </PtDialog>
    </PcatPage>
  );
}

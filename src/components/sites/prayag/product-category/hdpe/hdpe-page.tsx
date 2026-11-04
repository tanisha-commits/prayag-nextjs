import { PcatPage } from "../pcat-page";
import { SlickCarousel, type SlickSettings } from "../slick-carousel";
import { PtDialog, PtTile } from "./pt-dialog";
import { SplitRevealSection } from "../split-reveal";
import { TabGroup } from "./tab-group";
import "./hdpe.css";

import { fullImg, transcodedSrcSet, transcodedUrl } from "@/lib/image-dimensions";
import { Tx } from "@/components/sites/prayag/cms/tx";

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
              <img src={transcodedUrl("/sites/prayag/files/styles/medium/public/2026-10/main-banner-hdpe.webp")} srcSet={transcodedSrcSet("/sites/prayag/files/styles/thumbnail/public/2026-10/main-banner-hdpe.webp 300w, /sites/prayag/files/styles/thumbnail/public/2026-10/main-banner-hdpe.webp 600w, /sites/prayag/files/styles/large/public/2026-10/main-banner-hdpe.webp 1200w, /sites/prayag/files/styles/wide/public/2026-10/main-banner-hdpe.webp 2000w")} sizes="(max-width: 300px) 300px, (max-width: 600px) 600px, (max-width: 1200px) 1200px, 2000px" alt="HDPE" width="800" height="450" className="img-fluid" decoding="async" fetchPriority="high" />
            </div>
            <div className="col-md-6">
              <div className="breadcrumb_title">
                <h1 className="black_title"><Tx>{"HDPE Pipes"}</Tx></h1>
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
                <h2><Tx>{"Strong Built"}</Tx></h2>
                <p className="prayag-subtitle"><Tx>{"For Reliable Fluid Transportation"}</Tx></p>
                <p>
                  <Tx>{"Prayag HDPE Pipes & Coils are designed for dependable performance across water supply, drainage, sewerage and other demanding piping applications. Manufactured from High Density Polyethylene, these pipes offer excellent resistance to corrosion and chemicals while providing a smooth internal surface for efficient flow."}</Tx>
                </p>
              </div>
            </div>
            <div className="col-12 col-md-6 p-0">
              {/* eslint-disable-next-line @next/next/no-img-element -- source <img> kept 1:1 (intrinsic sizing) */}
              <img {...fullImg("/sites/prayag/theme/HDPE/IMAGE-2.webp")} alt="Prayag HDPE Pipes and Coils" className="prayag-pipe-img" />
            </div>
          </div>
        </div>
      </section>
      <section className="ngp-section" style={{ background: "#1a1a1a", padding: "60px 0" }}>
        <div className="container-fluid">
          <h2 className="text-center" style={{ color: "#fff" }}><Tx>{"Why Choose "}</Tx><strong><Tx>{"Prayag HDPE"}</Tx></strong><Tx>{" Pipes"}</Tx></h2>
          <SlickCarousel className="ngp-features-slider" style={{ color: "#fff" }} settings={NGP_SLICK} aria-label="Why Choose Prayag HDPE Pipes">
            <div className="ngp-feature-item">
              <div className="ngp-icon-circle">
                {/* eslint-disable-next-line @next/next/no-img-element -- source <img> kept 1:1 (intrinsic sizing) */}
                <img {...fullImg("/sites/prayag/theme/HDPE/icon%20webp/Excellent-Chemical-Resistance.webp")} alt="" />
              </div>
              <h3 className="ngp-feature-label"><Tx>{"Excellent Chemical Resistance"}</Tx></h3>
              <p className="ngp_para"><Tx>{"Resists a wide range of chemicals for demanding fluid transportation applications."}</Tx></p>
            </div>
            <div className="ngp-feature-item">
              <div className="ngp-icon-circle">
                {/* eslint-disable-next-line @next/next/no-img-element -- source <img> kept 1:1 (intrinsic sizing) */}
                <img {...fullImg("/sites/prayag/theme/HDPE/icon%20webp/Corrosion-Resistant.webp")} alt="" />
              </div>
              <h3 className="ngp-feature-label"><Tx>{"Corrosion Resistant"}</Tx></h3>
              <p className="ngp_para"><Tx>{"Withstands internal and external corrosion for long-lasting performance."}</Tx></p>
            </div>
            <div className="ngp-feature-item">
              <div className="ngp-icon-circle">
                {/* eslint-disable-next-line @next/next/no-img-element -- source <img> kept 1:1 (intrinsic sizing) */}
                <img {...fullImg("/sites/prayag/theme/HDPE/icon%20webp/Lightweight-Easy-to-Handle.webp")} alt="" />
              </div>
              <h3 className="ngp-feature-label"><Tx>{"Lightweight & Easy to Handle"}</Tx></h3>
              <p className="ngp_para"><Tx>{"Lighter than steel, making transportation, handling and installation easier."}</Tx></p>
            </div>
            <div className="ngp-feature-item">
              <div className="ngp-icon-circle">
                {/* eslint-disable-next-line @next/next/no-img-element -- source <img> kept 1:1 (intrinsic sizing) */}
                <img {...fullImg("/sites/prayag/theme/HDPE/icon%20webp/Faster-Installation.webp")} alt="" />
              </div>
              <h3 className="ngp-feature-label"><Tx>{"Faster Installation"}</Tx></h3>
              <p className="ngp_para"><Tx>{"Welded joints enable faster installation with less excavation and backfilling."}</Tx></p>
            </div>
            <div className="ngp-feature-item">
              <div className="ngp-icon-circle">
                {/* eslint-disable-next-line @next/next/no-img-element -- source <img> kept 1:1 (intrinsic sizing) */}
                <img {...fullImg("/sites/prayag/theme/HDPE/icon%20webp/Smooth-Internal-Bore.webp")} alt="" />
              </div>
              <h3 className="ngp-feature-label"><Tx>{"Smooth Internal Bore"}</Tx></h3>
              <p className="ngp_para"><Tx>{"Provides lower flow resistance and reduced head loss for efficient fluid flow."}</Tx></p>
            </div>
            <div className="ngp-feature-item">
              <div className="ngp-icon-circle">
                {/* eslint-disable-next-line @next/next/no-img-element -- source <img> kept 1:1 (intrinsic sizing) */}
                <img {...fullImg("/sites/prayag/theme/HDPE/icon%20webp/Low-Maintenance.webp")} alt="" />
              </div>
              <h3 className="ngp-feature-label"><Tx>{"Low Maintenance"}</Tx></h3>
              <p className="ngp_para"><Tx>{"Durable and corrosion-resistant construction helps minimize maintenance needs."}</Tx></p>
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
                <img {...fullImg("/sites/prayag/theme/HDPE/IMAGE-3-BANNER-.webp")} className="msf-image" alt="Prayag HDPE pipes for water supply and underground infrastructure" />
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
              <img {...fullImg("/sites/prayag/theme/HDPE/IMAGE-4.webp")} className="psr-image" alt="What are HDPE Pipes" />
            </div>
          </div>
          <div className="psr-content-col">
            <div className="psr-content">
              <h2><Tx>{"What are HDPE Pipes?"}</Tx></h2>
              <p className="psr-description">
                <Tx>{"HDPE stands for High Density Polyethylene, a durable thermoplastic material widely used for piping applications. Prayag HDPE Pipes are manufactured using polyethylene grades including PE-63, PE-80 and PE-100. Prayag HDPE pipes range offers products as per IS 4984:2016, with the range covering multiple nominal outside diameters and pressure classes."}</Tx>
              </p>
              <p className="psr-description">
                <Tx>{"The pipes are designed to combine strength, flexibility, chemical resistance and ease of installation, making them suitable for a wide range of infrastructure and utility applications."}</Tx>
              </p>
              <a href="#hdpe-grades" className="prayag-btn">
                <svg width="22" height="12" viewBox="0 0 22 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21.2308 5.99866C21.2211 5.78469 21.1301 5.53538 20.9771 5.37908L15.9807 0.279282C15.6418 -0.0128267 14.993 -0.133765 14.6154 0.204859C14.2436 0.537901 14.2533 1.18352 14.6251 1.51656L18.1381 5.09813H0.937304C0.420215 5.09813 0 5.50188 0 5.99864C0 6.49542 0.420245 6.89914 0.937304 6.89914H18.1381L14.6251 10.4807C14.3055 10.7877 14.2455 11.4557 14.6154 11.7924C14.9834 12.1292 15.6573 12.0213 15.9807 11.718L20.9771 6.61819C21.1475 6.4433 21.2308 6.23868 21.2308 5.99866Z" fill="black" />
                </svg>
                <Tx>{" "}</Tx>
                <Tx>{"Know More"}</Tx>
              </a>
            </div>
          </div>
        </div>
      </SplitRevealSection>
      <section className="ka-applications pt-0">
        <div className="container-fluid">
          <h2 className="ka-title"><Tx>{"Application"}</Tx></h2>
          <div className="ka-grid">
            <div className="ka-card">
              <div className="ka-image">
                {/* eslint-disable-next-line @next/next/no-img-element -- source <img> kept 1:1 (intrinsic sizing) */}
                <img {...fullImg("/sites/prayag/theme/HDPE/Applications/WATER-SUPPY-Application-.webp")} alt="Water supply" />
              </div>
              <div className="ka-card-body">
                <h3><Tx>{"Water Supply"}</Tx></h3>
                <p><Tx>{"Suitable for durable and reliable water transportation and distribution systems."}</Tx></p>
              </div>
            </div>
            <div className="ka-card">
              <div className="ka-image">
                {/* eslint-disable-next-line @next/next/no-img-element -- source <img> kept 1:1 (intrinsic sizing) */}
                <img {...fullImg("/sites/prayag/theme/HDPE/Applications/Drainage-Sewerage-Application-.webp")} alt="Underground drainage and sewerage" />
              </div>
              <div className="ka-card-body">
                <h3><Tx>{"Underground Drainage & Sewerage"}</Tx></h3>
                <p><Tx>{"Used for drainage and sewerage systems, including undulating terrains."}</Tx></p>
              </div>
            </div>
            <div className="ka-card">
              <div className="ka-image">
                {/* eslint-disable-next-line @next/next/no-img-element -- source <img> kept 1:1 (intrinsic sizing) */}
                <img {...fullImg("/sites/prayag/theme/HDPE/Applications/Effluent-Wastewater-Disposal-Application-.webp")} alt="Effluent and wastewater disposal" />
              </div>
              <div className="ka-card-body">
                <h3><Tx>{"Effluent & Wastewater Disposal"}</Tx></h3>
                <p><Tx>{"Suitable for transporting wastewater and chemically varied effluents."}</Tx></p>
              </div>
            </div>
            <div className="ka-card">
              <div className="ka-image">
                {/* eslint-disable-next-line @next/next/no-img-element -- source <img> kept 1:1 (intrinsic sizing) */}
                <img {...fullImg("/sites/prayag/theme/HDPE/Applications/Gas-Distribution-Application.webp")} alt="Domestic gas distribution" />
              </div>
              <div className="ka-card-body">
                <h3><Tx>{"Domestic Gas Distribution"}</Tx></h3>
                <p><Tx>{"Suitable for underground gas distribution systems."}</Tx></p>
              </div>
            </div>
            <div className="ka-card">
              <div className="ka-image">
                {/* eslint-disable-next-line @next/next/no-img-element -- source <img> kept 1:1 (intrinsic sizing) */}
                <img {...fullImg("/sites/prayag/theme/HDPE/Applications/Submarine-Pipelines-Application-.webp")} alt="Submarine pipelines" />
              </div>
              <div className="ka-card-body">
                <h3><Tx>{"Submarine Pipelines"}</Tx></h3>
                <p><Tx>{"Used for underwater applications, including river crossings and marine outfalls."}</Tx></p>
              </div>
            </div>
            <div className="ka-card">
              <div className="ka-image">
                {/* eslint-disable-next-line @next/next/no-img-element -- source <img> kept 1:1 (intrinsic sizing) */}
                <img {...fullImg("/sites/prayag/theme/HDPE/Applications/Infrastructure-Utility-Networks.webp")} alt="Infrastructure and utility networks" />
              </div>
              <div className="ka-card-body">
                <h3><Tx>{"Infrastructure & Utility Networks"}</Tx></h3>
                <p><Tx>{"Suitable for underground utility networks requiring durability and corrosion resistance."}</Tx></p>
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
                <img {...fullImg("/sites/prayag/theme/HDPE/IMAGE-4.webp")} alt="Prayag HDPE Pipes advantage" className="img-fluid main-img" />
              </div>
            </div>
            <div className="col-lg-6 col-md-12 p-0">
              <div className="prayag_work_content">
                <h2><Tx>{"The Prayag Advantage"}</Tx></h2>
                <ul className="advantages_list">
                  <li>
                    <div>
                      <strong><Tx>{"Excellent Chemical Resistance"}</Tx></strong>
                      <span><Tx>{"Resists a wide range of chemicals for reliable fluid transportation."}</Tx></span>
                    </div>
                  </li>
                  <li>
                    <div>
                      <strong><Tx>{"Superior Corrosion Resistance"}</Tx></strong>
                      <span><Tx>{"Provides lasting protection against internal and external corrosion."}</Tx></span>
                    </div>
                  </li>
                  <li>
                    <div>
                      <strong><Tx>{"Lightweight & Easy to Handle"}</Tx></strong>
                      <span><Tx>{"Makes transportation, handling and installation more convenient."}</Tx></span>
                    </div>
                  </li>
                  <li>
                    <div>
                      <strong><Tx>{"Flexible & Durable"}</Tx></strong>
                      <span><Tx>{"Offers flexibility and strength for varied installation conditions."}</Tx></span>
                    </div>
                  </li>
                  <li>
                    <div>
                      <strong><Tx>{"Efficient Water Flow"}</Tx></strong>
                      <span><Tx>{"Smooth internal surface supports efficient fluid movement."}</Tx></span>
                    </div>
                  </li>
                  <li>
                    <div>
                      <strong><Tx>{"Leak-Resistant Jointing"}</Tx></strong>
                      <span><Tx>{"Click ring supported or welded joints provide strong and secure connections."}</Tx></span>
                    </div>
                  </li>
                  <li>
                    <div>
                      <strong><Tx>{"Faster Installation"}</Tx></strong>
                      <span><Tx>{"Lightweight construction and welded jointing help simplify installation."}</Tx></span>
                    </div>
                  </li>
                  <li>
                    <div>
                      <strong><Tx>{"Low Maintenance"}</Tx></strong>
                      <span><Tx>{"Durable construction helps reduce long-term maintenance requirements."}</Tx></span>
                    </div>
                  </li>
                  <li>
                    <div>
                      <strong><Tx>{"Versatile Applications"}</Tx></strong>
                      <span><Tx>{"Suitable for water supply, drainage, sewerage and utility networks."}</Tx></span>
                    </div>
                  </li>
                  <li>
                    <div>
                      <strong><Tx>{"Long Service Life"}</Tx></strong>
                      <span><Tx>{"Designed for dependable performance over an extended service life."}</Tx></span>
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
            <h2 id="hdpe-grades-heading"><Tx>{"HDPE Pipe Grades"}</Tx></h2>
          </header>
          <div className="tab-content prayag-fitting-specs__content">
            <div className="tab-pane fade show active" id="pane-hdpe-grades" role="tabpanel" tabIndex={0}>
              <SlickCarousel className="cfs-slider js-cfs-slider" settings={GRADES_SLICK} aria-label="HDPE pipe grades">
                <article className="cfs-card">
                  <figure className="cfs-card__figure">
                    {/* eslint-disable-next-line @next/next/no-img-element -- source <img> kept 1:1 (intrinsic sizing) */}
                    <img {...fullImg("/sites/prayag/theme/HDPE/HDPE%20Pipe%20Grades/PE-63.webp")} alt="PE-63 HDPE pipe grade" loading="lazy" width="600" height="400" className="cfs-card__img" />
                  </figure>
                  <div className="cfs-card__body">
                    <h3 className="cfs-card__title"><Tx>{"PE-63"}</Tx></h3>
                    <p className="cfs-card__desc"><Tx>{"Polyethylene grade used in the specified HDPE pipe range."}</Tx></p>
                    <p className="cfs-card__usage-label"><Tx>{"Usage"}</Tx></p>
                    <ul className="cfs-card__usage">
                      <li><Tx>{"Agricultural irrigation and sprinkler systems"}</Tx></li>
                      <li><Tx>{"Drinking water supply in rural and urban areas"}</Tx></li>
                      <li><Tx>{"Industrial wastewater and chemical transportation"}</Tx></li>
                      <li><Tx>{"Protection of underground cables and drainage systems"}</Tx></li>
                    </ul>
                  </div>
                </article>
                <article className="cfs-card">
                  <figure className="cfs-card__figure">
                    {/* eslint-disable-next-line @next/next/no-img-element -- source <img> kept 1:1 (intrinsic sizing) */}
                    <img {...fullImg("/sites/prayag/theme/HDPE/HDPE%20Pipe%20Grades/PE--80.webp")} alt="PE-80 HDPE pipe grade" loading="lazy" width="600" height="400" className="cfs-card__img" />
                  </figure>
                  <div className="cfs-card__body">
                    <h3 className="cfs-card__title"><Tx>{"PE-80"}</Tx></h3>
                    <p className="cfs-card__desc"><Tx>{"Polyethylene grade available for water supply and sewerage applications."}</Tx></p>
                    <p className="cfs-card__usage-label"><Tx>{"Usage"}</Tx></p>
                    <ul className="cfs-card__usage">
                      <li><Tx>{"Drinking water supply systems"}</Tx></li>
                      <li><Tx>{"Agricultural sprinkler and drip irrigation systems"}</Tx></li>
                      <li><Tx>{"Sewage and wastewater pipelines"}</Tx></li>
                      <li><Tx>{"Low-pressure gas distribution systems"}</Tx></li>
                    </ul>
                  </div>
                </article>
                <article className="cfs-card">
                  <figure className="cfs-card__figure">
                    {/* eslint-disable-next-line @next/next/no-img-element -- source <img> kept 1:1 (intrinsic sizing) */}
                    <img {...fullImg("/sites/prayag/theme/HDPE/HDPE%20Pipe%20Grades/PE--100.webp")} alt="PE-100 HDPE pipe grade" loading="lazy" width="600" height="400" className="cfs-card__img" />
                  </figure>
                  <div className="cfs-card__body">
                    <h3 className="cfs-card__title"><Tx>{"PE-100"}</Tx></h3>
                    <p className="cfs-card__desc"><Tx>{"Higher-performance polyethylene grade available across specified pressure classes."}</Tx></p>
                    <p className="cfs-card__usage-label"><Tx>{"Usage"}</Tx></p>
                    <ul className="cfs-card__usage">
                      <li><Tx>{"Municipal drinking water supply and borewell systems"}</Tx></li>
                      <li><Tx>{"Agricultural drip and sprinkler irrigation systems"}</Tx></li>
                      <li><Tx>{"Industrial fluid, chemical, and slurry transportation"}</Tx></li>
                      <li><Tx>{"Sewage, drainage, and underground pipeline installations"}</Tx></li>
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
            <h2 className="prayag-specs__title"><Tx>{"Specification"}</Tx></h2>
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
                          <th><Tx>{"Specification"}</Tx></th>
                          <th><Tx>{"Details"}</Tx></th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td data-label="Specification"><Tx>{"Product"}</Tx></td>
                          <td data-label="Details"><Tx>{"HDPE Pipes"}</Tx></td>
                        </tr>
                        <tr>
                          <td data-label="Specification"><Tx>{"Material"}</Tx></td>
                          <td data-label="Details"><Tx>{"High Density Polyethylene"}</Tx></td>
                        </tr>
                        <tr>
                          <td data-label="Specification"><Tx>{"Grades"}</Tx></td>
                          <td data-label="Details"><Tx>{"PE-63 & PE-80"}</Tx></td>
                        </tr>
                        <tr>
                          <td data-label="Specification"><Tx>{"Nominal Pressure"}</Tx></td>
                          <td data-label="Details"><Tx>{"2.5 to 16"}</Tx></td>
                        </tr>
                        <tr>
                          <td data-label="Specification"><Tx>{"Nominal Diameter"}</Tx></td>
                          <td data-label="Details"><Tx>{"63 mm to 400 mm"}</Tx></td>
                        </tr>
                        <tr>
                          <td data-label="Specification"><Tx>{"Jointing"}</Tx></td>
                          <td data-label="Details"><Tx>{"Welded jointing / click-ring type fittings"}</Tx></td>
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
                          <th><Tx>{"Specification"}</Tx></th>
                          <th><Tx>{"Details"}</Tx></th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td data-label="Specification"><Tx>{"Product"}</Tx></td>
                          <td data-label="Details"><Tx>{"HDPE Pipes"}</Tx></td>
                        </tr>
                        <tr>
                          <td data-label="Specification"><Tx>{"Material"}</Tx></td>
                          <td data-label="Details"><Tx>{"High Density Polyethylene"}</Tx></td>
                        </tr>
                        <tr>
                          <td data-label="Specification"><Tx>{"Grades"}</Tx></td>
                          <td data-label="Details"><Tx>{"PE-100"}</Tx></td>
                        </tr>
                        <tr>
                          <td data-label="Specification"><Tx>{"Nominal Pressure"}</Tx></td>
                          <td data-label="Details"><Tx>{"6 to 16"}</Tx></td>
                        </tr>
                        <tr>
                          <td data-label="Specification"><Tx>{"Nominal Diameter"}</Tx></td>
                          <td data-label="Details"><Tx>{"63 mm to 400 mm"}</Tx></td>
                        </tr>
                        <tr>
                          <td data-label="Specification"><Tx>{"Jointing"}</Tx></td>
                          <td data-label="Details"><Tx>{"Welded jointing / click-ring type fittings"}</Tx></td>
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
            <p className="pt-eyebrow"><Tx>{"PLB HDPE Ducts"}</Tx></p>
            <h2 className="pt-title"><Tx>{"Permanently Lubricated (PLB) HDPE Ducts"}</Tx></h2>
            <p className="pt-lede">
              <Tx>{"Prayag Permanently Lubricated (PLB) HDPE Ducts are manufactured using the Co-extrusion technique and are designed for laying Optic Fiber Cables in underground ducting and conduits. These ducts are available in multiple sizes ranging from 20 mm to 110 mm."}</Tx>
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
                  <p className="pt-tile-name"><Tx>{"Applications"}</Tx></p>
                  <p className="pt-tile-sub"><Tx>{"Telecom, railways, highways, broadband and more"}</Tx></p>
                </div>
                <span className="pt-tile-hint">
                  <Tx>{"View details"}</Tx>
                  <Tx>{" "}</Tx>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              </PtTile>
              <Tx>{" "}</Tx>
              <PtTile target="pt-dlg-plb-adv">
                <span className="pt-tile-mark" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor">
                    <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" />
                    <path d="M8.5 12l2.5 2.5 4.5-5" />
                  </svg>
                </span>
                <div>
                  <p className="pt-tile-name"><Tx>{"Key Advantages"}</Tx></p>
                  <p className="pt-tile-sub"><Tx>{"Easier, safer and more cost-efficient cable installation"}</Tx></p>
                </div>
                <span className="pt-tile-hint">
                  <Tx>{"View details"}</Tx>
                  <Tx>{" "}</Tx>
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
        <p><Tx>{"PLB HDPE Ducts are suitable for a wide range of applications, including:"}</Tx></p>
        <ul className="pt-dialog-list">
          <li><Tx>{"Telecommunication"}</Tx></li>
          <li><Tx>{"Computer Networks"}</Tx></li>
          <li><Tx>{"Automatic Signalling"}</Tx></li>
          <li><Tx>{"Railways Information Network"}</Tx></li>
          <li><Tx>{"Highways"}</Tx></li>
          <li><Tx>{"Cable Service Cabling"}</Tx></li>
          <li><Tx>{"Broadband Networks"}</Tx></li>
          <li><Tx>{"Electric Cable Installations"}</Tx></li>
        </ul>
      </PtDialog>
      <PtDialog id="pt-dlg-plb-adv" title="Key Advantages" subtitle="PLB HDPE Ducts">
        <ul className="pt-dialog-list">
          <li><strong><Tx>{"Reduced Cable Stress:"}</Tx></strong><Tx>{" Helps reduce stress on the cable during installation."}</Tx></li>
          <li><strong><Tx>{"Longer Installation Lengths:"}</Tx></strong><Tx>{" Makes installation of longer lengths more feasible."}</Tx></li>
          <li><strong><Tx>{"Safe Handling:"}</Tx></strong><Tx>{" Safe to handle with no toxic and dermatic hazards."}</Tx></li>
          <li><strong><Tx>{"Fewer Joints:"}</Tx></strong><Tx>{" Reduces the number of joints and minimizes the number of splices."}</Tx></li>
          <li><strong><Tx>{"Easy Installation:"}</Tx></strong><Tx>{" Enables faster and easier cable installation with lesser manpower."}</Tx></li>
          <li><strong><Tx>{"Long-Term Performance:"}</Tx></strong><Tx>{" Retains its properties throughout its lifespan."}</Tx></li>
          <li><strong><Tx>{"Cable Deployment:"}</Tx></strong><Tx>{" Existing cables can be deployed after de-blowing from the duct."}</Tx></li>
          <li><strong><Tx>{"Easy Cable Movement:"}</Tx></strong><Tx>{" Makes cable movement through bends and deflections easier."}</Tx></li>
          <li><strong><Tx>{"Cost Efficiency:"}</Tx></strong><Tx>{" Helps reduce the overall cost of installation, maintenance and future upgrades."}</Tx></li>
        </ul>
      </PtDialog>
      <section className="mdpe-section" id="mdpe">
        <div className="container-fluid">
          <div className="mdpe-wrap">
            <div className="mdpe-left">
              <h2><Tx>{"Medium Density Polyethylene (MDPE) Pipes"}</Tx></h2>
              <p>
                <Tx>{"Prayag MDPE Pipes offer a durable, tough, resilient and cost-effective piping solution. The range is an ISO / BIS certified product, made from quality raw materials and highly recommended for potable water supplies."}</Tx>
              </p>
              <div className="mdpe-certs">
                <span className="mdpe-cert">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" />
                    <path d="M8.5 12l2.5 2.5 4.5-5" />
                  </svg>
                  <Tx>{" "}</Tx>
                  <Tx>{"ISO Certified"}</Tx>
                </span>
                <Tx>{" "}</Tx>
                <span className="mdpe-cert">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" />
                    <path d="M8.5 12l2.5 2.5 4.5-5" />
                  </svg>
                  <Tx>{" "}</Tx>
                  <Tx>{"BIS Certified"}</Tx>
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
                  <p className="pt-tile-name"><Tx>{"Features"}</Tx></p>
                  <p className="pt-tile-sub"><Tx>{"Drinking water compatible, gas transport and eco-friendly"}</Tx></p>
                </div>
                <span className="pt-tile-hint">
                  <Tx>{"View more"}</Tx>
                  <Tx>{" "}</Tx>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              </PtTile>
              <Tx>{" "}</Tx>
              <PtTile target="pt-dlg-mdpe-adv">
                <span className="pt-tile-mark" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor">
                    <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" />
                    <path d="M8.5 12l2.5 2.5 4.5-5" />
                  </svg>
                </span>
                <div>
                  <p className="pt-tile-name"><Tx>{"Advantages of MDPE Pipes"}</Tx></p>
                  <p className="pt-tile-sub"><Tx>{"Long life, UV resistance, leak-proof jointing and more"}</Tx></p>
                </div>
                <span className="pt-tile-hint">
                  <Tx>{"View more"}</Tx>
                  <Tx>{" "}</Tx>
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
          <li><Tx>{"Drinking water compatible"}</Tx></li>
          <li><Tx>{"Can easily transport GAS"}</Tx></li>
          <li><Tx>{"Eco-friendly"}</Tx></li>
        </ul>
      </PtDialog>
      <PtDialog id="pt-dlg-mdpe-adv" title="Advantages of MDPE Pipes" subtitle="Medium Density Polyethylene (MDPE) Pipes">
        <ul className="pt-dialog-list">
          <li><strong><Tx>{"Smooth Inner Wall:"}</Tx></strong><Tx>{" C-Value 150 offers minimum resistance to flow, helping reduce operating cost."}</Tx></li>
          <li><strong><Tx>{"Longer Life:"}</Tx></strong><Tx>{" Life expectancy of more than 50 years."}</Tx></li>
          <li><strong><Tx>{"High Impact Strength:"}</Tx></strong><Tx>{" Provides reliable performance under demanding conditions."}</Tx></li>
          <li><strong><Tx>{"Lightweight:"}</Tx></strong><Tx>{" Helps reduce transportation and installation cost."}</Tx></li>
          <li><strong><Tx>{"Food Grade Material:"}</Tx></strong><Tx>{" Highly recommended for potable water."}</Tx></li>
          <li><strong><Tx>{"Bacteria & Algae Resistance:"}</Tx></strong><Tx>{" Resists the growth of bacteria or algae."}</Tx></li>
          <li><strong><Tx>{"Temperature Resistance:"}</Tx></strong><Tx>{" Suitable for temperatures from -40 to 60°C."}</Tx></li>
          <li><strong><Tx>{"UV Resistance:"}</Tx></strong><Tx>{" Offers resistance to UV rays."}</Tx></li>
          <li><strong><Tx>{"Water Hammer / Surge:"}</Tx></strong><Tx>{" Provides excellent water hammer / surge characteristics."}</Tx></li>
          <li><strong><Tx>{"Versatile Applications:"}</Tx></strong><Tx>{" Preferred material for horizontal drilling, pipe bursting etc."}</Tx></li>
          <li><strong><Tx>{"Leak-Proof Jointing:"}</Tx></strong><Tx>{" Provides leak-proof joints; butt fusion jointing is recommended."}</Tx></li>
          <li><strong><Tx>{"Flexible Supply:"}</Tx></strong><Tx>{" Flexible pipe is available in coils up to 110 mm diameter."}</Tx></li>
        </ul>
      </PtDialog>
    </PcatPage>
  );
}

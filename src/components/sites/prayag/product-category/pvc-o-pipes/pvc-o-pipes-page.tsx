import { PcatPage } from "../pcat-page";
import { SlickCarousel, type SlickSettings } from "../slick-carousel";
import { SplitRevealSection } from "../split-reveal";
import { BsModal, BsModalTrigger } from "./bs-modal";
import "./pvc-o-pipes.css";

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

const FITTINGS_SLICK: SlickSettings = {
  infinite: true,
  swipe: true,
  adaptiveHeight: true,
  arrows: true,
  dots: false,
  slidesToShow: 3,
  slidesToScroll: 1,
  responsive: [
    { breakpoint: 992, settings: { slidesToShow: 2, slidesToScroll: 1 } },
    { breakpoint: 768, settings: { slidesToShow: 1, slidesToScroll: 1 } },
  ],
};

/** https://prayagindia.com/pvc-o-pipes (taxonomy term 218), content between the header and the footer. */
export function PvcOPipesPage() {
  return (
    <PcatPage slug="pvc-o-pipes">
      <div className="breadcrumb_main">
        <div className="container-fluid p-0">
          <div className="row">
            <div className="col-md-6">
              {/* eslint-disable-next-line @next/next/no-img-element -- source <img> kept 1:1 (intrinsic sizing) */}
              <img src="/sites/prayag/files/2026-09/cpvcO.webp" sizes="(max-width: 300px) 300px, (max-width: 600px) 600px, (max-width: 1200px) 1200px, 2000px" alt="PVC-O Pipes" width="800" height="450" className="img-fluid" decoding="async" fetchPriority="high" />
            </div>
            <div className="col-md-6">
              <div className="breadcrumb_title">
                <h1 className="black_title">PVC-O Pipes</h1>
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
                <h2>What are Prayag PVC-O Pipes?</h2>
                <p className="prayag-subtitle">Stronger Pipes. Faster Flow. Longer Life.</p>
                <p>
                  Prayag PVC-O Pipes are premium pressure pipes manufactured through an advanced Molecular Orientation Process, where PVC molecules are aligned under controlled pressure and temperature. This unique process significantly enhances the mechanical properties of the pipe, resulting in higher tensile strength, greater impact resistance, superior flexibility, and improved hydraulic performance.
                </p>
                <p>
                  Compared to conventional uPVC pipes, Prayag PVC-O Pipes offer thinner yet stronger walls, providing a larger internal flow area for higher water discharge without increasing pipe diameter. Their exceptional durability, crack resistance, and corrosion-free performance make them an ideal solution for long-term water infrastructure projects.
                </p>
                <a href="#pvco-advantage-details" className="prayag-btn">
                  <svg width="22" height="12" viewBox="0 0 22 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21.2308 5.99866C21.2211 5.78469 21.1301 5.53538 20.9771 5.37908L15.9807 0.279282C15.6418 -0.0128267 14.993 -0.133765 14.6154 0.204859C14.2436 0.537901 14.2533 1.18352 14.6251 1.51656L18.1381 5.09813H0.937304C0.420215 5.09813 0 5.50188 0 5.99864C0 6.49542 0.420245 6.89914 0.937304 6.89914H18.1381L14.6251 10.4807C14.3055 10.7877 14.2455 11.4557 14.6154 11.7924C14.9834 12.1292 15.6573 12.0213 15.9807 11.718L20.9771 6.61819C21.1475 6.4433 21.2308 6.23868 21.2308 5.99866Z" fill="black" />
                  </svg>
                  {" "}
                  Know More
                </a>
              </div>
            </div>
            <div className="col-12 col-md-6 p-0">
              {/* eslint-disable-next-line @next/next/no-img-element -- source <img> kept 1:1 (intrinsic sizing) */}
              <img src="/sites/prayag/theme/opvc/what--section.png" alt="Prayag PVC-O Pipe" className="prayag-pipe-img" />
            </div>
          </div>
        </div>
      </section>
      <section className="ngp-section" style={{ background: "#1a1a1a", padding: "60px 0" }}>
        <div className="container-fluid">
          <h2 className="text-center" style={{ color: "#fff" }}>Why Choose <strong>Prayag PVC-O</strong> Pipes?</h2>
          <SlickCarousel className="ngp-features-slider" style={{ color: "#fff" }} settings={NGP_SLICK} aria-label="Why Choose Prayag PVC-O Pipes?">
            <div className="ngp-feature-item">
              <div className="ngp-icon-circle">
                <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 400 400" role="img">
                  <title>Molecular Orientation Technology</title>
                  <desc>Molecules aligned into ordered parallel chains.</desc>
                  <rect width="400" height="400" fill="#1a1a1a" />
                  <g fill="none" stroke="#FFF" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M108 126h184M108 200h184M108 274h184" />
                    <circle cx="108" cy="126" r="15" />
                    <circle cx="200" cy="126" r="15" />
                    <circle cx="292" cy="126" r="15" />
                    <circle cx="108" cy="200" r="15" />
                    <circle cx="200" cy="200" r="15" />
                    <circle cx="292" cy="200" r="15" />
                    <circle cx="108" cy="274" r="15" />
                    <circle cx="200" cy="274" r="15" />
                    <circle cx="292" cy="274" r="15" />
                  </g>
                </svg>
              </div>
              <span className="ngp-feature-label">Molecular Orientation Technology</span>
              <p className="ngp_para">Superior mechanical strength and durability.</p>
            </div>
            <div className="ngp-feature-item">
              <div className="ngp-icon-circle">
                <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 400 400" role="img">
                  <title>Higher Hydraulic Capacity</title>
                  <desc>A strong upward water-flow symbol.</desc>
                  <rect width="400" height="400" fill="#1a1a1a" />
                  <g fill="none" stroke="#FFF" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M200 75c-47 62-92 113-92 170a92 92 0 0 0 184 0c0-57-45-108-92-170Z" />
                    <path d="M200 277V157M166 191l34-34 34 34" />
                  </g>
                </svg>
              </div>
              <span className="ngp-feature-label">Higher Hydraulic Capacity</span>
              <p className="ngp_para">Delivers 15–40% more water flow.</p>
            </div>
            <div className="ngp-feature-item">
              <div className="ngp-icon-circle">
                <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 400 400" role="img">
                  <title>Large Internal Diameter</title>
                  <desc>Four arrows expanding an internal opening.</desc>
                  <rect width="400" height="400" fill="#1a1a1a" />
                  <g fill="none" stroke="#FFF" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="200" cy="200" r="77" />
                    <path d="M200 123V67M183 84l17-17 17 17M200 277v56M183 316l17 17 17-17M123 200H67M84 183l-17 17 17 17M277 200h56M316 183l17 17-17 17" />
                  </g>
                </svg>
              </div>
              <span className="ngp-feature-label">Large Internal Diameter</span>
              <p className="ngp_para">Reduced pressure loss and better efficiency.</p>
            </div>
            <div className="ngp-feature-item">
              <div className="ngp-icon-circle">
                <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 400 400" role="img">
                  <title>Water Hammer Resistance</title>
                  <desc>A pressure gauge absorbing a pulse.</desc>
                  <rect width="400" height="400" fill="#1a1a1a" />
                  <g fill="none" stroke="#FFF" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M107 240a93 93 0 0 1 186 0M200 240l43-55" />
                    <circle cx="200" cy="240" r="10" />
                    <path d="M91 281h47l22-36 35 74 31-60 22 22h61M122 208l-18-8M151 167l-11-16M200 151v-22M249 167l11-16M278 208l18-8" />
                  </g>
                </svg>
              </div>
              <span className="ngp-feature-label">Water Hammer Resistance</span>
              <p className="ngp_para">Reliable performance under pressure fluctuations.</p>
            </div>
            <div className="ngp-feature-item">
              <div className="ngp-icon-circle">
                <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 400 400" role="img">
                  <title>Lightweight Construction</title>
                  <desc>A lightweight pipe lifting upward.</desc>
                  <rect width="400" height="400" fill="#1a1a1a" />
                  <g fill="none" stroke="#FFF" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M108 145h184v82H108z" />
                    <ellipse cx="108" cy="186" rx="25" ry="41" />
                    <ellipse cx="292" cy="186" rx="25" ry="41" />
                    <path d="M151 306v-61M132 264l19-19 19 19" />
                    <path d="M249 306v-61M230 264l19-19 19 19" />
                  </g>
                </svg>
              </div>
              <span className="ngp-feature-label">Lightweight Construction</span>
              <p className="ngp_para">Easier transportation and handling.</p>
            </div>
            <div className="ngp-feature-item">
              <div className="ngp-icon-circle">
                <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 400 400" role="img">
                  <title>Flexible Structure</title>
                  <desc>A pipe adapting smoothly between two fixed joints.</desc>
                  <rect width="400" height="400" fill="#1a1a1a" />
                  <g fill="none" stroke="#FFF" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="87" cy="200" r="28" />
                    <circle cx="313" cy="200" r="28" />
                    <path d="M115 188c55-82 115 82 170 0M115 212c55-82 115 82 170 0M156 117c30-24 59-24 88 0M229 94l15 23-25 10" />
                  </g>
                </svg>
              </div>
              <span className="ngp-feature-label">Flexible Structure</span>
              <p className="ngp_para">Allows slight deflection, reducing fitting requirements.</p>
            </div>
            <div className="ngp-feature-item">
              <div className="ngp-icon-circle">
                <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 400 400" role="img">
                  <title>Lead-Free Material</title>
                  <desc>A clean water droplet with a safety check.</desc>
                  <rect width="400" height="400" fill="#1a1a1a" />
                  <g fill="none" stroke="#FFF" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M200 69c-51 68-93 118-93 174a93 93 0 0 0 186 0c0-56-42-106-93-174Z" />
                    <path d="m155 241 31 31 65-73" />
                  </g>
                </svg>
              </div>
              <span className="ngp-feature-label">Lead-Free Material</span>
              <p className="ngp_para">Safe for potable water applications.</p>
            </div>
            <div className="ngp-feature-item">
              <div className="ngp-icon-circle">
                <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 400 400" role="img">
                  <title>High Impact Resistance</title>
                  <desc>A test weight bouncing from an intact pipe.</desc>
                  <rect width="400" height="400" fill="#1a1a1a" />
                  <g fill="none" stroke="#FFF" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M151 92h98v72h-98zM200 164v58M87 268h226v64H87z" />
                    <ellipse cx="87" cy="300" rx="21" ry="32" />
                    <ellipse cx="313" cy="300" rx="21" ry="32" />
                    <path d="M168 225l-20 20M232 225l20 20M200 217v29" />
                  </g>
                </svg>
              </div>
              <span className="ngp-feature-label">High Impact Resistance</span>
              <p className="ngp_para">Prevents cracks during transportation and installation.</p>
            </div>
          </SlickCarousel>
        </div>
      </section>
      <section className="main_filled_scrolled_sec">
        <div className="msf-track">
          <div className="msf-stage">
            <div className="msf-slide-wrap">
              <div className="msf-image-wrap">
                <picture>
                  <source media="(max-width: 767px)" srcSet="/sites/prayag/theme/opvc/mobile-OPVC.webp" type="image/webp" />
                  <source media="(min-width: 768px)" srcSet="/sites/prayag/theme/opvc/big_banner.png" />
                  <img className="msf-image" src="/sites/prayag/theme/opvc/big_banner.png" alt="Prayag PVC-O Pipes — Stronger Pipes, Faster Flow, Longer Life. Engineered Beyond Conventional Piping." width="1920" height="600" loading="lazy" decoding="async" />
                </picture>
              </div>
            </div>
          </div>
        </div>
      </section>
      <SplitRevealSection id="pvco-advantage-details">
        <div className="psr-container">
          <div className="psr-image-col">
            <div className="psr-image-wrap">
              {/* eslint-disable-next-line @next/next/no-img-element -- source <img> kept 1:1 (intrinsic sizing) */}
              <img className="psr-image" src="/sites/prayag/theme/opvc/Advanced-Plumbing-Solutions.png" alt="Prayag PVC-O Pipes for Modern Infrastructure" />
            </div>
          </div>
          <div className="psr-content-col">
            <div className="psr-content">
              <span className="psr-eyebrow">High-Pressure Water Distribution Systems Built for the Future</span>
              <h2>Advanced Plumbing Solutions for Modern Infrastructure</h2>
              <p className="psr-description">
                Prayag PVC-O (Oriented Polyvinyl Chloride) Pipes are engineered using advanced Molecular Orientation Technology to deliver exceptional strength, durability, and hydraulic efficiency. Designed for high-pressure water transportation, these pipes combine lightweight construction with superior impact resistance, making them an ideal choice for irrigation, drinking water supply, fire hydrant networks, and industrial applications.
              </p>
              <p className="psr-description">
                Manufactured in modern ISO-certified facilities and conforming to IS 16647:2017, Prayag PVC-O Pipes provide reliable performance, longer service life, and lower installation costs for demanding infrastructure projects.
              </p>
              <a href="#prayag-advantage-heading" className="prayag-btn">
                <svg width="22" height="12" viewBox="0 0 22 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21.2308 5.99866C21.2211 5.78469 21.1301 5.53538 20.9771 5.37908L15.9807 0.279282C15.6418 -0.0128267 14.993 -0.133765 14.6154 0.204859C14.2436 0.537901 14.2533 1.18352 14.6251 1.51656L18.1381 5.09813H0.937304C0.420215 5.09813 0 5.50188 0 5.99864C0 6.49542 0.420245 6.89914 0.937304 6.89914H18.1381L14.6251 10.4807C14.3055 10.7877 14.2455 11.4557 14.6154 11.7924C14.9834 12.1292 15.6573 12.0213 15.9807 11.718L20.9771 6.61819C21.1475 6.4433 21.2308 6.23868 21.2308 5.99866Z" fill="black" />
                </svg>
                {" "}
                Explore the Prayag Advantage
              </a>
            </div>
          </div>
        </div>
      </SplitRevealSection>
      <section className="ka-applications pt-0">
        <div className="container-fluid">
          <p className="ka-eyebrow">Where our pipes work</p>
          <h2 className="ka-title">Application</h2>
          <p className="ka-intro">Prayag PVC-O Pipes are built for demanding water infrastructure across these key applications.</p>
          <div className="ka-grid ka-grid--single-row">
            <div className="ka-card">
              <div className="ka-image">
                {/* eslint-disable-next-line @next/next/no-img-element -- source <img> kept 1:1 (intrinsic sizing) */}
                <img src="/sites/prayag/theme/opvc/applications/application-reference-drinking-water-500x500.png" alt="Municipal and Drinking Water Supply" />
              </div>
              <div className="ka-card-body">
                <h3>Municipal &amp; Drinking Water Supply</h3>
              </div>
            </div>
            <div className="ka-card">
              <div className="ka-image">
                {/* eslint-disable-next-line @next/next/no-img-element -- source <img> kept 1:1 (intrinsic sizing) */}
                <img src="/sites/prayag/theme/opvc/applications/application-reference-irrigation-500x500.png" alt="Agricultural Irrigation" />
              </div>
              <div className="ka-card-body">
                <h3>Agricultural Irrigation</h3>
              </div>
            </div>
            <div className="ka-card">
              <div className="ka-image">
                {/* eslint-disable-next-line @next/next/no-img-element -- source <img> kept 1:1 (intrinsic sizing) */}
                <img src="/sites/prayag/theme/opvc/applications/application-fire-network-all-red-500x500.png" alt="Fire Hydrant Networks" />
              </div>
              <div className="ka-card-body">
                <h3>Fire Hydrant Networks</h3>
              </div>
            </div>
            <div className="ka-card">
              <div className="ka-image">
                {/* eslint-disable-next-line @next/next/no-img-element -- source <img> kept 1:1 (intrinsic sizing) */}
                <img src="/sites/prayag/theme/opvc/applications/application-reference-building-supply-500x500.png" alt="Reservoir and Tank Water Transfer" />
              </div>
              <div className="ka-card-body">
                <h3>Reservoir &amp; Tank Water Transfer</h3>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="prayag-work-section">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-lg-6 col-md-12">
              <div className="visual-wrapper">
                {/* eslint-disable-next-line @next/next/no-img-element -- source <img> kept 1:1 (intrinsic sizing) */}
                <img src="/sites/prayag/theme/opvc/advantgae.webp" alt="Prayag PVC-O Pipe engineering advantage" className="img-fluid main-img" />
              </div>
            </div>
            <div className="col-lg-6 col-md-12">
              <div className="prayag_work_content">
                <h2 id="prayag-advantage-heading">Advantage</h2>
                <p>
                  Prayag PVC-O Pipes are engineered to deliver superior performance, long-term reliability, and maximum value for modern water infrastructure. Manufactured using advanced Molecular Orientation Technology, these pipes offer exceptional tensile strength, impact resistance, and hydraulic efficiency while remaining lightweight and easy to install. Their thinner yet stronger walls provide a larger internal flow area, enabling up to 40% higher water carrying capacity with lower pressure loss compared to conventional piping systems.
                </p>
                <BsModalTrigger target="prayagReadMoreModal" className="btn prayag-read-more-btn">
                  Read More
                </BsModalTrigger>
              </div>
            </div>
          </div>
        </div>
      </section>
      <BsModal id="prayagReadMoreModal" title="The Prayag Advantage">
        <p>
          Designed in compliance with IS 16647:2017, Prayag PVC-O Pipes are suitable for high-pressure water supply, irrigation, industrial applications, and fire hydrant networks. Their outstanding resistance to water hammer, crack propagation, corrosion, and biofilm formation ensures uninterrupted performance even in demanding operating conditions. The flexible socketed joint system allows faster installation, minimizes leakage, and reduces overall project costs.
        </p>
        <p>
          Manufactured from lead-free, MRS500 class material, Prayag PVC-O Pipes are safe for potable water applications while delivering a service life exceeding 100 years. Backed by Prayag&apos;s decades of manufacturing excellence, strict quality control, and state-of-the-art production facilities, every pipe is built to meet the highest standards of durability and performance.
        </p>
        <p>
          With innovative engineering, proven quality, and dependable performance, Prayag PVC-O Pipes provide the perfect combination of strength, efficiency, and sustainability for today&apos;s water distribution networks.
        </p>
      </BsModal>
      <section className="prayag-fitting-specs" aria-labelledby="pvco-fitting-ecosystem-heading">
        <div className="container-fluid">
          <header className="prayag-fitting-specs__header">
            <h2 id="pvco-fitting-ecosystem-heading">PVC-O Fittings for Every Connection</h2>
            <p>Carousels showing all fittings with image of product and available sizes from reference table.</p>
          </header>
          <div className="tab-content prayag-fitting-specs__content" id="prayagPvcoFittingsContent">
            <div className="tab-pane fade show active" id="pane-pvco" role="tabpanel" aria-labelledby="pvco-fitting-ecosystem-heading" tabIndex={0}>
              <SlickCarousel className="cfs-slider js-cfs-slider" settings={FITTINGS_SLICK} aria-label="PVC-O Fittings product range">
                <article className="cfs-card">
                  <figure className="cfs-card__figure">
                    {/* eslint-disable-next-line @next/next/no-img-element -- source <img> kept 1:1 (intrinsic sizing) */}
                    <img src="/sites/prayag/theme/opvc/OPVC_fittings/1.webp" alt="PVC-O Coupler 110 mm" loading="lazy" width="600" height="400" className="cfs-card__img" />
                  </figure>
                  <div className="cfs-card__body">
                    <h3 className="cfs-card__title">Coupler</h3>
                    <ul className="cfs-card__meta">
                      <li><strong>Range :</strong> 110mm to 110mm</li>
                    </ul>
                  </div>
                </article>
                <article className="cfs-card">
                  <figure className="cfs-card__figure">
                    {/* eslint-disable-next-line @next/next/no-img-element -- source <img> kept 1:1 (intrinsic sizing) */}
                    <img src="/sites/prayag/theme/opvc/OPVC_fittings/2.webp" alt="PVC-O Single Tee 110 mm" loading="lazy" width="600" height="400" className="cfs-card__img" />
                  </figure>
                  <div className="cfs-card__body">
                    <h3 className="cfs-card__title">Single Tee</h3>
                    <ul className="cfs-card__meta">
                      <li><strong>Range :</strong> 110mm to 250mm</li>
                    </ul>
                  </div>
                </article>
                <article className="cfs-card">
                  <figure className="cfs-card__figure">
                    {/* eslint-disable-next-line @next/next/no-img-element -- source <img> kept 1:1 (intrinsic sizing) */}
                    <img src="/sites/prayag/theme/opvc/OPVC_fittings/3.webp" alt="PVC-O 90 Degree Elbow 110 mm" loading="lazy" width="600" height="400" className="cfs-card__img" />
                  </figure>
                  <div className="cfs-card__body">
                    <h3 className="cfs-card__title">90° Elbow</h3>
                    <ul className="cfs-card__meta">
                      <li><strong>Range :</strong> 110mm to 250mm</li>
                    </ul>
                  </div>
                </article>
                <article className="cfs-card">
                  <figure className="cfs-card__figure">
                    {/* eslint-disable-next-line @next/next/no-img-element -- source <img> kept 1:1 (intrinsic sizing) */}
                    <img src="/sites/prayag/theme/opvc/OPVC_fittings/4.webp" alt="PVC-O 45 Degree Elbow 110 mm" loading="lazy" width="600" height="400" className="cfs-card__img" />
                  </figure>
                  <div className="cfs-card__body">
                    <h3 className="cfs-card__title">45° Elbow</h3>
                    <ul className="cfs-card__meta">
                      <li><strong>Range :</strong> 110mm to 250mm</li>
                    </ul>
                  </div>
                </article>
              </SlickCarousel>
            </div>
          </div>
        </div>
      </section>
      <section className="prayag-specs pt-0">
        <div className="container-fluid">
          <div className="prayag-specs__header" style={{ flexDirection: "column" }}>
            <h2>Specification</h2>
          </div>
          <div className="tab-content prayag-specs__content" id="prayagSpecsTabsContent">
            <div className="tab-pane fade show active" id="pane-pipes" role="tabpanel">
              <div className="prayag-specs__table-wrap">
                <table className="prayag-specs__table">
                  <thead>
                    <tr>
                      <th>Parameter</th>
                      <th>Specification</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td data-label="Parameter">Product</td>
                      <td data-label="Specification">Prayag PVC-O Pipes</td>
                    </tr>
                    <tr>
                      <td data-label="Parameter">Standard</td>
                      <td data-label="Specification">IS 16647:2017</td>
                    </tr>
                    <tr>
                      <td data-label="Parameter">Material</td>
                      <td data-label="Specification">Oriented Polyvinyl Chloride (PVC-O)</td>
                    </tr>
                    <tr>
                      <td data-label="Parameter">Material Class</td>
                      <td data-label="Specification">MRS500</td>
                    </tr>
                    <tr>
                      <td data-label="Parameter">Pressure Ratings</td>
                      <td data-label="Specification">PN 12.5, PN 16, PN 20, PN 25</td>
                    </tr>
                    <tr>
                      <td data-label="Parameter">Diameter Range</td>
                      <td data-label="Specification">90 mm – 400 mm</td>
                    </tr>
                    <tr>
                      <td data-label="Parameter">Length</td>
                      <td data-label="Specification">6 m – 12 m</td>
                    </tr>
                    <tr>
                      <td data-label="Parameter">Joint Type</td>
                      <td data-label="Specification">Socketed (Available without socket on request)</td>
                    </tr>
                    <tr>
                      <td data-label="Parameter">Pipe Compatibility</td>
                      <td data-label="Specification">Plastic &amp; Ductile Iron Systems</td>
                    </tr>
                    <tr>
                      <td data-label="Parameter">Service Life</td>
                      <td data-label="Specification">More than 100 Years</td>
                    </tr>
                    <tr>
                      <td data-label="Parameter">Installation</td>
                      <td data-label="Specification">Lightweight, Fast Socket Joint</td>
                    </tr>
                    <tr>
                      <td data-label="Parameter">Application</td>
                      <td data-label="Specification">Pressurized Water Distribution</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PcatPage>
  );
}

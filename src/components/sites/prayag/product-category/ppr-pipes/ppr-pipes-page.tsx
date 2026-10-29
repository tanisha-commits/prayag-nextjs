import type { ReactNode } from "react";
import type { SlickSettings } from "../slick-carousel";
import { PcatPage } from "../pcat-page";
import { faqs, features, fittingPanes, specPanes } from "./data";
import { FaqSection, FittingSlider, NgpSection, SpecTable, THEME_NGP_SLICK, featureItems } from "./pcat-sections";
import { PcatTabs } from "./pcat-tabs";
import { SplitReveal } from "./split-reveal";
import "./ppr-pipes.css";

const IMG = "/sites/prayag/theme/ppr-pipes";

// SLICK_OPTS of the page's inline script (fittings sliders).
const CFS_SLICK: SlickSettings = {
  slidesToShow: 3,
  slidesToScroll: 1,
  infinite: true,
  arrows: true,
  dots: false,
  responsive: [
    { breakpoint: 1200, settings: { slidesToShow: 2, slidesToScroll: 1 } },
    { breakpoint: 768, settings: { slidesToShow: 1, slidesToScroll: 1, dots: true, arrows: false } },
  ],
};

// Application list with the source's outline icons (decorative).
const applicationAreas: { title: string; text: string; icon: ReactNode }[] = [
  {
    title: "Residential & Commercial:",
    text: " Hot and cold water supply systems and high-rise residential riser networks.",
    icon: (
      <>
        <rect x="20" y="20" width="24" height="20" rx="2" />
        <line x1="32" y1="10" x2="32" y2="20" />
        <rect x="10" y="40" width="44" height="10" rx="2" />
      </>
    ),
  },
  {
    title: "Industrial:",
    text: " Industrial piping networks and chemical transportation lines.",
    icon: <polygon points="10,40 20,20 40,12 54,28 46,50 18,50" />,
  },
  {
    title: "Technical Systems:",
    text: " HVAC (Heating, Ventilation and Air Conditioning) installations and compressed air systems.",
    icon: (
      <>
        <rect x="6" y="30" width="12" height="28" />
        <rect x="22" y="38" width="12" height="20" />
        <rect x="38" y="18" width="20" height="40" />
        <line x1="38" y1="18" x2="58" y2="30" />
      </>
    ),
  },
  {
    title: "Healthcare:",
    text: " Oxygen supply infrastructure in hospitals and clinics.",
    icon: (
      <>
        <path d="M10 30L32 12L54 30" />
        <rect x="16" y="30" width="32" height="22" />
      </>
    ),
  },
];

/** https://prayagindia.com/ppr-pipes (Drupal taxonomy term page). */
export function PprPipesPage() {
  return (
    <PcatPage slug="ppr-pipes">
      <div className="breadcrumb_main">
        <div className="container-fluid p-0">
          <div className="row">
            <div className="col-md-6">
              {/* eslint-disable-next-line @next/next/no-img-element -- source responsive banner (Drupal image styles) */}
              <img
                src="/sites/prayag/files/styles/medium/public/2026-08/PPR-main-banner.webp"
                srcSet="/sites/prayag/files/styles/thumbnail/public/2026-08/PPR-main-banner.webp 300w, /sites/prayag/files/styles/thumbnail/public/2026-08/PPR-main-banner.webp 600w, /sites/prayag/files/styles/large/public/2026-08/PPR-main-banner.webp 1200w, /sites/prayag/files/styles/wide/public/2026-08/PPR-main-banner.webp 2000w"
                sizes="(max-width: 300px) 300px, (max-width: 600px) 600px, (max-width: 1200px) 1200px, 2000px"
                alt="PPR Pipes"
                width={800}
                height={450}
                className="img-fluid"
                decoding="async"
              />
            </div>
            <div className="col-md-6">
              <div className="breadcrumb_title">
                <h1 className="black_title">PPR Pipes</h1>
                <p>Durability • Efficiency • Reliability</p>
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
                <h2>Unmatched Performance for Reliable Plumbing</h2>
                <p className="prayag-subtitle">The Future of Smart Plumbing Infrastructure</p>
                <p>
                  Prayag PPR Pipes are engineered to deliver exceptional strength, thermal stability, and long-term
                  reliability. Manufactured using advanced Polypropylene Random Copolymer technology, they offer
                  superior resistance to heat, pressure, and corrosion, ensuring a service life of up to 50 years.
                  Lightweight, leak-proof, and easy to install, Prayag PPR systems are ideal for hot and cold water
                  supply, industrial applications, and HVAC networks. Backed by decades of manufacturing excellence,
                  they provide a dependable solution for efficient and safe fluid transportation.
                </p>
              </div>
            </div>
            <div className="col-12 col-md-6 p-0">
              {/* eslint-disable-next-line @next/next/no-img-element -- source image, intrinsic size kept */}
              <img src="/sites/prayag/theme/unmatched-new-image.webp" alt="Prayag Pipe" className="prayag-pipe-img" />
            </div>
          </div>
        </div>
      </section>

      <NgpSection
        heading={
          <>
            Why Choose <strong>Prayag PPR</strong> Pipes?
          </>
        }
        label="Why choose Prayag PPR pipes"
        settings={THEME_NGP_SLICK}
      >
        {featureItems(features, "h3")}
      </NgpSection>

      <section className="main_filled_scrolled_sec">
        <div className="msf-track">
          <div className="msf-stage">
            <div className="msf-slide-wrap">
              <div className="msf-image-wrap">
                {/* eslint-disable-next-line @next/next/no-img-element -- source banner (media/1533), intrinsic size kept */}
                <img className="msf-image" src="/sites/prayag/files/2026-08/3-iMAGE-.webp" alt="UPVC Column Pipes" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <SplitReveal
        image={
          // eslint-disable-next-line @next/next/no-img-element -- source image, intrinsic size kept
          <img className="psr-image" src={`${IMG}/image-4.webp`} alt="Premium Bathroom Basin" />
        }
        content={
          <>
            <h2>What are PPR Pipes?</h2>
            <p className="psr-description">
              PPR stands for Polypropylene Random Copolymer, a material engineered for precision and high performance
              in plumbing and industrial applications. These pipes are &quot;built for performance,&quot; offering high
              pressure strength and long-life durability. They provide a winning combination of high temperature
              resistance, corrosion resistance, and a lightweight design.
            </p>
            <h3>Specialized Temperature Categories</h3>
            <p className="psr-description">
              Prayag produces specialized triple-layer pipes that are color-coded to indicate their specific
              low-temperature tolerances:
            </p>
            <ul className="what_common_li">
              <li>
                <strong>Bluetech:</strong> These are anti-freezing pipes designed to work in temperatures as low as
                -35°C.
              </li>
              <li>
                <strong>Puretech:</strong> Suitable for environments reaching -15°C.
              </li>
              <li>
                <strong>Toughtech:</strong> Engineered for functionality in temperatures down to -10°C.
              </li>
            </ul>
            <p className="psr-description">
              These pipes are available in various pressure ratings, including PN-10, PN-16, and PN-20, to handle
              different operational demands. To ensure a leak-proof connection, they are joined using socket fusion
              welding with a specialized tool kit. This process involves heating the pipe and fitting it to a working
              temperature (typically 0-300°C) to create a permanent, strong, and reliable joint.
            </p>
          </>
        }
      />

      <section className="application_inter_main_sec pt-0">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12 col-lg-5">
              <div className="application_iner_content">
                <h2>Prayag PPR pipes are versatile and used extensively in the following areas:</h2>
                <ul className="feature-list">
                  {applicationAreas.map((area) => (
                    <li key={area.title}>
                      <span className="icon">
                        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" aria-hidden="true" focusable="false">
                          {area.icon}
                        </svg>
                      </span>
                      <p>
                        <span className="featured_span_color">{area.title}</span>
                        {area.text}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="col-12 col-lg-7">
              <div className="application_image">
                {/* eslint-disable-next-line @next/next/no-img-element -- source image (empty alt on the source), intrinsic size kept */}
                <img src={`${IMG}/image-5.webp`} alt="" />
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
                {/* eslint-disable-next-line @next/next/no-img-element -- source image, intrinsic size kept */}
                <img
                  src={`${IMG}/prayag-advantage-new.webp`}
                  alt="Prayag Composite Pipe engineering advantage"
                  className="img-fluid main-img"
                />
              </div>
            </div>
            <div className="col-lg-6 col-md-12">
              <div className="prayag_work_content">
                <h2>The Prayag Advantage</h2>
                <ul className="advantages_list">
                  <li>
                    <strong>High Strength &amp; Durability:</strong> Engineered for long service life with excellent
                    pressure handling and structural reliability.
                  </li>
                  <li>
                    <strong>Temperature-Specific Range:</strong> Triple-layer system designed for extreme conditions:
                    <ul>
                      <li>
                        <strong>Bluetech:</strong> Works up to -35°C.
                      </li>
                      <li>
                        <strong>Puretech:</strong> Suitable up to -15°C.
                      </li>
                      <li>
                        <strong>Toughtech:</strong> Suitable up to -10°C.
                      </li>
                    </ul>
                  </li>
                  <li>
                    <strong>Heat &amp; Corrosion Resistance:</strong> Lightweight yet highly resistant to scaling, rust,
                    and chemical corrosion.
                  </li>
                  <li>
                    <strong>Leak-Proof Joints:</strong> Secure socket fusion welding ensures permanent, leak-resistant
                    connections.
                  </li>
                  <li>
                    <strong>Quality Control:</strong> Multi-stage testing including material checks, bonding
                    integrity, dimensional accuracy, and pressure testing.
                  </li>
                  <li>
                    <strong>Complete System Offering:</strong> Backed by a wide ecosystem of fittings and tools for
                    smooth installation across all project types.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="prayag-fitting-specs" aria-labelledby="fitting-ecosystem-heading">
        <div className="container-fluid">
          <header className="prayag-fitting-specs__header">
            <h2 id="fitting-ecosystem-heading">Fittings, built to match your pipe</h2>
            <p>
              Discover Prayag&apos;s comprehensive range of precision-engineered PPR fittings, designed to create
              secure, leak-proof, and long-lasting plumbing connections. From elbows and tees to couplers, adapters,
              valves, and accessories, every fitting is manufactured for seamless fusion welding, superior durability,
              and dependable performance in hot and cold water distribution systems.
            </p>
          </header>
          <PcatTabs
            listId="prayagFittingTabs"
            listClassName="prayag-fitting-specs__tabs"
            listAriaLabel="Fitting material types"
            tabClassName="prayag-fitting-specs__tab"
            contentId="prayagFittingTabsContent"
            contentClassName="prayag-fitting-specs__content"
            tabs={fittingPanes.map((pane) => ({
              id: pane.tabId,
              paneId: pane.id,
              label: pane.tabLabel,
              content: <FittingSlider pane={pane} settings={CFS_SLICK} width={600} height={400} wrapped />,
            }))}
          />
        </div>
      </section>

      <section className="prayag-specs">
        <div className="container-fluid">
          {/* Inline style as on the source. */}
          <div className="prayag-specs__header" style={{ flexDirection: "column" }}>
            <h2>Technical Specifications</h2>
            <p>
              Based on the sources, the following tables provide a comprehensive overview of the technical
              specifications, product categories, and applications for Prayag PPR pipes.
            </p>
          </div>
          <PcatTabs
            listId="prayagSpecsTabs"
            listClassName="prayag-specs__tabs"
            listAriaLabel="Technical specifications"
            tabClassName="prayag-specs__tab"
            contentId="prayagSpecsTabsContent"
            contentClassName="prayag-specs__content"
            tabs={specPanes.map((pane) => ({
              id: pane.tabId,
              paneId: pane.paneId,
              label: pane.label,
              content: (
                <>
                  {pane.intro && <p>{pane.intro}</p>}
                  <SpecTable table={pane.table} />
                </>
              ),
            }))}
          />
        </div>
      </section>

      <FaqSection className="faq_main" items={faqs} />
    </PcatPage>
  );
}

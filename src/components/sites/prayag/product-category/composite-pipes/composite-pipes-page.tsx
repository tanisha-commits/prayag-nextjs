import type { SlickSettings } from "../slick-carousel";
import { PcatPage } from "../pcat-page";
import {
  FaqSection,
  FittingSlider,
  KaCards,
  NgpSection,
  SpecTable,
  THEME_NGP_SLICK,
  featureItems,
} from "../ppr-pipes/pcat-sections";
import { PcatTabs } from "../ppr-pipes/pcat-tabs";
import { applications, faqs, features, fittingPanes, flowCards, specPanes } from "./data";
import "./composite-pipes.css";

const IMG = "/sites/prayag/theme/composite_pipes";

// slickSettings of the page's inline script (fittings sliders).
const CFS_SLICK: SlickSettings = {
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

/** https://prayagindia.com/composite-pipes (Drupal taxonomy term page). */
export function CompositePipesPage() {
  return (
    <PcatPage slug="composite-pipes">
      <div className="breadcrumb_main">
        <div className="container-fluid p-0">
          <div className="row">
            <div className="col-md-6">
              {/* eslint-disable-next-line @next/next/no-img-element -- source responsive banner (Drupal image styles) */}
              <img
                src="/sites/prayag/files/styles/medium/public/2026-07/Composite_pipe_main_banner.webp"
                srcSet="/sites/prayag/files/styles/thumbnail/public/2026-07/Composite_pipe_main_banner.webp 300w, /sites/prayag/files/styles/thumbnail/public/2026-07/Composite_pipe_main_banner.webp 600w, /sites/prayag/files/styles/large/public/2026-07/Composite_pipe_main_banner.webp 1200w, /sites/prayag/files/styles/wide/public/2026-07/Composite_pipe_main_banner.webp 2000w"
                sizes="(max-width: 300px) 300px, (max-width: 600px) 600px, (max-width: 1200px) 1200px, 2000px"
                alt="Composite Pipes"
                width={800}
                height={450}
                className="img-fluid"
                decoding="async"
              />
            </div>
            <div className="col-md-6">
              <div className="breadcrumb_title">
                <h1 className="black_title">Composite Pipes</h1>
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
                <h2>Unmatched Strength</h2>
                <p className="prayag-subtitle">For Seamless Water Flow</p>
                <p>
                  At Prayag, we bring you a range of Composite Pipes engineered for high durability, excellent Thermal
                  compatibility, and long service life. Designed to handle extreme conditions, these pipes ensure
                  hassle-free installations with zero corrosion and high tensile strength.
                </p>
              </div>
            </div>
            <div className="col-12 col-md-6 p-0">
              {/* eslint-disable-next-line @next/next/no-img-element -- source image, intrinsic size kept */}
              <img src={`${IMG}/unmatched_strength.webp`} alt="Prayag Composite Pipe" className="prayag-pipe-img" />
            </div>
          </div>
        </div>
      </section>

      <NgpSection
        heading={
          <>
            Why Choose <strong>Prayag Composite</strong> Pipes?
          </>
        }
        label="Why choose Prayag Composite pipes"
        settings={THEME_NGP_SLICK}
      >
        {featureItems(features, "span")}
      </NgpSection>

      <section className="main_filled_scrolled_sec">
        <div className="msf-track">
          <div className="msf-stage">
            <div className="msf-slide-wrap">
              <div className="msf-image-wrap">
                {/* The source <source> tags carry `src` (not srcset), so browsers ignore them and always
                    show the <img>; kept as published. */}
                <picture>
                  <source media="(max-width: 767px)" src={`${IMG}/800_mobile_banner_composite.webp`} type="image/webp" />
                  <source media="(min-width: 768px)" src={`${IMG}/800_mobile_banner_composite.webp`} type="image/webp" />
                  <img
                    className="msf-image"
                    src={`${IMG}/3_filling_main_banner_composite_pipes.webp`}
                    alt="Composite Pipes by Prayag"
                  />
                </picture>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cp-strength">
        <div className="container-fluid">
          <p className="cp-eyebrow">Composite pipe range</p>
          <h2 className="cp-title">What are Composite Pipes</h2>
          <div className="cp-intro">
            <p>
              A composite pipe is a next-generation pressure solution utilizing a PE-AL-PE
              (Polyethylene-Aluminum-Polyethylene) multi-layer structure manufactured in strict compliance with IS
              15450:2022.
            </p>
            <p>
              This five-layer architecture integrates a form-stable aluminum core overlap-welded between layers of
              high-performance polyethylene. This evolution solves the dual problem of plastic&apos;s thermal
              instability and metal&apos;s corrosive degradation. We have created color-coded safety standards to
              identify fluid mediums immediately for risk mitigation.
            </p>
          </div>
          <div className="cp-grid">
            {flowCards.map((card) => (
              <div key={card.flow} className="cp-card" data-flow={card.flow}>
                <div className="cp-card-image">
                  {/* eslint-disable-next-line @next/next/no-img-element -- source image, intrinsic size kept */}
                  <img src={card.src} alt={card.alt} />
                </div>
                <div className="cp-card-content">
                  <span className="cp-flow-tag">
                    <span className="cp-dot" />
                    {card.colour}
                  </span>
                  <h3>{card.title}</h3>
                  <div className="cp-depth">
                    <span />
                  </div>
                  <p>{card.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="ka-applications pt-0">
        <div className="container-fluid">
          <p className="ka-eyebrow">Where our pipes work</p>
          <h2 className="ka-title">Key Application Areas</h2>
          <p className="ka-intro">
            From residential plumbing to critical medical gas lines, our pipe range is engineered for the specific
            demands of each application.
          </p>
          <div className="ka-grid">
            <KaCards items={applications} />
          </div>
        </div>
      </section>

      <section className="prayag-work-section">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-lg-6 col-md-12 p-0">
              <div className="visual-wrapper">
                {/* eslint-disable-next-line @next/next/no-img-element -- source image, intrinsic size kept */}
                <img
                  src={`${IMG}/composite-pipes-application.webp`}
                  alt="Prayag Composite Pipe engineering advantage"
                  className="img-fluid main-img"
                />
              </div>
            </div>
            <div className="col-lg-6 col-md-12 p-0">
              <div className="prayag_work_content">
                <h2>Advantage</h2>
                <p>The Engineering Advantage</p>
                <ul className="advantages_list">
                  <li>
                    <strong>Thermal Stability:</strong> The aluminum core ensures an extremely low expansion rate,
                    preventing the &quot;sagging&quot; common in standard polymers.
                  </li>
                  <li>
                    <strong>Hydraulic Efficiency:</strong> A smooth interior facilitates 30% more flow than traditional
                    alternatives, reducing pumping energy costs.
                  </li>
                  <li>
                    <strong>Form-Stability:</strong> The pipes can be hand-bent and retain their shape without
                    &quot;spring-back,&quot; drastically reducing the need for joint fittings.
                  </li>
                  <li>
                    <strong>Risk Mitigation:</strong> Available in coils up to 300m, eliminating up to 80% of potential
                    leak points compared to rigid 6-meter pipes.
                  </li>
                  <li>
                    <strong>Lightweight:</strong> Up to 70% lighter than metal, making transportation and installation
                    significantly easier.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="prayag-specs">
        <div className="container-fluid">
          {/* Inline style as on the source. */}
          <div className="prayag-specs__header" style={{ flexDirection: "column" }}>
            <h2>Specification</h2>
          </div>
          <PcatTabs
            listId="prayagSpecsTabs"
            listClassName="prayag-specs__tabs"
            listAriaLabel="Specification"
            tabClassName="prayag-specs__tab"
            contentId="prayagSpecsTabsContent"
            contentClassName="prayag-specs__content"
            tabs={specPanes.map((pane) => ({
              id: pane.tabId,
              paneId: pane.paneId,
              label: pane.label,
              content: <SpecTable table={pane.table} />,
            }))}
          />
        </div>
      </section>

      <section className="prayag-fitting-specs" aria-labelledby="fitting-ecosystem-heading">
        <div className="container-fluid">
          <header className="prayag-fitting-specs__header">
            <h2 id="fitting-ecosystem-heading">Fittings Ecosystem</h2>
            <p>
              Prayag&apos;s fitting ecosystem is designed to address the weakest link in any fluid network through
              high-precision mechanical jointing and strategic risk mitigation. The system is categorized into two
              material types and supported by a specialized toolset to ensure permanent, leak-proof connections.
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
              content: <FittingSlider pane={pane} settings={CFS_SLICK} width={600} height={400} />,
            }))}
          />
        </div>
      </section>

      <FaqSection className="faq_main pb-0" items={faqs} />

      <section className="prayag-adv-sec">
        <div className="cta-wrapper-bg mt-0">
          <div className="container-fluid">
            <div className="cta-banner">
              <div className="cta-line" />
              <div className="row relative z-1">
                <div className="col-lg-12 col-md-12 position-relative">
                  <h2 className="cta-title">Need Help Choosing the Right Composite Pipe?</h2>
                  <p className="cta-desc">
                    The modern built environment demands a fundamental shift in infrastructure reliability. For
                    decades, specifying engineers were forced into a compromise: the structural rigidity of metallic
                    pipes plagued by corrosion, or the chemical inertness of polymers hampered by high thermal
                    expansion
                  </p>
                  {/* Local copy of the source booklet; target="blank" (a named window) as on the source. */}
                  <a href="/sites/prayag/theme/Composite-Pipes-Booklet---Edition-1.pdf" className="cta-link" target="blank">
                    Download Booklet
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PcatPage>
  );
}

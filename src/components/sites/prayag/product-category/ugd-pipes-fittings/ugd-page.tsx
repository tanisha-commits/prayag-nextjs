import { Fragment } from "react";
import { applicationIcons, type ApplicationIcon } from "../cpvc-plumbing-solution/application-icons";
import { CategoryBanner } from "../cpvc-plumbing-solution/category-banner";
import { FaqSection } from "../cpvc-plumbing-solution/faq-section";
import { SpecTabs } from "../cpvc-plumbing-solution/spec-tabs";
import { SplitRevealSection } from "../split-reveal";
import { PcatPage } from "../pcat-page";
import { SlickCarousel, type SlickSettings } from "../slick-carousel";
import { applications, benefits, faqs, features, fittingSpecs, pipeSpecs, type SpecTable } from "./data";
import "./ugd-pipes-fittings.css";

// This page has no inline slider script, so the theme's `ngpFeatureSlider` Drupal behaviour
// (script.js) initialises `.ngp-features-slider` with these settings.
const featureSlider: SlickSettings = {
  slidesToShow: 4,
  slidesToScroll: 1,
  arrows: true,
  dots: false,
  infinite: true,
  autoplay: true,
  autoplaySpeed: 3000,
  speed: 420,
  responsive: [
    { breakpoint: 1320, settings: { slidesToShow: 3 } },
    { breakpoint: 1200, settings: { slidesToShow: 2 } },
    { breakpoint: 992, settings: { slidesToShow: 1 } },
    { breakpoint: 768, settings: { slidesToShow: 1 } },
  ],
};

const applicationIconOrder: ApplicationIcon[] = ["pump", "rock", "industry", "home", "shield"];

function SpecTableView({ table }: { table: SpecTable }) {
  return (
    <div className="prayag-specs__table-wrap">
      <table className="prayag-specs__table">
        <thead>
          <tr>
            {table.head.map((label) => (
              <th key={label}>{label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row) => (
            <tr key={row[0][0]}>
              {row.map((lines, c) => (
                <td key={table.head[c]} data-label={table.head[c]}>
                  {c === 0 ? (
                    <strong>{lines.join(" ")}</strong>
                  ) : (
                    lines.map((line, l) => (
                      <Fragment key={l}>
                        {l > 0 && <br />}
                        {line}
                      </Fragment>
                    ))
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** /ugd-pipes-fittings — source taxonomy/term/213 (page--taxonomy--term--213.html.twig). */
export function UgdPage() {
  return (
    <PcatPage slug="ugd-pipes-fittings">
      <CategoryBanner
        image={{
          medium: "/sites/prayag/files/styles/medium/public/2026-07/UDG-pipes_BANNER_0.webp",
          thumbnail: "/sites/prayag/files/styles/thumbnail/public/2026-07/UDG-pipes_BANNER_0.webp",
          large: "/sites/prayag/files/styles/large/public/2026-07/UDG-pipes_BANNER_0.webp",
          wide: "/sites/prayag/files/styles/wide/public/2026-07/UDG-pipes_BANNER_0.webp",
        }}
        alt="UGD Pipes & Fittings"
        title="UGD Pipes & Fittings"
      />

      <section className="prayag-section overflow-hidden">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-12 col-md-7">
              <div className="prayag-content-box">
                <h2 className="prayag-heading">THE FOUNDATION OF MODERN HYGIENE.</h2>
                <p className="prayag-subtitle">Superior UPVC Underground Drainage &amp; Sewerage Systems.</p>
                <p className="prayag-desc">
                  Prayag India’s Underground Drainage (UGD) system is meticulously designed to provide a high-performance,
                  maintenance-free solution for the disposal of sewage and surface water. Unlike traditional cement or
                  cast-iron pipes that are prone to cracking and corrosion, Prayag uPVC UGD pipes are built to withstand
                  the test of time and underground pressure.
                </p>
              </div>
            </div>
            <div className="col-12 col-md-5 p-0">
              {/* eslint-disable-next-line @next/next/no-img-element -- 1:1 port keeps the source <img> */}
              <img
                src="/sites/prayag/theme/ugd_pipes_fittings/UGD_section_about.webp"
                alt="Prayag Pipe"
                className="prayag-pipe-img"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Inline styles copied from the source markup. */}
      <section className="ngp-section" style={{ background: "#1a1a1a", padding: "60px 0" }}>
        <div className="container-fluid">
          <h2 className="text-center" style={{ color: "#fff" }}>
            Why Choose <strong>Prayag UGD</strong> Pipes?
          </h2>
          <SlickCarousel settings={featureSlider} className="ngp-features-slider" aria-label="Why choose Prayag UGD pipes">
            {features.map((feature) => (
              <div key={feature.title} className="ngp-feature-item">
                <div className="ngp-icon-circle">
                  {/* Several source icons have no alt attribute; kept as-is. */}
                  {/* eslint-disable-next-line @next/next/no-img-element -- 1:1 port keeps the source <img> */}
                  <img src={feature.icon} alt={feature.iconAlt} />
                </div>
                <h3 className="ngp-feature-label">{feature.title}</h3>
                <p className="ngp_para">{feature.text}</p>
              </div>
            ))}
          </SlickCarousel>
        </div>
      </section>

      <section className="main_filled_scrolled_sec">
        <div className="msf-track">
          <div className="msf-stage">
            <div className="msf-slide-wrap">
              <div className="msf-image-wrap">
                {/* eslint-disable-next-line @next/next/no-img-element -- 1:1 port keeps the source <img> */}
                <img className="msf-image" src="/sites/prayag/files/2026-07/image3.webp" alt="UPVC Column Pipes" />
              </div>
              <div className="msf-overlay">
                {/* The source comments out this block's subtitle and title. */}
                <div className="msf-content" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <SplitRevealSection>
        <div className="psr-container">
          <div className="psr-image-col">
            <div className="psr-image-wrap">
              {/* eslint-disable-next-line @next/next/no-img-element -- 1:1 port keeps the source <img> */}
              <img className="psr-image" src="/sites/prayag/files/2026-07/image4.2.webp" alt="Premium Bathroom Basin" />
            </div>
          </div>
          <div className="psr-content-col">
            <div className="psr-content">
              <span className="psr-eyebrow">WHAT IS UGD</span>
              <h2 className="psr-title"> Prayag UGD Pipes &amp; Fittings</h2>
              <p className="psr-description">
                uPVC (unplasticized PVC) is a rigid, chemically inert polymer that doesn&apos;t rust, corrode, or react with
                acidic or alkaline soil conditions — unlike cement or cast iron. Its smooth interior resists scale buildup,
                while its non-porous structure blocks seepage and chemical erosion entirely.
              </p>
              <p className="psr-description">
                Prayag UGD pipes are built on this material advantage: lead-free, corrosion-proof, and engineered for a
                25-year service life — ensuring the safe, hygienic transport of wastewater while protecting soil and
                building foundations from contamination.
              </p>
            </div>
          </div>
        </div>
      </SplitRevealSection>

      <section className="application_inter_main_sec">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-5 col-md-7 p-0">
              <div className="application_iner_content">
                <h2>Application</h2>
                <ul className="feature-list">
                  {applications.map((item, i) => (
                    <li key={item.label}>
                      <span className="icon">{applicationIcons[applicationIconOrder[i]]}</span>
                      <p>
                        <strong>{item.label}</strong> {item.text}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="col-lg-7 col-md-5 p-0">
              <div className="application_image">
                {/* eslint-disable-next-line @next/next/no-img-element -- 1:1 port keeps the source <img> */}
                <img src="/sites/prayag/files/2026-07/image5.webp" alt="" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="prayag-specs pt-0">
        <div className="prayag-specs__inner">
          <div className="prayag-specs__header">
            <h2 className="prayag-specs__title">Specifications</h2>
          </div>
          {/* Bootstrap 5.1 data-bs-toggle tabs on the source, hence the fade transition. */}
          <SpecTabs
            fade
            tabs={[
              { id: "testing", label: "UGD PIPE", content: <SpecTableView table={pipeSpecs} /> },
              { id: "defined", label: "UGD FITTINGS", content: <SpecTableView table={fittingSpecs} /> },
            ]}
          />
        </div>
      </section>

      <section className="prayag-work-section">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-lg-6 col-md-12">
              <div className="visual-wrapper">
                {/* eslint-disable-next-line @next/next/no-img-element -- 1:1 port keeps the source <img> */}
                <img src="/sites/prayag/files/2026-07/image6.2.webp" alt="Features & Benefits" className="img-fluid main-img" />
              </div>
            </div>
            <div className="col-lg-6 col-md-12">
              <div className="prayag_work_content">
                <h2>Features &amp; Benefits</h2>
                <p>A product range that continues to set the bar higher.</p>
                <ul>
                  {benefits.map((item) => (
                    <li key={item.label}>
                      <strong>{item.label}</strong> {item.text}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FaqSection faqs={faqs} />
    </PcatPage>
  );
}

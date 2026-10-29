import type { SlickSettings } from "../slick-carousel";
import { PcatPage } from "../pcat-page";
import { FittingSlider, KaCards, NgpSection, SpecTable } from "../ppr-pipes/pcat-sections";
import { PcatTabs } from "../ppr-pipes/pcat-tabs";
import { applications, fittingPanes, specTable } from "./data";
import {
  DrainageIcon,
  FittingRangeIcon,
  LengthOptionsIcon,
  SizeOptionsIcon,
  StandardsIcon,
  TypeOptionsIcon,
} from "./feature-icons";
import { ReadMoreButton, ReadMoreDialog, ReadMoreModalProvider } from "./read-more-modal";
import "./swr-plumbing-solution.css";

const IMG = "/sites/prayag/theme/swr";

// The page's inline script initialises `.ngp-features-slider` before theme script.js does, so this
// page gets its own options (no autoplay) rather than the theme's.
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

const features = [
  {
    Icon: DrainageIcon,
    label: "Dependable Drainage Solutions",
    text: "A comprehensive size range with purpose-built fittings to help create efficient and well-connected drainage systems.",
  },
  {
    Icon: TypeOptionsIcon,
    label: "Type A & Type B Options",
    text: "Choose from Type A and Type B SWR pipe options based on your drainage system requirements.",
  },
  {
    Icon: SizeOptionsIcon,
    label: "Multiple Size Options",
    text: "Available in 75 mm, 90 mm, 110 mm and 160 mm sizes to accommodate different drainage requirements.",
  },
  {
    Icon: FittingRangeIcon,
    label: "Complete Fitting Range",
    text: "Couplers, tees, bends, Y fittings, repair couplers, traps, floor traps, cleaning pipes and more.",
  },
  {
    Icon: LengthOptionsIcon,
    label: "Multiple Length Options",
    text: "Available in multiple lengths, including 3 m and 6 m, along with shorter cut-length options.",
  },
  {
    Icon: StandardsIcon,
    label: "Standards Marking",
    text: "Conforms to IS 13592:2013 for pipes and IS 14735:1999 for fittings.",
  },
];

/** https://prayagindia.com/swr-plumbing-solution (Drupal taxonomy term page). */
export function SwrPlumbingSolutionPage() {
  return (
    <PcatPage slug="swr-plumbing-solution">
      <div className="breadcrumb_main">
        <div className="container-fluid p-0">
          <div className="row">
            <div className="col-md-6">
              {/* eslint-disable-next-line @next/next/no-img-element -- source responsive banner (Drupal image styles) */}
              <img
                src="/sites/prayag/files/styles/medium/public/2026-09/section1.webp"
                srcSet="/sites/prayag/files/styles/thumbnail/public/2026-09/section1.webp 300w, /sites/prayag/files/styles/thumbnail/public/2026-09/section1.webp 600w, /sites/prayag/files/styles/large/public/2026-09/section1.webp 1200w, /sites/prayag/files/styles/wide/public/2026-09/section1.webp 2000w"
                sizes="(max-width: 300px) 300px, (max-width: 600px) 600px, (max-width: 1200px) 1200px, 2000px"
                alt="SWR"
                width={800}
                height={450}
                className="img-fluid"
                decoding="async"
              />
            </div>
            <div className="col-md-6">
              <div className="breadcrumb_title">
                <h1 className="black_title">SWR</h1>
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
                <p className="prayag-subtitle">For Seamless Water Flow </p>
                {/* Source copy (it describes UPVC Column Pipes on the SWR page). */}
                <p>
                  At Prayag, we bring you a range of UPVC Column Pipes engineered for high durability, excellent
                  load-bearing capacity, and long service life. Designed to handle extreme conditions, these pipes
                  ensure hassle-free borewell and submersible pump installations with zero corrosion and high tensile
                  strength.
                </p>
              </div>
            </div>
            <div className="col-12 col-md-6 p-0">
              {/* eslint-disable-next-line @next/next/no-img-element -- source image, intrinsic size kept */}
              <img src={`${IMG}/2nd-section.webp`} alt="Prayag Pipe" className="prayag-pipe-img" />
            </div>
          </div>
        </div>
      </section>

      <NgpSection
        heading={
          <>
            Why Choose <strong>Prayag SWR</strong> Pipes?
          </>
        }
        label="Why choose Prayag SWR pipes"
        settings={NGP_SLICK}
      >
        {features.map(({ Icon, label, text }) => (
          <div key={label} className="ngp-feature-item">
            <div className="ngp-icon-circle">
              <Icon />
            </div>
            <span className="ngp-feature-label">{label}</span>
            <p className="ngp_para">{text}</p>
          </div>
        ))}
      </NgpSection>

      <section className="main_filled_scrolled_sec">
        <div className="msf-track">
          <div className="msf-stage">
            <div className="msf-slide-wrap">
              <div className="msf-image-wrap">
                {/* The source <source> tags carry `src` (not srcset) pointing at the Composite banner, so
                    browsers ignore them and always show the <img>; kept as published. */}
                <picture>
                  <source
                    media="(max-width: 767px)"
                    src="/sites/prayag/theme/composite_pipes/800_mobile_banner_composite.webp"
                    type="image/webp"
                  />
                  <source
                    media="(min-width: 768px)"
                    src="/sites/prayag/theme/composite_pipes/800_mobile_banner_composite.webp"
                    type="image/webp"
                  />
                  <img
                    className="msf-image"
                    src={`${IMG}/banner.webp`}
                    alt="From Every Outlet to the Main Drain — One Complete SWR Solution. Prayag SWR Pipes and Fittings — Designed to create organised and efficient drainage networks."
                  />
                </picture>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="swr-what-section">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-12 col-md-6">
              <div className="prayag-content-box">
                <h2>What are Prayag SWR Pipes?</h2>
                <p>
                  SWR stands for Soil, Waste and Rainwater. SWR piping systems are used to carry wastewater, soil
                  discharge and rainwater through drainage networks.
                </p>
                <p>
                  Prayag SWR Pipes provide a coordinated piping and fitting solution for building drainage
                  requirements. The range is available in Type A and Type B configurations, with pipe sizes ranging
                  from 75 mm to 160 mm.
                </p>
                <p>
                  The system is complemented by a wide selection of fittings, including couplers, bends, tees, Y
                  fittings, traps, floor traps, cleaning pipes, vent cowls, back-flow valves and socket plugs, helping
                  address different requirements within a drainage installation.
                </p>
              </div>
            </div>
            <div className="col-12 col-md-6 p-0">
              {/* eslint-disable-next-line @next/next/no-img-element -- source image, intrinsic size kept */}
              <img src={`${IMG}/3.webp`} alt="Prayag SWR Pipe" className="prayag-pipe-img img-fluid" />
            </div>
          </div>
        </div>
      </section>

      {/* Inline padding as on the source. */}
      <section className="ka-applications" style={{ padding: "80px 0 80px" }}>
        <div className="container-fluid">
          <p className="ka-eyebrow">Where our pipes work</p>
          <h2 className="ka-title">Application</h2>
          <p className="ka-intro">
            Prayag SWR Pipes are built for organised soil, waste and rainwater drainage across these key
            applications.
          </p>
          <div className="ka-grid ka-grid--single-row">
            <KaCards items={applications} />
          </div>
        </div>
      </section>

      <ReadMoreModalProvider>
        <section className="prayag-work-section">
          <div className="container-fluid">
            <div className="row align-items-center">
              <div className="col-lg-6 col-md-12 p-0">
                <div className="visual-wrapper">
                  {/* eslint-disable-next-line @next/next/no-img-element -- source image, intrinsic size kept */}
                  <img src={`${IMG}/4.webp`} alt="Prayag SWR Pipe engineering advantage" className="img-fluid main-img" />
                </div>
              </div>
              <div className="col-lg-6 col-md-12 p-0">
                <div className="prayag_work_content">
                  <h2 id="swr-advantage-details">Advantage</h2>
                  <p>
                    Prayag SWR Pipes deliver extensive fitting compatibility, with a product range that includes
                    couplers, tees, bends, Y fittings, repair couplers and specialised drainage fittings. The range also
                    includes cleaning pipes, fittings with doors, traps and other components designed for different
                    drainage system requirements, alongside the SWR Pipe Self Fit range covering Type A and Type B
                    pipes and corresponding fittings — all carrying a Lead Free marking.
                  </p>
                  <ReadMoreButton>Read More</ReadMoreButton>
                </div>
              </div>
            </div>
          </div>
        </section>
        <ReadMoreDialog title="The Prayag Advantage">
          <p>
            <strong>Extensive Fitting Compatibility:</strong> The product range includes couplers, tees, bends, Y
            fittings, repair couplers and specialised drainage fittings.
          </p>
          <p>
            <strong>Drainage Access &amp; Maintenance Components:</strong> The range includes cleaning pipes, fittings
            with doors, traps and other components designed for different drainage system requirements.
          </p>
          <p>
            <strong>Self-Fit Series Available:</strong> The range also offers the SWR Pipe Self Fit range, including
            Type A and Type B pipes and corresponding fittings.
          </p>
          <p>
            <strong>Lead-Free Marking:</strong> The catalogue carries a Lead Free marking for the product range.
          </p>
        </ReadMoreDialog>
      </ReadMoreModalProvider>

      <section className="prayag-specs">
        <div className="container-fluid">
          {/* Inline style as on the source. */}
          <div className="prayag-specs__header" style={{ flexDirection: "column" }}>
            <h2>Specification</h2>
          </div>
          {/* A single always-visible pane; the source's role="tabpanel" / aria-labelledby point at a
              tab that does not exist, so they are left out. */}
          <div className="tab-content prayag-specs__content" id="prayagSpecsTabsContent">
            <div className="tab-pane fade show active" id="pane-pipes">
              <SpecTable table={specTable} />
            </div>
          </div>
        </div>
      </section>

      <section className="prayag-fitting-specs" aria-labelledby="swr-fitting-ecosystem-heading">
        <div className="container-fluid">
          <header className="prayag-fitting-specs__header">
            <h2 id="swr-fitting-ecosystem-heading">SWR Fittings for Every Connection</h2>
            <p>
              Browse the full SWR Pipe fitting range and the SELFIT Series fittings, with available sizes from the
              reference table.
            </p>
          </header>
          <PcatTabs
            listId="prayagSwrFittingsTabs"
            listClassName="prayag-fitting-specs__tabs"
            listAriaLabel="SWR fitting series"
            tabClassName="prayag-fitting-specs__tab"
            contentId="prayagSwrFittingsContent"
            contentClassName="prayag-fitting-specs__content"
            tabs={fittingPanes.map((pane) => ({
              id: pane.tabId,
              paneId: pane.id,
              label: pane.tabLabel,
              content: <FittingSlider pane={pane} settings={CFS_SLICK} width={400} height={400} />,
            }))}
          />
        </div>
      </section>
    </PcatPage>
  );
}

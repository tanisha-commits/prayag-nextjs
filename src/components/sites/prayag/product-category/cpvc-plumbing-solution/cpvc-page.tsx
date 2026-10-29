import { PcatPage } from "../pcat-page";
import { SlickCarousel, type SlickSettings } from "../slick-carousel";
import { AdvantageAccordion } from "./advantage-accordion";
import { applicationIcons, type ApplicationIcon } from "./application-icons";
import { ArrowIcon, CategoryBanner } from "./category-banner";
import { advantages, applications, faqs, features, rangeCards, specRows } from "./data";
import { FaqSection } from "./faq-section";
import { featureIcons } from "./feature-icons";
import { SpecTabs } from "./spec-tabs";
import { SplitRevealSection } from "../split-reveal";
import "./cpvc-plumbing-solution.css";

const IMG = "/sites/prayag/theme/cpvc";

// The source HTML already carries data-once="ngp-feature-slider" / "cp-slider", so the theme's
// Drupal behaviours skip both sliders and the page's inline script initialises them with these
// settings (confirmed on the live page: 3 cards per view at 820px, which only these allow).
const featureSlider: SlickSettings = {
  autoplay: true,
  autoplaySpeed: 3000,
  dots: false,
  infinite: true,
  arrows: true,
  speed: 300,
  slidesToShow: 4,
  slidesToScroll: 1,
  responsive: [
    { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 1 } },
    { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 1, arrows: true, dots: true } },
    { breakpoint: 576, settings: { slidesToShow: 1, slidesToScroll: 1, arrows: true, dots: true } },
  ],
};

const rangeSlider: SlickSettings = {
  autoplay: true,
  autoplaySpeed: 3000,
  dots: true,
  infinite: true,
  arrows: true,
  speed: 300,
  slidesToShow: 4,
  slidesToScroll: 1,
  responsive: [
    { breakpoint: 1200, settings: { slidesToShow: 3, slidesToScroll: 1 } },
    { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 1, arrows: false, dots: true } },
    { breakpoint: 576, settings: { slidesToShow: 1, slidesToScroll: 1, arrows: false, dots: true } },
  ],
};

const applicationIconOrder: ApplicationIcon[] = ["pump", "rock", "industry", "home", "home", "home"];

// Inline styles copied from the source markup (they outrank the ported stylesheet there too).
const specCell = { textAlign: "left", paddingLeft: 24 } as const;

/** /cpvc-plumbing-solution — source taxonomy/term/209 (page--taxonomy--term--209.html.twig). */
export function CpvcPage() {
  return (
    <PcatPage slug="cpvc-plumbing-solution">
      <CategoryBanner
        image={{
          medium: "/sites/prayag/files/styles/medium/public/2026-09/img1.png",
          thumbnail: "/sites/prayag/files/styles/thumbnail/public/2026-09/img1.png",
          large: "/sites/prayag/files/styles/large/public/2026-09/img1.png",
          wide: "/sites/prayag/files/styles/wide/public/2026-09/img1.png",
        }}
        alt="CPVC -Plumbing solution"
        title="cPVC Pipes"
      />

      <section className="prayag-section overflow-hidden">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-12 col-md-6">
              <div className="prayag-content-box">
                <h2 className="prayag-heading">What are cPVC Pipes?</h2>
                <p className="prayag-subtitle">Superior Hot &amp; Cold Water Distribution System </p>
                <p className="prayag-desc">
                  Prayag cPVC Pipes are advanced chlorinated polyvinyl chloride plumbing pipes designed specifically for hot
                  and cold potable water distribution. Manufactured using premium-grade cPVC compound, they offer higher
                  thermal stability, superior pressure handling, corrosion resistance, and excellent durability compared to
                  conventional piping materials.
                </p>
                <a href="#advanced_plumbling" className="prayag-btn">
                  <ArrowIcon />
                  Know More
                </a>
              </div>
            </div>
            <div className="col-12 col-md-6 p-0">
              {/* eslint-disable-next-line @next/next/no-img-element -- 1:1 port keeps the source <img> */}
              <img src={`${IMG}/03-cpvc-studio-five-slender-pipes-revised-copy.webp`} alt="Prayag Pipe" className="prayag-pipe-img" />
            </div>
          </div>
        </div>
      </section>

      <section className="ngp-section" style={{ background: "#1a1a1a", padding: "60px 0" }}>
        <div className="container-fluid">
          {/* Source heading has a stray </strong> (no opening tag), which the parser drops. */}
          <h2 className="text-center" style={{ color: "#fff", marginBottom: 40 }}>
            Why Choose Prayag cPVC Casing Pipes?
          </h2>
          <SlickCarousel
            settings={featureSlider}
            className="ngp-features-slider"
            style={{ color: "#fff" }}
            aria-label="Why choose Prayag cPVC pipes"
          >
            {features.map((feature, i) => (
              <div key={feature.title} className="ngp-feature-item">
                <div className="ngp-icon-circle">{featureIcons[i]}</div>
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
            <div className="msf-image-wrap">
              {/* eslint-disable-next-line @next/next/no-img-element -- 1:1 port keeps the source <img> */}
              <img className="msf-image" src={`${IMG}/cpvc-banner.webp`} alt="Modern Kitchen" />
            </div>
            <div className="msf-overlay">
              <div className="msf-content">
                <h2 className="msf-title">Explore Our Plumling Solution</h2>
                <p className="msf-subtitle">cPVC Pipes</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SplitRevealSection id="advanced_plumbling">
        <div className="psr-container">
          <div className="psr-image-col">
            <div className="psr-image-wrap">
              {/* eslint-disable-next-line @next/next/no-img-element -- 1:1 port keeps the source <img> */}
              <img
                className="psr-image"
                src={`${IMG}/04-cpvc-material-closeup-slender-red-line-revised-copy.webp`}
                alt="Premium Bathroom Basin"
              />
            </div>
          </div>
          <div className="psr-content-col">
            <div className="psr-content">
              <span className="psr-eyebrow">Advanced Plumbing Solutions for Modern Infrastructure</span>
              <h2 className="psr-title">High Performance cPVC Pipes</h2>
              <p className="psr-description">
                Prayag CPVC Pipes are engineered to deliver safe, reliable, and long-lasting hot and cold water
                distribution for residential, commercial, and industrial applications. Manufactured from premium-grade
                Chlorinated Polyvinyl Chloride (CPVC), they offer exceptional resistance to heat, pressure, corrosion,
                chemicals, and scaling, ensuring consistent performance even under demanding conditions. Their high Vicat
                Softening Temperature and superior burst strength make them ideal for continuous hot water systems, while
                the smooth inner surface promotes efficient water flow with minimal friction loss.
              </p>
              <p className="psr-description">
                Made from food-grade, non-toxic material, Prayag CPVC Pipes preserve the purity, taste, and odour of
                drinking water. Lightweight construction and solvent-welded joints allow for quick, leak-proof
                installation, reducing both labour and maintenance costs. Supported by a comprehensive range of compatible
                fittings and accessories, Prayag provides a complete plumbing solution designed for durability,
                efficiency, and peace of mind. Whether for new construction or renovation projects, Prayag CPVC Pipes are
                built to deliver dependable performance for years to come.
              </p>
              <a href="#prayag-advantage" className="prayag-btn">
                <ArrowIcon />
                Know More
              </a>
            </div>
          </div>
        </div>
      </SplitRevealSection>

      <section className="application_inter_main_sec pt-0">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12 col-lg-5">
              <div className="application_iner_content">
                <h2>Application</h2>
                <ul className="feature-list">
                  {applications.map((text, i) => (
                    <li key={text}>
                      <span className="icon">{applicationIcons[applicationIconOrder[i]]}</span>
                      <p>{text}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="col-12 col-lg-7">
              <div className="application_image">
                {/* eslint-disable-next-line @next/next/no-img-element -- 1:1 port keeps the source <img> */}
                <img src={`${IMG}/img2.webp`} alt="" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="prayag-advantage-acc-sec pt-0" id="prayag-advantage">
        <div className="container-fluid">
          <h2 className="prayag-adv-heading">
            The <strong>Prayag Advantage</strong>
          </h2>
          <div className="prayag-adv-split">
            <div className="prayag-adv-accordion-col col-6">
              <div className="prayag-adv-heading-border" />
              <AdvantageAccordion items={advantages} />
            </div>
            <div className="prayag-adv-image-card col-6">
              {/* eslint-disable-next-line @next/next/no-img-element -- 1:1 port keeps the source <img> */}
              <img src={`${IMG}/06-cpvc-compatible-fittings-expanded-revised-copy.webp`} alt="The Prayag Advantage" />
            </div>
          </div>
        </div>
      </section>

      <section className="cp-strength p-0">
        <div className="container-fluid">
          <h2 className="cp-title">CPVC Fittings &amp; Pipes Range</h2>
          <p className="cp-eyebrow">CPVC Fittings for Every Connection</p>
          <div className="cp-intro">
            <p>
              Explore our complete range of high-performance CPVC pipes, fittings, valves, and accessories designed for
              secure, leak-proof joints in hot and cold water distribution systems.
            </p>
          </div>
          {/* The source uses slick lazyLoad (data-lazy, loaded before a slide shows). Images load eagerly here: a
              not-yet-loaded image has no intrinsic width, which would shrink its flex card until it arrives. */}
          <SlickCarousel settings={rangeSlider} className="cp-slider" aria-label="CPVC fittings and pipes range">
            {rangeCards.map((card, i) => (
              <div key={i} className="cp-card">
                <figure className="cp-card-figure">
                  {/* eslint-disable-next-line @next/next/no-img-element -- 1:1 port keeps the source <img> */}
                  <img src={card.image} alt={card.alt} />
                </figure>
                <div className="cp-card-content">
                  <h3 className="cp-card-title">{card.title}</h3>
                  <div className={`cp-card-bar cp-card-bar--${card.bar}`} />
                  <p>
                    <strong>Range:</strong> {card.range}
                  </p>
                </div>
              </div>
            ))}
          </SlickCarousel>
        </div>
      </section>

      <section className="prayag-specs">
        <div className="prayag-specs__inner">
          <div className="prayag-specs__header">
            <h2 className="prayag-specs__title">Specifications</h2>
            <p className="prayag-specs__subtitle">Quality you can measure</p>
          </div>
          <SpecTabs
            tabs={[
              {
                id: "technical",
                label: "Technical Specifications",
                content: (
                  <div className="prayag-specs__table-wrap">
                    <table className="prayag-specs__table">
                      <thead>
                        <tr>
                          <th scope="col" style={{ ...specCell, width: "35%" }}>
                            Parameter
                          </th>
                          <th scope="col" className="is-highlight" style={specCell}>
                            Specification Details
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {specRows.map((row) => (
                          <tr key={row.param}>
                            <td className="cell-param" data-label="Parameter">
                              {row.param}
                            </td>
                            <td
                              className={row.highlight ? "cell-highlight" : undefined}
                              data-label="Specification"
                              style={specCell}
                            >
                              {row.value}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ),
              },
            ]}
          />
        </div>
      </section>

      <FaqSection faqs={faqs} />
    </PcatPage>
  );
}

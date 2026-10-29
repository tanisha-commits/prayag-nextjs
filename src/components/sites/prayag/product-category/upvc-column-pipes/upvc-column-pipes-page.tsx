import Link from "next/link";
import { SplitRevealSection } from "../split-reveal";
import { PcatPage } from "../pcat-page";
import { SlickCarousel, type SlickSettings } from "../slick-carousel";
import { SpecsTabs, type SpecsTab } from "./specs-tabs";
import "./upvc-column-pipes.css";

const THEME = "/sites/prayag/theme";
// Source folder names contain spaces ("UPVC Column Pipes/Why choose icon"); the copies keep them.
const CAT = `${THEME}/product_categories/UPVC%20Column%20Pipes`;
const IMG = `${THEME}/upvc_column_pipes`;
const BANNER = "/sites/prayag/files/styles";

// Theme behaviour `ngpFeatureSlider`: the page has no inline script, but the aggregated theme
// JS initialises every `.ngp-features-slider`, so the live page shows a working slider.
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

// Icon alt texts are copy-pasted from another page on the source; kept verbatim.
const features = [
  {
    icon: `${IMG}/lead-free_prayag-icon.webp`,
    alt: "Fire Resistant",
    label: "Lead-Free Construction",
    text: "Manufactured using lead-free uPVC compounds, ensuring safer water transportation and environmentally responsible performance.",
  },
  {
    icon: `${CAT}/Why%20choose%20icon/Superior-Strength.webp`,
    alt: "Cost Effective",
    label: "Superior Load Bearing Capacity",
    text: "Designed to support the combined weight of the pump, water column, cable, and pipe assembly even in deep borewell installations.",
  },
  {
    icon: `${CAT}/Why%20choose%20icon/Corrosion-Free-Rust-Proof.webp`,
    alt: "Easy to Install",
    label: "Corrosion-Free Performance",
    text: "Unlike metal pipes, Prayag Column Pipes are immune to rust, corrosion, and electrochemical reactions commonly found in underground water systems.",
  },
  {
    icon: `${IMG}/Leak-proof.webp`,
    alt: "Maintenance Free",
    label: "Leak-Proof Threaded Connections",
    text: "Precision-engineered threaded joints provide secure connections and minimize the risk of leakage during operation.",
  },
  {
    icon: `${CAT}/Why%20choose%20icon/Lightweight-Easy-to-Install.webp`,
    alt: "Strong & Durable",
    label: "Lightweight Design",
    text: "Easy handling and faster installation reduce labor efforts and installation time.",
  },
  {
    icon: `${IMG}/long_term_reliability.webp`,
    alt: "Strong & Durable",
    label: "Long-Term Reliability",
    text: "Built to withstand continuous operation in challenging borewell environments for years of dependable service.",
  },
];

const applications = [
  {
    title: "Residential Water Supply:",
    text: " Reliable water transportation for homes and residential communities.",
    icon: (
      <>
        <rect x="20" y="20" width="24" height="20" rx="2" />
        <line x1="32" y1="10" x2="32" y2="20" />
        <rect x="10" y="40" width="44" height="10" rx="2" />
      </>
    ),
  },
  {
    title: "Agricultural Irrigation: ",
    text: "Suitable for farms, irrigation systems, and agricultural water management.",
    icon: <polygon points="10,40 20,20 40,12 54,28 46,50 18,50" />,
  },
  {
    title: "Commercial Buildings:",
    text: " Dependable performance for commercial water supply systems.",
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
    title: "Industrial Water Transfer:",
    text: " Designed to support demanding industrial pumping applications.",
    icon: (
      <>
        <path d="M10 30L32 12L54 30" />
        <rect x="16" y="30" width="32" height="22" />
      </>
    ),
  },
];

const comparison = [
  {
    title: "Coupler Type Column Pipes",
    text: "Coupler Type Column Pipes use a separate threaded coupler to join two pipes securely.",
    benefits: [
      "Enhanced joint strength",
      "Ideal for deep borewell installations",
      "Suitable for high-load applications",
      "Easy maintenance and replacement",
    ],
  },
  {
    title: "Belling Type Column Pipes",
    text: "Belling Type Column Pipes feature an integrated bell-end connection, eliminating the need for a separate coupler.",
    benefits: [
      "Faster installation",
      "Reduced component count",
      "Lightweight assembly",
      "Suitable for standard and medium-depth borewells",
    ],
  },
];

const sizeHeads = ["Class", "Nominal Size", "DN (mm)", "Pressure Rating"];
// [class, nominal size, DN, pressure rating]
const couplerSizes = [
  ["Class 1-3", '1"', "25", "10-15"],
  ["Class 1-4", '1¼"', "32", "10-20"],
  ["Class 1-3", '1½"', "40", "10-15"],
  ["Class 1-3", '2"', "50", "10-15"],
  ["Class 1-3", '2½"', "65", "10-15"],
  ["Class 1-3", '3"', "80", "10-15"],
  ["Class 1-3", '4"', "100", "10-15"],
];
const bellingSizes = [
  ["Class 1-2", '1"', "25", "10-12.5"],
  ["Class 1-2", '1¼"', "32", "10-12.5"],
];
const techSpecs = [
  ["Material", "Lead-Free uPVC"],
  ["Joint Type", "Threaded"],
  ["Pipe Length", "3 Meter"],
  ["Size Range", '1" to 4"'],
  ["Available Classes", "Class 1 to Class 4"],
  ["Pipe Types", "Coupler Type & Belling Type"],
  ["Application", "Borewell Rising Main System"],
  ["Corrosion Resistance", "Excellent"],
  ["Water Quality Impact", "Non-Toxic & Lead-Free"],
];

// Only the first (coupler) table carries data-label cells on the source.
function SizesTable({ rows, labelled }: { rows: string[][]; labelled: boolean }) {
  return (
    <div className="prayag-specs__table-wrap">
      <table className="prayag-specs__table">
        <thead>
          <tr>
            {sizeHeads.map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.join("|")}>
              {row.map((cell, i) => (
                <td key={i} data-label={labelled ? sizeHeads[i] : undefined}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const specsTabs: SpecsTab[] = [
  { id: "testing", label: "PVC Column Pipe Coupler Type", pane: <SizesTable rows={couplerSizes} labelled /> },
  { id: "defined", label: "Column Pipe Belling Type", pane: <SizesTable rows={bellingSizes} labelled={false} /> },
  {
    id: "techspec",
    label: "Technical Specifications",
    pane: (
      <div className="row">
        <div className="col-lg-12 col-md-12">
          <div className="tech-table-wrapper">
            <table className="table tech-table table-borderless">
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Specification</th>
                </tr>
              </thead>
              <tbody>
                {techSpecs.map(([k, v]) => (
                  <tr key={k}>
                    <td>{k}</td>
                    <td>{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    ),
  },
];

const strengthClasses = [
  ["Class 1", "Suitable for standard borewell applications and moderate operating conditions."],
  ["Class 2", "Designed for medium-depth installations requiring higher pressure handling capability."],
  ["Class 3", "Recommended for deep borewells where greater load-bearing strength is required."],
  ["Class 4", "Extra heavy-duty option for demanding borewell installations and challenging operating environments."],
];

const advantages = [
  "Premium Lead-Free uPVC Compound",
  "Long Service Life",
  "High Mechanical Strength",
  "Multiple Sizes and Pressure Classes",
  "Precision Thread Manufacturing",
  "Available in Coupler and Belling Type Designs",
  "Corrosion-Free Operation",
];

// FAQ answers keep the source's `<p></p><p class="MsoNormal"><span lang="EN-IN">…</span></p><p></p>`
// shape (empty paragraphs included). Links to cloned routes are local; the rest stay absolute.
const faqs: { q: string; a: React.ReactNode }[][] = [
  [
    {
      q: "1. What are Prayag uPVC Column Pipes used for?",
      a: (
        <>
          Prayag uPVC Column Pipes are used as the rising main in <Link href="/casing-pipes">borewell systems</Link>.
          They carry water from a submersible pump installed inside the borewell to the surface while supporting the
          suspended load of the pump, water column, cable, and pipe assembly.
        </>
      ),
    },
    {
      q: "2. How do column pipes work in a borewell system?",
      a: "Column pipes connect the submersible pump to the water outlet at the surface. As the pump operates, water travels upward through the pipe. Because the full assembly is suspended in the borewell, correct pipe strength, jointing, and installation are important for dependable performance.",
    },
    {
      q: "3. What material are Prayag Column Pipes made from?",
      a: (
        <>
          They are manufactured from premium-grade, lead-free{" "}
          <a href="https://prayagindia.com/upvc-pipes">uPVC compound</a>. The material combines low weight with high
          mechanical and tensile strength and is designed for continuous use in demanding borewell environments.
        </>
      ),
    },
    {
      q: "4. Where can Prayag uPVC Column Pipes be installed?",
      a: (
        <>
          The listed applications include residential water supply,{" "}
          <a href="https://prayagindia.com/agri-pipe">agricultural irrigation</a>, commercial buildings, and
          industrial water-transfer systems. The appropriate configuration depends on borewell depth, pump load,
          operating pressure, discharge requirement, and site conditions.
        </>
      ),
    },
    {
      q: "5. Why are uPVC column pipes used instead of metal pipes?",
      a: (
        <>
          Unlike metal pipes, uPVC column pipes do not rust and are resistant to corrosion and electrochemical
          reactions found in underground water systems. Their lightweight construction can also simplify handling and
          installation while supporting{" "}
          <Link href="/how-select-durable-pipes-fittings-long-term-use">long-term borewell operation</Link>.
        </>
      ),
    },
    {
      q: "6. Can Prayag Column Pipes support a submersible pump?",
      a: (
        <>
          Yes. Prayag states that its column pipes are engineered to support the combined weight of the{" "}
          <Link href="/plumbers-guide-choosing-right-pipe-different-plumbing-points">submersible pump</Link>, water
          column, cable, and pipe assembly. The suitable size and pressure class must be selected for the actual
          installation depth and operating load.
        </>
      ),
    },
    {
      q: "7. How do the threaded joints help prevent leakage?",
      a: (
        <>
          Precision-engineered threaded connections create secure joints between compatible pipe sections. Correct
          assembly helps{" "}
          <Link href="/how-choose-leak-resistant-pipe-fittings-new-home-construction">minimize leakage</Link> during
          operation, but the threads must be kept clean, aligned properly, and tightened according to the installation
          requirements.
        </>
      ),
    },
    {
      q: "8. What is the difference between Coupler Type and Belling Type Column Pipes?",
      a: "Coupler Type pipes use a separate threaded coupler and are positioned for enhanced joint strength, deep borewells, and high-load applications. Belling Type pipes have an integrated bell-end connection, reducing the number of components and supporting faster installation in standard and medium-depth borewells.",
    },
  ],
  [
    {
      q: "9. What sizes are available in Prayag uPVC Column Pipes?",
      a: (
        <>
          Prayag lists <Link href="/best-pipes-for-plumbing-and-types-of-plastic-pipes">nominal sizes</Link> from 1
          inch to 4 inches, corresponding to DN 25 mm through DN 100 mm. The product page also identifies a standard
          pipe length of 3 metres. Availability varies by pipe type and pressure class.
        </>
      ),
    },
    {
      q: "10. Which pressure classes are available?",
      a: (
        <>
          The range includes Class 1 through Class 4, with listed pressure ratings that vary by nominal size and pipe
          configuration. Because the correct class depends on depth, load, and operating conditions, the{" "}
          <Link href="/why-builders-contractors-prefer-certified-pipes-fittings-large-projects">
            project specification
          </Link>{" "}
          should be confirmed before purchase.
        </>
      ),
    },
    {
      q: "11. How do I choose the correct strength class for a borewell?",
      a: "Prayag describes Class 1 for standard applications, Class 2 for medium-depth installations, Class 3 for deep borewells requiring greater load-bearing strength, and Class 4 for demanding or extra-heavy-duty conditions. Final selection should follow the borewell design and pump manufacturer's requirements.",
    },
    {
      q: "12. Are Prayag uPVC Column Pipes safe for water transportation?",
      a: "Prayag states that the pipes are made from non-toxic, lead-free uPVC. This construction is intended to support safer water transportation in domestic, agricultural, commercial, and industrial pumping systems.",
    },
    {
      q: "13. Are Prayag Column Pipes corrosion resistant?",
      a: (
        <>
          Yes. The uPVC material is immune to rust and offers strong resistance to{" "}
          <Link href="/why-prayag-trusted-among-pvc-pipe-manufacturers">corrosion</Link> and electrochemical
          reactions. This makes the pipes suitable for underground water systems where metal components may be
          affected by moisture and water chemistry.
        </>
      ),
    },
    {
      q: "14. Are uPVC Column Pipes easy to install and maintain?",
      a: (
        <>
          Their lightweight design can reduce handling effort and installation time. Coupler Type pipes allow
          individual sections to be maintained or replaced, while Belling Type pipes reduce the component count.
          Installation should still be completed by trained professionals using{" "}
          <a href="https://prayagindia.com/pipes-fittings">compatible pipes</a>, threads, and accessories.
        </>
      ),
    },
    {
      q: "15. How should I select the right Prayag Column Pipe for my project?",
      a: "Consider the borewell depth, pump weight, water column, operating pressure, discharge requirement, nominal diameter, pipe class, and preferred Coupler Type or Belling Type connection. A qualified plumbing professional or borewell specialist should verify the final specification before installation.",
    },
  ],
];

/** https://prayagindia.com/upvc-column-pipes, content between header and footer. */
export function UpvcColumnPipesPage() {
  return (
    <PcatPage slug="upvc-column-pipes">
      <div className="breadcrumb_main">
        <div className="container-fluid p-0">
          <div className="row">
            <div className="col-md-6">
              {/* eslint-disable-next-line @next/next/no-img-element -- source responsive banner (srcset/sizes), kept 1:1 */}
              <img
                src={`${BANNER}/medium/public/2026-05/banner-main.webp`}
                srcSet={[
                  `${BANNER}/thumbnail/public/2026-05/banner-main.webp 300w`,
                  `${BANNER}/thumbnail/public/2026-05/banner-main.webp 600w`,
                  `${BANNER}/large/public/2026-05/banner-main.webp 1200w`,
                  `${BANNER}/wide/public/2026-05/banner-main.webp 2000w`,
                ].join(", ")}
                sizes="(max-width: 300px) 300px, (max-width: 600px) 600px, (max-width: 1200px) 1200px, 2000px"
                alt="uPVC Column Pipes"
                width={800}
                height={450}
                className="img-fluid"
                decoding="async"
              />
            </div>
            <div className="col-md-6">
              <div className="breadcrumb_title">
                <h1 className="black_title">uPVC Column Pipes</h1>
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
                  At Prayag, we bring you a range of uPVC Column Pipes engineered for high durability, excellent
                  load-bearing capacity, and long service life. Designed to handle extreme conditions, these pipes
                  ensure hassle-free borewell and submersible pump installations with zero corrosion and high tensile
                  strength.
                </p>
              </div>
            </div>
            <div className="col-12 col-md-6 p-0">
              {/* eslint-disable-next-line @next/next/no-img-element -- intrinsic sizing as on the source */}
              <img src={`${CAT}/boretec_pipe_main_image.webp`} alt="Prayag Pipe" className="prayag-pipe-img" />
            </div>
          </div>
        </div>
      </section>

      <section className="ngp-section" style={{ background: "#1a1a1a", padding: "60px 0" }}>
        <div className="container-fluid">
          <h2 className="text-center" style={{ color: "#fff" }}>
            Why Choose <strong> Prayag uPVC Column</strong> Pipes?
          </h2>
          <SlickCarousel
            settings={featureSlider}
            className="ngp-features-slider"
            style={{ color: "#fff" }}
            aria-label="Why choose Prayag uPVC Column Pipes"
          >
            {features.map((f) => (
              <div key={f.label} className="ngp-feature-item">
                <div className="ngp-icon-circle">
                  {/* eslint-disable-next-line @next/next/no-img-element -- intrinsic sizing as on the source */}
                  <img src={f.icon} alt={f.alt} />
                </div>
                <h3 className="ngp-feature-label">{f.label}</h3>
                <p className="ngp_para">{f.text}</p>
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
                {/* eslint-disable-next-line @next/next/no-img-element -- full-bleed image, intrinsic height as on the source */}
                <img className="msf-image" src={`${CAT}/image.webp`} alt="UPVC Column Pipes" />
              </div>
              <div className="msf-overlay">
                <div className="msf-content">
                  <h2 className="msf-title">Explore Our uPVC Column Pipes</h2>
                  <p className="msf-subtitle">CP Faucets</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SplitRevealSection>
        <div className="psr-container">
          <div className="psr-image-col">
            <div className="psr-image-wrap">
              {/* eslint-disable-next-line @next/next/no-img-element -- intrinsic sizing as on the source */}
              <img className="psr-image" src={`${IMG}/Lead-Free-UPVC-Column-Pipes.webp`} alt="Premium Bathroom Basin" />
            </div>
          </div>
          <div className="psr-content-col">
            <div className="psr-content">
              <span className="psr-eyebrow">High-Strength Rising Main Solution for Borewell Applications</span>
              <h2> Lead-Free uPVC Column Pipes</h2>
              <p className="psr-description">
                Prayag Lead-Free uPVC Column Pipes are engineered to deliver reliable water transportation from
                submersible pumps to the surface. These pipes are manufactured from premium-grade lead-free uPVC
                compound. And offer superior strength, corrosion resistance, and long-term performance in demanding
                borewell conditions.
              </p>
              <p className="psr-description">
                Designed to withstand high tensile loads and pressure variations, Prayag Column Pipes provide a
                dependable rising main solution for domestic, agricultural, commercial, and industrial water systems.
                Available in Coupler Type and Belling Type configurations…
              </p>
              <a href="#comparison-section" className="prayag-btn">
                <svg width="22" height="12" viewBox="0 0 22 12" fill="none" aria-hidden="true">
                  <path
                    d="M21.2308 5.99866C21.2211 5.78469 21.1301 5.53538 20.9771 5.37908L15.9807 0.279282C15.6418 -0.0128267 14.993 -0.133765 14.6154 0.204859C14.2436 0.537901 14.2533 1.18352 14.6251 1.51656L18.1381 5.09813H0.937304C0.420215 5.09813 0 5.50188 0 5.99864C0 6.49542 0.420245 6.89914 0.937304 6.89914H18.1381L14.6251 10.4807C14.3055 10.7877 14.2455 11.4557 14.6154 11.7924C14.9834 12.1292 15.6573 12.0213 15.9807 11.718L20.9771 6.61819C21.1475 6.4433 21.2308 6.23868 21.2308 5.99866Z"
                    fill="black"
                  />
                </svg>
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
                  {applications.map((a) => (
                    <li key={a.title}>
                      <span className="icon">
                        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" aria-hidden="true">
                          {a.icon}
                        </svg>
                      </span>
                      <p>
                        <span className="featured_span_color">{a.title}</span>
                        {a.text}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="col-12 col-lg-7">
              <div className="application_image">
                {/* eslint-disable-next-line @next/next/no-img-element -- intrinsic sizing as on the source */}
                <img src={`${IMG}/applicationupvc-column.webp`} alt="" />
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
                {/* eslint-disable-next-line @next/next/no-img-element -- intrinsic sizing as on the source */}
                <img
                  src={`${IMG}/How-Prayag-Column-Pipes-Work_praya.webp`}
                  alt="How Prayag Pipes Work"
                  className="img-fluid main-img"
                />
              </div>
            </div>
            <div className="col-lg-6 col-md-12">
              <div className="prayag_work_content">
                <h2>How Prayag Column Pipes Work</h2>
                <p>
                  Prayag Column Pipes act as the rising main in a borewell system, carrying water from the submersible
                  pump installed deep inside the borewell to the surface.
                </p>
                <p>
                  The pipe system not only transports water but also supports the suspended load of the pump assembly,
                  making strength and reliability critical factors in borewell performance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="comparison-section" className="prayag-comparison-section">
        <div className="container-fluid">
          <h2>Coupler Type vs Belling Type</h2>
          <div className="row">
            {comparison.map((c, i) => (
              <div key={c.title} className={i === 0 ? "col-lg-6 col-md-12 mb-4 mb-lg-0" : "col-lg-6 col-md-12"}>
                <div className="comp-card">
                  <div className="comp-card-header">{c.title}</div>
                  <div className="comp-card-body">
                    <p>{c.text}</p>
                    <h4 className="benefits-title">Benefits</h4>
                    <ul className="comp-list">
                      {c.benefits.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="prayag-specs pt-0">
        <div className="container-fluid">
          <div className="prayag-specs__header" style={{ flexDirection: "column" }}>
            <h2>Available Sizes</h2>
            <p>
              Prayag Column Pipes are available in multiple sizes to suit various pumping capacities and water
              discharge requirements.
            </p>
          </div>
          <SpecsTabs tabs={specsTabs} />
        </div>
      </section>

      <section className="section_strength p-0">
        <div className="container-fluid">
          <div className="wrap">
            <span className="eyebrow">Strength Guide</span>
            <h2>Choose the Right Strength for Your Borewell</h2>
            <p>
              To meet different installation depths and operating conditions, Prayag Column Pipes are available in
              multiple pressure classes.
            </p>
            <div className="grid classes">
              {strengthClasses.map(([name, text]) => (
                <div key={name} className="card class-card">
                  <h3>{name}</h3>
                  <div className="depth">
                    <span />
                  </div>
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="prayag-adv-sec">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-lg-5 col-md-12 mb-4 mb-lg-0">
              <h2>The Prayag Advantage</h2>
              <p>
                Choose Prayag Lead-Free uPVC Column Pipes for dependable borewell performance, superior strength, and
                long-lasting water delivery solutions.
              </p>
            </div>
            <div className="col-lg-7 col-md-12">
              <div className="adv-list-card">
                <ul className="adv-grid-list">
                  {advantages.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="cta-wrapper-bg">
          <div className="container-fluid">
            <div className="cta-banner">
              <div className="cta-line" />
              <div className="row relative z-1">
                <div className="col-lg-12 col-md-12 position-relative">
                  <h2 className="cta-title">Need Help Choosing the Right uPVC Column Pipe?</h2>
                  <p className="cta-desc">
                    Whether you&apos;re installing a domestic borewell, agricultural irrigation system, or industrial
                    pumping setup, our experts can help you choose the correct size, pressure class, and pipe type.
                  </p>
                  {/* Source links the theme PDF; served from the local copy (identical to the backup file). */}
                  <a href={`${IMG}/Column-PIPE-Booklet---Edition-1.pdf`} className="cta-link">
                    Download Booklet
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="faq_main">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12">
              <div className="faq_sing_pro">
                <h2>Faq&apos;s</h2>
                <div className="row">
                  {faqs.map((column, i) => (
                    <div key={i} className="col-md-6 col-6">
                      {column.map((item) => (
                        <div key={item.q} className="faq_box">
                          <h3>{item.q}</h3>
                          <p />
                          <p className="MsoNormal">
                            <span lang="EN-IN">{item.a}</span>
                          </p>
                          <p />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PcatPage>
  );
}

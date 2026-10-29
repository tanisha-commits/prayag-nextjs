import Link from "next/link";
import { PcatPage } from "../pcat-page";
import { SlickCarousel, type SlickSettings } from "../slick-carousel";
import { DurabilityIcon, HealthSafetyIcon, LoadCapacityIcon, MaintenanceFreeIcon, RustProofIcon } from "./feature-icons";
import { FittingTiles, type Fitting } from "./fitting-tiles";
import { SplitRevealSection } from "../split-reveal";
import "./casing-pipes.css";

const IMG = "/sites/prayag/theme/casing-pipes";
const BANNER = "/sites/prayag/files/styles";

// Theme behaviour `ngpFeatureSlider` (the source page has no inline slider script).
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

const features = [
  {
    icon: <RustProofIcon />,
    label: "100% Rust-Proof & Chemical Resistant",
    text: "Resistant to chemicals and minerals found in groundwater, ensuring a contamination-free supply.",
  },
  {
    icon: <DurabilityIcon />,
    label: "Superior Durability",
    text: "Advanced additives ensure the pipes do not crack or break during handling or installation, even in tough rocky terrains.",
  },
  {
    icon: <LoadCapacityIcon />,
    label: "Massive Load Capacity",
    text: "Features specially designed threads capable of withstanding massive vertical loads, keeping the pipe string intact at great depths.",
  },
  {
    icon: <HealthSafetyIcon />,
    label: "Health & Safety",
    text: "The uPVC material is non-toxic and lead-free, guaranteeing that drinking water quality is never compromised.",
  },
  {
    icon: <MaintenanceFreeIcon />,
    label: "Maintenance Free",
    text: "Once installed, these pipes require zero maintenance and offer a service life exceeding 25 years.",
  },
];

// Source alt texts are copy-pasted from another page; kept verbatim.
const applications = [
  { image: "Domestic-Tube-Well.webp", alt: "Manufacturing plants", title: "Domestic and Urban Tube Wells" },
  { image: "Deep-Borewell.webp", alt: "Food processing units", title: "Deep Borewell Systems" },
  { image: "Industrial-and-Mining-Applications.webp", alt: "Automotive operations", title: "Industrial and Mining Applications" },
  { image: "Agricultural-Irrigation-Systems.webp", alt: "Healthcare infrastructure", title: "Agricultural Irrigation Systems" },
  { image: "Waste-Water-Disposal-Drainage.webp", alt: "High-rise residential towers", title: "Waste Water Disposal & Drainage" },
];

const advantages = [
  "Strong Borewell Support",
  "High Water Yield",
  "Corrosion Resistant",
  "Durable Performance",
  "Easy Installation",
  "Reliable Pump Protection",
  "Application-Specific Range",
  "Available in Ribbed Medium Well Screen and Medium Well Casing",
];

const markProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  strokeWidth: "1.8",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  stroke: "currentColor",
} as const;

const fittings: Fitting[] = [
  {
    line: "rms",
    name: "Ribbed Medium Well Screen (RMS)",
    sub: "Best for Water intake and filtration",
    mark: (
      <svg {...markProps}>
        <path d="M12 2C8 2 5 5 5 8c0 5 7 14 7 14s7-9 7-14c0-3-3-6-7-6z" />
        <circle cx="12" cy="8" r="2" />
      </svg>
    ),
    intro: "Specially designed for installation in water-bearing strata, where efficient groundwater intake is essential.",
    points: [
      "Allows groundwater to flow smoothly into the borewell.",
      "Precision slots help filter out sand and silt.",
      "Ribbed design provides additional strength.",
      "Improves water yield and protects pumps from sediment.",
    ],
  },
  {
    line: "cm",
    name: "Medium Well Casing (CM)",
    sub: "Best for Borewell protection and structural support",
    mark: (
      <svg {...markProps}>
        <rect x="4" y="2" width="16" height="20" rx="2" />
        <line x1="8" y1="7" x2="16" y2="7" />
        <line x1="8" y1="11" x2="16" y2="11" />
        <line x1="8" y1="15" x2="13" y2="15" />
      </svg>
    ),
    intro: "Engineered to provide dependable structural support for medium-depth borewells up to 250 metres.",
    points: [
      "Prevents borewell walls from collapsing.",
      "Creates a strong and stable lining for the borewell.",
      "Corrosion and rust resistant for long service life.",
      "Lightweight, durable, and easy to install.",
      "Ideal for medium-depth borewells up to 250 metres.",
    ],
  },
];

// FAQ answers keep the source's `<p></p><p class="MsoNormal"><span lang="EN-IN">…</span></p><p></p>`
// shape (empty paragraphs included). Links to cloned routes are local; the rest stay absolute.
const faqs: { q: string; a: React.ReactNode }[][] = [
  [
    {
      q: "1. What are casing pipes used for?",
      a: (
        <>
          Casing pipes are used to support and protect borewells and tube wells from surrounding soil pressure and
          harsh underground conditions. Prayag Casing Pipes are designed for applications such as domestic and urban
          tube wells, deep borewell systems, <a href="https://prayagindia.com/agri-pipe">agricultural irrigation</a>,
          industrial and mining projects, and wastewater disposal systems.
        </>
      ),
    },
    {
      q: "2. What are Prayag Casing Pipes made from?",
      a: (
        <>
          Prayag Casing Pipes are manufactured using high-quality{" "}
          <a href="https://prayagindia.com/upvc-pipes">uPVC compounds</a>. The material is designed to resist
          underground pressure, corrosion, chemical exposure, and demanding terrain conditions, making the pipes
          suitable for long-term borewell installations.
        </>
      ),
    },
    {
      q: "3. Why are uPVC casing pipes suitable for borewells?",
      a: (
        <>
          <Link href="/upvc-vs-cpvc-vs-ppr-pipes-which-one-best-your-project">uPVC casing pipes</Link> are well suited
          to borewells because they do not rust and offer strong resistance to corrosion and chemicals commonly found
          in soil and groundwater. Their durable construction also helps them withstand soil pressure and demanding
          underground conditions.
        </>
      ),
    },
    {
      q: "4. Can Prayag Casing Pipes be used for deep borewells?",
      a: (
        <>
          Yes. Prayag Casing Pipes are designed for borewell applications, including deep installations. Their strong
          construction and <Link href="/upvc-column-pipes">threaded connections</Link> are designed to handle the
          loads encountered at greater depths.
        </>
      ),
    },
    {
      q: "5. What is the difference between RMS and CM casing pipes?",
      a: "Ribbed Medium Well Screen (RMS) pipes are designed for water-bearing strata and feature horizontal ribs and vertical slots that help filter water entering the borewell. Medium Well Casing (CM) pipes are designed primarily to provide structural support in medium-depth wells and can be used for wells up to 250 metres deep.",
    },
    {
      q: "6. How do RMS casing pipes help with water filtration?",
      a: "Prayag Ribbed Medium Well Screen pipes use horizontal ribs and vertical slots to allow groundwater to enter while supporting effective filtration. This design makes them particularly suitable for sections of a borewell located within water-bearing strata.",
    },
    {
      q: "7. Are Prayag Casing Pipes resistant to corrosion?",
      a: (
        <>
          Yes. Prayag uPVC Casing Pipes are{" "}
          <Link href="/how-select-durable-pipes-fittings-long-term-use">resistant to rust, corrosion, and chemical erosion</Link>
          . Unlike traditional metal pipes, uPVC does not rust when exposed to groundwater or underground environments.
        </>
      ),
    },
    {
      q: "8. Are Prayag Casing Pipes safe for water applications?",
      a: "Prayag states that its casing pipes are manufactured using non-toxic, lead-free uPVC. This helps maintain water quality while providing a durable solution for borewell and groundwater applications.",
    },
  ],
  [
    {
      q: "9. What sizes are available in Prayag Casing Pipes?",
      a: (
        <>
          The product specifications listed by Prayag include{" "}
          <a href="https://prayagindia.com/pipes-fittings">casing pipe sizes</a> ranging from 40 mm to 200 mm.
          Available sizes include 40 mm, 50 mm, 80 mm, 100 mm, 115 mm, 125 mm, 150 mm, 175 mm, and 200 mm.
        </>
      ),
    },
    {
      q: "10. How long do Prayag Casing Pipes last?",
      a: "According to Prayag, its uPVC Casing Pipes are designed to provide a service life of more than 25 years when used appropriately. Their resistance to rust, corrosion, groundwater chemicals, and scaling contributes to their long-term performance.",
    },
    {
      q: "11. Do uPVC casing pipes require regular maintenance?",
      a: "Prayag Casing Pipes are designed as a low-maintenance solution. Because uPVC does not rust or corrode like conventional metal pipes, the pipes can reduce maintenance requirements over the life of a borewell installation.",
    },
    {
      q: "12. Can Prayag Casing Pipes be used for agricultural borewells?",
      a: "Yes. Agricultural irrigation systems are one of the applications listed for Prayag Casing Pipes. They can be used in borewell and groundwater installations created to support agricultural water supply and irrigation requirements.",
    },
    {
      q: "13. Can casing pipes be used in industrial and mining applications?",
      a: "Yes. Prayag lists industrial and mining applications among the intended uses of its casing pipes. Their resistance to corrosion, underground chemicals, and demanding terrain conditions makes them suitable for a range of underground water and borewell systems.",
    },
    {
      q: "14. How does the smooth inner surface of uPVC casing pipes help?",
      a: "The smooth interior of Prayag Casing Pipes helps reduce friction and scaling inside the pipe. This supports smoother water movement and helps maintain the efficiency of the borewell system over extended periods.",
    },
    {
      q: "15. How do I choose the right casing pipe for my borewell?",
      a: (
        <>
          The appropriate casing pipe depends on factors such as borewell depth, pipe diameter, soil conditions,
          water-bearing strata, and the intended application. RMS pipes may be selected for water-bearing sections
          where filtration is required, while CM casing pipes are designed for structural support in medium-depth
          wells. A qualified borewell or installation professional should determine the{" "}
          <Link href="/plumbers-guide-choosing-right-pipe-different-plumbing-points">
            correct pipe size and configuration
          </Link>{" "}
          for the site.
        </>
      ),
    },
  ],
];

/** https://prayagindia.com/casing-pipes (taxonomy term 214), content between header and footer. */
export function CasingPipesPage() {
  return (
    <PcatPage slug="casing-pipes">
      <div className="breadcrumb_main">
        <div className="container-fluid p-0">
          <div className="row">
            <div className="col-md-6">
              {/* eslint-disable-next-line @next/next/no-img-element -- source responsive banner (srcset/sizes), kept 1:1 */}
              <img
                src={`${BANNER}/medium/public/2026-08/Casing-pipe-banner.webp`}
                srcSet={[
                  `${BANNER}/thumbnail/public/2026-08/Casing-pipe-banner.webp 300w`,
                  `${BANNER}/thumbnail/public/2026-08/Casing-pipe-banner.webp 600w`,
                  `${BANNER}/large/public/2026-08/Casing-pipe-banner.webp 1200w`,
                  `${BANNER}/wide/public/2026-08/Casing-pipe-banner.webp 2000w`,
                ].join(", ")}
                sizes="(max-width: 300px) 300px, (max-width: 600px) 600px, (max-width: 1200px) 1200px, 2000px"
                alt="Casing Pipes"
                width={800}
                height={450}
                className="img-fluid"
                decoding="async"
              />
            </div>
            <div className="col-md-6">
              <div className="breadcrumb_title">
                <h1 className="black_title">Casing Pipes</h1>
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
                <h2>The Ultimate Shield for Your Borewells </h2>
                <p className="prayag-subtitle">Designed for strength, built for longevity. </p>
                <p>
                  Prayag Casing Pipes are manufactured using high-quality uPVC compounds, specifically designed to
                  withstand the harsh underground conditions of Indian terrains. Unlike traditional metal pipes, these
                  uPVC solutions are immune to corrosion and chemical erosion, ensuring your borewell remains
                  functional for decades.
                </p>
              </div>
            </div>
            <div className="col-12 col-md-6 p-0">
              {/* eslint-disable-next-line @next/next/no-img-element -- intrinsic sizing as on the source */}
              <img src={`${IMG}/The_Ultimate_Shield_for_Your_borewells.webp`} alt="Prayag Pipe" className="prayag-pipe-img" />
            </div>
          </div>
        </div>
      </section>

      <section className="ngp-section" style={{ background: "#1a1a1a", padding: "60px 0" }}>
        <div className="container-fluid">
          <h2 className="text-center" style={{ color: "#fff" }}>
            Why Choose <strong>Prayag uPVC Casing</strong> Pipes?
          </h2>
          <SlickCarousel
            settings={featureSlider}
            className="ngp-features-slider"
            style={{ color: "#fff" }}
            aria-label="Why choose Prayag uPVC Casing Pipes"
          >
            {features.map((f) => (
              <div key={f.label} className="ngp-feature-item">
                <div className="ngp-icon-circle">{f.icon}</div>
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
                <img className="msf-image" src={`${IMG}/Big_banner_casing.webp`} alt="casing Pipes" />
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
              <img className="psr-image" src={`${IMG}/Lead-Free-uPVC-Casing-Pipes.webp`} alt="Premium Bathroom Basin" />
            </div>
          </div>
          <div className="psr-content-col">
            <div className="psr-content">
              <p style={{ fontWeight: 800 }}>High-Strength Rising Main Solution for Borewell Applications</p>
              <h2>Lead-Free uPVC Casing Pipes</h2>
              <p className="psr-description">
                Prayag Casing Pipes are high-performance uPVC pipes designed to provide structural support and
                long-term protection to borewells. Installed as the outer lining of the borewell, they stabilize the
                borehole walls, prevent soil collapse, and protect the well from the ingress of sand, silt, and other
                external contaminants. Their robust construction ensures a secure and reliable borewell system, even in
                challenging ground conditions.
              </p>
              <p className="psr-description">
                Engineered for exceptional strength, corrosion resistance, and durability, Prayag Casing Pipes deliver
                dependable performance throughout the life of the borewell. They create a stable passage for the
                installation of column pipes and pumping systems while maintaining the integrity of the borewell
                structure. To meet varying geological conditions and application requirements, Prayag Casing Pipes are
                available in multiple variants, each designed for specific installation needs.
              </p>
              <a href="#advantge" className="prayag-btn">
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

      <section className="ka-applications pt-0">
        <div className="container-fluid">
          <h2 className="ka-title">Applications</h2>
          <div className="ka-grid">
            {applications.map((a) => (
              <div key={a.title} className="ka-card">
                <div className="ka-image">
                  {/* eslint-disable-next-line @next/next/no-img-element -- intrinsic sizing as on the source */}
                  <img src={`${IMG}/${a.image}`} alt={a.alt} />
                </div>
                <div className="ka-card-body">
                  <h3>{a.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="prayag-work-section">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-lg-6 col-md-12 p-0">
              <div className="visual-wrapper">
                {/* eslint-disable-next-line @next/next/no-img-element -- intrinsic sizing as on the source */}
                <img
                  src={`${IMG}/The-Prayag-Advantage.webp`}
                  alt="Prayag Composite Pipe engineering advantage"
                  className="img-fluid main-img"
                />
              </div>
            </div>
            <div className="col-lg-6 col-md-12 p-0">
              <div className="prayag_work_content">
                <h2>The Prayag Advantage</h2>
                <ul className="advantages_list">
                  {advantages.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <p>
                  Choose Prayag Lead-Free uPVC Casing Pipes for dependable borewell performance, superior strength, and
                  long-lasting water delivery solutions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FittingTiles fittings={fittings} />

      <section className="faq_main pt-0">
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

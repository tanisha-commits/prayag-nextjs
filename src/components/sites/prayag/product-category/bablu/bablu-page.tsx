import { PcatPage } from "../pcat-page";
import { BabluReveal } from "./bablu-reveal";

const FILES = "/sites/prayag/files/2026-10";

// Source images are /media/<id> links; the local copies are the identical backup files.
const features = [
  {
    image: `${FILES}/redeem.webp`,
    alt: "My Loyalty Points screen – PRAYAG Ka Bablu App",
    icon: "＋",
    title: "Earn Loyalty Points",
    text: "every time you recommend PRAYAG products.",
  },
  {
    image: `${FILES}/language.webp`,
    alt: "Choose your language screen – PRAYAG Ka Bablu App",
    icon: "अ",
    title: "Available in multiple languages",
    text: "for a seamless experience.",
    featured: true,
  },
  {
    image: `${FILES}/transaction.webp`,
    alt: "Track and Redeem screen – PRAYAG Ka Bablu App",
    icon: "✓",
    title: "Simple point tracking and redemption,",
    text: "right from your phone.",
  },
];

const guides = [
  { label: "ENGLISH", href: `${FILES}/Prayag_Ka_Bablu_App_Install_Guide.pdf`, primary: true },
  { label: "HINDI", href: `${FILES}/Prayag_Ka_Bablu_App_Install_Guide_Hindi.pdf` },
];

/** PRAYAG KA BABLU plumbers' loyalty programme (source basic page; styles live in the theme CSS). */
export function BabluPage() {
  return (
    <PcatPage slug="prayag-ka-bablu-plumbers-loyalty-program">
      <div className="breadcrumb_main">
        <div className="container-fluid p-0 m-0">
          <div className="row">
            <div className="col-md-6">
              <div className="breadcrumb_image">
                {/* eslint-disable-next-line @next/next/no-img-element -- banner keeps the source's natural ratio */}
                <img src={`${FILES}/Prayag-Bablu-banner.webp`} alt="" fetchPriority="high" />
              </div>
            </div>
            <div className="col-md-6">
              <div className="breadcrumb_title">
                <h1 className="black_title">PRAYAG KA BABLU Plumbers’ Loyalty Program</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
      <BabluReveal>
        <section className="intro section-pad">
          <div className="shell intro-grid">
            <div className="intro-copy reveal">
              <h2>
                Earn More. Recommend More.
                <br />
                Grow With PRAYAG.
              </h2>
              <p className="lead">
                PRAYAG Ka Bablu App rewards plumbers for recommending and using PRAYAG products — with a simple,
                multi-language experience designed for ease of use.
              </p>
            </div>
            <div className="stats" aria-label="Programme statistics">
              <article className="stat-card reveal">
                <div className="stat-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d="M7 3v3M17 3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" />
                  </svg>
                </div>
                <div>
                  <strong>10+</strong>
                  <span>Years</span>
                </div>
              </article>
              <article className="stat-card reveal">
                <div className="stat-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d="M4 8h16v11H4zM3 8h18M12 8v11M12 8H7.5A2.5 2.5 0 0 1 10 4c1.4 0 2 1.5 2 4Zm0 0h4.5A2.5 2.5 0 0 0 14 4c-1.4 0-2 1.5-2 4Z" />
                  </svg>
                </div>
                <div>
                  <strong>5 Lakhs+</strong>
                  <span>Redeemed</span>
                </div>
              </article>
            </div>
          </div>
        </section>
        <section className="benefits section-pad" aria-labelledby="benefits-title">
          <div className="shell">
            <div className="section-heading reveal">
              <h2 id="benefits-title">Why Join PRAYAG Ka Bablu App?</h2>
            </div>
            <div className="journey-line" aria-hidden="true" />
            <div className="feature-grid">
              {features.map((f) => (
                <article key={f.title} className={f.featured ? "feature-card reveal featured" : "feature-card reveal"}>
                  <div className="phone-stage">
                    <span className="orbit" />
                    {/* eslint-disable-next-line @next/next/no-img-element -- source intrinsic sizing kept 1:1 */}
                    <img src={f.image} alt={f.alt} loading="lazy" />
                  </div>
                  <div className="feature-copy">
                    {/* Decorative glyph; the heading carries the meaning. */}
                    <div className="feature-icon" aria-hidden="true">
                      {f.icon}
                    </div>
                    <div>
                      <h3>{f.title}</h3>
                      <p>{f.text}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section className="install section-pad" aria-labelledby="install-title">
          <div className="shell">
            <div className="install-panel reveal">
              <div className="install-copy">
                <h2 id="install-title">
                  How To Install
                  <br />
                  PRAYAG Ka Bablu App?
                </h2>
                <p>Find Here 👉</p>
              </div>
              <div className="language-area">
                <div className="language-grid">
                  {guides.map((g) => (
                    <a
                      key={g.label}
                      href={g.href}
                      className={g.primary ? "guide-card primary" : "guide-card"}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${g.label} install guide (PDF, opens in a new tab)`}
                    >
                      <span className="play" aria-hidden="true">
                        ▶
                      </span>
                      <span>
                        <b>{g.label}</b>
                      </span>
                      <i aria-hidden="true">↗</i>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="partnership" aria-labelledby="partnership-title">
          <div className="shell partnership-grid">
            <div className="bablu-visual reveal">
              <span className="visual-disc" />
              {/* eslint-disable-next-line @next/next/no-img-element -- source intrinsic sizing kept 1:1 */}
              <img
                src={`${FILES}/partnership.webp`}
                alt="PRAYAG Ka Bablu partnership between a plumber and support representative"
                loading="lazy"
              />
            </div>
            <div className="partnership-copy reveal">
              <p className="eyebrow">PRAYAG KA BABLU is more than an app.</p>
              <h2 id="partnership-title">
                It is a<br />
                <span>partnership.</span>
              </h2>
              <p className="partnership-lead">A shared journey of growth. A smarter way to grow with Prayag.</p>
              <span className="blue-rule" />
              <p className="support-intro">For more information, connect with our Support Team:</p>
              <a className="support-bar" href="tel:18002570304">
                <span className="call-icon" aria-hidden="true">
                  ☎
                </span>
                <span>
                  <b>1800 257 0304</b>
                </span>
                <i aria-hidden="true">→</i>
              </a>
            </div>
          </div>
        </section>
      </BabluReveal>
    </PcatPage>
  );
}

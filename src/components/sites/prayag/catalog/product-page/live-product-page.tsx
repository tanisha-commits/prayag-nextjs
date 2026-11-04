import Link from "next/link";
import type { publicProduct } from "@/lib/catalog/public";
import { SITE_URL } from "@/components/sites/prayag/seo";
import { responsiveImg } from "@/components/sites/prayag/responsive-image";
import { ProductBehaviours } from "./product-behaviours";
import "./product-base.css";
import "./product-fixes.css";
import { withBasePath } from "@/lib/base-path";
import { storedHtml } from "@/lib/stored-html";
import { img as dimImg, responsiveImagesHtml } from "@/lib/image-dimensions";

type Product = NonNullable<ReturnType<typeof publicProduct>>;

const WARRANTY_PDF = "/sites/prayag/files/2024-09/Warranty_Policy.pdf";

type Family = "faucet" | "accessory" | "ceramic" | "pipe" | "heater" | "tank" | "default";

const GUIDE: Record<Family, { care: string; install: string }> = {
  faucet: {
    care: "Wipe with a soft damp cloth and mild soap. Avoid abrasive pads, acids and strong chemical cleaners.",
    install: "Close the water supply before fitting. Wrap thread seal tape on the threads, tighten by hand and finish with a light turn of the wrench so the body is not damaged.",
  },
  accessory: {
    care: "Wipe with a soft damp cloth and mild soap. Avoid abrasive pads and strong chemical cleaners to keep the finish glossy.",
    install: "Mark the position with a spirit level, drill the wall, insert the wall plugs and fix the product with the supplied screws.",
  },
  ceramic: {
    care: "Clean with a mild cleaner and a soft brush. Avoid strong acids and abrasive powders.",
    install: "Fix on a level surface, align the trap and water connection, and seal with sanitary silicone. Installation by a trained plumber is recommended.",
  },
  pipe: {
    care: "Pipes need no regular maintenance. Store them away from direct heat and sharp objects.",
    install: "Cut the pipe square, clean and deburr the ends, then join with the recommended solvent cement or fitting. Let the joint cure before pressurising the line.",
  },
  heater: {
    care: "Switch off the power before cleaning. Wipe the casing with a damp cloth and service the unit from time to time.",
    install: "Installation by a qualified electrician and plumber is recommended. Follow the instruction manual supplied with the product.",
  },
  tank: {
    care: "Clean the tank from time to time with water and a soft brush. Keep the lid closed.",
    install: "Place the tank on a flat, load bearing platform. Connect the inlet, outlet and overflow lines before filling.",
  },
  default: {
    care: "Clean with a soft cloth and mild soap. Avoid abrasive pads and harsh chemical cleaners.",
    install: "Follow the instructions supplied with the product, or ask a trained plumber to install it.",
  },
};

function family(categorySlug: string | undefined): Family {
  const s = categorySlug ?? "";
  if (s === "bathroom-accessories" || s.endsWith("/accessories")) return "accessory";
  if (s.startsWith("faucets") || s.startsWith("ptmt-taps") || s.endsWith("/shower")) return "faucet";
  if (s.startsWith("ceramicware")) return "ceramic";
  if (s.startsWith("pipes-fittings") || s.startsWith("plumbing-solutions")) return "pipe";
  if (s.startsWith("water-heaters")) return "heater";
  if (s.startsWith("storage-tank")) return "tank";
  return "default";
}

const Arrow = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const shareIcon = (children: React.ReactNode) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);

const supportIcon = (children: React.ReactNode) => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);

/* eslint-disable @next/next/no-img-element -- source <img> markup kept 1:1 under the scoped theme CSS */
export function LiveProductPage({ product }: { product: Product }) {
  const category = product.categories[0];
  const colours = product.attributes.filter((a) => a.key === "colour" && a.value.trim());
  const colourList = colours.map((c) => c.value).join(", ");
  const apps = product.applications;
  const enquire = `/contact-us?product=${encodeURIComponent(product.title)}`;
  const url = `${SITE_URL}/${product.slug}`;
  const guide = GUIDE[family(category?.slug)];
  const highlights = product.highlights.slice(0, 3).map((h) => h.text.toLowerCase());
  const main = product.images[0];
  const hasSpecs = Boolean(product.specsHtml?.trim());
  const hasSizes = Boolean(product.sizesHtml?.trim());
  const tabs = [
    { id: "desc", label: "Description", title: "Product Description" },
    { id: "specs", label: "Specifications", title: "Product Specifications" },
    ...(hasSizes ? [{ id: "sizes", label: "Available Sizes", title: "Available Sizes" }] : []),
  ];
  const faqs = [
    ...(colours.length ? [[`Which colours is ${product.title} available in?`, `It is available in ${colourList}. Please send an enquiry to confirm current availability.`]] : []),
    ...(apps.length ? [[`Where can I use ${product.title}?`, `${product.title} is suited for ${apps.join(", ").toLowerCase()} applications.`]] : []),
    ...(product.features.length ? [[`What are the key features of ${product.title}?`, `${product.features.join(", ")}.`]] : []),
    ...(product.itemCode ? [[`What is the item code of ${product.title}?`, `The item code is ${product.itemCode}. Please quote it when you contact Prayag about this product.`]] : []),
    [`How can I buy ${product.title}?`, "Click Enquire Now on this page or visit the Contact Us page. The Prayag team will get back to you with product and dealer information."],
    [`Does ${product.title} come with a warranty?`, "Prayag products are covered by the terms given in the Warranty Policy. You can read it under Downloads and Support on this page."],
  ];

  return (
    <div className="pcat-product">
      <ProductBehaviours />
      <div className="pp">
        <div className="pp-crumbbar">
          <div className="container-fluid">
            <nav className="pp-breadcrumb" aria-label="Breadcrumb">
              <ol>
                <li>
                  <Link href="/">Home</Link>
                </li>
                {category && (
                  <li>
                    <span>{category.name}</span>
                  </li>
                )}
                <li aria-current="page">
                  <span>{product.title}</span>
                </li>
              </ol>
            </nav>
          </div>
        </div>

        <section className="pp-top">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-6">
                <div className="pp-gallery" data-pp-gallery="">
                  {product.images.length > 0 && (
                    <div className="pp-gallery__thumbs" aria-label="Product images">
                      {product.images.map((img, i) => (
                        <button
                          key={img.src}
                          type="button"
                          className={`pp-thumb${i === 0 ? " is-active" : ""}`}
                          data-pp-thumb=""
                          data-src={responsiveImg(img.src, 1200, "").src}
                          data-srcset={responsiveImg(img.src, 1200, "").srcSet}
                          data-alt={img.alt}
                          aria-label={`Show image ${i + 1} of ${product.images.length}`}
                          aria-current={i === 0 ? "true" : undefined}
                        >
                          <img {...dimImg(img.src, "84px")} alt="" width={84} height={84} loading="lazy" />
                        </button>
                      ))}
                    </div>
                  )}
                  <div className="pp-gallery__main">
                    {main && (
                      <img
                        className="pp-gallery__img"
                        data-pp-main=""
                        {...responsiveImg(main.src, 1200, "(min-width: 992px) 40vw, 100vw")}
                        alt={main.alt || product.title}
                        width={800}
                        height={800}
                        fetchPriority="high"
                      />
                    )}
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="pp-info">
                  <div className="pp-tags">
                    {product.status !== "published" && <span className="pp-tag">DRAFT — LOCAL PREVIEW</span>}
                    {category && <span className="pp-tag">{category.name}</span>}
                    {product.itemCode && (
                      <span className="pp-tag pp-tag--code">
                        Item Code <b>{product.itemCode}</b>
                      </span>
                    )}
                  </div>
                  <h1 className="pp-title">{product.title}</h1>
                  {product.shortDescription && <p className="pp-short">{product.shortDescription}</p>}
                  {colours.length > 0 && (
                    <div className="pp-colors">
                      <h2 className="pp-h3">Colours</h2>
                      <ul className="pp-swatches">
                        {colours.map((c) => (
                          <li key={c.value} className={c.hex ? "has-sw" : undefined}>
                            {c.hex && <span className="pp-swatch" style={{ background: c.hex }} aria-hidden="true" />}
                            {c.value}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {product.highlights.length > 0 && (
                    <div className="pp-block">
                      <h2 className="pp-h3">Product Highlights</h2>
                      <ul className="pp-hl">
                        {product.highlights.map((h) => (
                          <li key={h.text} className="pp-hl__item">
                            <span className="pp-hl__icon">{h.icon && <img src={withBasePath(h.icon)} alt="" width={40} height={40} loading="lazy" />}</span>
                            <span>{h.text}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {product.features.length > 0 && (
                    <div className="pp-block">
                      <h2 className="pp-h3">Key Features</h2>
                      <ul className="pp-checks pp-checks--cols">
                        {product.features.map((f, i) => (
                          <li key={i}>{f}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="pp-actions">
                    <a className="pp-btn pp-btn--lg" href={withBasePath(enquire)}>
                      Enquire Now
                      <Arrow size={18} />
                    </a>
                  </div>
                  <div className="pp-share">
                    <span className="pp-share__label">Share</span>
                    <ul>
                      <li>
                        <a href={withBasePath(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`)} target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook">
                          {shareIcon(<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />)}
                        </a>
                      </li>
                      <li>
                        <a href={withBasePath(`https://wa.me/?text=${encodeURIComponent(`${product.title} ${url}`)}`)} target="_blank" rel="noopener noreferrer" aria-label="Share on WhatsApp">
                          {shareIcon(<path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 21l2.1-5.4A8.4 8.4 0 1 1 21 11.5z" />)}
                        </a>
                      </li>
                      <li>
                        <a href={withBasePath(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`)} target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn">
                          {shareIcon(
                            <>
                              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                              <rect x="2" y="9" width="4" height="12" />
                              <circle cx="4" cy="4" r="2" />
                            </>,
                          )}
                        </a>
                      </li>
                      <li>
                        <button type="button" data-pp-copy="" data-url={url} aria-label="Copy link">
                          {shareIcon(<path d="M10 13a5 5 0 0 0 7.1 0l3-3a5 5 0 0 0-7.1-7.1l-1.7 1.7M14 11a5 5 0 0 0-7.1 0l-3 3A5 5 0 0 0 11 21l1.7-1.7" />)}
                        </button>
                      </li>
                    </ul>
                    <span className="pp-share__status" data-pp-copy-status="" role="status" aria-live="polite" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="pp-section pp-tabs is-ready" data-pp-tabs="">
          <div className="container-fluid">
            <div className="pp-tablist" role="tablist" aria-label="Product information">
              {tabs.map((t, i) => (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  className="pp-tab"
                  id={`pp-tab-${t.id}`}
                  data-pp-tab={`pp-panel-${t.id}`}
                  aria-controls={`pp-panel-${t.id}`}
                  aria-selected={i === 0 ? "true" : "false"}
                  tabIndex={i === 0 ? 0 : -1}
                >
                  {t.label}
                </button>
              ))}
            </div>
            {tabs.map((t, i) => (
              <div key={t.id} className="pp-panel" role="tabpanel" aria-labelledby={`pp-tab-${t.id}`} id={`pp-panel-${t.id}`} hidden={i > 0}>
                <h2 className="pp-panel__title">{t.title}</h2>
                {t.id === "desc" && <div className="pp-rich" dangerouslySetInnerHTML={{ __html: storedHtml(responsiveImagesHtml(product.descriptionHtml ?? "")) }} />}
                {t.id === "specs" &&
                  (hasSpecs ? (
                    <div className="pp-rich" dangerouslySetInnerHTML={{ __html: storedHtml(responsiveImagesHtml(product.specsHtml ?? "")) }} />
                  ) : (
                    <div className="pp-rich">
                      <table>
                        <tbody>
                          {[
                            ["Item Code", product.itemCode],
                            ["Category", category?.name],
                            ["Available Colours", colourList],
                            ["Application", apps.join(", ")],
                            ["Brand", "Prayag"],
                          ]
                            .filter(([, v]) => v)
                            .map(([k, v]) => (
                              <tr key={k}>
                                <td>{k}</td>
                                <td>{v}</td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  ))}
                {t.id === "sizes" && <div className="pp-rich" dangerouslySetInnerHTML={{ __html: storedHtml(responsiveImagesHtml(product.sizesHtml ?? "")) }} />}
              </div>
            ))}
          </div>
        </section>

        {apps.length > 0 && (
          <section className="pp-section pp-apps-section" id="applications">
            <div className="container-fluid">
              <h2 className="pp-h2">Applications</h2>
              <ul className="pp-apps">
                {apps.map((a) => (
                  <li key={a} className="pp-app">
                    <span className="pp-app__icon">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <circle cx="12" cy="12" r="9" />
                        <path d="M8 12l3 3 5-6" />
                      </svg>
                    </span>
                    <span className="pp-app__label">{a}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        <section className="pp-section pp-support">
          <div className="container-fluid">
            <h2 className="pp-h2">Downloads &amp; Support</h2>
            <ul className="pp-support__grid">
              <li>
                <a className="pp-support__card" href={withBasePath(WARRANTY_PDF)} target="_blank" rel="noopener">
                  {supportIcon(
                    <>
                      <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" />
                      <path d="M9 12l2 2 4-4" />
                    </>,
                  )}
                  <span className="pp-support__title">Warranty Policy</span>
                  <span className="pp-support__text">Read the terms</span>
                </a>
              </li>
              <li>
                <Link className="pp-support__card" href="/product-video">
                  {supportIcon(
                    <>
                      <rect x="3" y="5" width="18" height="14" rx="3" />
                      <path d="M10 9.5v5l4.5-2.5z" />
                    </>,
                  )}
                  <span className="pp-support__title">Product Videos</span>
                  <span className="pp-support__text">Watch and learn</span>
                </Link>
              </li>
              <li>
                <a className="pp-support__card" href={withBasePath(enquire)}>
                  {supportIcon(<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" />)}
                  <span className="pp-support__title">Need Help?</span>
                  <span className="pp-support__text">Contact our team</span>
                </a>
              </li>
            </ul>
          </div>
        </section>

        <section className="pp-section pp-about">
          <div className="container-fluid">
            <div className="pp-about__grid">
              <div className="pp-about__text">
                <h2 className="pp-h2">About {product.title}</h2>
                <p className="pp-lead">
                  {category ? `${product.title} belongs to the ${category.name} range from Prayag` : `${product.title} is a Prayag product`}
                  {apps.length ? ` and is designed for ${apps.join(", ").toLowerCase()} use.` : "."}
                </p>
                {colours.length > 0 && <p>It is available in {colourList}.</p>}
                {highlights.length > 0 && <p>Highlights: {highlights.join(", ")}.</p>}
                <p>Interested in {product.title}? Send an enquiry and the Prayag team will share the details you need.</p>
                <a className="pp-btn" href={withBasePath(enquire)}>
                  Send an Enquiry
                </a>
              </div>
              <div className="pp-guide">
                <h3 className="pp-h3">Product guide</h3>
                <details className="pp-acc" open>
                  <summary>Care and cleaning</summary>
                  <div className="pp-acc__body">
                    <p>{guide.care}</p>
                  </div>
                </details>
                <details className="pp-acc">
                  <summary>Installation tips</summary>
                  <div className="pp-acc__body">
                    <p>{guide.install}</p>
                  </div>
                </details>
                <details className="pp-acc">
                  <summary>Warranty and support</summary>
                  <div className="pp-acc__body">
                    <p>
                      Read the{" "}
                      <a href={withBasePath(WARRANTY_PDF)} target="_blank" rel="noopener">
                        Prayag Warranty Policy
                      </a>{" "}
                      for terms and coverage. For help with this product, use the <a href={withBasePath(enquire)}>Contact Us</a> page.
                    </p>
                  </div>
                </details>
              </div>
            </div>
          </div>
        </section>

        <section className="pp-section pp-faq" id="faqs">
          <div className="container-fluid">
            <div className="pp-faq__grid">
              <div className="pp-faq__intro">
                <h2 className="pp-h2">Frequently asked questions</h2>
                <p>Quick answers about {product.title}. Cannot find what you need? Our team is happy to help.</p>
                <a className="pp-btn pp-btn--ghost" href={withBasePath(enquire)}>
                  Ask a question
                </a>
              </div>
              <div className="pp-faq__list">
                {faqs.map(([q, a], i) => (
                  <details key={q} open={i === 0}>
                    <summary>{q}</summary>
                    <div className="pp-faq__a">{a}</div>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>

        {product.related.length > 0 && (
          <section className="pp-section pp-related" data-pp-rel="">
            <div className="container-fluid">
              <div className="pp-related__head">
                <div>
                  <h2 className="pp-h2">Related Products</h2>
                  <p>More from the same range</p>
                </div>
                <div className="pp-related__nav">
                  <button type="button" className="pp-related__btn" data-pp-rel-prev="" aria-label="Previous products" disabled>
                    <span className="pp-arrow pp-arrow--l" aria-hidden="true" />
                  </button>
                  <button type="button" className="pp-related__btn" data-pp-rel-next="" aria-label="Next products">
                    <span className="pp-arrow pp-arrow--r" aria-hidden="true" />
                  </button>
                </div>
              </div>
              <div className="pp-related__track" data-pp-rel-track="">
                {product.related.map((r) => (
                  <a key={r.slug} className="pp-rel" href={withBasePath(`/${r.slug}`)}>
                    <span className="pp-rel__img">{r.image && <img {...dimImg(r.image, "auto, (min-width: 992px) 25vw, 50vw")} alt={r.title} width={320} height={320} loading="lazy" />}</span>
                    <span className="pp-rel__name">{r.title}</span>
                    <span className="pp-rel__cta">
                      View details <Arrow size={16} />
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}

        <div className="pp-sticky" aria-label="Quick actions">
          <a className="pp-btn" href={withBasePath(enquire)}>
            Enquire Now
          </a>
        </div>
      </div>
    </div>
  );
}

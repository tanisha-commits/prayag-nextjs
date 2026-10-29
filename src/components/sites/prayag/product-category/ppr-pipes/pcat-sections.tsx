import Link from "next/link";
import type { ReactNode } from "react";
import { SlickCarousel, type SlickSettings } from "../slick-carousel";
import type { FaqItem, Feature, FittingCard, FittingPane, ImageCard, RichText, SpecTableData } from "./types";

// Section markup shared by the PPR, SWR and Composite pipe pages. Class names, nesting and the
// source's inline styles are kept 1:1 because the ported page CSS targets them.

/** slick options of theme script.js `Drupal.behaviors.ngpFeatureSlider` (PPR and Composite pages). */
export const THEME_NGP_SLICK: SlickSettings = {
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

export function RichTextView({ text }: { text: RichText }) {
  return text.map((part, i) =>
    typeof part === "string" ? (
      part
    ) : part.href.startsWith("/") ? (
      <Link key={i} href={part.href}>
        {part.text}
      </Link>
    ) : (
      <a key={i} href={part.href}>
        {part.text}
      </a>
    ),
  );
}

/** Dark "Why Choose Prayag … Pipes?" band with the feature slider. */
export function NgpSection({
  heading,
  label,
  settings,
  children,
}: {
  heading: ReactNode;
  /** Accessible name for the carousel region (the source slider has none). */
  label: string;
  settings: SlickSettings;
  children: ReactNode;
}) {
  return (
    // Inline styles as on the source; they outrank the theme's .ngp-section rules.
    <section className="ngp-section" style={{ background: "#1a1a1a", padding: "60px 0" }}>
      <div className="container-fluid">
        <h2 className="text-center" style={{ color: "#fff" }}>
          {heading}
        </h2>
        <SlickCarousel settings={settings} className="ngp-features-slider" style={{ color: "#fff" }} aria-label={label}>
          {children}
        </SlickCarousel>
      </div>
    </section>
  );
}

// A plain element (not a component) so SlickCarousel's cloneElement puts its inline style on the <article>.
function fittingCard(card: FittingCard, width: number, height: number, key?: number) {
  return (
    <article key={key} className="cfs-card">
      <figure className="cfs-card__figure">
        {/* eslint-disable-next-line @next/next/no-img-element -- source card image, intrinsic size kept */}
        <img src={card.src} alt={card.alt} loading="lazy" width={width} height={height} className="cfs-card__img" />
      </figure>
      <div className="cfs-card__body">
        <h3 className="cfs-card__title">{card.title}</h3>
        <ul className="cfs-card__meta">
          {card.meta.map((row) => (
            <li key={row.label}>
              <strong>{row.label}</strong>
              {row.value}
            </li>
          ))}
          {card.emptyMetaItem && <li />}
        </ul>
      </div>
    </article>
  );
}

/** `.cfs-slider` of fitting cards. `wrapped`: the PPR source nests every card in a bare `<div>`. */
export function FittingSlider({
  pane,
  settings,
  width,
  height,
  wrapped = false,
}: {
  pane: FittingPane;
  settings: SlickSettings;
  width: number;
  height: number;
  wrapped?: boolean;
}) {
  return (
    <SlickCarousel settings={settings} className="cfs-slider js-cfs-slider" aria-label={pane.sliderLabel}>
      {pane.cards.map((card, i) =>
        wrapped ? <div key={i}>{fittingCard(card, width, height)}</div> : fittingCard(card, width, height, i),
      )}
    </SlickCarousel>
  );
}

export function SpecTable({ table }: { table: SpecTableData }) {
  return (
    <div className="prayag-specs__table-wrap">
      <table className="prayag-specs__table">
        <thead>
          <tr>
            {table.head.map((cell) => (
              <th key={cell}>{cell}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row) => (
            <tr key={row[0]}>
              {row.map((cell, i) => (
                <td key={i} data-label={table.head[i]}>
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

/**
 * "Faq's" block: questions 1–8 in the left column, the rest on the right. Each answer keeps the
 * source's empty paragraphs around `p.MsoNormal` (Drupal wrapped a pasted <p> in another <p>);
 * they add their margins to the layout.
 */
export function FaqSection({ className, items }: { className: string; items: FaqItem[] }) {
  const columns = [items.slice(0, 8), items.slice(8)];
  return (
    <section className={className}>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <div className="faq_sing_pro">
              <h2>Faq&apos;s</h2>
              <div className="row">
                {columns.map((column, c) => (
                  <div key={c} className="col-md-6 col-6">
                    {column.map((item) => (
                      <div key={item.question} className="faq_box">
                        <h3>{item.question}</h3>
                        <p />
                        <p className="MsoNormal">
                          <span lang="EN-IN">
                            <RichTextView text={item.answer} />
                          </span>
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
  );
}

/** `.ka-card`s of a "Where our pipes work" grid. */
export function KaCards({ items }: { items: ImageCard[] }) {
  return items.map((item) => (
    <div key={item.title} className="ka-card">
      <div className="ka-image">
        {/* eslint-disable-next-line @next/next/no-img-element -- source application image, intrinsic size kept */}
        <img src={item.src} alt={item.alt} />
      </div>
      <div className="ka-card-body">
        <h3>{item.title}</h3>
        <p>{item.text}</p>
      </div>
    </div>
  ));
}

/**
 * `.ngp-feature-item`s with image icons (PPR uses an <h3> label, Composite a <span>). Returns the
 * elements themselves (not a component) because SlickCarousel treats each child as one slide.
 */
export function featureItems(items: Feature[], Label: "h3" | "span") {
  return items.map((item) => (
    <div key={item.label} className="ngp-feature-item">
      <div className="ngp-icon-circle">
        {/* eslint-disable-next-line @next/next/no-img-element -- source icon, intrinsic size kept */}
        <img src={item.src} alt={item.alt} />
      </div>
      <Label className="ngp-feature-label">{item.label}</Label>
      <p className="ngp_para">{item.text}</p>
    </div>
  ));
}

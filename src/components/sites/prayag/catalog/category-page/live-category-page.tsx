import type { CSSProperties, ReactNode } from "react";
import pages from "@/content/prayag/catalog/category-pages.json";
import type { PublicListResult, SubcategoryNode } from "@/lib/catalog/public";
import { paramsFromQuery, type PublicQuery } from "@/lib/catalog/url";
import { LIVE_CATEGORY_PAGES, type LiveCategoryConfig } from "./config";
import { FilterForm, type FormGroup } from "./filter-form";
import { slugify } from "@/lib/catalog/normalize";
import "./catalog-base.css";
import "./catalog-plain-base.css";
import "./faucets.css";
import "./ptmt-taps.css";
import "./ceramicware.css";
import "./kitchen-sinks.css";
import "./bathroom-accessories.css";
import "./pipes-fittings.css";
import "./catalog-fixes.css";
import { withBasePath } from "@/lib/base-path";
import { storedHtml } from "@/lib/stored-html";
import { img, responsiveImagesHtml } from "@/lib/image-dimensions";

export interface LiveCategoryData {
  metaTitle: string;
  metaDescription: string;
  bannerHtml: string;
  sectionStyle: string;
  contentHtml: string;
  faqHtml: string;
  comingSoonHtml: string;
  tailHtml: string;
  liveOrder: string[];
}

export const LIVE_CATEGORY_DATA = pages as Record<string, LiveCategoryData>;
export const LIVE_PAGE_SIZE = 9;

type Item = PublicListResult["items"][number];

const DRAFT_STYLE: CSSProperties = {
  display: "inline-block",
  marginBottom: 6,
  padding: "0 8px",
  borderRadius: 9,
  background: "#fff4e5",
  color: "#b45309",
  fontSize: 11,
  fontWeight: 600,
};
const draft = (p: Item) => p.status !== "published" && <span style={DRAFT_STYLE}>DRAFT — LOCAL PREVIEW</span>;

const css = (s: string): CSSProperties =>
  Object.fromEntries(
    s
      .split(";")
      .filter((d) => d.includes(":"))
      .map((d) => {
        const i = d.indexOf(":");
        const [k, v] = [d.slice(0, i), d.slice(i + 1)];
        return [k.trim().replace(/-([a-z])/g, (_, c: string) => c.toUpperCase()), v.trim()];
      }),
  );

const CARD_SIZES = "auto, (min-width: 768px) 25vw, 50vw";

function Card({ p, swatches }: { p: Item; swatches: LiveCategoryConfig["swatches"] }) {
  const colours = (p.attributes ?? []).filter((a) => a.key === "colour" && a.value.trim());
  return (
    <div className="col-6 col-sm-6 col-md-4">
      <a href={withBasePath(`/${p.slug}`)}>
        <div className="product_p_box">
          <div className="pro_p_img">
            <div className="views-field views-field-field-products-data">
              <div className="field-content">
                <div className="paragraph paragraph--type--products-data-wrapper paragraph--view-mode--default">
                  <div className="field field--name-field-product-image field--type-entity-reference field--label-above">
                    <div className="field__label">Product Image</div>
                    <div className="field__item">
                      <div className="media media--type-image media--view-mode-default">
                        <div className="field field--name-field-media-image field--type-image field--label-visually_hidden">
                          <div className="field__label visually-hidden">Image</div>
                          <div className="field__item">
                            {/* eslint-disable-next-line @next/next/no-img-element -- source <img> kept 1:1 */}
                            {p.image && <img loading="lazy" {...img(p.image, CARD_SIZES)} width={800} height={800} alt={p.title} />}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="views-field views-field-field-cp-color">
              <div className="field-content">{colours.map((c) => c.value).join(", ")}</div>
            </div>
          </div>
          {draft(p)}
          <h6>{p.title}</h6>
          {swatches === "dots" && (
            <div className="color-options">
              {colours.map((c) => (
                <span key={c.value} title={c.value} style={c.hex ? { backgroundColor: c.hex } : undefined} />
              ))}
            </div>
          )}
          {swatches === "radio" && colours.length > 0 && (
            <div className="color-options">
              {colours.map((c) => (
                <div key={c.value} className="color-radio">
                  <label>
                    <input type="radio" name={`color_${p.publicId}`} value={c.value} />
                    <span className="color-circle" style={c.hex ? { backgroundColor: c.hex } : undefined} title={c.value} />
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
      </a>
    </div>
  );
}

function PlainCard({ p }: { p: Item }) {
  return (
    <div className="col-6 col-sm-6 col-md-4" style={{ display: "block" }}>
      <a href={withBasePath(`/${p.slug}`)}>
        <div className="product_p_box">
          <div className="pro_p_img">
            {/* eslint-disable-next-line @next/next/no-img-element -- source <img> kept 1:1 */}
            {p.image && <img {...img(p.image, CARD_SIZES)} alt={p.title} />}
          </div>
          {draft(p)}
          <h6>{p.title}</h6>
        </div>
      </a>
    </div>
  );
}

const PREV = (
  <path d="M1.11201 7.19126L9.41183 1.15503C10.0728 0.674329 11 1.14648 11 1.96377V14.0362C11 14.8535 10.0728 15.3257 9.41183 14.845L1.11201 8.80874C0.562908 8.40939 0.562907 7.59061 1.11201 7.19126Z" />
);
const FIRST = <path d="M5.1,7.2l8.3-6C14.1,0.7,15,1.1,15,2V14c0,0.8-0.9,1.3-1.6,0.8l-8.3-6C4.6,8.4,4.6,7.6,5.1,7.2z M0,0h2v16H0V0z" />;

function Pager({ query, total }: { query: PublicQuery; total: number }) {
  const pages = Math.ceil(total / LIVE_PAGE_SIZE);
  if (pages <= 1) return null;
  const current = (query.page ?? 1) - 1;
  const href = (i: number) => {
    const p = paramsFromQuery({ ...query, page: undefined });
    p.set("page", String(i));
    return `?${p}`;
  };
  let first = current + 1 - 4;
  let last = current + 1 + 4;
  if (first < 1) {
    last += 1 - first;
    first = 1;
  }
  if (last > pages) {
    first = Math.max(1, first - (last - pages));
    last = pages;
  }
  const numbers = Array.from({ length: last - first + 1 }, (_, i) => first + i);
  const control = (cls: string, i: number, title: string, label: string, icon: ReactNode, w: string, rel?: string) => (
    <li className={`pager__item pager__item--control pager__item--${cls}`}>
      <a href={withBasePath(href(i))} className="pager__link" title={title} rel={rel}>
        <span className="visually-hidden">{label}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={w}
          height={cls === "first" || cls === "last" ? "16px" : "16"}
          viewBox={cls === "first" || cls === "last" ? "0 0 15 16" : "0 0 11 16"}
        >
          {icon}
        </svg>
      </a>
    </li>
  );
  return (
    <nav className="pager layout--content-medium" role="navigation" aria-labelledby="pagination-heading">
      <h4 id="pagination-heading" className="visually-hidden">
        Pagination
      </h4>
      <ul className="pager__items js-pager__items">
        {current > 0 && control("first", 0, "Go to first page", "First page", FIRST, "15px")}
        {current > 0 && control("previous", current - 1, "Go to previous page", "Previous page", PREV, "11", "prev")}
        {first > 1 && (
          <li className="pager__item pager__item--ellipsis" role="presentation">
            &hellip;
          </li>
        )}
        {numbers.map((n) =>
          n === current + 1 ? (
            <li key={n} className="pager__item pager__item--active pager__item--number">
              <span className="visually-hidden">Current page</span> {n}
            </li>
          ) : (
            <li key={n} className="pager__item pager__item--number">
              <a href={withBasePath(href(n - 1))} className="pager__link" title={`Go to page ${n}`}>
                <span className="visually-hidden">Page</span> {n}
              </a>
            </li>
          ),
        )}
        {last < pages && (
          <li className="pager__item pager__item--ellipsis" role="presentation">
            &hellip;
          </li>
        )}
        {current < pages - 1 && control("next", current + 1, "Go to next page", "Next page", PREV, "11", "next")}
        {current < pages - 1 && control("last", pages - 1, "Go to last page", "Last page", FIRST, "15px")}
      </ul>
    </nav>
  );
}

function formGroups(slug: string, query: PublicQuery, subcategories: SubcategoryNode[]): FormGroup[] {
  return LIVE_CATEGORY_PAGES[slug].filters.map((g) => {
    const selected = query.filters?.[g.key] ?? [];
    const tree = (nodes: SubcategoryNode[]): FormGroup["options"] =>
      nodes.map((n) => ({
        label: g.rename?.[n.slug] ?? n.name,
        slug: n.slug,
        children: tree(n.children),
      }));
    const options =
      g.key === "subcategory"
        ? tree(subcategories)
        : (g.options ?? []).map((label) => ({
            label,
            slug: slugify(label),
            children: [],
          }));
    return { key: g.key, label: g.label, options, selected, flat: g.flat };
  });
}

export function LiveCategoryPage({
  slug,
  query,
  result,
  subcategories,
}: {
  slug: string;
  query: PublicQuery;
  result: PublicListResult;
  subcategories: SubcategoryNode[];
}) {
  const config = LIVE_CATEGORY_PAGES[slug];
  const data = LIVE_CATEGORY_DATA[slug];
  const plain = config.layout === "plain";
  return (
    <div className={plain ? "pcat-catalog-plain" : `pcat-catalog pcat-${slug}`}>
      <div dir="ltr" className="js">
        <div dangerouslySetInnerHTML={{ __html: storedHtml(responsiveImagesHtml(data.bannerHtml)) }} />
        {plain ? (
          result.total === 0 && data.comingSoonHtml ? (
            <div dangerouslySetInnerHTML={{ __html: storedHtml(responsiveImagesHtml(data.comingSoonHtml)) }} />
          ) : (
            <section className="category_page" style={css(data.sectionStyle)}>
              <div className="container-fluid">
                <div className="row">
                  <div className="col-md-12">
                    <div className="row filter_prod">
                      <div className="row">
                        {result.items.map((p) => (
                          <PlainCard key={p.publicId} p={p} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )
        ) : (
          <section className="all_page">
            <div className="views-element-container">
              <div className={config.noFilterviewClass ? undefined : "filterview"}>
                <div className="container py-4">
                  <div className="row">
                    <div className="col-12 col-md-3">
                      <div className="filters-sidebar">
                        <div className="filters-content">
                          <FilterForm id={config.formId} groups={formGroups(slug, query, subcategories)} sort={query.sort} />
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-md-9">
                      <div className="view-content">
                        <div className="views-view-grid horizontal cols-4 clearfix">
                          <div className="row">
                            {result.items.map((p) => (
                              <Card key={p.publicId} p={p} swatches={config.swatches} />
                            ))}
                          </div>
                        </div>
                      </div>
                      <Pager query={query} total={result.total} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
        {data.contentHtml && <div dangerouslySetInnerHTML={{ __html: storedHtml(responsiveImagesHtml(data.contentHtml)) }} />}
        {data.faqHtml && <div dangerouslySetInnerHTML={{ __html: storedHtml(responsiveImagesHtml(data.faqHtml)) }} />}
        {data.tailHtml && <div dangerouslySetInnerHTML={{ __html: storedHtml(responsiveImagesHtml(data.tailHtml)) }} />}
      </div>
    </div>
  );
}

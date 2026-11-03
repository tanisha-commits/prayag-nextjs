import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/components/sites/prayag/seo";
import { SEARCH_PAGE_SIZE, searchNodes } from "@/lib/search";
import "@/components/sites/prayag/search/search.css";
import { withBasePath } from "@/lib/base-path";
import { storedHtml } from "@/lib/stored-html";

// Source https://prayagindia.com/search/node?keys=… (Drupal node search, olivero pager), rebuilt on
// the live markup under the scoped theme CSS. The source form POSTs and redirects to ?keys=…; a GET
// form lands on the same URL. Result pages are not indexed.
export const metadata: Metadata = {
  ...pageMetadata({ title: "Search | Prayag", path: "/search/node" }),
  robots: { index: false, follow: true },
};

const ARROW = "M1.11201 7.19126L9.41183 1.15503C10.0728 0.674329 11 1.14648 11 1.96377V14.0362C11 14.8535 10.0728 15.3257 9.41183 14.845L1.11201 8.80874C0.562908 8.40939 0.562907 7.59061 1.11201 7.19126Z";
const EDGE = "M5.1,7.2l8.3-6C14.1,0.7,15,1.1,15,2V14c0,0.8-0.9,1.3-1.6,0.8l-8.3-6C4.6,8.4,4.6,7.6,5.1,7.2z M0,0h2v16H0V0z";

/** Drupal core pager: up to 9 page links centred on the current page, plus first/previous/next/last. */
function Pager({ keys, page, pages }: { keys: string; page: number; pages: number }) {
  if (pages < 2) return null;
  const href = (p: number) => `?keys=${encodeURIComponent(keys)}&page=${p}`;
  const current = page + 1;
  let first = current - 4;
  let last = current + 4;
  if (first < 1) {
    last += 1 - first;
    first = 1;
  }
  if (last > pages) {
    first = Math.max(1, first - (last - pages));
    last = pages;
  }
  const control = (cls: string, p: number, title: string, label: string, d: string, wide: boolean, rel?: string) => (
    <li className={`pager__item pager__item--control pager__item--${cls}`}>
      <a href={withBasePath(href(p))} className="pager__link" title={title} rel={rel}>
        <span className="visually-hidden">{label}</span>
        <svg xmlns="http://www.w3.org/2000/svg" width={wide ? "15px" : "11"} height={wide ? "16px" : "16"} viewBox={wide ? "0 0 15 16" : "0 0 11 16"}>
          <path d={d} />
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
        {page > 0 && control("first", 0, "Go to first page", "First page", EDGE, true)}
        {page > 0 && control("previous", page - 1, "Go to previous page", "Previous page", ARROW, false, "prev")}
        {first > 1 && <li className="pager__item pager__item--ellipsis" role="presentation">&hellip;</li>}
        {Array.from({ length: last - first + 1 }, (_, i) => first + i).map((n) =>
          n === current ? (
            <li key={n} className="pager__item pager__item--active pager__item--number">
              <span className="visually-hidden">Current page</span>
              {n}
            </li>
          ) : (
            <li key={n} className="pager__item pager__item--number">
              <a href={withBasePath(href(n - 1))} className="pager__link" title={`Go to page ${n}`}>
                <span className="visually-hidden">Page</span>
                {n}
              </a>
            </li>
          ),
        )}
        {last < pages && <li className="pager__item pager__item--ellipsis" role="presentation">&hellip;</li>}
        {page < pages - 1 && control("next", page + 1, "Go to next page", "Next page", ARROW, false, "next")}
        {page < pages - 1 && control("last", pages - 1, "Go to last page", "Last page", EDGE, true)}
      </ul>
    </nav>
  );
}

export default async function SearchNodePage({ searchParams }: PageProps<"/search/node">) {
  const params = await searchParams;
  const keys = (Array.isArray(params.keys) ? params.keys[0] : params.keys)?.trim() ?? "";
  const page = Math.max(0, Math.floor(Number(params.page)) || 0);
  const { total, hits } = await searchNodes(keys, page);
  const pages = Math.ceil(total / SEARCH_PAGE_SIZE);

  return (
    <div className="pcat-search">
      <div dir="ltr">
        <section className="trop_cop search_wrap">
          <div className="container">
            <h1 style={{ fontSize: 32 }}>Search here</h1>
            <div className="region region--content grid-full layout--pass--content-medium ie11-autorow" id="content">
              <div id="block-prayag-content" className="block block-system block-system-main-block">
                <div className="block__content">
                  <form className="search-form" action={withBasePath("/search/node")} method="get" id="search-form" acceptCharset="UTF-8">
                    <div className="container-inline js-form-wrapper form-wrapper" id="edit-basic">
                      <div className="js-form-item form-item js-form-type-search form-item-keys js-form-item-keys">
                        <label htmlFor="edit-keys" className="form-item__label">
                          Enter your keywords
                        </label>
                        <input
                          placeholder="Search by keyword or phrase."
                          type="search"
                          id="edit-keys"
                          name="keys"
                          defaultValue={keys}
                          size={30}
                          maxLength={255}
                          className="form-search form-element form-element--type-search form-element--api-search"
                        />
                      </div>
                      <input className="button--primary button js-form-submit form-submit" type="submit" id="edit-submit" value="Search" />
                    </div>
                    <Link href="/search/node/help" className="search-help-link" id="edit-help-link">
                      About searching
                    </Link>
                  </form>
                  {hits.length ? (
                    <>
                      <h2>Search results</h2>
                      <ol className="search-results main_results node_search-results">
                        {hits.map((hit) => (
                          <li key={hit.href} className="search-results__item">
                            <div className="search_item_image">
                              <div />
                              <div />
                              {/* eslint-disable-next-line @next/next/no-img-element -- source <img> kept 1:1 */}
                              <div>{hit.image && <img src={withBasePath(hit.image)} alt={hit.imageAlt} loading="lazy" />}</div>
                            </div>
                            <div className="search_item_content">
                              {hit.date && (
                                <div className="search-result__meta">
                                  <span>
                                    By{" "}
                                    <span className="search-result__author">
                                      <span>prayag</span>
                                    </span>
                                  </span>
                                  <span className="search-result__date">, {hit.date}</span>
                                </div>
                              )}
                              <h3 className="search-result__title">
                                <a href={withBasePath(hit.href)}>{hit.title}</a>
                              </h3>
                              <div className="search-result__snippet text-content" dangerouslySetInnerHTML={{ __html: storedHtml(hit.snippetHtml) }} />
                            </div>
                          </li>
                        ))}
                      </ol>
                    </>
                  ) : (
                    <h3>Your search yielded no results.</h3>
                  )}
                  <Pager keys={keys} page={page} pages={pages} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

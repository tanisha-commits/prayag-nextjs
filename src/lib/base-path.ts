/**
 * Sub-path the site is served under, e.g. "/prayagindia" (empty when served at a domain root).
 * Set with `BASE_PATH=/prayagindia npm run build`; next.config.ts normalises it and exposes it here.
 * Next.js adds it to <Link>, redirect() and router calls itself, but not to plain <a>/<img>/<video>
 * URLs, fetch() calls, CSS-in-JS or stored HTML, so those go through the helpers below.
 */
export const BASE_PATH: string = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

function prefixPath(url: string): string {
  if (!BASE_PATH || !url.startsWith("/") || url.startsWith("//")) return url;
  if (url === BASE_PATH || url.startsWith(`${BASE_PATH}/`) || url.startsWith(`${BASE_PATH}?`) || url.startsWith(`${BASE_PATH}#`)) return url;
  return `${BASE_PATH}${url}`;
}

/** Prefixes a root-relative URL ("/x") with the base path. Anything else (external, "#", objects) passes through. */
export function withBasePath<T>(url: T): T {
  return (typeof url === "string" ? prefixPath(url) : url) as T;
}

/** Same as withBasePath for each candidate of a srcset ("a.webp 1x, /b.webp 2x"). */
export function withBasePathSrcSet<T>(srcSet: T): T {
  if (typeof srcSet !== "string" || !BASE_PATH) return srcSet;
  return srcSet
    .split(",")
    .map((part) => part.replace(/^(\s*)(\S+)/, (_, ws: string, url: string) => ws + prefixPath(url)))
    .join(",") as T;
}

/** Prefixes root-relative URLs in stored HTML (blog/catalog/FAQ content): href, src, poster, action, srcset, url(). */
export function withBasePathHtml(html: string): string {
  if (!BASE_PATH || !html) return html;
  return html
    .replace(/\b(href|src|poster|action|data-src)=(["'])(\/[^"']*)\2/gi, (_, attr: string, q: string, url: string) => `${attr}=${q}${prefixPath(url)}${q}`)
    .replace(/\b(srcset)=(["'])([^"']*)\2/gi, (_, attr: string, q: string, set: string) => `${attr}=${q}${withBasePathSrcSet(set)}${q}`)
    .replace(/url\((["']?)(\/[^"')]*)\1\)/gi, (_, q: string, url: string) => `url(${q}${prefixPath(url)}${q})`);
}

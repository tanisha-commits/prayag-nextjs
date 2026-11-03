import { withBasePathHtml } from "./base-path";

const EMAIL = /[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}/;

/**
 * Wraps HTML that contains an email address in Cloudflare's `<!--email_off-->` markers. Production sits
 * behind Cloudflare with Email Obfuscation on: without the markers it rewrites every address and injects
 * the render-blocking email-decode.min.js into the page. The markers are plain comments, so nothing renders.
 */
export function withEmailOff(html: string): string {
  return html && EMAIL.test(html) ? `<!--email_off-->${html}<!--/email_off-->` : html;
}

/** Stored HTML (blog, catalog, FAQ, privacy, search snippets) ready for dangerouslySetInnerHTML. */
export function storedHtml(html: string): string {
  return withEmailOff(withBasePathHtml(html));
}

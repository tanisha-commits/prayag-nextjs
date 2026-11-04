import { withBasePathHtml } from "./base-path";

const EMAIL = /[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}/;

export function withEmailOff(html: string): string {
  return html && EMAIL.test(html) ? `<!--email_off-->${html}<!--/email_off-->` : html;
}

export function storedHtml(html: string): string {
  return withEmailOff(withBasePathHtml(html));
}

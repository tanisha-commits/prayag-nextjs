import "server-only";
import { cache } from "react";

/**
 * Text edits of the page being rendered (Admin → Pages → Texts), set once per request by
 * withPageContent. Keyed by the original text.
 */
export const pageTextStore = cache((): { map: Record<string, string> } => ({ map: {} }));

/**
 * Editable text for server components: renders the edited version of `children` when the page has
 * one, else the original. Adds no markup. Non-string children pass through unchanged.
 */
export function Tx({ children }: { children?: React.ReactNode }) {
  if (typeof children !== "string") return children;
  return pageTextStore().map[children] ?? children;
}

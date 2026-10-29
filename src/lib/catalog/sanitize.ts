/**
 * Strip active content from stored rich text (live-site HTML, sheet text, admin input): scripts,
 * embedded frames/objects, styles, event-handler attributes and javascript:/data: URLs. Same rules
 * as the blog importer. Applied when data is written, so pages can render it as markup.
 */
export function sanitizeHtml(html: string | null | undefined): string | null {
  if (!html) return null;
  const out = html
    .replace(/<\s*(script|style|iframe|object|embed|form|link|meta)\b[\s\S]*?(<\s*\/\s*\1\s*>|$)/gi, "")
    .replace(/<\s*(script|style|iframe|object|embed|form|link|meta)\b[^>]*\/?>/gi, "")
    .replace(/\s+on[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/\s(href|src|xlink:href)\s*=\s*("|')\s*(javascript|data|vbscript):[^"']*\2/gi, ' $1="#"')
    .replace(/&nbsp;/g, " ")
    .trim();
  return out || null;
}

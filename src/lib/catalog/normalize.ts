/** Pure normalisation helpers shared by the importer, the admin and the tests. */

/** Comparison key for item codes: case-, space- and punctuation-insensitive ("6102-rg" = "6102 RG"). */
export function codeKey(code: string | null | undefined): string {
  return (code ?? "").toUpperCase().replace(/[^A-Z0-9]/g, "");
}

/** Comparison key for names and labels. */
export function textKey(value: string | null | undefined): string {
  return (value ?? "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function slugify(value: string): string {
  return textKey(value).replace(/ /g, "-");
}

/**
 * A code-like first token of a product title ("101 Waste Coupling" -> "101", "Q736-MB Single Bowl"
 * -> "Q736-MB"). Only a matching aid for pages without an item-code field: it is never stored as
 * the product's item code.
 */
export function titleCodeCandidate(title: string): string | null {
  const first = title.trim().split(/\s+/)[0] ?? "";
  return /\d/.test(first) && first.length <= 24 ? first : null;
}

/** Split a sheet cell holding a list (new lines, bullets, numbering) into clean items. */
export function splitList(cell: string | null | undefined): string[] {
  return (cell ?? "")
    .split(/\r?\n|•|;/)
    .map((s) => s.replace(/^\s*(?:\d+[.)]|[-–*])\s*/, "").trim())
    .filter(Boolean);
}

/** Sheet cells use free text; treat "", "-", "NA", "N/A", "nil" as empty. */
export function clean(cell: string | null | undefined): string {
  const v = (cell ?? "").replace(/\u00a0/g, " ").trim();
  return /^(-+|n\/?a|nil|none)$/i.test(v) ? "" : v;
}

/**
 * Item code without a trailing colour/finish suffix ("6108-RG" -> "6108", "146-HW" -> "146-H"), used
 * only to flag possible variants of an existing product; never to merge products automatically.
 */
export function variantBaseKey(code: string | null | undefined): string {
  return codeKey((code ?? "").trim().toUpperCase().replace(/[-\s]?(RG|G|B|BL|BK|CP|CH|W|R|N)$/, ""));
}

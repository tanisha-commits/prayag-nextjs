export function codeKey(code: string | null | undefined): string {
  return (code ?? "").toUpperCase().replace(/[^A-Z0-9]/g, "");
}

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

export function titleCodeCandidate(title: string): string | null {
  const first = title.trim().split(/\s+/)[0] ?? "";
  return /\d/.test(first) && first.length <= 24 ? first : null;
}

export function splitList(cell: string | null | undefined): string[] {
  return (cell ?? "")
    .split(/\r?\n|•|;/)
    .map((s) => s.replace(/^\s*(?:\d+[.)]|[-–*])\s*/, "").trim())
    .filter(Boolean);
}

export function clean(cell: string | null | undefined): string {
  const v = (cell ?? "").replace(/\u00a0/g, " ").trim();
  return /^(-+|n\/?a|nil|none)$/i.test(v) ? "" : v;
}

export function variantBaseKey(code: string | null | undefined): string {
  return codeKey((code ?? "").trim().toUpperCase().replace(/[-\s]?(RG|G|B|BL|BK|CP|CH|W|R|N)$/, ""));
}

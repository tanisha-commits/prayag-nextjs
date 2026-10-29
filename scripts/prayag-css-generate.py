"""Write scoped CSS for the Prayag product-category pages from scripts/prayag-css-capture.mjs output.

Usage:
  python3 -I scripts/prayag-css-generate.py base <capture-dir> <out.css>
      Union of the theme rules used by every captured page -> pcat-base.css, scoped under .pcat.
  python3 -I scripts/prayag-css-generate.py page <capture-dir> <slug> <out.css>
      The page's own inline <style> rules -> <slug>.css, scoped under .pcat-<slug>.

Scoping adds exactly one class to every selector (html/body -> div.<root>, which keeps their
element point; :root -> .<root>), so base and page rules keep the source's specificity order,
and nothing leaks into other routes (stylesheets of visited routes stay loaded in the App Router).
Chrome's CSSOM expands `all: unset`; it is collapsed back. Font Awesome kit blocks, Drupal core
(olivero) fonts and unreferenced keyframes are dropped; page keyframes are renamed <slug>-<name>.

Two build-pipeline fixes:
- Lightning CSS (Next's CSS transform) drops an earlier `!important` declaration when a later rule
  with the identical selector sets the same property without it and another rule sits in between.
  Such a later declaration can never apply, so it is removed here (cascade-equivalent).
- Theme images referenced with absolute live URLs are blocked cross-site (Cross-Origin-Resource-
  Policy); they are rewritten to the local copies under /sites/prayag/theme/ (same names as
  scripts/prayag-assets.py), and a missing local copy is reported.
"""

import glob
import json
import os
import re
import sys
import urllib.parse

GRAPHIK = (
    ("Graphik, \"Helvetica Neue\", Arial, sans-serif", "var(--font-graphik), \"Helvetica Neue\", Arial, sans-serif"),
    ("font-family: Graphik;", "font-family: var(--font-graphik);"),
    ("/ 1 Graphik, sans-serif", "/ 1 var(--font-graphik), sans-serif"),
)


def scoper(root):
    def scope(sel):
        s = sel.strip()
        m = re.match(r"^(html|body|:root)([.#:\[][^\s>+~]*)?(.*)$", s)
        if m:
            return (root if m.group(1) == ":root" else "div" + root) + m.group(3)
        return root + " " + s
    return scope


THEME = "https://prayagindia.com/themes/custom/prayag/assets/images/"
PUBLIC = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public")


def local_urls(css):
    def sub(m):
        d, f = os.path.split(urllib.parse.unquote(m.group(1)))
        local = "/sites/prayag/theme/" + (d + "/" if d else "") + re.sub(r"[^A-Za-z0-9._-]+", "-", f).strip("-")
        if not os.path.isfile(PUBLIC + local):
            print("  missing local copy:", local, file=sys.stderr)
        return 'url("' + urllib.parse.quote(local) + '")'
    return re.sub(r'url\("' + re.escape(THEME) + r'([^"]+)"\)', sub, css)


def drop_shadowed(rules):
    """Remove normal declarations that an earlier same-selector `!important` one always beats."""
    important = {}
    for r in rules:
        if "at" in r:
            continue
        key = (r.get("media") or "", r["sel"])
        decls = declarations(r["body"])
        seen = important.setdefault(key, set())
        kept = [d for d in decls if d.endswith("!important") or d.split(":", 1)[0].strip() not in seen]
        seen.update(d.split(":", 1)[0].strip() for d in decls if d.endswith("!important"))
        r["body"] = "; ".join(kept) + (";" if kept else "")
    return rules


def declarations(body):
    decls = [d.strip() for d in body.split(";") if d.strip()]
    if sum(d.endswith(": unset") for d in decls) > 100:
        decls = ["all: unset"] + [d for d in decls if not d.endswith(": unset")]
    return decls


def emit(rules, root, rename=lambda t: t):
    scope = scoper(root)
    rules = drop_shadowed([dict(r) for r in rules])
    out, cur = [], None
    for r in rules:
        media = r.get("media") or None
        if media != cur:
            if cur:
                out.append("}")
            if media:
                out.append(f"@media {media} {{")
            cur = media
        ind = "  " if cur else ""
        if "at" in r:
            out.append(ind + rename(r["at"]))
            continue
        decls = declarations(r["body"])
        sels = ", ".join(dict.fromkeys(scope(s) for s in r["sel"].split(",")))
        body = rename(";\n  ".join(decls) + ";").replace("\n", "\n" + ind) if decls else ""
        out.append(f"{ind}{sels} {{\n{ind}  {body}\n{ind}}}" if body else f"{ind}{sels} {{}}")
    if cur:
        out.append("}")
    css = local_urls("\n".join(out) + "\n")
    for a, b in GRAPHIK:
        css = css.replace(a, b)
    return css


def base(capture, dst):
    union = {}
    for f in sorted(glob.glob(os.path.join(capture, "*.used.json"))):
        for r in json.load(open(f))["out"]:
            k = r["idx"]
            if r["kind"] == "rule" and k in union:
                sels = set(union[k]["sel"].split(", ")) | set(r["sel"].split(", "))
                union[k]["sel"] = ", ".join(sorted(sels))
            else:
                union[k] = dict(r)
    rules = [union[k] for k in sorted(union)]
    bodies = " ".join(r.get("body", "") for r in rules if r["kind"] == "rule")
    keep = []
    for r in rules:
        if r["kind"] == "at":
            t = r["text"]
            if "@font-face" in t or "olivero" in t or "-webkit-keyframes" in t:
                continue
            name = re.search(r"keyframes\s+([\w-]+)", t)
            if name and not re.search(r"\b" + re.escape(name.group(1)) + r"\b", bodies):
                continue
            keep.append({"media": r["media"], "at": t})
        elif not any(x in r["sel"] for x in (".ui-front", ".draggable")):
            keep.append(r)
    header = """/*
 * Source theme CSS used by the Prayag product-category pages (Bootstrap 5 reboot/grid/utilities,
 * slick, theme style.css/responsive.css). Generated by scripts/prayag-css-generate.py, not
 * hand-written: every rule of the two aggregated source stylesheets whose selector matched an
 * element in the page content of the captured pages (header/footer/drawer excluded), measured in
 * Chrome at 1440px, kept in source order. Scoped under .pcat so it cannot leak into other routes;
 * html/body rules apply to div.pcat itself. Page CSS is scoped one class deep too (.pcat-<slug>),
 * which keeps source specificity order.
 */

/*
 * Not from the source: undo Tailwind's global preflight/utilities inside these pages. They live
 * in cascade layers, so this unlayered zero-specificity rule beats them and loses to every ported
 * source rule, leaving browser defaults + source CSS as on prayagindia.com (inline img/svg, UA
 * button colour, and class names like `relative`/`z-1` that are Tailwind utilities here).
 */
:where(.pcat, .pcat *) {
  all: revert;
}
"""
    open(dst, "w").write(header + emit(keep, ".pcat"))
    print(dst, len(keep), "rules")


def page(capture, slug, dst):
    sheets = json.load(open(os.path.join(capture, f"{slug}.pagecss.json")))
    # Font Awesome's kit injects three <style> blocks on every page; page content uses no icons.
    sheets = [
        s for s in sheets
        if s["where"] == "content"
        and not any(r.get("sel", "").startswith(".fa") or "FontAwesome" in r.get("at", "") for r in s["rules"])
    ]
    rules = [r for s in sheets for r in s["rules"]]
    frames = {m.group(1) for r in rules if "at" in r for m in [re.search(r"keyframes\s+([\w-]+)", r["at"])] if m}

    def rename(t):
        for f in frames:
            t = re.sub(r"(?<![\w-])" + re.escape(f) + r"(?![\w-])", f"{slug}-{f}", t)
        return t

    root = f".pcat-{slug}"
    header = f"""/*
 * Own CSS of https://prayagindia.com/{slug} (the page's inline <style> block), read through
 * Chrome's CSSOM in source order and scoped under {root} (html/body -> div{root}) so every rule
 * gains exactly one class over the source and cannot leak into other routes. Keyframes are
 * renamed with the page slug. Generated by scripts/prayag-css-generate.py; fix differences in
 * the page components, not here.
 */
"""
    open(dst, "w").write(header + emit(rules, root, rename))
    print(dst, len(rules), "rules", "keyframes:", sorted(frames))


if __name__ == "__main__":
    if sys.argv[1] == "base":
        base(*sys.argv[2:4])
    else:
        page(*sys.argv[2:5])

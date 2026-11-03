"""Extract the live prayagindia.com product pages (captured with GET) into normalized records.

Usage: python3 -I scripts/catalog/extract-live.py <crawl-dir> <products-twig> data/catalog/live-products.json

<crawl-dir> holds html/<quoted-path>.html and crawl-log.json (path -> [status, final URL]).
<products-twig> is the backup's themes/custom/prayag/templates/page--products.html.twig.
Only pages rendered as Drupal `page-node-type-products` are kept. Nothing is inferred: a field
missing on the page stays empty.

The live template fills EMPTY Specifications / Available Sizes fields with keyword-picked sample
rows (`demo_on = true`), fills an EMPTY body with a generated sentence ("<title> is a Prayag product
from the <category> range." + applications / key advantages), and always generates the
care/installation/about/FAQ text. None of that is product data: sample tables are dropped
(specsSample/sizesSample flag), a generated description is dropped (descriptionGenerated flag) and the
generated blocks are never read.
"""

import html as htmllib
import json
import os
import re
import sys
import urllib.parse

crawl, twig, out = sys.argv[1:4]
log = json.load(open(os.path.join(crawl, "crawl-log.json")))

# The template's sample sets: [['Key', 'Value'], ...] lists after `specs:` / `sizes:`.
twig_src = open(twig, encoding="utf-8").read()
twig_src = twig_src[twig_src.find("{% set demo_default"):twig_src.find("{% set demo = demo_default")]
pairs = lambda block: [[a, b] for a, b in re.findall(r"\['([^']*)', '([^']*)'\]", block)]
SAMPLE_SPECS = [pairs(b) for b in re.findall(r"specs: \[(.*?)\]\s*,\s*\n", twig_src, re.S)]
SAMPLE_SIZES = [pairs(b) for b in re.findall(r"sizes: \[(.*?)\]\s*,\s*\n", twig_src, re.S)]
DERIVED_KEYS = {"Item Code", "Category", "Available Colours", "Application", "Brand"}


def is_sample_specs(rows):
    head = [r for r in rows if r[0] in DERIVED_KEYS]
    return rows[:len(head)] == head and rows[len(head):] in SAMPLE_SPECS


def is_sample_sizes(rows):
    return rows in SAMPLE_SIZES


def text(s):
    s = re.sub(r"<br\s*/?>", "\n", s or "")
    s = re.sub(r"<[^>]+>", " ", s)
    return re.sub(r"[ \t\r\f\v]+", " ", htmllib.unescape(s)).replace(" \n", "\n").strip()


def first(pat, s, flags=re.S):
    m = re.search(pat, s, flags)
    return m.group(1) if m else ""


def table(block):
    return [[text(a), text(b)] for a, b in re.findall(r"<tr>\s*<td>(.*?)</td>\s*<td>(.*?)</td>\s*</tr>", block, re.S)]


def panel(h, pid):
    return first(r'id="%s">(.*?)</div>\s*</div>' % pid, h)


def real_table(main, key, is_sample):
    raw = first(r'id="pp-panel-%s">.*?<div class="pp-rich">(.*?)</div>\s*</div>' % key, main).strip()
    rows = table(raw)
    sample = bool(rows) and is_sample(rows)
    return {key + "Html": "" if sample else raw, key + "Sample": sample}


def real_description(main):
    raw = first(r'id="pp-panel-desc">.*?<div class="pp-rich">(.*?)</div>\s*</div>', main).strip()
    paras = [text(p) for p in re.findall(r"<p>(.*?)</p>", raw, re.S)]
    generated = bool(paras) and " is a Prayag product" in paras[0] and all(
        i == 0 or p.startswith(("It is designed for ", "Key advantages:")) for i, p in enumerate(paras))
    return {"descriptionHtml": "" if generated else raw, "descriptionGenerated": generated}


records = []
for name in sorted(os.listdir(os.path.join(crawl, "html"))):
    h = open(os.path.join(crawl, "html", name), encoding="utf-8", errors="replace").read()
    if "page-node-type-products" not in first(r"<body[^>]*class=\"([^\"]*)\"", h):
        continue
    path = "/" + urllib.parse.unquote(name[:-5])
    status, final = log.get(path, [None, None])
    main = h[h.find('<div class="pp">'):h.find("<footer")]
    crumbs = [text(c) for c in re.findall(r"<li[^>]*>(.*?)</li>", first(r'<nav class="pp-breadcrumb"[^>]*>(.*?)</nav>', main))]
    records.append({
        "nid": int(first(r'"currentPath":"node\\/(\d+)"', h) or 0) or None,
        "path": urllib.parse.urlparse(final).path if final else path,
        "requestedPath": path,
        "canonical": first(r'<link rel="canonical" href="([^"]+)"', h),
        "metaTitle": text(first(r"<title>(.*?)</title>", h)),
        "metaDescription": htmllib.unescape(first(r'<meta name="description" content="([^"]*)"', h)),
        "title": text(first(r'<h1 class="pp-title">(.*?)</h1>', main)),
        "itemCode": text(first(r'pp-tag--code">Item Code <b>(.*?)</b>', main)),
        "breadcrumb": crumbs[1:-1],
        "tags": [text(t) for t in re.findall(r'<span class="pp-tag">(.*?)</span>', main)],
        "short": text(first(r'<p class="pp-short">(.*?)</p>', main)),
        "colours": [{"name": text(n), "hex": c} for c, n in re.findall(r'pp-swatch" style="background: ([^"]+)"[^>]*></span>(.*?)</li>', main, re.S)],
        "highlights": [{"text": text(t), "icon": i} for i, t in re.findall(r'pp-hl__icon">\s*<img src="([^"]+)".*?</span>\s*<span>(.*?)</span>', main, re.S)],
        "features": [text(li) for li in re.findall(r"<li>(.*?)</li>", first(r'<ul class="pp-checks[^"]*">(.*?)</ul>', main))],
        **real_description(main),
        **real_table(main, "specs", is_sample_specs),
        **real_table(main, "sizes", is_sample_sizes),
        "images": [{"src": s, "alt": htmllib.unescape(a)} for s, a in re.findall(r'data-pp-thumb data-src="([^"]+)" data-alt="([^"]*)"', main)],
    })

json.dump(records, open(out, "w"), indent=1, ensure_ascii=False)
print(len(records), "products ->", out)

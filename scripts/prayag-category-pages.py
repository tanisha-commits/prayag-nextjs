import html as html_lib
import json, os, re, subprocess, sys, tempfile

SLUGS = ["faucets", "ptmt-taps", "ceramicware", "kitchen-sinks", "water-heaters", "storage-tank", "bathroom-accessories", "hardware", "pipes-fittings", "traps"]
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
src_dir, backup, *only = sys.argv[1:]

def section(h, cls):
    i = h.find(f'<section class="{cls}"')
    if i < 0:
        return ""
    return h[i:h.find("</section>", i) + len("</section>")]

def clean(html):
    html = re.sub(r"<!--.*?-->", "", html, flags=re.S)
    html = re.sub(r"<script\b.*?</script>", "", html, flags=re.S | re.I)
    html = re.sub(r"<style\b.*?</style>", "", html, flags=re.S | re.I)
    html = re.sub(r"<link\b[^>]*>", "", html, flags=re.I)
    html = re.sub(r'\s(?:on[a-z]+|data-once)="[^"]*"', "", html, flags=re.I)
    html = re.sub(r'href="https://prayagindia\.com(/[^"]*)?"', lambda m: f'href="{m.group(1) or "/"}"', html)
    return re.sub(r"\n\s*\n+", "\n", html).strip()

def urls(html):
    found = set(re.findall(r'\ssrc="([^"]+)"', html))
    for ss in re.findall(r'\ssrcset="([^"]+)"', html):
        found |= {part.strip().split(" ")[0] for part in ss.split(",") if part.strip()}
    return {u for u in found if u.startswith(("/sites/", "/themes/", "https://prayagindia.com/"))}

def localise(html, amap):
    def one(u):
        return amap.get(u, {}).get("local", u)
    html = re.sub(r'(\ssrc=")([^"]+)(")', lambda m: m.group(1) + one(m.group(2)) + m.group(3), html)
    return re.sub(r'(\ssrcset=")([^"]+)(")', lambda m: m.group(1) + ", ".join(
        " ".join([one(p.strip().split(" ")[0])] + p.strip().split(" ")[1:]) for p in m.group(2).split(",") if p.strip()) + m.group(3), html)

OUT = os.path.join(ROOT, "src/content/prayag/catalog/category-pages.json")
ASSETS = os.path.join(ROOT, "docs/research/prayag/category-pages-assets.json")
membership = json.load(open(os.path.join(ROOT, "data/catalog/membership.json")))
out, asset_map = (json.load(open(OUT)), json.load(open(ASSETS))) if only else ({}, {})
for slug in only or SLUGS:
    h = re.sub(r"<!--.*?-->", "", open(os.path.join(src_dir, f"{slug}.html")).read(), flags=re.S)
    b = h.find('<div class="breadcrumb_main"')
    banner = clean(h[b:h.find("<section", b)])
    banner = banner[: banner.rfind("</div>") + len("</div>")]
    first = re.search(r'<section class="(all_page|category_page)"([^>]*)>', h)
    style = re.search(r'style="([^"]*)"', first.group(2)) if first else None
    content, faq = clean(section(h, "category_page_content")), clean(section(h, "faq_main"))
    coming = clean(section(h, "category_page")) if "Coming Soon" in section(h, "category_page") else ""
    last = h.rfind("</section>", 0, h.find("<footer")) + len("</section>")
    tail = clean(h[last:h.find("<footer")])
    with tempfile.TemporaryDirectory() as tmp:
        page = os.path.join(tmp, "p.html")
        open(page, "w").write("<body>" + "".join(f'<img src="{u}">' for u in sorted(urls(banner + content + faq))) + "</body>")
        mp = os.path.join(tmp, "map.json")
        subprocess.run([sys.executable, "-I", os.path.join(ROOT, "scripts/prayag-assets.py"), page, backup, os.path.join(ROOT, "public/sites/prayag"), mp], check=True, stdout=subprocess.DEVNULL)
        amap = json.load(open(mp))
    bad = {u: v["from"] for u, v in amap.items() if not v["from"] in ("backup", "live")}
    if bad:
        print(slug, "ASSET PROBLEMS:", bad, file=sys.stderr)
    asset_map.update(amap)
    title = re.search(r"<title>(.*?)</title>", h, re.S)
    desc = re.search(r'<meta name="description" content="([^"]*)"', h)
    out[slug] = {
        "metaTitle": html_lib.unescape(title.group(1).strip()) if title else "",
        "metaDescription": html_lib.unescape(desc.group(1)) if desc else "",
        "bannerHtml": localise(banner, amap),
        "sectionStyle": style.group(1) if style else "",
        "contentHtml": localise(content, amap),
        "faqHtml": localise(faq, amap),
        "comingSoonHtml": coming,
        "tailHtml": tail,
        "liveOrder": [p.lstrip("/") for p in membership.get(slug, {}).get("all", [])],
    }
    print(slug, "banner", len(banner), "content", len(content), "faq", len(faq), "images", len(amap), "order", len(out[slug]["liveOrder"]))

json.dump(out, open(OUT, "w"), ensure_ascii=False, indent=1)
json.dump(asset_map, open(ASSETS, "w"), indent=1)

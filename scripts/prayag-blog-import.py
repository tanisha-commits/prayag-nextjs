"""Build the local blog content from captured prayagindia.com article pages.

Usage:
  python3 -I scripts/prayag-blog-import.py <articles.json> <drupal-backup-root> <project-root> <asset-map-out.json>

<articles.json> is produced by parsing the saved /blog listing and the 148 article pages
(fields: slug, year, ts, listDate, listTitle, listImg, listAlt, metaTitle, description,
title, published, bannerImg, bannerAlt, body, related[]).

Writes:
  src/content/prayag/blog/index.json        listing data (no bodies)
  src/content/prayag/blog/articles/<slug>.json  one file per article
  public/sites/prayag/files/...              images, copied from the read-only backup
                                             (GET from the live site only when absent)
"""

import json
import os
import re
import shutil
import sys
import urllib.parse
import urllib.request

SOURCE = "https://prayagindia.com"

articles_json, backup, root, map_out = sys.argv[1:5]
articles = json.load(open(articles_json))
slugs = {a["slug"] for a in articles}

# Local routes that exist in the clone; everything else stays on the live site.
LOCAL_PAGES = {
    "", "about-prayag", "ceo-profile", "sustainability", "manufacturing-process",
    "dealership-enquiry", "contact-us", "blog",
}

asset_map = {}


def local_asset(url):
    """Copy a /sites/default/files or theme asset and return its public path."""
    path = urllib.parse.unquote(urllib.parse.urlparse(url).path)
    path = re.sub(r"/+", "/", path)
    if path.startswith("/sites/default/files/styles/"):
        # image-style derivative: /styles/<style>/public/<rest>
        rest = path.split("/public/", 1)[1]
        rel, src_path = "files/" + rest, None
    elif path.startswith("/sites/default/files/"):
        rel, src_path = "files/" + path[len("/sites/default/files/"):], path
    elif path.startswith("/themes/custom/prayag/assets/images/"):
        rel, src_path = "theme/" + path[len("/themes/custom/prayag/assets/images/"):], path
    else:
        return url
    d, f = os.path.split(rel)
    f = re.sub(r"[^A-Za-z0-9._-]+", "-", f).strip("-")
    rel = f"{d}/{f}"
    dest = os.path.join(root, "public/sites/prayag", rel)
    if not os.path.exists(dest):
        os.makedirs(os.path.dirname(dest), exist_ok=True)
        local = os.path.join(backup, src_path.lstrip("/")) if src_path else None
        if local and os.path.isfile(local):
            shutil.copyfile(local, dest)
            origin = "backup"
        else:
            req = urllib.request.Request(SOURCE + urllib.parse.quote(path), headers={"User-Agent": "Mozilla/5.0"})
            try:
                with urllib.request.urlopen(req, timeout=60) as r:
                    data = r.read()
                if data[:15].lstrip().lower().startswith((b"<!doctype", b"<html")):
                    origin = "MISSING (live returned HTML)"
                else:
                    open(dest, "wb").write(data)
                    origin = "live"
            except Exception as e:  # noqa: BLE001 - recorded in the asset map
                origin = f"MISSING ({e})"
        asset_map[url] = {"local": "/sites/prayag/" + rel, "from": origin}
    return "/sites/prayag/" + rel if os.path.exists(dest) else url


def rewrite_href(href):
    m = re.match(r"^(?:https?://(?:www\.)?prayagindia\.com)?(/[^?#]*)?([?#].*)?$", href)
    if not m or href.startswith(("mailto:", "tel:")):
        return href
    path, tail = (m.group(1) or "/"), (m.group(2) or "")
    slug = path.strip("/")
    if path.startswith("/sites/default/files/"):
        return local_asset(path)
    if slug in slugs or slug in LOCAL_PAGES:
        return "/" + slug + tail
    return SOURCE + path + tail


def sanitize(body):
    body = re.sub(r"<script\b.*?</script>", "", body, flags=re.S | re.I)
    body = re.sub(r"<(iframe|object|embed)\b.*?</\1>", "", body, flags=re.S | re.I)
    body = re.sub(r"\s+on[a-z]+\s*=\s*(\"[^\"]*\"|'[^']*'|[^\s>]+)", "", body, flags=re.I)
    body = re.sub(r"(href|src)\s*=\s*\"\s*javascript:[^\"]*\"", r'\1="#"', body, flags=re.I)
    # One h1 per page: the banner title. Demote any h1 inside article bodies.
    body = re.sub(r"<(/?)h1\b", r"<\1h2", body, flags=re.I)
    body = re.sub(r'(<img\b[^>]*\bsrc=")([^"]+)"', lambda m: m.group(1) + local_asset(m.group(2)) + '"', body)
    body = re.sub(r'(<a\b[^>]*\bhref=")([^"]*)"', lambda m: m.group(1) + rewrite_href(m.group(2)) + '"', body)
    return body.strip()


out_dir = os.path.join(root, "src/content/prayag/blog")
os.makedirs(os.path.join(out_dir, "articles"), exist_ok=True)
index = []
for a in articles:
    thumb = local_asset(a["listImg"])
    banner = local_asset(a["bannerImg"])
    index.append({
        "slug": a["slug"], "year": a["year"], "timestamp": a["ts"], "date": a["listDate"],
        "title": a["listTitle"], "image": thumb, "imageAlt": a["listAlt"],
    })
    article = {
        "slug": a["slug"], "title": a["title"], "published": a["published"], "timestamp": a["ts"],
        "metaTitle": a["metaTitle"], "description": a["description"],
        "bannerImage": banner, "bannerAlt": a["bannerAlt"],
        "bodyHtml": sanitize(a["body"]),
        "related": [
            {"slug": rewrite_href(r["href"]).lstrip("/") if rewrite_href(r["href"]).startswith("/") else None,
             "href": rewrite_href(r["href"]), "image": local_asset(r["img"]), "imageAlt": r["alt"],
             "title": r["title"], "excerpt": r["excerpt"]}
            for r in a["related"]
        ],
    }
    json.dump(article, open(os.path.join(out_dir, "articles", a["slug"] + ".json"), "w"), ensure_ascii=False, indent=1)

json.dump(index, open(os.path.join(out_dir, "index.json"), "w"), ensure_ascii=False, indent=1)
json.dump(asset_map, open(map_out, "w"), indent=1)
missing = [k for k, v in asset_map.items() if v["from"].startswith("MISSING")]
print(f"articles {len(articles)} assets {len(asset_map)} "
      f"backup {sum(v['from'] == 'backup' for v in asset_map.values())} "
      f"live {sum(v['from'] == 'live' for v in asset_map.values())} missing {len(missing)}")
for m in missing:
    print("MISSING", m, asset_map[m]["from"])

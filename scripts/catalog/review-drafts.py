"""Read-only review of draft products (and of sheet rows held for missing names).

Usage: python3 -I scripts/catalog/review-drafts.py <run-id>
       (PRAYAG_BACKUP_FILES=<drupal sites/default/files> overrides the backup location)

Reads data/prayag.db (read-only), the Drupal backup's file names (for image candidates),
data/catalog/sheet-tabs.json and
data/catalog/reports/run-<id>-preview.json; writes to data/catalog/reports/:
  drafts-review.md / drafts-review.csv   every draft grouped by category, with flags
  hardware-held.md / hardware-held.csv   rows held for missing product names (codes + highlights)
Nothing in the database is changed.
"""

import collections
import csv
import html
import itertools
import json
import os
import re
import sqlite3
import sys

RUN = int(sys.argv[1])
REPORTS = "data/catalog/reports"
con = sqlite3.connect("file:data/prayag.db?mode=ro", uri=True)
con.row_factory = sqlite3.Row
tabs = json.load(open("data/catalog/sheet-tabs.json"))["tabs"]
preview = json.load(open(f"{REPORTS}/run-{RUN}-preview.json"))

key = lambda s: re.sub(r"[^A-Z0-9]", "", (s or "").upper())
tk = lambda s: re.sub(r"[^a-z0-9]+", " ", (s or "").lower()).strip()
base = lambda s: key(re.sub(r"[-\s]?(RG|G|B|BL|BK|CP|CH|W|R|N|S)$", "", (s or "").upper().strip()))
strip = lambda h: re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", h or ""))).strip()
TYPOS = re.compile(r"\b(blow|bolw|temprature|compatiable|saftery|proctection|peral|tumble holder)\b", re.I)

cats = {r["id"]: r for r in con.execute("select id, name, parent_id, slug from categories")}


def path(cid):
    c = cats[cid]
    return f"{cats[c['parent_id']]['name']} › {c['name']}" if c["parent_id"] else c["name"]


def root(cid):
    while cats[cid]["parent_id"]:
        cid = cats[cid]["parent_id"]
    return cid


products = {r["id"]: dict(r) for r in con.execute("select * from products")}
pcats = collections.defaultdict(list)
for r in con.execute("select product_id, category_id, is_primary from product_categories order by is_primary desc"):
    pcats[r["product_id"]].append(r["category_id"])
attrs = collections.defaultdict(list)
for r in con.execute("select product_id, key, value, source from product_attributes order by key"):
    attrs[r["product_id"]].append(dict(r))
images = collections.Counter(r["product_id"] for r in con.execute("select product_id from product_images"))
created_ref = {}
for r in con.execute("select entity_id, after from audit_log where action = 'import.create'"):
    created_ref[r["entity_id"]] = json.loads(r["after"])["ref"]


def sheet_row(ref):
    tab, row = ref.split(":")
    hdr = [h.replace("\n", " ") for h in tabs[tab][0]]
    for r in tabs[tab][1:]:
        if r[0] == row:
            return {hdr[i]: v for i, v in enumerate(r) if i < len(hdr)}
    return {}


live = [p for p in products.values() if p["origin"] == "live-site"]
drafts = [p for p in products.values() if p["status"] == "draft"]
live_codes = {key(p["item_code"]): p for p in live if p["item_code"]}
live_no_code = [p for p in live if not p["item_code"]]
live_titles = {tk(p["title"]): p for p in live}
# Where live products of each type value live (primary category root), to spot odd assignments.
type_roots = collections.defaultdict(collections.Counter)
for p in live:
    for a in attrs[p["id"]]:
        if a["key"] == "type" and pcats[p["id"]]:
            type_roots[tk(a["value"])][root(pcats[p["id"]][0])] += 1
draft_bases = collections.Counter(base(p["item_code"]) for p in drafts)
# Candidate images: backup files named exactly like an item code (suggestions only, never assigned).
BACKUP = os.environ.get("PRAYAG_BACKUP_FILES", "/home/tanisha/Desktop/prayag/scannerwork/sites/default/files")
backup_files = collections.defaultdict(list)
if os.path.isdir(BACKUP):
    for d, _, fs in os.walk(BACKUP):
        if "/styles/" in d:
            continue
        for f in fs:
            if f.lower().endswith((".webp", ".png", ".jpg", ".jpeg")):
                backup_files[key(os.path.splitext(f)[0])].append(os.path.join(d, f)[len(BACKUP):])

rows = []
for p in sorted(drafts, key=lambda p: (path(pcats[p["id"]][0]) if pcats[p["id"]] else "~", p["item_code"] or "")):
    pid = p["id"]
    ref = created_ref.get(p["public_id"], "")
    src = sheet_row(ref) if ref else {}
    a = {}
    for x in attrs[pid]:
        a.setdefault(x["key"], []).append(x["value"])
    cat = path(pcats[pid][0]) if pcats[pid] else "(none)"
    flags = []
    if pcats[pid] and any(c["parent_id"] == pcats[pid][0] for c in cats.values()):
        flags.append(f"top-level category only (live products use its subcategories: {', '.join(c['name'] for c in cats.values() if c['parent_id'] == pcats[pid][0])})")
    if not images[pid]:
        cand = backup_files.get(key(p["item_code"]))
        flags.append(f"no image (candidate in backup: {', '.join(cand)})" if cand else "no image")
    desc = strip(p["description_html"])
    feats = json.loads(p["features"])
    if not desc:
        flags.append("no description")
    elif len(desc) < 25:
        flags.append(f'very short description ("{desc}")')
    if not feats:
        flags.append("no features")
    if not p["specs_html"]:
        flags.append("no specifications")
    if not p["seo_title"]:
        flags.append("no SEO title (default will be used)")
    if TYPOS.search(p["title"]):
        flags.append("possible typo in name")
    rest = re.sub(r"\bSS-?\d{3}\b", "", p["title"][len(p["item_code"] or ""):])  # SS-304 is a steel grade
    if re.search(r"\b[A-Z]{1,4}-?\d{2,}[A-Z0-9-]*\b", rest):
        flags.append("name contains another item code")
    if len(p["title"]) > 70:
        flags.append(f"long name ({len(p['title'])} chars)")
    if a.get("type") and tk(a["type"][0]) not in tk(p["title"]):
        flags.append(f'name does not contain the stored type "{a["type"][0]}"')
    # Possible duplicate of a live product that has no item code (generic title): same short
    # description, or that live page shows an image file named after this draft's code.
    for l in live_no_code:
        # A generic shared description only counts when the live title carries no code either.
        titled = bool(re.match(r"^\S*\d", l["title"]))
        same_desc = not titled and len(tk(p["short_description"])) >= 12 and tk(l["short_description"]) == tk(p["short_description"])
        shows_img = any(key(os.path.splitext(os.path.basename(r[0]))[0]) == key(p["item_code"]) for r in con.execute("select src from product_images where product_id = ?", (l["id"],)))
        if same_desc or shows_img:
            flags.append(f'POSSIBLE DUPLICATE of live "{l["title"]}" /{l["slug"]} (no item code; {"same description" if same_desc else ""}{" + " if same_desc and shows_img else ""}{"shows image " + p["item_code"] if shows_img else ""})')
    if p["item_code"] and key(p["item_code"]) in live_codes:
        flags.append(f"DUPLICATE code of live {live_codes[key(p['item_code'])]['title']}")
    if tk(p["title"]) in live_titles:
        flags.append(f"same name as live product {live_titles[tk(p['title'])]['item_code']}")
    if draft_bases[base(p["item_code"])] > 1:
        flags.append("shares a base code with another draft (finish/colour variants?)")
    for t in a.get("type", []):
        seen = type_roots.get(tk(t))
        if seen and pcats[pid] and root(pcats[pid][0]) not in seen:
            flags.append(f'live "{t}" products are in {", ".join(cats[r]["name"] for r in seen)}, this is in {cats[root(pcats[pid][0])]["name"]}')
    if src:
        if key(src.get("Product Code") or src.get("Name/ Item Code") or src.get("Name") or src.get("Name/ ITEM CODE") or "") != key(p["item_code"]):
            flags.append("item code differs from the sheet row")
        sheet_desc = (src.get("Product Description") or src.get("Product Description(80-100 words)") or "").strip()
        if sheet_desc and tk(sheet_desc) != tk(desc):
            flags.append("description differs from the sheet row")
        for k, v in src.items():
            if re.search(r"remarks|abacusdesk", k, re.I) and v.strip():
                flags.append(f"sheet note: {v.strip()[:70]}")
    else:
        flags.append("source row not found")
    rows.append({
        "category": cat, "code": p["item_code"] or "", "name": p["title"], "url": f"/{p['slug']}",
        "type": ", ".join(a.get("type", [])), "series": ", ".join(a.get("series", [])), "collection": ", ".join(a.get("collection", [])),
        "other": "; ".join(f"{k}: {', '.join(v)}" for k, v in a.items() if k not in ("type", "series", "collection")),
        "content": f"desc {'yes' if desc else 'no'}, features {len(feats)}, highlights {len(json.loads(p['highlights']))}, specs {'yes' if p['specs_html'] else 'no'}, images {images[pid]}",
        "source": ref, "flags": flags,
    })

def flag_label(f):
    if f.startswith("POSSIBLE DUPLICATE"):
        return "POSSIBLE DUPLICATE of a live product without item code"
    if f.startswith("live "):
        return re.sub(r'"[^"]*"', "…", f)
    return re.split(r'[("]', f)[0].strip().rstrip(":")


flag_counts = collections.Counter(flag_label(f) for r in rows for f in r["flags"])
L = [f"# Draft products review — {len(rows)} drafts (import run {RUN})", "",
     "Read-only report. Nothing was published, deleted or changed. Flags are for review; none is fixed automatically.", "",
     "## Flag summary", "", "| Flag | Drafts |", "|---|---|"]
L += [f"| {f} | {n} |" for f, n in flag_counts.most_common()]
L += ["", "## Drafts by category", ""]
for cat, group in itertools.groupby(rows, key=lambda r: r["category"]):
    group = list(group)
    L += [f"### {cat} ({len(group)})", "", "| Code | Name | Type | Series | Collection | Other attributes | Content | Source row | Flags |", "|---|---|---|---|---|---|---|---|---|"]
    for r in group:
        cell = lambda s: (s or "—").replace("|", "\\|")
        L.append(f"| {cell(r['code'])} | {cell(r['name'])} | {cell(r['type'])} | {cell(r['series'])} | {cell(r['collection'])} | {cell(r['other'])} | {r['content']} | {r['source']} | {cell('; '.join(r['flags']))} |")
    L.append("")
open(f"{REPORTS}/drafts-review.md", "w").write("\n".join(L) + "\n")
with open(f"{REPORTS}/drafts-review.csv", "w", newline="") as f:
    w = csv.writer(f)
    w.writerow(["category", "item_code", "name", "url", "type", "series", "collection", "other_attributes", "content", "source_row", "flags"])
    for r in rows:
        w.writerow([r["category"], r["code"], r["name"], r["url"], r["type"], r["series"], r["collection"], r["other"], r["content"], r["source"], " | ".join(r["flags"])])

held = [c for c in preview["changes"] if c["action"] == "review" and c["reasons"][0].startswith("held:")]
hardware = [c for c in held if c["rec"]["ref"].startswith("Hardware:")]
others = [c for c in held if not c["rec"]["ref"].startswith("Hardware:")]


def highlights(c):
    src = sheet_row(c["rec"]["ref"])
    return (src.get("Product Highlights(4-5Points)") or "").strip().replace("\n", "; ")


H = ["# Rows held for missing product names", "", "Not imported: the sheet gives only an item code. Please supply a product name for each row.", "",
     f"## Hardware ({len(hardware)} rows; category: Hardware)", "", "| # | Sheet row | Item code | Highlights (from the sheet) | Product name (to fill) |", "|---|---|---|---|---|"]
H += [f"| {i} | {c['rec']['ref']} | {c['rec']['code']} | {highlights(c).replace('|', '/') or '—'} |  |" for i, c in enumerate(hardware, 1)]
H += ["", f"## Other held rows ({len(others)})", "", "| Sheet row | Item code | Highlights | Product name (to fill) | Category (to confirm) |", "|---|---|---|---|---|"]
H += [f"| {c['rec']['ref']} | {c['rec']['code']} | {highlights(c).replace('|', '/') or '—'} |  |  |" for c in others]
open(f"{REPORTS}/hardware-held.md", "w").write("\n".join(H) + "\n")
with open(f"{REPORTS}/hardware-held.csv", "w", newline="") as f:
    w = csv.writer(f)
    w.writerow(["sheet_row", "item_code", "highlights", "product_name", "category"])
    for c in hardware + others:
        w.writerow([c["rec"]["ref"], c["rec"]["code"], highlights(c), "", "Hardware" if c in hardware else ""])
print(f"{len(rows)} drafts reviewed; {sum(1 for r in rows if r['flags'])} with flags; {len(held)} held rows listed")
for f, n in flag_counts.most_common():
    print(f"  {n:4}  {f}")


# ---------------------------------------------------------------------------------------------
# Proposals for review (read-only): nothing below changes the database.
# ---------------------------------------------------------------------------------------------
def md_table(header, body):
    out = ["| " + " | ".join(header) + " |", "|" + "---|" * len(header)]
    out += ["| " + " | ".join(str(c if c not in (None, "") else "—").replace("|", "/").replace("\n", " ") for c in row) + " |" for row in body]
    return out


def write_csv(name, header, body):
    with open(f"{REPORTS}/{name}", "w", newline="") as f:
        w = csv.writer(f)
        w.writerow(header)
        w.writerows(body)


draft_by_code = {p["item_code"]: p for p in drafts}

# 1. Images: assigned (audit), unassigned candidates and why, and how to match the rest.
assigned = {r["entity_id"]: json.loads(r["after"]) for r in con.execute("select entity_id, after from audit_log where action = 'product.image.assign'")}
I = ["# Draft images — matching report", "",
     "An image is assigned only when the backup file name equals the item code, the picture shows that product type, and no other product uses the file.", "",
     "## Assigned"]
I += md_table(["Code", "Product", "Image", "Basis"], [[p["item_code"], p["title"], assigned[p["public_id"]]["src"], assigned[p["public_id"]]["basis"]] for p in drafts if p["public_id"] in assigned])
held_imgs = []
for p in drafts:
    if p["public_id"] in assigned or not backup_files.get(key(p["item_code"])):
        continue
    f = backup_files[key(p["item_code"])][0]
    users = [r[0] for r in con.execute("select pr.title from product_images i join products pr on pr.id = i.product_id where i.src = ?", ("/sites/prayag/files" + f,))]
    held_imgs.append([p["item_code"], p["title"], f, f"file already shown on live product(s): {', '.join(users)}" if users else "not clearly matching"])
I += ["", "## Not assigned (uncertain)"] + md_table(["Code", "Product", "Candidate file", "Why not"], held_imgs)
I += ["", f"## Remaining {sum(1 for p in drafts if not images[p['id']])} drafts without an image", "",
      "No file in the Drupal backup is named after their item codes. When images arrive:",
      "1. name each file exactly like the item code (e.g. `BHS-802RG.webp`; spaces or hyphens do not matter for matching);",
      "2. put them in one folder and send it — the same matching (code in the file name, content checked, file not used elsewhere) is re-run and produces this report again;",
      "3. or add them per product in the admin (Products → product → Images: `/path | alt text`).", ""]
open(f"{REPORTS}/images-review.md", "w").write("\n".join(I) + "\n")

# 2. Bathroom Accessories subcategory proposal (from live data first, then keywords).
live_type_sub = collections.defaultdict(collections.Counter)
for r in con.execute("""select a.value, c.name from products pr join product_categories pc on pc.product_id = pr.id
        join categories c on c.id = pc.category_id join categories par on par.id = c.parent_id
        join product_attributes a on a.product_id = pr.id and a.key = 'type'
        where par.slug = 'bathroom-accessories' and pr.origin = 'live-site'"""):
    live_type_sub[tk(r[0])][r[1]] += 1
SHOWER = re.compile(r"hand shower|over ?head|overhead|ceiling shower|rain shower|wall shower|shower arm|\bohs\b|drizzle shower|passion shower|ss shower \d", re.I)
NO_FIT = re.compile(r"sink mixer|thermostatic diverter|connection tube|bottle trap|angle cock|flush cock|push cock|bath set", re.I)
S = []
for p in drafts:
    if not pcats[p["id"]] or cats[pcats[p["id"]][0]]["slug"] != "bathroom-accessories":
        continue
    t = ", ".join(x["value"] for x in attrs[p["id"]] if x["key"] == "type")
    seen = live_type_sub.get(tk(t))
    if seen and len(seen) == 1:
        sub, conf, why = next(iter(seen)), "high", f"{sum(seen.values())} live product(s) of type \"{t}\" are in {next(iter(seen))}"
    elif NO_FIT.search(t + " " + p["title"]):
        sub, conf, why = "(decide)", "needs decision", "neither Shower nor Accessories fits clearly"
    elif SHOWER.search(t + " " + p["title"]):
        sub, conf, why = "Shower", "medium", "shower keyword in type/title"
    else:
        sub, conf, why = "Accessories", "medium", "bathroom accessory (no shower keyword)"
    S.append([p["item_code"], p["title"], t, "Bathroom Accessories", f"Bathroom Accessories › {sub}" if sub != "(decide)" else "(decide)", conf, why, created_ref.get(p["public_id"], "")])
S.sort(key=lambda r: ({"high": 0, "medium": 1}.get(r[5], 2), r[4], r[0]))
counts = collections.Counter((r[4], r[5]) for r in S)
B2 = ["# Proposed Bathroom Accessories subcategories (not applied)", "",
      f"{len(S)} drafts sit directly in Bathroom Accessories. Live products use the subcategories Shower and Accessories, but not consistently (some overhead showers, body jets and shower tubes are in Accessories on the live site).", "",
      "Summary: " + "; ".join(f"{k[0]} ({k[1]}): {n}" for k, n in sorted(counts.items())), ""]
B2 += md_table(["Code", "Product", "Type", "Category now", "Proposed", "Confidence", "Basis", "Sheet row"], S)
other_top = [p for p in drafts if pcats[p["id"]] and cats[pcats[p["id"]][0]]["slug"] != "bathroom-accessories" and any(c["parent_id"] == pcats[p["id"]][0] for c in cats.values())]
if other_top:
    B2 += ["", "## Other drafts at a category with subcategories (not Bathroom Accessories)"]
    B2 += md_table(["Code", "Product", "Category now", "Subcategories"], [[p["item_code"], p["title"], path(pcats[p["id"]][0]), ", ".join(c["name"] for c in cats.values() if c["parent_id"] == pcats[p["id"]][0])] for p in other_top])
open(f"{REPORTS}/ba-subcategory-proposal.md", "w").write("\n".join(B2) + "\n")
write_csv("ba-subcategory-proposal.csv", ["item_code", "name", "type", "category_now", "proposed", "confidence", "basis", "sheet_row"], S)

# 3. Variant groups (kept as separate drafts).
V = ["# Likely variants among the drafts (kept as separate products)", "",
     "Grouped by item code without its last colour/finish/material letter(s). Differences are read from the names.", ""]
groups = collections.defaultdict(list)
for p in drafts:
    groups[base(p["item_code"])].append(p)
WORDS = re.compile(r"\b(black|gold|rose gold|rose|chrome|white|ss|brass|abs|matt|glossy)\b", re.I)
vrows = []
for b, ps in sorted(groups.items()):
    if len(ps) < 2:
        continue
    lv = [p for p in live if p["item_code"] and base(p["item_code"]) == b]
    for p in sorted(ps, key=lambda x: x["item_code"]):
        rest = p["title"][len(p["item_code"]):] + " " + (p["short_description"] or "")  # name + description
        diff = sorted({w.lower() for w in WORDS.findall(rest)})
        suffix = p["item_code"].upper()[len(re.sub(r"[-\s]?(RG|G|B|BL|BK|CP|CH|W|R|N|S)$", "", p["item_code"].upper())):]
        vrows.append([b, p["item_code"], p["title"], suffix.strip("- ") or "(base)", ", ".join(diff) or "—", ", ".join(x["item_code"] for x in lv) or "—"])
V += md_table(["Base", "Code", "Product", "Suffix", "Colour / finish / material words", "Live products with this base"], vrows)
open(f"{REPORTS}/variants-review.md", "w").write("\n".join(V) + "\n")

# 4. The four potential category errors.
C4 = ["# Potential category errors (not changed)", ""]
crow = []
for code in ["BEA-21", "BEA-22", "BEA-23", "PR-144"]:
    p = draft_by_code.get(code)
    if not p:
        continue
    t = ", ".join(x["value"] for x in attrs[p["id"]] if x["key"] == "type")
    live_same = collections.Counter(path(pcats[l["id"]][0]) for l in live if pcats[l["id"]] and any(a["key"] == "type" and tk(a["value"]) == tk(t) for a in attrs[l["id"]]))
    src = sheet_row(created_ref.get(p["public_id"], "")) if created_ref.get(p["public_id"]) else {}
    crow.append([code, p["title"], path(pcats[p["id"]][0]), ", ".join(f"{k} ({n})" for k, n in live_same.most_common()), live_same.most_common(1)[0][0] if live_same else "—",
                 created_ref.get(p["public_id"], ""), f'category "{src.get("Product Category", "")}", type "{src.get("Product Type", "")}", series "{src.get("Product Series", "")}"'])
C4 += md_table(["Code", "Product", "Category now", "Live products of this type are in", "Proposed", "Sheet row", "Sheet details"], crow)
C4 += ["", "These are CP-tab rows the sheet labels \"Bathroom Accessories\"; on the live site bottle traps and angle cocks are PTMT products. They may be CP (chrome) versions — confirm before moving."]
open(f"{REPORTS}/category-check.md", "w").write("\n".join(C4) + "\n")

# 5. Hardware: proposed names derived only from the sheet highlights (not saved).
def propose(code, hl):
    words = []
    fixes = []
    for w in hl.split():
        u = w.upper()
        if u == "HING":
            words.append("Hinge"); fixes.append('"HING" spelled "Hinge"')
        elif re.sub(r"[^A-Z]", "", u) == "MM":
            words.append(re.sub(r"MM", "mm", w, flags=re.I))
        elif re.search(r"\d", w) or u in ("SS", "PVC", "CP") or u.startswith("SS-"):
            words.append(w)
        elif re.fullmatch(r"[A-Z]{2}", w):
            words.append(w); fixes.append(f'unexplained abbreviation "{w}" kept as written')
        else:
            words.append(w.capitalize())
    name = " ".join(words)
    truncated = name.count("(") != name.count(")")
    if truncated:
        return f"{code} {name}", "low", "highlight looks cut off in the sheet (unclosed bracket)" + (f"; {fixes[0]}" if fixes else "")
    number = re.sub(r"\D", "", code)
    if number and re.search(rf"\b{number}\b", hl):
        fixes.append(f"the name repeats the code number {number}")
    if fixes:
        return f"{code} {name}", "medium", "; ".join(fixes) + "; otherwise the highlight text as given"
    return f"{code} {name}", "high", "highlight text as given, normalised capitalisation" + ("; trailing 202/304 kept as in the sheet (likely steel grade)" if re.search(r"\b(202|304)$", hl) else "")


hw_rows = []
for c in hardware:
    hl = highlights(c)
    name, conf, why = propose(c["rec"]["code"], hl)
    hw_rows.append([c["rec"]["code"], hl, name, conf, why, c["rec"]["ref"]])
write_csv("hardware-names-proposal.csv", ["item_code", "original_highlight", "proposed_name", "confidence", "reason", "sheet_row"], hw_rows)
HN = ["# Hardware — proposed product names (NOT saved)", "", "Derived only from each row's highlight; follows the live naming pattern \"CODE name\". Approve, edit or reject per row.", "",
      "Confidence: " + ", ".join(f"{k} {n}" for k, n in collections.Counter(r[3] for r in hw_rows).most_common()), ""]
HN += md_table(["Code", "Original highlight", "Proposed name", "Confidence", "Reason", "Sheet row"], hw_rows)
open(f"{REPORTS}/hardware-names-proposal.md", "w").write("\n".join(HN) + "\n")
print(f"proposals: images {len(assigned)} assigned / {len(held_imgs)} held; subcategories {len(S)} ({dict(collections.Counter(r[5] for r in S))}); "
      f"variant rows {len(vrows)}; category check {len(crow)}; hardware names {dict(collections.Counter(r[3] for r in hw_rows))}")

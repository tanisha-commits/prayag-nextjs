"""Copy the product images / highlight icons the catalog references from the read-only Drupal backup.

Usage: python3 -I scripts/catalog/copy-assets.py data/catalog/live-products.json <drupal-backup-root> docs/research/prayag/catalog-assets.json

/sites/default/files/<dir>/<name> -> public/sites/prayag/files/<dir>/<sanitised name> (same naming as
scripts/prayag-assets.py and src/lib/catalog/assets.ts). Files are copied, never moved; an existing
different file is never overwritten (reported instead).
"""
import filecmp, json, os, re, shutil, sys, urllib.parse

live, backup, mapout = sys.argv[1:4]
paths = set()
for p in json.load(open(live)):
    paths |= {i["src"] for i in p["images"]} | {h["icon"] for h in p["highlights"] if h["icon"]}
res, conflicts = {}, []
for src in sorted(paths):
    rel = urllib.parse.unquote(urllib.parse.urlparse(src).path)
    if not rel.startswith("/sites/default/files/"):
        continue
    d, f = os.path.split(rel[len("/sites/default/files/"):])
    local = "/sites/prayag/files/" + (d + "/" if d else "") + re.sub(r"[^A-Za-z0-9._-]+", "-", f).strip("-")
    srcf, dest = backup + rel, "public" + local
    if not os.path.isfile(srcf):
        res[src] = {"local": None, "from": "MISSING in backup"}
        continue
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    if os.path.exists(dest) and not filecmp.cmp(srcf, dest, shallow=False):
        conflicts.append(local)
        continue
    if not os.path.exists(dest):
        shutil.copyfile(srcf, dest)
    res[src] = {"local": local, "from": "backup", "bytes": os.path.getsize(dest)}
json.dump(res, open(mapout, "w"), indent=1)
print(f"{len(res)} files mapped, {sum(1 for v in res.values() if v['from'] != 'backup')} missing, {len(conflicts)} conflicts", conflicts[:5])

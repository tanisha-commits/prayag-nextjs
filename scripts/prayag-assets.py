"""Copy the assets a Prayag source page references into public/sites/prayag/.

Usage: python3 -I scripts/prayag-assets.py <page.html> <drupal-backup-root> public/sites/prayag <map.json>

Files are copied (never moved) from the read-only Drupal backup when present; otherwise
they are fetched from https://prayagindia.com with a GET. Names are sanitised and the
source URL -> local path -> origin mapping is written to <map.json>. Verify content types
afterwards (`file --mime-type`): the live site answers missing files with an HTML page.
"""
import sys, re, json, os, shutil, urllib.parse, urllib.request
html, backup, pub, mapout = sys.argv[1:5]
h = open(html).read()
b = h[h.find('<body'):]
b = re.sub(r'<script.*?</script>', '', b, flags=re.S)
urls = set(re.findall(r'(?:src|srcset|data-mobile-logo|data-sticky-logo)="([^"]+)"', b))
urls |= set(re.findall(r'href="([^"]+\.pdf)"', b))
urls = {u for u in urls if (u.startswith('/') or u.startswith('https://prayagindia.com')) and 'placeholder' not in u}
def norm(u):
    p = urllib.parse.urlparse(u).path
    p = re.sub(r'/+', '/', p)
    return urllib.parse.unquote(p)
def local_name(p):
    if p.startswith('/themes/custom/prayag/assets/images/'): rel = 'theme/' + p[len('/themes/custom/prayag/assets/images/'):]
    elif p.startswith('/sites/default/files/styles/webp/public/'): rel = 'files/' + p[len('/sites/default/files/styles/webp/public/'):]
    elif p.startswith('/sites/default/files/'): rel = 'files/' + p[len('/sites/default/files/'):]
    else: rel = 'misc' + p
    d, f = os.path.split(rel)
    f = re.sub(r'[^A-Za-z0-9._-]+', '-', f).strip('-')
    return d + '/' + f
res = {}
for u in sorted(urls):
    p = norm(u)
    rel = local_name(p)
    dest = os.path.join(pub, rel)
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    src_local = os.path.join(backup, p.lstrip('/'))
    origin = None
    if '/styles/webp/' not in p and os.path.isfile(src_local):
        shutil.copyfile(src_local, dest); origin = 'backup'
    else:
        try:
            req = urllib.request.Request('https://prayagindia.com' + urllib.parse.quote(p), headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req, timeout=60) as r: data = r.read()
            # The live site answers missing files with an HTML page (HTTP 200); never save that as an asset.
            if data[:15].lstrip().lower().startswith((b'<!doctype', b'<html')):
                origin = 'MISSING (live returned HTML)'
            else:
                open(dest, 'wb').write(data)
                origin = 'live'
        except Exception as e:
            origin = 'FAILED ' + str(e)
    res[u] = {'local': '/sites/prayag/' + rel, 'from': origin, 'bytes': os.path.getsize(dest) if os.path.exists(dest) else 0}
json.dump(res, open(mapout, 'w'), indent=1)
for u, v in res.items(): print(v['from'][:6], v['bytes'], v['local'])

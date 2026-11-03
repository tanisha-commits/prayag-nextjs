"""Pixel-compare the live/local screenshot pairs written by scripts/qa/compare.mjs.

Usage: python3 -I scripts/qa/pixel-diff.py <out-dir>

For every <name>-live.png / <name>-local.png pair, prints the share of differing pixels (channel
difference > 40, which ignores anti-aliasing noise) over the common height, and writes
<name>-diff.png: live | local | differences in red. Needs Pillow.
"""
import glob
import sys

from PIL import Image, ImageChops

out = sys.argv[1]
for live_path in sorted(glob.glob(f"{out}/*-live.png")):
    name = live_path[: -len("-live.png")]
    try:
        live, local = Image.open(live_path).convert("RGB"), Image.open(f"{name}-local.png").convert("RGB")
    except FileNotFoundError:
        continue
    w, h = min(live.width, local.width), min(live.height, local.height)
    a, b = live.crop((0, 0, w, h)), local.crop((0, 0, w, h))
    mask = ImageChops.difference(a, b).convert("L").point(lambda v: 255 if v > 40 else 0)
    changed = sum(1 for v in mask.getdata() if v)
    rows = [y for y in range(0, h, 8) if mask.crop((0, y, w, min(y + 8, h))).getbbox()]
    bands, start = [], None
    for i, y in enumerate(rows):
        if start is None:
            start = y
        if i + 1 == len(rows) or rows[i + 1] != y + 8:
            bands.append(f"{start}-{y + 8}")
            start = None
    print(f"{name.split('/')[-1]}: {100 * changed / (w * h):.2f}% px differ (live h={live.height}, local h={local.height}); bands: {', '.join(bands[:12])}{' …' if len(bands) > 12 else ''}")
    sheet = Image.new("RGB", (w * 3, h), "white")
    sheet.paste(a, (0, 0))
    sheet.paste(b, (w, 0))
    red = Image.new("RGB", (w, h), (255, 0, 0))
    sheet.paste(Image.composite(red, a.point(lambda v: v // 3 + 170), mask), (2 * w, 0))
    sheet.thumbnail((1800, 6000))
    sheet.save(f"{name}-diff.png")

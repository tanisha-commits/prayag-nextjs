import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const THEME = "public/sites/prayag/theme";
const OUT = path.join(THEME, "hero");

const jobs = [
  { src: "prayag-homepage/kung-fu-banner.webp", widths: [1080, 1440], quality: 75 },
  { src: "prayag-homepage/prayag-shader-banner.webp", widths: [1080, 1440], quality: 75 },
  { src: "prayag-homepage/Malaika-banner.webp", widths: [1080, 1440], quality: 75 },
  { src: "mobile-banner-.webp", widths: [480, 640], quality: 80 },
  { src: "prayag-mobile-banner-2.webp", widths: [480, 640, 800], quality: 80 },
  { src: "Prayag-mobile-banner-3.webp", widths: [480, 640], quality: 80 },
];

fs.mkdirSync(OUT, { recursive: true });
for (const { src, widths, quality } of jobs) {
  const name = path.basename(src, ".webp");
  for (const width of widths) {
    const out = path.join(OUT, `${name}-${width}w.webp`);
    if (fs.existsSync(out)) continue;
    const info = await sharp(path.join(THEME, src))
      .resize({ width })
      .webp({ quality, effort: 6, smartSubsample: true })
      .toFile(out);
    console.log(`${out}  ${info.width}x${info.height}  ${info.size} B`);
  }
}

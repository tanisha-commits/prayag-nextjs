import type { Metadata } from "next";
import { withBasePath } from "@/lib/base-path";
import { SITE_URL } from "@/components/sites/prayag/seo";
import "./globals.css";

// Graphik is the face the Prayag Drupal theme ships (themes/custom/prayag/assets/fonts). The files
// in /sites/prayag/fonts/subset are those faces subset to the Latin range Google Fonts uses (about
// half the size, ~20 KB each; kerning, ligatures and tabular figures kept). Every character the site
// shows that Graphik has is covered; emoji/✅ never came from Graphik. Originals: one folder up.
//
// Faces load only when a page uses them (no preload: Lighthouse counts preloaded fonts in the
// first-paint path, which cost ~1 s of mobile FCP/LCP in its simulation). Declared here rather than
// with next/font so the files keep fixed, cacheable URLs. The fallback keeps next/font's computed
// Arial metrics, so the swap does not shift layout.
const FONT_DIR = "/sites/prayag/fonts/subset";
const FACES = [
  ["Light", 300, "normal"], ["Regular", 400, "normal"], ["Medium", 500, "normal"], ["Semibold", 600, "normal"], ["Bold", 700, "normal"],
  ["LightItalic", 300, "italic"], ["RegularItalic", 400, "italic"], ["MediumItalic", 500, "italic"], ["SemiboldItalic", 600, "italic"], ["BoldItalic", 700, "italic"],
] as const;
const FONT_CSS =
  FACES.map(([name, weight, style]) => `@font-face{font-family:graphik;src:url(${withBasePath(`${FONT_DIR}/Graphik-${name}.woff2`)}) format("woff2");font-display:swap;font-weight:${weight};font-style:${style}}`).join("") +
  '@font-face{font-family:"graphik Fallback";src:local(Arial);ascent-override:76.94%;descent-override:17.13%;line-gap-override:9.42%;size-adjust:106.3%}' +
  ':root{--font-graphik:"graphik","graphik Fallback"}';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Prayag Polymers Limited - India's No.1 Sanitaryware Manufacturer",
  description:
    "Prayag Polymers Limited is India’s leading Sanitaryware manufacturing brand. It offers a premium, wide range of reliable, and affordable sanitary products in India.",
  alternates: { canonical: "/" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased">
      <head>
        <style href="graphik" precedence="default">
          {FONT_CSS}
        </style>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}

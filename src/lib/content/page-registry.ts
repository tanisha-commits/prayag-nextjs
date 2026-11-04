// Every page that can carry Markdown sections and SEO overrides (src/app/(pages)/* plus home).
// Keys are the URL slugs; "home" is /. Keep in sync when a page folder is added.
export const SITE_PAGES = [
  { slug: "home", path: "/", title: "Home", group: "Home" },
  { slug: "plumbing-solutions", path: "/plumbing-solutions", title: "Plumbing Solutions", group: "Products" },
  { slug: "faucets", path: "/faucets", title: "CP Faucets", group: "Products" },
  { slug: "ptmt-taps", path: "/ptmt-taps", title: "PTMT Taps", group: "Products" },
  { slug: "ceramicware", path: "/ceramicware", title: "CeramicWare", group: "Products" },
  { slug: "pipes-fittings", path: "/pipes-fittings", title: "Pipes & Fittings", group: "Products" },
  { slug: "kitchen-sinks", path: "/kitchen-sinks", title: "Kitchen Sinks", group: "Products" },
  { slug: "water-heaters", path: "/water-heaters", title: "Water Heaters", group: "Products" },
  { slug: "storage-tank", path: "/storage-tank", title: "Storage Tank", group: "Products" },
  { slug: "bathroom-accessories", path: "/bathroom-accessories", title: "Bathroom Accessories", group: "Products" },
  { slug: "hardware", path: "/hardware", title: "Hardware", group: "Products" },
  { slug: "traps", path: "/traps", title: "Traps", group: "Products" },
  { slug: "products", path: "/products", title: "Products", group: "Products" },
  { slug: "hdpe", path: "/hdpe", title: "HDPE", group: "Plumbing solutions" },
  { slug: "agritech", path: "/agritech", title: "Agritech", group: "Plumbing solutions" },
  { slug: "swr-plumbing-solution", path: "/swr-plumbing-solution", title: "SWR Plumbing Solution", group: "Plumbing solutions" },
  { slug: "cpvc-plumbing-solution", path: "/cpvc-plumbing-solution", title: "CPVC Plumbing Solution", group: "Plumbing solutions" },
  { slug: "casing-pipes", path: "/casing-pipes", title: "Casing Pipes", group: "Plumbing solutions" },
  { slug: "composite-pipes", path: "/composite-pipes", title: "Composite Pipes", group: "Plumbing solutions" },
  { slug: "ugd-pipes-fittings", path: "/ugd-pipes-fittings", title: "UGD Pipes & Fittings", group: "Plumbing solutions" },
  { slug: "upvc-column-pipes", path: "/upvc-column-pipes", title: "uPVC Column Pipes", group: "Plumbing solutions" },
  { slug: "ppr-pipes", path: "/ppr-pipes", title: "PPR Pipes", group: "Plumbing solutions" },
  { slug: "pvc-o-pipes", path: "/pvc-o-pipes", title: "PVC-O Pipes", group: "Plumbing solutions" },
  { slug: "prayag-ka-bablu-plumbers-loyalty-program", path: "/prayag-ka-bablu-plumbers-loyalty-program", title: "Prayag Ka Bablu (Plumbers Loyalty Program)", group: "Plumbing solutions" },
  { slug: "press-coverages", path: "/press-coverages", title: "Press Coverage", group: "Inspiration" },
  { slug: "product-video", path: "/product-video", title: "Product Video", group: "Inspiration" },
  { slug: "video-tv-advertisement", path: "/video-tv-advertisement", title: "Video / TV Advertisement", group: "Inspiration" },
  { slug: "feedback-videos", path: "/feedback-videos", title: "Feedback Videos", group: "Inspiration" },
  { slug: "warranty-policy", path: "/warranty-policy", title: "Warranty Policy", group: "Inspiration" },
  { slug: "blog", path: "/blog", title: "Blog", group: "Inspiration" },
  { slug: "about-prayag", path: "/about-prayag", title: "About Prayag", group: "About" },
  { slug: "ceo-profile", path: "/ceo-profile", title: "CEO Profile", group: "About" },
  { slug: "sustainability", path: "/sustainability", title: "Sustainability", group: "About" },
  { slug: "manufacturing-process", path: "/manufacturing-process", title: "Manufacturing Process", group: "About" },
  { slug: "contact-us", path: "/contact-us", title: "Contact Us", group: "Contact & info" },
  { slug: "dealership-enquiry", path: "/dealership-enquiry", title: "Dealership Enquiry", group: "Contact & info" },
  { slug: "download-cataglogue", path: "/download-cataglogue", title: "Download Catalogue", group: "Contact & info" },
  { slug: "faq", path: "/faq", title: "FAQ", group: "Contact & info" },
  { slug: "privacy-policy", path: "/privacy-policy", title: "Privacy Policy", group: "Contact & info" },
] as const;

export type SitePageSlug = (typeof SITE_PAGES)[number]["slug"];

export function sitePage(slug: string) {
  return SITE_PAGES.find((p) => p.slug === slug);
}

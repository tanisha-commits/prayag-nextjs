// Content for the Prayag homepage, taken from https://prayagindia.com/ (page--homepage.html.twig).
// Cloned routes use local paths; routes not yet cloned still point at the live site (SOURCE).

export const SOURCE = "https://prayagindia.com";
const ASSET = "/sites/prayag";

export interface NavLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface MegaMenu {
  label: string;
  links: NavLink[];
  image: string;
  /** Products lists in two columns; the other menus in one. */
  columns: 1 | 2;
}

export const productCategories: NavLink[] = [
  { label: "Plumbing Solutions", href: "/plumbing-solutions" },
  { label: "CP Faucets", href: `${SOURCE}/faucets` },
  { label: "PTMT", href: `${SOURCE}/ptmt-taps` },
  { label: "CeramicWare", href: `${SOURCE}/ceramicware` },
  { label: "Pipes & Fittings", href: `${SOURCE}/pipes-fittings` },
  { label: "Kitchen Sinks", href: `${SOURCE}/kitchen-sinks` },
  { label: "Water Heaters", href: `${SOURCE}/water-heaters` },
  { label: "Storage Tank", href: `${SOURCE}/storage-tank` },
  { label: "Bathroom Accessories", href: `${SOURCE}/bathroom-accessories` },
  { label: "Hardware", href: `${SOURCE}/hardware` },
];

// The live site hides "Pipes & Fittings" in the mega menu, product grid and footer via CSS.
export const visibleProductCategories = productCategories.filter(
  (c) => c.label !== "Pipes & Fittings",
);

// Local page offering View/Download of the official PDF (byte-identical copy of the live file).
const warrantyPolicy: NavLink = {
  label: "Warranty Policy",
  href: "/warranty-policy",
};

export const megaMenus: (MegaMenu | NavLink)[] = [
  {
    label: "Products",
    links: visibleProductCategories,
    image: `${ASSET}/theme/product-drop-down.webp`,
    columns: 2,
  },
  {
    label: "Inspiration",
    links: [
      { label: "Press Coverage", href: "/press-coverages" },
      { label: "Product Video", href: "/product-video" },
      { label: "Video / TV Advertisement", href: "/video-tv-advertisement" },
      warrantyPolicy,
    ],
    image: `${ASSET}/files/2025-01/blog-1-.webp`,
    columns: 1,
  },
  { label: "Blog", href: "/blog" },
  {
    label: "About",
    links: [
      { label: "About Prayag", href: "/about-prayag" },
      { label: "CEO Profile", href: "/ceo-profile" },
      { label: "Sustainability", href: "/sustainability" },
      { label: "Manufacturing Process", href: "/manufacturing-process" },
    ],
    image: `${ASSET}/files/2025-01/about-prayag-1-.webp`,
    columns: 1,
  },
  {
    label: "Contact",
    links: [
      { label: "Dealership Enquiry", href: "/dealership-enquiry" },
      { label: "Contact Us", href: "/contact-us" },
    ],
    image: `${ASSET}/files/2025-01/contact-us-1-.webp`,
    columns: 1,
  },
];

export const searchHref = `${SOURCE}/search/node?keys=products`;

export const plumbingSubcategories: NavLink[] = [
  { label: "HDPE", href: "/hdpe" },
  { label: "Agritec", href: "/agritech" },
  { label: "SWR Pipe", href: "/swr-plumbing-solution" },
  { label: "CPVC Pipes", href: "/cpvc-plumbing-solution" },
  { label: "Casing Pipes", href: "/casing-pipes" },
  { label: "Composite Pipes", href: "/composite-pipes" },
  { label: "UGD Pipes & Fittings", href: "/ugd-pipes-fittings" },
  { label: "uPVC Column Pipes", href: "/upvc-column-pipes" },
  { label: "PPR Pipes", href: "/ppr-pipes" },
  // Source links "/PVC-O%20Pipes", which the live site redirects to /pvc-o-pipes.
  { label: "PVC-O Pipes", href: "/pvc-o-pipes" },
];

export const panelQuickLinks: NavLink[] = [
  { label: "About Prayag", href: "/about-prayag" },
  { label: "CEO Profile", href: "/ceo-profile" },
  { label: "Sustainability", href: "/sustainability" },
  { label: "Manufacturing Process", href: "/manufacturing-process" },
  { label: "Press Coverage", href: "/press-coverages" },
  { label: "Product Video", href: "/product-video" },
  { label: "Video / TV Advertisement", href: "/video-tv-advertisement" },
  warrantyPolicy,
  { label: "Blog", href: "/blog" },
  { label: "Dealership Enquiry", href: "/dealership-enquiry" },
  { label: "Contact Us", href: "/contact-us" },
];

export const heroSlides = [
  {
    alt: "Prayag Sukoon",
    video: `${ASSET}/theme/prayag-homepage/video_banner.webm`,
    desktop: `${ASSET}/theme/prayag-homepage/kung-fu-banner.webp`,
    mobile: `${ASSET}/theme/mobile-banner-.webp`,
  },
  {
    alt: "Prayag Karate",
    video: `${ASSET}/theme/prayag-homepage/video_banner-2.webm`,
    desktop: `${ASSET}/theme/prayag-homepage/prayag-shader-banner.webp`,
    mobile: `${ASSET}/theme/prayag-mobile-banner-2.webp`,
  },
  {
    alt: "Prayag Malaika",
    video: `${ASSET}/theme/PrayagHomepageVideo.webm`,
    desktop: `${ASSET}/theme/prayag-homepage/Malaika-banner.webp`,
    mobile: `${ASSET}/theme/Prayag-mobile-banner-3.webp`,
  },
];

const productImages: Record<string, { src: string; alt: string }> = {
  "Plumbing Solutions": { src: `${ASSET}/files/2026-08/Plumbing-pipe.png`, alt: "Plumbing pipe" },
  "CP Faucets": { src: `${ASSET}/files/2025-07/PTMT.webp`, alt: "PTMT" },
  PTMT: { src: `${ASSET}/files/2026-06/New2.webp`, alt: "ptmp banner" },
  CeramicWare: { src: `${ASSET}/files/2025-07/Ceramicware.webp`, alt: "Ceramicware" },
  "Kitchen Sinks": { src: `${ASSET}/files/2025-07/Kitchen-sinks.webp`, alt: "Kitchen sinks" },
  "Water Heaters": { src: `${ASSET}/files/2025-07/Waterheaters.webp`, alt: "Waterheaters" },
  "Storage Tank": { src: `${ASSET}/files/2025-07/water-tanks.webp`, alt: "water tanks" },
  "Bathroom Accessories": {
    src: `${ASSET}/files/2025-07/Bathroom-accesssories.webp`,
    alt: "Bathroom accesssories",
  },
  Hardware: { src: `${ASSET}/files/2025-07/Hardware.webp`, alt: "Hardware" },
};

export const productTiles = visibleProductCategories.map((c) => ({
  ...c,
  ...productImages[c.label],
}));

export const whyPoints = [
  {
    icon: `${ASSET}/files/2024-09/Unparalleled-Quality.webp`,
    title: "India's First PTMT Innovator",
    text: "Rust-proof bathware since 1986, delivering unmatched durability ",
  },
  {
    icon: `${ASSET}/files/2024-09/Virtual-Endless-option.webp`,
    title: "Everything Under One Roof",
    text: "A complete bath-and-plumbing portfolio with over 4,500 SKUs across 9 categories",
  },
  {
    icon: `${ASSET}/files/2024-09/World-class-Service-Support.webp`,
    title: "Wherever You Are",
    text: "Nationwide reach  with 400+ channel partners & 15,000+ retail outlets",
  },
  {
    icon: `${ASSET}/files/2025-07/Credibility-Built-In.webp`,
    title: "Credibility Built In",
    text: "Trusted by leading clients across industries for decades",
  },
  {
    icon: `${ASSET}/files/2025-07/Eco-Smart-Solutions.webp`,
    title: "Eco Smart Solutions",
    text: "Sustainable innovation that delivers performance while keeping resources in check",
  },
];

export const whyImages = {
  top: `${ASSET}/files/2025-03/Why-Prayag-1.webp`,
  side: `${ASSET}/files/2025-07/whyprayag_home.webp`,
};

export const marqueeColumns = {
  up: [
    { src: `${ASSET}/files/2025-04/3.webp`, alt: "Image 1" },
    { src: `${ASSET}/files/2025-04/4.webp`, alt: "Image 2" },
    { src: `${ASSET}/files/2025-04/5.webp`, alt: "Image 4" },
  ],
  down: [
    { src: `${ASSET}/files/2025-04/washroom.webp`, alt: "Image 1" },
    { src: `${ASSET}/files/2025-04/sink.webp`, alt: "Image 4" },
    { src: `${ASSET}/files/2025-04/1.webp`, alt: "Image 4" },
  ],
};

export const stats = [
  { icon: `${ASSET}/icons/production-units.svg`, w: 39, h: 39, label: "Production Units", value: "5" },
  { icon: `${ASSET}/icons/skus.svg`, w: 39, h: 27, label: "SKUs", value: "4500+" },
  { icon: `${ASSET}/icons/employees.svg`, w: 39, h: 25, label: "Employees", value: "1600+" },
];

export const customerServiceImage = `${ASSET}/files/2025-01/Customer-Service.webp`;

export const sponsors = [
  { src: `${ASSET}/theme/King-XI-punjab.webp`, alt: "Punjab Kings", years: "2012-16, 18 & 19" },
  { src: `${ASSET}/theme/arise-cup.webp`, alt: "Punjab Kings", years: "2014" },
  { src: `${ASSET}/theme/Prayag_cup.webp`, alt: "Prayag Cup", years: "2015 & 2016" },
  { src: `${ASSET}/theme/Miss_diva.webp`, alt: "Miss Diva", years: "2015-16" },
  { src: `${ASSET}/theme/Delhi_Dynamos.webp`, alt: "Punjab Kings", years: "2015-17" },
  { src: `${ASSET}/theme/FBB-prayag.webp`, alt: "Punjab Kings", years: "2015-2017" },
  { src: `${ASSET}/theme/Atleticode_kolkata_logo.webp`, alt: "Punjab Kings", years: "2016" },
  { src: `${ASSET}/theme/Delhi_waveriders.webp`, alt: "Punjab Kings", years: "2016-17" },
  { src: `${ASSET}/theme/Patna_pirates.webp`, alt: "Patna Pirates", years: "2016-18" },
  { src: `${ASSET}/theme/Telgu_titans.webp`, alt: "Telugu Titans", years: "2019" },
  { src: `${ASSET}/theme/U_mumba.webp`, alt: "U Mumba", years: "2022 & 2024" },
  { src: `${ASSET}/theme/Tech_mahindra.webp`, alt: "Tech Mahindra", years: "2023" },
  { src: `${ASSET}/theme/Lucknow_super_gainats.webp`, alt: "Lucknow Super Giants", years: "2023" },
];

// The three most recent blog posts at capture time (2026-10-28). Titles are verbatim,
// including the ".webp" the source shows on the first card.
export const insights = [
  {
    href: "/double-bowl-kitchen-sink-price",
    src: `${ASSET}/files/2026-10/Double-Bowl-Kitchen-Sink-Price-Complete-Size-Buying-Guide.webp`,
    alt: "Double Bowl Kitchen Sink Price Complete Size Buying Guide.",
    title: "Double Bowl Kitchen Sink Price Complete Size Buying Guide.webp",
  },
  {
    href: "/kitchen-sink-with-drain-board-price",
    src: `${ASSET}/files/2026-10/Kitchen-Sink-with-Drain-Board-Price-Complete-Buying-Guide.webp`,
    alt: "Kitchen Sink with Drain Board Price Complete Buying Guide",
    title: "Kitchen Sink with Drain Board Price and Buying Guide",
  },
  {
    href: "/single-bowl-kitchen-sink-price",
    src: `${ASSET}/files/2026-10/Single-Bowl-Kitchen-Sink-Price-Complete-Size-Buying-Guide.webp`,
    alt: "Single Bowl Kitchen Sink Price Complete Size Buying Guide",
    title: "Single Bowl Kitchen Sink Price Complete Size Buying Guide",
  },
];

export const socialLinks = {
  facebook: "https://www.facebook.com/prayaglife/",
  twitter: "https://x.com/i/flow/login?redirect_after_login=%2Fprayaglife",
  youtube: "https://www.youtube.com/channel/UCCBcJ4tcq8yvx38Vc2xfBZQ",
  instagram: "https://www.instagram.com/prayaglife/",
  linkedin: "https://www.linkedin.com/company/prayagindia.com/",
};

export const socialIcons = {
  facebook: `${ASSET}/theme/Facebook.webp`,
  twitter: `${ASSET}/theme/twitter.webp`,
  youtube: `${ASSET}/theme/Youtube.webp`,
  instagram: `${ASSET}/theme/Instagram.webp`,
};

export const footerColumns: { title: string; links: NavLink[] }[] = [
  { title: "Products", links: visibleProductCategories },
  {
    title: "Media",
    links: [
      { label: "Press Coverage", href: "/press-coverages" },
      { label: "Product Videos", href: "/product-video" },
      { label: "Video / TV Advertisement", href: "/video-tv-advertisement" },
      { label: "Feedback Videos", href: "/feedback-videos" },
    ],
  },
  {
    title: "Information",
    links: [
      { label: "CEO  Profile", href: "/ceo-profile" },
      { label: "Sustainability", href: "/sustainability" },
      { label: "Blogs", href: "/blog" },
      { label: "Download", href: "/download-cataglogue" },
      warrantyPolicy,
      { label: "FAQ's", href: "/faq" },
      { label: "Contact Us", href: "/contact-us" },
      { label: "Privacy Policy", href: "/privacy-policy" },
    ],
  },
];

export const contact = {
  address:
    "2483-84, Prayag Infinity House, Nalwa Street, Behind Imperial Cinema, Paharganj, New Delhi – 110055",
  phones: [
    { label: "1800 257 0304", href: "tel:1800 257 0304" },
    { label: "011 41246500", href: "tel:011 4124 6500" },
  ],
  email: "enquiry@prayagindia.in",
};

export const logo = `${ASSET}/theme/logo.png`;
export const pageLinks = {
  manufacturing: "/manufacturing-process",
  contact: "/contact-us",
  blog: "/blog",
  hdpe: "/hdpe",
  bablu: "/prayag-ka-bablu-plumbers-loyalty-program",
  developer: "https://abacusdesk.co.in/",
};

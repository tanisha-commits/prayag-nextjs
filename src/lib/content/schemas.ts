// Editable content: one zod schema per entry. The schema validates every save (admin and Claude via
// MCP), drives the admin form (see ./fields.ts) and is described to Claude as JSON Schema. Defaults
// are the content the site shipped with, so an entry nobody has edited renders exactly as before.
// Plain module (no server-only): the MCP server and CLI scripts use it too.
import { z } from "zod";
import * as site from "@/components/sites/prayag/data";
import { faqTabs } from "@/content/prayag/faq/faq";
import { pressItems } from "@/content/prayag/press/items";
import { privacyPolicyHtml } from "@/content/prayag/privacy/policy";

/** Widgets the admin form knows; strings default to a one-line text input. */
export type Widget = "text" | "textarea" | "html" | "image" | "url" | "markdown";

const text = (title: string, description?: string) => z.string().max(2000).meta({ title, description });
const longText = (title: string, description?: string) => z.string().max(5000).meta({ title, description, widget: "textarea" });
const markdown = (title: string, description?: string) => z.string().max(300_000).meta({ title, description, widget: "markdown" });
const html = (title: string, description?: string) => z.string().max(500_000).meta({ title, description, widget: "html" });
// Links and images may be site paths, https:// URLs, or mailto:/tel: links; never script URLs.
const SAFE_LINK = /^\s*(?!(?:javascript|data|vbscript):)/i;
const safe = (s: z.ZodString) => s.max(1000).regex(SAFE_LINK, "Script links (javascript:, data:) are not allowed.");
const image = (title: string, description = "Path under /sites/prayag/… (as stored in public/), or a full https:// URL.") =>
  safe(z.string()).meta({ title, description, widget: "image" });
const url = (title: string, description = "Site path like /contact-us, or a full https:// URL.") => safe(z.string()).meta({ title, description, widget: "url" });
const list = <T extends z.ZodType>(item: T, title: string, description?: string) => z.array(item).max(500).meta({ title, description });

const navLink = z
  .object({
    label: text("Label"),
    href: url("Link"),
    external: z.boolean().optional().meta({ title: "Opens in a new tab" }),
  })
  .meta({ title: "Link" });

// ---------- site ----------

const contact = z.object({
  address: longText("Address"),
  phones: list(z.object({ label: text("Shown as"), href: text("Dial link", "tel: link, e.g. tel:1800 257 0304") }).meta({ title: "Phone" }), "Phone numbers"),
  email: z.string().email().meta({ title: "Email" }),
});

const social = z.object({
  facebook: url("Facebook"),
  twitter: url("X / Twitter"),
  youtube: url("YouTube"),
  instagram: url("Instagram"),
  linkedin: url("LinkedIn"),
});

const headerMenu = z
  .object({
    label: text("Menu label"),
    href: url("Link (only for a plain link without a drop-down)").optional(),
    links: list(navLink, "Drop-down links", "Leave empty for a plain link.").default([]),
    image: image("Drop-down image").optional(),
    imageWidth: z.number().int().positive().optional().meta({ title: "Image width (px)" }),
    imageHeight: z.number().int().positive().optional().meta({ title: "Image height (px)" }),
    columns: z.union([z.literal(1), z.literal(2)]).default(1).meta({ title: "Link columns" }),
  })
  .meta({ title: "Menu" });

const header = z.object({ menus: list(headerMenu, "Desktop & mobile menu") });

const drawer = z.object({
  plumbingLabel: text("Category group label"),
  plumbingHref: url("Category group link"),
  plumbing: list(navLink, "Category group links"),
  quickLinks: list(navLink, "Quick links"),
});

const footer = z.object({
  columns: list(z.object({ title: text("Column title"), links: list(navLink, "Links") }).meta({ title: "Column" }), "Footer columns"),
});

// ---------- home ----------

const hero = z.object({
  slides: list(
    z
      .object({
        alt: text("Banner alt text"),
        video: safe(z.string()).meta({ title: "Video (.webm)", widget: "url" }),
        desktop: image("Desktop banner"),
        desktopSrcSet: longText("Desktop banner sizes (srcset)", "Optional resized copies: 'path 1080w, path 1440w, …'. Leave as the banner path alone if unsure.").optional(),
        mobile: image("Mobile banner"),
        mobileSrcSet: longText("Mobile banner sizes (srcset)", "Optional resized copies: 'path 480w, path 640w, …'.").optional(),
      })
      .meta({ title: "Slide" }),
    "Hero slides",
  ),
});

const products = z.object({
  heading: text("Heading"),
  tiles: list(z.object({ label: text("Label"), href: url("Link"), src: image("Image"), alt: text("Image alt text") }).meta({ title: "Tile" }), "Product tiles"),
});

const why = z.object({
  heading: text("Heading"),
  points: list(z.object({ icon: image("Icon"), title: text("Title"), text: longText("Text") }).meta({ title: "Point" }), "Points"),
  topImage: image("Image above the points"),
  sideImage: image("Side image"),
  buttonLabel: text("Button label"),
  buttonHref: url("Button link"),
});

const marqueeImage = z.object({ src: image("Image"), alt: text("Alt text") }).meta({ title: "Image" });
const experience = z.object({
  heading: text("Heading"),
  text: longText("Text"),
  buttonLabel: text("Button label"),
  buttonHref: url("Button link"),
  up: list(marqueeImage, "Left column (scrolls up)"),
  down: list(marqueeImage, "Right column (scrolls down)"),
});

const customerService = z.object({
  stats: list(
    z
      .object({
        icon: image("Icon"),
        w: z.number().int().positive().meta({ title: "Icon width (px)" }),
        h: z.number().int().positive().meta({ title: "Icon height (px)" }),
        label: text("Label"),
        value: text("Value"),
      })
      .meta({ title: "Figure" }),
    "Figures",
  ),
  heading: text("Heading"),
  text: longText("Text"),
  buttonLabel: text("Button label"),
  buttonHref: url("Button link"),
  image: image("Image"),
});

const sporting = z.object({
  heading: text("Heading"),
  sponsors: list(z.object({ src: image("Logo"), alt: text("Alt text"), years: text("Years") }).meta({ title: "Sponsorship" }), "Sponsorships"),
});

const insights = z.object({
  heading: text("Heading"),
  cards: list(z.object({ href: url("Link"), src: image("Image"), alt: text("Image alt text"), title: text("Title") }).meta({ title: "Card" }), "Cards"),
});

// ---------- other pages ----------

const faq = z.object({
  tabs: list(
    z.object({ label: text("Tab"), items: list(z.object({ question: text("Question"), answerHtml: html("Answer") }).meta({ title: "Question" }), "Questions") }).meta({ title: "Tab" }),
    "Tabs",
  ),
});

const press = z.object({
  items: list(
    z
      .object({
        title: text("Title"),
        details: text("Date line", "Shown after the title, e.g. '| 2nd,Aug - 2025'."),
        image: image("Image"),
        href: url("Article link (empty: clicking opens the image)").nullable(),
      })
      .meta({ title: "Press item" }),
    "Press coverage",
  ),
});

const policy = z.object({ html: html("Page content") });

// ---------- blog (a list collection: one entry per post, keyed by slug) ----------

export const blogPost = z.object({
  title: text("Title"),
  published: text("Date shown", "e.g. 19-Oct-2026"),
  timestamp: z.number().int().meta({ title: "Sort time (Unix seconds)", description: "Newest first on the blog page." }),
  metaTitle: text("SEO title").nullable(),
  description: longText("SEO description").nullable(),
  bannerImage: image("Banner image"),
  bannerAlt: text("Banner alt text"),
  bodyHtml: html("Article"),
  related: list(
    z
      .object({
        slug: z.string().nullable().meta({ title: "Slug (internal post)" }),
        href: url("Link"),
        image: image("Image"),
        imageAlt: text("Image alt text"),
        title: text("Title"),
        excerpt: longText("Excerpt"),
      })
      .meta({ title: "Related post" }),
    "Related posts",
  ),
});
export type BlogPost = z.infer<typeof blogPost>;

// ---------- page sections & custom pages ----------

/** Markdown sections and SEO overrides added to an existing page (key = page slug, "home" = /). */
export const pageContent = z.object({
  /** Edits to the page's own text, keyed by the original (edited in the page's Texts tab). */
  texts: z
    .array(z.object({ original: z.string().min(1).max(20_000), text: z.string().max(20_000) }))
    .max(3000)
    .default([])
    .meta({ title: "Text edits", hidden: true }),
  seoTitle: text("SEO title", "Replaces the page's title in search results and browser tabs. Leave empty to keep the original.").optional(),
  seoDescription: longText("SEO description", "Replaces the page's search-result description. Leave empty to keep the original.").optional(),
  seoKeywords: list(text("Keyword"), "SEO keywords", "Search phrases this page targets (also written to the page's keywords meta tag).").default([]),
  marketingPoints: list(longText("Point"), "Marketing points", "Selling points for this page (benefits, USPs). Shown on the page when 'Show marketing points' is on.").default([]),
  marketingHeading: text("Marketing points heading", "Default: Why choose Prayag").optional(),
  showMarketing: z.boolean().optional().meta({ title: "Show marketing points on the page (above the footer)" }),
  sections: list(
    z
      .object({
        position: z.union([z.literal("bottom"), z.literal("top")]).meta({ title: "Where", description: "bottom = after the page, above the footer; top = under the header, before the page." }),
        heading: text("Heading (optional)").optional(),
        markdown: markdown("Content (Markdown)"),
      })
      .meta({ title: "Section" }),
    "Markdown sections",
  ).default([]),
});
export type PageContent = z.infer<typeof pageContent>;

/** A new page made from Markdown, at /<slug>. */
export const customPage = z.object({
  title: text("Title"),
  metaTitle: text("SEO title").nullable(),
  description: longText("SEO description").nullable(),
  bannerImage: image("Banner image (optional)").optional(),
  bannerAlt: text("Banner alt text").optional(),
  markdown: markdown("Page content (Markdown)"),
});
export type CustomPage = z.infer<typeof customPage>;

// ---------- registry ----------

type Singleton<S extends z.ZodType> = { title: string; description: string; schema: S; default: () => z.input<S> };
const one = <S extends z.ZodType>(title: string, description: string, schema: S, value: () => z.input<S>): Singleton<S> => ({ title, description, schema, default: value });


/** Single-document entries, addressed as "collection/key". */
export const SINGLETONS = {
  "site/contact": one("Contact details", "Address, phone numbers and email in the site footer. (The contact page lists its own office numbers.)", contact, () => site.contact),
  "site/social": one("Social links", "Social profiles linked from the footer, drawer and blog share bar.", social, () => site.socialLinks),
  "site/header": one("Header menu", "Top navigation (desktop drop-downs and the mobile menu).", header, () => ({
    menus: site.megaMenus.map((m) =>
      "links" in m
        ? { label: m.label, links: m.links, image: m.image, imageWidth: m.imageSize.width, imageHeight: m.imageSize.height, columns: m.columns }
        : { label: m.label, href: m.href, links: [], columns: 1 as const },
    ),
  })),
  "site/drawer": one("Side drawer & mobile menu extras", "Product-category group and quick links of the side drawer (also listed in the mobile menu).", drawer, () => ({
    plumbingLabel: site.productCategories[0].label,
    plumbingHref: site.productCategories[0].href,
    plumbing: site.plumbingSubcategories,
    quickLinks: site.panelQuickLinks,
  })),
  "site/footer": one("Footer links", "Link columns of the footer.", footer, () => ({ columns: site.footerColumns })),
  "home/hero": one("Home: hero slider", "Video banners at the top of the homepage.", hero, () => ({ slides: site.heroSlides })),
  "home/products": one("Home: explore products", "Product tiles under the hero.", products, () => ({
    heading: "Explore Our Products",
    tiles: site.productTiles.map((t) => ({ label: t.label, href: t.href, src: t.src, alt: t.alt })),
  })),
  "home/why": one("Home: why Prayag", "Points, images and button of the 'Why Prayag' block.", why, () => ({
    heading: "Why Prayag",
    points: site.whyPoints,
    topImage: site.whyImages.top,
    sideImage: site.whyImages.side,
    buttonLabel: "Know More",
    buttonHref: site.pageLinks.manufacturing,
  })),
  "home/experience": one("Home: experience Prayag", "Text and scrolling images of the black 'Experience Prayag' block.", experience, () => ({
    heading: "Experience Prayag",
    text: "Every single day of your life, we at Prayag, desire to give you that feeling of contentment, satisfaction, and joy, by using our meticulously crafted products that have been designed with only you in mind.",
    buttonLabel: "Explore Products",
    buttonHref: site.pageLinks.manufacturing,
    up: site.marqueeColumns.up,
    down: site.marqueeColumns.down,
  })),
  "home/customer-service": one("Home: figures & customer service", "Company figures and the customer-service card.", customerService, () => ({
    stats: site.stats,
    heading: "Customer Service",
    text: "Prayag’s after-sales service guarantees fast responses, expert assistance, and hassle-free support for every valued customer.",
    buttonLabel: "Know More",
    buttonHref: site.pageLinks.contact,
    image: site.customerServiceImage,
  })),
  "home/sporting": one("Home: sporting spirit", "Sponsorship logos carousel.", sporting, () => ({ heading: "Fueling India’s Sporting Spirit", sponsors: site.sponsors })),
  "home/insights": one("Home: latest insights", "Blog cards near the bottom of the homepage.", insights, () => ({ heading: "Our Latest Insights", cards: site.insights })),
  "pages/faq": one("FAQ page", "Tabs, questions and answers of /faq.", faq, () => ({ tabs: faqTabs })),
  "pages/press": one("Press coverage page", "Items of /press-coverages (newest first).", press, () => ({ items: pressItems.map((p) => ({ title: p.title, details: p.details, image: p.image, href: p.href ?? null })) })),
  "pages/privacy-policy": one("Privacy policy page", "Body of /privacy-policy.", policy, () => ({ html: privacyPolicyHtml })),
} as const;

export type SingletonId = keyof typeof SINGLETONS;
export type SingletonData<K extends SingletonId> = z.output<(typeof SINGLETONS)[K]["schema"]>;

/** Collections whose entries are created and removed (one document per key). */
export const LISTS = {
  blog: {
    title: "Blog posts",
    description: "Articles at /<slug>, listed on /blog newest first. The key is the URL slug (lower-case words joined by hyphens).",
    schema: blogPost,
    keys: "url",
  },
  "page-content": {
    title: "Page sections & SEO",
    description: "Markdown sections (top or bottom) and SEO overrides for each existing page. The key is the page slug (see the page list; 'home' is the homepage).",
    schema: pageContent,
    keys: "page",
  },
  "custom-pages": {
    title: "Custom pages",
    description: "New pages written in Markdown, at /<slug>, with a banner and title. The key is the URL slug.",
    schema: customPage,
    keys: "url",
  },
} as const;

export type ListData = { blog: BlogPost; "page-content": PageContent; "custom-pages": CustomPage };

export type ListId = keyof typeof LISTS;

export const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isSingleton(id: string): id is SingletonId {
  return Object.hasOwn(SINGLETONS, id);
}
export function isList(id: string): id is ListId {
  return Object.hasOwn(LISTS, id);
}

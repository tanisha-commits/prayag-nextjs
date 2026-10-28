import type { Metadata } from "next";

const SITE = "https://prayagindia.com";

/** Page metadata with the source title/description and a canonical matching the source URL. */
export function pageMetadata({
  title,
  description,
  path,
  image,
}: {
  title: string;
  description?: string;
  path: string;
  image?: string;
}): Metadata {
  return {
    // `absolute` because source titles already carry the " | Prayag" suffix.
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: "Prayag",
      type: "website",
      ...(image ? { images: [{ url: image }] } : {}),
    },
  };
}

/**
 * Breadcrumb trail as structured data. The source shows no visible breadcrumb trail
 * (its "breadcrumb" is the image banner), so the trail is only exposed to crawlers.
 */
export function BreadcrumbJsonLd({ items }: { items: { name: string; path: string }[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...items].map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE}${item.path}`,
    })),
  };
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is escaped for "<" so content cannot close the script tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

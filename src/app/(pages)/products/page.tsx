import { BreadcrumbJsonLd, pageMetadata } from "@/components/sites/prayag/seo";
import { responsiveImg } from "@/components/sites/prayag/responsive-image";
import "@/components/sites/prayag/products/products.css";
import { withBasePath } from "@/lib/base-path";

export const metadata = pageMetadata({
  title: "Premium Bathroom And Plumbing Products in India | Prayag",
  description:
    "Explore bathroom and plumbing products from Prayag for reliable quality and practical use. View key features, specifications and applications for homes and.",
  path: "/products",
  image: "/sites/prayag/files/2024-10/products-1-.webp",
});

// Source https://prayagindia.com/products: the category grid in the live order. Every card carries
// the same "Bathroom, Kitchen and Lighting" line on the source.
const CATEGORIES = [
  { name: "Plumbing Solutions", href: "/plumbing-solutions", image: "/sites/prayag/files/2026-08/Plumbing-pipe.png" },
  { name: "CP Faucets", href: "/faucets", image: "/sites/prayag/files/2025-07/PTMT.webp" },
  { name: "PTMT", href: "/ptmt-taps", image: "/sites/prayag/files/2026-06/New2.webp" },
  { name: "CeramicWare", href: "/ceramicware", image: "/sites/prayag/files/2025-07/Ceramicware.webp" },
  { name: "Pipes & Fittings", href: "/pipes-fittings", image: "/sites/prayag/files/2025-07/Pipes.webp" },
  { name: "Kitchen Sinks", href: "/kitchen-sinks", image: "/sites/prayag/files/2025-07/Kitchen-sinks.webp" },
  { name: "Water Heaters", href: "/water-heaters", image: "/sites/prayag/files/2025-07/Waterheaters.webp" },
  { name: "Storage Tank", href: "/storage-tank", image: "/sites/prayag/files/2025-07/water-tanks.webp" },
  { name: "Bathroom Accessories", href: "/bathroom-accessories", image: "/sites/prayag/files/2025-07/Bathroom-accesssories.webp" },
  { name: "Hardware", href: "/hardware", image: "/sites/prayag/files/2025-07/Hardware.webp" },
  { name: "Traps", href: "/traps", image: "/sites/prayag/files/2024-08/traps.webp" },
];

/* eslint-disable @next/next/no-img-element -- source <img> markup kept 1:1 under the scoped theme CSS */
export default function ProductsPage() {
  return (
    <div className="pcat-products">
      <BreadcrumbJsonLd items={[{ name: "Products", path: "/products" }]} />
      <div className="breadcrumb_main">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-6">
              <div className="breadcrumb_image">
                <img {...responsiveImg("/sites/prayag/files/2024-10/products-1-.webp", 960, "(min-width: 768px) 50vw, 100vw")} alt="" fetchPriority="high" />
              </div>
            </div>
            <div className="col-md-6">
              <div className="breadcrumb_title">
                <h1 className="black_title">Products</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
      <section className="category_page">
        <div className="container-fluid">
          <div className="row">
            {CATEGORIES.map((c) => (
              <div key={c.href} className="col-md-6">
                <a href={withBasePath(c.href)}>
                  <div className="category_box">
                    <div className="category_box_img">
                      <img {...responsiveImg(c.image, 1920, "(min-width: 768px) 50vw, 100vw")} alt={c.name} loading="lazy" />
                    </div>
                    <div className="category_box_content">
                      <h3>{c.name}</h3>
                      <p>Bathroom, Kitchen and Lighting</p>
                    </div>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

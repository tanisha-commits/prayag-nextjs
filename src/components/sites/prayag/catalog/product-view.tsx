import Link from "next/link";
import "./catalog.css";
import type { publicProduct } from "@/lib/catalog/public";
import { ProductCard } from "./product-card";
import { ProductGallery } from "./product-gallery";

type Product = NonNullable<ReturnType<typeof publicProduct>>;

const ATTR_LABEL: Record<string, string> = { type: "Type", series: "Series", collection: "Collection", finish: "Finish", range: "Range", capacity: "Capacity", "plumbing type": "Plumbing type", "accessory range": "Range" };

/** Product detail. Shows only fields the product really has (no sample specs, no generated text). */
export function ProductView({ product }: { product: Product }) {
  const colours = product.attributes.filter((a) => a.key === "colour");
  const facts = product.attributes.filter((a) => a.key !== "colour");
  const enquire = `/contact-us?product=${encodeURIComponent(product.title)}`;
  return (
    <>
      <nav aria-label="Breadcrumb" className="border-b border-[#eee] bg-[#fafafa]">
        <ol className="prayag-container m-0 flex list-none flex-wrap gap-2 py-3 text-[14px] text-[#5b5f66]">
          <li>
            <Link href="/" className="hover:text-[#007ac3]">Home</Link>
          </li>
          {product.categories.slice(0, 1).map((c) => (
            <li key={c.slug} className="before:mr-2 before:content-['/']">
              <Link href={`/${c.slug}`} className="hover:text-[#007ac3]">{c.name}</Link>
            </li>
          ))}
          <li aria-current="page" className="text-black before:mr-2 before:text-[#5b5f66] before:content-['/']">{product.title}</li>
        </ol>
      </nav>

      <section className="prayag-container grid grid-cols-1 gap-10 py-10 lg:grid-cols-2">
        <ProductGallery images={product.images} title={product.title} />
        <div>
          <div className="mb-3 flex flex-wrap gap-2 text-[13px]">
            {product.categories.map((c) => (
              <Link key={c.slug} href={`/${c.slug}`} className="rounded-full bg-[#eef6fb] px-3 py-1 text-[#007ac3]">{c.name}</Link>
            ))}
            {product.itemCode && <span className="rounded-full bg-[#f3f4f6] px-3 py-1 text-[#333]">Item Code <b>{product.itemCode}</b></span>}
          </div>
          <h1 className="m-0 mb-3 text-[28px] leading-[1.25] font-medium text-black md:text-[34px]">{product.title}</h1>
          {product.shortDescription && <p className="mb-5 text-[17px] leading-[1.6] text-[#555]">{product.shortDescription}</p>}

          {colours.length > 0 && (
            <div className="mb-5">
              <h2 className="mb-2 text-[16px] font-semibold">Colours</h2>
              <ul className="m-0 flex list-none flex-wrap gap-3 p-0 text-[14px]">
                {colours.map((c) => (
                  <li key={c.value} className="flex items-center gap-2">
                    {c.hex && <span aria-hidden="true" className="size-4 rounded-full border border-black/20" style={{ background: c.hex }} />}
                    {c.value}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {product.highlights.length > 0 && (
            <div className="mb-5">
              <h2 className="mb-2 text-[16px] font-semibold">Product Highlights</h2>
              <ul className="m-0 grid list-none grid-cols-1 gap-2 p-0 text-[15px] sm:grid-cols-2">
                {product.highlights.map((h) => (
                  <li key={h.text} className="flex items-center gap-2.5">
                    {/* eslint-disable-next-line @next/next/no-img-element -- highlight icons from the source */}
                    {h.icon ? <img src={h.icon} alt="" width={32} height={32} /> : <span aria-hidden="true" className="size-2 rounded-full bg-[#00aeef]" />}
                    {h.text}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {product.features.length > 0 && (
            <div className="mb-6">
              <h2 className="mb-2 text-[16px] font-semibold">Key Features</h2>
              <ul className="m-0 list-disc pl-5 text-[15px] leading-[1.7] text-[#333]">
                {product.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>
          )}

          <Link href={enquire} className="inline-flex h-12 items-center rounded-full bg-black px-7 text-[15px] font-medium text-white hover:bg-[#007ac3]">
            Enquire Now
          </Link>
        </div>
      </section>

      {(product.descriptionHtml || product.specsHtml || product.sizesHtml || facts.length > 0 || product.applications.length > 0) && (
        <section className="prayag-container grid grid-cols-1 gap-10 pb-12 lg:grid-cols-2">
          {product.descriptionHtml && (
            <div>
              <h2 className="mb-3 text-[22px] font-medium">Product Description</h2>
              <div className="catalog-rich text-[15px] leading-[1.7] text-[#555]" dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} />
            </div>
          )}
          {(facts.length > 0 || product.applications.length > 0 || product.specsHtml || product.sizesHtml) && (
            <div>
              <h2 className="mb-3 text-[22px] font-medium">Specifications</h2>
              {(facts.length > 0 || product.applications.length > 0) && (
                <table className="mb-4 w-full border-collapse text-[15px]">
                  <tbody>
                    {product.itemCode && (
                      <tr className="border-b border-[#eee]"><th className="w-[40%] py-2 text-left font-medium">Item Code</th><td className="py-2 text-[#555]">{product.itemCode}</td></tr>
                    )}
                    {facts.map((a) => (
                      <tr key={`${a.key}-${a.value}`} className="border-b border-[#eee]"><th className="py-2 text-left font-medium">{ATTR_LABEL[a.key] ?? a.key}</th><td className="py-2 text-[#555]">{a.value}</td></tr>
                    ))}
                    {product.applications.length > 0 && (
                      <tr className="border-b border-[#eee]"><th className="py-2 text-left font-medium">Applications</th><td className="py-2 text-[#555]">{product.applications.join(", ")}</td></tr>
                    )}
                  </tbody>
                </table>
              )}
              {product.specsHtml && <div className="catalog-rich overflow-x-auto text-[15px] text-[#555]" dangerouslySetInnerHTML={{ __html: product.specsHtml }} />}
              {product.sizesHtml && (
                <>
                  <h3 className="mt-6 mb-2 text-[18px] font-medium">Available Sizes</h3>
                  <div className="catalog-rich overflow-x-auto text-[15px] text-[#555]" dangerouslySetInnerHTML={{ __html: product.sizesHtml }} />
                </>
              )}
            </div>
          )}
        </section>
      )}

      {product.related.length > 0 && (
        <section className="prayag-container pb-16">
          <h2 className="mb-5 text-[24px] font-medium">Related Products</h2>
          <ul className="m-0 grid list-none grid-cols-2 gap-4 p-0 md:grid-cols-4">
            {product.related.slice(0, 8).map((r) => (
              <li key={r.publicId}><ProductCard product={r} /></li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}

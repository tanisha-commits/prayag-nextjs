import { BreadcrumbJsonLd, pageMetadata } from "@/components/sites/prayag/seo";

// The live site has no Warranty Policy page; it links straight to this PDF
// (https://prayagindia.com/sites/default/files/2024-09/Warranty_Policy.pdf). The local copy
// is byte-identical to that official file (SHA-256 22ccc725…3e79, verified 2026-10-28), so
// the PDF stays the authoritative document and no policy text is reproduced here.
const PDF = "/sites/prayag/files/2024-09/Warranty_Policy.pdf";
const DOWNLOAD_NAME = "Prayag-Warranty-Policy.pdf";

export const metadata = pageMetadata({
  title: "Warranty Policy | Prayag",
  description: "View or download the official Prayag warranty policy (PDF) for Prayag products.",
  path: "/warranty-policy",
});

const actionBase =
  "inline-flex items-center justify-center rounded-[28px] px-[35px] py-[13px] text-[18px] leading-6 font-medium transition-all duration-500 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0d6efd]";

export default function WarrantyPolicyPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Warranty Policy", path: "/warranty-policy" }]} />
      <div className="bg-black px-6 py-[15px] text-center md:py-[60px]">
        <h1 className="m-0 text-[22px] leading-8 font-medium text-white md:text-[32px] md:leading-[42px] lg:text-[36px] lg:leading-[46px] xl:text-[40px] xl:leading-[50px]">
          Warranty Policy
        </h1>
      </div>

      <section className="bg-white py-[50px] md:py-[60px]">
        <div className="prayag-container">
          <p className="mb-2 text-[16px] leading-6 text-[#555] md:text-[18px] md:leading-7">
            The official Prayag Warranty Policy document sets out the warranty periods, conditions and
            exclusions for Prayag products.
          </p>
          <p className="mb-8 text-[14px] leading-6 text-[#555] md:text-[16px]">
            PDF · 3 pages · 502 KB · file dated 30 January 2026
          </p>

          <div className="mb-10 flex flex-wrap gap-4">
            <a
              href={PDF}
              target="_blank"
              rel="noopener noreferrer"
              className={`${actionBase} bg-black !text-white hover:bg-[linear-gradient(135deg,#0056b3,#004085)]`}
            >
              View Warranty Policy
              <span className="sr-only"> (PDF, opens in a new tab)</span>
            </a>
            <a
              href={PDF}
              download={DOWNLOAD_NAME}
              className={`${actionBase} border border-black text-black hover:bg-black hover:!text-white`}
            >
              Download PDF
              <span className="sr-only"> (Warranty Policy, 502 KB)</span>
            </a>
          </div>

          {/* Inline preview where browsers render PDFs reliably; phones get the buttons above. */}
          <div className="hidden overflow-hidden rounded-[10px] border border-[#e5e7eb] md:block">
            <iframe src={`${PDF}#view=FitH`} title="Prayag Warranty Policy (PDF)" className="block h-[80vh] min-h-[600px] w-full" />
          </div>
        </div>
      </section>
    </>
  );
}

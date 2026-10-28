import { DealershipForm } from "@/components/sites/prayag/dealership/dealership-form";
import { PageBanner } from "@/components/sites/prayag/page-banner";
import { BreadcrumbJsonLd, pageMetadata } from "@/components/sites/prayag/seo";

export const metadata = pageMetadata({
  title: "Prayag Dealership - Explore Official Information | Prayag",
  description:
    "Submit a Prayag dealership enquiry to connect with the team about dealer opportunities, distribution requirements, product categories and business support.",
  path: "/dealership-enquiry",
});

export default function DealershipEnquiryPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Dealership Enquiry", path: "/dealership-enquiry" }]} />
      <PageBanner image="/sites/prayag/files/2024-09/Banner_0.webp" title="Dealership Enquiry" />
      {/* Source `section.dealership_form_main.sp` */}
      <section className="py-6 min-[768px]:py-[60px]">
        <div className="prayag-container">
          <div className="-mx-3 flex flex-wrap">
            <div className="w-full px-3 min-[768px]:w-1/3">
              <div className="w-full min-[768px]:w-[80%]">
                <h2 className="m-0 mb-[14px] p-0 text-[29px] leading-8 font-bold text-black min-[768px]:text-[38px] min-[768px]:leading-[46px] min-[1025px]:mb-[18px] min-[1400px]:text-[52px] min-[1400px]:leading-[62px]">
                  Dealership Enquiry
                </h2>
                <p className="m-0 mb-4 w-[95%] text-[15px] leading-[25px] text-[#555] min-[768px]:w-[80%] min-[768px]:text-[16px] min-[768px]:leading-6 min-[1400px]:text-[18px] min-[1400px]:leading-7">
                  To enquire further about Prayag Dealership, please share details in the form below and someone from our
                  team will get in touch with you.
                </p>
              </div>
            </div>
            <div className="w-full px-3 min-[768px]:w-2/3">
              <DealershipForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

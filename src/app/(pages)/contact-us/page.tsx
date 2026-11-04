import { ContactForm } from "@/components/sites/prayag/contact/contact-form";
import { ContactInfoSection, ContactLinkBoxes } from "@/components/sites/prayag/contact/contact-sections";
import { PageBanner } from "@/components/sites/prayag/page-banner";
import { BreadcrumbJsonLd, pageMetadata } from "@/components/sites/prayag/seo";

export const metadata = pageMetadata({
  title: "Contact Prayag - Information, Support & Resources | Prayag",
  description:
    "Use contact Prayag details to reach the team for product enquiries, customer support, dealership questions, information and manufacturing location details.",
  path: "/contact-us",
});

export default function ContactUsPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Contact Us", path: "/contact-us" }]} />
      <PageBanner image="/sites/prayag/files/2024-08/contact-us.webp" title="Contact Us" />
      <ContactInfoSection />
      <section className="flex items-center bg-black py-10 md:py-[90px]">
        <div className="prayag-container">
          <div className="-mx-3 flex w-full flex-wrap justify-center">
            <div className="w-full max-w-[1000px] px-3">
              <h3 className="m-0 mb-12 p-0 text-center text-[48px] leading-[58px] font-medium text-white">Get in Touch</h3>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
      <ContactLinkBoxes />
    </>
  );
}

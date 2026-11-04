import { PageBanner } from "@/components/sites/prayag/page-banner";
import { PrivacyBody } from "@/components/sites/prayag/privacy/privacy-body";
import { BreadcrumbJsonLd, pageMetadata } from "@/components/sites/prayag/seo";

export const metadata = pageMetadata({
  title: "Privacy Policy - Information, Support & Resources | Prayag",
  description:
    "Read the Prayag privacy policy to understand how personal information may be collected, used, stored and protected when you visit or interact with the website.",
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Privacy Policy", path: "/privacy-policy" }]} />
      <PageBanner image="/sites/prayag/files/2024-09/privacy-policy.webp" title="Privacy Policy" />
      <PrivacyBody />
    </>
  );
}

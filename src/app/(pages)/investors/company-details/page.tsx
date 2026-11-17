import { pageMetadata } from "@/components/sites/prayag/seo";
import { company, getSection, sectionMetadataInput } from "@/components/sites/prayag/investors/data";
import {
  InvestorContactCard,
  InvestorHero,
  InvestorSectionLayout,
  MailIcon,
  Panel,
  PanelHeading,
  PinIcon,
} from "@/components/sites/prayag/investors/investor-ui";

const section = getSection("company-details");
export const metadata = pageMetadata(sectionMetadataInput("company-details"));

const rows = [
  { label: "Name of Company", value: company.name },
  { label: "Corporate Identity Number (CIN)", value: company.cin },
  { label: "Registered Office", value: company.registeredOffice },
  { label: "Email", value: company.email, href: `mailto:${company.email}` },
];

export default function CompanyDetailsPage() {
  return (
    <>
      <InvestorHero title={section.title} intro={section.summary} section={section} />
      <InvestorSectionLayout active={section.key}>
        <div className="space-y-5">
          <Panel>
            <PanelHeading eyebrow="Corporate information" title="Details of Company" />
            <dl className="divide-y divide-[#eef0f3] border-y border-[#eef0f3]">
              {rows.map((r) => (
                <div key={r.label} className="grid gap-1 py-5 md:grid-cols-[260px_minmax(0,1fr)] md:gap-6">
                  <dt className="text-[14px] leading-6 text-[#6b7280] md:text-[15px]">{r.label}</dt>
                  <dd className="m-0 text-[17px] leading-7 font-medium break-words text-black md:text-[18px]">
                    {r.href ? (
                      <a href={r.href} className="!text-[#007ac3] underline-offset-4 hover:underline">
                        {r.value}
                      </a>
                    ) : (
                      r.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </Panel>

          <div className="grid gap-5 md:grid-cols-2">
            <Panel className="flex gap-4">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-[12px] bg-[#eef6fc] text-[#007ac3]">
                <PinIcon className="size-5" />
              </span>
              <div>
                <h2 className="m-0 text-[17px] leading-6 font-medium text-black">Registered Office</h2>
                <p className="mt-1 text-[15px] leading-6 text-[#5b6470]">{company.registeredOffice}</p>
              </div>
            </Panel>
            <Panel className="flex gap-4">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-[12px] bg-[#eef6fc] text-[#007ac3]">
                <MailIcon className="size-5" />
              </span>
              <div>
                <h2 className="m-0 text-[17px] leading-6 font-medium text-black">Email</h2>
                <a href={`mailto:${company.email}`} className="mt-1 inline-block text-[15px] leading-6 !text-[#007ac3] hover:underline">
                  {company.email}
                </a>
              </div>
            </Panel>
          </div>

          <div className="lg:hidden">
            <InvestorContactCard />
          </div>
        </div>
      </InvestorSectionLayout>
    </>
  );
}

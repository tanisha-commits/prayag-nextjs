import Link from "next/link";
import { pageMetadata } from "@/components/sites/prayag/seo";
import { agmNotices, getSection, sectionHref, sectionMetadataInput } from "@/components/sites/prayag/investors/data";
import {
  ArrowIcon,
  DocumentActions,
  DocumentMeta,
  InvestorContactCard,
  InvestorHero,
  InvestorSectionLayout,
  Panel,
  PanelHeading,
} from "@/components/sites/prayag/investors/investor-ui";
import { withBasePath } from "@/lib/base-path";

const section = getSection("notice-of-agm");
export const metadata = pageMetadata(sectionMetadataInput("notice-of-agm"));

const notice = agmNotices[0];

export default function NoticeOfAgmPage() {
  return (
    <>
      <InvestorHero title={section.title} intro={section.summary} section={section} />
      <InvestorSectionLayout active={section.key}>
        <div className="space-y-5">
          <Panel className="overflow-hidden p-0 md:p-0">
            <div className="grid md:grid-cols-[220px_minmax(0,1fr)]">
              <div className="flex flex-col justify-center bg-gradient-to-br from-[#007ac3] to-[#00aeef] p-6 text-white md:p-8">
                <p className="m-0 text-[12px] leading-4 font-medium tracking-[0.16em] text-white/85 uppercase">Annual General Meeting</p>
                <p className="m-0 mt-3 text-[56px] leading-none font-medium">37th</p>
                <p className="m-0 mt-3 text-[15px] leading-6 text-white/90">30 September 2026 · 11:00 A.M. · through VC/OAVM</p>
              </div>
              <div className="p-6 md:p-8">
                <span className="rounded-full bg-[#e6f4fb] px-2.5 py-0.5 text-[12px] leading-5 font-medium text-[#007ac3]">{notice.period}</span>
                <h2 className="m-0 mt-3 text-[22px] leading-8 font-medium text-black md:text-[26px]">{notice.title}</h2>
                {notice.description && <p className="mt-2 text-[15px] leading-6 text-[#5b6470]">{notice.description}</p>}
                <div className="mt-2">
                  <DocumentMeta doc={notice} />
                </div>
                <div className="mt-6">
                  <DocumentActions doc={notice} size="lg" />
                </div>
                <Link
                  href={sectionHref("agm-transcript")}
                  className="mt-6 inline-flex items-center gap-2 text-[15px] font-medium !text-[#007ac3] hover:!text-black"
                >
                  Read the transcript of the 37th AGM <ArrowIcon className="size-4" />
                </Link>
              </div>
            </div>
          </Panel>

          <Panel className="hidden md:block">
            <PanelHeading eyebrow="Preview" title="Read the notice here" />
            <div className="overflow-hidden rounded-[14px] border border-[#e6e9ee]">
              <iframe
                src={withBasePath(`${notice.file}#view=FitH`)}
                title={`${notice.title} (PDF)`}
                loading="lazy"
                className="block h-[80vh] min-h-[600px] w-full"
              />
            </div>
          </Panel>

          <div className="lg:hidden">
            <InvestorContactCard />
          </div>
        </div>
      </InvestorSectionLayout>
    </>
  );
}

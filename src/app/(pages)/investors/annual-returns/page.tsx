import { pageMetadata } from "@/components/sites/prayag/seo";
import { annualReturns, getSection, sectionMetadataInput } from "@/components/sites/prayag/investors/data";
import {
  DocumentList,
  InvestorContactCard,
  InvestorHero,
  InvestorSectionLayout,
  Panel,
  PanelHeading,
} from "@/components/sites/prayag/investors/investor-ui";

const section = getSection("annual-returns");
export const metadata = pageMetadata(sectionMetadataInput("annual-returns"));

export default function AnnualReturnsPage() {
  return (
    <>
      <InvestorHero title={section.title} intro={section.summary} section={section} />
      <InvestorSectionLayout active={section.key}>
        <div className="space-y-5">
          <Panel>
            <PanelHeading
              eyebrow="Statutory filings"
              title="Annual Returns (Form MGT-7)"
              text="Annual Returns filed pursuant to Section 92(1) of the Companies Act, 2013 and Rule 11(1) of the Companies (Management and Administration) Rules, 2014."
            />
            <DocumentList docs={annualReturns} markLatest />
          </Panel>
          <div className="lg:hidden">
            <InvestorContactCard />
          </div>
        </div>
      </InvestorSectionLayout>
    </>
  );
}

import { pageMetadata } from "@/components/sites/prayag/seo";
import { csrActionPlans, getSection, sectionMetadataInput } from "@/components/sites/prayag/investors/data";
import {
  DocumentList,
  InvestorContactCard,
  InvestorHero,
  InvestorSectionLayout,
  Panel,
  PanelHeading,
} from "@/components/sites/prayag/investors/investor-ui";

const section = getSection("csr-annual-action-plan");
export const metadata = pageMetadata(sectionMetadataInput("csr-annual-action-plan"));

export default function CsrAnnualActionPlanPage() {
  return (
    <>
      <InvestorHero title={section.title} intro={section.summary} section={section} />
      <InvestorSectionLayout active={section.key}>
        <div className="space-y-5">
          <Panel>
            <PanelHeading
              eyebrow="Corporate Social Responsibility"
              title="CSR Annual Action Plans"
              text="Annual Action Plans recommended by the CSR Committee, as per Rule 5 sub-rule (2) of the Companies (Corporate Social Responsibility Policy) Rules."
            />
            <DocumentList docs={csrActionPlans} markLatest />
          </Panel>
          <div className="lg:hidden">
            <InvestorContactCard />
          </div>
        </div>
      </InvestorSectionLayout>
    </>
  );
}

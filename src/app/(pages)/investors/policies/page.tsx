import { pageMetadata } from "@/components/sites/prayag/seo";
import { policies, getSection, sectionMetadataInput } from "@/components/sites/prayag/investors/data";
import {
  DocumentList,
  InvestorContactCard,
  InvestorHero,
  InvestorSectionLayout,
  Panel,
  PanelHeading,
} from "@/components/sites/prayag/investors/investor-ui";

const section = getSection("policies");
export const metadata = pageMetadata(sectionMetadataInput("policies"));

export default function PoliciesPage() {
  return (
    <>
      <InvestorHero title={section.title} intro={section.summary} section={section} />
      <InvestorSectionLayout active={section.key}>
        <div className="space-y-5">
          <Panel>
            <PanelHeading
              eyebrow="Governance"
              title="Policies of the Company"
              text="Policies and terms adopted by the Board of Directors of Prayag Polymers Limited. Select View to open a document or Download to save a copy."
            />
            <DocumentList docs={policies} />
          </Panel>
          <div className="lg:hidden">
            <InvestorContactCard />
          </div>
        </div>
      </InvestorSectionLayout>
    </>
  );
}

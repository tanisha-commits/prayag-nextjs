import { pageMetadata } from "@/components/sites/prayag/seo";
import {
  boardOfDirectors,
  committees,
  getSection,
  sectionMetadataInput,
  type PersonCategory,
} from "@/components/sites/prayag/investors/data";
import { InvestorContactCard, InvestorHero, InvestorSectionLayout, Panel, PanelHeading } from "@/components/sites/prayag/investors/investor-ui";
import { cn } from "@/lib/utils";

const section = getSection("board-and-committees");
export const metadata = pageMetadata(sectionMetadataInput("board-and-committees"));

const categoryStyle: Record<PersonCategory, { label: string; chip: string }> = {
  executive: { label: "Executive", chip: "bg-black text-white" },
  independent: { label: "Independent", chip: "bg-[#eef6fc] text-[#005f99]" },
  kmp: { label: "KMP", chip: "bg-[#f1f2f4] text-[#4b5563]" },
};

function initials(name: string) {
  return name
    .replace(/^(Mr|Mrs|Ms)\.\s*/, "")
    .split(/\s+/)
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join("");
}

export default function BoardAndCommitteesPage() {
  return (
    <>
      <InvestorHero title={section.title} intro={section.summary} section={section} />
      <InvestorSectionLayout active={section.key}>
        <div className="space-y-5">
          <Panel>
            <PanelHeading eyebrow="Board" title="Composition of Board of Directors" />
            <ol className="grid gap-3 sm:grid-cols-2">
              {boardOfDirectors.map((m, i) => {
                const style = categoryStyle[m.category];
                return (
                  <li key={m.name} className="flex items-center gap-4 rounded-[16px] border border-[#eef0f3] bg-[#fafbfc] p-4">
                    <span
                      aria-hidden="true"
                      className={cn(
                        "flex size-12 shrink-0 items-center justify-center rounded-full text-[15px] font-medium",
                        m.category === "executive" ? "bg-black text-white" : "bg-white text-black ring-1 ring-[#dfe3e8]",
                      )}
                    >
                      {initials(m.name)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="m-0 text-[12px] leading-4 text-[#9aa3ad] tabular-nums">{String(i + 1).padStart(2, "0")}</p>
                      <h3 className="m-0 text-[17px] leading-6 font-medium text-black">{m.name}</h3>
                      <p className="m-0 text-[14px] leading-5 text-[#5b6470]">{m.designation}</p>
                    </div>
                    <span className={cn("hidden shrink-0 rounded-full px-2.5 py-0.5 text-[12px] leading-5 font-medium sm:inline-block", style.chip)}>
                      {style.label}
                    </span>
                  </li>
                );
              })}
            </ol>
            <p className="mt-5 text-[13px] leading-5 text-[#6b7280]">KMP: Key Managerial Personnel.</p>
          </Panel>

          <Panel>
            <PanelHeading eyebrow="Committees" title="Committees of the Board" />
            <div className="grid gap-4 xl:grid-cols-3">
              {committees.map((c) => (
                <section key={c.name} className="rounded-[16px] border border-[#eef0f3] p-5">
                  <h3 className="m-0 mb-4 text-[18px] leading-6 font-medium text-black">{c.name}</h3>
                  <ul className="space-y-3">
                    {c.members.map((m) => (
                      <li key={m.name} className="flex items-center justify-between gap-3 border-b border-[#f1f3f5] pb-3 last:border-0 last:pb-0">
                        <span className="text-[15px] leading-6 text-black">{m.name}</span>
                        <span
                          className={cn(
                            "shrink-0 rounded-full px-2.5 py-0.5 text-[12px] leading-5 font-medium",
                            m.role === "Chairperson" ? "bg-[#007ac3] text-white" : "bg-[#f1f2f4] text-[#4b5563]",
                          )}
                        >
                          {m.role}
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
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

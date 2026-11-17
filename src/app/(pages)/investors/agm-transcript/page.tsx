import Link from "next/link";
import { pageMetadata } from "@/components/sites/prayag/seo";
import { agmTranscript, company, getSection, sectionHref, sectionMetadataInput } from "@/components/sites/prayag/investors/data";
import { ArrowIcon, InvestorContactCard, InvestorHero, InvestorSectionLayout, Panel } from "@/components/sites/prayag/investors/investor-ui";
import { cn } from "@/lib/utils";

const section = getSection("agm-transcript");
export const metadata = pageMetadata(sectionMetadataInput("agm-transcript"));

const t = agmTranscript;

const chapters = [
  { id: "opening", title: "Opening and welcome" },
  { id: "attendees", title: "Directors and attendees" },
  { id: "quorum", title: "Chairperson, quorum and shorter notice" },
  { id: "notice", title: "Notice and reports" },
  { id: "address", title: "Address by the Chairperson" },
  { id: "business", title: "Proceedings on the business items" },
  { id: "conclusion", title: "General discussion and conclusion" },
];

function Chapter({ n, id, title, children }: { n: number; id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-[110px] border-t border-[#eef0f3] pt-8 first:border-0 first:pt-0">
      <h2 className="m-0 mb-4 flex items-baseline gap-3 text-[20px] leading-7 font-medium text-black md:text-[24px] md:leading-8">
        <span className="text-[14px] font-medium text-[#007ac3] tabular-nums">{String(n).padStart(2, "0")}</span>
        {title}
      </h2>
      <div className="space-y-4 text-[16px] leading-7 text-[#333]">{children}</div>
    </section>
  );
}

function Paras({ items }: { items: string[] }) {
  return items.map((p) => <p key={p.slice(0, 40)}>{p}</p>);
}

export default function AgmTranscriptPage() {
  return (
    <>
      <InvestorHero title="37th AGM Transcript" intro={t.heldOn} section={section} />
      <InvestorSectionLayout active={section.key}>
        <div className="space-y-5">
          <Panel>
            <p className="m-0 text-[12px] leading-4 font-medium tracking-[0.16em] text-[#007ac3] uppercase">{company.name}</p>
            <h2 className="m-0 mt-2 text-[22px] leading-8 font-medium text-black md:text-[28px] md:leading-9">{t.title}</h2>
            <dl className="mt-6 grid gap-px overflow-hidden rounded-[16px] border border-[#eef0f3] bg-[#eef0f3] sm:grid-cols-2">
              {t.details.map((d) => (
                <div key={d.label} className="bg-[#fafbfc] p-4 md:p-5">
                  <dt className="text-[13px] leading-5 text-[#6b7280]">{d.label}</dt>
                  <dd className="m-0 mt-1 text-[15px] leading-6 font-medium text-black">{d.value}</dd>
                </div>
              ))}
            </dl>
            <nav aria-label="Transcript contents" className="mt-6">
              <p className="mb-3 text-[13px] leading-5 font-medium text-[#6b7280]">Contents</p>
              <ol className="flex flex-wrap gap-2">
                {chapters.map((c, i) => (
                  <li key={c.id}>
                    <a
                      href={`#${c.id}`}
                      className="block rounded-full border border-[#dfe3e8] px-3.5 py-1.5 text-[14px] leading-5 !text-[#333] transition-colors hover:border-[#007ac3] hover:!text-[#007ac3]"
                    >
                      {i + 1}. {c.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </Panel>

          <Panel className="space-y-8">
            <Chapter n={1} {...chapters[0]}>
              <Paras items={t.opening} />
            </Chapter>

            <Chapter n={2} {...chapters[1]}>
              <p>{t.attendeesIntro}</p>
              <ul className="grid gap-2.5 sm:grid-cols-2">
                {t.attendees.map((a) => (
                  <li key={a.name} className="rounded-[12px] border border-[#eef0f3] bg-[#fafbfc] px-4 py-3">
                    <span className="block text-[15px] leading-6 font-medium text-black">{a.name}</span>
                    <span className="block text-[14px] leading-5 text-[#5b6470]">{a.role}</span>
                  </li>
                ))}
              </ul>
            </Chapter>

            <Chapter n={3} {...chapters[2]}>
              <Paras items={t.quorum} />
            </Chapter>

            <Chapter n={4} {...chapters[3]}>
              <Paras items={t.noticeAndReports} />
            </Chapter>

            <Chapter n={5} {...chapters[4]}>
              <Paras items={t.chairpersonAddress} />
            </Chapter>

            <Chapter n={6} {...chapters[5]}>
              <p>{t.businessIntro}</p>
              <div className="overflow-x-auto rounded-[14px] border border-[#e6e9ee]">
                <table className="w-full min-w-[620px] border-collapse text-left text-[15px] leading-6">
                  <thead className="bg-[#007ac3] text-white">
                    <tr>
                      <th scope="col" className="w-[70px] px-4 py-3 font-medium">No.</th>
                      <th scope="col" className="px-4 py-3 font-medium">Description of Resolution</th>
                      <th scope="col" className="w-[190px] px-4 py-3 font-medium">Nature of Resolution</th>
                    </tr>
                  </thead>
                  {t.resolutions.map((g) => (
                    <tbody key={g.group}>
                      <tr className="bg-[#e6f4fb]">
                        <th scope="colgroup" colSpan={3} className="px-4 py-2.5 text-[13px] font-medium tracking-[0.12em] text-[#007ac3] uppercase">
                          {g.group}
                        </th>
                      </tr>
                      {g.items.map((r) => (
                        <tr key={r.no} className="border-t border-[#eef0f3] align-top">
                          <td className="px-4 py-3.5 font-medium text-black tabular-nums">{r.no}.</td>
                          <td className="px-4 py-3.5 text-[#333]">{r.text}</td>
                          <td className="px-4 py-3.5">
                            <span
                              className={cn(
                                "inline-block rounded-full px-2.5 py-0.5 text-[13px] leading-5 font-medium whitespace-nowrap",
                                r.nature === "Special Resolution" ? "bg-[#007ac3] text-white" : "bg-[#f1f2f4] text-[#374151]",
                              )}
                            >
                              {r.nature}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  ))}
                </table>
              </div>
            </Chapter>

            <Chapter n={7} {...chapters[6]}>
              <Paras items={t.conclusion} />
            </Chapter>

            <div className="flex flex-wrap gap-3 border-t border-[#eef0f3] pt-6">
              <Link
                href={sectionHref("notice-of-agm")}
                className="inline-flex items-center gap-2 rounded-full border border-[#d5dae0] px-5 py-2.5 text-[15px] font-medium !text-black transition-all hover:border-[#007ac3] hover:!text-[#007ac3]"
              >
                View the Notice of the 37th AGM <ArrowIcon className="size-4" />
              </Link>
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

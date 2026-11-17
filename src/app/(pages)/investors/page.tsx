import Link from "next/link";
import { pageMetadata } from "@/components/sites/prayag/seo";
import {
  agmNotices,
  annualReturns,
  boardOfDirectors,
  committees,
  company,
  csrActionPlans,
  documentCounts,
  investorSections,
  policies,
  sectionHref,
  type InvestorDocument,
} from "@/components/sites/prayag/investors/data";
import {
  ArrowIcon,
  DocumentActions,
  DocumentMeta,
  InvestorContactCard,
  InvestorHero,
  SectionIcon,
} from "@/components/sites/prayag/investors/investor-ui";

export const metadata = pageMetadata({
  title: "Investor Relations | Prayag Polymers Limited",
  description:
    "Investor Relations at Prayag Polymers Limited: company details, Board and committees, policies, CSR action plans, annual returns, AGM notice and AGM transcript.",
  path: "/investors",
});

const directors = boardOfDirectors.filter((m) => m.category !== "kmp");
const independent = directors.filter((m) => m.category === "independent");
const totalDocuments = policies.length + csrActionPlans.length + annualReturns.length + agmNotices.length;

const facts = [
  { value: "37th", label: "AGM held on 30 September 2026" },
  { value: String(directors.length), label: `Directors on the Board, incl. ${independent.length} Independent` },
  { value: String(committees.length), label: "Board committees" },
  { value: String(totalDocuments), label: "Statutory documents to view & download" },
];

const latest: { doc: InvestorDocument; section: string }[] = [
  { doc: agmNotices[0], section: "Notice of AGM" },
  { doc: annualReturns[0], section: "Annual Returns" },
  { doc: csrActionPlans[0], section: "CSR Annual Action Plan" },
];

export default function InvestorsPage() {
  return (
    <>
      <InvestorHero
        title="Building long-term value with transparency"
        intro="Welcome to the Investor Relations section of Prayag Polymers Limited. Find our corporate details, Board composition, governance policies and statutory filings in one place."
        aside={
          <dl className="grid grid-cols-2 gap-3 md:gap-4">
            {facts.map((f) => (
              <div key={f.label} className="rounded-[18px] border border-[#e6e9ee] bg-white p-5 shadow-[0_12px_30px_-24px_rgba(0,60,110,0.35)] md:p-6">
                <dt className="sr-only">{f.label}</dt>
                <dd className="m-0">
                  <span className="block text-[32px] leading-none font-medium text-[#007ac3] md:text-[42px]">{f.value}</span>
                  <span className="mt-3 block h-[2px] w-8 rounded-full bg-gradient-to-r from-[#007ac3] to-[#00aeef]" aria-hidden="true" />
                  <span className="mt-3 block text-[14px] leading-5 text-[#5b6470] md:text-[15px]">{f.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        }
      />

      <section className="bg-[#f6f7f9] py-12 md:py-20">
        <div className="prayag-container">
          <div className="mb-8 flex flex-col gap-3 md:mb-12 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-2 text-[12px] leading-4 font-medium tracking-[0.16em] text-[#007ac3] uppercase">Disclosures</p>
              <h2 className="m-0 text-[26px] leading-9 font-medium text-black md:text-[38px] md:leading-[48px]">Explore investor information</h2>
            </div>
            <p className="max-w-[460px] text-[15px] leading-6 text-[#5b6470] md:text-[16px]">
              Every section has its own page, so you can go straight to the disclosure you need and view or download the original document.
            </p>
          </div>

          <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {investorSections.map((s) => {
              const count = documentCounts[s.key];
              return (
                <li key={s.key}>
                  <Link
                    href={sectionHref(s.key)}
                    className="group relative flex h-full flex-col overflow-hidden rounded-[20px] border border-[#e6e9ee] bg-white p-6 !text-black transition-all duration-300 hover:-translate-y-1 hover:border-[#007ac3] hover:shadow-[0_24px_50px_-30px_rgba(0,40,80,0.45)] md:p-7"
                  >
                    <div className="mb-8 flex items-start justify-between">
                      <span className="flex size-12 items-center justify-center rounded-[14px] bg-[#e6f4fb] text-[#007ac3] transition-colors duration-300 group-hover:bg-[#007ac3] group-hover:text-white">
                        <SectionIcon section={s.key} className="size-6" />
                      </span>
                      <span className="text-[13px] leading-5 font-medium text-[#9aa3ad] tabular-nums">{s.index}</span>
                    </div>
                    <h3 className="m-0 text-[20px] leading-7 font-medium text-black">{s.title}</h3>
                    <p className="mt-2 flex-1 text-[15px] leading-6 text-[#5b6470]">{s.summary}</p>
                    <div className="mt-6 flex items-center justify-between border-t border-[#eef0f3] pt-4">
                      <span className="text-[13px] leading-5 text-[#6b7280]">
                        {count ? `${count} document${count > 1 ? "s" : ""}` : "Read online"}
                      </span>
                      <span className="flex size-9 items-center justify-center rounded-full border border-[#dfe3e8] transition-all duration-300 group-hover:border-[#007ac3] group-hover:bg-[#007ac3] group-hover:text-white">
                        <ArrowIcon className="size-4" />
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
            <li className="xl:col-span-2">
              <InvestorContactCard />
            </li>
          </ul>
        </div>
      </section>

      <section className="bg-white py-12 md:py-20">
        <div className="prayag-container grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-12">
          <div>
            <p className="mb-2 text-[12px] leading-4 font-medium tracking-[0.16em] text-[#007ac3] uppercase">Recently published</p>
            <h2 className="m-0 mb-6 text-[26px] leading-9 font-medium text-black md:text-[34px] md:leading-[44px]">Latest disclosures</h2>
            <ul className="divide-y divide-[#eef0f3] border-y border-[#eef0f3]">
              {latest.map(({ doc, section }) => (
                <li key={doc.file} className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="mb-1 text-[12px] leading-4 font-medium tracking-[0.12em] text-[#6b7280] uppercase">{section}</p>
                    <h3 className="m-0 text-[17px] leading-6 font-medium text-black">{doc.title}</h3>
                    <div className="mt-1">
                      <DocumentMeta doc={doc} />
                    </div>
                  </div>
                  <DocumentActions doc={doc} />
                </li>
              ))}
              <li className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="mb-1 text-[12px] leading-4 font-medium tracking-[0.12em] text-[#6b7280] uppercase">AGM Transcript</p>
                  <h3 className="m-0 text-[17px] leading-6 font-medium text-black">Transcript of the 37th Annual General Meeting</h3>
                  <p className="mt-1 text-[13px] leading-5 text-[#6b7280]">Read online · 30 September 2026</p>
                </div>
                <Link
                  href={sectionHref("agm-transcript")}
                  className="inline-flex items-center justify-center gap-2 self-start rounded-full bg-[#007ac3] px-5 py-2.5 text-[15px] leading-5 font-medium !text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#00aeef] sm:self-auto"
                >
                  Read transcript <ArrowIcon className="size-4" />
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-5 lg:sticky lg:top-[100px] lg:self-start">
            <div className="rounded-[20px] border border-[#e6e9ee] bg-[#f6f7f9] p-6 md:p-8">
              <p className="mb-2 text-[12px] leading-4 font-medium tracking-[0.16em] text-[#007ac3] uppercase">Company at a glance</p>
              <h2 className="m-0 text-[22px] leading-8 font-medium text-black">{company.name}</h2>
              <dl className="mt-5 space-y-4 text-[15px] leading-6">
                <div>
                  <dt className="text-[13px] text-[#6b7280]">Corporate Identity Number (CIN)</dt>
                  <dd className="m-0 font-medium break-all text-black">{company.cin}</dd>
                </div>
                <div>
                  <dt className="text-[13px] text-[#6b7280]">Registered office</dt>
                  <dd className="m-0 text-black">{company.registeredOffice}</dd>
                </div>
              </dl>
              <Link
                href={sectionHref("company-details")}
                className="mt-6 inline-flex items-center gap-2 text-[15px] font-medium !text-[#007ac3] hover:!text-black"
              >
                Full company details <ArrowIcon className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

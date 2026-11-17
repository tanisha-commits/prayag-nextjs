import Link from "next/link";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { faFilePdf } from "@fortawesome/free-regular-svg-icons";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { withBasePath } from "@/lib/base-path";
import { cn } from "@/lib/utils";
import { BreadcrumbJsonLd } from "../seo";
import {
  INVESTORS_PATH,
  company,
  formatBytes,
  investorSections,
  sectionHref,
  type InvestorDocument,
  type SectionKey,
} from "./data";

// Font Awesome styles are imported above; stop it injecting them again at runtime.
config.autoAddCss = false;

/* ------------------------------------------------------------------ */
/* Icons                                                               */
/* ------------------------------------------------------------------ */

type IconProps = { className?: string };
const svg = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
  "aria-hidden": true,
};

export function ArrowIcon({ className }: IconProps) {
  return (
    <svg {...svg} className={className}>
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

export function DownloadIcon({ className }: IconProps) {
  return (
    <svg {...svg} className={className}>
      <path d="M12 4v11m0 0-4.5-4.5M12 15l4.5-4.5M5 19h14" />
    </svg>
  );
}

export function EyeIcon({ className }: IconProps) {
  return (
    <svg {...svg} className={className}>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="2.8" />
    </svg>
  );
}

export function MailIcon({ className }: IconProps) {
  return (
    <svg {...svg} className={className}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 6.5 8.5 6.5 8.5-6.5" />
    </svg>
  );
}

export function PinIcon({ className }: IconProps) {
  return (
    <svg {...svg} className={className}>
      <path d="M12 21s-7-6.2-7-11.5a7 7 0 1 1 14 0C19 14.8 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  );
}

const sectionIconPaths: Record<SectionKey, React.ReactNode> = {
  "company-details": (
    <>
      <path d="M4 21V5.5A1.5 1.5 0 0 1 5.5 4h7A1.5 1.5 0 0 1 14 5.5V21M14 10h4.5a1.5 1.5 0 0 1 1.5 1.5V21M2.5 21h19" />
      <path d="M7.5 8h3M7.5 11.5h3M7.5 15h3" />
    </>
  ),
  "board-and-committees": (
    <>
      <circle cx="12" cy="7.5" r="3" />
      <circle cx="5" cy="10" r="2.2" />
      <circle cx="19" cy="10" r="2.2" />
      <path d="M6.5 20v-1.5a5.5 5.5 0 0 1 11 0V20M1.5 19v-.8A3.5 3.5 0 0 1 5 14.7M22.5 19v-.8a3.5 3.5 0 0 0-3.5-3.5" />
    </>
  ),
  policies: (
    <>
      <path d="M12 3 4.5 6v5.5c0 4.6 3.2 8.3 7.5 9.5 4.3-1.2 7.5-4.9 7.5-9.5V6L12 3Z" />
      <path d="m8.8 12 2.2 2.2 4.3-4.4" />
    </>
  ),
  "csr-annual-action-plan": (
    <>
      <path d="M12 20.5s-8-4.6-8-10.6A4.4 4.4 0 0 1 12 7.3a4.4 4.4 0 0 1 8 2.6c0 6-8 10.6-8 10.6Z" />
      <path d="M8.5 12.5h2l1-2 1.5 4 1-2h1.5" />
    </>
  ),
  "annual-returns": (
    <>
      <path d="M6 3h8.5L19 7.5V20a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
      <path d="M14 3v5h5M8.5 17v-3M12 17v-5.5M15.5 17v-2" />
    </>
  ),
  "notice-of-agm": (
    <>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
      <path d="M3.5 9.5h17M8 3v4M16 3v4M8 13.5h3M8 17h6" />
    </>
  ),
  "agm-transcript": (
    <>
      <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v9a1.5 1.5 0 0 1-1.5 1.5H10l-4.5 4v-4h0A1.5 1.5 0 0 1 4 14.5v-9Z" />
      <path d="M8 8.5h8M8 12h5" />
    </>
  ),
};

export function SectionIcon({ section, className }: { section: SectionKey; className?: string }) {
  return (
    <svg {...svg} className={className}>
      {sectionIconPaths[section]}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

export function InvestorHero({
  title,
  intro,
  section,
  aside,
}: {
  title: string;
  intro?: string;
  section?: { key: SectionKey; title: string };
  /** Optional content shown beside the heading on large screens (the overview's key facts). */
  aside?: React.ReactNode;
}) {
  const crumbs = [{ name: "Investors", path: INVESTORS_PATH }];
  if (section) crumbs.push({ name: section.title, path: sectionHref(section.key) });

  const crumbLink = "!text-[#6b7280] transition-colors hover:!text-[#007ac3]";

  return (
    <>
      <BreadcrumbJsonLd items={crumbs} />
      <section className="border-b border-[#e6e9ee] bg-white">
        <div className="prayag-container py-9 md:py-14">
          <nav aria-label="Breadcrumb" className="mb-6 text-[14px] leading-5 text-[#9aa3ad]">
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <li>
                <a href={withBasePath("/")} className={crumbLink}>
                  Home
                </a>
              </li>
              <li aria-hidden="true">/</li>
              {section ? (
                <>
                  <li>
                    <Link href={INVESTORS_PATH} className={crumbLink}>
                      Investors
                    </Link>
                  </li>
                  <li aria-hidden="true">/</li>
                  <li aria-current="page" className="text-[#007ac3]">
                    {section.title}
                  </li>
                </>
              ) : (
                <li aria-current="page" className="text-[#007ac3]">
                  Investors
                </li>
              )}
            </ol>
          </nav>
          <div className={cn(aside && "grid items-center gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] xl:gap-16")}>
            <div>
              <p className="mb-4 flex items-center gap-3 text-[13px] leading-5 font-medium tracking-[0.18em] text-[#007ac3] uppercase">
                <span aria-hidden="true" className="h-[2px] w-8 rounded-full bg-gradient-to-r from-[#007ac3] to-[#00aeef]" />
                Investor Relations
              </p>
              <h1 className="m-0 max-w-[900px] text-[30px] leading-[1.15] font-medium text-[#1a1a1a] md:text-[42px] lg:text-[50px]">
                {title}
              </h1>
              {intro && <p className="mt-4 max-w-[680px] text-[16px] leading-7 text-[#5b6470] md:text-[18px] md:leading-8">{intro}</p>}
            </div>
            {aside}
          </div>
        </div>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Section layout with side navigation                                 */
/* ------------------------------------------------------------------ */

export function InvestorSectionLayout({ active, children }: { active: SectionKey; children: React.ReactNode }) {
  return (
    <section className="bg-[#f6f7f9] py-8 md:py-14">
      <div className="prayag-container">
        {/* Mobile / tablet: horizontally scrolling section tabs */}
        <nav aria-label="Investor sections" className="-mx-3 mb-6 overflow-x-auto px-3 lg:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <ul className="flex w-max gap-2">
            <li>
              <Link
                href={INVESTORS_PATH}
                className="block rounded-full border border-[#dfe3e8] bg-white px-4 py-2 text-[14px] leading-5 whitespace-nowrap !text-[#333]"
              >
                Overview
              </Link>
            </li>
            {investorSections.map((s) => (
              <li key={s.key}>
                <Link
                  href={sectionHref(s.key)}
                  aria-current={s.key === active ? "page" : undefined}
                  className={cn(
                    "block rounded-full border px-4 py-2 text-[14px] leading-5 whitespace-nowrap",
                    s.key === active ? "border-[#007ac3] bg-[#007ac3] !text-white" : "border-[#dfe3e8] bg-white !text-[#333]",
                  )}
                >
                  {s.navLabel}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="grid gap-8 lg:grid-cols-[290px_minmax(0,1fr)] xl:grid-cols-[320px_minmax(0,1fr)] xl:gap-10">
          <aside className="hidden lg:block">
            <div className="sticky top-[100px] space-y-5">
              <nav aria-label="Investor sections" className="rounded-[20px] border border-[#e6e9ee] bg-white p-3">
                <Link
                  href={INVESTORS_PATH}
                  className="mb-1 flex items-center gap-2 rounded-xl px-4 py-3 text-[13px] leading-5 font-medium tracking-[0.12em] !text-[#6b7280] uppercase transition-colors hover:!text-black"
                >
                  <FontAwesomeIcon icon={faArrowLeft} aria-hidden="true" className="!h-3.5 !w-3.5" /> Investors overview
                </Link>
                <ul className="space-y-1">
                  {investorSections.map((s) => {
                    const current = s.key === active;
                    return (
                      <li key={s.key}>
                        <Link
                          href={sectionHref(s.key)}
                          aria-current={current ? "page" : undefined}
                          className={cn(
                            "group flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] leading-5 transition-colors",
                            current ? "bg-[#e6f4fb] font-medium !text-[#007ac3]" : "!text-[#222] hover:bg-[#f1f4f7]",
                          )}
                        >
                          <span className={cn("text-[12px] tabular-nums", current ? "text-[#007ac3]" : "text-[#9aa3ad]")}>{s.index}</span>
                          <span className="flex-1">{s.navLabel}</span>
                          <ArrowIcon className={cn("size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5", current ? "opacity-100" : "opacity-40")} />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
              <InvestorContactCard compact />
            </div>
          </aside>

          <div className="min-w-0">{children}</div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Content building blocks                                             */
/* ------------------------------------------------------------------ */

export function Panel({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("rounded-[20px] border border-[#e6e9ee] bg-white p-5 md:p-8", className)}>{children}</div>;
}

export function PanelHeading({ eyebrow, title, text }: { eyebrow?: string; title: string; text?: string }) {
  return (
    <div className="mb-6">
      {eyebrow && <p className="mb-2 text-[12px] leading-4 font-medium tracking-[0.16em] text-[#007ac3] uppercase">{eyebrow}</p>}
      <h2 className="m-0 text-[22px] leading-8 font-medium text-black md:text-[28px] md:leading-9">{title}</h2>
      {text && <p className="mt-2 max-w-[680px] text-[15px] leading-6 text-[#5b6470] md:text-[16px]">{text}</p>}
    </div>
  );
}

function PdfBadge() {
  return (
    <span aria-hidden="true" className="flex size-14 shrink-0 items-center justify-center rounded-[14px] bg-[#e6f4fb] text-[#007ac3]">
      <FontAwesomeIcon icon={faFilePdf} className="!h-7 !w-auto" />
    </span>
  );
}

const btnBase =
  "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-[15px] leading-5 font-medium transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0d6efd]";

export function DocumentActions({ doc, size = "md" }: { doc: InvestorDocument; size?: "md" | "lg" }) {
  const lg = size === "lg" ? "px-7 py-3.5 text-[16px]" : "";
  return (
    <div className="flex flex-wrap gap-2.5">
      <a
        href={withBasePath(doc.file)}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(btnBase, lg, "bg-[#007ac3] !text-white hover:-translate-y-0.5 hover:bg-[#00aeef]")}
      >
        <EyeIcon className="size-[18px]" />
        View
        <span className="sr-only"> {doc.title} (PDF, opens in a new tab)</span>
      </a>
      <a
        href={withBasePath(doc.file)}
        download={doc.downloadName}
        className={cn(btnBase, lg, "border border-[#d5dae0] !text-[#1a1a1a] hover:-translate-y-0.5 hover:border-[#007ac3] hover:!text-[#007ac3]")}
      >
        <DownloadIcon className="size-[18px]" />
        Download
        <span className="sr-only">
          {" "}
          {doc.title} (PDF, {formatBytes(doc.bytes)})
        </span>
      </a>
    </div>
  );
}

export function DocumentMeta({ doc }: { doc: InvestorDocument }) {
  return (
    <p className="text-[13px] leading-5 text-[#6b7280]">
      PDF · {doc.pages} pages · {formatBytes(doc.bytes)}
    </p>
  );
}

export function DocumentCard({ doc, latest = false }: { doc: InvestorDocument; latest?: boolean }) {
  return (
    <article className="group flex flex-col gap-5 rounded-[18px] border border-[#e6e9ee] bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#c9d3dd] hover:shadow-[0_18px_40px_-24px_rgba(0,40,80,0.35)] md:flex-row md:items-center md:p-6">
      <div className="flex min-w-0 flex-1 items-start gap-4">
        <PdfBadge />
        <div className="min-w-0">
          <div className="mb-1.5 flex flex-wrap items-center gap-2">
            {doc.period && (
              <span className="rounded-full bg-[#e6f4fb] px-2.5 py-0.5 text-[12px] leading-5 font-medium text-[#007ac3]">{doc.period}</span>
            )}
            {latest && <span className="rounded-full bg-[#00aeef] px-2.5 py-0.5 text-[12px] leading-5 font-medium text-white">Latest</span>}
          </div>
          <h3 className="m-0 text-[17px] leading-6 font-medium text-black md:text-[18px]">{doc.title}</h3>
          {doc.description && <p className="mt-1 text-[14px] leading-[22px] text-[#5b6470]">{doc.description}</p>}
          <div className="mt-1.5">
            <DocumentMeta doc={doc} />
          </div>
        </div>
      </div>
      <div className="md:shrink-0">
        <DocumentActions doc={doc} />
      </div>
    </article>
  );
}

export function DocumentList({ docs, markLatest = false }: { docs: InvestorDocument[]; markLatest?: boolean }) {
  return (
    <div className="space-y-3.5">
      {docs.map((d, i) => (
        <DocumentCard key={d.file} doc={d} latest={markLatest && i === 0} />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Investor contact                                                    */
/* ------------------------------------------------------------------ */

export function InvestorContactCard({ compact = false }: { compact?: boolean }) {
  return (
    <div className={cn("h-full rounded-[20px] border border-[#cfe9f7] bg-[#eef8fd] text-[#1a1a1a]", compact ? "p-6" : "p-6 md:p-10")}>
      <p className="mb-2 text-[12px] leading-4 font-medium tracking-[0.16em] text-[#007ac3] uppercase">Investor contact</p>
      <h2 className={cn("m-0 font-medium text-[#1a1a1a]", compact ? "text-[19px] leading-7" : "text-[24px] leading-8 md:text-[30px] md:leading-10")}>
        {compact ? "Questions about a disclosure?" : "Shareholder and investor queries"}
      </h2>
      {!compact && (
        <p className="mt-3 max-w-[560px] text-[15px] leading-6 text-[#5b6470] md:text-[16px]">
          For any query relating to the Company&apos;s statutory documents or disclosures, please write to us at the email address
          below.
        </p>
      )}
      <ul className={cn("space-y-3 text-[15px] leading-6", compact ? "mt-4" : "mt-6")}>
        <li className="flex gap-3">
          <MailIcon className="mt-0.5 size-5 shrink-0 text-[#007ac3]" />
          <a href={`mailto:${company.email}`} className="break-all font-medium !text-[#007ac3] underline-offset-4 hover:underline">
            {company.email}
          </a>
        </li>
        <li className="flex gap-3 text-[#5b6470]">
          <PinIcon className="mt-0.5 size-5 shrink-0 text-[#007ac3]" />
          <span>{company.registeredOffice}</span>
        </li>
      </ul>
    </div>
  );
}

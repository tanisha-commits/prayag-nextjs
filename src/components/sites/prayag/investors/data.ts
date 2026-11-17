// Investor Relations content for Prayag Polymers Limited.
// Source: the company's statutory documents supplied by the secretarial team (November 2026).
// PDFs live in /public/sites/prayag/files/investors.

const FILES = "/sites/prayag/files/investors";

export const INVESTORS_PATH = "/investors";

export type SectionKey =
  | "company-details"
  | "board-and-committees"
  | "policies"
  | "csr-annual-action-plan"
  | "annual-returns"
  | "notice-of-agm"
  | "agm-transcript";

export interface InvestorSection {
  key: SectionKey;
  /** Number shown on the hub card, in the order of the statutory folder. */
  index: string;
  title: string;
  /** Short label for the side navigation and mega menu. */
  navLabel: string;
  summary: string;
  seoTitle: string;
  seoDescription: string;
}

export const investorSections: InvestorSection[] = [
  {
    key: "company-details",
    index: "01",
    title: "Details of Company",
    navLabel: "Details of Company",
    summary: "Corporate identity, CIN, registered office and investor contact of Prayag Polymers Limited.",
    seoTitle: "Company Details | Investor Relations | Prayag",
    seoDescription:
      "Corporate details of Prayag Polymers Limited: company name, CIN U74899DL1989PLC036420, registered office in New Delhi and investor contact email.",
  },
  {
    key: "board-and-committees",
    index: "02",
    title: "Board of Directors & Committees",
    navLabel: "Board & Committees",
    summary: "Composition of the Board of Directors, Key Managerial Personnel and the Board's committees.",
    seoTitle: "Board of Directors & Committees | Investor Relations | Prayag",
    seoDescription:
      "Composition of the Board of Directors of Prayag Polymers Limited and its Audit, Nomination & Remuneration and CSR Committees.",
  },
  {
    key: "policies",
    index: "03",
    title: "Policies",
    navLabel: "Policies",
    summary: "CSR, Nomination & Remuneration and Whistle Blower policies, and Independent Director appointment terms.",
    seoTitle: "Corporate Policies | Investor Relations | Prayag",
    seoDescription:
      "Read or download the corporate policies of Prayag Polymers Limited: CSR Policy, Nomination and Remuneration Policy, Whistle Blower Policy and Independent Director terms.",
  },
  {
    key: "csr-annual-action-plan",
    index: "04",
    title: "CSR Annual Action Plan",
    navLabel: "CSR Annual Action Plan",
    summary: "Year-wise CSR Annual Action Plans under Rule 5(2) of the Companies (CSR Policy) Rules.",
    seoTitle: "CSR Annual Action Plan | Investor Relations | Prayag",
    seoDescription:
      "CSR Annual Action Plans of Prayag Polymers Limited for FY 2024-25, FY 2025-26 and FY 2026-27, as per Rule 5(2) of the CSR Rules.",
  },
  {
    key: "annual-returns",
    index: "05",
    title: "Annual Returns",
    navLabel: "Annual Returns",
    summary: "Annual Returns in Form MGT-7 filed under Section 92 of the Companies Act, 2013.",
    seoTitle: "Annual Returns (Form MGT-7) | Investor Relations | Prayag",
    seoDescription:
      "Download the Annual Returns (Form MGT-7) of Prayag Polymers Limited for FY 2022-23 to FY 2025-26, filed under Section 92 of the Companies Act, 2013.",
  },
  {
    key: "notice-of-agm",
    index: "06",
    title: "Notice of AGM",
    navLabel: "Notice of AGM",
    summary: "Notice convening the 37th Annual General Meeting of the Members of the Company.",
    seoTitle: "Notice of Annual General Meeting | Investor Relations | Prayag",
    seoDescription:
      "Notice of the 37th Annual General Meeting of Prayag Polymers Limited, held on 30 September 2026 through video conferencing.",
  },
  {
    key: "agm-transcript",
    index: "07",
    title: "AGM Transcript",
    navLabel: "AGM Transcript",
    summary: "Transcript of the proceedings of the 37th Annual General Meeting held on 30 September 2026.",
    seoTitle: "37th AGM Transcript | Investor Relations | Prayag",
    seoDescription:
      "Transcript of the proceedings of the 37th Annual General Meeting of Prayag Polymers Limited held on 30 September 2026 through VC/OAVM.",
  },
];

export function sectionHref(key: SectionKey): string {
  return `${INVESTORS_PATH}/${key}`;
}

export function getSection(key: SectionKey): InvestorSection {
  const section = investorSections.find((s) => s.key === key);
  if (!section) throw new Error(`Unknown investor section: ${key}`);
  return section;
}

/* ------------------------------------------------------------------ */
/* 01. Details of company                                              */
/* ------------------------------------------------------------------ */

export const company = {
  name: "Prayag Polymers Limited",
  cin: "U74899DL1989PLC036420",
  registeredOffice: "2483-84, Prayag Infinity House, Nalwa Street, Paharganj, New Delhi-110055",
  email: "info@prayagindia.com",
  companySecretary: "Mrs. Aditi Dhawan",
};

/* ------------------------------------------------------------------ */
/* 02. Board of directors and committees                              */
/* ------------------------------------------------------------------ */

export type PersonCategory = "executive" | "independent" | "kmp";

export interface BoardMember {
  name: string;
  designation: string;
  category: PersonCategory;
}

export const boardOfDirectors: BoardMember[] = [
  { name: "Mr. Nitin Aggarwal", designation: "Managing Director + Chairman", category: "executive" },
  { name: "Mr. Deepak Aggarwal", designation: "Whole Time Director", category: "executive" },
  { name: "Mrs. Shipra Aggarwal", designation: "Whole Time Director", category: "executive" },
  { name: "Mr. Ashok Thakur", designation: "Independent Director", category: "independent" },
  { name: "Mrs. Pooja Hemant Goyal", designation: "Independent Director", category: "independent" },
  { name: "Mr. Anant Kumar", designation: "Independent Director", category: "independent" },
  { name: "Mr. Amit Gupta", designation: "CFO", category: "kmp" },
  { name: "Mrs. Aditi Dhawan", designation: "Company Secretary", category: "kmp" },
];

export interface Committee {
  name: string;
  members: { name: string; role: "Chairperson" | "Member" }[];
}

export const committees: Committee[] = [
  {
    name: "Audit Committee",
    members: [
      { name: "Mr. Ashok Thakur", role: "Chairperson" },
      { name: "Mr. Nitin Aggarwal", role: "Member" },
      { name: "Mr. Anant Kumar", role: "Member" },
    ],
  },
  {
    name: "Nomination & Remuneration Committee",
    members: [
      { name: "Mr. Anant Kumar", role: "Chairperson" },
      { name: "Mr. Ashok Kumar Thakur", role: "Member" },
      { name: "Mrs. Pooja Hemant Goyal", role: "Member" },
    ],
  },
  {
    name: "CSR Committee",
    members: [
      { name: "Mrs. Shipra Aggarwal", role: "Chairperson" },
      { name: "Mrs. Pooja Hemant Goyal", role: "Member" },
      { name: "Mr. Deepak Aggarwal", role: "Member" },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* PDF documents (03 – 06)                                             */
/* ------------------------------------------------------------------ */

export interface InvestorDocument {
  title: string;
  description?: string;
  /** Financial year or period shown as a tag, e.g. "FY 2025-26". */
  period?: string;
  file: string;
  /** Name used when the visitor downloads the file. */
  downloadName: string;
  pages: number;
  bytes: number;
}

function doc(file: string, rest: Omit<InvestorDocument, "file" | "downloadName">): InvestorDocument {
  return { file: `${FILES}/${file}`, downloadName: `Prayag-${file}`, ...rest };
}

export const policies: InvestorDocument[] = [
  doc("csr-policy.pdf", {
    title: "Corporate Social Responsibility Policy",
    description: "CSR Policy under the Companies Act, 2013 and the Companies (CSR Policy) Rules, 2021. Version 1.2, authorised by the CSR Committee.",
    pages: 7,
    bytes: 837349,
  }),
  doc("nomination-remuneration-policy.pdf", {
    title: "Nomination and Remuneration Policy",
    description: "Policy on nomination and remuneration of Directors, Key Managerial Personnel and Senior Management.",
    pages: 5,
    bytes: 177693,
  }),
  doc("terms-appointment-independent-directors.pdf", {
    title: "Terms and Conditions of Appointment of Independent Directors",
    description: "Terms of appointment, role, duties and responsibilities of the Independent Directors of the Company.",
    pages: 3,
    bytes: 234226,
  }),
  doc("whistle-blower-policy.pdf", {
    title: "Whistle Blower Policy",
    description: "Vigil mechanism for employees and other stakeholders to report genuine concerns about unethical behaviour.",
    pages: 3,
    bytes: 35823,
  }),
];

/** Latest first. */
export const csrActionPlans: InvestorDocument[] = [
  doc("csr-annual-action-plan-2026-27.pdf", { title: "CSR Annual Action Plan FY 2026-27", period: "FY 2026-27", pages: 3, bytes: 467115 }),
  doc("csr-annual-action-plan-2025-26.pdf", { title: "CSR Annual Action Plan FY 2025-26", period: "FY 2025-26", pages: 3, bytes: 468218 }),
  doc("csr-annual-action-plan-2024-25.pdf", { title: "CSR Annual Action Plan FY 2024-25", period: "FY 2024-25", pages: 3, bytes: 468080 }),
];

/** Latest first. */
export const annualReturns: InvestorDocument[] = [
  doc("annual-return-mgt-7-2025-26.pdf", { title: "Annual Return (Form MGT-7) FY 2025-26", description: "Financial year 01/04/2025 to 31/03/2026.", period: "FY 2025-26", pages: 20, bytes: 416199 }),
  doc("annual-return-mgt-7-2024-25.pdf", { title: "Annual Return (Form MGT-7) FY 2024-25", description: "Financial year 01/04/2024 to 31/03/2025.", period: "FY 2024-25", pages: 19, bytes: 406880 }),
  doc("annual-return-mgt-7-2023-24.pdf", { title: "Annual Return (Form MGT-7) FY 2023-24", description: "Financial year 01/04/2023 to 31/03/2024.", period: "FY 2023-24", pages: 14, bytes: 1203097 }),
  doc("annual-return-mgt-7-2022-23.pdf", { title: "Annual Return (Form MGT-7) FY 2022-23", description: "Financial year 01/04/2022 to 31/03/2023.", period: "FY 2022-23", pages: 14, bytes: 1014287 }),
];

export const agmNotices: InvestorDocument[] = [
  doc("notice-of-37th-agm-2026.pdf", {
    title: "Notice of the 37th Annual General Meeting",
    description: "Notice convening the 37th Annual General Meeting of the Members of Prayag Polymers Limited.",
    period: "AGM 2026",
    pages: 19,
    bytes: 4942971,
  }),
];

export function formatBytes(bytes: number): string {
  return bytes >= 1024 * 1024 ? `${(bytes / (1024 * 1024)).toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`;
}

export const documentCounts: Record<SectionKey, number | null> = {
  "company-details": null,
  "board-and-committees": null,
  policies: policies.length,
  "csr-annual-action-plan": csrActionPlans.length,
  "annual-returns": annualReturns.length,
  "notice-of-agm": agmNotices.length,
  "agm-transcript": null,
};

/* ------------------------------------------------------------------ */
/* 07. Transcript of the 37th AGM                                      */
/* ------------------------------------------------------------------ */

export const agmTranscript = {
  title: "Transcript of the Proceedings of the 37th Annual General Meeting",
  heldOn: "Held on 30 September 2026 at 11:00 A.M. through Video Conferencing (VC)/Other Audio Visual Means (OAVM)",
  details: [
    { label: "Date and time", value: "30 September 2026 at 11:00 A.M." },
    { label: "Mode", value: "Video Conferencing (VC)/Other Audio Visual Means (OAVM)" },
    { label: "Deemed venue", value: "Registered Office: 2483-84, Prayag Infinity House, Nalwa Street, Paharganj, Delhi – 110055" },
    { label: "Conclusion", value: "11:23 A.M." },
  ],
  opening: [
    "Ms. Aditi Dhawan, Company Secretary, welcomed the Members, Directors, Key Managerial Personnel and invitees to the 37th Annual General Meeting of Prayag Polymers Limited (the “Company”). She informed the participants that the Meeting had been convened pursuant to the Notice circulated to the Members and requested them to keep their microphones muted unless invited to speak.",
  ],
  attendeesIntro: "The following Directors and other officials attended the Meeting through VC/OAVM:",
  attendees: [
    { name: "Mr. Nitin Aggarwal", role: "Chairperson & Managing Director" },
    { name: "Mr. Deepak Aggarwal", role: "Whole-time Director" },
    { name: "Ms. Shipra Aggarwal", role: "Whole-time Director" },
    { name: "Mr. Ashok Kumar Thakur", role: "Independent Director" },
    { name: "Mr. Anant Kumar", role: "Independent Director" },
    { name: "Ms. Pooja Hemant Goyal", role: "Independent Director" },
    { name: "Mr. Amit Gupta", role: "Chief Financial Officer" },
    { name: "Mr. J.P. Sharma", role: "Vice President – Accounts & Taxation" },
    { name: "Mr. Devender Khurana", role: "Statutory Auditor" },
    { name: "Mr. Y.J. Basrar", role: "Secretarial Auditor" },
    { name: "Ms. Aditi Dhawan", role: "Company Secretary" },
  ],
  quorum: [
    "Mr. Nitin Aggarwal, Chairperson & Managing Director, acted as the Chairperson of the Meeting in accordance with the Companies Act, 2013 and the Articles of Association of the Company.",
    "The Members attending through VC/OAVM confirmed their presence. Six (6) Members, out of a total of eleven (11) Members of the Company, were present through VC/OAVM. The Chairperson declared that the requisite quorum under Section 103 of the Companies Act, 2013 was present and that the Meeting was duly constituted.",
    "The Company Secretary informed the Members that the Meeting was being convened at shorter notice and that the requisite consent of the Members had been obtained.",
  ],
  noticeAndReports: [
    "The Company Secretary informed the Members that the Notice convening the 37th Annual General Meeting, together with the Annual Report for the financial year ended 31 March 2026, had already been circulated. With the permission of the Members, the Notice was taken as read.",
    "The Auditor’s Report and the Board’s Report forming part of the Annual Report had also been circulated and, with the permission of the Members, were taken as read.",
    "The statutory registers and other documents referred to in the Notice and required to be made available for inspection were made available for inspection in accordance with the applicable provisions.",
  ],
  chairpersonAddress: [
    "The Chairperson welcomed the Members and presented an overview of the Company’s performance for the financial year ended 31 March 2026. He thanked the Members, customers, employees, bankers, business associates and other stakeholders for their continued support.",
  ],
  businessIntro:
    "The Company Secretary informed the Members that the Meeting would consider the six items of business set out in the Notice. The resolutions were proposed and seconded and were put to vote by show of hands.",
  resolutions: [
    {
      group: "Ordinary Business",
      items: [
        { no: 1, text: "Adoption of Audited Financial Statements of the Company for the Financial Year ended 31st March, 2026, together with the Reports of the Board of Directors and Statutory Auditors thereon.", nature: "Ordinary Resolution" },
        { no: 2, text: "Re-appointment of Mr. Deepak Aggarwal (DIN: 00981693), who retires by rotation and being eligible, offers himself for re-appointment.", nature: "Ordinary Resolution" },
      ],
    },
    {
      group: "Special Business",
      items: [
        { no: 3, text: "Ratification of Remuneration payable to M/s Pant S. & Associates, Cost Accountants, appointed as Cost Auditor of the Company for the Financial Year 2026–27.", nature: "Ordinary Resolution" },
        { no: 4, text: "Approval for payment of minimum remuneration of ₹1,80,00,000 per annum to Mr. Nitin Aggarwal, Chairperson & Managing Director, for the Financial Year 2026–27, notwithstanding inadequacy or absence of profits.", nature: "Special Resolution" },
        { no: 5, text: "Approval for payment of minimum remuneration of ₹1,68,00,000 per annum to Mr. Deepak Aggarwal, Whole-time Director, for the Financial Year 2026–27, notwithstanding inadequacy or absence of profits.", nature: "Special Resolution" },
        { no: 6, text: "Approval for payment of remuneration of ₹60,00,000 per annum to Ms. Shipra Aggarwal, Whole-time Director, for the Financial Year 2026–27", nature: "Special Resolution" },
      ],
    },
  ],
  conclusion: [
    "The minutes record that there was no other business and that the Meeting concluded with a vote of thanks to the Chair. The Meeting concluded at 11:23 A.M.",
  ],
};

export function sectionMetadataInput(key: SectionKey) {
  const s = getSection(key);
  return { title: s.seoTitle, description: s.seoDescription, path: sectionHref(key) };
}

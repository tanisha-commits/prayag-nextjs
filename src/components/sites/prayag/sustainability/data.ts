// Content for /sustainability (source: prayagindia.com/sustainability).

export const susBanner = {
  image: "/sites/prayag/files/2026-10/Sustainability-top-banner.webp",
  title: "Sustainability",
};

export const susPurpose = {
  heading: "Prayag Social Activities",
  text: "The Corporate Social Responsibility initiatives of Prayag focuses on improving the quality of life of the underprivileged and weaker section of the society, especially in the areas touching our Organisation. We tirelessly work towards the betterment of the poor and addressing the needs of the weaker section, pushing outward their development. Our main focus areas are the healthcare sector, education sector and environment.",
  image: "/sites/prayag/files/2026-10/Social-Activities.webp",
};

export const susTrust = {
  heading: "Prayag Prayas Trust",
  intro: [
    "Prayag Prayas Trust, a registered Trust having registration number CSR00028770 has been establish by Prayag to conduct its CSR Activities.",
    "Currently we have two Projects named",
  ],
  projects: ["Project Education for All", "Project Health Care"],
  outro: "& various programs and will continue to do so.",
  image: "/sites/prayag/files/2026-10/Prayas-Trust.webp",
};

export const susProjectsTitle = "Our Projects";

export type SusProject = {
  title: string;
  image: string;
  imageAlt: string;
  /** Rendered as a bulleted list when `points` is set, otherwise as one paragraph. */
  points?: string[];
  text?: string;
};

// The source list items end with a non-breaking space (&nbsp;); kept verbatim.
export const susProjects: SusProject[] = [
  {
    title: "Healthcare",
    image: "/sites/prayag/files/2026-10/Healthcare.webp",
    imageAlt: "Healthcare",
    points: [
      "A Homeopathy Charitable Clinic has been set up by the Trust in which a reputed doctor has been appointed who provide free Medical consultation to the public at large. It also provide homeopathic medicines to the general public at a very nominal fees. The Clinic has provided treatment to many patients till date. ",
      "Another Charitable Clinic has been set up by the Trust in the month of May, 2019 in which acupressure and neurotherapy treatment is provided to the general public at large, free of cost, by a reputed doctor appointed for the same. ",
      "In the month of November, 2019 the Trust has also set up a Charitable Clinic in which allopathic treatment is provided to the general public. For this, a very reputed doctor from CGHS has been appointed. He gives free consultation and medicines to the patients.  ",
    ],
  },
  {
    title: "Education for All",
    image: "/sites/prayag/files/2024-08/education-for-all.webp",
    imageAlt: "education for all.webp",
    text: "A tuition centre in the name of Rise and Shine has been setup by the Trust in the month of December,2019.We have take utmost care as to the safety, health and sanitation of the Children.",
  },
];

export const susReports: { name: string; href: string; image: string; imageAlt: string }[] = [
  {
    name: "CSR Policy",
    href: "/sites/prayag/files/2024-07/csr-policy.pdf",
    image: "/sites/prayag/files/2026-10/CSR-policy.webp",
    imageAlt: "CSR Policy",
  },
  {
    name: "Action Plan 2024-25",
    href: "/sites/prayag/files/2024-07/action-plan.pdf",
    image: "/sites/prayag/files/2026-10/ACTION-PLAN-2024-25.webp",
    imageAlt: "Action Plan 2024-25",
  },
];

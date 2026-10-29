// Content of https://prayagindia.com/composite-pipes, verbatim (card alts and titles do not
// always match on the source, e.g. the brass cards; kept as published).

import type { FaqItem, Feature, FittingPane, ImageCard, SpecPane } from "../ppr-pipes/types";

export const fittingPanes: FittingPane[] = [
  {
    id: "pane-nylon",
    tabId: "tab-nylon",
    tabLabel: "Nylon Fittings",
    sliderLabel: "Nylon Fittings product range",
    cards: [
      { src: "/sites/prayag/theme/Composite%20pipe%20_nylon_brass/Nylon/Union-Coupler.webp", alt: "Nylon Union Coupler 20 mm", title: "Union Coupler", meta: [{ label: "Range :", value: " 20mm to 40mm" }] },
      { src: "/sites/prayag/theme/Composite%20pipe%20_nylon_brass/Nylon/Equal-Elbow-900.webp", alt: "Nylon Equal Elbow 90 degree 20 mm", title: "Equal Elbow 90°", meta: [{ label: "Range :", value: " 20mm to 40mm" }] },
      { src: "/sites/prayag/theme/Composite%20pipe%20_nylon_brass/Nylon/Equal-Tee.webp", alt: "Nylon Equal Tee 20 mm", title: "Equal Tee", meta: [{ label: "Range :", value: " 20mm to 40mm" }] },
      { src: "/sites/prayag/theme/Composite%20pipe%20_nylon_brass/Nylon/Female-Elbow-900.webp", alt: "Nylon Female Tee 20 x half inch", title: "Female Elbow 90°", meta: [{ label: "Range :", value: " 20mm to 40mm" }] },
      { src: "/sites/prayag/theme/Composite%20pipe%20_nylon_brass/Nylon/Female-Tee.webp", alt: "Nylon Female Tee 20 x half inch", title: "Female Tee", meta: [{ label: "Range:", value: " 20 × ½″ mm to 25 X 1⁄2 mm" }] },
      { src: "/sites/prayag/theme/Composite%20pipe%20_nylon_brass/Nylon/Female-Threaded-Adapter.webp", alt: "Nylon Female Threaded Adapter 20 x half inch", title: "Female Threaded Adapter", meta: [{ label: "Range:", value: " 20 × ½″ mm to 25 X 1⁄2″mm" }] },
      { src: "/sites/prayag/theme/Composite%20pipe%20_nylon_brass/Nylon/Male-Threaded-Adapter.webp", alt: "Nylon Male Threaded Adapter 20 x half inch", title: "Male Threaded Adapter", meta: [{ label: "Range:", value: " 20 × ½″ mm to 25 X 1⁄2″ mm" }] },
    ],
  },
  {
    id: "pane-brass",
    tabId: "tab-brass",
    tabLabel: "Composite Brass Fittings",
    sliderLabel: "Composite Brass Fittings product range",
    cards: [
      { src: "/sites/prayag/theme/Composite%20pipe%20_nylon_brass/Brass/Unequal-Coupler.webp", alt: "Brass Equal Elbow 90 degree", title: "Unequal Coupler", meta: [{ label: "Range:", value: " 20 x 16 mm to 32 x 25 mm" }] },
      { src: "/sites/prayag/theme/Composite%20pipe%20_nylon_brass/Brass/Male-Threaded.webp", alt: "Brass Equal Tee fitting", title: "Male Threaded Adapter", meta: [{ label: "Range:", value: " 16 x 1⁄2\" mm to 32 x 1 1⁄4 mm" }] },
      { src: "/sites/prayag/theme/Composite%20pipe%20_nylon_brass/Brass/Unequal-Tee.webp", alt: "Brass Female Threaded Adapter", title: "Unequal Tee", meta: [{ label: "Range:", value: " 20 x 16 x 20 mm to 32 x 25 x 32 mm" }] },
      { src: "/sites/prayag/theme/Composite%20pipe%20_nylon_brass/Brass/Female-Threaded1.webp", alt: "Brass Female Threaded Adapter variant 2", title: "Female Threaded Adapter", meta: [{ label: "Range:", value: " 16 x 1⁄2\" mm to 32 x 1 1⁄4\" mm" }] },
      { src: "/sites/prayag/theme/Composite%20pipe%20_nylon_brass/Brass/Female-Threaded-Tee.webp", alt: "Brass Female Threaded Tee", title: "Female Threaded Tee", meta: [{ label: "Range:", value: " 16 x 1⁄2\" mm to 25 x 1\"mm" }] },
      { src: "/sites/prayag/theme/Composite%20pipe%20_nylon_brass/Brass/Male-threaded-Ekbow-90.webp", alt: "Brass Male Threaded Adapter", title: "Male Threaded Elbow 90°", meta: [{ label: "Range:", value: " 20 x 1⁄2\" mm" }] },
      { src: "/sites/prayag/theme/Composite%20pipe%20_nylon_brass/Brass/Female-Threaded.webp", alt: "Brass Male Threaded Elbow 90 degree", title: "Female Threaded Elbow 90°", meta: [{ label: "Range:", value: " 16 x 1⁄2\" mm to 32 x 1 1⁄4\" mm" }] },
      { src: "/sites/prayag/theme/Composite%20pipe%20_nylon_brass/Brass/Union-Coupler.webp", alt: "Brass Unequal Coupler", title: "Union Coupler", meta: [{ label: "Range:", value: " 16 mm to 50mm" }], emptyMetaItem: true },
      { src: "/sites/prayag/theme/Composite%20pipe%20_nylon_brass/Brass/Equal-Elbow-90.webp", alt: "Brass Unequal Elbow 90 degree", title: "Equal Elbow 90°", meta: [{ label: "Range:", value: " 16 mm to 50mm" }], emptyMetaItem: true },
      { src: "/sites/prayag/theme/Composite%20pipe%20_nylon_brass/Brass/Equal-Tee.webp", alt: "Brass Unequal Tee", title: "Equal Tee", meta: [{ label: "Range:", value: " 16 mm to 50mm" }], emptyMetaItem: true },
      { src: "/sites/prayag/theme/Composite%20pipe%20_nylon_brass/Brass/Unequal-Elbow-90.webp", alt: "Brass Union Coupler", title: "Unequal Elbow 90°", meta: [{ label: "Range:", value: " 20 x 16 mm to 32 x 25mm" }], emptyMetaItem: true },
    ],
  },
];

export const applications: ImageCard[] = [
  { src: "/sites/prayag/theme/composite_pipes/application_icon/Menufucter.webp", alt: "Manufacturing plants", title: "Manufacturing Plants and Industrial Facilities", text: "Chemical and heat-resistant piping for process, cooling & utility lines" },
  { src: "/sites/prayag/theme/composite_pipes/application_icon/Food.webp", alt: "Food processing units", title: "Food Processing and Packaging Units", text: "Hygienic, corrosion-free pipelines built for food-grade safety standards" },
  { src: "/sites/prayag/theme/composite_pipes/application_icon/Automotive.webp", alt: "Automotive operations", title: "Automotive and Assembly-Line Operations", text: "Precision-engineered lines for coolant, air & hydraulic systems" },
  { src: "/sites/prayag/theme/composite_pipes/application_icon/Hospital.webp", alt: "Healthcare infrastructure", title: "Hospitals, Clinics and Healthcare Infrastructure", text: "Medical gas and pure water supply lines built to clinical safety codes" },
  { src: "/sites/prayag/theme/composite_pipes/application_icon/Residential.webp", alt: "High-rise residential towers", title: "High-Rise Residential Towers", text: "Vertical riser and horizontal distribution networks" },
  { src: "/sites/prayag/theme/composite_pipes/application_icon/Commercial.webp", alt: "Commercial buildings", title: "Commercial Buildings", text: "Office blocks, malls, institutional campuses" },
  { src: "/sites/prayag/theme/composite_pipes/application_icon/Industry.webp", alt: "Industrial parks", title: "Industrial Parks and Utilities", text: "Internal water networks, process-water supply" },
];

export const faqs: FaqItem[] = [
  {
    question: "1. What are Prayag Composite Pipes?",
    answer: [
      "Prayag Composite Pipes are a ",
      { href: "https://prayagindia.com/pipes-fittings", text: "pressure-pipe solution" },
      " built with a five-layer PE-AL-PE structure. The design combines polyethylene layers with a form-stable aluminium core to provide durability, thermal compatibility, corrosion resistance, tensile strength, and reliable fluid flow across several applications.",
    ],
  },
  {
    question: "2. How is the five-layer PE-AL-PE pipe constructed?",
    answer: [
      "The composite structure places an overlap-welded aluminium core between high-performance polyethylene layers. Prayag states that the aluminium core thickness ranges from 0.18 mm to 0.33 mm, while the complete five-layer architecture is designed to combine the useful properties of polymer and metal materials.",
    ],
  },
  {
    question: "3. Why does the pipe combine polyethylene and aluminium?",
    answer: [
      "The polyethylene layers provide a smooth, hygienic, and corrosion-resistant fluid path, while the aluminium core improves shape retention and thermal stability. This combination is designed to address the thermal movement associated with ",
      { href: "/best-pipes-for-plumbing-and-types-of-plastic-pipes", text: "standard plastic pipes" },
      " and the corrosion that can affect conventional metal pipes.",
    ],
  },
  {
    question: "4. Which standard and sizes apply to Prayag Composite Pipes?",
    answer: [
      "Prayag states that its PE-AL-PE Composite Pipes comply with ",
      { href: "/why-builders-contractors-prefer-certified-pipes-fittings-large-projects", text: "IS 15450:2022" },
      ". The listed outside-diameter size range is 12 mm to 40 mm, and the polyethylene density specification is 940.4 to 948.0 kilograms per cubic metre.",
    ],
  },
  {
    question: "5. What coil lengths are available and how do they affect joints?",
    answer: [
      "The product page lists coil lengths of up to 300 metres. Prayag states that these long coils can eliminate up to 80 percent of ",
      { href: "/how-choose-leak-resistant-pipe-fittings-new-home-construction", text: "potential leak points" },
      " compared with rigid 6-metre pipes because fewer intermediate joints may be required along a pipeline route.",
    ],
  },
  {
    question: "6. What is the design life of Prayag Composite Pipes?",
    answer: [
      "Prayag describes the range as having a 50-year design life. Actual service performance depends on selecting the correct product variant, size, fittings, operating conditions, installation method, and maintenance practices for the intended application.",
    ],
  },
  {
    question: "7. Are Prayag Composite Pipes suitable for potable water?",
    answer: [
      "Prayag states that the pipes are manufactured from food-grade material for hygienic flow. EVER flow, identified by its white colour, is listed for ",
      { href: "https://prayagindia.com/cpvc-pipes", text: "potable and residential water supply systems" },
      ", while LIFE flow, identified by black, is intended for standard water supply and ISI-compliant applications.",
    ],
  },
  {
    question: "8. What do the different pipe colours and product names indicate?",
    answer: [
      "The range uses colour coding to identify the intended fluid or application. LIFE flow is black for standard water supply, EVER flow is white for potable and residential water, SAFE flow is yellow for LPG and natural gas, and OXY flow is blue for medical air and oxygen supply.",
    ],
  },
  {
    question: "9. Can Prayag Composite Pipes carry LPG or natural gas?",
    answer: [
      "SAFE flow is the yellow composite pipe variant listed for LPG and natural gas pipeline distribution. Gas systems require the correct approved pipe variant, compatible fittings, specialist installation, testing, and compliance with all applicable safety codes.",
    ],
  },
  {
    question: "10. Can the pipes be used for medical air and oxygen systems?",
    answer: [
      "OXY flow is the blue variant developed for specialized medical air and oxygen supply in healthcare infrastructure. These critical systems must be designed, installed, tested, and commissioned according to the relevant clinical and safety requirements.",
    ],
  },
  {
    question: "11. Where else can Prayag Composite Pipes be used?",
    answer: [
      "The listed application areas include manufacturing plants, food-processing units, automotive and assembly operations, hospitals, high-rise residential towers, commercial buildings, and ",
      { href: "/ugd-pipes-fittings", text: "industrial parks and utilities" },
      ". Specific uses include water, process, cooling, utility, coolant, air, hydraulic, and medical-gas lines.",
    ],
  },
  {
    question: "12. How do Prayag Composite Pipes manage thermal movement?",
    answer: [
      "The aluminium core provides a low expansion rate that helps reduce the sagging associated with some standard polymers. Prayag also lists an oxidation induction time above 20 minutes at 200 degrees Celsius as a thermal-stability specification; this is a material test value, not a stated operating temperature.",
    ],
  },
  {
    question: "13. How does the smooth interior affect water flow?",
    answer: [
      "The smooth inner surface is designed to support hydraulic efficiency with less internal resistance. Prayag states that the pipe can facilitate 30 percent more flow than traditional alternatives, although actual flow depends on pipe size, system layout, fittings, pressure, and operating conditions.",
    ],
  },
  {
    question: "14. Can Prayag Composite Pipes be bent during installation?",
    answer: [
      "Prayag states that the pipes can be hand-bent and retain their shape without spring-back, which can reduce the number of directional fittings required. The pipes are also described as up to 70 percent lighter than metal, supporting easier transport, handling, and installation.",
    ],
  },
  {
    question: "15. Which fittings are available and how should the system be selected?",
    answer: [
      "The range includes ",
      { href: "https://prayagindia.com/pipes-fittings", text: "nylon and brass fittings" },
      " such as union couplers, equal and unequal elbows, tees, threaded adaptors, and reducer connections. Select the pipe variant, diameter, fittings, and joining tools for the intended fluid, temperature, pressure, route, and applicable code. A ",
      { href: "/plumbers-guide-choosing-right-pipe-different-plumbing-points", text: "qualified plumbing professional" },
      " should confirm the final system design and installation method.",
    ],
  },
];

export const specPanes: SpecPane[] = [
  {
    paneId: "pane-testing",
    tabId: "tab-testing",
    label: "PE-AL-PE Composite Pipe",
    table: {
      head: ["Feature", "Specification"],
      rows: [
        ["Material Standard", "IS 15450:2022"],
        ["Structure", "5-Layer PE-AL-PE"],
        ["PE Density", "940.4 – 948.0 kg/m³"],
        ["Size Range (OD)", "12mm to 40mm"],
        ["Aluminium Core", "Overlap-welded (0.18mm to 0.33mm)"],
        ["Max Coil Length", "Up to 300 Metres"],
        ["Thermal Stability", "OIT > 20 minutes at 200°C"],
      ],
    },
  },
];

export const features: Feature[] = [
  { src: "/sites/prayag/theme/composite_pipes/superior_ROI.webp", alt: "Superior ROI", label: "Superior ROI", text: "A strategic business decision that reduces project risk and lifecycle maintenance labor." },
  { src: "/sites/prayag/theme/composite_pipes/50_more_composite_icon.webp", alt: "50-Year Design Life", label: "50-Year Design Life", text: "Engineered for lasting reliability in the most demanding environments." },
  { src: "/sites/prayag/theme/composite_pipes/hygiene_and_safe.webp", alt: "Hygienic and Safe", label: "Hygienic & Safe", text: "Manufactured from Food Grade Material to ensure pure and clean flow." },
  { src: "/sites/prayag/theme/composite_pipes/application_icon/uv_protection.webp", alt: "Weather Proof", label: "Weather Proof", text: "Built with excellent UV resistance to withstand harsh conditions without degradation." },
];

/** `.cp-card`s of "What are Composite Pipes" (`data-flow` drives the colour accents in the page CSS). */
export const flowCards = [
  {
    flow: "life",
    src: "/sites/prayag/theme/composite_pipes/Life_flow_cover.webp",
    alt: "LIFE flow composite pipe",
    colour: "Black",
    title: "LIFE flow",
    text: "Standard water supply and ISI-compliant applications.",
  },
  {
    flow: "ever",
    src: "/sites/prayag/theme/composite_pipes/Ever-Flow.webp",
    alt: "EVER flow composite pipe",
    colour: "White",
    title: "EVER flow",
    text: "Potable and residential (PRT) water supply systems.",
  },
  {
    flow: "safe",
    src: "/sites/prayag/theme/composite_pipes/Safe-Flow_compsite.webp",
    alt: "SAFE flow composite pipe",
    colour: "Yellow",
    title: "SAFE flow",
    text: "LPG and Natural Gas pipeline distribution.",
  },
  {
    flow: "oxy",
    src: "/sites/prayag/theme/composite_pipes/Oxy_Flow_composite_pipes.webp",
    alt: "OXY flow composite pipe",
    colour: "Blue",
    title: "OXY flow",
    text: "Specialized Medical Air and Oxygen supply for healthcare infrastructure.",
  },
];

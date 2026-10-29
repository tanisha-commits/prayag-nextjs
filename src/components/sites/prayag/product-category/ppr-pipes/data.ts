// Content of https://prayagindia.com/ppr-pipes, verbatim (including "Temprature" in the tab labels).
// Feature icons are /media/<id> on the source; the identical files from the Drupal backup are used.

import type { FaqItem, Feature, FittingPane, SpecPane } from "./types";

export const fittingPanes: FittingPane[] = [
  {
    id: "pane-nylon",
    tabId: "tab-nylon",
    tabLabel: "Bluetech (work in -35 C Temprature)",
    sliderLabel: "Thermotech Blue Fittings product range",
    cards: [
      { src: "/sites/prayag/theme/ppr-pipes/Blue/Coupler.webp", alt: "Blue Coupler", title: "Coupler", meta: [{ label: "Range:", value: " 20mm to 110mm" }] },
      { src: "/sites/prayag/theme/ppr-pipes/Blue/Elbow-90.webp", alt: "Blue Elbow 90°", title: "Elbow 90°", meta: [{ label: "Range:", value: " 20mm to 110mm" }] },
      { src: "/sites/prayag/theme/ppr-pipes/Blue/Reducer-Coupling.webp", alt: "Blue Reducer Coupling", title: "Reducer Coupling", meta: [{ label: "Range:", value: " 25×20mm to 63×50mm" }] },
      { src: "/sites/prayag/theme/ppr-pipes/Blue/Equal-Tee.webp", alt: "Blue Equal Tee", title: "Equal Tee", meta: [{ label: "Range:", value: " 20mm to 110mm" }] },
      { src: "/sites/prayag/theme/ppr-pipes/Blue/Female-Threaded-Elbow-900.webp", alt: "Blue Female Threaded Elbow 90°", title: "Female Threaded Elbow 90°", meta: [{ label: "Range:", value: " 20×½″ to 40×1″" }] },
      { src: "/sites/prayag/theme/ppr-pipes/Blue/Male-Threaded-Coupler.webp", alt: "Blue Male Threaded Coupler", title: "Male Threaded Coupler", meta: [{ label: "Range:", value: " 20×½″ to 25×¾″" }] },
      { src: "/sites/prayag/theme/ppr-pipes/Blue/Union.webp", alt: "Blue Union", title: "Union", meta: [{ label: "Range:", value: " 20mm to 63mm" }] },
      { src: "/sites/prayag/theme/ppr-pipes/Blue/Female-Threaded-Coupler.webp", alt: "Blue Female Threaded Coupler", title: "Female Threaded Coupler", meta: [{ label: "Range:", value: " 20×½″ to 25×¾″" }] },
      { src: "/sites/prayag/theme/ppr-pipes/Blue/Reducer-Tee.webp", alt: "Blue Reducer Tee", title: "Reducer Tee", meta: [{ label: "Range:", value: " 25×20mm to 63×50mm" }] },
      { src: "/sites/prayag/theme/ppr-pipes/Blue/Female-Threaded-Tee.webp", alt: "Blue Female Threaded Tee", title: "Female Threaded Tee", meta: [{ label: "Range:", value: " 20×½″ to 40×1″" }] },
      { src: "/sites/prayag/theme/ppr-pipes/Blue/Male-Threaded-Tee.webp", alt: "Blue Male Threaded Tee", title: "Male Threaded Tee", meta: [{ label: "Range:", value: " 20×½″ to 40×1″" }] },
      { src: "/sites/prayag/theme/ppr-pipes/Blue/Male-Threaded-Elbow-900.webp", alt: "Blue Male Threaded Elbow 90°", title: "Male Threaded Elbow 90°", meta: [{ label: "Range:", value: " 20×½″ to 40×1″" }] },
    ],
  },
  {
    id: "pane-brass",
    tabId: "tab-brass",
    tabLabel: "Puretech (work in -15 C Temprature)",
    sliderLabel: "Puretech White Fittings product range",
    cards: [
      { src: "/sites/prayag/theme/ppr-pipes/White/Coupler.webp", alt: "White Coupler", title: "Coupler", meta: [{ label: "Range:", value: " 20mm to 110mm" }] },
      { src: "/sites/prayag/theme/ppr-pipes/White/Elbow-90.webp", alt: "White Elbow 90°", title: "Elbow 90°", meta: [{ label: "Range:", value: " 20mm to 110mm" }] },
      { src: "/sites/prayag/theme/ppr-pipes/White/Reducer-Coupling.webp", alt: "White Reducer Coupling", title: "Reducer Coupling", meta: [{ label: "Range:", value: " 25×20mm to 63×50mm" }] },
      { src: "/sites/prayag/theme/ppr-pipes/White/Equal-Tee.webp", alt: "White Equal Tee", title: "Equal Tee", meta: [{ label: "Range:", value: " 20mm to 110mm" }] },
      { src: "/sites/prayag/theme/ppr-pipes/White/Female-Threaded-elbow-900.webp", alt: "White Female Threaded Elbow 90°", title: "Female Threaded Elbow 90°", meta: [{ label: "Range:", value: " 20×½″ to 40×1″" }] },
      { src: "/sites/prayag/theme/ppr-pipes/White/Male-Threaded-Coupler.webp", alt: "White Male Threaded Coupler", title: "Male Threaded Coupler", meta: [{ label: "Range:", value: " 20×½″ to 25×¾″" }] },
      { src: "/sites/prayag/theme/ppr-pipes/White/Union.webp", alt: "White Union", title: "Union", meta: [{ label: "Range:", value: " 20mm to 63mm" }] },
      { src: "/sites/prayag/theme/ppr-pipes/White/Female-Threaded-Coupler.webp", alt: "White Female Threaded Coupler", title: "Female Threaded Coupler", meta: [{ label: "Range:", value: " 20×½″ to 25×¾″" }] },
      { src: "/sites/prayag/theme/ppr-pipes/White/Reducer-Tee.webp", alt: "White Reducer Tee", title: "Reducer Tee", meta: [{ label: "Range:", value: " 25×20mm to 63×50mm" }] },
      { src: "/sites/prayag/theme/ppr-pipes/White/Female-Threaded-Tee.webp", alt: "White Female Threaded Tee", title: "Female Threaded Tee", meta: [{ label: "Range:", value: " 20×½″ to 40×1″" }] },
      { src: "/sites/prayag/theme/ppr-pipes/White/Male-Threaded-Tee.webp", alt: "White Male Threaded Tee", title: "Male Threaded Tee", meta: [{ label: "Range:", value: " 20×½″ to 40×1″" }] },
      { src: "/sites/prayag/theme/ppr-pipes/White/Male-Threaded-Elbow-900.webp", alt: "White Male Threaded Elbow 90°", title: "Male Threaded Elbow 90°", meta: [{ label: "Range:", value: " 20×½″ to 40×1″" }] },
    ],
  },
  {
    id: "pane-green",
    tabId: "tab-green",
    tabLabel: "Toughtech (work in -10 C Temprature)",
    sliderLabel: "Toughtech Green Fittings product range",
    cards: [
      { src: "/sites/prayag/theme/ppr-pipes/Green/Coupler.webp", alt: "Green Coupler", title: "Coupler", meta: [{ label: "Range:", value: " 20mm to 110mm" }] },
      { src: "/sites/prayag/theme/ppr-pipes/Green/Elbow-90.webp", alt: "Green Elbow 90°", title: "Elbow 90°", meta: [{ label: "Range:", value: " 20mm to 110mm" }] },
      { src: "/sites/prayag/theme/ppr-pipes/Green/Reducer-Coupling.webp", alt: "Green Reducer Coupling", title: "Reducer Coupling", meta: [{ label: "Range:", value: " 25×20mm to 63×50mm" }] },
      { src: "/sites/prayag/theme/ppr-pipes/Green/Equal-Tee.webp", alt: "Green Equal Tee", title: "Equal Tee", meta: [{ label: "Range:", value: " 20mm to 110mm" }] },
      { src: "/sites/prayag/theme/ppr-pipes/Green/Female-Threaded-Elbow-90.webp", alt: "Green Female Threaded Elbow 90°", title: "Female Threaded Elbow 90°", meta: [{ label: "Range:", value: " 20×½″ to 40×1″" }] },
      { src: "/sites/prayag/theme/ppr-pipes/Green/Male-Threaded-Coupler.webp", alt: "Green Male Threaded Coupler", title: "Male Threaded Coupler", meta: [{ label: "Range:", value: " 20×½″ to 25×¾″" }] },
      { src: "/sites/prayag/theme/ppr-pipes/Green/Union.webp", alt: "Green Union", title: "Union", meta: [{ label: "Range:", value: " 20mm to 63mm" }] },
      { src: "/sites/prayag/theme/ppr-pipes/Green/Female-Threaded-Coupler.webp", alt: "Green Female Threaded Coupler", title: "Female Threaded Coupler", meta: [{ label: "Range:", value: " 20×½″ to 25×¾″" }] },
      { src: "/sites/prayag/theme/ppr-pipes/Green/Reducer-Tee.webp", alt: "Green Reducer Tee", title: "Reducer Tee", meta: [{ label: "Range:", value: " 25×20mm to 63×50mm" }] },
      { src: "/sites/prayag/theme/ppr-pipes/Green/Female-Threaded-Tee.webp", alt: "Green Female Threaded Tee", title: "Female Threaded Tee", meta: [{ label: "Range:", value: " 20×½″ to 40×1″" }] },
      { src: "/sites/prayag/theme/ppr-pipes/Green/Male-Threaded-Tee.webp", alt: "Green Male Threaded Tee", title: "Male Threaded Tee", meta: [{ label: "Range:", value: " 20×½″ to 40×1″" }] },
      { src: "/sites/prayag/theme/ppr-pipes/Green/Male-Threaded-Elbow-90.webp", alt: "Green Male Threaded Elbow 90°", title: "Male Threaded Elbow 90°", meta: [{ label: "Range:", value: " 20×½″ to 40×1″" }] },
    ],
  },
];

export const faqs: FaqItem[] = [
  {
    question: "1. What are Prayag PPR Pipes?",
    answer: [
      "Prayag PPR Pipes are made from Polypropylene Random Copolymer, a lightweight material designed for ",
      { href: "https://prayagindia.com/pipes-fittings", text: "plumbing and industrial fluid-transport systems" },
      ". The pipes combine pressure strength, temperature resistance, corrosion resistance, and long-term durability.",
    ],
  },
  {
    question: "2. Can Prayag PPR Pipes be used for hot and cold water?",
    answer: [
      "Yes. Prayag lists ",
      { href: "/upvc-vs-cpvc-vs-ppr-pipes-which-one-best-your-project", text: "hot and cold water distribution" },
      " as a core application for its PPR system. The correct pipe size, PN pressure rating, temperature category, fittings, and installation method should be selected for the operating conditions.",
    ],
  },
  {
    question: "3. Where can Prayag PPR Pipes be installed?",
    answer: [
      "Applications include residential and commercial water supply, high-rise riser networks, ",
      { href: "/composite-pipes", text: "industrial piping" },
      ", chemical transportation lines, HVAC systems, compressed-air networks, and specified oxygen-supply infrastructure in hospitals and clinics.",
    ],
  },
  {
    question: "4. What is the expected service life of Prayag PPR Pipes?",
    answer: [
      "Prayag states that its PPR systems are designed for a ",
      { href: "/how-select-durable-pipes-fittings-long-term-use", text: "service life" },
      " of up to 50 years. Actual performance depends on correct product selection, operating temperature and pressure, water quality, ",
      { href: "/reducing-water-wastage-quality-pipes-and-tank-connections", text: "compatible fittings" },
      ", fusion quality, installation conditions, and maintenance.",
    ],
  },
  {
    question: "5. What are Bluetech, Puretech, and Toughtech PPR Pipes?",
    answer: [
      "These are color-coded triple-layer PPR variants for different low-temperature conditions. Prayag lists Bluetech as an anti-freezing pipe for temperatures down to -35 degrees C, Puretech down to -15 degrees C, and Toughtech down to -10 degrees C.",
    ],
  },
  {
    question: "6. Which pressure ratings are available for Prayag PPR Pipes?",
    answer: [
      "The product page lists PN-10, PN-16, and PN-20 pressure ratings. The suitable rating must be chosen according to the design pressure, water temperature, pipe diameter, application, safety requirements, and applicable ",
      { href: "/why-builders-contractors-prefer-certified-pipes-fittings-large-projects", text: "project specifications" },
      ".",
    ],
  },
  {
    question: "7. How are Prayag PPR Pipes and fittings joined?",
    answer: [
      "The system uses socket fusion welding. A specialized tool heats the matching pipe and fitting surfaces so they can be joined into a permanent, strong, and ",
      { href: "/how-choose-leak-resistant-pipe-fittings-new-home-construction", text: "leak-resistant connection" },
      ". Installers should follow Prayag instructions for tool temperature, heating, joining, and cooling times.",
    ],
  },
  {
    question: "8. What sizes are available in the Prayag PPR range?",
    answer: [
      "Prayag lists PPR ",
      { href: "/best-pipes-for-plumbing-and-types-of-plastic-pipes", text: "pipe sizes" },
      " from 20 mm to 200 mm. Individual fittings have their own ranges: couplers, 90-degree elbows, and equal tees are listed from 20 mm to 110 mm, while reducer and threaded fittings are offered in specified combinations.",
    ],
  },
  {
    question: "9. Are Prayag PPR Pipes resistant to heat, corrosion, and chemicals?",
    answer: [
      "Yes. The page describes the PPR system as resistant to heat, rust, corrosion, scaling, and chemical degradation. The material is therefore suited to a range of water and industrial applications when the conveyed fluid and operating conditions are compatible with the selected system.",
    ],
  },
  {
    question: "10. Are PPR Pipes suitable for hard-water areas?",
    answer: [
      "Their resistance to corrosion and scaling can make PPR pipes a practical option for many ",
      { href: "/best-pipe-hard-water-areas-india", text: "hard-water locations" },
      ". Water chemistry and operating conditions still vary, so pipe selection, system design, and maintenance should be confirmed for the property or project.",
    ],
  },
  {
    question: "11. Which fittings are available for Prayag PPR Pipes?",
    answer: [
      "The range includes couplers, 90-degree elbows, reducer couplings, equal tees, unions, reducer tees, female and male threaded couplers, female and male threaded tees, and female and male threaded elbows. Use ",
      { href: "https://prayagindia.com/pipes-fittings", text: "fittings" },
      " that match the pipe size, rating, and fusion system.",
    ],
  },
  {
    question: "12. Are Prayag PPR Pipes easy to transport and install?",
    answer: [
      "Their lightweight construction can simplify handling, transportation, and on-site installation. However, reliable performance depends on accurate cutting, clean and aligned components, correct socket-fusion parameters, compatible pipes and fittings, and ",
      { href: "/plumbers-guide-choosing-right-pipe-different-plumbing-points", text: "trained installation" },
      ".",
    ],
  },
  {
    question: "13. Can Prayag PPR Pipes be used in HVAC and compressed-air systems?",
    answer: [
      "Yes. Prayag lists HVAC installations and compressed-air networks among the applications for its PPR range. The design team should verify temperature, pressure, fluid compatibility, pipe support, jointing, and regulatory requirements before specifying the system.",
    ],
  },
  {
    question: "14. How does Prayag check the quality of its PPR system?",
    answer: [
      "Prayag describes multi-stage quality controls that include material checks, bonding-integrity checks, dimensional accuracy, and pressure testing. These checks are intended to support consistent pipe and fitting performance across different applications.",
    ],
  },
  {
    question: "15. How do I choose the right PPR Pipe for a project?",
    answer: [
      "Start with the application, fluid, temperature range, working pressure, required flow, pipe diameter, and installation environment. Then select the appropriate PN rating, triple-layer variant, and compatible fittings. A qualified plumbing professional or project engineer should confirm the final specification.",
    ],
  },
];

export const specPanes: SpecPane[] = [
  {
    paneId: "pane-testing",
    tabId: "tab-testing",
    label: "PPR Pipe Technical & Product Overview",
    table: {
      head: ["Feature", "Specification / Detail"],
      rows: [
        ["Material", "Polypropylene Random Copolymer (PPR)"],
        ["Construction", "Triple Layer Pipe technology"],
        ["Pressure Ratings (PN)", "PN-10, PN-16, and PN-20"],
        ["Size Range", "20mm to 200mm"],
        ["Joining Method", "Socket Fusion Welding using a specialized tool kit"],
        ["Core Properties", "Heat resistant, corrosion resistant, high pressure strength, and lightweight design"],
        ["Expected Work Life", "Approximately 50 years"],
      ],
    },
  },
  {
    paneId: "pane-testing-1",
    tabId: "tab-testing-1",
    label: "Specialized PPR Product Lines",
    intro: "Prayag offers color-coded triple-layer pipes engineered for specific temperature environments:",
    table: {
      head: ["Product Line", "Pipe Color", "Low-Temperature Tolerance", "Primary Characteristics"],
      rows: [
        ["Bluetech", "Blue", "Works down to -35°C", "Anti-freezing triple layer"],
        ["Puretech", "White", "Works down to -15°C", "Standard triple layer"],
        ["Toughtech", "Green", "Works down to -10°C", "Standard triple layer"],
      ],
    },
  },
  {
    paneId: "pane-testing-2",
    tabId: "tab-testing-2",
    label: "PPR Pipe Applications",
    table: {
      head: ["Sector", "Typical Usage"],
      rows: [
        ["Residential & Commercial", "Hot and cold water supply systems, high-rise residential riser networks, office blocks, and malls"],
        ["Industrial", "Industrial piping networks, chemical transportation lines, and process-water supply"],
        ["Technical & Medical", "HVAC installations, compressed air systems, and oxygen supply infrastructure in hospitals"],
      ],
    },
  },
  {
    paneId: "pane-testing-3",
    tabId: "tab-testing-3",
    label: "Joining Process Specifications (Socket Fusion)",
    intro: "To ensure leak-proof connections, the following technical parameters are recommended during the welding process:",
    table: {
      head: ["Process Step", "Technical Requirement / Parameter"],
      rows: [
        ["Tool Temperature", "0-300°C (Waiting for red indicator light)"],
        ["Heating Time", "5 - 6 Seconds"],
        ["Joining Time", "4 - 6 Seconds"],
        ["Cooling Time", "2 - 4 Minutes"],
        ["Safety Equipment", "Heat-resistant gloves"],
      ],
    },
  },
];

export const features: Feature[] = [
  { src: "/sites/prayag/files/2026-08/long-life-.webp", alt: "Fire Resistant", label: "High Strength & Long Service Life", text: "Engineered for superior pressure resistance, ensuring durability and dependable performance for years." },
  { src: "/sites/prayag/files/2026-08/heat-.webp", alt: "Cost Effective", label: "Heat & Corrosion Resistant", text: "Designed to withstand high temperatures and resist corrosion, scaling, and chemical degradation." },
  { src: "/sites/prayag/files/2026-08/3-layaer-.webp", alt: "Easy to Install", label: "Advanced Triple-Layer Technology", text: "Available in specialized variants for extreme temperature conditions, offering enhanced protection and reliability." },
  { src: "/sites/prayag/files/2026-08/leak-proof-pipe-.webp", alt: "Maintenance Free", label: "Leak-Proof Fusion Joints", text: "Socket fusion welding creates permanent, leak-proof connections for a safer and maintenance-free piping system." },
  { src: "/sites/prayag/files/2026-08/light-weight.webp", alt: "Strong & Durable", label: "Lightweight & Easy Installation", text: "Low-weight construction enables faster handling, transportation, and installation on-site." },
  { src: "/sites/prayag/theme/ppr-pipes/Versatile_icon.webp", alt: "Strong & Durable", label: "Versatile Application Range", text: "Ideal for hot & cold water supply, HVAC systems, industrial piping, compressed air networks, and commercial plumbing." },
  { src: "/sites/prayag/files/2026-08/validate.webp", alt: "Strong & Durable", label: "Assured Quality & Performance", text: "Manufactured under stringent quality controls and tested to deliver consistent performance across every application." },
];

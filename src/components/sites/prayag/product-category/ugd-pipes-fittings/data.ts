// Content for /ugd-pipes-fittings (source: prayagindia.com/ugd-pipes-fittings, taxonomy/term/213).
// Text is verbatim from the live page, including its typos.

import type { Faq } from "../cpvc-plumbing-solution/faq-section";

/** "Why Choose" card; `iconAlt` is omitted where the source <img> has no alt attribute. */
export type FeatureCard = { title: string; text: string; icon: string; iconAlt?: string };

export type LabelledItem = { label: string; text: string };

export const features: FeatureCard[] = [
  { title: "Corrosion and Chemical Resistant", text: "Non-reactive with acidic or alkaline substances, keeping the system completely immune to underground chemical erosion — even under aggressive effluent and soil conditions.", icon: "/sites/prayag/theme/product_categories/UPVC%20Column%20Pipes/Why%20choose%20icon/Corrosion-Free-Rust-Proof.webp", iconAlt: "Corrosion & Chemical Resistant" },
  { title: "Superior Strength & Structural Integrity", text: "Engineered to withstand extreme underground pressure without cracking, unlike traditional cement or cast-iron pipes that fracture under soil movement and load.", icon: "/sites/prayag/files/2026-07/Superior-Strength-Structural-Integrity.webp" },
  { title: "High Hydraulic Efficiency", text: "A mirror-smooth inner surface keeps friction low, preventing scale buildup and blockages — so wastewater flows freely, even on flatter gradients.", icon: "/sites/prayag/files/2026-07/High-Hydraulic-Efficiency.webp" },
  { title: "Lead-Free & Safe", text: "Manufactured as Pb (lead-free), ensuring zero hazardous leaching into the surrounding soil and groundwater — a critical requirement for green-certified developments (LEED/IGBC).", icon: "/sites/prayag/theme/upvc_column_pipes/lead-free_prayag-icon.webp", iconAlt: "Lead-Free & Safe" },
  { title: "Built for a 25-Year Service Life", text: "Designed for long-term, maintenance-free performance, significantly cutting down replacement and upkeep costs over the life of the system.", icon: "/sites/prayag/files/2026-07/Built-for-a-25-Year-Service-Life.webp" },
  { title: "Cost-Effective Installation", text: "Lightweight uPVC construction means no heavy machinery or welding is required — reducing transport, handling, and labour costs on site.", icon: "/sites/prayag/files/2026-07/Cost-Effective-Installation.webp" },
  { title: "Engineered for Every Load", text: "Available in Standard (SN-4) and Heavy-Duty (SN-8) stiffness classes, so the right pipe can be specified for everything from residential drainage to highways, airports, and municipal infrastructure.", icon: "/sites/prayag/files/2026-07/Engineered-for-Every-Load.webp" },
];

export const applications: LabelledItem[] = [
  { label: "Residential & Urban Drainage:", text: "Apartments, townships, and individual bungalows." },
  { label: "Commercial Complexes:", text: "Shopping malls, hospitals, and office buildings." },
  { label: "Industrial Sewerage:", text: "Chemical effluent transport and factory drainage." },
  { label: "Municipal Projects:", text: "Public sewer networks and stormwater management." },
  { label: "Infrastructure:", text: "Drainage for highways, airports, and sports complexes." },
];

export const benefits: LabelledItem[] = [
  { label: "Chemical & Corrosion Proof:", text: "Non-reactive with acidic or alkaline substances, ensuring the system remains immune to underground chemical erosion." },
  { label: "25-Year Service Life:", text: "Designed for longevity with a life cycle of up to 25 years, significantly reducing replacement costs." },
  { label: "Fast & Cost-Effective Setup:", text: "Lightweight uPVC reduces transportation, handling, and installation costs compared to heavy traditional pipes." },
  { label: "Easy Installation:", text: "No heavy machinery or welding is required, making the installation process quick and hassle-free." },
  { label: "Ultimate Strength & Durability:", text: "Engineered to offer higher strength and superior durability compared to conventional systems." },
  { label: "High Flow Efficiency:", text: "The smooth inner surface ensures easy flow of water and prevents scale buildup." },
];

/** Spec table cells; each cell is a list of lines (the source separates some with <br>). */
export type SpecTable = { head: string[]; rows: string[][][] };

/** Pane #pane-testing. */
export const pipeSpecs: SpecTable = {
  head: ["Type", "Size Range (mm)", "Thickness Range (mm)"],
  rows: [
    [["SN-8 (Heavy Duty)"], ["110 – 315"], ["3.2 – 10.4"]],
    [["SN-4 (Standard)"], ["110 – 200"], ["—"]],
  ],
};

/** Pane #pane-defined. */
export const fittingSpecs: SpecTable = {
  head: ["Jointing System", "Sizes Available", "Fittings Offered"],
  rows: [
    [["Selfit (Solvent Cement)"], ["110 / 160 / 200 mm"], ["Coupler, Tee, Elbow 90°, End Cap"]],
    [["Ringfit (Rubber Ring)"], ["110 / 160 mm", "(Reducer: 110×160)"], ["Coupler, Reducer Coupler, Bend 45°, Bend 87.5°, Tee, Reducer Tee, Cross Tee, Single Y, Pipe Clip"]],
  ],
};

export const faqs: Faq[] = [
  { question: "1. What are Prayag UGD Pipes and Fittings used for?", answer: ["Prayag UGD Pipes and Fittings form an ", { text: "underground drainage and sewerage system", href: "https://prayagindia.com/swr-pipes" }, " for disposing of sewage and surface water. The system is designed for residential, commercial, industrial, municipal, and infrastructure projects that require durable underground wastewater or stormwater transport."] },
  { question: "2. What material are Prayag UGD pipes made from?", answer: ["The pipes are manufactured from rigid uPVC, or unplasticized polyvinyl chloride. Unlike materials that may rust, corrode, or crack, ", { text: "uPVC pipes", href: "https://prayagindia.com/upvc-pipes" }, " are chemically inert, non-porous, lightweight, and designed to withstand demanding underground conditions."] },
  { question: "3. Where can Prayag UGD systems be installed?", answer: ["Applications include residential and urban drainage for apartments, townships, and bungalows; commercial drainage for malls, hospitals, and offices; industrial sewerage and factory drainage; municipal sewers and stormwater systems; and drainage for highways, airports, and sports complexes."] },
  { question: "4. Are Prayag UGD pipes resistant to corrosion and chemicals?", answer: ["Yes. Prayag states that the uPVC material is non-reactive with acidic and alkaline substances. Its ", { text: "corrosion and chemical resistance", href: "/how-select-durable-pipes-fittings-long-term-use" }, " helps protect the drainage system against aggressive effluent, soil conditions, rust, and underground chemical erosion."] },
  { question: "5. Can UGD pipes withstand underground pressure and soil movement?", answer: ["Prayag UGD pipes are engineered for structural strength under ", { text: "underground pressure", href: "/casing-pipes" }, ", soil movement, and external loads. The appropriate stiffness class and installation method must be selected for the site conditions, burial depth, traffic load, and intended application."] },
  { question: "6. How does the smooth inner surface improve drainage flow?", answer: ["The mirror-smooth inner surface keeps friction low and helps wastewater flow efficiently, including on flatter gradients. It also helps resist ", { text: "scale buildup and blockages", href: "/can-plumbing-bottle-trap-prevent-pipe-blockages-heres-truth" }, ", supporting consistent hydraulic performance throughout the underground drainage network."] },
  { question: "7. Are Prayag UGD pipes lead-free?", answer: ["Prayag states that its UGD pipes are manufactured as lead-free products. The non-porous system is designed to prevent hazardous leaching and seepage into the surrounding soil and groundwater while supporting hygienic wastewater transport."] },
  { question: "8. What is the expected service life of Prayag UGD pipes?", answer: ["Prayag describes the system as designed for a service life of up to 25 years. Actual performance depends on correct product selection, trench preparation, jointing, bedding, loading conditions, installation quality, use, and ", { text: "maintenance", href: "/signs-your-pipes-need-replacement" }, " throughout the drainage system's life."] },
  { question: "9. What is the difference between SN-4 and SN-8 UGD pipes?", answer: ["SN-4 is the standard stiffness class, while SN-8 is the ", { text: "heavy-duty class", href: "/why-builders-contractors-prefer-certified-pipes-fittings-large-projects" }, ". Prayag positions these options for different loads, ranging from residential drainage to highways, airports, municipal infrastructure, and other sites exposed to demanding underground conditions."] },
  { question: "10. What sizes and thicknesses are available?", answer: ["The SN-8 Heavy Duty range is listed from 110 mm to 315 mm, with wall thicknesses from 3.2 mm to 10.4 mm. The SN-4 Standard range is listed from 110 mm to 200 mm. The ", { text: "correct pipe size", href: "/best-pipes-for-plumbing-and-types-of-plastic-pipes" }, " should follow the required flow capacity and project design."] },
  { question: "11. What is the Selfit jointing system?", answer: [{ text: "Selfit", href: "https://prayagindia.com/swr-pipe-self-type" }, " uses solvent cement to connect compatible UGD pipes and fittings. Prayag lists Selfit sizes of 110 mm, 160 mm, and 200 mm, with fittings including couplers, tees, 90-degree elbows, and end caps."] },
  { question: "12. What is the Ringfit jointing system?", answer: [{ text: "Ringfit", href: "https://prayagindia.com/swr-pipe-self-type-b" }, " uses a rubber-ring connection to form the pipe joint. Prayag lists 110 mm and 160 mm sizes, along with a 110 by 160 mm reducer. The range includes couplers, bends, tees, reducer fittings, cross tees, single-Y fittings, and pipe clips."] },
  { question: "13. Which fittings are available for Prayag UGD systems?", answer: ["Available ", { text: "fittings", href: "https://prayagindia.com/pipes-fittings" }, " vary by jointing system and include couplers, reducer couplers, 45-degree and 87.5-degree bends, tees, reducer tees, cross tees, single-Y fittings, 90-degree elbows, end caps, and pipe clips. Use only components compatible with the selected pipe and joint type."] },
  { question: "14. Are Prayag UGD pipes easy to transport and install?", answer: ["The lightweight uPVC construction reduces handling and transport demands compared with heavier traditional pipe materials. Prayag states that the system does not require heavy machinery or welding, supporting faster and more cost-effective installation when trenching, bedding, alignment, and jointing are completed correctly."] },
  { question: "15. How do I choose the correct UGD pipe and jointing system?", answer: ["Selection should account for wastewater type, required flow, pipe diameter, burial depth, soil conditions, external loads, route, stiffness class, and the preferred Selfit or Ringfit joint. A ", { text: "qualified plumbing professional", href: "/plumbers-guide-choosing-right-pipe-different-plumbing-points" }, " should confirm the pipe class, fittings, trench design, jointing method, and installation requirements for the project."] },
];

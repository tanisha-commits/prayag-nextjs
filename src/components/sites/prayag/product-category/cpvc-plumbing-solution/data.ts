// Content for /cpvc-plumbing-solution (source: prayagindia.com/cpvc-plumbing-solution, taxonomy/term/209).
// Text is verbatim from the live page, including its typos.

import type { Faq } from "./faq-section";

export type FeatureCard = { title: string; text: string };

/** One `.cp-card` of the "CPVC Fittings & Pipes Range" slider; `bar` picks `cp-card-bar--<bar>`. */
export type RangeCard = { title: string; image: string; alt: string; bar: "blue" | "black" | "yellow" | "white"; range: string };

export type AdvantageItem = { num: string; title: string; text: string };

/** Technical specification row; `highlight` adds the source `cell-highlight` class. */
export type SpecRow = { param: string; value: string; highlight: boolean };

/** "Why Choose" slider; icons are the inline SVGs in feature-icons.tsx (same order). */
export const features: FeatureCard[] = [
  { title: "Superior Hot Water Performance", text: "Engineered with a high Vicat Softening Temperature (>112°C) for reliable hot and cold water applications." },
  { title: "High Strength & Pressure Resistance", text: "Excellent burst strength and load-bearing capacity ensure safe performance under high water pressure." },
  { title: "Corrosion & Chemical Resistant", text: "Resists rust, corrosion, and chemical reactions, ensuring long-lasting durability." },
  { title: "Food-Grade & Safe for Drinking Water", text: "Made from non-toxic, food-grade CPVC that preserves the taste, odour, and purity of water." },
  { title: "Leak-Proof Plumbing System", text: "Solvent-welded joints create permanent, strong, and leak-resistant connections." },
  { title: "Easy Installation & Low Maintenance", text: "Lightweight design enables faster installation while minimizing maintenance throughout its service life." },
  { title: "Complete Plumbing Solution", text: "Available in a wide range of pipes, fittings, valves, and accessories to meet every residential, commercial, and industrial plumbing requirement." },
];

export const applications: string[] = [
  "Residential hot & cold water plumbing",
  "Commercial building water distribution systems",
  "High-rise apartment complexes",
  "Low-rise residential projects",
  "Industrial hot water piping",
  "Institutional buildings (hospitals, schools, hotels)",
];

export const advantages: AdvantageItem[] = [
  { num: "01", title: "Premium Quality & Engineering", text: "Prayag CPVC Pipes are engineered to deliver long-lasting performance through premium material quality, precision manufacturing, and a complete plumbing ecosystem. Manufactured using high-grade CPVC compound, every pipe offers exceptional strength, high pressure-bearing capacity, and excellent resistance to heat, corrosion, chemicals, and scaling. Their smooth inner surface ensures better water flow while preventing deposits, resulting in efficient and reliable performance for years." },
  { num: "02", title: "Compatible Fittings Ecosystem", text: "What truly sets Prayag apart is its comprehensive range of perfectly compatible CPVC fittings and accessories. From elbows, tees, couplings, unions, and adaptors to valves, transition fittings, and specialized connectors, every component is designed for precise fitment and leak-proof solvent-welded joints. This integrated system simplifies installation, reduces maintenance, and ensures consistent performance across the entire plumbing network." },
  { num: "03", title: "Trusted Legacy & Quality", text: "Backed by stringent quality control and a trusted legacy in plumbing solutions, Prayag offers more than just pipes—it delivers a complete, dependable piping system that professionals and homeowners can rely on for safe, efficient, and durable hot and cold water distribution." },
];

/**
 * All 64 source cards, in source order. The source repeats several images (e.g. the seven
 * "Full Turn"/"Long" concealed valves share two photos) and keeps a card titled
 * "Pipe Sch 80 (Duplicate)"; both are reproduced as-is.
 */
export const rangeCards: RangeCard[] = [
  { title: "Pipe SDR 11", image: "/sites/prayag/theme/cpvc/CPVC%20fittings/PIPE-SDR-11.webp", alt: "Pipe SDR 11", bar: "blue", range: "15 mm - 50 mm" },
  { title: "Pipe Sch 80", image: "/sites/prayag/theme/cpvc/CPVC%20fittings/PIPE-SDR-11.webp", alt: "Pipe Sch 80", bar: "blue", range: "65 mm - 150 mm" },
  { title: "Pipe SDR 13.5", image: "/sites/prayag/theme/cpvc/CPVC%20fittings/Pipe-SDR-13.webp", alt: "Pipe SDR 13.5", bar: "blue", range: "15 mm - 50 mm" },
  { title: "Pipe Sch 80 (Duplicate)", image: "/sites/prayag/theme/cpvc/CPVC%20fittings/Pipe-SDR-11-Mtr.webp", alt: "Pipe Sch 80 (Duplicate)", bar: "blue", range: "65 mm - 150 mm" },
  { title: "Elbow 90°", image: "/sites/prayag/theme/cpvc/CPVC%20fittings/ELBOW-90.webp", alt: "Elbow 90°", bar: "black", range: "½\" - 2\"" },
  { title: "Elbow 90° (Sch-80)", image: "/sites/prayag/theme/cpvc/CPVC%20fittings/Elbow-901.webp", alt: "Elbow 90° (Sch-80)", bar: "black", range: "2½\" - 4\"" },
  { title: "Elbow 90° (Sch-40)", image: "/sites/prayag/theme/cpvc/CPVC%20fittings/RED-BRASS-ELBOW.webp", alt: "Elbow 90° (Sch-40)", bar: "black", range: "6\"" },
  { title: "Reducer Elbow", image: "/sites/prayag/theme/cpvc/CPVC%20fittings/Reducer-Elbow.webp", alt: "Reducer Elbow", bar: "black", range: "¾\" × ½\" - 1\" × ¾\"" },
  { title: "Elbow 45°", image: "/sites/prayag/theme/cpvc/CPVC%20fittings/ELBOW-45.webp", alt: "Elbow 45°", bar: "black", range: "¾\" - 2\"" },
  { title: "Tee", image: "/sites/prayag/theme/cpvc/CPVC%20fittings/Tee.webp", alt: "Tee", bar: "yellow", range: "½\" - 6\"" },
  { title: "Tee (Sch-80)", image: "/sites/prayag/theme/cpvc/CPVC%20fittings/TEE1.webp", alt: "Tee (Sch-80)", bar: "yellow", range: "2½\" - 4\"" },
  { title: "Tee (Sch-40)", image: "/sites/prayag/theme/cpvc/CPVC%20fittings/RED-TEE.webp", alt: "Tee (Sch-40)", bar: "yellow", range: "6\"" },
  { title: "Reducer Tee", image: "/sites/prayag/theme/cpvc/CPVC%20fittings/Reducer-Tee.webp", alt: "Reducer Tee", bar: "yellow", range: "¾\" × ¾\" × ½\" - 2\" × 2\" × 1½\"" },
  { title: "Union", image: "/sites/prayag/theme/cpvc/CPVC%20fittings/UNION.webp", alt: "Union", bar: "blue", range: "¾\" - 4\"" },
  { title: "Coupling", image: "/sites/prayag/theme/cpvc/CPVC%20fittings/Coupling.webp", alt: "Coupling", bar: "white", range: "½\" - 2\"" },
  { title: "Coupling (Sch-80)", image: "/sites/prayag/theme/cpvc/CPVC%20fittings/COUPLING1.webp", alt: "Coupling (Sch-80)", bar: "white", range: "2½\" - 4\"" },
  { title: "Coupling (Sch-40)", image: "/sites/prayag/theme/cpvc/CPVC%20fittings/RED-COUPLING.webp", alt: "Coupling (Sch-40)", bar: "white", range: "6\"" },
  { title: "Reducer Coupling", image: "/sites/prayag/theme/cpvc/CPVC%20fittings/Reducer-Coupling.webp", alt: "Reducer Coupling", bar: "white", range: "¾\" × ½\" - 2\" × 1½\"" },
  { title: "Transition Bushing", image: "/sites/prayag/theme/cpvc/CPVC%20fittings/Transition-Bushing.webp", alt: "Transition Bushing", bar: "black", range: "¾\" - 1¼\"" },
  { title: "End Cap", image: "/sites/prayag/theme/cpvc/CPVC%20fittings/End-Cap.webp", alt: "End Cap", bar: "black", range: "½\" - 2\"" },
  { title: "End Cap (Sch-80)", image: "/sites/prayag/theme/cpvc/CPVC%20fittings/END-CAP1.webp", alt: "End Cap (Sch-80)", bar: "black", range: "2½\" - 4\"" },
  { title: "Reducer Bushing", image: "/sites/prayag/theme/cpvc/CPVC%20fittings/REDUCER-BUSHING.webp", alt: "Reducer Bushing", bar: "black", range: "1\" × ¾\" - 2\" × 1½\"" },
  { title: "Reducer Bushing (Sch-80)", image: "/sites/prayag/theme/cpvc/CPVC%20fittings/Reducer-Bushing1.webp", alt: "Reducer Bushing (Sch-80)", bar: "black", range: "2½\" × 1½\" - 4\" × 2½\"" },
  { title: "Male Adapter (Plastic Threads)", image: "/sites/prayag/theme/cpvc/CPVC%20fittings/Male-Adapter-Plastic-Threads-.webp", alt: "Male Adapter (Plastic Threads)", bar: "white", range: "¾\" × ½\" - 1\" × ¾\"" },
  { title: "Male Adapter (Plastic Threads) (Sch-80)", image: "/sites/prayag/theme/cpvc/CPVC%20fittings/MALE-ADAPTURE-PLASTIC-THREAD.webp", alt: "Male Adapter (Plastic Threads) (Sch-80)", bar: "white", range: "2½\" - 4\"" },
  { title: "Female Adapter (Plastic Threads)", image: "/sites/prayag/theme/cpvc/CPVC%20fittings/Female-Adapter-Plastic-Threads-.webp", alt: "Female Adapter (Plastic Threads)", bar: "white", range: "¾\" × ½\" - 2\"" },
  { title: "Female Adapter (Plastic Threads) (Sch-80)", image: "/sites/prayag/theme/cpvc/CPVC%20fittings/FEMALE-ADAPTURE-PLASTIC-THREAD.webp", alt: "Female Adapter (Plastic Threads) (Sch-80)", bar: "white", range: "2½\" - 4\"" },
  { title: "Cross Tee", image: "/sites/prayag/theme/cpvc/CPVC%20fittings/Cross-Tee.webp", alt: "Cross Tee", bar: "yellow", range: "¾\" - 1\"" },
  { title: "Ball Valve (Butterfly Handle)", image: "/sites/prayag/theme/cpvc/CPVC%20fittings/Ball-Valve-Butterfly-Handle.webp", alt: "Ball Valve (Butterfly Handle)", bar: "yellow", range: "¾\" - 2\"" },
  { title: "Male Adapter (Brass Threads)", image: "/sites/prayag/theme/cpvc/CPVC%20fittings/Male-Adapter-Brass-Threads-.webp", alt: "Male Adapter (Brass Threads)", bar: "white", range: "¾\" × ½\" - 1\" × ¾\"" },
  { title: "Female Adapter (Brass Threads)", image: "/sites/prayag/theme/cpvc/CPVC%20fittings/Female-Adapter-Brass-Threads-.webp", alt: "Female Adapter (Brass Threads)", bar: "white", range: "¾\" - 2\"" },
  { title: "Ball Valve (Long Lever Handle)", image: "/sites/prayag/theme/cpvc/CPVC%20fittings/Ball-Valve-Long-Lever-Handle.webp", alt: "Ball Valve (Long Lever Handle)", bar: "yellow", range: "¾\" - 2\"" },
  { title: "Tank Nipple", image: "/sites/prayag/theme/cpvc/CPVC%20fittings/Tank-Nipple.webp", alt: "Tank Nipple", bar: "blue", range: "¾\" - 2\"" },
  { title: "Tank Connector", image: "/sites/prayag/theme/cpvc/CPVC%20fittings/Tank-Connector.webp", alt: "Tank Connector", bar: "blue", range: "¾\" - 4\"" },
  { title: "Brass Elbow 90°", image: "/sites/prayag/theme/cpvc/CPVC%20fittings/BRASS-ELBOW-90.webp", alt: "Brass Elbow 90°", bar: "black", range: "¾\" × ½\" - 1\" × 1¼\"" },
  { title: "Reducer Tee (Brass)", image: "/sites/prayag/theme/cpvc/CPVC%20fittings/Reducer-Tee-Brass-.webp", alt: "Reducer Tee (Brass)", bar: "yellow", range: "½\" × ½\" × ½\" - 1¼\" × 1¼\" × 1¼\"" },
  { title: "Reducer Brass Coupling", image: "/sites/prayag/theme/cpvc/CPVC%20fittings/Reducer-Brass-Coupling.webp", alt: "Reducer Brass Coupling", bar: "white", range: "¾\" × ½\" - 1\" × ¾\"" },
  { title: "Ball Valve Handle", image: "/sites/prayag/theme/cpvc/CPVC%20fittings/Ball-Valve-Handle.webp", alt: "Ball Valve Handle", bar: "yellow", range: "¾\" - 2\"" },
  { title: "Brass Elbow (3-in-1 Mixer)", image: "/sites/prayag/theme/cpvc/CPVC%20fittings/Brass-Elbow-3-in-1-Mixer.webp", alt: "Brass Elbow (3-in-1 Mixer)", bar: "black", range: "¾\" × ½\" - 1\" × ½\"" },
  { title: "Brass Elbow (Kitchen Mixer)", image: "/sites/prayag/theme/cpvc/CPVC%20fittings/Brass-Elbow-Kithchen-Mixer.webp", alt: "Brass Elbow (Kitchen Mixer)", bar: "black", range: "¾\" × ½\"" },
  { title: "End Plug", image: "/sites/prayag/theme/cpvc/CPVC%20fittings/END-PLUG.webp", alt: "End Plug", bar: "black", range: "½\" - ¾\"" },
  { title: "Step Over Bend", image: "/sites/prayag/theme/cpvc/CPVC%20fittings/Step-Over-Bend.webp", alt: "Step Over Bend", bar: "black", range: "¾\" - 1½\"" },
  { title: "Flange", image: "/sites/prayag/theme/cpvc/CPVC%20fittings/Flange.webp", alt: "Flange", bar: "blue", range: "2½\" - 4\"" },
  { title: "Non Return Valve", image: "/sites/prayag/theme/cpvc/CPVC%20fittings/CPVC-BALL-VALVE.webp", alt: "Non Return Valve", bar: "yellow", range: "1¼\" - 1½\"" },
  { title: "Pipe Clamp (Heavy Saddle With Power Coating)", image: "/sites/prayag/theme/cpvc/CPVC%20fittings/Pipe-Clamp-Heavy-Saddle-With-Powder-Coating-.webp", alt: "Pipe Clamp (Heavy Saddle With Power Coating)", bar: "black", range: "½\" - 2\"" },
  { title: "Pipe Clamp", image: "/sites/prayag/theme/cpvc/CPVC%20fittings/PIPE-CLAMP.webp", alt: "Pipe Clamp", bar: "black", range: "½\" - 1\"" },
  { title: "Solvent Cement", image: "/sites/prayag/theme/cpvc/CPVC%20fittings/Solvent.webp", alt: "Solvent Cement", bar: "yellow", range: "59 ml - 946 ml" },
  { title: "Single Lever Concealed Diverter", image: "/sites/prayag/theme/cpvc/CPVC%20fittings/Full-Turn-Concealed-Valve.webp", alt: "Single Lever Concealed Diverter", bar: "yellow", range: "Single Model" },
  { title: "Pipe Clamp (Zinc Plated)", image: "/sites/prayag/theme/cpvc/CPVC%20fittings/Pipe-Clamp-Zinc-Plated-.webp", alt: "Pipe Clamp (Zinc Plated)", bar: "black", range: "½\" - 2\"" },
  { title: "Long Concealed Valve (Quarter Turn)", image: "/sites/prayag/theme/cpvc/CPVC%20fittings/Long-Concealed-Valve-Quarter-Turn-.webp", alt: "Long Concealed Valve (Quarter Turn)", bar: "yellow", range: "¾\"" },
  { title: "Short Concealed Valve (Quarter Turn)", image: "/sites/prayag/theme/cpvc/CPVC%20fittings/Short-Concealed-Valve-Quarter-Turn-.webp", alt: "Short Concealed Valve (Quarter Turn)", bar: "yellow", range: "¾\"" },
  { title: "Full Turn Concealed Valve (Viva)", image: "/sites/prayag/theme/cpvc/CPVC%20fittings/Full-Turn-Concealed-Valve.webp", alt: "Full Turn Concealed Valve (Viva)", bar: "yellow", range: "¾\" - 1\"" },
  { title: "Full Turn Concealed Valve (Saga)", image: "/sites/prayag/theme/cpvc/CPVC%20fittings/Full-Turn-Concealed-Valve.webp", alt: "Full Turn Concealed Valve (Saga)", bar: "yellow", range: "¾\" - 1\"" },
  { title: "Full Turn Concealed Valve (Urbona)", image: "/sites/prayag/theme/cpvc/CPVC%20fittings/Full-Turn-Concealed-Valve.webp", alt: "Full Turn Concealed Valve (Urbona)", bar: "yellow", range: "¾\" - 1\"" },
  { title: "Full Turn Concealed Valve (Macasa)", image: "/sites/prayag/theme/cpvc/CPVC%20fittings/Full-Turn-Concealed-Valve.webp", alt: "Full Turn Concealed Valve (Macasa)", bar: "yellow", range: "¾\" - 1\"" },
  { title: "Full Turn Concealed Valve (Gracia)", image: "/sites/prayag/theme/cpvc/CPVC%20fittings/Full-Turn-Concealed-Valve.webp", alt: "Full Turn Concealed Valve (Gracia)", bar: "yellow", range: "¾\" - 1\"" },
  { title: "Full Turn Concealed Valve (Triangular)", image: "/sites/prayag/theme/cpvc/CPVC%20fittings/Full-Turn-Concealed-Valve.webp", alt: "Full Turn Concealed Valve (Triangular)", bar: "yellow", range: "¾\" - 1\"" },
  { title: "Long Concealed Valve (Viva)", image: "/sites/prayag/theme/cpvc/CPVC%20fittings/Long-Concealed-Valve-Quarter-Turn-.webp", alt: "Long Concealed Valve (Viva)", bar: "yellow", range: "1\"" },
  { title: "Long Concealed Valve (Saga)", image: "/sites/prayag/theme/cpvc/CPVC%20fittings/Long-Concealed-Valve-Quarter-Turn-.webp", alt: "Long Concealed Valve (Saga)", bar: "yellow", range: "1\"" },
  { title: "Long Concealed Valve (Urbona)", image: "/sites/prayag/theme/cpvc/CPVC%20fittings/Long-Concealed-Valve-Quarter-Turn-.webp", alt: "Long Concealed Valve (Urbona)", bar: "yellow", range: "1\"" },
  { title: "Long Concealed Valve (Macasa)", image: "/sites/prayag/theme/cpvc/CPVC%20fittings/Long-Concealed-Valve-Quarter-Turn-.webp", alt: "Long Concealed Valve (Macasa)", bar: "yellow", range: "1\"" },
  { title: "Long Concealed Valve (Gracia)", image: "/sites/prayag/theme/cpvc/CPVC%20fittings/Long-Concealed-Valve-Quarter-Turn-.webp", alt: "Long Concealed Valve (Gracia)", bar: "yellow", range: "1\"" },
  { title: "Long Concealed Valve (Triangular)", image: "/sites/prayag/theme/cpvc/CPVC%20fittings/Long-Concealed-Valve-Quarter-Turn-.webp", alt: "Long Concealed Valve (Triangular)", bar: "yellow", range: "1\"" },
  { title: "PTFE Thread Seal Tape", image: "/sites/prayag/theme/cpvc/CPVC%20fittings/SOLVENT1.webp", alt: "PTFE Thread Seal Tape", bar: "yellow", range: "12 mm - 19 mm" },
];

export const specRows: SpecRow[] = [
  { param: "Material", value: "Premium CPVC (Chlorinated Polyvinyl Chloride)", highlight: true },
  { param: "Joint Type", value: "Solvent Cement Welded", highlight: false },
  { param: "Pipe Length", value: "1 Meter, 3 Meter & 5 Meter", highlight: false },
  { param: "Pipe Standards", value: "SDR 11, SDR 13.5, Schedule 40 & Schedule 80", highlight: false },
  { param: "Size Range", value: "15 mm to 150 mm (½\" to 6\")", highlight: true },
  { param: "Application", value: "Hot & Cold Water Distribution System", highlight: false },
  { param: "Working Temperature", value: "Suitable for Continuous Hot & Cold Water Applications", highlight: false },
  { param: "Pressure Performance", value: "High Burst Strength & Excellent Pressure Resistance", highlight: false },
  { param: "Vicat Softening Temperature", value: "Above 112°C", highlight: true },
  { param: "Corrosion Resistance", value: "Excellent", highlight: false },
  { param: "Chemical Resistance", value: "Excellent", highlight: false },
  { param: "Water Quality Impact", value: "Food Grade, Non-Toxic, Odour & Taste Free", highlight: false },
  { param: "Maintenance", value: "Maintenance Free", highlight: false },
  { param: "Installation", value: "Lightweight & Easy to Install", highlight: false },
  { param: "Compatible Components", value: "Complete Range of CPVC Pipes, Fittings, Valves & Accessories", highlight: false },
];

export const faqs: Faq[] = [
  { question: "1. What are Prayag CPVC pipes used for?", answer: ["Prayag ", { text: "CPVC pipes", href: "https://prayagindia.com/cpvc-pipes" }, " are designed for hot and cold potable water distribution. They form part of a plumbing system for residential, commercial, institutional, and industrial projects where reliable water supply, heat resistance, pressure performance, and corrosion resistance are required."] },
  { question: "2. What does CPVC stand for?", answer: ["CPVC stands for Chlorinated Polyvinyl Chloride. Prayag manufactures its plumbing pipes from premium-grade CPVC compound to provide strength, thermal stability, pressure resistance, chemical resistance, and long-term durability in hot and cold water systems."] },
  { question: "3. Can Prayag CPVC pipes carry both hot and cold water?", answer: ["Yes. Prayag CPVC pipes are made for continuous ", { text: "hot and cold water applications", href: "/advantages-cpvc-pipes-hot-water-chemical-resistance-indian-homes-and-industries" }, ". The product page states that the material has a Vicat Softening Temperature above 112 degrees Celsius, supporting reliable performance in plumbing systems exposed to elevated water temperatures."] },
  { question: "4. Are Prayag CPVC pipes safe for drinking water?", answer: ["Prayag states that its CPVC pipes are made from non-toxic, food-grade material. The material is designed to preserve the taste, odour, and purity of water, making the system suitable for potable hot and cold water distribution."] },
  { question: "5. Where can Prayag CPVC plumbing systems be installed?", answer: ["The listed applications include ", { text: "residential hot and cold water plumbing", href: "/why-cpvc-pipes-are-ideal-indian-homes" }, ", commercial water distribution, high-rise apartments, low-rise housing, industrial hot water piping, and institutional buildings such as hospitals, schools, and hotels."] },
  { question: "6. Can Prayag CPVC pipes be used in high-rise buildings?", answer: ["Yes. High-rise apartment complexes are among the applications listed for Prayag CPVC pipes. Their high burst strength and pressure resistance are intended to support safe performance in demanding water distribution systems when the system is correctly designed and installed."] },
  { question: "7. What sizes are available in Prayag CPVC pipes?", answer: ["The overall ", { text: "CPVC size range", href: "/cpvc-pipe-size-guide-indian-homes-bathroom-kitchen-and-geyser-lines" }, " listed by Prayag is 15 mm to 150 mm, equivalent to one-half inch to 6 inches. Individual ranges vary by pipe standard and component, so the final size should be selected according to the plumbing design and application requirements."] },
  { question: "8. Which pipe lengths and standards are available?", answer: ["Prayag lists pipe lengths of 1 metre, 3 metres, and 5 metres. Available pipe standards include SDR 11, SDR 13.5, Schedule 40, and Schedule 80. The page lists SDR pipe ranges from 15 mm to 50 mm and Schedule 80 pipe ranges from 65 mm to 150 mm."] },
  { question: "9. How are Prayag CPVC pipes and fittings joined?", answer: ["The system uses solvent cement welded joints. When prepared and installed correctly, these joints form strong, permanent, and ", { text: "leak-resistant connections", href: "/how-choose-leak-resistant-pipe-fittings-new-home-construction" }, " between compatible CPVC pipes, fittings, valves, and accessories."] },
  { question: "10. Can Prayag CPVC pipes handle high water pressure?", answer: ["Prayag states that its CPVC pipes offer high burst strength, load-bearing capacity, and excellent pressure resistance. Actual pipe selection should still account for pipe size, standard, operating temperature, water pressure, and the design requirements of the building."] },
  { question: "11. Are Prayag CPVC pipes resistant to corrosion and chemicals?", answer: ["Yes. Prayag CPVC pipes are designed to resist rust, corrosion, chemical reactions, and scaling. This makes them suitable for plumbing environments where conventional metal pipes may be affected by water chemistry or corrosion over time."] },
  { question: "12. How does the smooth inner surface improve water flow?", answer: ["The smooth inner surface helps water move through the pipe with minimal friction loss. It also helps limit deposits and scaling, supporting efficient flow and consistent performance throughout the plumbing network."] },
  { question: "13. Which CPVC fittings and accessories are available?", answer: ["Prayag offers compatible ", { text: "CPVC fittings and accessories", href: "https://prayagindia.com/pipes-fittings" }, " such as elbows, tees, couplings, reducer fittings, unions, adaptors, valves, tank connectors, pipe clamps, solvent cement, and specialized connectors. The coordinated range is designed to support secure fitment across a complete plumbing system."] },
  { question: "14. Are Prayag CPVC pipes easy to install and maintain?", answer: ["Their lightweight construction can make handling and installation faster than heavier piping materials. Solvent-welded joints support a secure plumbing network, while resistance to corrosion and scaling helps reduce maintenance needs. Installation should follow the specified joining process and be completed by a ", { text: "qualified plumbing professional", href: "/plumbers-guide-choosing-right-pipe-different-plumbing-points" }, "."] },
  { question: "15. How do I choose the right CPVC pipe for a project?", answer: ["Select the pipe according to the required diameter, water temperature, operating pressure, pipe standard, building type, and connection requirements. CPVC is designed for hot and cold potable water, while ", { text: "uPVC and PPR pipes", href: "/upvc-vs-cpvc-vs-ppr-pipes-which-one-best-your-project" }, " serve different application profiles. A qualified plumbing professional should confirm the final size, standard, and system design."] },
];

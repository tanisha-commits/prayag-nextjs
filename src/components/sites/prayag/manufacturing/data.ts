// Content for /manufacturing-process (source: prayagindia.com/manufacturing-process).

export const mfBanner = {
  image: "/sites/prayag/files/2026-10/Manufacturing-Process.webp",
  title: "Manufacturing Process",
};

export type MfVideo = {
  id: string;
  poster: string;
  /** aria-label of the poster link */
  label: string;
  /** iframe title */
  title: string;
};

export const mfIntro = {
  lead: "Prayag started its journey in 1986 under the visionary leadership of Mr. V.K. Aggarwal, Managing Director and acquired ISO 14001-2004 E & ISO 9000-2000 Certification.",
  paragraphs: [
    "We are Prayag, a company with a vision to produce products that are above the extraordinary. Reimagining to create new innovations in product design and development that has been the hallmark of every market segment that we have entered into. For us at Prayag, it’s been a journey of accomplishments and learnings, a life full of life and fulfilment.",
    "Always delivering meticulously crafted products, produced to perfection in 2 most modern, state-of-the-art plants, spread over 12000 sq. mtr. each, in Bhiwadi, Rajasthan. Backed by a strong dedicated team of experts from each segment who guide us to build our infrastructure using best manufacturing practices and then create contemporary products, conforming to international standards, of course suited best for the Indian market. Producing flawless components has become our habit that is why we never compromise on our inputs for manufacturing each piece, that lead to longer service life and extremely low maintenance.",
    "With our product range and network expanding each day, we plan to establish ourselves among the top 5 brands in business segment. In the last 3 decades Prayag has been a part of millions of families, touching their life, everyday, every moment",
  ],
  image:
    "/sites/prayag/files/2024-09/Prayag-started-its-journey-in-1986-under-the-visionary-leadership-of-Mr.-V.K.-Aggarwal.webp",
};

export const mfFilm: MfVideo = {
  id: "tBq4WcfKtdY",
  poster: "/sites/prayag/theme/thumbnail-1-prayag.webp",
  label: "Play Manufacturing Process Video",
  title: "Manufacturing Process Video",
};

export const mfPlant = {
  // Source heading: "Manufacturing&nbsp;<br>Plant"
  headingLines: ["Manufacturing ", "Plant"],
  paragraphs: [
    "Innovations, Technology, Quality and Affordability have been the pillars of Prayag’s exponential growth in quality and range. Using the cutting edge advanced technology with a focus on process quality control, ensure nothing but only masterpieces flow out of the manufacturing line.",
    "Prayag is powered by the one of the best manufacturing infrastructure in business, as only the world’s leading machines take the shop floors of Prayag. These include the most advanced core shooter machines, IMR casting furnace, Brother’s multi-head machining centres, Ferromatic Injection moulding machines, Theyson pipe manufacturing line apart from having an in-house latest chrome plating plant and a host of advanced inspection equipments",
  ],
  index: [
    "Core shooter machines",
    "IMR casting furnace",
    "Brother's multi-head machining centres",
    "Ferromatic Injection moulding machines",
    "Theyson pipe manufacturing line",
    "In-house latest chrome plating plant",
    "Advanced inspection equipments",
  ],
  video: {
    id: "K7SWObS2Ki4",
    poster: "/sites/prayag/files/youtube/K7SWObS2Ki4-maxresdefault.jpg",
    label: "Play Manufacturing Video",
    title: "Manufacturing Video",
  } satisfies MfVideo,
};

export const mfOpvc = {
  title: "Prayag O-PVC Pipes Manufacturing Plant",
  video: {
    id: "z4hP8UXawtE",
    poster: "/sites/prayag/files/youtube/z4hP8UXawtE-maxresdefault.jpg",
    label: "Play Prayag O-PVC Pipes Video",
    title: "Prayag O-PVC Pipes Video",
  } satisfies MfVideo,
};

export const mfDetail = {
  image: "/sites/prayag/theme/Manufacturing_Process_imaes_new.webp",
  imageAlt: "Prayag O-PVC pipes manufacturing process",
  steps: [
    "The Prayag O-PVC Pipes Manufacturing Plant in Pivari, Rajasthan, is a leading innovator in water distribution. The latest dual orientation technology in Prayag's O-PVC Class 500 pipes guarantees unmatched toughness, durability, and a lifespan of up to 100 years.",
    "Compared to conventional ductile iron pipes, these pipes have up to 40% greater hydraulic capacity and superior resistance to hydrostatic pressure and water hammer effects. The bell-spigot system eliminates the need for additional fittings and is available in sizes ranging from 110 mm to 400 mm. They can cater to diverse applications and have a selection of sizes ranging from 110 mm to 400 mm.",
    "Manufactured under rigorous quality controls, these lightweight, flexible pipes simplify logistics while maintaining exceptional impact resistance. Tested to sustain heavy loads and extreme conditions, they are crack-resistant and robust, making them ideal for various terrains, including extreme cold.",
    "Prayag's manufacturing plant also produces high-quality CPVC, UPVC, SWR, and HDPE pipes to provide consistent innovation and reliability for modern water distribution systems.",
  ],
};

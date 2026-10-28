/**
 * FAQ tabs and answers from https://prayagindia.com/faq (theme template, not CMS fields).
 * Questions are plain text; answers keep the source HTML exactly (some are wrapped in <p>, some
 * are bare text, which changes their typography on the source too). Generated — do not hand-edit.
 * The source also has two empty, never-shown panes (#v-pills-home6/7, content "...") — omitted.
 */
export interface FaqItem {
  question: string;
  answerHtml: string;
}

export interface FaqTab {
  label: string;
  items: FaqItem[];
}

export const faqTabs: FaqTab[] = [
  {
    label: "Faucets",
    items: [
      { question: "Why should I choose Prayag faucets over regular ones?", answerHtml: "<p>Prayag faucets are crafted with premium materials, advanced technology, and elegant finishes, ensuring long-lasting durability and modern style.\n</p>" },
      { question: "Are Prayag faucets water-saving?", answerHtml: "<p> Yes, Prayag faucets are designed with aerators and flow-control technology that help reduce water consumption without affecting performance.</p>" },
      { question: "Do Prayag faucets work in low water pressure?", answerHtml: "<p> Our faucets are engineered to perform efficiently even in homes with low or inconsistent water pressure.</p>" },
      { question: "What finishes are available in Prayag faucets?", answerHtml: "<p>Prayag offers a wide range of finishes including chrome, stainless steel, and matte designs to suit all interiors.</p>" },
      { question: "How long do Prayag faucets last?", answerHtml: "<p> With proper maintenance, Prayag faucets can last 12–15 years, thanks to their corrosion-resistant build.\n</p>" },
      { question: "Can I install a Prayag faucet myself?", answerHtml: "<p> Most Prayag faucets come with easy-fit installation, but professional fitting is recommended for premium models.</p>" },
      { question: "Do Prayag faucets come with warranty?", answerHtml: "<p> Yes, Prayag faucets are backed by a manufacturer warranty, ensuring peace of mind for customers.</p>" },
      { question: "Are Prayag faucets suitable for both kitchens and bathrooms?", answerHtml: "<p>Absolutely. Prayag designs specialized faucet ranges for both kitchen and bathroom use.</p>" },
      { question: "How do I clean Prayag faucets?", answerHtml: "<p>Simply wipe with a soft cloth and mild soap. Avoid harsh cleaners to maintain the shine.</p>" },
      { question: "Where can I buy Prayag faucets?", answerHtml: "Prayag faucets are available across India through authorized dealers and leading retail stores." },
    ],
  },
  {
    label: "PTMT",
    items: [
      { question: "What makes Prayag PTMT products better than others?", answerHtml: "<p>Prayag PTMT taps and fittings are 100% rust-proof, lightweight, and built for long life, making them ideal for Indian households.\n</p>" },
      { question: "Are Prayag PTMT taps durable?", answerHtml: "<p> Yes, Prayag PTMT taps are highly durable and resistant to breakage even under heavy use.</p>" },
      { question: "Can Prayag PTMT taps handle hard water?", answerHtml: "<p>Yes, they are resistant to scaling and corrosion caused by hard water.</p>" },
      { question: "Do Prayag PTMT products lose color over time?", answerHtml: "<p>No, Prayag PTMT taps maintain their color and finish for years.\n</p>" },
      { question: "Why are Prayag PTMT taps ideal for institutions?", answerHtml: "<p>They are economical, low-maintenance, and suitable for schools, hospitals, and commercial buildings.</p>" },
      { question: "How long do Prayag PTMT taps last?", answerHtml: "<p>With proper care, Prayag PTMT taps can last up to 10 years.</p>" },
      { question: "Are Prayag PTMT taps eco-friendly?", answerHtml: "<p> Yes, Prayag uses recyclable PTMT material, making it an eco-conscious choice.\n</p>" },
      { question: "Do Prayag PTMT products come with warranty?", answerHtml: "<p> Yes, Prayag provides warranty coverage on PTMT products for added reliability.</p>" },
      { question: "What makes Prayag PTMT better than PVC fittings?", answerHtml: "<p>Prayag PTMT is stronger, more stylish, and longer-lasting compared to PVC.\n</p>" },
      { question: "Where can I purchase Prayag PTMT taps?", answerHtml: "<p> They are available across India at Prayag dealer outlets and distributors.</p>" },
    ],
  },
  {
    label: "Kitchen Sinks",
    items: [
      { question: "Why choose Prayag kitchen sinks?", answerHtml: "Prayag kitchen sinks are made with premium stainless steel and granite materials, ensuring strength, hygiene, and modern style." },
      { question: "Are Prayag sinks resistant to stains and scratches?", answerHtml: "Yes, Prayag sinks are designed with scratch-resistant surfaces and easy-to-clean finishes." },
      { question: "What sizes of kitchen sinks does Prayag offer?", answerHtml: "Prayag provides a wide range of sizes from compact sinks to large double-bowl models for modular kitchens." },
      { question: "Do Prayag sinks come with soundproofing?", answerHtml: "Yes, many Prayag sinks include sound-absorbing pads to reduce noise during washing." },
      { question: "Are Prayag kitchen sinks suitable for heavy use?", answerHtml: "Yes, they are built for durability and can withstand daily household or commercial use." },
      { question: "What makes Prayag granite sinks special?", answerHtml: "Prayag granite sinks combine strength with aesthetic appeal, offering scratch, heat, and stain resistance." },
      { question: "Do Prayag sinks require special cleaning?", answerHtml: "No, regular rinsing and mild soap cleaning are enough to maintain their shine." },
      { question: "Are Prayag sinks available in under-mount and top-mount models?", answerHtml: "Yes, Prayag offers both options to suit modern kitchen designs." },
      { question: "Do Prayag sinks come with accessories?", answerHtml: "Yes, many models include strainers, drainboards, and other accessories." },
      { question: "Where can I buy Prayag kitchen sinks?", answerHtml: "They are available through Prayag’s dealer network and authorized retail outlets across India." },
    ],
  },
  {
    label: "Water Heaters",
    items: [
      { question: "Why buy a Prayag water heater?", answerHtml: "Prayag water heaters are energy-efficient, durable, and designed for consistent hot water supply." },
      { question: "Does Prayag offer both instant and storage water heaters?", answerHtml: "Yes, Prayag has a wide range of both instant and storage models to fit different needs." },
      { question: "Are Prayag water heaters safe to use?", answerHtml: "Yes, they come with advanced safety features like automatic cut-off and thermal protection." },
      { question: "Do Prayag water heaters work in hard water areas?", answerHtml: "Yes, many Prayag models are equipped with anti-scale and corrosion-resistant technology." },
      { question: "How energy efficient are Prayag water heaters?", answerHtml: "Prayag water heaters are designed to minimize electricity consumption while delivering high performance." },
      { question: "What capacities do Prayag water heaters come in?", answerHtml: "They range from compact 3-liter instant heaters to 25-liter storage heaters." },
      { question: "Do Prayag water heaters come with warranty?", answerHtml: "Yes, all Prayag water heaters are backed with a manufacturer’s warranty." },
      { question: "How long do Prayag water heaters last?", answerHtml: "With proper maintenance, they can last 8–12 years." },
      { question: "Do Prayag water heaters have smart features?", answerHtml: "Yes, select models include temperature control and energy-saving settings." },
      { question: "Where are Prayag water heaters available?", answerHtml: "They are widely available through Prayag distributors and retail outlets across India." },
    ],
  },
  {
    label: "Storage Tanks",
    items: [
      { question: "Why choose Prayag water storage tanks?", answerHtml: "Prayag tanks are made with multi-layer food-grade plastic that ensures durability and safe water storage." },
      { question: "Are Prayag storage tanks UV-protected?", answerHtml: "Yes, Prayag tanks are UV-stabilized to prevent algae growth and sun damage." },
      { question: "What capacities are available in Prayag tanks?", answerHtml: "They are available in sizes ranging from 200 liters to 10,000 liters." },
      { question: "Are Prayag tanks safe for drinking water?", answerHtml: "Yes, Prayag tanks are made with hygienic, BPA-free, food-grade material." },
      { question: "Do Prayag storage tanks keep water cool?", answerHtml: "Yes, multi-layer tanks are designed to maintain lower water temperature." },
      { question: "How long do Prayag tanks last?", answerHtml: "With proper care, Prayag tanks last 15+ years." },
      { question: "Do Prayag tanks come with a warranty?", answerHtml: "Yes, Prayag offers manufacturer warranty on its tanks." },
      { question: "Can Prayag tanks be used for underground storage?", answerHtml: "Yes, Prayag offers tanks suitable for both overhead and underground use." },
      { question: "What colors are available in Prayag storage tanks?", answerHtml: "Prayag tanks come in a variety of colors to match modern home exteriors." },
      { question: "Where can I buy Prayag tanks?", answerHtml: "Prayag tanks are available through a strong distribution network across India." },
    ],
  },
];

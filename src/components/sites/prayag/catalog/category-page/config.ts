export interface FilterGroup {
  key: string;
  label: string;
  options?: string[];
  rename?: Record<string, string>;
  flat?: boolean;
}

export interface LiveCategoryConfig {
  layout: "filters" | "plain";
  swatches: "dots" | "radio" | "none";
  filters: FilterGroup[];
  formId?: string;
  noFilterviewClass?: boolean;
}

export const LIVE_CATEGORY_PAGES: Record<string, LiveCategoryConfig> = {
  faucets: {
    layout: "filters",
    formId: "views-exposed-form-cp-facuets-filter-page-1",
    swatches: "dots",
    filters: [
      { key: "series", label: "Filter By Series", options: ["6000-7000", "8000-9000", "Vignette"] },
      {
        key: "collection",
        label: "Filter By Collection",
        options: ["Blaze", "Cygnus", "Europa", "Evian", "Garnet", "Gracia", "Lagoon", "Marcus", "Mist", "Polo", "Sapphire", "Urbona", "Zade", "Zircon"],
      },
      { key: "colour", label: "Filter By Color", options: ["Gold", "Black", "Rose Gold", "Chrome Finish"] },
    ],
  },
  "ptmt-taps": {
    layout: "filters",
    formId: "views-exposed-form-ptmt-filter-page-1",
    swatches: "dots",
    filters: [
      {
        key: "series",
        label: "Filter by Series",
        options: ["Delta Series", "Helix Series", "Lagoona Series", "Ovian Series", "Quadra Series", "Standard Series", "Ultra Series"],
      },
      { key: "collection", label: "Filter By Collection", options: ["Imperial Series", "Elite Series", "Marbel Series", "Premia"] },
      {
        key: "type",
        label: "Filter By Type",
        options: [
          "Angle Cock", "Basin Mixer", "Bib Cock", "Bottle Trap", "Cockroach Trap with Water Seal", "Grating Doom Waste Hole", "Hand Shower",
          "Pillar Cock", "Shower", "SInk Cock", "Sink Mixer", "Stop Cock", "Toilet Paper Holder", "Tooth Brush Holder", "Towel Rack",
          "Towel Rail", "Towel Ring", "Urinal Fish 32mm", "Urinal Spreader 15mm", "Wall Mixer", "Washing Machine Tap with Flange", "Waste Coupling",
        ],
      },
      { key: "colour", label: "Filter By Color", options: ["Blue", "Gold", "Peach", "White", "Wine"] },
    ],
  },
  ceramicware: {
    layout: "filters",
    formId: "views-exposed-form-ceramicware-filter-page-1",
    swatches: "radio",
    filters: [
      { key: "subcategory", label: "Filter by Type" },
      { key: "colour", label: "Filter by Color", flat: true, options: ["Ivory", "Matt Black", "Matt Green", "Matt Grey", "Matt Khaki", "White"] },
    ],
  },
  "kitchen-sinks": {
    layout: "filters",
    formId: "views-exposed-form-kitchen-sinks-filter-page-1",
    noFilterviewClass: true,
    swatches: "none",
    filters: [
      { key: "finish", label: "Filter By Finishes", flat: true, options: ["Gloss & Matt", "Granite", "Matt", "Metallic"] },
      { key: "colour", label: "Filter by Color", flat: true, options: ["Bianco", "Grey", "Pluto", "White", "Black"] },
      {
        key: "collection",
        label: "Filter By Collection",
        flat: true,
        options: [
          "Black Peral", "Coke Smudge", "Crystal Vanilla", "Dark Choco", "Duet Regular", "Ivory Lucid", "Sand Azaro", "Sand Soul", "Sand Unico",
          "Sand Unico-Twin", "Sand Valentine", "Solo Regular",
        ],
      },
      { key: "range", label: "Filter By Series", flat: true, options: ["Bronze 900 Series", "Oval  800 Series", "Solitaire", "Solitaire  1200 Series"] },
    ],
  },
  "bathroom-accessories": {
    layout: "filters",
    formId: "views-exposed-form-bathroom-accessories-filter-page-1",
    swatches: "radio",
    filters: [
      { key: "accessory range", label: "Filter by Collection", flat: true, options: ["CP Faucets", "PTMT"] },
      { key: "subcategory", label: "Filter by Type", flat: true, rename: { "bathroom-accessories/shower": "Showers" } },
    ],
  },
  "pipes-fittings": {
    layout: "filters",
    formId: "views-exposed-form-pipes-fittings-filter-page-1",
    swatches: "none",
    filters: [
      {
        key: "subcategory",
        label: "Filter By Category",
        rename: { "pipes-fittings/upvc": "UPVC", "pipes-fittings/swr": "Sewerage Drainage", "pipes-fittings/agri-pipes": "Agriculture", "pipes-fittings/opvc": "OPVC" },
      },
    ],
  },
  "water-heaters": { layout: "plain", swatches: "none", filters: [] },
  traps: { layout: "plain", swatches: "none", filters: [] },
  "storage-tank": { layout: "plain", swatches: "none", filters: [] },
  hardware: { layout: "plain", swatches: "none", filters: [] },
};

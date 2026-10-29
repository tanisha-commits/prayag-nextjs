// Content shapes shared by the PPR, SWR and Composite pipe pages (source: prayagindia.com taxonomy
// term pages; texts verbatim, including the source's typos and inconsistent alt texts).

/** `article.cfs-card` in a fittings slider. */
export type FittingCard = {
  src: string;
  alt: string;
  title: string;
  /** `ul.cfs-card__meta` rows: `<strong>{label}</strong>{value}` (value keeps its leading space). */
  meta: { label: string; value: string }[];
  /** The source closes the row with `<li>` instead of `</li>`, which parses as an extra empty row. */
  emptyMetaItem?: boolean;
};

/** One fittings tab: its button and the slider pane it controls. */
export type FittingPane = {
  id: string;
  tabId: string;
  tabLabel: string;
  /** aria-label of the `.cfs-slider`. */
  sliderLabel: string;
  cards: FittingCard[];
};

/** `.ka-card`: image, heading and one paragraph. */
export type ImageCard = {
  src: string;
  alt: string;
  title: string;
  text: string;
};

/** Inline text with links, as in the FAQ answers. */
export type RichText = (string | { href: string; text: string })[];

export type FaqItem = {
  question: string;
  answer: RichText;
};

/** `.prayag-specs__table`: header cells and rows (each cell also used as the mobile data-label). */
export type SpecTableData = {
  head: string[];
  rows: string[][];
};

/** One `.prayag-specs` tab: optional intro paragraph above its table. */
export type SpecPane = {
  paneId: string;
  tabId: string;
  label: string;
  intro?: string;
  table: SpecTableData;
};

/** `.ngp-feature-item` with an image icon. */
export type Feature = {
  src: string;
  alt: string;
  label: string;
  text: string;
};

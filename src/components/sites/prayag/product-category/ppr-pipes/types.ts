export type FittingCard = {
  src: string;
  alt: string;
  title: string;
  meta: { label: string; value: string }[];
  emptyMetaItem?: boolean;
};

export type FittingPane = {
  id: string;
  tabId: string;
  tabLabel: string;
  sliderLabel: string;
  cards: FittingCard[];
};

export type ImageCard = {
  src: string;
  alt: string;
  title: string;
  text: string;
};

export type RichText = (string | { href: string; text: string })[];

export type FaqItem = {
  question: string;
  answer: RichText;
};

export type SpecTableData = {
  head: string[];
  rows: string[][];
};

export type SpecPane = {
  paneId: string;
  tabId: string;
  label: string;
  intro?: string;
  table: SpecTableData;
};

export type Feature = {
  src: string;
  alt: string;
  label: string;
  text: string;
};

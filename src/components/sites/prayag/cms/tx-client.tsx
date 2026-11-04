"use client";

import { createContext, useContext } from "react";

const PageTexts = createContext<Record<string, string>>({});

/** Provides the page's text edits (keyed by original text) to client components below it. */
export function PageTextProvider({ texts, children }: { texts: Record<string, string>; children: React.ReactNode }) {
  return <PageTexts.Provider value={texts}>{children}</PageTexts.Provider>;
}

/** Editable text for client components (same rules as the server Tx in ./tx.tsx). */
export function Tx({ children }: { children?: React.ReactNode }) {
  const texts = useContext(PageTexts);
  if (typeof children !== "string") return children;
  return texts[children] ?? children;
}

/** For text used outside JSX children (attributes such as alt/placeholder) in client components. */
export function useTx() {
  const texts = useContext(PageTexts);
  return (text: string) => texts[text] ?? text;
}

// Line icons of the source `.application_inter_main_sec .feature-list` (shared by the cPVC and UGD
// pages), verbatim; names follow the source's HTML comments. Decorative, so aria-hidden.

import type { ReactElement } from "react";

export type ApplicationIcon = "pump" | "rock" | "industry" | "home" | "shield";

export const applicationIcons: Record<ApplicationIcon, ReactElement> = {
  pump: (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" aria-hidden="true">
      <rect x="20" y="20" width="24" height="20" rx="2" />
      <line x1="32" y1="10" x2="32" y2="20" />
      <rect x="10" y="40" width="44" height="10" rx="2" />
    </svg>
  ),
  rock: (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" aria-hidden="true">
      <polygon points="10,40 20,20 40,12 54,28 46,50 18,50" />
    </svg>
  ),
  industry: (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" aria-hidden="true">
      <rect x="6" y="30" width="12" height="28" />
      <rect x="22" y="38" width="12" height="20" />
      <rect x="38" y="18" width="20" height="40" />
      <line x1="38" y1="18" x2="58" y2="30" />
    </svg>
  ),
  home: (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" aria-hidden="true">
      <path d="M10 30L32 12L54 30" />
      <rect x="16" y="30" width="32" height="22" />
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" aria-hidden="true">
      <path d="M32 8L54 16V32C54 46 44 56 32 60C20 56 10 46 10 32V16Z" />
    </svg>
  ),
};

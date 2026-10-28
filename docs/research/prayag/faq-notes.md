# FAQ — migration notes

Source: https://prayagindia.com/faq (theme template; not CMS fields). Clone: `/faq`, data
`src/content/prayag/faq/faq.ts` — 5 tabs × 10 = **50** Q&As; questions and answer HTML verbatim (text compared
per element against live: 5/5 tabs, 50/50 questions, 50/50 answers identical).

## Source state reproduced
- Faucets pane shown, all 50 answers collapsed; the Faucets pill is **not** highlighted on load (source markup
  omits its `active` class) — it turns black only after a pill is chosen. One answer open at a time per tab.
- Tab arrow icons shrink when a label wraps on mobile (same as source).

## Deviations / fixes
- Source a11y bugs not copied: after choosing another pill the source leaves Faucets `aria-selected="true"`; no
  arrow-key support; all focus indicators removed. Clone: WAI-ARIA tabs (roving tabindex, ↑/↓/←/→, Home/End,
  automatic activation, aria-selected/aria-controls/aria-labelledby), accordion buttons with
  aria-expanded/aria-controls + labelled regions, keyboard-only focus outline.
- Source duplicate IDs: Faucets, Kitchen Sinks and Water Heaters panes reuse `#accordionFlushExample` and
  `#flush-collapseOne…Ten`; on the live page clicking a question toggles the same-numbered answer in all three
  panes (hidden ones too). Clone uses unique ids, so only the clicked answer opens.
- The two empty, never-shown panes (`#v-pills-home6/7`, content "...") are omitted.

---
name: accessibility-qa
description: Accessibility checks for the Prayag clone — keyboard navigation, focus, semantic HTML, alt text, accessible names, contrast — without altering the live design. Use before handover or when touching interactive components.
---

# Prayag accessibility QA

## Automated
- Lighthouse accessibility category (see the performance-optimization skill for the command).
- `node scripts/qa/seo.mjs` reports images without `alt` and heading-level skips per page.

## Manual (375px and 1440px)
- Tab through header → mega menu → search → main content → footer. Every interactive element is
  reachable, has a visible focus indicator, and opens/closes with Enter/Space/Escape where it is a toggle.
- Icon-only links/buttons (search, social, hamburger, slider arrows, play) have an accessible name.
- Forms (`/contact-us`, `/dealership-enquiry`): every input has a label, errors are announced as
  text, submit works by keyboard. Do not submit to real endpoints (forwarding stays disabled locally).
- One `<h1>` per page; landmarks: header, nav, main, footer.

## Rules
- Fixes must be invisible to sighted users at rest: `aria-label`, `alt`, semantic element swaps with
  identical styles, `:focus-visible` outlines. Do not change colours, sizes or layout to "fix"
  contrast that the live site shares — record it as a finding instead.
- Decorative images keep `alt=""` (as on live); meaningful images get the live alt text.

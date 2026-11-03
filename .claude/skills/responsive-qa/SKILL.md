---
name: responsive-qa
description: Check Prayag local pages at 375/390/768/1366/1440/1920px for horizontal overflow, broken images, console errors, failed requests and mobile menu behaviour. Use after any layout change and before handover.
---

# Responsive QA (Prayag)

Run against a running local server (prefer the production build: `npm run build && PORT=3100 npm start`,
then `QA_BASE=http://localhost:3100`).

```bash
export PLAYWRIGHT_DIR=$(npm root -g)/@playwright/cli
node scripts/qa/responsive.mjs <out.json> /faucets /contact-us        # chosen pages, all six widths
node scripts/qa/responsive.mjs <out.json> --widths=375,1440 --all      # every sitemap page, two widths
```
Only pages with findings are printed; the JSON keeps every row.

## Rules
- The live site at the same width is the reference: compare with `scripts/qa/compare.mjs --widths=<w>`
  before "fixing" anything. If live behaves the same way, it is not a bug to fix here.
- Never fix overflow by hiding content that should be visible. Prefer the source's own rule
  (min-width:0 on grid children, max-width:100% on media, overflow on wide tables only).
- Keep the desktop design pixel-identical; scope fixes to the breakpoint that breaks.
- Mobile navigation: at 375px open the drawer (hamburger), expand a submenu, follow a link, and
  confirm it closes; the header must not cover content after navigation.
- Report each page × width as PASS / FAIL / NEEDS REVIEW with the reason.

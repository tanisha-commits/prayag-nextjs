# Privacy Policy — content review (flagged, NOT changed)

Source: https://prayagindia.com/privacy-policy (`section.privacy_policy`, Drupal body field).
Clone: `/privacy-policy`, body stored verbatim in `src/content/prayag/privacy/policy.ts`.

Text check (2026-10-28): visible text of `section.privacy_policy` on live vs local, whitespace-normalised
(incl. NBSP → space): **identical, 13,245 characters**; all 6 links identical (href + text).
Only addition: `id="section-1"` … `id="section-9"` on the nine numbered `<h3>` headings (invisible; enables
`/privacy-policy#section-N` deep links). The source has **no in-page anchor links** — its "Table of
Contents" is nine plain `<p>` lines, not links. Turning them into links is a content decision for the owner.

## Items that look outdated, inconsistent or incomplete (owner / legal review)

1. **Mobile app references** — "Download and use our mobile application (Prayag India)", "Application Data",
   geolocation, push notifications, and two sections about "the App" (Background Location Tracking, How We Use
   Your Location Information: "calculate the distance and working hours, after start attendance we track your
   activities like distributor check-ins…"). This reads like an employee/sales-force app policy, not a policy for
   website visitors. Confirm whether a public "Prayag India" app exists.
2. **Template text from Termly** — "Review the privacy notice in full" links to
   `https://app.termly.io/builder/websites/…/Final%20Details/Version%20Date#toc`, which is the Termly *editor*
   (login required), not a public notice. Likely a broken/private link for visitors.
3. **"data subject access request"** is mentioned as the easiest way to exercise rights but no form/link is given.
4. **No "Revised"/last-updated date** anywhere, although section 8 says updates "will be indicated by an updated
   'Revised' date".
5. **Empty list** — "Sensitive Information. … we process the following categories of sensitive information:" is
   followed by nothing.
6. **Section 2 is truncated** to its one-line "In Short" summary; stray `<code>` tags split "secu|rity" and
   "Whe|n" (they render in pink monospace on the source and the clone — reproduced 1:1).
7. **Contact email domain** `enquiry@prayagindia.in` while the website is `prayagindia.com` — confirm it is
   monitored. Section 5 ends with a double full stop ("…prayagindia.in..").
8. **Account features** — "register on the Services", "Log in to your account settings", "terminate your account":
   the website has no user accounts.
9. **Minimum age 18 / "Do-Not-Track"** wording is generic US-template text; no mention of India's DPDP Act 2023,
   a grievance officer, cookies/analytics (the live site loads Google Tag Manager/Analytics and Microsoft Clarity),
   or the enquiry-form integrations (ezeone / TrackerHub) that receive visitors' personal data.
10. Heading case is inconsistent ("7. Controls For Do-not-track Features", "8. Do we make updates to this notice?"
    vs. the Table of Contents capitalisation) — cosmetic.
11. Postal address "2483-84, Prayag Infinity House, Nalwa Street, Behind Imperial Cinema, Paharganj, New Delhi –
    110055" — confirm it matches the current registered/contact address used elsewhere on the site.

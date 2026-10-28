# Prayag enquiry forms: /contact-us and /dealership-enquiry

## Source behaviour (verified against the live site, with every non-GET request aborted, and against the Drupal backup)
- Both forms are Drupal Webforms (`contact` node 4, `dealership_enquiry` node 67) that post back to their own page.
- Client validation is the browser's native validation. `webform.form.js` (`webformRequiredError`) puts the
  `data-webform-required-error` / `data-webform-pattern-error` text into the browser bubble. Fields without a custom
  message show the browser default ("Please fill out this field.").
- The email `pattern` is not valid under the regex `v` flag. Chrome ignores it and logs a console error, so `a@b` passes
  in the browser. Drupal still enforces the pattern on the server.
- Dealership phone uses intl-tel-input 17.0.12 with `initialCountry: "auto"`. Its ipinfo.io lookup is blocked by the
  live site's own CSP, so no flag is ever preselected. On submit, `isValidNumber()` fails for a number without a
  country code, and the page shows `alert("Please enter a valid phone number with the country code.")`. A valid
  number is replaced with its E.164 form before the form is sent.
- On insert, `modules/custom/webform_api_integration` forwards each submission to two services:
  - ezeone.tech, as JSON.
  - AbacusDesk TrackerHub, as PHP cURL array fields (multipart), with `x-website-id` / `x-api-key` headers and
    `page_url` set to `https://prayagindia.com`.
  - Its contact branch refers to variables it never defines (alternate mobile, country, state, district, remark,
    requirements, gst), so those values always go out empty.
- `?product=<title>` on /contact-us only changes the form action. Nothing visible changes, and the value is never forwarded.
- The webform confirmation settings are stored in the database, which is not in the backup, so they are unknown. The
  site has a /thank-you page (node 954).

## Clone
- Field definitions: `src/lib/enquiry/forms.ts`. Server validation: `src/lib/enquiry/validate.ts`, using Drupal / Webform message wording.
- Endpoints: `POST /api/enquiry/contact` and `POST /api/enquiry/dealership`, both JSON-only. Handler: `src/lib/enquiry/handler.ts`.
- Forwarding: `src/lib/enquiry/forward.ts`. It is server-only and configured through the env vars listed in `.env.example`.
  - It does nothing unless `PRAYAG_ENQUIRY_FORWARDING=enabled` and at least one destination has credentials.
  - If not configured, the endpoint returns 503 "Online enquiries are not connected yet in this preview…".
  - It returns 200 success only when at least one destination answered 2xx. If every destination fails, it returns 502.
  - Logs contain status codes only.
- Contact payload: only fields that exist on the form are mapped. The keys Drupal sent empty are omitted.
- `product` is read from the URL at submit time and carried in TrackerHub `page_url`
  (`https://prayagindia.com/contact-us?product=…`).
- Success text reuses the /thank-you page copy. Messages use Olivero `.messages` styling and icons. Inline errors use
  `.form-item--error-message` styling.
- Abuse protection:
  - honeypot field `website_url`;
  - 32 KB body cap;
  - JSON content type required;
  - same-origin check when an Origin header is present;
  - best-effort limit of 20 requests per 10 minutes per IP and form;
  - 10 s outbound timeout (env-overridable, max 30 s).
- intl-tel-input 17.0.12 (MIT) is self-hosted in `public/sites/prayag/vendor/intl-tel-input-17.0.12/`. The geo lookup
  never resolves, which matches the live result without making the third-party request.

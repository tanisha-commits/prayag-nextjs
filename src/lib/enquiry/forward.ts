import type { FormId } from "./forms";

if (typeof window !== "undefined") {
  throw new Error("enquiry forwarding is server-only");
}

const DEFAULT_EZEONE_URL = "https://ezeone.tech/api/enquiry/website-enquiry";
const DEFAULT_TRACKERHUB_URL = "https://api.abacusdesk.co.in/api/v1/leads";
const DEFAULT_TIMEOUT_MS = 10_000;
const SOURCE_SITE_URL = "https://prayagindia.com";

interface ForwardingConfig {
  enabled: boolean;
  timeoutMs: number;
  ezeone: { url: string; authKey: string } | null;
  trackerHub: { url: string; websiteId: string; apiKey: string } | null;
}

function env(name: string): string {
  return (process.env[name] ?? "").trim();
}

export function readForwardingConfig(): ForwardingConfig {
  const timeout = Number.parseInt(env("PRAYAG_ENQUIRY_TIMEOUT_MS"), 10);
  const ezeoneKey = env("PRAYAG_EZEONE_API_AUTH_KEY");
  const thId = env("PRAYAG_TRACKERHUB_WEBSITE_ID");
  const thKey = env("PRAYAG_TRACKERHUB_API_KEY");
  return {
    enabled: env("PRAYAG_ENQUIRY_FORWARDING") === "enabled",
    timeoutMs: Number.isFinite(timeout) && timeout > 0 ? Math.min(timeout, 30_000) : DEFAULT_TIMEOUT_MS,
    ezeone: ezeoneKey ? { url: env("PRAYAG_EZEONE_ENQUIRY_URL") || DEFAULT_EZEONE_URL, authKey: ezeoneKey } : null,
    trackerHub:
      thId && thKey
        ? { url: env("PRAYAG_TRACKERHUB_LEADS_URL") || DEFAULT_TRACKERHUB_URL, websiteId: thId, apiKey: thKey }
        : null,
  };
}

function phpInt(value: string): number {
  const n = Number(value.trim());
  if (Number.isFinite(n)) return Math.trunc(n);
  const lead = Number.parseInt(value.trim(), 10);
  return Number.isFinite(lead) ? lead : 0;
}

type Values = Record<string, string>;

function ezeonePayload(formId: FormId, v: Values, authKey: string): Record<string, unknown> {
  if (formId === "dealership") {
    return {
      api_auth_key: authKey,
      name: v.name,
      email: v.e_mail,
      mobile: v.phone_number,
      alternate_mobile_no: v.alternate_mobile_no,
      company_name: v.company_name,
      enquiry_type: "Dealer",
      enquiry_source: "Website",
      country: v.country,
      state: v.state,
      district: v.district,
      city: v.city,
      address: v.address,
      pincode: phpInt(v.pincode),
      remark: v.remark,
      form_data: {
        dealership_requirement: v.dealership_requirements,
        gst_number: v.gst_number,
      },
    };
  }
  return {
    api_auth_key: authKey,
    name: v.name.trim(),
    email: v.email.trim(),
    mobile: v.subject.trim(),
    company_name: v.company_name.trim(),
    enquiry_type: v.select_enquiry_type.trim(),
    enquiry_source: "Website",
    city: v.city.trim(),
    address: v.address.trim(),
    pincode: v.pincode.trim(),
  };
}

function trackerHubFields(formId: FormId, v: Values, pageUrl: string): Record<string, string> {
  if (formId === "dealership") {
    return {
      name: v.name,
      email: v.e_mail,
      phone: v.phone_number,
      company: v.company_name,
      city: v.city,
      message: v.remark || v.dealership_requirements,
      state: v.state,
      district: v.district,
      address: v.address,
      pincode: v.pincode,
      country: v.country,
      alternate_mobile_no: v.alternate_mobile_no,
      gst_number: v.gst_number,
      dealership_requirements: v.dealership_requirements,
      enquiry_type: v.enquiry_type,
      form_name: "Dealership Enquiry Form",
      page_url: pageUrl,
    };
  }
  return {
    name: v.name,
    email: v.email,
    phone: v.subject,
    company: v.company_name,
    city: v.city,
    message: v.message,
    address: v.address,
    pincode: v.pincode,
    enquiry_type: v.select_enquiry_type,
    form_name: "Contact Form",
    page_url: pageUrl,
  };
}

export type DestinationName = "ezeone" | "trackerhub";

export interface DestinationResult {
  destination: DestinationName;
  ok: boolean;
  status: number;
}

async function post(destination: DestinationName, url: string, init: RequestInit, timeoutMs: number): Promise<DestinationResult> {
  try {
    const res = await fetch(url, { ...init, method: "POST", redirect: "manual", cache: "no-store", signal: AbortSignal.timeout(timeoutMs) });
    await res.arrayBuffer().catch(() => undefined);
    return { destination, ok: res.status >= 200 && res.status < 300, status: res.status };
  } catch {
    return { destination, ok: false, status: 0 };
  }
}

export interface ForwardOptions {
  product?: string;
}

export async function forwardEnquiry(formId: FormId, values: Values, options: ForwardOptions = {}): Promise<DestinationResult[] | null> {
  const config = readForwardingConfig();
  if (!config.enabled || (!config.ezeone && !config.trackerHub)) return null;

  const pageUrl =
    formId === "contact" && options.product
      ? `${SOURCE_SITE_URL}/contact-us?product=${encodeURIComponent(options.product)}`
      : SOURCE_SITE_URL;

  const jobs: Promise<DestinationResult>[] = [];
  if (config.ezeone) {
    jobs.push(
      post(
        "ezeone",
        config.ezeone.url,
        {
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(ezeonePayload(formId, values, config.ezeone.authKey)),
        },
        config.timeoutMs,
      ),
    );
  }
  if (config.trackerHub) {
    const body = new FormData();
    for (const [key, value] of Object.entries(trackerHubFields(formId, values, pageUrl))) body.append(key, value);
    jobs.push(
      post(
        "trackerhub",
        config.trackerHub.url,
        { headers: { "x-website-id": config.trackerHub.websiteId, "x-api-key": config.trackerHub.apiKey }, body },
        config.timeoutMs,
      ),
    );
  }
  return Promise.all(jobs);
}

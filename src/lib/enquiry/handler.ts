import { ENQUIRY_FALLBACK_CONTACT as C, type EnquiryResult, type FormId, HONEYPOT_FIELD } from "./forms";
import { forwardEnquiry } from "./forward";
import { validateEnquiry } from "./validate";

/** Generous for these forms (all fields at maxlength stay well below this). */
const MAX_BODY_BYTES = 32 * 1024;
const MAX_PRODUCT_LENGTH = 200;

// Best-effort per-instance limiter (serverless instances do not share it; a platform WAF rule
// should back it in production).
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 20;
const hits = new Map<string, number[]>();

function rateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (v.every((t) => now - t >= RATE_WINDOW_MS)) hits.delete(k);
  }
  return recent.length > RATE_MAX;
}

const MESSAGES = {
  success:
    "Thank You for Contacting Us. We have received your message and would like to thank you for writing to us.",
  pending: `Online enquiries are not connected yet in this preview. Please call our Toll Free No. ${C.tollFree} or Enquiry No. ${C.enquiry}, or email ${C.email}.`,
  error: `Sorry, your enquiry could not be sent right now. Please try again later, or call our Toll Free No. ${C.tollFree} or Enquiry No. ${C.enquiry}, or email ${C.email}.`,
  rejected: "Your submission could not be processed. Please reload the page and try again.",
  rateLimited: "Too many submissions from this connection. Please wait a few minutes and try again.",
};

function reply(status: number, body: EnquiryResult): Response {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

function clientKey(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for");
  return (fwd ? fwd.split(",")[0] : request.headers.get("x-real-ip") ?? "local").trim();
}

function sameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true; // non-browser clients (curl) send none
  try {
    const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

function cleanProduct(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const v = value.replace(/[\u0000-\u001f\u007f]/g, "").trim().slice(0, MAX_PRODUCT_LENGTH);
  return v || undefined;
}

export async function handleEnquiry(formId: FormId, request: Request): Promise<Response> {
  if (!sameOrigin(request)) return reply(403, { status: "error", message: MESSAGES.rejected });
  if (!(request.headers.get("content-type") ?? "").toLowerCase().startsWith("application/json")) {
    return reply(415, { status: "error", message: MESSAGES.rejected });
  }
  const declared = Number(request.headers.get("content-length") ?? "0");
  if (declared > MAX_BODY_BYTES) return reply(413, { status: "error", message: MESSAGES.rejected });
  if (rateLimited(`${formId}:${clientKey(request)}`)) return reply(429, { status: "error", message: MESSAGES.rateLimited });

  let raw: string;
  try {
    raw = await request.text();
  } catch {
    return reply(400, { status: "error", message: MESSAGES.rejected });
  }
  if (new TextEncoder().encode(raw).length > MAX_BODY_BYTES) return reply(413, { status: "error", message: MESSAGES.rejected });

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return reply(400, { status: "error", message: MESSAGES.rejected });
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return reply(400, { status: "error", message: MESSAGES.rejected });
  }
  const input = body as Record<string, unknown>;

  // Honeypot: hidden from people, filled by naive bots. Rejected without forwarding.
  const trap = input[HONEYPOT_FIELD];
  if (typeof trap === "string" && trap.trim() !== "") {
    return reply(400, { status: "error", message: MESSAGES.rejected });
  }

  const { values, errors } = validateEnquiry(formId, input);
  if (Object.keys(errors).length > 0) {
    return reply(422, { status: "invalid", message: Object.values(errors).join(" "), errors });
  }

  const results = await forwardEnquiry(formId, values, { product: formId === "contact" ? cleanProduct(input.product) : undefined });
  if (results === null) {
    return reply(503, { status: "pending", message: MESSAGES.pending });
  }
  // Status codes only — never the payload or the upstream response body.
  console.info(`[enquiry] ${formId}: ${results.map((r) => `${r.destination}=${r.status || "network-error"}`).join(" ")}`);
  if (results.some((r) => r.ok)) {
    return reply(200, { status: "success", message: MESSAGES.success });
  }
  return reply(502, { status: "error", message: MESSAGES.error });
}

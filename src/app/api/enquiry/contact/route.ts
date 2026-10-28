import { handleEnquiry } from "@/lib/enquiry/handler";

// Server-side submission endpoint for the contact webform clone (see src/lib/enquiry/).
export const runtime = "nodejs";

export async function POST(request: Request) {
  return handleEnquiry("contact", request);
}

import { handleEnquiry } from "@/lib/enquiry/handler";

export const runtime = "nodejs";

export async function POST(request: Request) {
  return handleEnquiry("contact", request);
}

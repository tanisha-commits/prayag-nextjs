import { NextResponse, type NextRequest } from "next/server";
import { publicList } from "@/lib/catalog/public";
import { queryFromParams } from "@/lib/catalog/url";

export function GET(req: NextRequest) {
  const query = queryFromParams(req.nextUrl.searchParams);
  if (!query.category && !query.q) return NextResponse.json({ error: "category or q is required" }, { status: 400 });
  return NextResponse.json(publicList(query), { headers: { "Cache-Control": "no-store" } });
}

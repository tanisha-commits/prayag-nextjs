import { getSessionCookie } from "better-auth/cookies";
import { NextResponse, type NextRequest } from "next/server";

// Optimistic check only (cookie present?); real authorisation happens server-side in every admin
// page and action (src/lib/auth/server.ts requireAdmin / getAdminSession).
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  if (pathname === "/admin/login") return NextResponse.next();
  if (!getSessionCookie(request)) {
    const url = new URL("/admin/login", request.url);
    url.searchParams.set("next", pathname + search); // keep filters such as ?status=draft
    return NextResponse.redirect(url);
  }
  const res = NextResponse.next();
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  return res;
}

export const config = { matcher: ["/admin/:path*"] };

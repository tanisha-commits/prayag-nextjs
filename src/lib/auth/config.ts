import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";
import { BASE_PATH } from "@/lib/base-path";
import { getDb } from "@/lib/db/client";
import { account, rateLimit, session, user, verification } from "@/lib/db/schema";

// Plain module (no server-only) so the local create-admin script can use it too; app code goes
// through ./server, which is server-only.
if (!process.env.BETTER_AUTH_SECRET && process.env.NEXT_PHASE !== "phase-production-build") {
  console.warn("[auth] BETTER_AUTH_SECRET is not set; admin sign-in will not work until it is.");
}

const AUTH_PATH = `${BASE_PATH}/api/auth`;

/**
 * BETTER_AUTH_URL is the site's public URL (e.g. https://example.com/prayagindia) or just its origin.
 * Better Auth wants the full endpoint, so "/api/auth" (and the base path when only an origin is given)
 * is appended here. Unset, the endpoint is taken from each request's host, so any domain works.
 */
function authBaseURL(): string | undefined {
  const raw = process.env.BETTER_AUTH_URL?.trim();
  if (!raw) return undefined;
  const url = new URL(raw);
  const path = url.pathname.replace(/\/+$/, "");
  if (path.endsWith("/api/auth")) return `${url.origin}${path}`;
  return `${url.origin}${path || BASE_PATH}/api/auth`;
}

/**
 * Without BETTER_AUTH_URL, trust the origin the browser actually addressed (Host, or the proxy's
 * X-Forwarded-Host/Proto), so sign-in works on any domain. A cross-site page cannot choose the Host
 * its forged request goes to, so this keeps the same-origin CSRF check.
 */
function requestOrigin(request?: Request): string[] {
  if (!request) return [];
  const first = (v: string | null) => v?.split(",")[0]?.trim() || null;
  const host = first(request.headers.get("x-forwarded-host")) ?? first(request.headers.get("host"));
  const proto = first(request.headers.get("x-forwarded-proto")) ?? new URL(request.url).protocol.replace(":", "");
  return host && (proto === "http" || proto === "https") ? [`${proto}://${host}`] : [];
}

export const auth = betterAuth({
  baseURL: authBaseURL(),
  basePath: AUTH_PATH,
  trustedOrigins: (request) => requestOrigin(request),
  database: drizzleAdapter(getDb(), {
    provider: "sqlite",
    schema: { user, session, account, verification, rateLimit },
  }),
  // No public sign-up: admins are created locally with `npm run admin:create`.
  emailAndPassword: { enabled: true, disableSignUp: true, minPasswordLength: 12, maxPasswordLength: 128 },
  session: { expiresIn: 60 * 60 * 8, updateAge: 60 * 60 },
  rateLimit: {
    enabled: true,
    storage: "database",
    window: 60,
    max: 100,
    customRules: { "/sign-in/email": { window: 300, max: 5 } },
  },
  advanced: { useSecureCookies: process.env.NODE_ENV === "production" },
  plugins: [admin({ adminRoles: ["admin"], defaultRole: "user" }), nextCookies()],
});

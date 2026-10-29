import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";
import { getDb } from "@/lib/db/client";
import { account, rateLimit, session, user, verification } from "@/lib/db/schema";

// Plain module (no server-only) so the local create-admin script can use it too; app code goes
// through ./server, which is server-only.
if (!process.env.BETTER_AUTH_SECRET && process.env.NEXT_PHASE !== "phase-production-build") {
  console.warn("[auth] BETTER_AUTH_SECRET is not set; admin sign-in will not work until it is.");
}

export const auth = betterAuth({
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

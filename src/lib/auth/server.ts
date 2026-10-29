import "server-only";
import { headers } from "next/headers";
import { cache } from "react";
import { auth } from "./config";

export { auth };

export type AdminSession = { userId: string; email: string; name: string };

/** Current session (memoised per request). Every admin read and mutation goes through requireAdmin. */
export const getAdminSession = cache(async (): Promise<AdminSession | null> => {
  const s = await auth.api.getSession({ headers: await headers() });
  if (!s || s.user.role !== "admin" || s.user.banned) return null;
  return { userId: s.user.id, email: s.user.email, name: s.user.name };
});

export class AuthError extends Error {
  constructor(public status: 401 | 403) {
    super(status === 401 ? "Not signed in" : "Not allowed");
  }
}

/** Server-side authorisation for admin data access; throws AuthError when not an admin. */
export async function requireAdmin(): Promise<AdminSession> {
  const s = await auth.api.getSession({ headers: await headers() });
  if (!s) throw new AuthError(401);
  if (s.user.role !== "admin" || s.user.banned) throw new AuthError(403);
  return { userId: s.user.id, email: s.user.email, name: s.user.name };
}

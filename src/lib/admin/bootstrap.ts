// One-time admin setup for servers without a terminal (deploys go through an upload-only folder).
//
// `npm run admin:bundle` (run locally) writes admin-bootstrap.json with an email, a name and a
// scrypt password HASH (never the password). The deploy package carries that file next to server.js.
// On start-up (src/instrumentation.ts) the server reads it once:
//   - no user with that email  -> create it as admin with that password
//   - user exists              -> make it admin (unban it); set the password only when resetPassword
// Then it deletes the file. Any failure is logged and never stops the site from starting.
import fs from "node:fs";
import path from "node:path";
import { z } from "zod";

const FILE_NAME = "admin-bootstrap.json";

const bootstrapSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  name: z.string().trim().min(1).max(120),
  // Better Auth scrypt format: 32 hex salt ":" 128 hex key.
  passwordHash: z.string().regex(/^[0-9a-f]{32}:[0-9a-f]{128}$/),
  resetPassword: z.boolean().default(false),
});

export function adminBootstrapPath(): string {
  return path.resolve(/* turbopackIgnore: true */ process.cwd(), process.env.PRAYAG_ADMIN_BOOTSTRAP || FILE_NAME);
}

export async function applyAdminBootstrap(): Promise<void> {
  const file = adminBootstrapPath();
  if (!fs.existsSync(file)) return;

  try {
    const data = bootstrapSchema.parse(JSON.parse(fs.readFileSync(file, "utf8")));
    const { auth } = await import("@/lib/auth/config");
    const ctx = await auth.$context;
    const adapter = ctx.internalAdapter;

    const existing = await adapter.findUserByEmail(data.email);
    if (!existing) {
      const created = await adapter.createUser(
        { email: data.email, name: data.name, emailVerified: true, role: "admin" },
        { method: "admin" },
      );
      await adapter.linkAccount({ userId: created.id, providerId: "credential", accountId: created.id, password: data.passwordHash });
      console.log(`[admin-bootstrap] Admin ${data.email} created.`);
    } else {
      const userId = existing.user.id;
      await adapter.updateUser(userId, { role: "admin", banned: false });
      const accounts = await adapter.findAccounts(userId);
      const hasCredential = accounts.some((a) => a.providerId === "credential");
      if (!hasCredential) {
        await adapter.linkAccount({ userId, providerId: "credential", accountId: userId, password: data.passwordHash });
        console.log(`[admin-bootstrap] ${data.email} is admin; password set.`);
      } else if (data.resetPassword) {
        await adapter.updatePassword(userId, data.passwordHash);
        console.log(`[admin-bootstrap] ${data.email} is admin; password reset.`);
      } else {
        console.log(`[admin-bootstrap] ${data.email} is admin; password unchanged (resetPassword is false).`);
      }
    }

    try {
      fs.rmSync(file);
    } catch {
      console.warn(`[admin-bootstrap] Applied, but could not delete ${file}; it is safe to re-apply.`);
    }
  } catch (err) {
    const reason = err instanceof z.ZodError ? z.prettifyError(err).replace(/\n/g, "; ") : err instanceof Error ? err.message : String(err);
    console.error(`[admin-bootstrap] Not applied (${file} kept): ${reason}`);
  }
}

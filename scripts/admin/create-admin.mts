// Create (or promote) a catalog admin in the local database. Prompts for the password with echo
// off so it never lands in code, files or shell history. Usage: npm run admin:create
import readline from "node:readline";
import { auth } from "../../src/lib/auth/config";

function ask(question: string, hidden = false): Promise<string> {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    if (hidden) {
      const out = rl as unknown as { _writeToOutput: (s: string) => void; output: NodeJS.WriteStream };
      out._writeToOutput = (s: string) => {
        if (s.startsWith(question)) out.output.write(s);
        else if (s.includes("\n")) out.output.write("\n");
      };
    }
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

const email = (await ask("Admin email: ")).toLowerCase();
const name = (await ask("Display name: ")) || email;
if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw new Error("Invalid email");

const ctx = await auth.$context;
const existing = await ctx.internalAdapter.findUserByEmail(email);
if (existing) {
  await ctx.internalAdapter.updateUser(existing.user.id, { role: "admin" });
  console.log(`Existing user ${email} now has the admin role (password unchanged).`);
  process.exit(0);
}

const password = await ask("Password (min 12 characters, hidden): ", true);
const again = await ask("Repeat password: ", true);
if (password !== again) throw new Error("Passwords do not match");
if (password.length < 12) throw new Error("Password must be at least 12 characters");

const created = await ctx.internalAdapter.createUser({ email, name, emailVerified: true, role: "admin" }, { method: "admin" });
await ctx.internalAdapter.linkAccount({
  userId: created.id,
  providerId: "credential",
  accountId: created.id,
  password: await ctx.password.hash(password),
});
console.log(`Admin ${email} created.`);

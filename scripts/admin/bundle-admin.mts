// Prepare an admin for a server you cannot open a terminal on. Asks for email, name and password
// (hidden), then writes admin-bootstrap.json with the scrypt HASH only. Put that file next to
// server.js in the deploy package; the server applies it once on start-up and deletes it
// (src/lib/admin/bootstrap.ts). Usage: npm run admin:bundle [-- --reset-password]
import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";
import { hashPassword, verifyPassword } from "better-auth/crypto";

// One interface for every question, so answers typed or pasted ahead are not lost between prompts.
const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
const rlOut = rl as unknown as { _writeToOutput: (s: string) => void; output: NodeJS.WriteStream };
let hiddenPrompt: string | null = null;
const writeOut = rlOut._writeToOutput.bind(rl);
rlOut._writeToOutput = (s: string) => {
  if (hiddenPrompt === null || s.startsWith(hiddenPrompt)) writeOut(s);
  else if (s.includes("\n")) rlOut.output.write("\n");
};

function ask(question: string, hidden = false): Promise<string> {
  hiddenPrompt = hidden ? question : null;
  return new Promise((resolve) => rl.question(question, (answer) => resolve(hidden ? answer : answer.trim())));
}

const email = (await ask("Admin email: ")).toLowerCase();
if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw new Error("Invalid email");
const name = (await ask("Display name: ")) || email;
const password = await ask("Password (12-128 characters, hidden): ", true);
const again = await ask("Repeat password: ", true);
rl.close();
if (password !== again) throw new Error("Passwords do not match");
if (password.length < 12 || password.length > 128) throw new Error("Password must be 12-128 characters");
if (password !== password.trim()) throw new Error("Password starts or ends with a space; remove it");

const passwordHash = await hashPassword(password);
if (!(await verifyPassword({ hash: passwordHash, password }))) throw new Error("Hash check failed");

const resetPassword = process.argv.includes("--reset-password");
const out = path.resolve(process.cwd(), "admin-bootstrap.json");
fs.writeFileSync(out, JSON.stringify({ email, name, passwordHash, resetPassword }, null, 2) + "\n", { mode: 0o600 });
console.log(`Wrote ${out} for ${email}${resetPassword ? " (will reset the password if the user exists)" : ""}.`);
console.log("It holds a password hash, not the password. Copy it next to server.js in the deploy folder.");

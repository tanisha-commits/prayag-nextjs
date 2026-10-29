"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth/client";

export function LoginForm({ next }: { next: string }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={async (e) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        setPending(true);
        setError(null);
        const { error } = await authClient.signIn.email({ email: String(form.get("email")), password: String(form.get("password")) });
        setPending(false);
        // One message for every failure: never reveal whether the account exists.
        if (error) setError(error.status === 429 ? "Too many attempts. Please wait a few minutes." : "Sign-in failed. Check your email and password.");
        else window.location.assign(next);
      }}
    >
      <label className="flex flex-col gap-1.5 text-[14px] font-medium">
        Email
        <input name="email" type="email" autoComplete="username" required className="h-11 rounded-[8px] border border-[#d1d5db] px-3 font-normal" />
      </label>
      <label className="flex flex-col gap-1.5 text-[14px] font-medium">
        Password
        <input name="password" type="password" autoComplete="current-password" required className="h-11 rounded-[8px] border border-[#d1d5db] px-3 font-normal" />
      </label>
      {error && (
        <p role="alert" className="rounded-[8px] bg-[#fdecea] px-3 py-2 text-[14px] text-[#a12622]">
          {error}
        </p>
      )}
      <button type="submit" disabled={pending} className="h-11 rounded-[8px] bg-black text-[15px] font-medium text-white disabled:opacity-60">
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

"use client";

import { useActionState } from "react";
import type { ActionState } from "@/lib/admin/actions";
import { cn } from "@/lib/utils";

/** Form bound to a server action; shows the action's message and disables while pending. */
export function ActionForm({
  action,
  children,
  className,
  submitLabel,
  confirmText,
}: {
  action: (prev: ActionState, form: FormData) => Promise<ActionState>;
  children?: React.ReactNode;
  className?: string;
  submitLabel: string;
  /** Asks for confirmation in-page before destructive actions (no browser dialogs). */
  confirmText?: string;
}) {
  const [state, formAction, pending] = useActionState(action, null);
  return (
    <form action={formAction} className={cn("flex flex-col gap-3", className)}>
      {children}
      {confirmText && (
        <label className="flex items-center gap-2 text-[14px]">
          <input type="checkbox" name="confirm" value="yes" required /> {confirmText}
        </label>
      )}
      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={pending} className="h-10 rounded-[8px] bg-black px-5 text-[14px] font-medium text-white disabled:opacity-60">
          {pending ? "Working…" : submitLabel}
        </button>
        <p aria-live="polite" className={cn("m-0 text-[14px]", state?.ok ? "text-[#1e7d3a]" : "text-[#a12622]")}>
          {state?.message}
        </p>
      </div>
      {state?.errors && (
        <ul className="m-0 list-disc pl-5 text-[13px] text-[#a12622]">
          {Object.entries(state.errors).map(([k, v]) => (
            <li key={k}>
              {k}: {v}
            </li>
          ))}
        </ul>
      )}
    </form>
  );
}

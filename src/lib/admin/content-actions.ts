"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { ActionState } from "@/lib/admin/actions";
import { AuthError, requireAdmin } from "@/lib/auth/server";
import { ContentError, deleteEntry, saveEntry } from "@/lib/content/store";
import { isList } from "@/lib/content/schemas";

async function actor(): Promise<string | NonNullable<ActionState>> {
  try {
    return (await requireAdmin()).email;
  } catch (e) {
    return { ok: false, message: e instanceof AuthError && e.status === 401 ? "Please sign in again." : "You are not allowed to do this." };
  }
}

function failure(e: unknown): NonNullable<ActionState> {
  if (e instanceof ContentError) {
    const errors = Object.fromEntries((e.issues ?? []).map((i) => [i.path || "(entry)", i.message]));
    return { ok: false, message: e.message, errors: Object.keys(errors).length ? errors : undefined };
  }
  console.error("[content] save failed", e);
  return { ok: false, message: "Could not save. Please try again." };
}

/** Save an entry from the content editor (`data` is the form's JSON). */
export async function saveContent(_prev: ActionState, form: FormData): Promise<ActionState> {
  const who = await actor();
  if (typeof who !== "string") return who;
  const id = String(form.get("id") ?? "");
  const key = String(form.get("key") ?? "").trim() || undefined;
  let data: unknown;
  try {
    data = JSON.parse(String(form.get("data") ?? ""));
  } catch {
    return { ok: false, message: "The form data could not be read." };
  }
  try {
    saveEntry({ id, key }, data, who);
  } catch (e) {
    return failure(e);
  }
  // Header, footer and drawer content appears on every page.
  revalidatePath("/", "layout");
  // Post/redirect/get: the editor reloads with the saved value and the page confirms the save.
  redirect(`/admin/content/${id}${isList(id) ? `/${key}` : ""}?saved=${Date.now()}`);
}

/** Reset a single-document entry to its built-in content, or remove a blog post. */
export async function deleteContent(_prev: ActionState, form: FormData): Promise<ActionState> {
  const who = await actor();
  if (typeof who !== "string") return who;
  if (form.get("confirm") !== "yes") return { ok: false, message: "Please tick the confirmation box." };
  const id = String(form.get("id") ?? "");
  const key = String(form.get("key") ?? "").trim() || undefined;
  try {
    deleteEntry({ id, key }, who);
  } catch (e) {
    return failure(e);
  }
  revalidatePath("/", "layout");
  redirect(isList(id) ? `/admin/content/${id}?removed=${encodeURIComponent(key ?? "")}` : `/admin/content/${id}?reset=1`);
}

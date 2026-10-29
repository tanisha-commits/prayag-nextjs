import { ActionForm } from "@/components/admin/action-form";
import { decideSuggestion, runAssistant } from "@/lib/admin/actions";
import { adminSuggestions } from "@/lib/admin/data";
import { aiStatus } from "@/lib/ai/provider";

export default async function AdminAi() {
  const [rows, status] = [await adminSuggestions(), aiStatus()];
  const pending = rows.filter((r) => r.status === "pending");
  return (
    <>
      <h1 className="mb-2 text-[26px] font-semibold">AI-assisted checks</h1>
      <p className="mb-2 max-w-[860px] text-[14px] text-[#5b5f66]">
        Rules-based checks run locally: duplicate item codes, incomplete published products, and category suggestions for uncategorised products
        (from verified products with the same item-code prefix). Suggestions never change data on their own; only an approved category suggestion
        assigns that category.
      </p>
      <p className="mb-5 text-[14px]">
        Language-model assistant: <b>{status.configured ? `configured (${status.provider}) — not wired yet` : "not configured"}</b>. Drafting descriptions or SEO
        text needs <code>PRAYAG_AI_PROVIDER</code> / <code>PRAYAG_AI_API_KEY</code> (server-side) and an adapter in <code>src/lib/ai/provider.ts</code>.
      </p>
      <ActionForm action={runAssistant} submitLabel="Run checks" />
      <h2 className="mt-8 mb-3 text-[18px] font-semibold">Waiting for a decision ({pending.length})</h2>
      <ul className="m-0 flex list-none flex-col gap-2 p-0">
        {pending.map((s) => (
          <li key={s.id} className="rounded-[8px] bg-white p-3 text-[14px] shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
            <div className="mb-1"><b>{s.kind}</b> — {s.basis}</div>
            <div className="mb-2 font-mono text-[12px] break-words text-[#5b5f66]">{JSON.stringify(s.proposal).slice(0, 400)}</div>
            <div className="flex gap-2">
              <ActionForm action={decideSuggestion} submitLabel="Approve"><input type="hidden" name="id" value={s.id} /><input type="hidden" name="decision" value="approved" /></ActionForm>
              <ActionForm action={decideSuggestion} submitLabel="Reject"><input type="hidden" name="id" value={s.id} /><input type="hidden" name="decision" value="rejected" /></ActionForm>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

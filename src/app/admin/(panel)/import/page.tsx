import { ActionForm } from "@/components/admin/action-form";
import { applyImport, previewImport } from "@/lib/admin/actions";
import { adminImportRuns } from "@/lib/admin/data";

const ORDER = ["category", "new", "pending", "review", "unchanged", "skip"];

export default async function AdminImport() {
  const { runs, latest, changes } = await adminImportRuns();
  const groups = ORDER.map((a) => [a, changes.filter((c) => c.action === a)] as const).filter(([, l]) => l.length);
  return (
    <>
      <h1 className="mb-2 text-[26px] font-semibold">Import from the Google Sheet</h1>
      <p className="mb-6 max-w-[860px] text-[14px] text-[#5b5f66]">
        Reconciles <code>data/catalog/sheet-tabs.json</code> with the catalog. A preview writes nothing. Applying changes only verified mappings
        (category / series / collection / type) and adds new products as drafts, after a database backup, in one transaction. Label decisions live
        in <code>src/content/prayag/catalog/label-mappings.json</code>; the full report is in <code>data/catalog/reports/</code>.
      </p>
      <ActionForm action={previewImport} submitLabel="Run new preview" />
      {latest && (
        <section className="mt-8 rounded-[10px] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
          <h2 className="mt-0 text-[18px] font-semibold">Run {latest.id} — {latest.status}</h2>
          <p className="text-[14px]">{Object.entries(latest.summary).map(([k, v]) => `${k}: ${v}`).join(" · ")}</p>
          {latest.status === "preview" && (
            <ActionForm action={applyImport} submitLabel="Apply verified changes" className="my-4 rounded-[8px] border border-[#f0c36d] bg-[#fff8e6] p-4">
              <input type="hidden" name="runId" value={latest.id} />
              <label className="flex flex-col gap-1 text-[14px]">
                Type APPLY to apply {latest.summary.category ?? 0} mapping update(s) and add {latest.summary.new ?? 0} draft product(s):
                <input name="confirm" autoComplete="off" className="h-9 w-40 rounded-[6px] border border-[#d1d5db] px-2" />
              </label>
            </ActionForm>
          )}
          {groups.map(([action, list]) => (
            <details key={action} className="mt-3">
              <summary className="cursor-pointer text-[15px] font-medium">{action} ({list.length})</summary>
              <table className="mt-2 w-full border-collapse text-[13px]">
                <tbody>
                  {list.slice(0, 500).map((c) => (
                    <tr key={c.id} className="border-b border-[#f0f0f0]">
                      <td className="py-1 pr-3 whitespace-nowrap">{c.sourceRef}</td>
                      <td className="py-1 pr-3">{c.itemCode ?? "—"}</td>
                      <td className="py-1">{c.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </details>
          ))}
        </section>
      )}
      <h2 className="mt-8 mb-2 text-[16px] font-semibold">Earlier runs</h2>
      <ul className="m-0 list-none p-0 text-[13px]">
        {runs.map((r) => (
          <li key={r.id} className="border-b border-[#e5e7eb] py-1.5">
            Run {r.id} · {r.status} · {r.actor} · {r.createdAt.toLocaleString("en-IN")}{r.backupPath ? ` · backup ${r.backupPath.split("/").pop()}` : ""}
          </li>
        ))}
      </ul>
    </>
  );
}

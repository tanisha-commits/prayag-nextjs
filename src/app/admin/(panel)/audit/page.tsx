import { adminAudit } from "@/lib/admin/data";

export default async function AdminAudit() {
  const rows = await adminAudit();
  return (
    <>
      <h1 className="mb-6 text-[26px] font-semibold">Audit log</h1>
      <table className="w-full border-collapse rounded-[10px] bg-white text-[13px] shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
        <thead>
          <tr className="border-b border-[#e5e7eb] text-left text-[#5b5f66]">
            <th className="p-2">When</th><th className="p-2">Who</th><th className="p-2">Action</th><th className="p-2">Entity</th><th className="p-2">Change</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-b border-[#f0f0f0] align-top">
              <td className="p-2 whitespace-nowrap">{r.at.toLocaleString("en-IN")}</td>
              <td className="p-2">{r.actor}</td>
              <td className="p-2">{r.action}</td>
              <td className="p-2">{r.entity} {r.entityId.slice(0, 8)}</td>
              <td className="max-w-[520px] p-2 font-mono text-[12px] break-words text-[#5b5f66]">{r.after ? JSON.stringify(r.after).slice(0, 300) : ""}</td>
            </tr>
          ))}
          {rows.length === 0 && <tr><td colSpan={5} className="p-4 text-[#5b5f66]">Nothing recorded yet.</td></tr>}
        </tbody>
      </table>
    </>
  );
}

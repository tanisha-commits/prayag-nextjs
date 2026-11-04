import type { Metadata } from "next";
import Link from "next/link";
import { LISTS, SINGLETONS, type SingletonId } from "@/lib/content/schemas";
import { readList, readSingleton } from "@/lib/content/store";
import { withBasePath } from "@/lib/base-path";

export const metadata: Metadata = { title: "Content" };
export const dynamic = "force-dynamic";

const GROUPS: [string, string][] = [
  ["site", "Site-wide"],
  ["home", "Homepage"],
  ["pages", "Pages"],
];

const when = (ms?: number) => (ms ? new Date(ms).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "");

export default function AdminContent() {
  const ids = Object.keys(SINGLETONS) as SingletonId[];
  const posts = readList("blog");
  const edited = posts.filter((p) => p.source === "saved").length;
  return (
    <>
      <h1 className="mb-2 text-[26px] font-semibold">Content</h1>
      <p className="mt-0 mb-6 max-w-[760px] text-[14px] text-[#5b5f66]">
        Text, images and links of the site. Entries nobody has edited show the content the site launched with
        (&ldquo;built-in&rdquo;). Every save is validated and recorded in the audit log. Claude can edit the same content
        through the local MCP server (see docs/content/README.md).
      </p>
      {GROUPS.map(([group, title]) => (
        <section key={group} className="mb-6 rounded-[10px] bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
          <h2 className="mt-0 mb-3 text-[16px] font-semibold">{title}</h2>
          <ul className="m-0 grid list-none gap-1 p-0">
            {ids
              .filter((id) => id.startsWith(`${group}/`))
              .map((id) => {
                const r = readSingleton(id);
                return (
                  <li key={id} className="flex flex-wrap items-baseline gap-x-3 border-b border-[#f0f1f3] py-2 last:border-0">
                    <Link href={`/admin/content/${id}`} className="text-[14px] font-medium text-[#007ac3]">{SINGLETONS[id].title}</Link>
                    <span className="text-[13px] text-[#5b5f66]">{SINGLETONS[id].description}</span>
                    <span className="ml-auto text-[12px] text-[#888]">{r.source === "saved" ? `edited ${when(r.updatedAt)} by ${r.updatedBy}` : "built-in"}</span>
                  </li>
                );
              })}
          </ul>
        </section>
      ))}
      <section className="mb-6 rounded-[10px] bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
        <h2 className="mt-0 mb-1 text-[16px] font-semibold">{LISTS.blog.title}</h2>
        <p className="mt-0 mb-3 text-[13px] text-[#5b5f66]">{posts.length} posts · {edited} added or edited here</p>
        <div className="flex gap-3">
          <Link href="/admin/content/blog" className="text-[14px] font-medium text-[#007ac3]">All posts</Link>
          <Link href="/admin/content/blog/new" className="text-[14px] font-medium text-[#007ac3]">+ New post</Link>
        </div>
      </section>
      <section className="rounded-[10px] bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
        <h2 className="mt-0 mb-1 text-[16px] font-semibold">Export</h2>
        <p className="mt-0 mb-3 text-[13px] text-[#5b5f66]">
          Download every edited entry as JSON, e.g. to bring edits made on the live site into a local copy
          (<code>npm run content:import &lt;file&gt;</code>; newer edits win).
        </p>
        <a href={withBasePath("/admin/content/export")} className="text-[14px] font-medium text-[#007ac3]" download>Download content.json</a>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LISTS, isList } from "@/lib/content/schemas";
import { readList } from "@/lib/content/store";
import { withBasePath } from "@/lib/base-path";

export const metadata: Metadata = { title: "Blog posts" };
export const dynamic = "force-dynamic";

export default async function AdminContentList({ params, searchParams }: PageProps<"/admin/content/[collection]">) {
  const { collection } = await params;
  if (!isList(collection)) notFound();
  const { removed, q } = await searchParams;
  const term = typeof q === "string" ? q.trim().toLowerCase() : "";
  const posts = readList(collection)
    .sort((a, b) => b.data.timestamp - a.data.timestamp)
    .filter((p) => !term || p.key.includes(term) || p.data.title.toLowerCase().includes(term));
  return (
    <>
      <p className="mt-0 mb-2 text-[13px]"><Link href="/admin/content" className="text-[#007ac3]">← Content</Link></p>
      <div className="mb-4 flex flex-wrap items-center gap-4">
        <h1 className="m-0 text-[26px] font-semibold">{LISTS[collection].title}</h1>
        <Link href={`/admin/content/${collection}/new`} className="rounded-[8px] bg-black px-4 py-2 text-[14px] font-medium text-white">+ New post</Link>
        <Link href={`/admin/content/${collection}/import`} className="rounded-[8px] border border-[#d1d5db] bg-white px-4 py-2 text-[14px] font-medium">Import .md files</Link>
        <form className="ml-auto">
          <input name="q" defaultValue={term} placeholder="Search title or slug" className="h-9 w-[260px] rounded-[6px] border border-[#d1d5db] bg-white px-2 text-[13px]" aria-label="Search posts" />
        </form>
      </div>
      {typeof removed === "string" && <p className="mb-4 rounded-[8px] bg-[#e7f6ec] px-3 py-2 text-[14px] text-[#1e7d3a]">Removed /{removed}.</p>}
      <ul className="m-0 list-none rounded-[10px] bg-white p-0 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
        {posts.map((p) => (
          <li key={p.key} className="flex items-center gap-3 border-b border-[#f0f1f3] px-4 py-2.5 last:border-0">
            {/* eslint-disable-next-line @next/next/no-img-element -- admin list thumbnail */}
            <img src={/^https?:/.test(p.data.bannerImage) ? p.data.bannerImage : withBasePath(p.data.bannerImage)} alt="" loading="lazy" className="h-12 w-20 shrink-0 rounded-[6px] bg-[#f3f4f6] object-cover" />
            <div className="min-w-0 flex-1">
              <Link href={`/admin/content/${collection}/${p.key}`} className="block truncate text-[14px] font-medium text-[#007ac3]">{p.data.title}</Link>
              <span className="text-[12px] text-[#5b5f66]">/{p.key} · {p.data.published}</span>
            </div>
            <span className="shrink-0 text-[12px] text-[#888]">{p.source === "saved" ? `edited by ${p.updatedBy}` : "built-in"}</span>
            <a href={withBasePath(`/${p.key}`)} target="_blank" rel="noopener noreferrer" className="shrink-0 text-[12px] text-[#007ac3]" aria-label={`View ${p.data.title} on the site`}>View ↗</a>
          </li>
        ))}
        {!posts.length && <li className="px-4 py-3 text-[14px] text-[#5b5f66]">No posts match.</li>}
      </ul>
    </>
  );
}

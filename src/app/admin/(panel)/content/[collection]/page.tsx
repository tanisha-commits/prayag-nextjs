import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SITE_PAGES } from "@/lib/content/page-registry";
import { LISTS, isList } from "@/lib/content/schemas";
import { readList } from "@/lib/content/store";
import { withBasePath } from "@/lib/base-path";

export const metadata: Metadata = { title: "Content" };
export const dynamic = "force-dynamic";

const card = "m-0 list-none rounded-[10px] bg-white p-0 shadow-[0_1px_3px_rgba(0,0,0,0.06)]";
const row = "flex items-center gap-3 border-b border-[#f0f1f3] px-4 py-2.5 last:border-0";
const btn = "rounded-[8px] px-4 py-2 text-[14px] font-medium";
const thumb = (src: string) => (/^https?:/.test(src) ? src : withBasePath(src));

export default async function AdminContentList({ params, searchParams }: PageProps<"/admin/content/[collection]">) {
  const { collection } = await params;
  if (!isList(collection)) notFound();
  const { removed, q } = await searchParams;
  const term = typeof q === "string" ? q.trim().toLowerCase() : "";
  const header = (actions?: React.ReactNode) => (
    <>
      <p className="mt-0 mb-2 text-[13px]"><Link href="/admin/content" className="text-[#007ac3]">← Content</Link></p>
      <div className="mb-2 flex flex-wrap items-center gap-3">
        <h1 className="m-0 text-[26px] font-semibold">{LISTS[collection].title}</h1>
        {actions}
        <form className="ml-auto">
          <input name="q" defaultValue={term} placeholder="Search" className="h-9 w-[240px] rounded-[6px] border border-[#d1d5db] bg-white px-2 text-[13px]" aria-label="Search" />
        </form>
      </div>
      <p className="mt-0 mb-4 max-w-[760px] text-[14px] text-[#5b5f66]">{LISTS[collection].description}</p>
      {typeof removed === "string" && <p className="mb-4 rounded-[8px] bg-[#e7f6ec] px-3 py-2 text-[14px] text-[#1e7d3a]">Removed /{removed}.</p>}
    </>
  );

  if (collection === "page-content") {
    const saved = new Map(readList("page-content").map((e) => [e.key, e]));
    const pages = SITE_PAGES.filter((p) => !term || p.title.toLowerCase().includes(term) || p.slug.includes(term));
    const groups = [...new Set(pages.map((p) => p.group))];
    return (
      <>
        {header()}
        {groups.map((g) => (
          <section key={g} className="mb-5">
            <h2 className="mb-2 text-[15px] font-semibold text-[#333]">{g}</h2>
            <ul className={card}>
              {pages.filter((p) => p.group === g).map((p) => {
                const e = saved.get(p.slug)?.data;
                const n = e?.sections.length ?? 0;
                return (
                  <li key={p.slug} className={row}>
                    <div className="min-w-0 flex-1">
                      <Link href={`/admin/content/page-content/${p.slug}`} className="text-[14px] font-medium text-[#007ac3] hover:underline">{p.title}</Link>
                      <span className="ml-2 text-[12px] text-[#5b5f66]">{p.path}</span>
                    </div>
                    {n > 0 && <span className="rounded-full bg-[#e7f1fb] px-2.5 py-0.5 text-[12px] text-[#0b5a91]">{n} section{n === 1 ? "" : "s"}</span>}
                    {(e?.seoTitle || e?.seoDescription) && <span className="rounded-full bg-[#efe7fb] px-2.5 py-0.5 text-[12px] text-[#5b2a91]">SEO</span>}
                    <a href={withBasePath(p.path)} target="_blank" rel="noopener noreferrer" className="text-[12px] text-[#007ac3]">View ↗</a>
                    <Link href={`/admin/content/page-content/${p.slug}`} className="rounded-[6px] border border-[#d1d5db] px-3 py-1 text-[13px] hover:bg-[#f3f4f6]">Edit</Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </>
    );
  }

  const actions = (
    <>
      <Link href={`/admin/content/${collection}/new`} className={`${btn} bg-black text-white`}>+ New {collection === "blog" ? "post" : "page"}</Link>
      <Link href={`/admin/content/${collection}/import`} className={`${btn} border border-[#d1d5db] bg-white`}>Import .md files</Link>
    </>
  );

  if (collection === "custom-pages") {
    const pages = readList("custom-pages").filter((p) => !term || p.key.includes(term) || p.data.title.toLowerCase().includes(term));
    return (
      <>
        {header(actions)}
        <ul className={card}>
          {pages.map((p) => (
            <li key={p.key} className={row}>
              {p.data.bannerImage ? (
                // eslint-disable-next-line @next/next/no-img-element -- admin list thumbnail
                <img src={thumb(p.data.bannerImage)} alt="" loading="lazy" className="h-12 w-20 shrink-0 rounded-[6px] bg-[#f3f4f6] object-cover" />
              ) : (
                <span className="grid h-12 w-20 shrink-0 place-items-center rounded-[6px] bg-[#111] text-[11px] text-white">Page</span>
              )}
              <div className="min-w-0 flex-1">
                <Link href={`/admin/content/custom-pages/${p.key}`} className="block truncate text-[14px] font-medium text-[#007ac3]">{p.data.title}</Link>
                <span className="text-[12px] text-[#5b5f66]">/{p.key} · edited by {p.updatedBy}</span>
              </div>
              <a href={withBasePath(`/${p.key}`)} target="_blank" rel="noopener noreferrer" className="shrink-0 text-[12px] text-[#007ac3]">View ↗</a>
            </li>
          ))}
          {!pages.length && <li className="px-4 py-6 text-[14px] text-[#5b5f66]">No custom pages yet. Create one, or import a .md file.</li>}
        </ul>
      </>
    );
  }

  const posts = readList("blog")
    .sort((a, b) => b.data.timestamp - a.data.timestamp)
    .filter((p) => !term || p.key.includes(term) || p.data.title.toLowerCase().includes(term));
  return (
    <>
      {header(actions)}
      <ul className={card}>
        {posts.map((p) => (
          <li key={p.key} className={row}>
            {/* eslint-disable-next-line @next/next/no-img-element -- admin list thumbnail */}
            <img src={thumb(p.data.bannerImage)} alt="" loading="lazy" className="h-12 w-20 shrink-0 rounded-[6px] bg-[#f3f4f6] object-cover" />
            <div className="min-w-0 flex-1">
              <Link href={`/admin/content/blog/${p.key}`} className="block truncate text-[14px] font-medium text-[#007ac3]">{p.data.title}</Link>
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

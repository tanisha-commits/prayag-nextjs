/** "Why choose Prayag" style list of a page's marketing points (Admin → Pages → marketing points). */
export function MarketingPoints({ heading, points }: { heading?: string; points: string[] }) {
  if (!points.length) return null;
  return (
    <section className="bg-[#f6f7f9] py-10 md:py-14">
      <div className="prayag-container">
        <div className="mx-auto max-w-[1100px]">
          <h2 className="mb-6 text-[28px] leading-9 font-medium text-black md:text-[38px] md:leading-[46px]">{heading || "Why choose Prayag"}</h2>
          <ul className="m-0 grid list-none gap-4 p-0 md:grid-cols-2">
            {points.map((p) => (
              <li key={p} className="flex gap-3 rounded-[12px] bg-white p-5 text-[16px] leading-7 text-[#333] shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
                <span aria-hidden="true" className="mt-1 grid size-6 shrink-0 place-items-center rounded-full bg-[#00aeef] text-[13px] font-bold text-white">✓</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

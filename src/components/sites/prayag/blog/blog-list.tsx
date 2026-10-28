"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import type { BlogListItem } from "@/lib/blog";

const PER_PAGE = 15; // source: PER_PAGE in the /blog inline script

type SortKey = "date_desc" | "date_asc" | "title_asc" | "title_desc";

// Source selects combine Olivero's base `select` (54px tall, chevron, 18/54px padding) with
// Bootstrap's `.form-control` border, radius and focus ring.
const selectClass =
  "block h-[54px] w-full max-w-full cursor-pointer appearance-none rounded-[0.25rem] border border-[#ced4da] bg-white bg-[url(/sites/prayag/icons/chevron-down.svg)] bg-[position:right_18px_center] bg-no-repeat py-1.5 pr-[54px] pl-[18px] text-[16px] leading-6 text-[#212529] transition-[border-color,box-shadow] duration-150 focus:border-[#86b7fe] focus:shadow-[0_0_0_0.25rem_rgba(13,110,253,0.25)] focus:outline-0";

/** Source `section.blog`: Year + Sort filters, cards revealed 15 at a time ("Read More"/"Read Less"). */
export function BlogList({ posts }: { posts: BlogListItem[] }) {
  const [year, setYear] = useState("all");
  const [sort, setSort] = useState<SortKey>("date_desc");
  const [visible, setVisible] = useState(PER_PAGE);
  const listRef = useRef<HTMLDivElement>(null);

  const years = useMemo(
    () => [...new Set(posts.map((p) => p.year))].sort((a, b) => Number(b) - Number(a)),
    [posts],
  );

  const matched = useMemo(() => {
    const filtered = posts.filter((p) => year === "all" || p.year === year);
    // The source compares lower-cased titles (data-title) with localeCompare.
    const title = (p: BlogListItem) => p.title.toLowerCase();
    return [...filtered].sort((a, b) => {
      switch (sort) {
        case "date_asc":
          return a.timestamp - b.timestamp;
        case "title_asc":
          return title(a).localeCompare(title(b));
        case "title_desc":
          return title(b).localeCompare(title(a));
        default:
          return b.timestamp - a.timestamp;
      }
    });
  }, [posts, year, sort]);

  const showAll = visible >= matched.length;

  const onReadMore = () => {
    if (showAll) {
      setVisible(PER_PAGE);
      listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      setVisible((v) => v + PER_PAGE);
    }
  };

  return (
    <section className="pt-[50px] pb-[50px] md:pt-[60px]">
      <div className="prayag-container">
        <div className="-mx-3 mb-6 flex flex-wrap">
          <div className="w-1/2 px-3 md:w-1/4">
            <label htmlFor="filterYear" className="mb-1.5 block font-semibold">
              Year
            </label>
            <select
              id="filterYear"
              value={year}
              onChange={(e) => {
                setYear(e.target.value);
                setVisible(PER_PAGE);
              }}
              className={selectClass}
            >
              <option value="all">All Years</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
          <div className="w-1/2 px-3 md:w-1/4">
            <label htmlFor="sortBy" className="mb-1.5 block font-semibold">
              Sort By
            </label>
            <select
              id="sortBy"
              value={sort}
              onChange={(e) => {
                setSort(e.target.value as SortKey);
                setVisible(PER_PAGE);
              }}
              className={selectClass}
            >
              <option value="date_desc">Newest First</option>
              <option value="date_asc">Oldest First</option>
              <option value="title_asc">A to Z</option>
              <option value="title_desc">Z to A</option>
            </select>
          </div>
        </div>

        <div ref={listRef} className="-mx-3 flex scroll-mt-24 flex-wrap" aria-live="polite">
          {matched.slice(0, visible).map((post) => (
            <div key={post.slug} className="w-full px-3 md:w-1/3">
              <article className="group mb-[50px] h-full w-[95%]">
                {/* Source: the image is always 300px tall; below 991px its box clips it to 180px. */}
                <div className="mb-[18px] h-[180px] overflow-hidden lg:h-[300px]">
                  <Link href={`/${post.slug}`} tabIndex={-1} aria-hidden="true" className="relative block h-[300px]">
                    <Image
                      src={post.image}
                      alt={post.imageAlt}
                      fill
                      sizes="(min-width: 769px) 33vw, 100vw"
                      className="object-cover transition-transform duration-[800ms] group-hover:scale-110"
                    />
                  </Link>
                </div>
                <div className="relative border-b border-[#c5bfbf] pl-[9px] before:absolute before:bottom-0 before:left-0 before:h-px before:w-0 before:bg-[#716f6f] before:transition-[width] before:duration-[800ms] before:content-[''] group-hover:before:w-full md:pl-[18px]">
                  <p className="mb-3.5 text-[18px] leading-[1.2] font-normal text-[#212529] md:text-[16px]">{post.date}</p>
                  <h2 className="mb-6 line-clamp-2 w-full text-[17px] leading-[27px] font-medium md:text-[22px] md:leading-8 min-[1400px]:w-[90%] min-[1400px]:text-[20px] min-[1400px]:leading-[30px]">
                    <Link href={`/${post.slug}`} className="text-black">
                      {post.title}
                    </Link>
                  </h2>
                </div>
              </article>
            </div>
          ))}
        </div>

        {matched.length === 0 && <p className="text-center">No blogs found for this year.</p>}

        {matched.length > PER_PAGE && (
          <div className="my-6 text-center">
            <button
              type="button"
              onClick={onReadMore}
              className="inline-block cursor-pointer rounded-3xl bg-[#40ade3] px-[35px] py-2.5 text-[16px] leading-6 text-white transition-colors hover:bg-[#2f9bd1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0d6efd]"
            >
              {showAll ? "Read Less" : "Read More"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

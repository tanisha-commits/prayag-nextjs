"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export function ProductGallery({ images, title }: { images: { src: string; alt: string }[]; title: string }) {
  const [active, setActive] = useState(0);
  if (!images.length)
    return <div className="flex aspect-square items-center justify-center rounded-[12px] bg-[#f7f9fa] text-[14px] text-[#9aa0a6]">Image coming soon</div>;
  const main = images[active] ?? images[0];
  return (
    <div className="flex flex-col-reverse gap-3 md:flex-row">
      {images.length > 1 && (
        <div className="flex gap-2 md:flex-col" aria-label="Product images">
          {images.map((img, i) => (
            <button
              key={img.src}
              type="button"
              aria-label={`Show image ${i + 1} of ${images.length}`}
              aria-current={i === active}
              onClick={() => setActive(i)}
              className={cn("size-[72px] overflow-hidden rounded-[8px] border bg-[#f7f9fa] p-1", i === active ? "border-[#007ac3]" : "border-[#e5e7eb]")}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- thumbnails of the source images */}
              <img src={img.src} alt="" className="size-full object-contain" />
            </button>
          ))}
        </div>
      )}
      <div className="flex aspect-square flex-1 items-center justify-center rounded-[12px] bg-[#f7f9fa] p-6">
        {/* eslint-disable-next-line @next/next/no-img-element -- source product images vary in size; shown as delivered */}
        <img src={main.src} alt={main.alt || title} fetchPriority="high" className="max-h-full max-w-full object-contain" />
      </div>
    </div>
  );
}

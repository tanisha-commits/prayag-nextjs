import { cn } from "@/lib/utils";
import { marqueeColumns, pageLinks } from "./data";
import { PrayagButton } from "./prayag-button";

export function ExperienceSection() {
  return (
    <section className="relative bg-black py-[50px] md:py-0">
      <div className="prayag-container">
        <div className="-mx-3 flex flex-wrap items-center">
          <div className="w-full px-3 md:w-5/12">
            <div className="mb-6 md:mb-0">
              <h2 className="mb-3.5 text-[24px] leading-8 font-medium text-white md:mb-[18px] md:text-[52px] md:leading-[62px]">
                Experience Prayag
              </h2>
              <p className="mb-12 w-[85%] text-[15px] leading-[25px] text-white md:text-[18px] md:leading-7">
                Every single day of your life, we at Prayag, desire to give you that feeling of contentment,
                satisfaction, and joy, by using our meticulously crafted products that have been designed with
                only you in mind.
              </p>
              <PrayagButton href={pageLinks.manufacturing} className="border border-white">
                Explore Products
              </PrayagButton>
            </div>
          </div>
          <div className="w-full px-3 md:w-7/12">
            <div className="-mx-3 flex flex-wrap">
              <MarqueeColumn images={marqueeColumns.up} direction="up" />
              <MarqueeColumn images={marqueeColumns.down} direction="down" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MarqueeColumn({
  images,
  direction,
}: {
  images: { src: string; alt: string }[];
  direction: "up" | "down";
}) {
  return (
    <div className="w-1/2 px-3">
      <div className="relative h-[370px] overflow-hidden md:h-[700px]">
        <div
          className={cn(
            "flex flex-col motion-reduce:animate-none",
            direction === "up"
              ? "animate-[prayag-scroll-up_20s_linear_infinite]"
              : "animate-[prayag-scroll-down_20s_linear_infinite]",
          )}
        >
          {[0, 1].map((copy) => (
            <div key={copy} className="flex flex-col" aria-hidden={copy === 1}>
              {images.map((img) => (
                // eslint-disable-next-line @next/next/no-img-element -- marquee keeps natural image ratios
                <img key={img.src} src={img.src} alt={copy === 1 ? "" : img.alt} className="mb-6 block h-auto w-full" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

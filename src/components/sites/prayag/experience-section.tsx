import { cn } from "@/lib/utils";
import { getContent } from "@/lib/content";
import { PrayagButton } from "./prayag-button";
import { img as responsive } from "@/lib/image-dimensions";

export function ExperienceSection() {
  const { heading, text, buttonLabel, buttonHref, up, down } = getContent("home/experience");
  return (
    <section className="relative bg-black py-[50px] md:py-0">
      <div className="prayag-container">
        <div className="-mx-3 flex flex-wrap items-center">
          <div className="w-full px-3 md:w-5/12">
            <div className="mb-6 md:mb-0">
              <h2 className="mb-3.5 text-[24px] leading-8 font-medium text-white md:mb-[18px] min-[768px]:text-[38px] min-[768px]:leading-[46px] min-[1400px]:text-[52px] min-[1400px]:leading-[62px]">
                {heading}
              </h2>
              <p className="mb-12 w-[85%] text-[15px] leading-[25px] text-white min-[768px]:text-[16px] min-[768px]:leading-6 min-[1400px]:text-[18px] min-[1400px]:leading-7">
                {text}
              </p>
              <PrayagButton href={buttonHref} className="border border-white">
                {buttonLabel}
              </PrayagButton>
            </div>
          </div>
          <div className="w-full px-3 md:w-7/12">
            <div className="-mx-3 flex flex-wrap">
              <MarqueeColumn images={up} direction="up" />
              <MarqueeColumn images={down} direction="down" />
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
                <img key={img.src} {...responsive(img.src, "auto, (min-width: 769px) 30vw, 50vw")} alt={copy === 1 ? "" : img.alt} loading="lazy" className="mb-6 block h-auto w-full" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

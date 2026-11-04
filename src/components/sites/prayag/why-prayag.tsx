import { pageLinks, whyImages, whyPoints } from "./data";
import { PrayagButton } from "./prayag-button";
import { withBasePath } from "@/lib/base-path";
import { img } from "@/lib/image-dimensions";

export function WhyPrayag() {
  return (
    <section className="relative bg-white py-[50px] md:py-[60px]">
      <div className="prayag-container overflow-hidden">
        <div className="-mx-3 flex flex-wrap">
          <div className="w-full px-3 md:w-1/2">
            {/* eslint-disable-next-line @next/next/no-img-element -- natural-ratio editorial image */}
            <img {...img(whyImages.top, "auto, (min-width: 769px) 50vw, 100vw")} alt="" loading="lazy" className="h-auto w-full max-lg:object-cover" />
            <div className="pt-10 pr-5 pl-2.5 lg:pr-[50px] lg:pl-10 xl:pt-[50px] xl:pr-20 xl:pl-[50px]">
              <h2 className="mb-[30px] text-[30px] leading-10 font-medium text-black sm:text-[36px] sm:leading-[42px] lg:mb-12 min-[992px]:text-[38px] min-[992px]:leading-[46px] min-[1400px]:text-[52px] min-[1400px]:leading-[62px]">
                Why Prayag
              </h2>
              <ul>
                {whyPoints.map((point) => (
                  <li key={point.title}>
                    <div className="mb-6 flex">
                      <div className="mr-[15px] w-[35px] shrink-0 md:w-[50px]">
                        {/* eslint-disable-next-line @next/next/no-img-element -- 50px source icon */}
                        <img src={withBasePath(point.icon)} alt="" width={50} height={50} loading="lazy" className="max-w-full" />
                      </div>
                      <div className="w-[calc(100%-65px)]">
                        <h3 className="mb-2 text-[22px] leading-[1.4] font-medium text-black">{point.title}</h3>
                        <p className="mb-4 text-[14px] leading-[25px] text-[#555] min-[768px]:text-[16px] min-[768px]:leading-6 min-[1400px]:text-[18px] min-[1400px]:leading-7">
                          {point.text}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <PrayagButton href={pageLinks.manufacturing} className="[text-shadow:0_0_4px_#000]" label="Know More about our manufacturing process">
                Know More
              </PrayagButton>
            </div>
          </div>
          <div className="w-full px-3 md:w-1/2">
            <div className="relative text-right md:top-[150px]">
              {/* eslint-disable-next-line @next/next/no-img-element -- natural-ratio editorial image */}
              <img
                {...img(whyImages.side, "auto, 45vw")}
                alt=""
                loading="lazy"
                className="ml-auto hidden h-[350px] w-[90%] object-cover md:inline lg:h-auto lg:w-[85%]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

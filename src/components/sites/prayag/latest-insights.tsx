import { insights, pageLinks } from "./data";
import { ArrowIcon } from "./icons";

export function LatestInsights() {
  return (
    <section className="relative bg-[rgba(221,221,221,0.47)] py-[50px] md:py-[60px]">
      <div className="prayag-container">
        <div className="-mx-3 flex flex-wrap items-start">
          <div className="w-full px-3 md:w-1/2">
            <h2 className="mb-12 text-[28px] leading-[38px] font-medium text-black md:text-[30px] md:leading-[41px] lg:text-[52px] lg:leading-[62px]">
              Our Latest Insights
            </h2>
          </div>
          <div className="hidden w-full px-3 text-right md:block md:w-1/2">
            <a
              href={pageLinks.blog}
              className="relative mt-5 inline-block max-w-full rounded-[28px] border border-black bg-black px-7 py-3 text-[18px] leading-6 font-medium text-white transition-all duration-500 hover:-translate-y-0.5 hover:bg-[linear-gradient(135deg,#0056b3,#004085)] hover:!text-white xl:mt-8"
            >
              <ArrowIcon className="mr-2 inline-block align-middle" />
              View all Insights
            </a>
          </div>
        </div>
        <div className="-mx-3 flex flex-wrap">
          {insights.map((post) => (
            <div key={post.href} className="mb-[30px] w-full px-3 last:mb-0 sm:w-1/2 md:mb-0 md:w-1/3">
              <a href={post.href} className="group block text-black">
                <div className="mb-[18px] h-[180px] overflow-hidden lg:h-[300px]">
                  {/* eslint-disable-next-line @next/next/no-img-element -- fixed-height cover image */}
                  <img
                    src={post.src}
                    alt={post.alt}
                    loading="lazy"
                    className="h-[300px] w-full object-cover transition-transform duration-[800ms] group-hover:scale-[1.2]"
                  />
                </div>
                <h3 className="mr-[13px] mb-0 text-[18px] leading-7 font-medium text-black lg:mr-0 lg:text-[20px]">
                  {post.title}
                </h3>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

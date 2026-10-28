import { customerServiceImage, pageLinks, stats } from "./data";
import { PrayagButton } from "./prayag-button";

export function CustomerService() {
  return (
    <section className="relative py-[50px] md:py-[60px]">
      <div className="prayag-container">
        <div className="-mx-3 flex flex-wrap">
          <div className="mb-6 w-full px-3 md:mb-0 md:w-1/3">
            <div className="h-[350px] bg-[#f2f2f2] px-[30px] pt-[30px] pb-[15px] md:pl-10">
              {stats.map((stat) => (
                <div key={stat.label} className="mb-2.5 flex items-center md:mb-0">
                  <div className="mr-5">
                    {/* eslint-disable-next-line @next/next/no-img-element -- inline source SVG icon */}
                    <img src={stat.icon} alt="" width={stat.w} height={stat.h} />
                  </div>
                  <div>
                    <p className="mb-0 text-[15px] leading-[25px] text-[#555] md:text-[18px] md:leading-7">{stat.label}</p>
                    <h2 className="mb-3.5 text-[36px] leading-[42px] font-medium text-black md:mb-[18px] md:text-[52px] md:leading-[62px]">
                      {stat.value}
                    </h2>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mb-6 w-full px-3 md:mb-0 md:w-1/3 md:pr-0">
            <div className="bg-[#141414] p-[35px] md:h-[350px] xl:p-[50px]">
              <h3 className="mb-2 text-[28px] leading-9 font-medium text-white md:text-[30px] md:leading-[38px] xl:leading-[42px]">
                Customer Service
              </h3>
              <p className="mb-0 text-[15px] leading-[25px] text-white md:mb-[30px] md:text-[18px] md:leading-7 xl:mb-10">
                Prayag’s after-sales service guarantees fast responses, expert assistance, and hassle-free support
                for every valued customer.
              </p>
              <PrayagButton href={pageLinks.contact} className="bg-[rgba(161,152,152,0.41)] px-6 py-2.5">
                Know More
              </PrayagButton>
            </div>
          </div>
          <div className="mb-6 w-full px-3 md:mb-0 md:w-1/3 md:pl-0">
            <div className="h-[290px] md:h-[350px]">
              {/* eslint-disable-next-line @next/next/no-img-element -- fixed-height cover image */}
              <img
                src={customerServiceImage}
                alt="Customer-Service-image"
                loading="lazy"
                className="size-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

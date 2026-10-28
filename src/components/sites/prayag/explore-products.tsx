import { productTiles } from "./data";

export function ExploreProducts() {
  return (
    <section className="relative bg-[rgba(221,221,221,0.47)] py-[50px] md:py-[60px]">
      <div className="prayag-container">
        <h1 className="mb-6 text-[30px] leading-[50px] font-semibold text-black md:text-[40px]">
          Explore Our Products
        </h1>
        <div className="-mx-3 flex flex-wrap justify-center md:justify-start">
          {productTiles.map((tile) => (
            <div key={tile.label} className="w-1/2 px-3 md:w-1/3">
              <a href={tile.href} className="group block">
                <div className="relative z-[9] mb-6 overflow-hidden before:absolute before:bottom-0 before:z-[1] before:h-full before:w-full before:bg-[linear-gradient(359deg,rgba(24,24,24,0.51),rgba(0,0,0,0))] before:content-['']">
                  <div className="relative h-[132px] w-full md:h-auto">
                    {/* eslint-disable-next-line @next/next/no-img-element -- tile keeps the source image's natural ratio on desktop */}
                    <img
                      src={tile.src}
                      alt={tile.alt}
                      className="block size-full object-cover transition-transform duration-500 group-hover:scale-[1.2] md:h-auto"
                    />
                  </div>
                  <span className="absolute bottom-2 left-1 z-[2] mx-auto block w-[95%] px-[9px] py-[3px] text-center text-[12px] leading-6 font-normal text-white transition-all duration-500 md:bottom-[15px] md:left-[15px] md:w-auto md:px-[26px] md:py-0.5 md:text-left md:text-[18px] md:leading-[1.6]">
                    {tile.label}
                  </span>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

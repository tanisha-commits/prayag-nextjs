import { cn } from "@/lib/utils";

/**
 * Inner-page banner (source `.breadcrumb_main`): image left, black title panel right;
 * stacks below 769px. The source row keeps Bootstrap's -12px gutters with zero column
 * padding, so each half is 12px wider than 50% and the overflow is clipped.
 */
export function PageBanner({
  image,
  imageAlt = "",
  title,
  children,
  className,
}: {
  image: string;
  imageAlt?: string;
  title: string;
  /** Extra content under the title (e.g. blog publish date + share links). */
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("overflow-hidden", className)}>
      <div className="-mx-3 flex flex-wrap">
        <div className="w-full md:w-1/2">
          {/* eslint-disable-next-line @next/next/no-img-element -- banner keeps the source's natural ratio at >= 1200px */}
          <img
            src={image}
            alt={imageAlt}
            fetchPriority="high"
            className="h-[220px] w-full object-cover md:h-[280px] xl:h-auto"
          />
        </div>
        <div className="w-full md:w-1/2">
          <div className="flex size-full flex-col items-center justify-center bg-black px-0 py-[15px] text-center md:p-6">
            <h1 className="m-0 w-[70%] p-0 text-[22px] leading-8 font-medium text-white md:text-[32px] md:leading-[42px] lg:text-[36px] lg:leading-[46px] xl:text-[40px] xl:leading-[50px] min-[1920px]:w-[60%]">
              {title}
            </h1>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

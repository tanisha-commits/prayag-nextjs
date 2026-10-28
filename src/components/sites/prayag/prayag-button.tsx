import { cn } from "@/lib/utils";
import { ArrowIcon } from "./icons";

/** Source `.prayag-btn`: black pill with an arrow; lifts to a blue gradient on hover. */
export function PrayagButton({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={cn(
        "relative mt-5 inline-block max-w-full rounded-[28px] bg-black py-[13px] pr-10 pl-[35px] text-[18px] leading-6 font-medium text-white transition-all duration-500 xl:mt-8",
        "hover:-translate-y-0.5 hover:bg-[linear-gradient(135deg,#0056b3,#004085)] hover:!text-white",
        className,
      )}
    >
      <ArrowIcon className="mr-2 inline-block align-middle text-white" />
      {children}
    </a>
  );
}

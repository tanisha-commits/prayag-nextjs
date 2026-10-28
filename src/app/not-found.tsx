import type { Metadata } from "next";
import Link from "next/link";
import { CategoryPanel } from "@/components/sites/prayag/category-panel";
import { SiteFooter } from "@/components/sites/prayag/site-footer";
import { SiteHeader } from "@/components/sites/prayag/site-header";

export const metadata: Metadata = {
  title: { absolute: "Page not found | Prayag" },
  robots: { index: false },
};

// The source answers unknown URLs with HTTP 200 and a copy of the homepage ("soft 404").
// The clone returns a real 404 with a way back to the main sections instead.
export default function NotFound() {
  return (
    <>
      <SiteHeader variant="solid" />
      <CategoryPanel />
      <main className="bg-[rgba(221,221,221,0.47)] py-[50px] md:py-[100px]">
        <div className="prayag-container text-center">
          <p className="mb-2 text-[18px] font-medium text-[#555]">404</p>
          <h1 className="mb-4 text-[30px] leading-10 font-medium text-black md:text-[52px] md:leading-[62px]">
            Page not found
          </h1>
          <p className="mx-auto mb-8 max-w-[560px] text-[18px] leading-7 text-black">
            The page you are looking for does not exist or may have moved. If you followed a link to a blog
            article, browse the full list on our blog.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/blog"
              className="rounded-[28px] bg-black px-8 py-[13px] text-[18px] leading-6 font-medium !text-white transition-all duration-500 hover:-translate-y-0.5 hover:bg-[linear-gradient(135deg,#0056b3,#004085)]"
            >
              Browse the blog
            </Link>
            <Link
              href="/"
              className="rounded-[28px] border border-black px-8 py-[13px] text-[18px] leading-6 font-medium text-black transition-colors hover:bg-black hover:!text-white"
            >
              Go to homepage
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

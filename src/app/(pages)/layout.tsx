import { CategoryPanel } from "@/components/sites/prayag/category-panel";
import { SiteFooter } from "@/components/sites/prayag/site-footer";
import { SiteHeader } from "@/components/sites/prayag/site-header";

export default function InnerPagesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader variant="solid" />
      <CategoryPanel />
      <main>{children}</main>
      <SiteFooter />
    </>
  );
}

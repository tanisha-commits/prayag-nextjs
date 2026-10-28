import { CategoryPanel } from "@/components/sites/prayag/category-panel";
import { SiteFooter } from "@/components/sites/prayag/site-footer";
import { SiteHeader } from "@/components/sites/prayag/site-header";

// Shared chrome for inner pages (the route group does not affect URLs).
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

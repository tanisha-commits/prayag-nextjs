import { cn } from "@/lib/utils";
import "./pcat-base.css";

export function PcatPage({ slug, children }: { slug: string; children: React.ReactNode }) {
  return <div className={cn("pcat", `pcat-${slug}`)}>{children}</div>;
}

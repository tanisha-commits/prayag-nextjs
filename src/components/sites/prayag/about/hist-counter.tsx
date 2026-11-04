"use client";

import { useCountUp } from "./use-count-up";
import { Tx } from "@/components/sites/prayag/cms/tx-client";

export function HistCounter({ value, label }: { value: string; label: string }) {
  const { ref, text } = useCountUp<HTMLHeadingElement>(value);
  return (
    <div className="hist-counters__item">
      <h3 ref={ref}><Tx>{text}</Tx></h3>
      <h4><Tx>{label}</Tx></h4>
    </div>
  );
}

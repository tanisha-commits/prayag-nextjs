"use client";

import { useCountUp } from "../about/use-count-up";
import { Tx } from "@/components/sites/prayag/cms/tx-client";

export function CeoFact({ value, label, start }: { value: string; label: string; start?: number }) {
  const { ref, text } = useCountUp<HTMLElement>(value, start);
  return (
    <li>
      <strong ref={ref} className="ceo-count">
        <Tx>{text}</Tx>
      </strong>
      <span><Tx>{label}</Tx></span>
    </li>
  );
}

"use client";

import { useCountUp } from "../about/use-count-up";

export function CeoFact({ value, label, start }: { value: string; label: string; start?: number }) {
  const { ref, text } = useCountUp<HTMLElement>(value, start);
  return (
    <li>
      <strong ref={ref} className="ceo-count">
        {text}
      </strong>
      <span>{label}</span>
    </li>
  );
}

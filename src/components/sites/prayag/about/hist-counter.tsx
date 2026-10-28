"use client";

import { useCountUp } from "./use-count-up";

export function HistCounter({ value, label }: { value: string; label: string }) {
  const { ref, text } = useCountUp<HTMLHeadingElement>(value);
  return (
    <div className="hist-counters__item">
      <h3 ref={ref}>{text}</h3>
      <h4>{label}</h4>
    </div>
  );
}

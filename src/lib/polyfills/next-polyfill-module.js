// Stand-in for next/dist/build/polyfills/polyfill-module (aliased in next.config.ts, browser only).
// Next's version polyfills ES2019–2022 methods (Array#at/flat/flatMap, Object.fromEntries/hasOwn,
// String#trimStart/trimEnd, …) that every browser Next 16 supports (Chrome 111+, Safari 16.4+,
// Firefox 111+) already has natively; Lighthouse reports them as "Legacy JavaScript".
// URL.canParse is the one feature newer than that baseline (Chrome 120, Safari 17), so it stays.
if (typeof URL !== "undefined" && !("canParse" in URL)) {
  URL.canParse = function (url, base) {
    try {
      return !!new URL(url, base);
    } catch {
      return false;
    }
  };
}

"use client";

import {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

/** The subset of slick 1.8 options the product-category pages use. */
export interface SlickOptions {
  slidesToShow?: number;
  slidesToScroll?: number;
  infinite?: boolean;
  arrows?: boolean;
  dots?: boolean;
  autoplay?: boolean;
  autoplaySpeed?: number;
  /** Slide transition in ms (slick default 300). */
  speed?: number;
  /** Only applies with slidesToShow 1, as in slick. */
  adaptiveHeight?: boolean;
  swipe?: boolean;
}

export interface SlickSettings extends SlickOptions {
  /** Desktop-first like slick: a breakpoint applies while window.innerWidth < breakpoint. */
  responsive?: { breakpoint: number; settings: SlickOptions }[];
}

const DEFAULTS: Required<SlickOptions> = {
  slidesToShow: 1,
  slidesToScroll: 1,
  infinite: true,
  arrows: true,
  dots: false,
  autoplay: false,
  autoplaySpeed: 3000,
  speed: 300,
  adaptiveHeight: false,
  swipe: true,
};

// slick merges the matching breakpoint over the original settings (not cumulatively),
// choosing the smallest breakpoint that is still wider than the window.
function resolve(settings: SlickSettings, width: number | null): Required<SlickOptions> {
  const { responsive = [], ...base } = settings;
  const match =
    width === null
      ? undefined
      : [...responsive].sort((a, b) => a.breakpoint - b.breakpoint).find((r) => width < r.breakpoint);
  return { ...DEFAULTS, ...base, ...match?.settings };
}

// slick getDotCount() + 1
function pageCount(n: number, o: Required<SlickOptions>) {
  if (n <= o.slidesToShow) return 1;
  if (!o.infinite) return 1 + Math.ceil((n - o.slidesToShow) / o.slidesToScroll);
  let pages = 0;
  let breakPoint = 0;
  let counter = 0;
  while (breakPoint < n) {
    pages++;
    breakPoint = counter + o.slidesToScroll;
    counter += Math.min(o.slidesToScroll, o.slidesToShow);
  }
  return pages;
}

/**
 * React port of the slick carousel markup the source pages initialise with jQuery
 * (`.slick-slider > .slick-list > .slick-track > .slick-slide > div > item`), so the
 * ported page CSS that targets slick's classes applies unchanged. Slides are laid out
 * in measured px like slick (percentages while unmeasured), so sliders inside hidden tab panes
 * need no re-initialising.
 */
export function SlickCarousel({
  settings,
  className,
  style,
  "aria-label": ariaLabel,
  children,
}: {
  settings: SlickSettings;
  className?: string;
  style?: CSSProperties;
  "aria-label"?: string;
  children: ReactNode;
}) {
  const items = Children.toArray(children).filter(isValidElement) as ReactElement<{ style?: CSSProperties }>[];
  const n = items.length;

  const [width, setWidth] = useState<number | null>(null);
  useEffect(() => {
    const update = () => setWidth(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  const o = resolve(settings, width);

  const enabled = n > o.slidesToShow;
  const clones = enabled && o.infinite ? o.slidesToShow : 0;
  const trackCount = n + 2 * clones;

  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(true);
  const [busy, setBusy] = useState(false);
  const [drag, setDrag] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  // Keep the index valid when a breakpoint changes the layout (slick refresh keeps currentSlide).
  const current = enabled ? Math.min(Math.max(index, o.infinite ? -o.slidesToShow : 0), o.infinite ? n : n - 1) : 0;

  const goTo = (target: number) => {
    if (!enabled || busy) return;
    let to = target;
    if (!o.infinite && (to < 0 || to > (pageCount(n, o) - 1) * o.slidesToScroll)) return;
    setAnimate(true);
    setIndex(to);
    setBusy(true);
    // Infinite wrap: after sliding onto a clone, jump to the real slide without a transition.
    window.setTimeout(() => {
      if (o.infinite && (to < 0 || to >= n)) {
        if (to < 0) to = n % o.slidesToScroll !== 0 ? n - (n % o.slidesToScroll) : n + to;
        else to = n % o.slidesToScroll !== 0 ? 0 : to - n;
        setAnimate(false);
        setIndex(to);
      }
      setBusy(false);
    }, o.speed);
  };

  const next = () => goTo(current + o.slidesToScroll);
  const prev = () => goTo(current - o.slidesToScroll);

  // slick autoplay with its default pauseOnHover / pauseOnFocus; skipped for reduced motion.
  const autoplayTick = useEffectEvent(() => next());
  useEffect(() => {
    if (!o.autoplay || !enabled || hovered || focused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(autoplayTick, o.autoplaySpeed);
    return () => window.clearInterval(id);
  }, [o.autoplay, o.autoplaySpeed, enabled, hovered, focused]);

  // Re-enable the transition on the frame after a no-transition jump.
  useEffect(() => {
    if (animate) return;
    const id = requestAnimationFrame(() => setAnimate(true));
    return () => cancelAnimationFrame(id);
  }, [animate]);

  // slick sizes slides at Math.ceil(listWidth / slidesToShow) px; percentages stand in until the
  // list is measured (and while it is hidden, e.g. in an inactive tab pane, where it is 0 wide).
  const listRef = useRef<HTMLDivElement>(null);
  const [listWidth, setListWidth] = useState(0);
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const ro = new ResizeObserver(() => setListWidth(list.clientWidth));
    ro.observe(list);
    return () => ro.disconnect();
  }, []);
  const slidePx = listWidth > 0 ? Math.ceil(listWidth / o.slidesToShow) : 0;

  // adaptiveHeight: the list takes the height of the current slide.
  const [height, setHeight] = useState<number | null>(null);
  const adaptive = o.adaptiveHeight && o.slidesToShow === 1 && enabled;
  useEffect(() => {
    if (!adaptive || !listRef.current) return;
    const slide = listRef.current.querySelector<HTMLElement>(`[data-slick-index="${current}"]`);
    if (!slide) return;
    const measure = () => setHeight(slide.offsetHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(slide);
    return () => ro.disconnect();
  }, [adaptive, current, width]);

  // Swipe / mouse drag: past 1/5 of the list width moves one step (slick touchThreshold 5).
  const start = useRef<{ x: number; y: number; id: number } | null>(null);
  const moved = useRef(false);
  const onPointerDown = (e: PointerEvent) => {
    if (!enabled || !o.swipe || busy || (e.pointerType === "mouse" && e.button !== 0)) return;
    start.current = { x: e.clientX, y: e.clientY, id: e.pointerId };
    moved.current = false;
  };
  const onPointerMove = (e: PointerEvent) => {
    const s = start.current;
    if (!s || s.id !== e.pointerId) return;
    const dx = e.clientX - s.x;
    if (!moved.current) {
      if (Math.abs(dx) < 6 || Math.abs(dx) < Math.abs(e.clientY - s.y)) return;
      moved.current = true;
      listRef.current?.setPointerCapture(e.pointerId);
    }
    setAnimate(false);
    setDrag(dx);
  };
  const endDrag = (e: PointerEvent) => {
    const s = start.current;
    if (!s || s.id !== e.pointerId) return;
    start.current = null;
    if (!moved.current) return;
    const dx = e.clientX - s.x;
    const threshold = (listRef.current?.offsetWidth ?? 0) / 5;
    setAnimate(true);
    setDrag(0);
    if (dx <= -threshold) next();
    else if (dx >= threshold) prev();
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if ((e.target as HTMLElement).matches("input, textarea, select")) return;
    if (e.key === "ArrowLeft") prev();
    else if (e.key === "ArrowRight") next();
  };

  const offset = enabled ? (o.infinite ? current + clones : Math.min(current, n - o.slidesToShow)) : 0;
  const pages = pageCount(n, o);
  const activePage = Math.floor((((current % n) + n) % n) / o.slidesToScroll);
  const atStart = !o.infinite && current <= 0;
  const atEnd = !o.infinite && current >= n - o.slidesToShow;

  // slick wraps each item in two divs and gives the item width:100% + inline-block.
  const renderSlide = (item: ReactElement<{ style?: CSSProperties }>, pos: number, real: number, cloned: boolean) => {
    const active = !enabled || (pos >= offset && pos < offset + o.slidesToShow);
    return (
      <div
        key={`${cloned ? "c" : "s"}${pos}`}
        className={cn("slick-slide", cloned && "slick-cloned", !cloned && real === current && "slick-current", active && "slick-active")}
        data-slick-index={cloned ? pos - clones : real}
        aria-hidden={!active}
        inert={!active}
        style={{ width: slidePx ? slidePx : `${100 / trackCount}%` }}
      >
        <div>{cloneElement(item, { style: { ...item.props.style, width: "100%", display: "inline-block" } })}</div>
      </div>
    );
  };

  const track = [
    ...items.slice(n - clones).map((item, i) => renderSlide(item, i, n - clones + i, true)),
    ...items.map((item, i) => renderSlide(item, clones + i, i, false)),
    ...items.slice(0, clones).map((item, i) => renderSlide(item, clones + n + i, i, true)),
  ];

  const showArrows = enabled && o.arrows;
  const showDots = enabled && o.dots;

  return (
    <div
      className={cn(className, "slick-initialized slick-slider", showDots && "slick-dotted")}
      style={style}
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      onKeyDown={onKeyDown}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false);
      }}
    >
      {showArrows && (
        <button
          type="button"
          className={cn("slick-prev slick-arrow", atStart && "slick-disabled")}
          aria-label="Previous"
          aria-disabled={atStart || undefined}
          onClick={prev}
        >
          Previous
        </button>
      )}
      <div
        ref={listRef}
        className="slick-list draggable"
        style={adaptive && height !== null ? { height, transition: `height ${o.speed}ms` } : undefined}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onDragStart={(e) => e.preventDefault()}
        // A drag must not also follow the link it started on.
        onClickCapture={(e) => {
          if (moved.current) {
            e.preventDefault();
            e.stopPropagation();
            moved.current = false;
          }
        }}
      >
        <div
          className="slick-track"
          style={{
            opacity: 1,
            // slick sizes slides from slidesToShow even when there are fewer slides.
            width: slidePx ? slidePx * trackCount : `${(trackCount / o.slidesToShow) * 100}%`,
            transform: slidePx
              ? `translate3d(${-offset * slidePx + drag}px, 0, 0)`
              : `translate3d(calc(${(-offset * 100) / trackCount}% + ${drag}px), 0, 0)`,
            transition: animate && !drag ? `transform ${o.speed}ms ease` : undefined,
          }}
        >
          {track}
        </div>
      </div>
      {showArrows && (
        <button
          type="button"
          className={cn("slick-next slick-arrow", atEnd && "slick-disabled")}
          aria-label="Next"
          aria-disabled={atEnd || undefined}
          onClick={next}
        >
          Next
        </button>
      )}
      {showDots && (
        <ul className="slick-dots">
          {Array.from({ length: pages }, (_, i) => (
            <li key={i} className={cn(i === activePage && "slick-active")}>
              <button
                type="button"
                aria-label={`Go to slide ${i + 1} of ${pages}`}
                aria-current={i === activePage || undefined}
                onClick={() => goTo(i * o.slidesToScroll)}
              >
                {i + 1}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

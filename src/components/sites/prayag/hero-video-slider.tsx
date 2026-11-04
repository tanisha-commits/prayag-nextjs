import { getContent } from "@/lib/content";
import { HeroVideoSliderClient } from "./hero-video-slider-client";

/** Homepage video banners; slides come from editable content (home/hero). */
export function HeroVideoSlider() {
  const { slides } = getContent("home/hero");
  return slides.length ? <HeroVideoSliderClient slides={slides} /> : null;
}

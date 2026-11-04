import { getContent } from "@/lib/content";
import { blurPlaceholder } from "@/lib/placeholder";
import { HeroVideoSliderClient } from "./hero-video-slider-client";

/** Homepage video banners; slides come from editable content (home/hero). */
export async function HeroVideoSlider() {
  const { slides } = getContent("home/hero");
  if (!slides.length) return null;
  // Blurred previews of the first banner, painted behind it until the real image arrives.
  const [desktop, mobile] = await Promise.all([blurPlaceholder(slides[0].desktop), blurPlaceholder(slides[0].mobile)]);
  return <HeroVideoSliderClient slides={slides} placeholder={{ desktop, mobile }} />;
}
